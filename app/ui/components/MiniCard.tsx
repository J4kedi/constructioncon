'use client';

import React from 'react';
import { ICON_MAP } from '@/app/lib/icon-map';
import Link from 'next/link';

interface MiniCardProps {
  iconName: string;
  title: string;
  value: string;
  description?: string;
  href?: string;
}

export default function MiniCard({ iconName, title, value, description, href }: MiniCardProps) {
  const Icon = ICON_MAP[iconName];

  if (!Icon) {
    return null; // Ou um ícone padrão
  }

  const cardContent = (
    <div className="flex items-center p-4 bg-secondary/20 rounded-lg h-full hover:bg-secondary/40 transition-colors">
      <div className="p-3 rounded-full bg-primary/10 text-primary flex-shrink-0">
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4 overflow-hidden">
        <p className="text-sm font-medium text-text/80 truncate">{title}</p>
        <p className="text-lg lg:text-xl font-bold text-text">{value}</p>
        {description && <p className="text-xs text-text/60 truncate">{description}</p>}
      </div>
    </div>
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
