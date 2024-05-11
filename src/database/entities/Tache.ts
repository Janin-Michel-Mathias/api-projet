import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export class Tache {
  @PrimaryGeneratedColumn()
  idTache: number;

  @Column()
  nom: string;

  @Column()
  type: "Seance" | "Travail" | "Maintenance";

  @Column()
  dateDebut: Date;

  @Column()
  dateFin: Date;

  @Column()
  idFilm?: number;

  @Column()
  idSalle?: number;

  @Column()
  prix?: number;

  constructor(
    idTache: number,
    nom: string,
    type: "Seance" | "Travail" | "Maintenance",
    dateDebut: Date,
    dateFin: Date,
    idFilm?: number,
    idSalle?: number,
    prix?: number
  ) {
    this.idTache = idTache;
    this.nom = nom;
    this.type = type;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.idFilm = idFilm;
    this.idSalle = idSalle;
    this.prix = prix;
  }
}
