import * as joi from "joi";

export const joiValitadioSchema = joi.object({
    mongoUrl: joi.required(),
    port: joi.number().default(3006),
    defaultLimit: joi.number().default(7)
});