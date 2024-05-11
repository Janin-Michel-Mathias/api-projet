import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "Tache" })
export class Tache {
  @PrimaryGeneratedColumn()
  idTache: number;

  @Column()
  nom?: string;

  @Column()
  type: string;

  @Column()
  dateDebut: Date;

  @Column()
  dateFin: Date;

  @Column()
  idFilm?: number;

  @Column()
  idSalle?: number;

  constructor(
    idTache: number,
    type: string,
    dateDebut: Date,
    dateFin: Date,
    nom?: string,
    idFilm?: number,
    idSalle?: number,
  ) {
    this.idTache = idTache;
    this.nom = nom;
    this.type = type;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.idFilm = idFilm;
    this.idSalle = idSalle;
  }
}
