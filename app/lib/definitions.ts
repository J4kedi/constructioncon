import { z } from "zod";
import { UnidadeMedida, StatusObra, ObraType, CategoriaDespesa, UserRole, DocumentType } from "@prisma/client";
import type { User, CatalogoItem, Obra, Prisma } from '@prisma/client';
import { ReactNode } from "react";

export type CardProps = {
  title: string;
  value: string | number;
  iconName: string;
};

export type LowStockItem = {
  id: string;
  nome: string;
  unidade: UnidadeMedida;
  nivelMinimo: number;
  quantidadeAtual: number;
};



export interface RegisterState {
    error?: string;
    success?: boolean;
}

export interface LoginState {
    error?: string;
    success?: boolean;
}

export type FormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string | null;
  success?: boolean;
};

export type SessionUser = {
  id: string;
  role: UserRole;
  companyId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

// --- Tipos de Contexto de Requisição ---

export interface RequestContext {
  subdomain: string | null;
  tenantId: string | null;
  user: SessionUser | undefined;
}

export type RequiredContext = 'subdomain' | 'user';

export type PrismaQueryArgs = {
    where?: object;
    orderBy?: object | object[];
    take?: number;
    skip?: number;
};

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

export const UpdateProfileSchema = z.object({
    name: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string().min(3, { message: 'O nome completo deve ter pelo menos 3 caracteres.' }).optional()
    ),
});

export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(1, { message: "A senha antiga é obrigatória." }),
    newPassword: z.string().min(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' }),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "As novas senhas não correspondem.",
    path: ["confirmPassword"],
});

export const ObraSchema = z.object({
    id: z.string().optional(),
    type: z.enum(['RESIDENCIAL', 'COMERCIAL'], { error: "Tipo de obra inválido." }),
    nome: z.string().min(3, { message: "O nome da obra deve ter pelo menos 3 caracteres." }),
    endCustomerName: z.string().min(3, { message: "O nome do cliente final deve ter pelo menos 3 caracteres." }),
    orcamentoTotal: z.coerce.number().gt(0, { message: "O orçamento deve ser maior que zero." }),
    dataInicio: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Data de início inválida." }),
    dataPrevistaFim: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Data de fim prevista inválida." }),
    address: z.string().optional(),
    endCustomerId: z.string().optional(),
});

export type ObraData = z.infer<typeof ObraSchema>;

export const UpdateObraSchema = ObraSchema.partial().extend({
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

export const DeleteUserSchema = z.object({
  id: z.string(),
});

export const DeleteObraSchema = z.object({
  id: z.string(),
});

export type PlainCatalogoItem = Omit<CatalogoItem, 'custoUnitario' | 'nivelMinimo'> & {
  custoUnitario: number;
  nivelMinimo: number;
};

export type EstoqueItem = PlainCatalogoItem & {
  quantidadeAtual: number;
};

export type PlainUser = User;

export type UserWithCompany = Prisma.UserGetPayload<{ include: { company: true } }>;

export type GlobalUserView = User & { companyName: string };

export type PlainObra = Omit<Obra, 'orcamentoTotal' | 'currentCost' | 'dataInicio' | 'dataPrevistaFim'> & {
    orcamentoTotal: number;
    currentCost: number;
    dataInicio: string;
    dataPrevistaFim: string;
};

export type ObraWithEtapas = Prisma.ObraGetPayload<{ include: { etapas: true } }>;


export const AddDespesaSchema = z.object({
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres." }),
  valor: z.coerce.number().gt(0, { message: "O valor da despesa deve ser maior que zero." }),
  categoria: z.nativeEnum(CategoriaDespesa, { error: "Categoria inválida." }),
  data: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Data inválida." }),
  obraId: z.string().optional(),
});

import type { LucideIcon } from 'lucide-react';

export type NavLinkData = {
    children: any;
    name: string;
    href: string;
    featureKey: string;
    icon: string;
};

export type BottomLinkData = {
    name: string;
    href: string;
    icon: LucideIcon;
    isExternal?: boolean;
    onClick?: () => void;
};

export type TransactionType = 'RECEITA' | 'DESPESA';

export type Tipos_Documentos = 'contrato' | 'orçamento' | 'certidão' | 'relatórios';

export interface Documento {
    id: number;
    tipo: Tipos_Documentos;
    titulo_documento: string;
    data_emissão: Date;
    conteudo: string;
    autor: string;
    anexos?: File[];
}

export type Tipos_Recursos = 'material' | 'equipamento';

export interface Recurso {
  id: number;
  tipo: Tipos_Recursos;
  quantidade: number;
  nomeMaterial?: string;
  nomeEquipamento?: string;
}

export const DocumentoSchema = z.object({
  name: z.string().min(1, 'Nome do documento é obrigatório.'),
  file: z.any(),
  type: z.nativeEnum(DocumentType, { error: 'Tipo de documento inválido.' }),
  obraId: z.string().min(1, 'A obra é obrigatória.'),
});
