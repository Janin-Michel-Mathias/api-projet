import Joi from "joi";

export const createSeanceValidation = Joi.object<CreateSeanceRequest>({
    nom: Joi.string().optional(),
    dateDebut: Joi.date().iso().required(),
    idFilm: Joi.number().required(),
    idSalle: Joi.number().required(),
}).options({ abortEarly: false });

export interface CreateSeanceRequest {
    nom?: string,
    dateDebut: Date,
    idFilm: number,
    idSalle: number,
}

export interface GetSeanceRequest {
    id: number
}

export const getSeanceValidation = Joi.object<GetSeanceRequest>({
    id: Joi.number().required(),
});

export interface DeleteSeanceRequest {
    id: number
}

export const deleteSeanceValidation = Joi.object<DeleteSeanceRequest>({
    id: Joi.number().required(),
});

export const seanceFilteringValidation = Joi.object<SeanceFilteringRequest>({
    dateDebut: Joi.date().iso().optional(),
    dateFin: Joi.date().iso().optional(),
    film: Joi.string().optional(),
}).options({ abortEarly: false });

export interface SeanceFilteringRequest {
    dateDebut?: Date,
    dateFin?: Date,
    film?: string,
}