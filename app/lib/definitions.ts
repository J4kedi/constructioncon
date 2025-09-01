import { z } from "zod";

// --- Estados de Formulário para Server Actions ---
export interface RegisterState {
    error?: string;
    success?: boolean;
}

export interface LoginState {
    error?: string;
    success?: boolean;
}

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

// --- Schemas de Validação Zod ---

export const RegisterSchema = z.object({
    fullName: z.string().min(3, { message: 'O nome completo é obrigatório.' }),
    email: z.email({ message: 'Por favor, insira um email válido.' }),
    password: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});

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