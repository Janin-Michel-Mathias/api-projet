import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';

export const deleteSpectateur = (app: Express) => {
    app.delete('/spectateurs/:id', async (req: Request, res: Response) => {
        applyDelete(req, res, parseInt(req.params.id));
    });
}

export const deleteSelfSpectateur = (app: Express) => {
    app.delete('/spectateurs', async (req: Request, res: Response) => {
        const spectateur = (req as any).user;
        applyDelete(req, res, spectateur.id);

    });
}

const applyDelete = async (req: Request, res: Response, IDspectateur: number) => {
    const spectateurRepo = AppDataSource.getRepository(Spectateur);

    try {
        await spectateurRepo.delete(IDspectateur);
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: 'Internal error' });
    }
}