'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Building2, ChevronLeft, ChevronRight, LogOut, UserCircle } from 'lucide-react';
import NavLinks, { settingsLink } from './nav-links';

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

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        'bg-background dark:bg-gradient-to-br dark:from-secondary/30 dark:to-background border-r border-secondary/20 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* Botão para expandir/recolher */}
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

      {/* Navegação Principal */}
      <nav className="flex-grow mt-4">
        <NavLinks isCollapsed={isCollapsed} />
      </nav>

      {/* Seção Inferior (Configurações e Usuário) */}
      <div className="flex-shrink-0 p-4 border-t border-secondary/20">
        {/* Link de Personalização */}
        <Link
          href={settingsLink.href}
          className={clsx(
            'flex items-center py-2.5 px-4 rounded-lg transition-colors mb-4',
            {
              'bg-primary text-white shadow-md': pathname === settingsLink.href,
              'text-text/70 hover:bg-secondary/20 hover:text-text': pathname !== settingsLink.href,
            },
          )}
        >
          <settingsLink.icon className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">{settingsLink.name}</span>}
        </Link>

        {/* Perfil do Usuário */}
        <div className="flex items-center p-2 rounded-lg hover:bg-secondary/10">
          <UserCircle className="h-10 w-10 text-text/60 flex-shrink-0" />
          {!isCollapsed && (
            <div className="ml-3">
              <p className="font-semibold text-sm text-text whitespace-nowrap">Admin</p>
              <p className="text-xs text-text/60 whitespace-nowrap">admin@construtora.com</p>
            </div>
          )}
        </div>
        <button className="w-full mt-4 flex items-center justify-center py-2.5 px-4 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
        <LogOut className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">Sair</span>}
        </button>
      </div>
    </aside>
  );
}