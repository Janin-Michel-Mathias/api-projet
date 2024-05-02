import {Express, Request, Response} from 'express';
import { AppDataSource } from '../database/database';
import { Salle } from '../database/entities/Salle';
import { deletesalleValidation, getSalleValidation, salleValidation, updateSalleValidation } from '../handlers/validators/salle-validation';
import { generateValidationErrorMessage } from '../handlers/validators/generate-validation-message';
import { valid } from 'joi';
import { SalleUsecase } from '../domain/salle-usecase';

export const salleRoute = (app: Express):void => {
    app.get('/salles', async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Salle)
        const salles = await repo.find()
        res.status(200).send(salles);
    });

    app.get('/salles/:id', async(req: Request, res: Response) => {
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
        } catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error"})
        }
    })

    app.post('/salles', async(req: Request, res: Response) => {
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

    app.patch('/salles/:id', async(req: Request, res: Response) => {
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


    app.delete("/salles/:id", async (req: Request, res: Response) => {

        const validation = deletesalleValidation.validate({...req.params})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deletesalleRequest = validation.value

        try {
            const salleUsecase = new SalleUsecase(AppDataSource);
            const deletesalle = await salleUsecase.deleteSalle(deletesalleRequest.id)
            if (deletesalle === null) {
                res.status(404).send({"error": `salle ${deletesalleRequest.id} not found`})
                return
            }
            res.status(200).send(deletesalle)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

}