import {Express, Request, Response} from 'express';

export const healthRoute = (app: Express):void => {
    app.get('/health', (req: Request, res: Response) => {
        res.send('Healthy !');
    });
}