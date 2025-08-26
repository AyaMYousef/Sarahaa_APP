import Joi from "joi";
import { GenderEnum } from "../../src/common/user.enum.js";


export const SignUpSchema = {
    body: Joi.object({
        firstName: Joi.string().alphanum().required().messages({
            'string.base': 'First Name must be a string',
            'any.required': 'First name is required'

        }
        ),
        lastName: Joi.string().alphanum().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')),
        age: Joi.string().min(18).required(),
        gender: Joi.string().valid(...Object.values(GenderEnum)).required(),
        phoneNumber: Joi.string().required(),

    })
}

