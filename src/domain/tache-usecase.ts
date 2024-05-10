import { DataSource } from "typeorm";
import { Tache } from "../database/entities/Tache";

export interface UpdateTacheRequest {
    nom: string,
    type: string,
    dateDebut: Date,
    dateFin: Date,
    idFilm: number
}

export class TacheUsecase {
    constructor(private readonly db: DataSource) { }

    async getTache(idTache: number): Promise<Tache | null > {
        const repo = this.db.getRepository(Tache)
        if (await repo.findOneBy({ idTache }) === null ) return null
        return await repo.findOneBy({ idTache })
    }

    async deleteTache(idTache: number): Promise<Tache | null> {
        const repo = this.db.getRepository(Tache)
        const tachefound = await repo.findOneBy({ idTache })
        if (tachefound === null) return null

        const tacheDelete = await repo.remove(tachefound)
        return tacheDelete
    }
}