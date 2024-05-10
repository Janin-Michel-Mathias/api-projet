import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Film } from '../../database/entities/Film';


export const deleteMovies = (app: Express):void => {
    app.delete('/films/:id', async (req: Request, res: Response) => {
        const movieRepo = AppDataSource.getRepository(Film);
        const movie = await movieRepo.findOneBy({ idFilm: parseInt(req.params.id) });
        if (!movie) {
            res.status(404).send({ error: 'Movie not found' });
            return;
        }
        try {
            await movieRepo.delete(movie);
            res.status(200).send(movie);
        } catch (error) {
            res.status(500).send({ error: 'Internal error' });
        }
    });
}