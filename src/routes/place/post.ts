import { Express, Request, Response } from 'express';
import { AppDataSource } from "../../database/database";
import { Place } from "../../database/entities/Place";
import { generateValidationErrorMessage } from "../../handlers/validators/generate-validation-message";
import { createPlaceValidation } from '../../handlers/validators/place-validation';
import { authSpectateur } from '../../middlewares/authSpectateur';
import { Spectateur } from '../../database/entities/Spectateur';
import { Billet } from '../../database/entities/Billet';
import { Tache } from '../../database/entities/Tache';

export const createPlace = (app: Express) => {
    app.post('/places', authSpectateur, async (req: Request, res: Response) => {
        const validate = createPlaceValidation.validate(req.body);

        if (validate.error) {
            res.status(400).send(generateValidationErrorMessage(validate.error.details));
            return;
        }

        const request = validate.value;
        const repo = AppDataSource.getRepository(Place);

        const spectateur = (req as any).user;
        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateurFound = await spectateurRepo.findOne({ where: { idSpectateur: spectateur.id } });
        if (!spectateurFound) return res.status(404).json({ error: 'Spectateur not found' });

        const billet = (req as any).billet;
        const billetRepo = AppDataSource.getRepository(Billet);
        const billetFound = await billetRepo.findOne({ where: { idBillet: request.idBillet } });
        if (!billetFound) return res.status(404).json({ error: 'Billet not found' });

        if (billetFound != null && billetFound.idSpectateur !== spectateurFound.idSpectateur) return res.status(401).json({ error: 'N\'utilises pas le billet des autres >_< ! ça se fait aps' });

        const seance = (req as any).seance;
        const seanceRepo = AppDataSource.getRepository(Tache);
        const seanceFound = await seanceRepo.findOne({ where: { idTache: request.idSeance } });
        if (!seanceFound) return res.status(404).json({ error: 'Seance not found' });
        if (seanceFound != null && seanceFound.dateDebut < new Date()) return res.status(401).json({ error: 'Seance is in the past' });

        billetFound.utilisation = billetFound.utilisation - 1;
        if (billetFound.utilisation <= 0) {
            res.status(400).send({ error: "Aucune utilisations restantes" })
            return
        } else {
            AppDataSource.manager.save(billetFound);
        }


        try {
            const placeCreated = await repo.save(request);
            res.status(201).send(placeCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal Error" });
        }
    });
};
