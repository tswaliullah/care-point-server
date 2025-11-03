import z from "zod";

const userLoginValidationSchema = z.object({
    password: z.string().nonempty("Password is required"),
    email: z.email().nonempty("Email is required"),
})

export const LoginValidation = {
    userLoginValidationSchema
}