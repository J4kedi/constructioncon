'use client';

import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

export const NavButton = ({ onClick, icon: Icon, name, isCollapsed }: { onClick: () => void, icon: LucideIcon, name: string, isCollapsed: boolean }) => (
    <button
        onClick={onClick}
        className={clsx(
            'flex items-center w-full py-2.5 px-4 rounded-lg transition-colors text-text/70 hover:bg-secondary/20 hover:text-text',
            { 'justify-center': isCollapsed }
        )}
    >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">{name}</span>}
    </button>
);