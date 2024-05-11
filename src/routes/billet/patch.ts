import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Billet } from '../../database/entities/Billet';
import { updateBilletValidation } from '../../handlers/validators/billet-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { authAdmin } from '../../middlewares/authAdmin';

export const updateBillet = (app: Express): void => {
    /**
 * @openapi
 * /billets/{id}:
 *   patch:
 *     tags:
 *       - Billets
 *     summary: Mettre à jour un billet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du billet à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Billet'
 *     responses:
 *       200:
 *         description: Billet mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Billet'
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

    app.patch('/billets/:id', authAdmin, async (req: Request, res: Response) => {
        const validate = updateBilletValidation.validate({ ...req.params, ...req.body });

        if (validate.error) {
            res.status(400).send(generateValidationErrorMessage(validate.error.details));
            return;
        }

        const request = validate.value;
        const repo = AppDataSource.getRepository(Billet);

        try {
            const billetUpdated = await repo.save(request);
            res.status(200).send(billetUpdated);
        } catch (error) {
            res.status(500).send({ error: "Internal Error" });
        }
    });
};
