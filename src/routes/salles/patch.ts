import { Express, Request, Response } from 'express'
import { AppDataSource } from '../../database/database'
import { Salle } from '../../database/entities/Salle'
import { updateSalleValidation } from '../../handlers/validators/salle-validation'
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message'
import { authAdmin } from '../../middlewares/authAdmin'

export const updateSalle = (app: Express):void => {
    app.patch('/salles/:id', authAdmin, async(req: Request, res: Response) => {
        const validate = updateSalleValidation.validate({...req.params, ...req.body})
        
        if (validate.error){
            res.status(400).send(generateValidationErrorMessage(validate.error.details))
            return
        }
        
        const request = validate.value
        const repo = AppDataSource.getRepository(Salle)

        try {
            const salleUpdated = await repo.save(request)
            res.status(200).send(salleUpdated)
        } catch (error) {
            res.status(500).send({error: "Internal Error"})
        }

    })

}