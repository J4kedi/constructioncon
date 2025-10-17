'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';

export const SideNavLogo = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <Link href="/dashboard" className="flex items-center justify-center h-16 px-4">
        <Building2 className="h-8 w-8 text-primary flex-shrink-0" />
        {!isCollapsed && (
            <span className="ml-2 text-xl font-bold text-text whitespace-nowrap">
                Construction<span className="text-primary">Con</span>
            </span>
        )}
    </Link>
);