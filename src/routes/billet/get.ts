import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Billet } from '../../database/entities/Billet';
import { GetBilletValidation } from '../../handlers/validators/billet-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { BilletUsecase } from '../../domain/billet-usecase';
import { authSpectateur } from '../../middlewares/authSpectateur';
import { authAdmin } from '../../middlewares/authAdmin';

export const getBillets = (app: Express): void => {

    /**
 * @openapi
 * /billets:
 *   get:
 *     tags:
 *       - Billets
 *     summary: Obtenir tous les billets
 *     responses:
 *       200:
 *         description: Liste des billets récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Billet'
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


    app.get('/billets', authAdmin ,async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Billet);
        const billets = await repo.find();
        res.status(200).send(billets);
    });
};

export const getBillet = (app: Express): void => {
    /**
 * @openapi
 * /billets/{id}:
 *   get:
 *     tags:
 *       - Billets
 *     summary: Obtenir un billet par son identifiant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du billet à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billet récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Billet'
 *       404:
 *         description: Billet non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       400:
 *         description: Erreur de validation
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

    app.get('/billets/:id', authAdmin, async (req: Request, res: Response) => {
        const validation = GetBilletValidation.validate({ ...req.params });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const getBilletRequest = validation.value;

        try {
            const billetUsecase = new BilletUsecase(AppDataSource);
            const getBillet = await billetUsecase.getBillet(getBilletRequest.id);
            if (getBillet === null) {
                res.status(404).send({ "error": `Billet ${getBilletRequest.id} not found` });
                return;
            }
            res.status(200).send(getBillet);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};


export const getMyBillet = (app: Express) => {
    /**
 * @openapi
 * /me/billets:
 *   get:
 *     tags:
 *       - Billets
 *     summary: Obtenir les billets d'un spectateur
 *     responses:
 *       200:
 *         description: Liste des billets du spectateur récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Billet'
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

    app.get('/me/billets/', authSpectateur, async (req: Request, res: Response) => {

        const spectateur = (req as any).user;

        const repo = AppDataSource.getRepository(Billet);
        const billets = await repo.find({ where: { idSpectateur: spectateur.id } });
        console.log(billets);

        res.status(200).send(billets);
    });
}