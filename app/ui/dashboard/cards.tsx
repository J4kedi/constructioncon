import { Building, Users, Wallet, TrendingDown } from "lucide-react";
import { roboto } from "../fonts";
import React from "react";
import { fetchDashboardData } from "@/app/lib/data/dashboard";

// O CardWrapper agora é responsável por buscar os dados e passar os ícones corretos
export default async function CardWrapper({ subdomain }: { subdomain: string; }) {
  const {
    numberOfObras,
    numberOfUsers,
    totalBudget,
    totalCost,
  } = await fetchDashboardData(subdomain);

  return (
    <>
      <Card 
        title="Orçamento Total" 
        value={totalBudget} 
        icon={<Wallet className="h-5 w-5 text-primary" />}
      />
      <Card 
        title="Custo Atual" 
        value={totalCost} 
        icon={<TrendingDown className="h-5 w-5 text-primary" />}
      />
      <Card 
        title="Total de Obras" 
        value={numberOfObras} 
        icon={<Building className="h-5 w-5 text-primary" />}
      />
      <Card
        title="Total de Clientes"
        value={numberOfUsers}
        icon={<Users className="h-5 w-5 text-primary" />}
      />
    </>
  );
}

// O componente Card agora é genérico e reutilizável
type CardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode; // Aceita qualquer ícone como um nó React
};

export function Card({ title, value, icon }: CardProps) {
  return (
    <div className="rounded-xl bg-secondary/20 p-2 shadow-sm">
      <div className="flex p-4">
        {icon} {/* Renderiza o ícone passado diretamente */}
        <h3 className="ml-2 text-sm font-medium text-text/90">{title}</h3>
      </div>
      <p
        className={`${roboto.className}
          truncate rounded-xl bg-background/50 px-4 py-8 text-center text-2xl text-text`}
      >
        {value}
      </p>
    </div>
  );
}