import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { createSpectateurValidation } from '../../handlers/validators/spectateur-validation';
import { hash } from 'bcrypt';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';

export const register = (app: Express): void => {
    /**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Enregistrement d'un nouveau spectateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpectateurRegister'
 *     responses:
 *       201:
 *         description: Spectateur enregistré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spectateur'
 *       400:
 *         description: Erreur de validation des données de la requête ou email déjà utilisé
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
 *     SpectateurRegister:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         mdp:
 *           type: string
 *       required:
 *         - email
 *         - mdp
 *
 *     Spectateur:
 *       type: object
 *       properties:
 *         // Propriétés du spectateur
 */

    app.post('/register', async (req: Request, res: Response) => {
        const validation = createSpectateurValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        let spectateurRequest = validation.value;
        spectateurRequest = { ...spectateurRequest, mdp: await hash(spectateurRequest.mdp, 10) };
        const spectateurRepo = AppDataSource.getRepository(Spectateur);

        // Verify if the email is already in use
        const spectateur = await spectateurRepo.find({ where: { email: spectateurRequest.email } });

        if (spectateur.length > 0) {
            res.status(400).send({ error: 'Email already in use' });
            return;
        }

        try {
            const spectateurCreated = await spectateurRepo.save({ ...spectateurRequest, solde: 0 });
            res.status(201).send(spectateurCreated);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}