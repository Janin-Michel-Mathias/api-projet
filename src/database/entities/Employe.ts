import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Employe" })
export class Employe {
    @PrimaryGeneratedColumn()
    idEmploye: number

    @Column()
    nom: string

    @Column()
    mdp: string

    @Column()
    role: string

    @Column()
    poste: string


    constructor(id: number, name: string, password: string, token: string, role: string, poste: string) {
        this.idEmploye = id
        this.nom = name
        this.mdp = password
        this.role = role
        this.poste = poste
    }
}