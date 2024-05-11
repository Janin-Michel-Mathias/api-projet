import { Express, Request, Response } from 'express'
import { AppDataSource } from '../../database/database'
import { Salle } from '../../database/entities/Salle'
import { updateSalleValidation } from '../../handlers/validators/salle-validation'
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message'
import { authAdmin } from '../../middlewares/authAdmin'

export const updateSalle = (app: Express):void => {
    /**
 * @openapi
 * /salles/{id}:
 *   patch:
 *     tags:
 *       - Salles
 *     summary: Mettre à jour les détails d'une salle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la salle à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalleUpdate'
 *     responses:
 *       200:
 *         description: Détails de la salle mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salle'
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
 *     SalleUpdate:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: string
 *         capacite:
 *           type: integer
 *         accesHandicap:
 *           type: boolean
 *         etat:
 *           type: string
 *       required:
 *         - nom
 *         - description
 *         - images
 *         - capacite
 *         - accesHandicap
 *         - etat
 *       example:
 *         nom: "Salle 1"
 *         description: "Description de la salle 1"
 *         images: "url_image"
 *         capacite: 100
 *         accesHandicap: false
 *         etat: "disponible"
 *     Salle:
 *       type: object
 *       properties:
 *         idSalle:
 *           type: integer
 *           format: int64
 *         nom:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: string
 *         capacite:
 *           type: integer
 *         accesHandicap:
 *           type: boolean
 *         etat:
 *           type: string
 *       required:
 *         - nom
 *         - description
 *         - images
 *         - capacite
 *         - accesHandicap
 *         - etat
 *       example:
 *         idSalle: 1
 *         nom: "Salle 1"
 *         description: "Description de la salle 1"
 *         images: "url_image"
 *         capacite: 100
 *         accesHandicap: false
 *         etat: "disponible"
 */

    app.patch('/salles/:id', authAdmin, async(req: Request, res: Response) => {
        const validate = updateSalleValidation.validate({...req.params, ...req.body})
        
        if (validate.error){
            res.status(400).send(generateValidationErrorMessage(validate.error.details))
            return
        }
        
        const request = validate.value
        const repo = AppDataSource.getRepository(Salle)

        try {
            const salleUpdated = await repo.save(request)
            res.status(200).send(salleUpdated)
        } catch (error) {
            res.status(500).send({error: "Internal Error"})
        }

    })

}