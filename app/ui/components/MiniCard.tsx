import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';
import { ICON_MAP } from '@/app/lib/icon-map';
import Link from 'next/link';

interface MiniCardProps {
  iconName: keyof typeof ICON_MAP;
  title: string;
  value: string;
  description: string;
  href?: string;
}

export default function MiniCard({ iconName, title, value, description, href }: MiniCardProps) {
  const IconComponent = ICON_MAP[iconName];

  const cardContent = (
    <Card className="h-full transition-colors hover:bg-accent/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
