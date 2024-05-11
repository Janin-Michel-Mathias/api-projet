import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Tache } from '../../database/entities/Tache';
import { Film } from '../../database/entities/Film';
import { getSeanceValidation, seanceFilteringValidation, SeanceFilteringRequest } from '../../handlers/validators/seance-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { getTacheValidation } from '../../handlers/validators/tache-validation';
import { TacheUsecase } from '../../domain/tache-usecase';
import { Between, LessThan, MoreThan } from 'typeorm';


export const getSeances = (app: Express): void => {
/**
 * @openapi
 * /seances:
 *   get:
 *     tags:
 *       - Seances
 *     summary: Récupérer les séances filtrées
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de la séance au format AAAA-MM-JJ
 *       - in: query
 *         name: salle
 *         schema:
 *           type: integer
 *         description: ID de la salle où se déroule la séance
 *       - in: query
 *         name: film
 *         schema:
 *           type: integer
 *         description: ID du film projeté lors de la séance
 *     responses:
 *       200:
 *         description: Séances filtrées récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Seance'
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 * components:
 *   schemas:
 *     Seance:
 *       type: object
 *       properties:
 *         idSeance:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *         idFilm:
 *           type: integer
 *         idSalle:
 *           type: integer
 *       required:
 *         - date
 *         - idFilm
 *         - idSalle
 *       example:
 *         idSeance: 1
 *         date: "2024-05-15T12:00:00Z"
 *         idFilm: 1
 *         idSalle: 1
 */


    app.get('/seances', async (req: Request, res: Response) => {
        const validation = seanceFilteringValidation.validate({ ...req.query })
        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const movies = await getSeancesFiltered(validation.value);
        res.status(200).send(movies);
    });
}

export const getSeance = (app: Express): void => {
    /**
 * @openapi
 * /seances/{id}:
 *   get:
 *     tags:
 *       - Seances
 *     summary: Récupérer une séance par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la séance à récupérer
 *     responses:
 *       200:
 *         description: Séance récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seance'
 *       404:
 *         description: Séance non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 * components:
 *   schemas:
 *     Seance:
 *       type: object
 *       properties:
 *         idSeance:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *         idFilm:
 *           type: integer
 *         idSalle:
 *           type: integer
 *       required:
 *         - idSeance
 *         - date
 *         - idFilm
 *         - idSalle
 *       example:
 *         idSeance: 1
 *         date: "2024-05-15T12:00:00Z"
 *         idFilm: 1
 *         idSalle: 1
 */

    app.get('/seances/:id', async (req: Request, res: Response) => {
        const validation = getSeanceValidation.validate({ ...req.params })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getSeanceRequest = validation.value

        try {
            const seanceUsecase = new TacheUsecase(AppDataSource)
            const getSeance = await seanceUsecase.getTache(getSeanceRequest.id)
            if (getSeance === null) {
                res.status(404).send({ "error": `seance ${getSeanceRequest.id} not found` })
                return
            }
            res.status(200).send(getSeance)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}


const getSeancesFiltered = async (filters: SeanceFilteringRequest) => {
    let whereFilter = {};
    if(filters.film) {
        const filmRepo = AppDataSource.getRepository(Film);
        const film =  await filmRepo.findOne({where: {nom: filters.film}});
        if(film === null) {
            return null;
        }
        whereFilter = { ...whereFilter, idFilm: film.idFilm };
    }

    if(filters.dateDebut && filters.dateFin) {
        whereFilter = { ...whereFilter, dateDebut: Between(filters.dateDebut, filters.dateFin) };
    } else if(filters.dateDebut) {
        whereFilter = { ...whereFilter, dateDebut: MoreThan(filters.dateDebut) };
    } else if(filters.dateFin) {
        whereFilter = { ...whereFilter, dateDebut: LessThan(filters.dateFin) };
    }
    const repo = AppDataSource.getRepository(Tache);
    return repo.find({ where: { ...whereFilter, type: "Seance" } });
}