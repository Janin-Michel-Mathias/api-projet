import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./Image"

@Entity({ name: "Salle" })
export class Salle {
    @PrimaryGeneratedColumn()
    idSalle: number;

    @Column()
    nom: string;

    @Column()
    description: string;

    @OneToMany(() => Image, (image) => image.idSalle)
    images: Image[];

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
        images: Image[],
        capacite: number,
        accesHandicap: boolean,
        etat: string
    ) {
        this.idSalle = idSalle;
        this.nom = nom;
        this.description = description;
        this.images = images;
        this.capacite = capacite;
        this.accesHandicap = accesHandicap;
        this.etat = etat;
    }
}
