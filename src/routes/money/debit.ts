import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { authSpectateur } from '../../middlewares/authSpectateur';
import { Transaction } from '../../database/entities/Transaction';

export const debit = (app: Express) => {
    app.post('/debit', authSpectateur, async (req: Request, res: Response) => {
        const spectateur = (req as any).user;
        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateurFound = await spectateurRepo.findOne({ where: { idSpectateur: spectateur.id } });
        if (!spectateurFound) return res.status(404).json({ error: 'Spectateur not found' });

        const debit = req.body.debit;
        if (!debit) return res.status(400).json({ error: 'Debit is required' });
        if (debit < 0) return res.status(400).json({ error: 'Debit must be positive' });
        if (spectateurFound.solde < debit) return res.status(400).json({ error: 'Insufficient funds' });

        const transaction = {
            montant: debit,
            date: new Date(),
            type: 'debit',
            idSpectateur: spectateurFound.idSpectateur
        }

        const transactionRepo = AppDataSource.getRepository(Transaction);
        await transactionRepo.save(transaction);
        spectateurFound.solde -= debit;
        await spectateurRepo.save(spectateurFound);
        res.status(200).json(spectateurFound);
    });
}