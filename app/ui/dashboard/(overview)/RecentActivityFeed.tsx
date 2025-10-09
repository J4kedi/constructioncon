import { Clock } from 'lucide-react';

type Activity = {
    id: string;
    description: string;
    timestamp: string; // Changed from Date
};

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos atrás";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses atrás";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias atrás";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas atrás";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos atrás";
    return Math.floor(seconds) + " segundos atrás";
}

export default function RecentActivityFeed({ activities }: { activities: Activity[] }) {
    if (!activities || activities.length === 0) {
        return <p className="text-center text-text/70">Nenhuma atividade recente.</p>;
    }

    return (
        <ul className="space-y-4">
            {activities.map(activity => (
                <li key={activity.id} className="flex items-start gap-4">
                    <div className="bg-secondary/20 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-text">{activity.description}</p>
                        <p className="text-xs text-text/60">{timeAgo(activity.timestamp)}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
