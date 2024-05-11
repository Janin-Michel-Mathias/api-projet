import { Express, Request, Response } from 'express'
import { AppDataSource } from '../../database/database'
import { Tache } from '../../database/entities/Tache'
import { updateTacheValidation } from '../../handlers/validators/tache-validation'
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message'
import { authAdmin } from '../../middlewares/authAdmin'


export const updateSeance = (app: Express): void => {
    /**
 * @openapi
 * /seances/{id}:
 *   patch:
 *     tags:
 *       - Seances
 *     summary: Mettre à jour une séance par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la séance à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeanceUpdate'
 *     responses:
 *       200:
 *         description: Séance mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seance'
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
 *     SeanceUpdate:
 *       type: object
 *       properties:
 *         idFilm:
 *           type: integer
 *         idSalle:
 *           type: integer
 *       example:
 *         idFilm: 1
 *         idSalle: 1
 *     Seance:
 *       type: object
 *       properties:
 *         idSeance:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *         idFilm:
 *           type: integer
 *         idSalle:
 *           type: integer
 *       required:
 *         - idSeance
 *         - date
 *         - idFilm
 *         - idSalle
 *       example:
 *         idSeance: 1
 *         date: "2024-05-15T12:00:00Z"
 *         idFilm: 1
 *         idSalle: 1
 */

    app.patch('/seances/:id', authAdmin, async (req: Request, res: Response) => {
        const validate = updateTacheValidation.validate({ ...req.params, ...req.body })

        if (validate.error) {
            res.status(400).send(generateValidationErrorMessage(validate.error.details))
            return
        }

        const request = validate.value
        const repo = AppDataSource.getRepository(Tache)

        try {
            console.log(request)
            const tacheUpdated = await repo.save(request)
            res.status(200).send(tacheUpdated)
        } catch (error) {
            res.status(500).send({ error: "Internal Error" })
        }

    })

}