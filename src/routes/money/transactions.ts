import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Transaction } from '../../database/entities/Transaction';
import { authSpectateur } from '../../middlewares/authSpectateur';

export const getTransactions = (app: Express) => {
    app.get('/transactions', authSpectateur ,async (req: Request, res: Response) => {
        const spectateur = (req as any).user;
        
        const transactionRepo = AppDataSource.getRepository(Transaction);
        const transactions = await transactionRepo.find({where: {idSpectateur: spectateur.id}});
        res.status(200).json(transactions);
    });
}