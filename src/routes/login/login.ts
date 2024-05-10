import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { loginValidation } from '../../handlers/validators/login-validator';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export const login = (app: Express) => {
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