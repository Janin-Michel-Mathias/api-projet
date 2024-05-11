import { Express, Request, Response } from "express";
import { AppDataSource } from "../../database/database";
import { BilletUsecase } from "../../domain/billet-usecase";
import { deleteBilletValidation } from "../../handlers/validators/billet-validation";
import { generateValidationErrorMessage } from "../../handlers/validators/generate-validation-message";
import { authAdmin } from "../../middlewares/authAdmin";

export const removeBillet = (app: Express): void => {
    /**
 * @openapi
 * /billets/{id}:
 *   delete:
 *     tags:
 *       - Billets
 *     summary: Supprimer un billet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du billet à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billet supprimé avec succès
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

    app.delete("/billets/:id", authAdmin, async (req: Request, res: Response) => {
        const validation = deleteBilletValidation.validate({ ...req.params });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const deleteBilletRequest = validation.value;

        try {
            const billetUsecase = new BilletUsecase(AppDataSource);
            const deletedBillet = await billetUsecase.deleteBillet(deleteBilletRequest.id);
            if (deletedBillet === null) {
                res.status(404).send({ "error": `Billet ${deleteBilletRequest.id} not found` });
                return;
            }
            res.status(200).send(deletedBillet);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
