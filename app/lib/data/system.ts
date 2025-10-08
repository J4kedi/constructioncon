const SERVICES = [
  { name: 'BFF', url: 'http://localhost:8080/health' },
  { name: 'Frontend (Marketplace)', url: 'http://localhost:3001/dashboard/marketplace/health' },
  { name: 'Serviço de Catálogo', url: 'http://localhost:3002/health' },
  { name: 'Serviço de Pedidos', url: 'http://localhost:3020/health' },
  { name: 'Função de Cotação', url: 'http://localhost:3004/health' },
];

export async function getSystemHealthStatus() {
  const statusPromises = SERVICES.map(async (service) => {
    try {
      const response = await fetch(service.url, { method: 'GET', cache: 'no-store' });
      if (response.ok) {
        return { name: service.name, status: 'Online' as const };
      }
      return { name: service.name, status: 'Offline' as const, error: `Status: ${response.status}` };
    } catch (error: any) {
      console.error(`Health check failed for ${service.name}:`, error.message);
      return { name: service.name, status: 'Offline' as const, error: 'Não foi possível conectar.' };
    }
  });

  const statuses = await Promise.all(statusPromises);
  return statuses;
}
