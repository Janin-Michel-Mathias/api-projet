import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { loginValidation } from '../../handlers/validators/login-validator';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export const login = (app: Express) => {
    /**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Authentification d'un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               mdp:
 *                 type: string
 *             required:
 *               - email
 *               - mdp
 *     responses:
 *       200:
 *         description: Authentification réussie, token JWT généré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT généré pour l'utilisateur authentifié
 *       400:
 *         description: Erreur de validation des données de la requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       401:
 *         description: Identifiants invalides
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

    app.post('/login', async (req: Request, res: Response) => {
        const validation = loginValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send(validation.error.details);
            return;
        }

        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateur = await spectateurRepo.findOne({ where: { email: req.body.email } });
        if (!spectateur) {
            res.status(401).send({ error: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await compare(req.body.mdp, spectateur.mdp);
        if (!isPasswordValid) {
            res.status(401).send({ error: 'Invalid credentials' });
            return;
        }

        const token = sign({ id: spectateur.idSpectateur }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(200).send({ token });
    });
}