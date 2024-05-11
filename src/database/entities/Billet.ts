import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity({ name: "Billet" })
export class Billet {
    @PrimaryGeneratedColumn()
    idBillet: number;

    @Column()
    type: string

    @Column()
    prix: number;

    @Column()
    utilisation: number;

    @Column()
    idSpectateur: number;

    constructor(
        idBillet: number,
        type: string,
        prix: number,
        utilisation: number,
        idSpectateur: number
    ) {
        this.idBillet = idBillet;
        this.type = type;
        this.prix = prix;
        this.utilisation = utilisation;
        this.idSpectateur = idSpectateur;
    }
}
