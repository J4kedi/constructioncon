import { formatCurrency } from '@/app/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';
import MiniCard from '@/app/ui/components/MiniCard';

export interface KPI {
  obrasEmAndamento: number;
  tarefasAtrasadas: number;
  proximaConta: { valor: number; data: string } | null;
  saldoAtual: number;
}

export default function KeyKPIsCard({ kpis }: { kpis: KPI }) {
  return (
    <Card className="bg-secondary/30">
      <CardHeader>
        <CardTitle>Centro de Comando</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCard href="/dashboard/obras" iconName="Building2" title="Obras em Andamento" value={kpis.obrasEmAndamento.toString()} />
          <MiniCard href="/dashboard/tarefas?filtro=atrasadas" iconName="AlertTriangle" title="Tarefas Atrasadas" value={kpis.tarefasAtrasadas.toString()} />
          <MiniCard 
            href="/dashboard/financeiro/contas-a-pagar"
            iconName="CalendarClock" 
            title="Próximo Vencimento" 
            value={kpis.proximaConta ? formatCurrency(kpis.proximaConta.valor) : 'N/A'}
            description={kpis.proximaConta ? `em ${kpis.proximaConta.data}` : 'Nenhuma conta próxima'}
          />
          <MiniCard href="/dashboard/financeiro" iconName="Wallet" title="Saldo de Caixa" value={formatCurrency(kpis.saldoAtual)} description="Simulado" />
        </div>
      </CardContent>
    </Card>
  );
}
