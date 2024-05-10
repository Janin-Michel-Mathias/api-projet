import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Film } from "./Film";

@Entity({ name: "Tache" })
export class Tache {
    @PrimaryGeneratedColumn()
    idTache: number;

    @Column()
    nom: string;

    @Column()
    type: string;

    @Column({ type: "date" })
    dateDebut: Date;

    @Column({ type: "date" })
    dateFin: Date;

    @ManyToOne(() => Film, film => film.idFilm)
    idFilm: number;

    constructor(
        idTache: number,
        nom: string,
        type: string,
        dateDebut: Date,
        dateFin: Date,
        idFilm: number
    ) {
        this.idTache = idTache;
        this.nom = nom;
        this.type = type;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.idFilm = idFilm;
    }
}
