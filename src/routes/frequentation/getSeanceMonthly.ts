import { Express, Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Tache } from '../../database/entities/Tache';
import { Between } from 'typeorm/find-options/operator/Between';
import { SeanceFilteringRequest } from '../../handlers/validators/seance-validation';
import { Film } from '../../database/entities/Film';
import { Place } from '../../database/entities/Place';
import { date } from 'joi';

export const getSeancesForCurrentMonth = (app: Express) => {
    app.get('/freq/seances/monthly', async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Place);

        try {
            const currentDate = new Date();
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

            const seances = await getSeancesFiltered(startOfMonth, endOfMonth)

            if (!seances || seances.length === 0) {
                return res.status(404).json({ error: 'No seances found for the current month' });
            }


            const places = await Promise.all(seances.map(async seance => {
                return {
                    idSeance: seance.idTache,
                    nomSeance: seance.nom,
                    dateDebut: seance.dateDebut,
                    places: await repo.find({ where: { idSeance: seance.idTache } })
                };
            }));



            res.status(200).json(places);
        } catch (error) {
            console.error('Error fetching seances for the current month:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};


const getSeancesFiltered = async (startDate: Date, endDate: Date) => {
    const currentDate = new Date();

    const repo = AppDataSource.getRepository(Tache);
    return repo.find({ where: { type: "Seance", dateDebut: Between(startDate, endDate) } });
};

