import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Salle" })
export class Salle {
    @PrimaryGeneratedColumn()
    idSalle: number;

    @Column()
    nom: string;

    @Column()
    description: string;

    @Column()
    capacite: number;

    @Column({ default: false })
    accesHandicap: boolean;

    @Column()
    etat: string;

    constructor(
        idSalle: number,
        nom: string,
        description: string,
        capacite: number,
        accesHandicap: boolean,
        etat: string
    ) {
        this.idSalle = idSalle;
        this.nom = nom;
        this.description = description;
        this.capacite = capacite;
        this.accesHandicap = accesHandicap;
        this.etat = etat;
    }
}
