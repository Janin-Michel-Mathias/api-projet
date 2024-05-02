import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Spectateur" })
export class Spectateur {
    @PrimaryGeneratedColumn()
    idSpectateur: number;

    @Column()
    nom: string;

    @Column()
    prenom: string;

    @Column()
    sexe: string;

    @Column({ type: "date" })
    date_naissance: Date;

    constructor(
        idSpectateur: number,
        nom: string,
        prenom: string,
        sexe: string,
        date_naissance: Date
    ) {
        this.idSpectateur = idSpectateur;
        this.nom = nom;
        this.prenom = prenom;
        this.sexe = sexe;
        this.date_naissance = date_naissance;
    }
}
