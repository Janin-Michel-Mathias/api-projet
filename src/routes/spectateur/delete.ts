import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';

export const deleteSpectateur = (app: Express) => {
    app.delete('/spectateurs/:id', async (req: Request, res: Response) => {
        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        try {
            await spectateurRepo.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}