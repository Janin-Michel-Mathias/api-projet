import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { authSpectateur } from '../../middlewares/authSpectateur';
import { Transaction } from '../../database/entities/Transaction';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { Billet } from '../../database/entities/Billet';
import { buyBilletValidation } from '../../handlers/validators/billet-validation';

const superBillet = {
    type: "Super",
    prix: 10,
    utilisation: 10
}


const classicBillet = {
    type: "Classic",
    prix: 1,
    utilisation: 1
}


export const prix = (app: Express) => {
    app.post('/billets/buy', authSpectateur, async (req: Request, res: Response) => {

        const validation = buyBilletValidation.validate(req.body)
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const request = validation.value;


        const price = "Super" == request.type ? superBillet.prix : classicBillet.prix;
        const totalPrice = price * request.quantite;




        const spectateur = (req as any).user;
        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateurFound = await spectateurRepo.findOne({ where: { idSpectateur: spectateur.id } });
        if (!spectateurFound) return res.status(404).json({ error: 'Spectateur not found' });

        if (spectateurFound.solde < totalPrice) return res.status(400).json({ error: 'Insufficient funds' });

        const transaction = {
            montant: totalPrice,
            date: new Date(),
            type: 'achat',
            idSpectateur: spectateurFound.idSpectateur
        }

        const transactionRepo = AppDataSource.getRepository(Transaction);
        await transactionRepo.save(transaction);
        spectateurFound.solde -= totalPrice;
        await spectateurRepo.save(spectateurFound);

        const repo = AppDataSource.getRepository(Billet);

        try {
            const billets = [];
            let billet = {}
            if (request.type === "Super") billet = { ...superBillet, idSpectateur: spectateurFound.idSpectateur };
            if (request.type === "Classic") billet = { ...classicBillet, idSpectateur: spectateurFound.idSpectateur };

            for (let i = 0; i < request.quantite; i++) {
                billets.push(await repo.save({ ...billet }));
            }

            // for (let i = 0; i < request.quantite; i++) {
            //     let billet = {}
            //     if (request.type === "Super") billet = { ...superBillet, idSpectateur: spectateurFound.idSpectateur };
            //     if (request.type === "Classic") billet = { ...classicBillet, idSpectateur: spectateurFound.idSpectateur };
            //     billets.push(await repo.save(billet));
            // }

            res.status(201).send({ billets, solde: spectateurFound.solde });
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}