import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Spectateur" })
export class Spectateur {
    @PrimaryGeneratedColumn()
    idSpectateur: number;

    @Column()
    nom: string;

    @Column()
    email: string;

    @Column()
    mdp: string;

    @Column()
    prenom: string;

    @Column()
    sexe: string;

    @Column({ type: "date" })
    date_naissance: Date;

    @Column()
    solde: number;

    constructor(
        idSpectateur: number,
        nom: string,
        prenom: string,
        sexe: string,
        date_naissance: Date,
        email: string,
        mdp: string,
        solde: number
    ) {
        this.idSpectateur = idSpectateur;
        this.nom = nom;
        this.prenom = prenom;
        this.sexe = sexe;
        this.date_naissance = date_naissance;
        this.email = email;
        this.mdp = mdp;
        this.solde = solde;
    }
}
