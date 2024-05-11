import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Salle } from '../../database/entities/Salle';
import { salleValidation } from '../../handlers/validators/salle-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { authAdmin } from '../../middlewares/authAdmin';

export const createSalle =  (app: Express) => {
    app.post('/salles', authAdmin, async(req: Request, res: Response) => {
        console.log(req.body);
        
        const validate = salleValidation.validate(req.body)
        console.log(validate.value);
        
        if(validate.error){
            res.status(400).send(generateValidationErrorMessage(validate.error.details))
            return
        }
        
        const request = validate.value
        const repo = AppDataSource.getRepository(Salle)

        try {
            const salleCreated = await repo.save(request)
            res.status(201).send(salleCreated)
        } catch(error) {
            console.log(error);
            res.status(500).send({ error : "Internal Error"})
        }
    });
}
