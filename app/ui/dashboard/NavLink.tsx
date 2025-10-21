'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

export const NavLink = ({ href, icon: Icon, name, isCollapsed, isExternal }: { href: string, icon: LucideIcon, name: string, isCollapsed: boolean, isExternal?: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : ''}
            className={clsx(
                'flex items-center py-2.5 px-4 rounded-lg transition-colors',
                {
                    'text-primary font-semibold': isActive,
                    'text-text/70 hover:bg-secondary/20 hover:text-text': !isActive,
                }
            )}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">{name}</span>}
        </Link>
    );
};