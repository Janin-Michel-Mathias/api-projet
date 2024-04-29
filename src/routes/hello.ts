import {Express, Request, Response} from 'express';

export const helloRoute = (app: Express):void => {
    app.get('/', (req: Request, res: Response) => {
        res.send('Hello !');
    });
}