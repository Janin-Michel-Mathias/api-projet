import { Express, Request, Response } from 'express';
import { AppDataSource } from "../../database/database";
import { Tache } from "../../database/entities/Tache";
import { generateValidationErrorMessage } from "../../handlers/validators/generate-validation-message";
import { createTacheValidation } from "../../handlers/validators/tache-validation";
import { authAdmin } from '../../middlewares/authAdmin';

export const createTache = (app: Express) => {
    /**
     * Creates a new Tache entity.
     * 
     * @openapi
     * 
     * /taches:
     *   post:
     *     tags:
     *       - Taches
     *     summary: Create a new Tache
     *     description: Creates a new Tache entity in the database.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Tache'
     *     responses:
     *       '201':
     *         description: Successful operation. Returns the created Tache entity.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Tache'
     *       '400':
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Error message
     *       '500':
     *         description: Internal server error.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Error message
     * 
     * @param {Request} req - The request object.
     * @param {Response} res - The response object used to send the HTTP response.
     * @returns {Response} The HTTP response containing the created Tache entity.
     */
    app.post('/taches', authAdmin, async (req: Request, res: Response) => {
        const validate = createTacheValidation.validate(req.body);

        if (validate.error) {
            res.status(400).send(generateValidationErrorMessage(validate.error.details));
            return;
        }

        const request = validate.value;
        const repo = AppDataSource.getRepository(Tache);

        try {
            const tacheCreated = await repo.save(request);
            res.status(201).send(tacheCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal Error" });
        }
    });
};
