import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Billet } from '../../database/entities/Billet';
import { GetBilletValidation } from '../../handlers/validators/billet-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { BilletUsecase } from '../../domain/billet-usecase';
import { authSpectateur } from '../../middlewares/authSpectateur';
import { Spectateur } from '../../database/entities/Spectateur';
import { Transaction } from 'typeorm';

export const getBillets = (app: Express): void => {
    app.get('/billets', async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Billet);
        const billets = await repo.find();
        res.status(200).send(billets);
    });
};

export const getBillet = (app: Express): void => {
    app.get('/billets/:id', async (req: Request, res: Response) => {
        const validation = GetBilletValidation.validate({ ...req.params });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const getBilletRequest = validation.value;

        try {
            const billetUsecase = new BilletUsecase(AppDataSource);
            const getBillet = await billetUsecase.getBillet(getBilletRequest.id);
            if (getBillet === null) {
                res.status(404).send({ "error": `Billet ${getBilletRequest.id} not found` });
                return;
            }
            res.status(200).send(getBillet);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};


export const getMyBillet = (app: Express) => {
    app.get('/me/billets/', authSpectateur, async (req: Request, res: Response) => {

        const spectateur = (req as any).user;

        const repo = AppDataSource.getRepository(Billet);
        const billets = await repo.find({ where: { idSpectateur: spectateur.id } });
        console.log(billets);

        res.status(200).send(billets);
    });
}