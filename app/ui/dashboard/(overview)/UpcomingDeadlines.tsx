import { CalendarClock } from 'lucide-react';

type Deadline = {
    id: string;
    nome: string;
    dataPrevistaFim: string;
};

function daysUntil(dateString: string): { days: number, label: string } {
    const today = new Date();
    const deadline = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { days: diffDays, label: `Atrasado ${Math.abs(diffDays)}d` };
    if (diffDays === 0) return { days: diffDays, label: 'Hoje' };
    return { days: diffDays, label: `em ${diffDays}d` };
}

export default function UpcomingDeadlines({ deadlines }: { deadlines: Deadline[] }) {
    if (!deadlines || deadlines.length === 0) {
        return <p className="text-center text-sm text-text/70">Nenhum prazo se aproximando.</p>;
    }

    return (
        <ul className="space-y-4">
            {deadlines.map(deadline => (
                <li key={deadline.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CalendarClock className="h-5 w-5 text-primary" />
                        <p className="text-sm font-medium text-text">{deadline.nome}</p>
                    </div>
                    <p className={`text-sm font-semibold ${daysUntil(deadline.dataPrevistaFim).days < 3 ? 'text-red-500' : 'text-text/80'}`}>
                        {daysUntil(deadline.dataPrevistaFim).label}
                    </p>
                </li>
            ))}
        </ul>
    );
}
