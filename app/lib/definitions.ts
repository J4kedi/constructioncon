import { z } from "zod";

export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Nome precisa ser no mínimo de dois caracteres' })
        .trim(),
    email: z
        .email({ message: 'Coloque um email válido' })
        .trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
        })
        .trim(),
    confirmPassword: z
    .string()
    .trim()
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não correspondem.",
    path: ["confirmPassword"],
});

export type FormState = 
    |    {
            errors?: {
                name?: string[]
                email?: string[]
                password?: string[]
                confirmPassword?: string[]
            }
            message?: string
        }
    |   undefined