import {Express, Request, Response} from 'express';
import { authAdmin } from '../middlewares/authAdmin';

export const helloRoute = (app: Express):void => {
    app.get('/', authAdmin ,(req: Request, res: Response) => {
        res.send('Hello !');
    });
}