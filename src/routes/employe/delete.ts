import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Employe } from '../../database/entities/Employe';
import { authAdmin } from '../../middlewares/authAdmin';

export const deleteEmployes = (app: Express):void => {
    /**
 * @openapi
 * /employes/{id}:
 *   delete:
 *     tags:
 *       - Employes
 *     summary: Supprimer un employé par son identifiant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant de l'employé à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employé supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employe'
 *       404:
 *         description: Employé non trouvé
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