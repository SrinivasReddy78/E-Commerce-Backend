import joi from 'joi'
import { IChangePasswordRequestBody, IForgotPasswordRequestBody, ILoginUserRequestBody, IRegisterUserRequestBody, IResetPasswordRequestBody } from '../types/userType'

export const validateRegisterBody = joi.object<IRegisterUserRequestBody>({
    name: joi.string().min(2).max(72).trim().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(24).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
    phoneNumber:  joi.string().min(10).max(15).pattern(/^[0-9]+$/).required(),
    consent: joi.boolean().valid(true).required()
})

export const validateLoginBody = joi.object<ILoginUserRequestBody>({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(24).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
})

export const validateForgotPasswordBody = joi.object<IForgotPasswordRequestBody>({
    email: joi.string().email().required()
})

export const validateResetPasswordBody = joi.object<IResetPasswordRequestBody>({
    newPassword: joi.string().min(8).max(24).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
})

export const validateChangePasswordBody = joi.object<IChangePasswordRequestBody>({
    oldPassword: joi.string().min(8).max(24).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
    newPassword: joi.string().min(8).max(24).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
    confirmNewPassword: joi.string().min(8).max(24).trim().valid(joi.ref('newPassword')).required()
})

export const validateJoiSchema = <T> (schema: joi.Schema, value: unknown) => {
    const result = schema.validate(value)

    return {
        value: result.value as T,
        error: result.error
    }
}