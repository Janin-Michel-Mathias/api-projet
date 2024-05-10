import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { createSpectateurValidation } from '../../handlers/validators/spectateur-validation';
import { hash } from 'bcrypt';

export const createSpectateur = (app: Express) => {
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
            const spectateurCreated = await spectateurRepo.save(spectateurRequest);
            res.status(201).send(spectateurCreated);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}