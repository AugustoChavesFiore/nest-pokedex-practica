import * as joi from "joi";

export const joiValitadioSchema = joi.object({
    MONGO_URL: joi.required(),
    PORT: joi.number().default(3006),
    defaultLimit: joi.number().default(7)
});