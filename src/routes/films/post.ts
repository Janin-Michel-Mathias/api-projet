import {Express, Request, Response} from 'express';
import { createMovieValidation } from '../../handlers/validators/film-validators';
import { AppDataSource } from '../../database/database';
import { Film } from '../../database/entities/Film';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { authAdmin } from '../../middlewares/authAdmin';


export const createMovie = (app: Express) => {
    /**
 * @openapi
 * /films:
 *   post:
 *     tags:
 *       - Films
 *     summary: Créer un nouveau film
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       201:
 *         description: Film créé avec succès
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

    app.post('/films', authAdmin, async (req: Request, res: Response) => {
        const validation = createMovieValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        let movieRequest = validation.value;

        const movieRepo = AppDataSource.getRepository(Film);

        try {
            const movieCreated = await movieRepo.save(movieRequest);
            res.status(201).send(movieCreated);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}