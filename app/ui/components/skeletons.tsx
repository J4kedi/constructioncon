// --- Componentes de Esqueleto Genéricos ---

const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent';

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-secondary/40 ${className}`} />
);

const SkeletonText = ({ width }: { width: string }) => (
  <SkeletonBlock className={`h-4 ${width}`} />
);

const SkeletonAvatar = () => (
  <SkeletonBlock className="h-7 w-7 rounded-full" />
);

const SkeletonBadge = () => (
  <SkeletonBlock className="h-5 w-16 rounded-full" />
);

type CellConfig = { type: 'avatar' } | { type: 'badge' } | { type: 'text', width: string };

export function GenericTableRowSkeleton({ cells }: { cells: readonly CellConfig[] }) {
  return (
    <tr className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none">
      {cells.map((cell, index) => (
        <td key={index} className="whitespace-nowrap px-3 py-3 first:pl-6">
          {cell.type === 'avatar' ? (
            <div className="flex items-center gap-3">
              <SkeletonAvatar />
              <SkeletonText width="w-24" />
            </div>
          ) : cell.type === 'badge' ? (
            <SkeletonBadge />
          ) : (
            <SkeletonText width={cell.width} />
          )}
        </td>
      ))}
    </tr>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden rounded-xl bg-secondary/20 p-2 shadow-sm`}>
      {/* CardHeader */}
      <div className="flex flex-col space-y-1.5 p-4">
        <div className="flex items-center">
          <SkeletonBlock className="h-5 w-5" />
          <SkeletonBlock className="ml-2 h-5 w-24" />
        </div>
      </div>
      {/* CardContent */}
      <div className="p-2 pt-0">
        <div className="flex items-center justify-center truncate rounded-xl bg-background/50 px-4 py-8">
          <SkeletonBlock className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

export function EstoqueDashboardSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <SkeletonBlock className="mb-4 h-8 w-36" />
      <div className="rounded-xl bg-secondary/20 p-4">
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-background p-4 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <SkeletonBlock className="h-5 w-5 rounded-full" />
          <SkeletonBlock className="ml-2 h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}>
      <SkeletonBlock className="mb-4 h-8 w-36" />
      <div className="flex grow flex-col justify-between rounded-xl bg-secondary/20 p-4">
        <div className="bg-background px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <SkeletonBlock className="h-5 w-5 rounded-full" />
          <SkeletonBlock className="ml-2 h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-secondary/20 py-4">
      <div className="flex items-center">
        <SkeletonBlock className="mr-2 h-8 w-8 rounded-full" />
        <div className="min-w-0">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="mt-2 h-4 w-12" />
        </div>
      </div>
      <SkeletonBlock className="mt-2 h-4 w-12" />
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <h1 className="text-3xl font-bold text-text mb-6">
        <SkeletonBlock className="h-9 w-80" />
      </h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <SkeletonBlock className="h-64" />
          <SkeletonBlock className="h-64" />
        </div>

        {/* Coluna Direita (1/3) */}
        <div className="space-y-6">
          <SkeletonBlock className="h-52" />
          <SkeletonBlock className="h-52" />
        </div>
      </div>

      {/* Feed Section */}
      <div className="mt-6">
        <SkeletonBlock className="h-72" />
      </div>
    </>
  );
}

