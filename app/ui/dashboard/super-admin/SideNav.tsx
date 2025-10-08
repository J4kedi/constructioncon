'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { LayoutDashboard, Building2, Users, TerminalSquare, Server, ChevronLeft, ChevronRight, LogOut, Settings2 } from 'lucide-react';
import { handleSignOut } from '@/app/actions/auth';
import { ThemeSwitcher } from '@/app/ui/components/ThemeSwitcher';
import { User } from 'next-auth';

const links = [
  { name: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tenants', href: '/dashboard/tenants', icon: Building2 },
  { name: 'Usuários', href: '/dashboard/global-users', icon: Users },
  { name: 'Operações e Scripts', href: '/dashboard/scripts', icon: TerminalSquare },
  { name: 'Status do Sistema', href: '/dashboard/status', icon: Server },
];

const settingsLink = {
    href: '/dashboard/settings',
    name: 'Personalização',
    icon: Settings2,
};

const ConstructionconLogo = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <Link href="/dashboard" className="flex items-center justify-center h-16 px-4">
        <Building2 className="h-8 w-8 text-primary flex-shrink-0" />
        {!isCollapsed && (
        <span className="ml-2 text-xl font-bold text-text whitespace-nowrap">
            Construction<span className="text-primary">Con</span>
        </span>
        )}
    </Link>
);

export default function SuperAdminSideNav({ user }: { user: User }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={clsx(
        'bg-background border-r border-secondary/20 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64',
      )}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-background border-2 border-primary text-primary rounded-full p-1.5 hover:bg-primary hover:text-white transition-colors z-10"
        aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex-shrink-0">
        <ConstructionconLogo isCollapsed={isCollapsed} />
      </div>

      <nav className="flex-grow mt-4">
        <ul>
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <li key={link.name} className="px-4 py-1">
                <Link
                  href={link.href}
                  className={clsx(
                    'flex items-center py-2.5 px-4 rounded-lg transition-colors text-text/70 hover:bg-secondary/20 hover:text-text',
                    { 'bg-secondary/20 text-text': pathname === link.href },
                  )}
                >
                  <LinkIcon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">{link.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex-shrink-0 p-4 border-t border-secondary/20">
        <div className="flex items-center justify-between w-full mb-4">
            <Link
            href={settingsLink.href}
            className={clsx(
                'flex items-center py-2.5 px-4 rounded-lg transition-colors text-text/70 hover:bg-secondary/20 hover:text-text',
                { 'justify-center': isCollapsed }
            )}
            >
            <settingsLink.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">{settingsLink.name}</span>}
            </Link>
            {!isCollapsed && <ThemeSwitcher />}
        </div>

        <div className="flex items-center p-2 rounded-lg hover:bg-secondary/10">
            <Image
                src={user.image || '/avatar-placeholder.svg'}
                alt={`Avatar de ${user.name}` || 'Avatar do usuário'}
                width={40}
                height={40}
                className="rounded-full flex-shrink-0"
            />
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="font-semibold text-sm text-text whitespace-nowrap truncate">{user.name}</p>
              <p className="text-xs text-text/60 whitespace-nowrap truncate">{user.email}</p>
              <p className="text-xs text-text/60 whitespace-nowrap font-mono mt-1">{user.role}</p>
            </div>
          )}
        </div>
        
        <form action={handleSignOut}>
          <button 
            type="submit"
            className="w-full mt-4 flex items-center justify-center py-2.5 px-4 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">Sair</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}