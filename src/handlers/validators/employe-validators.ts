import Joi from "joi";

export const createEmployeValidation = Joi.object<CreateEmployeRequest>({
    nom: Joi.string().min(1).required(),
    mdp: Joi.string().min(8).required(),
    role: Joi.string().min(1).required(),
    poste: Joi.string().min(1).required(),
    email: Joi.string().email().required()
}).options({ abortEarly: false });

export interface CreateEmployeRequest {
    nom: string,
    mdp: string,
    role: string,
    poste: string,
    email: string
}

export const updateEmployeValidation = Joi.object<UpdateEmployeRequest>({
    idEmploye: Joi.number().required(),
    nom: Joi.string().min(1).optional(),
    mdp: Joi.string().min(8).optional(),
    role: Joi.string().min(1).optional(),
    poste: Joi.string().min(1).optional(),
    email: Joi.string().email().optional()
}).options({ abortEarly: false });

export interface UpdateEmployeRequest {
    idEmploye: number,
    nom?: string,
    mdp?: string,
    role?: string,
    poste?: string,
    email?: string
}