import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Tache } from '../../database/entities/Tache';
import { Between } from 'typeorm/find-options/operator/Between';
import { SeanceFilteringRequest } from '../../handlers/validators/seance-validation';
import { Film } from '../../database/entities/Film';
import { Place } from '../../database/entities/Place';

export const getSeancesForCurrentDay = (app: Express) => {
    app.get('/freq/seances/daily', async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Place);

        try {
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

            const seances = await getSeancesFiltered(startDate, endDate)

            if (!seances || seances.length === 0) {
                return res.status(404).json({ error: 'No seances found for the current day' });
            }


            const places = seances.map(seance => {
                return {
                    idSeance: seance.idTache,
                    places: repo.find({ where: { idSeance: seance.idTache } })
                };
            })


            res.status(200).json(places);
        } catch (error) {
            console.error('Error fetching seances for the current day:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};


const getSeancesFiltered = async (startDate: Date, endDate: Date) => {
    const currentDate = new Date();

    const repo = AppDataSource.getRepository(Tache);
    return repo.find({ where: { type: "Seance", dateDebut: Between(startDate, endDate) } });
};

