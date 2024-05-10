import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Employe } from '../../database/entities/Employe';

export const getEmployes = (app: Express):void => {
    app.get('/employes', async (req: Request, res: Response) => {
        // get all employes:
        const employeRepo = AppDataSource.getRepository(Employe);
        const employes = await employeRepo.find();
        res.status(200).send(employes);
    });
}