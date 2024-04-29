import {Express, Request, Response} from 'express';

export const salleRoute = (app: Express):void => {
    app.get('/salle', (req: Request, res: Response) => {
        res.send('Healthy !');
    });
}