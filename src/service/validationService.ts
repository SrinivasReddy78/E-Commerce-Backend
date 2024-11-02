import joi from 'joi'
import { IRegisterUserRequestBody } from '../types/userType'

export const validateRegisterBody = joi.object<IRegisterUserRequestBody>({
    name: joi.string().min(2).max(72).trim().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(24).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
    phoneNumber:  joi.string().min(10).max(15).pattern(/^[0-9]+$/).required(),
    consent: joi.boolean().valid(true).required()
})

export const validateJoiSchema = <T> (schema: joi.Schema, value: unknown) => {
    const result = schema.validate(value)

    return {
        value: result.value as T,
        error: result.error
    }
}