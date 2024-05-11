import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Tache } from '../../database/entities/Tache';
import { getSeanceValidation } from '../../handlers/validators/seance-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { getTacheValidation } from '../../handlers/validators/tache-validation';
import { TacheUsecase } from '../../domain/tache-usecase';


export const getSeances = (app: Express): void => {
    app.get('/seances', async (req: Request, res: Response) => {
        const movieRepo = AppDataSource.getRepository(Tache);
        const movies = await movieRepo.find({ where: { type: "Seance" } });
        res.status(200).send(movies);
    });
}

export const getSeance = (app: Express): void => {
    app.get('/seances/:id', async (req: Request, res: Response) => {
        const validation = getSeanceValidation.validate({ ...req.params })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getSeanceRequest = validation.value

        try {
            const seanceUsecase = new TacheUsecase(AppDataSource)
            const getSeance = await seanceUsecase.getTache(getSeanceRequest.id)
            if (getSeance === null) {
                res.status(404).send({ "error": `seance ${getSeanceRequest.id} not found` })
                return
            }
            res.status(200).send(getSeance)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}