import { Express, Request, Response } from 'express';
import { AppDataSource } from "../../database/database";
import { Tache } from "../../database/entities/Tache";
import { generateValidationErrorMessage } from "../../handlers/validators/generate-validation-message";
import { createTacheValidation } from "../../handlers/validators/tache-validation";

export const createTache = (app: Express) => {
    app.post('/taches', async (req: Request, res: Response) => {
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
