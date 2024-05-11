import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Film } from '../../database/entities/Film';
import { authAdmin } from '../../middlewares/authAdmin';


export const deleteMovies = (app: Express):void => {
    /**
 * @openapi
 * /films/{id}:
 *   delete:
 *     tags:
 *       - Films
 *     summary: Supprimer un film par son identifiant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du film à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Film supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
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
 */

    app.delete('/films/:id', authAdmin, async (req: Request, res: Response) => {
        const movieRepo = AppDataSource.getRepository(Film);
        const movie = await movieRepo.findOneBy({ idFilm: parseInt(req.params.id) });
        if (!movie) {
            res.status(404).send({ error: 'Movie not found' });
            return;
        }
        try {
            await movieRepo.delete(movie);
            res.status(200).send(movie);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}