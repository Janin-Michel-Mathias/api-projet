import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Employe } from '../../database/entities/Employe';
import { createEmployeValidation } from '../../handlers/validators/employe-validators';
import { hash } from 'bcrypt';
import { authAdmin } from '../../middlewares/authAdmin';

export const createEmploye = (app: Express) => {
    app.post('/employes', authAdmin, async (req: Request, res: Response) => {
        const validation = createEmployeValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send(validation.error.details);
            return;
        }

        let employeRequest = validation.value;
        employeRequest = {...employeRequest, mdp: await hash(employeRequest.mdp, 10)};
        const employeRepo = AppDataSource.getRepository(Employe);

        try {
            const employeCreated = await employeRepo.save(employeRequest);
            res.status(201).send(employeCreated);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}