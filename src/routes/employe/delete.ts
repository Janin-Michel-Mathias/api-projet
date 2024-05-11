import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Employe } from '../../database/entities/Employe';
import { authAdmin } from '../../middlewares/authAdmin';

export const deleteEmployes = (app: Express):void => {
    app.delete('/employes/:id', authAdmin ,async (req: Request, res: Response) => {
        const employeRepo = AppDataSource.getRepository(Employe);
        const employe = await employeRepo.findOneBy({ idEmploye: parseInt(req.params.id) });
        if (!employe) {
            res.status(404).send({ error: 'Employe not found' });
            return;
        }
        try {
            await employeRepo.delete(employe);
            res.status(200).send(employe);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}