import Joi from 'joi';

export const createSpectateurValidation = Joi.object<CreateSpectateurRequest>({
    nom: Joi.string().min(1).required(),
    prenom: Joi.string().min(1).required(),
    sexe: Joi.string().min(1).required(),
    date_naissance: Joi.date().iso().required(),
    email: Joi.string().email().required(),
    mdp: Joi.string().min(8).required()
}).options({ abortEarly: false });

export interface CreateSpectateurRequest {
    nom: string,
    prenom: string,
    sexe: string,
    date_naissance: Date,
    email: string,
    mdp: string
}

export const updateSpectateurValidation = Joi.object<UpdateSpectateurRequest>({
    idSpectateur: Joi.number().required(),
    nom: Joi.string().min(1).optional(),
    prenom: Joi.string().min(1).optional(),
    sexe: Joi.string().min(1).optional(),
    date_naissance: Joi.date().iso().optional(),
    email: Joi.string().email().optional(),
    mdp: Joi.string().min(8).optional()
}).options({ abortEarly: false });

export interface UpdateSpectateurRequest {
    idSpectateur: number,
    nom?: string,
    prenom?: string,
    sexe?: string,
    date_naissance?: Date,
    email?: string,
    mdp?: string
}