import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity({name: "Transaction"})
export class Transaction {
    @PrimaryGeneratedColumn()
    idTransaction: number;

    @Column()
    montant: number;

    @Column()
    date: Date;

    @Column()
    type: string;

    @Column()
    idSpectateur: number;

    constructor(
        idTransaction: number,
        montant: number,
        date: Date,
        type: string,
        idSpectateur: number
    ) {
        this.idTransaction = idTransaction;
        this.montant = montant;
        this.date = date;
        this.type = type;
        this.idSpectateur = idSpectateur;
    }
}