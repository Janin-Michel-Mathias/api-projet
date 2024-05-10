import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { updateSpectateurValidation } from '../../handlers/validators/spectateur-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { hash } from 'bcrypt';

export const updateSpectateur = (app: Express) => {
    app.patch('/spectateurs/:id', async (req: Request, res: Response) => {
        const validation = updateSpectateurValidation.validate({...req.body, idSpectateur: req.params.id});
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        let spectateurRequest = validation.value;
        if(spectateurRequest.mdp) spectateurRequest = { ...spectateurRequest, mdp: await hash(spectateurRequest.mdp, 10) };
        const spectateurRepo = AppDataSource.getRepository(Spectateur);

        try {
            const spectateurUpdated = await spectateurRepo.update(req.params.id, spectateurRequest);
            res.status(200).send(spectateurUpdated);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}

