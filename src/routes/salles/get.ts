import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Salle } from '../../database/entities/Salle';
import { getSalleValidation } from '../../handlers/validators/salle-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { SalleUsecase } from '../../domain/salle-usecase';
import { authAdmin } from '../../middlewares/authAdmin';

export const getSalles = (app: Express):void => {
    app.get('/salles', authAdmin, async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Salle)
        const salles = await repo.find()
        res.status(200).send(salles);
    });
}

export const getSalle = (app: Express):void => {
    app.get('/salles/:id', authAdmin, async(req: Request, res: Response) => {
        const validation = getSalleValidation.validate({...req.params})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getSalleRequest = validation.value

        try {
            const salleUsecase = new SalleUsecase(AppDataSource)
            const getSalle = await salleUsecase.getSalle(getSalleRequest.id)
            if (getSalle === null) {
                res.status(404).send({"error": `salle ${getSalleRequest.id} not found`})
                return
            }
            res.status(200).send(getSalle)

        } catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error"})
        }
    })
}