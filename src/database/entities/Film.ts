import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Film" })
export class Film {
    @PrimaryGeneratedColumn()
    idFilm: number;

    @Column()
    nom: string;

    @Column()
    description: string;

    @Column()
    type: string;

    @Column()
    duree: number;

    constructor(
        idFilm: number,
        nom: string,
        description: string,
        type: string,
        duree: number
    ) {
        this.idFilm = idFilm;
        this.nom = nom;
        this.description = description;
        this.type = type;
        this.duree = duree;
    }
}
