'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { 
    Building2, 
    ChevronLeft, 
    ChevronRight, 
    LogOut, 
    UserCircle,
    Settings2
} from 'lucide-react';
import { useFeatures } from '@/app/contexts/FeatureContext';
import { ALL_NAV_LINKS } from '@/app/lib/nav-links';
import { handleSignOut } from '@/app/actions/auth';

const settingsLink = {
    href: '/dashboard/settings',
    name: 'Personalização',
    icon: Settings2,
};

type NavLinksContentProps = {
  isCollapsed: boolean;
};

function NavLinksContent({ isCollapsed }: NavLinksContentProps) {
  const { hasFeature } = useFeatures();

  const availableLinks = ALL_NAV_LINKS.filter(link => hasFeature(link.featureKey));

  return (
    <ul>
      {availableLinks.map((link) => {
        const LinkIcon = link.icon;

        return (
          <li key={link.name} className="px-4 py-1">
            <Link
              href={link.href}
              className={clsx(
                'flex items-center py-2.5 px-4 rounded-lg transition-colors text-text/70 hover:bg-secondary/20 hover:text-text'
              )}
            >
              <LinkIcon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">{link.name}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

type ConstructionconLogoProps = {
  isCollapsed: boolean;
};

// Componente do Logo
const ConstructionconLogo = ({ isCollapsed }: ConstructionconLogoProps) => (
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

  return (
    <aside
      className={clsx(
        'bg-background border-r border-secondary/20 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out',
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

      <nav className="flex-grow mt-4">
        <NavLinksContent isCollapsed={isCollapsed} />
      </nav>

      {/* Seção Inferior */}
      <div className="flex-shrink-0 p-4 border-t border-secondary/20">
        <Link
          href={settingsLink.href}
          className={clsx(
            'flex items-center py-2.5 px-4 rounded-lg transition-colors mb-4 text-text/70 hover:bg-secondary/20 hover:text-text'
          )}
        >
          <settingsLink.icon className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">{settingsLink.name}</span>}
        </Link>

        <div className="flex items-center p-2 rounded-lg hover:bg-secondary/10">
          <UserCircle className="h-10 w-10 text-text/60 flex-shrink-0" />
          {!isCollapsed && (
            <div className="ml-3">
              <p className="font-semibold text-sm text-text whitespace-nowrap">Admin</p>
              <p className="text-xs text-text/60 whitespace-nowrap">admin@construtora.com</p>
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