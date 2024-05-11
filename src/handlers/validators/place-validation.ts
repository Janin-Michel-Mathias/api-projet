import Joi from "joi";

export interface CreatePlaceRequest {
    idBillet: number;
    idSeance: number;
}

export const createPlaceValidation = Joi.object<CreatePlaceRequest>({
    idBillet: Joi.number().min(1).required(),
    idSeance: Joi.number().min(1).required()
}).options({ abortEarly: false });

export interface GetPlaceRequest {
    id: number;
}

export const getPlaceValidation = Joi.object<GetPlaceRequest>({
    id: Joi.number().required(),
});

export interface UpdatePlaceRequest {
    id: number;
    nom?: string;
    type?: "Seance" | "Travail" | "Maintenance";
    dateDebut?: Date;
    dateFin?: Date;
    idFilm?: number;
    idSalle?: number;
    prix?: number;
}

export const updatePlaceValidation = Joi.object<UpdatePlaceRequest>({
    id: Joi.number().required(),
    nom: Joi.string().min(1),
    type: Joi.string().valid("Seance", "Travail", "Maintenance"),
    dateDebut: Joi.date().iso(),
    dateFin: Joi.date().iso(),
    idFilm: Joi.number(),
    idSalle: Joi.number(),
    prix: Joi.number().min(0),
}).options({ abortEarly: false });

export interface deletePlaceValidation {
    id: number;
}

export const deletePlaceValidation = Joi.object<deletePlaceValidation>({
    id: Joi.number().required(),
});