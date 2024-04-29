import {Express, Request, Response} from 'express';
import { AppDataSource } from '../database/database';
import { Salle } from '../database/entities/Salle';

export const salleRoute = (app: Express):void => {
    app.get('/salle', async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Salle)
        const salles = await repo.find()
        res.status(200).send(salles);
    });

    
}