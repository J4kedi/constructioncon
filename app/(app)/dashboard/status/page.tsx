import { getSystemHealthStatus } from '@/app/lib/data/system';
import StatusCard from '@/app/ui/dashboard/super-admin/status-card';

export default async function Page() {
  const services = await getSystemHealthStatus();

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-6">Status do Sistema</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => (
          <StatusCard
            key={service.name}
            name={service.name}
            status={service.status}
            error={service.error}
          />
        ))}
      </div>
    </div>
  );
}