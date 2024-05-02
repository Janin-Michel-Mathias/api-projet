import Joi from "joi";

export interface SalleRequest {
    nom: string,
    description: string,
    images: string,
    capacite: number,
    accesHandicap: boolean,
    etat: string
}

export const salleValidation = Joi.object<SalleRequest>({
    nom: Joi.string()
        .required(),
    description: Joi.string()
        .required()
        .min(2),
    images: Joi.string(),
    capacite: Joi.number()
        .required()
        .min(1),
    accesHandicap: Joi.bool()
        .default(false),
    etat: Joi.string()
}).options({ abortEarly: false });


export interface UpdateSalleRequest {
    id: number
    nom?: string,
    description?: string,
    images?: string,
    capacite?: number,
    accesHandicap?: boolean,
    etat?: string 
}

export const updateSalleValidation = Joi.object<UpdateSalleRequest> ({
    id: Joi.number().required(),
    nom: Joi.string(),
    description: Joi.string().min(2),
    images: Joi.string(),
    capacite: Joi.number().min(15).max(30),
    accesHandicap: Joi.bool(),
    etat: Joi.string().valid("Prêt", "En maintenance", "Occupé", "Fermé")
}).options({ abortEarly: false });
