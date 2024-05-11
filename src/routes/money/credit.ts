import { Express, Request, Response } from "express";
import { authSpectateur } from "../../middlewares/authSpectateur";
import { AppDataSource } from "../../database/database";
import { Spectateur } from "../../database/entities/Spectateur";
import { Transaction } from "../../database/entities/Transaction";

export const credit = (app: Express) => {
    app.post('/credit', authSpectateur ,async (req: Request, res: Response) => {
        const spectateur = (req as any).user;
        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateurFound = await spectateurRepo.findOne({where: {idSpectateur: spectateur.id}});
        if (!spectateurFound) return res.status(404).json({ error: 'Spectateur not found' });

        const credit = req.body.credit;
        if (!credit) return res.status(400).json({ error: 'Credit is required' });
        if(credit < 0) return res.status(400).json({ error: 'Credit must be positive' });
        const transaction = {
            montant: credit,
            date: new Date(),
            type: 'credit',
            idSpectateur: spectateurFound.idSpectateur
        }

        const transactionRepo = AppDataSource.getRepository(Transaction);
        await transactionRepo.save(transaction);
        spectateurFound.solde += credit;
        await spectateurRepo.save(spectateurFound);
        res.status(200).json(spectateurFound);
    });
}