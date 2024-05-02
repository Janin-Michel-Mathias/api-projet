import { DataSource } from "typeorm";
import { Salle } from "../database/entities/Salle";

export interface UpdateSalleRequest {
    nom?: string,
    description?: string,
    images?: string,
    capacite?: number,
    accesHandicap?: boolean,
    etat?: string 
}

export class SalleUsecase {
    constructor(private readonly db: DataSource) { }

    async getSalle(idSalle: number): Promise<Salle | null > {
        const repo = this.db.getRepository(Salle)
        const salleFound = await repo.findOneBy({idSalle})
        if (salleFound === null ) return null
        return salleFound
    }

    async deleteSalle(idSalle: number): Promise<Salle | null> {
        const repo = this.db.getRepository(Salle)
        const sallefound = await repo.findOneBy({ idSalle })
        if (sallefound === null) return null

        const salleDelete = await repo.remove(sallefound)
        return salleDelete
    }
}