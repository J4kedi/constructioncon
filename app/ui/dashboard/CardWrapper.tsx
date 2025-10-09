import { Building, Users, Wallet, TrendingDown } from "lucide-react";
import { fetchDashboardData } from "@/app/lib/data/dashboard";
import { Card } from "./cards";

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
