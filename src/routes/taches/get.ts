import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Tache } from '../../database/entities/Tache';
import { getTacheValidation } from '../../handlers/validators/tache-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { TacheUsecase } from '../../domain/tache-usecase';
import { authAdmin } from '../../middlewares/authAdmin';

export const getTaches = (app: Express):void => {
    /**
 * Retrieves all Tache entities.
 * 
 * @openapi
 * 
 * /taches:
 *   get:
 *     tags:
 *      - Taches
 *     summary: Get all Taches
 *     description: Retrieves all Tache entities from the database.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tache'
 *       '500':
 *         description: Internal server error.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {Response} The HTTP response containing the list of Tache entities.
 */
    app.get('/taches', authAdmin, async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Tache)
        const taches = await repo.find()
        res.status(200).send(taches);
    });
}

export const getTache = (app: Express):void => {
    /**
 * Retrieves a specific Tache entity by ID.
 * 
 * @openapi
 * 
 * /taches/{id}:
 *   get:
 *     tags:
 *     - Taches
 *     summary: Get a Tache by ID
 *     description: Retrieves a specific Tache entity by its ID from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Tache to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tache'
 *       '404':
 *         description: Tache not found
 *       '500':
 *         description: Internal server error.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send the HTTP response.
 * @returns {Response} The HTTP response containing the Tache entity.
 */
    app.get('/taches/:id', async(req: Request, res: Response) => {
        const validation = getTacheValidation.validate({...req.params})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getTacheRequest = validation.value

        try {
            const tacheUsecase = new TacheUsecase(AppDataSource)

            const getTache = await tacheUsecase.getTache(getTacheRequest.id)
            console.log(getTache)

            if (getTache === null) {
                res.status(404).send({"error": `tache ${getTacheRequest.id} not found`})
                return
            }
            
            res.status(200).send(getTache)
        } catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error"})
        }
    })
}