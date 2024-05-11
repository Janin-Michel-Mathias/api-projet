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

/**
 * @openapi
 * /billets/buy:
 *   post:
 *     tags:
 *       - Billets
 *     summary: Acheter un billet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyBillet'
 *     responses:
 *       201:
 *         description: Billet acheté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 billets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Billet'
 *                 solde:
 *                   type: number
 *                   description: Solde restant du spectateur
 *       400:
 *         description: Erreur de validation ou solde insuffisant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       404:
 *         description: Spectateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *
 * components:
 *   schemas:
 *     BuyBillet:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: Type de billet (par exemple, "Super" ou "Classic")
 *         quantite:
 *           type: integer
 *           description: Quantité de billets à acheter
 *       required:
 *         - type
 *         - quantite
 *     Billet:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant unique du billet
 *         type:
 *           type: string
 *           description: Type de billet (par exemple, "Super" ou "Classic")
 *         prix:
 *           type: number
 *           description: Prix du billet
 *         utilisation:
 *           type: number
 *           description: Nombre d'utilisations du billet
 *         idSpectateur:
 *           type: string
 *           description: Identifiant du spectateur auquel le billet est associé
 */



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