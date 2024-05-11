import Joi from "joi";

export interface BilletRequest {
    type: string,
    prix: number,
    utilisation: number,
    idSpectateur: number
}

export const billetValidation = Joi.object<BilletRequest>({
    type: Joi.string().required(),
    prix: Joi.number().required(),
    utilisation: Joi.number().required(),
    idSpectateur: Joi.number()
}).options({ abortEarly: false });

export interface BuyBilletRequest {
    type: "Classic" | "Super",
    quantite: number,
    idSpectateur: number
}

export const buyBilletValidation = Joi.object<BuyBilletRequest>({
    type: Joi.string().required(),
    quantite: Joi.number().min(1).required(),
    idSpectateur: Joi.number()
}).options({ abortEarly: false });



export interface DeleteBilletRequest {
    id: number
}

export const deleteBilletValidation = Joi.object<DeleteBilletRequest>({
    id: Joi.number().required()
})

export interface UpdateBilletRequest {
    id: number,
    type?: string,
    prix?: number,
    utilisation?: number
}

export const updateBilletValidation = Joi.object<UpdateBilletRequest>({
    id: Joi.number().required(),
    type: Joi.string().required().valid("Super", "Classic"),
    prix: Joi.number().required().min(0).max(99),
    utilisation: Joi.number().min(0).required()
}).options({ abortEarly: false });

export interface GetBilletRequest {
    id: number
}

export const GetBilletValidation = Joi.object<GetBilletRequest>({
    id: Joi.number().required()
})