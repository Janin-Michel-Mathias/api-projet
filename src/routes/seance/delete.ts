import { Express, Request, Response } from "express";
import { AppDataSource } from "../../database/database";
import { SalleUsecase } from "../../domain/salle-usecase";
import { generateValidationErrorMessage } from "../../handlers/validators/generate-validation-message";
import { deleteTacheValidation } from "../../handlers/validators/tache-validation";
import { TacheUsecase } from "../../domain/tache-usecase";
import { authAdmin } from "../../middlewares/authAdmin";

export const removeSeance = (app: Express): void => {
    /**
 * @openapi
 * /seances/{id}:
 *   delete:
 *     tags:
 *       - Seances
 *     summary: Supprimer une séance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la séance à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Séance supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tache'
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *       404:
 *         description: Séance non trouvée
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
 * components:
 *   schemas:
 *     Tache:
 *       type: object
 *       properties:
 *         idTache:
 *           type: integer
 *           format: int64
 *         nom:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *       required:
 *         - nom
 *         - description
 *         - date
 *       example:
 *         idTache: 1
 *         nom: "Tache 1"
 *         description: "Description de la tache 1"
 *         date: "2024-05-15T12:00:00Z"
 */

    app.delete("/seances/:id", authAdmin, async (req: Request, res: Response) => {

        const validation = deleteTacheValidation.validate({ ...req.params })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteTacheRequest = validation.value

        try {
            const tacheUsecase = new TacheUsecase(AppDataSource);
            const deleteTache = await tacheUsecase.deleteTache(deleteTacheRequest.id)
            if (deleteTache === null) {
                res.status(404).send({ "error": `tache ${deleteTacheRequest.id} not found` })
                return
            }
            res.status(200).send(deleteTache)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}