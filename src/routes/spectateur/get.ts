import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { authAdmin } from '../../middlewares/authAdmin';
import { authSpectateur } from '../../middlewares/authSpectateur';

export const getSpectateurs = (app: Express):void => {
    app.get('/spectateurs', authAdmin , async (req: Request, res: Response) => {
        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateurs = await spectateurRepo.find();
        res.status(200).send(spectateurs);
    });
}

export const getSelfSpectateur = (app: Express):void => {
    app.get('/spectateur', authSpectateur, async (req: Request, res: Response) => {
        const spectateur = (req as any).user;
        applyGetByID(req, res, spectateur.id);
    });
}

export const getSpectateurByID = (app: Express):void => {
    app.get('/spectateurs/:id', authAdmin, async (req: Request, res: Response) => {
        applyGetByID(req, res, parseInt(req.params.id));
    });
}




const applyGetByID = async (req: Request, res: Response, IDspectateur: number) => {
    const spectateurRepo = AppDataSource.getRepository(Spectateur);
    const spectateur = await spectateurRepo.findOne({ where: { idSpectateur: IDspectateur } });
    if (!spectateur) {
        res.status(404).send({ error: 'Spectateur not found' });
        return;
    }

    res.status(200).send(spectateur);
}