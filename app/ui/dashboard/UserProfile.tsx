'use client';

import Image from 'next/image';
import { User } from 'next-auth';
import { StatusBadge } from '@/app/ui/components/BadgeFactory';
import { UserRole } from '@prisma/client';

export const UserProfile = ({ user, isCollapsed, onClick }: { user: User, isCollapsed: boolean, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="flex items-center p-2 rounded-lg hover:bg-secondary/10 w-full cursor-pointer"
    >
        <Image
            src={user.avatarUrl || '/avatar-placeholder.svg'}
            alt={`Avatar de ${user.name}` || 'Avatar do usuário'}
            width={40}
            height={40}
            className="rounded-full flex-shrink-0"
        />
        {!isCollapsed && (
            <div className="ml-3 overflow-hidden text-left">
                <p className="font-semibold text-sm text-text whitespace-nowrap truncate">{user.name}</p>
                <p className="text-xs text-text/60 whitespace-nowrap truncate">{user.email}</p>
                <div className="mt-1">
                  <StatusBadge type="role" value={user.role as UserRole} />
                </div>
            </div>
        )}
    </button>
);