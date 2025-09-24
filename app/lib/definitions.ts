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

// --- Schemas de Validação Zod ---

export const UserRegistrationSchema = z.object({
    name: z
        .string()
        .min(2, { error: 'Nome precisa ter no mínimo 2 caracteres.' })
        .trim(),
    email: z
        .email({ error: 'Por favor, insira um email válido.' })
        .trim(),
    password: z
        .string()
        .min(8, { error: 'A senha deve ter no mínimo 8 caracteres.' })
        .regex(/[a-zA-Z]/, { error: 'A senha deve conter pelo menos uma letra.' })
        .regex(/[0-9]/, { error: 'A senha deve conter pelo menos um número.' })
        .regex(/[^a-zA-Z0-9]/, { error: 'A senha deve conter pelo menos um caractere especial.' })
        .trim(),
    confirmPassword: z
        .string()
        .trim(),
    role: z.enum(['SUPER_ADMIN', 'COMPANY_ADMIN', 'USER', 'END_CUSTOMER'], { error: 'Função inválida.' })
}).refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não correspondem.",
    path: ["confirmPassword"],
});

export const UpdateUserSchema = z.object({
    id: z.string(),
    name: z.string().min(3, { error: 'O nome completo deve ter pelo menos 3 caracteres.' }),
    jobTitle: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'COMPANY_ADMIN', 'USER', 'END_CUSTOMER'], { error: 'Função inválida.' })
});