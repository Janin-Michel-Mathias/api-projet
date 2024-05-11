import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Transaction } from '../../database/entities/Transaction';
import { authSpectateur } from '../../middlewares/authSpectateur';

export const getTransactions = (app: Express) => {
/**
 * @openapi
 * /transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Récupérer toutes les transactions d'un spectateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des transactions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
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
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         idTransaction:
 *           type: number
 *           format: int64
 *         montant:
 *           type: number
 *         date:
 *           type: string
 *           format: date-time
 *         type:
 *           type: string
 *         idSpectateur:
 *           type: number
 *           format: int64
 *       required:
 *         - montant
 *         - date
 *         - type
 *         - idSpectateur
 *       example:
 *         idTransaction: 1
 *         montant: 100
 *         date: "2024-05-11T08:00:00Z"
 *         type: "credit"
 *         idSpectateur: 1
 */


    app.get('/transactions', authSpectateur ,async (req: Request, res: Response) => {
        const spectateur = (req as any).user;
        
        const transactionRepo = AppDataSource.getRepository(Transaction);
        const transactions = await transactionRepo.find({where: {idSpectateur: spectateur.id}});
        res.status(200).json(transactions);
    });
}