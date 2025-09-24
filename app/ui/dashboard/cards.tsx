import { Building, Users, Wallet, TrendingDown } from "lucide-react";
import { roboto } from "../fonts";
import { fetchDashboardData } from "@/app/lib/data";

const iconMap = {
  budget: Wallet,
  users: Users,
  cost: TrendingDown,
  obras: Building,
};

type CardWrapperProps = {
  subdomain: string;
};

export default async function CardWrapper({ subdomain }: CardWrapperProps) {
  const {
    numberOfObras,
    numberOfUsers,
    totalBudget,
    totalCost,
  } = await fetchDashboardData(subdomain);

  return (
    <>
      <Card title="Orçamento Total" value={totalBudget} type="budget" />
      <Card title="Custo Atual" value={totalCost} type="cost" />
      <Card title="Total de Obras" value={numberOfObras} type="obras" />
      <Card
        title="Total de Clientes"
        value={numberOfUsers}
        type="users"
      />
    </>
  );
}

type CardProps = {
  title: string;
  value: number | string;
  type: 'obras' | 'users' | 'budget' | 'cost';
};

export function Card({ title, value, type }: CardProps) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-secondary/20 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-primary" /> : null}
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
