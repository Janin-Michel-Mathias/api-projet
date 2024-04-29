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
