import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Salle } from '../../database/entities/Salle';
import { getSalleValidation } from '../../handlers/validators/salle-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { SalleUsecase } from '../../domain/salle-usecase';
import { authAdmin } from '../../middlewares/authAdmin';

export const getSalles = (app: Express):void => {
/**
 * @openapi
 * /salles:
 *   get:
 *     tags:
 *       - Salles
 *     summary: Récupérer toutes les salles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des salles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salle'
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
 *     Salle:
 *       type: object
 *       properties:
 *         idSalle:
 *           type: number
 *           format: int64
 *         nom:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: string
 *         capacite:
 *           type: number
 *           format: int32
 *         accesHandicap:
 *           type: boolean
 *         etat:
 *           type: string
 *       required:
 *         - nom
 *         - description
 *         - images
 *         - capacite
 *         - accesHandicap
 *         - etat
 *       example:
 *         idSalle: 1
 *         nom: "Salle 1"
 *         description: "Description de la salle 1"
 *         images: "image.jpg"
 *         capacite: 50
 *         accesHandicap: true
 *         etat: "Disponible"
 */


    app.get('/salles', authAdmin, async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Salle)
        const salles = await repo.find()
        res.status(200).send(salles);
    });
}

export const getSalle = (app: Express):void => {
    app.get('/salles/:id', authAdmin, async(req: Request, res: Response) => {
        const validation = getSalleValidation.validate({...req.params})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getSalleRequest = validation.value

        try {
            const salleUsecase = new SalleUsecase(AppDataSource)
            const getSalle = await salleUsecase.getSalle(getSalleRequest.id)
            if (getSalle === null) {
                res.status(404).send({"error": `salle ${getSalleRequest.id} not found`})
                return
            }
            res.status(200).send(getSalle)

        } catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error"})
        }
    })
}