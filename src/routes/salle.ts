import {Express, Request, Response} from 'express';
import { AppDataSource } from '../database/database';
import { Salle } from '../database/entities/Salle';
import { salleValidation, updateSalleValidation } from '../handlers/validators/salle-validation';
import { generateValidationErrorMessage } from '../handlers/validators/generate-validation-message';

export const salleRoute = (app: Express):void => {
    app.get('/salle', async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Salle)
        const salles = await repo.find()
        res.status(200).send(salles);
    });

    app.post('/salle', async(req: Request, res: Response) => {
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

    app.patch('salle/:id', async(req: Request, res: Response) => {
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