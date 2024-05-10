import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Spectateur } from "./Spectateur";

@Entity({ name: "Billet" })
export class Billet {
    @PrimaryGeneratedColumn()
    idBillet: number;

    @Column()
    prix: number;

    @Column()
    utilisation: number;

    @ManyToOne(() => Spectateur, Spectateur => Spectateur.idSpectateur)
    idSpectateur: number;

    constructor(
        idBillet: number,
        prix: number,
        utilisation: number,
        idSpectateur: number
    ) {
        this.idBillet = idBillet;
        this.prix = prix;
        this.utilisation = utilisation;
        this.idSpectateur = idSpectateur;
    }
}
