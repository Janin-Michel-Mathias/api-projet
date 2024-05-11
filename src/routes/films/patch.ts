import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Film } from '../../database/entities/Film';
import { updateMovieValidation } from '../../handlers/validators/film-validators';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { authAdmin } from '../../middlewares/authAdmin';

export const updateMovies = (app: Express):void => {
/**
 * @openapi
 * /films/{id}:
 *   patch:
 *     tags:
 *       - Films
 *     summary: Mettre à jour un film par son identifiant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du film à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FilmUpdate'
 *     responses:
 *       200:
 *         description: Film mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       404:
 *         description: Film non trouvé
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
 *
 * components:
 *   schemas:
 *     FilmUpdate:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         duree:
 *           type: number
 *         type:
 *           type: string
 *         description:
 *           type: string
 *       required:
 *         - nom
 *
 *     Film:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         duree:
 *           type: number
 *         type:
 *           type: string
 *         description:
 *           type: string
 */


    app.patch('/films/:id', authAdmin, async (req: Request, res: Response) => {
        const params = {...req.body,  idFilm: parseInt(req.params.id) };
        const validation = updateMovieValidation.validate(params);
        if (validation.error) {
            res.status(400).send({ error: generateValidationErrorMessage(validation.error.details) });
            return;
        }
        const movieRepo = AppDataSource.getRepository(Film);
        const movie = await movieRepo.findOneBy({ idFilm: params.id });
        if (!movie) {
            res.status(404).send({ error: 'Movie not found' });
            return;
        }

        const movieRequest = validation.value;
        if(movieRequest.nom) movie.nom = movieRequest.nom;
        if(movieRequest.duree) movie.duree = movieRequest.duree;
        if(movieRequest.type) movie.type = movieRequest.type;
        if(movieRequest.description) movie.description = movieRequest.description;

        try {
            await movieRepo.save(movie);
            res.status(200).send(movie);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}