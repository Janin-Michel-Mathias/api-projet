import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Billet } from '../../database/entities/Billet';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { billetValidation } from '../../handlers/validators/billet-validation';


export const createBillet = (app: Express) => {
    app.post('/billets', async (req: Request, res: Response) => {
        const validation = billetValidation.validate(req.body)
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const request = validation.value;
        const repo = AppDataSource.getRepository(Billet);

        try {
            const billetCreated = await repo.save(request);
            res.status(201).send(billetCreated);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}