import {Express, Request, Response} from 'express';
import { authSpectateur } from '../middlewares/authSpectateur';

export const helloRoute = (app: Express):void => {
    app.get('/', authSpectateur ,(req: Request, res: Response) => {
        res.send('Hello !');
    });
}