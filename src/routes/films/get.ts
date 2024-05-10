import {Express, Request, Response} from 'express';
import { AppDataSource } from '../../database/database';
import { Film } from '../../database/entities/Film';

export const getMovies = (app: Express):void => {
    app.get('/films', async (req: Request, res: Response) => {
        // get all movies:
        const movieRepo = AppDataSource.getRepository(Film);
        const movies = await movieRepo.find();
        res.status(200).send(movies);
    });
}