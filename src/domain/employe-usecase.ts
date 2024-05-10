import {DataSource} from "typeorm";
import {Employe} from "../database/entities/Employe";

export interface UpdateEmployeRequest {
    nom?: string,
    mdp?: string,
    role?: string,
    poste?: string
}

export class EmployeUsecase {
    constructor(private readonly db: DataSource) { }

    
}