import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Employe } from '../../database/entities/Employe';
import { authAdmin } from '../../middlewares/authAdmin';

export const getEmployes = (app: Express):void => {
    /**
 * @openapi
 * /employes:
 *   get:
 *     tags:
 *       - Employes
 *     summary: Obtenir tous les employés
 *     responses:
 *       200:
 *         description: Liste des employés récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employe'
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

    app.get('/employes', authAdmin ,async (req: Request, res: Response) => {
        // get all employes:
        const employeRepo = AppDataSource.getRepository(Employe);
        const employes = await employeRepo.find();
        res.status(200).send(employes);
    });
}