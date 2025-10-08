'use client';

interface StatusCardProps {
  name: string;
  status: 'Online' | 'Offline';
  error?: string;
}

export default function StatusCard({ name, status, error }: StatusCardProps) {
  const isOnline = status === 'Online';

  return (
    <div className="bg-background border border-secondary/20 rounded-lg p-6 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-text">{name}</h3>
        {isOnline ? (
          <p className="text-sm text-green-500">O serviço está operacional.</p>
        ) : (
          <p className="text-sm text-red-500">{error || 'O serviço está offline.'}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-bold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
          {status}
        </span>
        <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
    </div>
  );
}