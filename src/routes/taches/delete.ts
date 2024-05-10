import { Express, Request, Response } from "express";
import { AppDataSource } from "../../database/database";
import { TacheUsecase } from "../../domain/tache-usecase";
import { deleteTacheValidation } from "../../handlers/validators/tache-validation";
import { generateValidationErrorMessage } from "../../handlers/validators/generate-validation-message";

export const removeTache = (app: Express):void => {
    app.delete("/taches/:id", async (req: Request, res: Response) => {

        const validation = deleteTacheValidation.validate({...req.params})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deletetacheRequest = validation.value

        try {
            const tacheUsecase = new TacheUsecase(AppDataSource);
            const deletetache = await tacheUsecase.deleteTache(deletetacheRequest.id)
            if (deletetache === null) {
                res.status(404).send({"error": `tache ${deletetacheRequest.id} not found`})
                return
            }
            res.status(200).send(deletetache)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}