import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Film } from '../../database/entities/Film';

export const getMovies = (app: Express):void => {
    /**
 * @openapi
 * /films:
 *   get:
 *     tags:
 *       - Films
 *     summary: Obtenir tous les films
 *     responses:
 *       200:
 *         description: Liste des films récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
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
 */

    app.get('/films', async (req: Request, res: Response) => {
        // get all movies:
        const movieRepo = AppDataSource.getRepository(Film);
        const movies = await movieRepo.find();
        res.status(200).send(movies);
    });
}