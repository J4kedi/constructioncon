'use client';

import { handleSignOut } from '@/app/actions/auth';
import { LogOut } from 'lucide-react';

export const SignOutButton = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <form action={handleSignOut}>
        <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center py-2.5 px-4 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
        >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">Sair</span>}
        </button>
    </form>
);