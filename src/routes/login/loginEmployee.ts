import { Express, Request, Response } from "express";
import { loginValidation } from "../../handlers/validators/login-validator";
import { Employe } from "../../database/entities/Employe";
import { AppDataSource } from "../../database/database";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";


export const loginEmployee = (app: Express) => {
    app.post('/admin/login', async (req: Request, res: Response) => {
        const validation = loginValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(validation.error.details);
            return;
        }
        const employeRepo = AppDataSource.getRepository(Employe);
        const employe = await employeRepo.findOne({ where: { email: req.body.email } });
        if (!employe) {
            res.status(401).send({ error: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await compare(req.body.mdp, employe.mdp);
        if (!isPasswordValid) {
            res.status(401).send({ error: 'Invalid credentials' });
            return;
        }

        const token = sign({ id: employe.idEmploye }, process.env.JWT_SECRET_ADMIN || 'secretadmin', { expiresIn: '1h' });
        res.status(200).send({ token });
    });
}