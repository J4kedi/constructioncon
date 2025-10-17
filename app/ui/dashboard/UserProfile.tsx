'use client';

import Image from 'next/image';
import { User } from 'next-auth';
import { StatusBadge } from '@/app/ui/components/BadgeFactory';
import { UserRole } from '@prisma/client';

export const UserProfile = ({ user, isCollapsed }: { user: User, isCollapsed: boolean }) => (
    <div className="flex items-center p-2 rounded-lg hover:bg-secondary/10">
        <Image
            src={user.avatarUrl || '/avatar-placeholder.svg'}
            alt={`Avatar de ${user.name}` || 'Avatar do usuário'}
            width={40}
            height={40}
            className="rounded-full flex-shrink-0"
        />
        {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
                <p className="font-semibold text-sm text-text whitespace-nowrap truncate">{user.name}</p>
                <p className="text-xs text-text/60 whitespace-nowrap truncate">{user.email}</p>
                <div className="mt-1">
                  <StatusBadge type="role" value={user.role as UserRole} />
                </div>
            </div>
        )}
    </div>
);