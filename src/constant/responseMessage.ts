export default {
    SUCCESS: `The Operation has been Sucessful`,
    SOMETHING_WENT_WRONG: `Something went wrong`,
    NOT_FOUND: (entity: string)=> `${entity} not found`,
    TOO_MANY_REQUESTS : `Too Many Requests. Try again after sometime`,
    INVALID_PHONE_NUMBER : `Invaild Phone Number`,
    ALREADY_EXIST: (entity: string, identifier: string) => `${entity} is already exist with ${identifier}`,
    CREATED_SUCCESSFULLY: (entity: string) => `${entity} created successfully`,
    INVALID_CONFIRMATION_TOKEN_OR_CODE : `Invalid Confirmation Token or Code`,
    ACCOUNT_ALREADY_CONFIRMED: `Account already confirmed`,
    INVALID_EMAIL_OR_PASSWORD: `Invalid Email or Password`
}