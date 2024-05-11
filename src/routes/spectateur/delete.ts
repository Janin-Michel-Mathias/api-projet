import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { authAdmin } from '../../middlewares/authAdmin';

export const deleteSpectateur = (app: Express) => {
    /**
 * @openapi
 * /spectateurs/{id}:
 *   delete:
 *     tags:
 *       - Spectateurs
 *     summary: Supprimer un spectateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du spectateur à supprimer
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Spectateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spectateur'
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

    app.delete('/spectateurs/:id', authAdmin , async (req: Request, res: Response) => {
        applyDelete(req, res, parseInt(req.params.id));
    });
}

export const deleteSelfSpectateur = (app: Express) => {
    /**
 * @openapi
 * /spectateurs:
 *   delete:
 *     tags:
 *       - Spectateurs
 *     summary: Supprimer son propre compte de spectateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compte de spectateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spectateur'
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

    app.delete('/spectateurs', async (req: Request, res: Response) => {
        const spectateur = (req as any).user;
        applyDelete(req, res, spectateur.id);

    });
}

const applyDelete = async (req: Request, res: Response, IDspectateur: number) => {
    const spectateurRepo = AppDataSource.getRepository(Spectateur);

    try {
        await spectateurRepo.delete(IDspectateur);
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: 'Internal error' });
    }
}