import { DataSource } from "typeorm";
import { Place } from "../database/entities/Place";
import { AppDataSource } from "../database/database";

export interface PlaceRequest {
    idPlace: number,
    idBillet: number,
    idSeance: number
}

export class PlaceUsecase {
    constructor(private readonly db: DataSource = AppDataSource) { }

    async getPlace(idPlace: number): Promise<Place | null> {
        const repo = this.db.getRepository(Place)
        const placeFound = await repo.findOneBy({ idPlace })
        if (placeFound === null) return null
        return placeFound
    }

    async deletePlace(idPlace: number): Promise<Place | null> {
        const repo = this.db.getRepository(Place)
        const placefound = await repo.findOneBy({ idPlace })
        if (placefound === null) return null

        const placeDelete = await repo.remove(placefound)
        return placeDelete
    }

    async createPlace(placeData: PlaceRequest): Promise<Place> {
        const repo = this.db.getRepository(Place);
        const newPlace = repo.create(placeData);
        return await repo.save(newPlace);
    }
}
