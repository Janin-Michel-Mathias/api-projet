import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Tache } from "./Tache";

@Entity({ name: "Place" })
export class Place {
    @PrimaryGeneratedColumn()
    idPlace: number;

    @Column()
    prix: number;

    @Column()
    numSiege: string;

    @ManyToOne(() => Tache, tache => tache.idTache)
    idTache: number;

    constructor(
        idPlace: number,
        prix: number,
        numSiege: string,
        idTache: number
    ) {
        this.idPlace = idPlace;
        this.prix = prix;
        this.numSiege = numSiege;
        this.idTache = idTache;
    }
}
