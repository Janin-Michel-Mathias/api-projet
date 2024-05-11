import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Billet } from "./Billet";

@Entity({ name: "Place" })
export class Place {
    @PrimaryGeneratedColumn()
    idPlace: number;

    @Column()
    idBillet: number

    @Column()
    idSeance: number;

    constructor(
        idPlace: number,
        idBillet: number,
        idSeance: number
    ) {
        this.idPlace = idPlace;
        this.idBillet = idBillet;
        this.idSeance = idSeance;
    }
}
