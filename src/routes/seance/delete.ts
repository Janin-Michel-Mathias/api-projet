import { Express, Request, Response } from "express";
import { AppDataSource } from "../../database/database";
import { SalleUsecase } from "../../domain/salle-usecase";
import { generateValidationErrorMessage } from "../../handlers/validators/generate-validation-message";
import { deleteTacheValidation } from "../../handlers/validators/tache-validation";
import { TacheUsecase } from "../../domain/tache-usecase";

export const removeSeance = (app: Express): void => {
    app.delete("/seances/:id", async (req: Request, res: Response) => {

        const validation = deleteTacheValidation.validate({ ...req.params })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteTacheRequest = validation.value

        try {
            const tacheUsecase = new TacheUsecase(AppDataSource);
            const deleteTache = await tacheUsecase.deleteTache(deleteTacheRequest.id)
            if (deleteTache === null) {
                res.status(404).send({ "error": `tache ${deleteTacheRequest.id} not found` })
                return
            }
            res.status(200).send(deleteTache)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}