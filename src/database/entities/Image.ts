import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Salle } from "./Salle";


@Entity({ name : "Image"})
export class Image {

    @PrimaryGeneratedColumn()
    idImage: number

    @ManyToOne(() => Salle, (salle) => salle.images)
    idSalle: number

    @Column()
    nom: string

    constructor(idImage: number, idSalle: number, nom: string){
        this.idImage = idImage;
        this.idSalle = idSalle;
        this.nom = nom;
    }
}