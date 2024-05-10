import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Tache } from '../../database/entities/Tache';
import { getTacheValidation } from '../../handlers/validators/tache-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { TacheUsecase } from '../../domain/tache-usecase';

export const getTaches = (app: Express):void => {
    app.get('/taches', async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Tache)
        const taches = await repo.find()
        res.status(200).send(taches);
    });
}

export const getTache = (app: Express):void => {
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