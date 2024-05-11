import { Express, Request, Response } from "express";
import { AppDataSource } from "../../database/database";
import { SalleUsecase } from "../../domain/salle-usecase";
import { deletesalleValidation } from "../../handlers/validators/salle-validation";
import { generateValidationErrorMessage } from "../../handlers/validators/generate-validation-message";
import { authAdmin } from "../../middlewares/authAdmin";

export const removeSalle = (app: Express):void => {
    app.delete("/salles/:id", authAdmin, async (req: Request, res: Response) => {

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