import { Express, Request, Response } from 'express'
import { AppDataSource } from '../../database/database'
import { updateTacheValidation } from '../../handlers/validators/tache-validation'
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message'
import { Tache } from '../../database/entities/Tache'
import { authAdmin } from '../../middlewares/authAdmin'

export const updateTache = (app: Express): void => {

    /**
     * @openapi
     * /taches/{id}:
     *   patch:
     *     tags:
     *       - Taches
     *     summary: Mettre à jour une tache
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Identifiant de la tache à mettre à jour
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Tache'
     *     responses:
     *       200:
     *         description: Tache mise à jour avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Tache'
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
    app.patch('/taches/:id', authAdmin, async (req: Request, res: Response) => {
        const validate = updateTacheValidation.validate({ ...req.params, ...req.body })

        if (validate.error) {
            res.status(400).send(generateValidationErrorMessage(validate.error.details))
            return
        }

        const request = validate.value
        const repo = AppDataSource.getRepository(Tache)

        try {
            const tacheUpdated = await repo.save(request)
            if (!tacheUpdated) {
                res.status(404).send({ error: `Tache ${request.id} not found` })
                return
            }
            res.status(200).send(tacheUpdated)
        } catch (error) {
            res.status(500).send({ error: "Internal Error" })
        }

    })
}
