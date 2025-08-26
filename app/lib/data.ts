import { Wallet, Warehouse, BarChart3, Users, FileText, Settings2 } from "lucide-react";

export const mainNavLinks = [
  { href: '#features', label: 'Funcionalidades' },
  { href: '#testimonials', label: 'Depoimentos' },
  { href: '#pricing', label: 'Preços' },
  { href: '#contact', label: 'Contato' },
];

export const features = [
  { icon: Wallet, title: "Financeiro Completo", description: "Controle contas a pagar, receber, fluxo de caixa e orçamentos em um só lugar." },
  { icon: Warehouse, title: "Gestão de Estoque", description: "Monitore a entrada e saída de materiais, evitando desperdícios e paradas na obra." },
  { icon: BarChart3, title: "Acompanhamento Real", description: "Visualize o progresso da obra com cronogramas e métricas atualizadas em tempo real." },
  { icon: Users, title: "Portal do Cliente", description: "Ofereça uma área exclusiva para seus clientes acompanharem o progresso, pagar faturas e acessar documentos." },
  { icon: FileText, title: "Relatórios Inteligentes", description: "Gere relatórios mensais detalhados para tomadas de decisão mais assertivas e seguras." },
  { icon: Settings2, title: "Totalmente Personalizável", description: "Adapte o sistema às necessidades únicas da sua construtora com módulos e funcionalidades customizadas." },
];

export const testimonials = [
  { quote: "O ConstructionCon revolucionou nossa gestão. O controle financeiro ficou muito mais preciso e o portal do cliente é um diferencial enorme.", name: "João Silva", company: "CEO, Construtora Inova" },
  { quote: "Finalmente encontramos um software que se adapta às nossas necessidades. O suporte para personalização foi fundamental para nosso sucesso.", name: "Maria Oliveira", company: "Diretora, Edifica Engenharia" },
  { quote: "Acompanhar o estoque e o progresso da obra em tempo real nos poupou tempo e dinheiro. Recomendo fortemente!", name: "Carlos Pereira", company: "Gerente de Obras, Solidez Construtora" },
];