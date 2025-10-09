import { headers } from 'next/headers';
import { fetchLowStockItems } from '@/app/lib/data/dashboard-overview';
import LowStockList from '@/app/ui/dashboard/estoque/LowStockList';

export default async function StockPage() {
  const headerList = await headers();
  const subdomain = headerList.get('x-tenant-subdomain');

  if (!subdomain) {
    return null;
  }

  const items = await fetchLowStockItems(subdomain);

  return (
    <div className="bg-background border border-secondary/20 rounded-lg p-6">
      <LowStockList items={items} />
    </div>
  );
}