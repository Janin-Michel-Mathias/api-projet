import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Employe } from '../../database/entities/Employe';
import { updateEmployeValidation } from '../../handlers/validators/employe-validators';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { hash } from 'bcrypt';
import { authAdmin } from '../../middlewares/authAdmin';

export const updateEmploye = (app: Express) => {
    app.patch('/employes/:id', authAdmin ,async (req: Request, res: Response) => {
        const validation = updateEmployeValidation.validate({...req.body, idEmploye: req.params.id});
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        let employeRequest = validation.value;
        if(employeRequest.mdp) employeRequest = { ...employeRequest, mdp: await hash(employeRequest.mdp, 10) };
        const employeRepo = AppDataSource.getRepository(Employe);

        try {
            const employeUpdated = await employeRepo.update(req.params.id, employeRequest);
            res.status(200).send(employeUpdated);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}