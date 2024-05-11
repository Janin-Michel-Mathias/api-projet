import Joi from "joi";

export interface CreateTacheRequest {
    nom: string;
    type: "Seance" | "Travail" | "Maintenance";
    dateDebut: Date;
    dateFin: Date;
    idFilm: number;
    idSalle: number;
    prix?: number;
}

export const createTacheValidation = Joi.object<CreateTacheRequest>({
    nom: Joi.string().min(1).required(),
    type: Joi.string().valid("Seance", "Travail", "Maintenance").required(),
    dateDebut: Joi.date().iso().required(),
    dateFin: Joi.date().iso().required(),
    idFilm: Joi.number().required(),
    idSalle: Joi.number().required(),
    prix: Joi.number().min(0),
}).options({ abortEarly: false });

export interface GetTacheRequest {
    id: number;
}

export const getTacheValidation = Joi.object<GetTacheRequest>({
    id: Joi.number().required(),
});

export interface UpdateTacheRequest {
    id: number;
    nom?: string;
    type?: "Seance" | "Travail" | "Maintenance";
    dateDebut?: Date;
    dateFin?: Date;
    idFilm?: number;
    idSalle?: number;
    prix?: number;
}

export const updateTacheValidation = Joi.object<UpdateTacheRequest>({
    id: Joi.number().required(),
    nom: Joi.string().min(1),
    type: Joi.string().valid("Seance", "Travail", "Maintenance"),
    dateDebut: Joi.date().iso(),
    dateFin: Joi.date().iso(),
    idFilm: Joi.number(),
    idSalle: Joi.number(),
    prix: Joi.number().min(0),
}).options({ abortEarly: false });

export interface deleteTacheValidation {
    id: number;
}

export const deleteTacheValidation = Joi.object<deleteTacheValidation>({
    id: Joi.number().required(),
});