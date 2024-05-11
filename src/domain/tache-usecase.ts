import { DataSource } from "typeorm";
import { Tache } from "../database/entities/Tache";

export interface UpdateTacheRequest {
  nom?: string;
  type?: "Seance" | "Travail" | "Maintenance";
  dateDebut?: Date;
  dateFin?: Date;
  idFilm?: number;
  idSalle?: number;
  prix?: number;
}

export class TacheUsecase {
  constructor(private readonly db: DataSource) { }

  async getTache(idTache: number): Promise<Tache | null> {
    const repo = this.db.getRepository(Tache);
    if ((await repo.findOneBy({ idTache })) === null) return null;
    return await repo.findOneBy({ idTache });
  }

  async createTache(tache: Tache): Promise<Tache> {
    const repo = this.db.getRepository(Tache);
    return await repo.save(tache);
  }

  async deleteTache(idTache: number): Promise<Tache | null> {
    const repo = this.db.getRepository(Tache)
    const tachefound = await repo.findOneBy({ idTache })
    if (tachefound === null) return null

    const tacheDelete = await repo.remove(tachefound)
    return tacheDelete
  }

}
