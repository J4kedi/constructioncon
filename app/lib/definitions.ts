import { z } from "zod";
import { UnidadeMedida } from "@prisma/client";

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
        .min(2, { message: 'Nome precisa ter no mínimo 2 caracteres.' })
        .trim(),
    email: z
        .email({ message: 'Por favor, insira um email válido.' })
        .trim(),
    password: z
        .string()
        .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
        .regex(/[a-zA-Z]/, { message: 'A senha deve conter pelo menos uma letra.' })
        .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'A senha deve conter pelo menos um caractere especial.' })
        .trim(),
    confirmPassword: z
        .string()
        .trim(),
    role: z.enum(['SUPER_ADMIN', 'COMPANY_ADMIN', 'USER', 'END_CUSTOMER'], { error: 'Função inválida.' })
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não correspondem.",
    path: ["confirmPassword"],
});

export const UpdateUserSchema = z.object({
    id: z.string(),
    name: z.string().min(3, { message: 'O nome completo deve ter pelo menos 3 caracteres.' }),
    jobTitle: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'COMPANY_ADMIN', 'USER', 'END_CUSTOMER'], { error: 'Função inválida.' })
});

export const ObraSchema = z.object({
    id: z.string().optional(),
    obraType: z.enum(['RESIDENCIAL', 'COMERCIAL'], { error: "Tipo de obra inválido." }),
    nome: z.string().min(3, { message: "O nome da obra deve ter pelo menos 3 caracteres." }),
    endCustomerName: z.string().min(3, { message: "O nome do cliente final deve ter pelo menos 3 caracteres." }),
    orcamentoTotal: z.coerce.number().gt(0, { message: "O orçamento deve ser maior que zero." }),
    dataInicio: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Data de início inválida." }),
    dataPrevistaFim: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Data de fim prevista inválida." }),
    address: z.string().optional(),
    endCustomerId: z.string().optional(),
});

export const UpdateObraSchema = ObraSchema.omit({ obraType: true }).partial().extend({
    id: z.string(),
});

export const CatalogoItemSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, { message: "O nome do item deve ter pelo menos 3 caracteres." }),
  descricao: z.string().optional(),
  unidade: z.nativeEnum(UnidadeMedida, { error: "Unidade de medida inválida." }),
  categoria: z.string().optional(),
  custoUnitario: z.coerce.number().min(0, { message: "O custo não pode ser negativo." }),
  nivelMinimo: z.coerce.number().min(0, { message: "O nível mínimo não pode ser negativo." }),
});

export const EstoqueEntradaSchema = z.object({
  catalogoItemId: z.string().min(1, { message: "Você deve selecionar um item." }),
  quantidade: z.coerce.number().gt(0, { message: "A quantidade deve ser maior que zero." }),
  supplierId: z.string().min(1, { message: "Você deve selecionar um fornecedor." }),
});

export const EstoqueSaidaSchema = z.object({
  catalogoItemId: z.string().min(1, { message: "Você deve selecionar um item." }),
  quantidade: z.coerce.number().gt(0, { message: "A quantidade deve ser maior que zero." }),
  obraDestinoId: z.string().min(1, { message: "Você deve selecionar uma obra de destino." }),
});
