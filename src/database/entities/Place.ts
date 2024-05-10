import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Tache } from "./Tache";

@Entity({ name: "Billet" })
export class Billet {
    @PrimaryGeneratedColumn()
    idBillet: number;

    @Column()
    prix: number;

    @Column()
    numSiege: string;

    @ManyToOne(() => Tache, tache => tache.idTache)
    idTache: number;

    constructor(
        idBillet: number,
        prix: number,
        numSiege: string,
        idTache: number
    ) {
        this.idBillet = idBillet;
        this.prix = prix;
        this.numSiege = numSiege;
        this.idTache = idTache;
    }
}
