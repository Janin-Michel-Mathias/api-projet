import { Express, Request, Response } from "express";
import { AppDataSource } from "../../database/database";
import { TacheUsecase } from "../../domain/tache-usecase";
import { deleteTacheValidation } from "../../handlers/validators/tache-validation";
import { generateValidationErrorMessage } from "../../handlers/validators/generate-validation-message";
import { authAdmin } from "../../middlewares/authAdmin";

export const removeTache = (app: Express): void => {
    /**
 * Handles the deletion of a Tache entity by ID.
 * 
 * @openapi
 * 
 * /taches/{id}:
 *   delete:
 *     tags:
 *      - Taches
 *     summary: Delete a Tache by ID
 *     description: Deletes a Tache entity from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Tache to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tache'
 *       '404':
 *         description: Tache not found.
 *       '400':
 *         description: Bad request. Invalid ID provided.
 *       '500':
 *         description: Internal server error.
 * 
 * @param {Request} req - The request object containing the Tache ID in the parameters.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {Response} The HTTP response indicating success or failure of the deletion operation.
 */
    app.delete("/taches/:id", authAdmin, async (req: Request, res: Response) => {

        const validation = deleteTacheValidation.validate({ ...req.params })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deletetacheRequest = validation.value

        try {
            const tacheUsecase = new TacheUsecase(AppDataSource);
            const deletetache = await tacheUsecase.deleteTache(deletetacheRequest.id)
            if (deletetache === null) {
                res.status(404).send({ "error": `tache ${deletetacheRequest.id} not found` })
                return
            }
            res.status(200).send(deletetache)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}