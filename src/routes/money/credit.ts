import { Express, Request, Response } from "express";
import { authSpectateur } from "../../middlewares/authSpectateur";
import { AppDataSource } from "../../database/database";
import { Spectateur } from "../../database/entities/Spectateur";

export const credit = (app: Express) => {
    app.post('/credit', authSpectateur ,async (req: Request, res: Response) => {
        const spectateur = (req as any).user;
        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateurFound = await spectateurRepo.findOne({where: {idSpectateur: spectateur.id}});
        if (!spectateurFound) return res.status(404).json({ error: 'Spectateur not found' });

        const credit = req.body.credit;
        if (!credit) return res.status(400).json({ error: 'Credit is required' });

        spectateurFound.solde += credit;
        await spectateurRepo.save(spectateurFound);
        res.status(200).json(spectateurFound);
    });
}