import { Express, Request, Response } from 'express'
import { AppDataSource } from '../../database/database'
import { updateTacheValidation } from '../../handlers/validators/tache-validation'
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message'
import { Tache } from '../../database/entities/Tache'
import { authAdmin } from '../../middlewares/authAdmin'

export const updateTache = (app: Express): void => {
    app.patch('/taches/:id', authAdmin, async (req: Request, res: Response) => {
        const validate = updateTacheValidation.validate({ ...req.params, ...req.body })

        if (validate.error) {
            res.status(400).send(generateValidationErrorMessage(validate.error.details))
            return
        }

        const request = validate.value
        const repo = AppDataSource.getRepository(Tache)

        try {
            const tacheUpdated = await repo.save(request)
            if (!tacheUpdated) {
                res.status(404).send({ error: `Tache ${request.id} not found` })
                return
            }
            res.status(200).send(tacheUpdated)
        } catch (error) {
            res.status(500).send({ error: "Internal Error" })
        }

    })
}
