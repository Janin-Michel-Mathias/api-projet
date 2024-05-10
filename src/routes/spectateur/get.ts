import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';

export const getSpectateurs = (app: Express):void => {
    app.get('/spectateurs', async (req: Request, res: Response) => {
        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateurs = await spectateurRepo.find();
        res.status(200).send(spectateurs);
    });
}