export function UsersTableSkeleton() {
  const userCells = [
    { type: 'avatar' },
    { type: 'text', width: 'w-32' },
    { type: 'text', width: 'w-20' },
    { type: 'badge' },
    { type: 'text', width: 'w-20' },
  ] as const;

  return (
    <div className={`${shimmer} relative w-full overflow-hidden`}>
      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-secondary/20 p-2 md:pt-0">
              <table className="min-w-full text-text">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome</th>
                    <th scope="col" className="px-3 py-5 font-medium">Email</th>
                    <th scope="col" className="px-3 py-5 font-medium">Cargo</th>
                    <th scope="col" className="px-3 py-5 font-medium">Role</th>
                    <th scope="col" className="px-4 py-5 font-medium">Data de Adição</th>
                  </tr>
                </thead>
                <tbody className="bg-background">
                  {Array.from({ length: 6 }).map((_, i) => <GenericTableRowSkeleton key={i} cells={userCells} />)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <div className="h-10 w-full rounded-md bg-secondary/40" />
    </div>
  );
}

export function ObrasTableSkeleton() {
  const obraCells = [
    { type: 'text', width: 'w-32' }, // Nome
    { type: 'text', width: 'w-20' }, // Tipo
    { type: 'text', width: 'w-24' }, // Cliente
    { type: 'badge' },                // Status
    { type: 'text', width: 'w-20' }, // Data
    { type: 'text', width: 'w-24' }, // Orçamento
  ] as const;

  return (
    <div className={`${shimmer} relative w-full overflow-hidden`}>
      <table className="min-w-full text-text">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome da Obra</th>
            <th scope="col" className="px-3 py-5 font-medium">Tipo</th>
            <th scope="col" className="px-3 py-5 font-medium">Cliente</th>
            <th scope="col" className="px-3 py-5 font-medium">Status</th>
            <th scope="col" className="px-3 py-5 font-medium">Data de Início</th>
            <th scope="col" className="px-3 py-5 font-medium">Orçamento</th>
            <th scope="col" className="relative py-3 pl-6 pr-3"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody className="bg-background">
          {Array.from({ length: 6 }).map((_, i) => <GenericTableRowSkeleton key={i} cells={obraCells} />)}
        </tbody>
      </table>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden rounded-xl bg-secondary/20 p-4 h-96`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-secondary/40" />
      <div className="rounded-xl bg-background/50 p-4 h-full" />
    </div>
  );
}

export function TransactionsTableSkeleton() {
  const transactionCells = [
    { type: 'text', width: 'w-40' },
    { type: 'text', width: 'w-24' },
    { type: 'badge' },
    { type: 'text', width: 'w-24' },
    { type: 'text', width: 'w-24' },
    { type: 'text', width: 'w-24' },
  ] as const;
  return (
    <div className="bg-background border border-secondary/20 rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-text mb-4">Transações Recentes</h2>
      <div className="w-full overflow-auto">
        <table className="min-w-full">
          <tbody className="bg-background">
            {Array.from({ length: 5 }).map((_, i) => <GenericTableRowSkeleton key={i} cells={transactionCells} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OverviewCardSkeleton() {
	return (
		<div className="bg-background border border-secondary/20 rounded-lg p-6">
			<SkeletonBlock className="h-5 w-32 mb-4" />
			<div className="space-y-3">
				<SkeletonBlock className="h-4 w-3/4" />
				<SkeletonBlock className="h-4 w-1/2" />
				<SkeletonBlock className="h-4 w-5/6" />
			</div>
		</div>
	);
}

export function OverviewPieChartSkeleton() {
	return (
		<div className="bg-background border border-secondary/20 rounded-lg p-6 flex flex-col items-center justify-center">
			<SkeletonBlock className="h-5 w-32 mb-4" />
			<SkeletonBlock className="w-40 h-40 rounded-full" />
		</div>
	);
}

export function DocumentosTableSkeleton() {
  const docCells = [
    { type: 'text', width: 'w-32' },
    { type: 'badge' },
    { type: 'text', width: 'w-24' },
    { type: 'text', width: 'w-24' },
    { type: 'text', width: 'w-20' },
  ] as const;

  return (
    <div className={`${shimmer} relative w-full overflow-hidden`}>
      <table className="min-w-full text-text">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome</th>
            <th scope="col" className="px-3 py-5 font-medium">Tipo</th>
            <th scope="col" className="px-3 py-5 font-medium">Fornecedor/Cliente</th>
            <th scope="col" className="px-3 py-5 font-medium">Obra</th>
            <th scope="col" className="px-4 py-5 font-medium">Data de Upload</th>
          </tr>
        </thead>
        <tbody className="bg-background">
          {Array.from({ length: 6 }).map((_, i) => <GenericTableRowSkeleton key={i} cells={docCells} />)}
        </tbody>
      </table>
    </div>
  );
}
