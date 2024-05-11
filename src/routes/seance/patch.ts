import { Express, Request, Response } from 'express'
import { AppDataSource } from '../../database/database'
import { Tache } from '../../database/entities/Tache'
import { updateTacheValidation } from '../../handlers/validators/tache-validation'
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message'
import { authAdmin } from '../../middlewares/authAdmin'


export const updateSeance = (app: Express): void => {
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