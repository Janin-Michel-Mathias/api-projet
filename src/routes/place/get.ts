import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Place } from '../../database/entities/Place';
import { getPlaceValidation } from '../../handlers/validators/place-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { authSpectateur } from '../../middlewares/authSpectateur';
import { PlaceUsecase } from '../../domain/place-usecase';
import { In } from 'typeorm/find-options/operator/In';
import { Billet } from '../../database/entities/Billet';
import { Spectateur } from '../../database/entities/Spectateur';


export const getPlaces = (app: Express): void => {
    app.get('/places', async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Place);
        const places = await repo.find();
        res.status(200).send(places);
    });
};

export const getPlace = (app: Express): void => {
    app.get('/places/:id', async (req: Request, res: Response) => {
        const validation = getPlaceValidation.validate({ ...req.params });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const getPlaceRequest = validation.value;

        try {
            const placeUsecase = new PlaceUsecase(AppDataSource);
            const getPlace = await placeUsecase.getPlace(getPlaceRequest.id);
            if (getPlace === null) {
                res.status(404).send({ "error": `Place ${getPlaceRequest.id} not found` });
                return;
            }
            res.status(200).send(getPlace);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};


export const getMyPlace = (app: Express) => {
    app.get('/me/places/', authSpectateur, async (req: Request, res: Response) => {

        const spectateur = (req as any).user;

        const spectateurRepo = AppDataSource.getRepository(Spectateur);
        const spectateurFound = await spectateurRepo.findOne({ where: { idSpectateur: spectateur.id } });
        if (!spectateurFound) return res.status(404).json({ error: 'Spectateur not found' });


        const repo = AppDataSource.getRepository(Place);
        const places = await AppDataSource.getRepository(Place).find()

        const billetIds = await AppDataSource.getRepository(Billet)
            .createQueryBuilder("billet")
            .select("billet.idBillet")
            .where("billet.idSpectateur = :idSpectateur", { idSpectateur: spectateurFound.idSpectateur })
            .getMany()
            .then(billets => billets.map(billet => billet.idBillet));

        const spectateurIds = await AppDataSource.getRepository(Billet)
            .createQueryBuilder("billet")
            .select("billet.idSpectateur")
            .where("billet.idBillet IN (:...billetIds)", { billetIds })
            .getMany()
            .then(billets => billets.map(billet => billet.idSpectateur));



        console.log("-----------DEBUG---------")
        console.log(billetIds);

        const filteredPlaces = places.filter(place => billetIds.includes(place.idBillet));

        res.status(200).send(filteredPlaces);
    });
}