import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Employe" })
export class Employe {
    @PrimaryGeneratedColumn()
    idEmploye: number

    @Column()
    nom: string

    @Column()
    email: string

    @Column()
    mdp: string

    @Column()
    role: string

    @Column()
    poste: string


    constructor(id: number, name: string, password: string, token: string, role: string, poste: string, email: string) {
        this.idEmploye = id
        this.nom = name
        this.mdp = password
        this.role = role
        this.poste = poste
        this.email = email
    }
}