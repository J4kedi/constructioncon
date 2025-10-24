import { formatCurrency } from '@/app/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';
import MiniCard from '@/app/ui/components/MiniCard';

export interface KPI {
  obrasEmAndamento: number;
  tarefasAtrasadas: number;
  contasProximas: number;
  saldoAtual: string;
}

export default function KeyKPIsCard({ kpis }: { kpis: KPI }) {
  return (
    <Card className="bg-secondary/30">
      <CardHeader>
        <CardTitle>Centro de Comando</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCard href="/dashboard/obras" iconName="Building2" title="Obras em Andamento" value={kpis.obrasEmAndamento.toString()} description="Projetos ativos no momento" />
          <MiniCard href="/dashboard/tarefas?filtro=atrasadas" iconName="AlertTriangle" title="Tarefas Atrasadas" value={kpis.tarefasAtrasadas.toString()} description="Etapas fora do prazo" />
          <MiniCard 
            href="/dashboard/financeiro/contas-a-pagar"
            iconName="CalendarClock" 
            title="Contas Próximas do Venc."
            value={kpis.contasProximas.toString()}
            description="Nos próximos 7 dias"
          />
          <MiniCard href="/dashboard/financeiro" iconName="Wallet" title="Saldo de Caixa" value={kpis.saldoAtual} description="Balanço de contas pagas/recebidas" />
        </div>
      </CardContent>
    </Card>
  );
}
