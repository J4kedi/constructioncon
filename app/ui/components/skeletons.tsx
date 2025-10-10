const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent';

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
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-secondary/20 p-2 shadow-sm`}
    >
      {/* CardHeader */}
      <div className="flex flex-col space-y-1.5 p-4">
        <div className="flex items-center">
          <div className="h-5 w-5 rounded-md bg-secondary/40" /> {/* Icon */}
          <div className="ml-2 h-6 w-24 rounded-md bg-secondary/40" /> {/* Title */}
        </div>
      </div>
      {/* CardContent */}
      <div className="p-2 pt-0">
        <div className="flex items-center justify-center truncate rounded-xl bg-background/50 px-4 py-8"> {/* Adjusted py-8 to py-4 */}
          <div className="h-7 w-20 rounded-md bg-secondary/40" /> {/* Value */}
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
      <div className="mb-4 h-8 w-36 rounded-md bg-secondary/40" />
      <div className="rounded-xl bg-secondary/20 p-4">
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-background p-4 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-secondary/40" />
          <div className="ml-2 h-4 w-20 rounded-md bg-secondary/40" />
        </div>
      </div>
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      <div className="mb-4 h-8 w-36 rounded-md bg-secondary/40" />
      <div className="flex grow flex-col justify-between rounded-xl bg-secondary/20 p-4">
        <div className="bg-background px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-secondary/40" />
          <div className="ml-2 h-4 w-20 rounded-md bg-secondary/40" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-secondary/20 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-secondary/40" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-secondary/40" />
          <div className="mt-2 h-4 w-12 rounded-md bg-secondary/40" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-secondary/40" />
    </div>
  );
}

export default function DashboardSkeleton() {
  const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent';

  const SkeletonBlock = ({ className }: { className?: string }) => (
    <div className={`${shimmer} relative overflow-hidden rounded-xl bg-secondary/20 ${className}`} />
  );

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

function TableRowSkeleton() {
    return (
        <tr className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none">
            {/* User */}
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-secondary/40" />
                    <div className="h-4 w-24 rounded bg-secondary/40" />
                </div>
            </td>
            {/* Email */}
            <td className="whitespace-nowrap px-3 py-3">
                <div className="h-4 w-32 rounded bg-secondary/40" />
            </td>
            {/* Title */}
            <td className="whitespace-nowrap px-3 py-3">
                <div className="h-4 w-20 rounded bg-secondary/40" />
            </td>
            {/* Role */}
            <td className="whitespace-nowrap px-3 py-3">
                <div className="h-6 w-16 rounded-full bg-secondary/40" />
            </td>
            {/* Date */}
            <td className="whitespace-nowrap px-4 py-3">
                <div className="h-4 w-20 rounded bg-secondary/40" />
            </td>
        </tr>
    );
}

export function UsersTableSkeleton() {
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
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
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

function ObraTableRowSkeleton() {
    return (
        <tr className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none">
            {/* Nome da Obra */}
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="h-4 w-32 rounded bg-secondary/40" />
            </td>
            {/* Cliente */}
            <td className="whitespace-nowrap px-3 py-3">
                <div className="h-4 w-24 rounded bg-secondary/40" />
            </td>
            {/* Status */}
            <td className="whitespace-nowrap px-3 py-3">
                <div className="h-6 w-20 rounded-full bg-secondary/40" />
            </td>
            {/* Progresso */}
            <td className="whitespace-nowrap px-3 py-3">
                <div className="h-4 w-16 rounded bg-secondary/40" />
            </td>
            {/* Ações */}
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                    <div className="h-7 w-7 rounded-full bg-secondary/40" />
                    <div className="h-7 w-7 rounded-full bg-secondary/40" />
                </div>
            </td>
        </tr>
    );
}

export function ObrasTableSkeleton() {

  return (

    <div className={`${shimmer} relative w-full overflow-hidden`}>

      <div className="flow-root">

        <div className="overflow-x-auto">

          <div className="inline-block min-w-full align-middle">

            <div className="rounded-lg bg-secondary/20 p-2 md:pt-0">

              <table className="min-w-full text-text">

                <thead className="rounded-lg text-left text-sm font-normal">

                  <tr>

                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome da Obra</th>

                    <th scope="col" className="px-3 py-5 font-medium">Cliente</th>

                    <th scope="col" className="px-3 py-5 font-medium">Status</th>

                    <th scope="col" className="px-3 py-5 font-medium">Progresso</th>

                    <th scope="col" className="relative py-3 pl-6 pr-3">

                      <span className="sr-only">Edit</span>

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-background">

                  <ObraTableRowSkeleton />

                  <ObraTableRowSkeleton />

                  <ObraTableRowSkeleton />

                  <ObraTableRowSkeleton />

                  <ObraTableRowSkeleton />

                  <ObraTableRowSkeleton />

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}



export function OverviewCardSkeleton() {

	return (

		<div className="bg-background border border-secondary/20 rounded-lg p-6">

			<div className="h-5 w-32 bg-secondary/40 rounded mb-4" />

			<div className="space-y-3">

				<div className="h-4 bg-secondary/40 rounded w-3/4" />

				<div className="h-4 bg-secondary/40 rounded w-1/2" />

				<div className="h-4 bg-secondary/40 rounded w-5/6" />

			</div>

		</div>

	);

}



export function OverviewPieChartSkeleton() {

	return (

		<div className="bg-background border border-secondary/20 rounded-lg p-6 flex flex-col items-center justify-center">

			<div className="h-5 w-32 bg-secondary/40 rounded mb-4" />

			<div className="w-40 h-40 bg-secondary/40 rounded-full" />

		</div>

	);

}



export function SummarySkeleton() {



	return (



		<>



			<CardSkeleton />



			<CardSkeleton />



			<CardSkeleton />



			<CardSkeleton />



		</>



	);



}
