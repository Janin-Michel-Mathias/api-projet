import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Film } from '../../database/entities/Film';
import { updateMovieValidation } from '../../handlers/validators/film-validators';
import { generateValidationErrorMessage } from '../../handlers/validators/generate-validation-message';

export const updateMovies = (app: Express):void => {
    app.patch('/films/:id', async (req: Request, res: Response) => {
        const params = {...req.body,  idFilm: parseInt(req.params.id) };
        const validation = updateMovieValidation.validate(params);
        if (validation.error) {
            res.status(400).send({ error: generateValidationErrorMessage(validation.error.details) });
            return;
        }
        const movieRepo = AppDataSource.getRepository(Film);
        const movie = await movieRepo.findOneBy({ idFilm: params.id });
        if (!movie) {
            res.status(404).send({ error: 'Movie not found' });
            return;
        }

        const movieRequest = validation.value;
        if(movieRequest.nom) movie.nom = movieRequest.nom;
        if(movieRequest.duree) movie.duree = movieRequest.duree;
        if(movieRequest.type) movie.type = movieRequest.type;
        if(movieRequest.description) movie.description = movieRequest.description;

        try {
            await movieRepo.save(movie);
            res.status(200).send(movie);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}