import { Express, Request, Response } from 'express';
import { AppDataSource } from "../../database/database";
import { generateValidationErrorMessage } from "../../handlers/validators/generate-validation-message";
import { createSeanceValidation } from '../../handlers/validators/seance-validation';
import { Salle } from '../../database/entities/Salle';
import { Film } from '../../database/entities/Film';
import { Tache } from "../../database/entities/Tache";
import { Between, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual } from 'typeorm';
import { date } from 'joi';
import { authAdmin } from '../../middlewares/authAdmin';

function estEntre9hEt20h(date: { getHours: () => any; }) {
    const heure = date.getHours();
    return heure >= 9 && heure < 20;
}
function nEstPasWeekend(date: { getDay: () => any; }) {
    const jour = date.getDay();
    // Si le jour est compris entre 1 (lundi) et 5 (vendredi), ce n'est pas le week-end
    return jour > 0 && jour < 6;
}

export const createSeance = (app: Express) => {
    app.post('/seances', authAdmin, async (req: Request, res: Response) => {
        const validate = createSeanceValidation.validate(req.body);

        if (validate.error) {
            res.status(400).send(generateValidationErrorMessage(validate.error.details));
            return;
        }


        const request = validate.value;
        const repo = AppDataSource.getRepository(Tache);


        const salleRepo = AppDataSource.getRepository(Salle);
        const salleFound = await salleRepo.findOne({ where: { idSalle: request.idSalle } });
        if (!salleFound) return res.status(404).json({ error: 'Salle not found' });


        const filmRepo = AppDataSource.getRepository(Film);
        const filmFound = await filmRepo.findOne({ where: { idFilm: request.idFilm } });
        if (!filmFound) return res.status(404).json({ error: 'Film not found' });


        const duration = filmFound.duree + 30
        const type = "Seance";

        const nom = !request.nom ? "Seance de " + filmFound.nom : request.nom;
        let seance = { ...request, dateFin: new Date(request.dateDebut.getTime() + duration * 60000), type: type, nom: nom }



        const evenementsChevauchants = await repo.find({
            where: [
                {
                    idSalle: seance.idSalle, // Même salle que la séance
                    dateDebut: LessThan(seance.dateFin), // Commence avant la fin de votre séance
                    dateFin: MoreThan(seance.dateDebut)  // Se termine après le début de votre séance
                },
                {
                    idSalle: seance.idSalle, // Même salle que la séance
                    dateDebut: LessThan(seance.dateFin), // Commence avant la fin de votre séance
                    dateFin: Between(seance.dateDebut, seance.dateFin) // Se termine pendant votre séance
                },
                {
                    idSalle: seance.idSalle, // Même salle que la séance
                    dateDebut: LessThanOrEqual(seance.dateDebut), // Commence avant ou en même temps que votre séance
                    dateFin: MoreThanOrEqual(seance.dateFin) // Se termine après ou en même temps que votre séance
                }
            ]
        });

        if (!estEntre9hEt20h(seance.dateDebut)) return res.status(409).json({ error: 'Ouvert de 9h jusqu\'à 20h ! Heure début incorrect' });
        if (!estEntre9hEt20h(seance.dateFin)) return res.status(409).json({ error: 'Ouvert de 9h jusqu\'à 20h ! Heure fin incorrect' });
        if (!nEstPasWeekend(seance.dateDebut)) return res.status(409).json({ error: 'On ne travaille pas le weekend !' });
        if (evenementsChevauchants.length > 0) return res.status(409).json({ error: 'La salle n\'est pas disponible !' });

        try {
            const tacheCreated = await repo.save(seance);
            res.status(201).send(tacheCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal Error" });
        }
    });
};
