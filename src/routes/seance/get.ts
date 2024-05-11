import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Tache } from '../../database/entities/Tache';
import { Film } from '../../database/entities/Film';
import { getSeanceValidation, seanceFilteringValidation, SeanceFilteringRequest } from '../../handlers/validators/seance-validation';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';
import { getTacheValidation } from '../../handlers/validators/tache-validation';
import { TacheUsecase } from '../../domain/tache-usecase';
import { Between, LessThan, MoreThan } from 'typeorm';


export const getSeances = (app: Express): void => {
    app.get('/seances', async (req: Request, res: Response) => {
        const validation = seanceFilteringValidation.validate({ ...req.query })
        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const movies = await getSeancesFiltered(validation.value);
        res.status(200).send(movies);
    });
}

export const getSeance = (app: Express): void => {
    app.get('/seances/:id', async (req: Request, res: Response) => {
        const validation = getSeanceValidation.validate({ ...req.params })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getSeanceRequest = validation.value

        try {
            const seanceUsecase = new TacheUsecase(AppDataSource)
            const getSeance = await seanceUsecase.getTache(getSeanceRequest.id)
            if (getSeance === null) {
                res.status(404).send({ "error": `seance ${getSeanceRequest.id} not found` })
                return
            }
            res.status(200).send(getSeance)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}


const getSeancesFiltered = async (filters: SeanceFilteringRequest) => {
    let whereFilter = {};
    if(filters.film) {
        const filmRepo = AppDataSource.getRepository(Film);
        const film =  await filmRepo.findOne({where: {nom: filters.film}});
        if(film === null) {
            return null;
        }
        whereFilter = { ...whereFilter, idFilm: film.idFilm };
    }

    if(filters.dateDebut && filters.dateFin) {
        whereFilter = { ...whereFilter, dateDebut: Between(filters.dateDebut, filters.dateFin) };
    } else if(filters.dateDebut) {
        whereFilter = { ...whereFilter, dateDebut: MoreThan(filters.dateDebut) };
    } else if(filters.dateFin) {
        whereFilter = { ...whereFilter, dateDebut: LessThan(filters.dateFin) };
    }
    const repo = AppDataSource.getRepository(Tache);
    return repo.find({ where: { ...whereFilter, type: "Seance" } });
}