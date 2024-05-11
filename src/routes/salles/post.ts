import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Salle } from '../../database/entities/Salle';
import { salleValidation } from '../../handlers/validators/salle-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { authAdmin } from '../../middlewares/authAdmin';

export const createSalle =  (app: Express) => {
    /**
 * @openapi
 * /salles:
 *   post:
 *     tags:
 *       - Salles
 *     summary: Créer une nouvelle salle
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalleCreate'
 *     responses:
 *       201:
 *         description: Salle créée avec succès
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
 *     SalleCreate:
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

    app.post('/salles', authAdmin, async(req: Request, res: Response) => {
        console.log(req.body);
        
        const validate = salleValidation.validate(req.body)
        console.log(validate.value);
        
        if(validate.error){
            res.status(400).send(generateValidationErrorMessage(validate.error.details))
            return
        }
        
        const request = validate.value
        const repo = AppDataSource.getRepository(Salle)

        try {
            const salleCreated = await repo.save(request)
            res.status(201).send(salleCreated)
        } catch(error) {
            console.log(error);
            res.status(500).send({ error : "Internal Error"})
        }
    });
}
