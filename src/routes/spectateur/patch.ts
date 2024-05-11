import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { updateSpectateurValidation } from '../../handlers/validators/spectateur-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { hash } from 'bcrypt';
import { authSpectateur } from '../../middlewares/authSpectateur';

export const updateSpectateur = (app: Express) => {
    app.patch('/spectateurs/:id', async (req: Request, res: Response) => {
        applyUpdate(req, res, parseInt(req.params.id));
    });
}

export const updateSelfSpectateur = (app: Express) => {
    app.patch('/spectateurs',authSpectateur , async (req: Request, res: Response) => {
       const spectateur = (req as any).user;
       applyUpdate(req, res, spectateur.id)
    });
}

const applyUpdate = async (req: Request, res: Response, IDspectateur: number) => {
    const validation = updateSpectateurValidation.validate({...req.body, idSpectateur: IDspectateur});
    if (validation.error) {
        res.status(400).send(generateValidationErrorMessage(validation.error.details));
        return;
    }

    let spectateurRequest = validation.value;
    if(spectateurRequest.mdp) spectateurRequest = { ...spectateurRequest, mdp: await hash(spectateurRequest.mdp, 10) };
    const spectateurRepo = AppDataSource.getRepository(Spectateur);

    try {
        const spectateurUpdated = await spectateurRepo.update(IDspectateur, spectateurRequest);
        res.status(200).send(spectateurUpdated);
    } catch (error) {
        res.status(500).send({ error: 'Internal error' });
    }
}