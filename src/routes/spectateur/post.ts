import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { createSpectateurValidation } from '../../handlers/validators/spectateur-validation';
import { hash } from 'bcrypt';

export const createSpectateur = (app: Express) => {
    /**
 * Handles the creation of a new Spectateur entity in the database.
 * 
 * @openapi
 * 
 * /spectateurs:
 *   post:
 *     tags:
 *      - Spectateurs
 *     summary: Create a new Spectateur
 *     description: Creates a new Spectateur entity in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpectateurCreate'
 *     responses:
 *       '201':
 *         description: Successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spectateur'
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '500':
 *         description: Internal server error.
 * 
 * @param {Request} req - The request object containing the Spectateur data in the body.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {Response} The HTTP response indicating success or failure of the operation.
 */
    app.post('/spectateurs', async (req: Request, res: Response) => {
        const validation = createSpectateurValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send(validation.error.details);
            return;
        }

        let spectateurRequest = validation.value;
        spectateurRequest = {...spectateurRequest, mdp: await hash(spectateurRequest.mdp, 10)};
        const spectateurRepo = AppDataSource.getRepository(Spectateur);

        try {
            const spectateurCreated = await spectateurRepo.save({...spectateurRequest, solde: 0});
            res.status(201).send(spectateurCreated);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}