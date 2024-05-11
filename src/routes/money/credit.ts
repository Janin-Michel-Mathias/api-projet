import { Express, Request, Response } from "express";
import { authSpectateur } from "../../middlewares/authSpectateur";
import { AppDataSource } from "../../database/database";
import { Spectateur } from "../../database/entities/Spectateur";
import { Transaction } from "../../database/entities/Transaction";

export const credit = (app: Express) => {
    /**
 * @openapi
 * /credit:
 *   post:
 *     tags:
 *       - Opérations financières
 *     summary: Créditer le solde d'un spectateur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credit:
 *                 type: number
 *             required:
 *               - credit
 *     responses:
 *       200:
 *         description: Solde du spectateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spectateur'
 *       400:
 *         description: Erreur de validation des données de la requête
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
 */

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