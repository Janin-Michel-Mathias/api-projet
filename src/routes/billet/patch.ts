import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Billet } from '../../database/entities/Billet';
import { updateBilletValidation } from '../../handlers/validators/billet-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';

export const updateBillet = (app: Express): void => {
    app.patch('/billets/:id', async (req: Request, res: Response) => {
        const validate = updateBilletValidation.validate({ ...req.params, ...req.body });

        if (validate.error) {
            res.status(400).send(generateValidationErrorMessage(validate.error.details));
            return;
        }

        const request = validate.value;
        const repo = AppDataSource.getRepository(Billet);

        try {
            const billetUpdated = await repo.save(request);
            res.status(200).send(billetUpdated);
        } catch (error) {
            res.status(500).send({ error: "Internal Error" });
        }
    });
};
