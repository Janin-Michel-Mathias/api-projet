import Joi from "joi";


export interface tacheRequest {
    nom: string;
    type: string;
    dateDebut: Date;
    dateFin: Date;
    idFilm: number;
}


export const tacheValidation = Joi.object<CreateTacheRequest>({
    nom: Joi.string().min(1).required(),
    type: Joi.string().min(1).required(),
    dateDebut: Joi.date().iso().required(),
    dateFin: Joi.date().iso().required(),
}).options({ abortEarly: false });

export interface CreateTacheRequest {
    nom: string;
    type: string;
    dateDebut: Date;
    dateFin: Date;
}

export interface GetTacheRequest {
    id: number
}

export const getTacheValidation = Joi.object<GetTacheRequest> ({
    id: Joi.number().required()
})

export interface UpdateTacheRequest {
    id: number;
    nom?: string;
    type?: string;
    dateDebut?: Date;
    dateFin?: Date;
    idFilm?: number;
}

export const updateTacheValidation = Joi.object<UpdateTacheRequest> ({
    id: Joi.number().required(),
    nom: Joi.string().min(1),
    type: Joi.string().valid("Seance", "Travail", "Maintenance"),
    dateDebut: Joi.date().iso(),
    dateFin: Joi.date().iso(),
    idFilm: Joi.number(),
}).options({ abortEarly: false });


export interface DeleteTacheRequest {
    id: number
}

export const deleteTacheValidation = Joi.object<DeleteTacheRequest>({
    id: Joi.number().required()
})