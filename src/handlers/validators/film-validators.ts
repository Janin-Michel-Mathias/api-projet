import Joi from "joi";

export const createMovieValidation = Joi.object<CreateMovieRequest>({
    nom: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    type: Joi.string().min(1).required(),
    duree: Joi.number().min(1).required()
}).options({ abortEarly: false });

export interface CreateMovieRequest {
    nom: string,
    description: string,
    type: string,
    duree: number
}

export const updateMovieValidation = Joi.object<UpdateMovieRequest>({
    idFilm: Joi.number().required(),
    nom: Joi.string().min(1).optional(),
    description: Joi.string().min(1).optional(),
    type: Joi.string().min(1).optional(),
    duree: Joi.number().min(1).optional()
}).options({ abortEarly: false });

export interface UpdateMovieRequest {
    idFilm: number,
    nom?: string,
    description?: string,
    type?: string,
    duree?: number
}