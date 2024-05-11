import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Tache } from "./Tache";

@Entity({ name: "Place" })
export class Place {
    @PrimaryGeneratedColumn()
    idPlace: number;

    @Column()
    numSiege: string;

    @Column()
    idSeance: number;

    constructor(
        idPlace: number,
        numSiege: string,
        idSeance: number
    ) {
        this.idPlace = idPlace;
        this.numSiege = numSiege;
        this.idSeance = idSeance;
    }
}
