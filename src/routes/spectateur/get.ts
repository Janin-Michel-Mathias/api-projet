import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Spectateur } from '../../database/entities/Spectateur';
import { authAdmin } from '../../middlewares/authAdmin';
import { authSpectateur } from '../../middlewares/authSpectateur';

export const getSpectateurs = (app: Express):void => {

    /**
 * @openapi
 * /spectateurs:
 *   get:
 *     tags:
 *       - Spectateurs
 *     summary: Obtenir la liste de tous les spectateurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les spectateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Spectateur'
 *       401:
 *         description: Non autorisé. Veuillez vous connecter en tant qu'administrateur.
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

    app.get('/spectateurs', authAdmin , async (req: Request, res: Response) => {
        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateurs = await spectateurRepo.find();
        res.status(200).send(spectateurs);
    });
}

export const getSelfSpectateur = (app: Express):void => {
    /**
 * @openapi
 * /spectateur:
 *   get:
 *     tags:
 *       - Spectateurs
 *     summary: Obtenir les informations du spectateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations du spectateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spectateur'
 *       401:
 *         description: Non autorisé. Veuillez vous connecter en tant que spectateur.
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

    app.get('/spectateur', authSpectateur, async (req: Request, res: Response) => {
        const spectateur = (req as any).user;
        applyGetByID(req, res, spectateur.id);
    });
}

export const getSpectateurByID = (app: Express):void => {
    /**
 * @openapi
 * /spectateurs/{id}:
 *   get:
 *     tags:
 *       - Spectateurs
 *     summary: Obtenir les informations d'un spectateur par son identifiant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du spectateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Informations du spectateur demandé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spectateur'
 *       401:
 *         description: Non autorisé. Veuillez vous connecter en tant qu'administrateur.
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

    app.get('/spectateurs/:id', authAdmin, async (req: Request, res: Response) => {
        applyGetByID(req, res, parseInt(req.params.id));
    });
}




const applyGetByID = async (req: Request, res: Response, IDspectateur: number) => {
    const spectateurRepo = AppDataSource.getRepository(Spectateur);
    const spectateur = await spectateurRepo.findOne({ where: { idSpectateur: IDspectateur } });
    if (!spectateur) {
        res.status(404).send({ error: 'Spectateur not found' });
        return;
    }

    res.status(200).send(spectateur);
}