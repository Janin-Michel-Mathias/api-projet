import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Tache } from '../../database/entities/Tache';
import { Between } from 'typeorm/find-options/operator/Between';
import { SeanceFilteringRequest } from '../../handlers/validators/seance-validation';
import { Film } from '../../database/entities/Film';
import { Place } from '../../database/entities/Place';

export const getSeancesForCurrentWeek = (app: Express) => {
    app.get('/freq/seances/weekly', async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Place);

        try {
            const currentDate = new Date();

            const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());

            const lastDayOfWeek = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + 6, 23, 59, 59);

            const seances = await getSeancesFiltered(firstDayOfWeek, lastDayOfWeek)

            if (!seances || seances.length === 0) {
                return res.status(404).json({ error: 'No seances found for the current week' });
            }


            const places = seances.map(seance => {
                return {
                    idSeance: seance.idTache,
                    places: repo.find({ where: { idSeance: seance.idTache } })
                };
            })


            res.status(200).json(places);
        } catch (error) {
            console.error('Error fetching seances for the current week:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};


const getSeancesFiltered = async (startDate: Date, endDate: Date) => {
    const currentDate = new Date();

    const repo = AppDataSource.getRepository(Tache);
    return repo.find({ where: { type: "Seance", dateDebut: Between(startDate, endDate) } });
};

