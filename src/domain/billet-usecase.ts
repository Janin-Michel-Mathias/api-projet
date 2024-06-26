import { DataSource } from "typeorm";
import { Billet } from "../database/entities/Billet";
import { AppDataSource } from "../database/database";

export interface BilletRequest {
    type: string,
    prix: number,
    utilisation: number,
    idSpectateur: number
}

export class BilletUsecase {
    constructor(private readonly db: DataSource = AppDataSource) { }

    async getBillet(idBillet: number): Promise<Billet | null> {
        const repo = this.db.getRepository(Billet)
        const billetFound = await repo.findOneBy({ idBillet })
        if (billetFound === null) return null
        return billetFound
    }

    async deleteBillet(idBillet: number): Promise<Billet | null> {
        const repo = this.db.getRepository(Billet)
        const billetfound = await repo.findOneBy({ idBillet })
        if (billetfound === null) return null

        const billetDelete = await repo.remove(billetfound)
        return billetDelete
    }

    async createBillet(billetData: BilletRequest): Promise<Billet> {
        const repo = this.db.getRepository(Billet);
        const newBillet = repo.create(billetData);
        return await repo.save(newBillet);
    }
}
