import Joi from 'joi';

export const loginValidation = Joi.object<LoginRequest>({
    email: Joi.string().email().required(),
    mdp: Joi.string().min(8).required()
}).options({ abortEarly: false });

export interface LoginRequest {
    email: string,
    mdp: string
}