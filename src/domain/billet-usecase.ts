import { DataSource } from "typeorm";
import { Billet } from "../database/entities/Billet";

export interface UpdateBilletRequest {
    type?: string,
    prix?: number,
    utilisation?: number,
    idSpectateur?: number
}

export class BilletUsecase {
    constructor(private readonly db: DataSource) { }

    async getBillet(idBillet: number): Promise<Billet | null > {
        const repo = this.db.getRepository(Billet)
        const billetFound = await repo.findOneBy({idBillet})
        if (billetFound === null ) return null
        return billetFound
    }

    async deleteBillet(idBillet: number): Promise<Billet | null> {
        const repo = this.db.getRepository(Billet)
        const billetfound = await repo.findOneBy({ idBillet })
        if (billetfound === null) return null

        const billetDelete = await repo.remove(billetfound)
        return billetDelete
    }
}