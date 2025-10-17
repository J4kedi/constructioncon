'use client';

import { useState, ReactNode } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, ShoppingCart, Settings2 } from 'lucide-react';
import { User } from 'next-auth';
import { SideNavLogo } from './SideNavLogo';
import { UserProfile } from './UserProfile';
import { SignOutButton } from './SignOutButton';
import { NavLinkData } from '@/app/lib/definitions';
import { useFeatures } from '@/app/contexts/FeatureContext';
import { ICON_MAP } from '@/app/lib/icon-map';
import { NavLink } from './NavLink';
import { NavButton } from './NavButton';
import { ThemeSwitcher } from '@/app/ui/components/ThemeSwitcher';
import PersonalizationModal from './PersonalizationModal';

// -- Sub-componentes internos --

const NavLinksList = ({ isCollapsed, navLinks, isSuperAdmin }: { isCollapsed: boolean, navLinks: NavLinkData[], isSuperAdmin?: boolean }) => {
    const { hasFeature } = useFeatures();
    const availableLinks = isSuperAdmin ? navLinks : navLinks.filter(link => !link.featureKey || hasFeature(link.featureKey));

    return (
        <ul>
            {availableLinks.map((link) => {
                const LinkIcon = ICON_MAP[link.icon];
                if (!LinkIcon) return null;
                return (
                    <li key={link.name} className="px-4 py-1">
                        <NavLink href={link.href} icon={LinkIcon} name={link.name} isCollapsed={isCollapsed} />
                    </li>
                );
            })}
        </ul>
    );  
};

const BottomNav = ({ isCollapsed, onPersonalizationClick }: { isCollapsed: boolean, onPersonalizationClick: () => void }) => (
    <>
        <ul className="mb-2">
            <li className="px-4 py-1">
                <NavLink href="/dashboard/marketplace" icon={ShoppingCart} name="Marketplace" isCollapsed={isCollapsed} isExternal={true} />
            </li>
        </ul>
        <div className="flex items-center justify-between w-full mb-2">
            <div className={clsx({ 'w-full': !isCollapsed })}>
                <NavButton onClick={onPersonalizationClick} icon={Settings2} name="Personalização" isCollapsed={isCollapsed} />
            </div>
            {!isCollapsed && (
                <div className="flex-shrink-0 ml-2">
                    <ThemeSwitcher />
                </div>
            )}
        </div>
    </>
);

// -- Props do componente principal --

interface SideNavLayoutProps {
  user: User;
  navLinks: NavLinkData[];
  isSuperAdmin?: boolean;
}

// -- Componente Principal Unificado --

export default function SideNavLayout({ user, navLinks, isSuperAdmin }: SideNavLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPersonalizationModalOpen, setIsPersonalizationModalOpen] = useState(false);

  return (
    <>
        <aside
            className={clsx(
                'bg-background border-r border-secondary/20 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-40',
                isCollapsed ? 'w-20' : 'w-64',
            )}
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 bg-background border-2 border-primary text-primary rounded-full p-1.5 hover:bg-primary hover:text-white transition-colors z-10"
                aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className="flex-shrink-0">
                <SideNavLogo isCollapsed={isCollapsed} />
            </div>

            <nav className="flex-grow mt-4">
                <NavLinksList isCollapsed={isCollapsed} navLinks={navLinks} isSuperAdmin={isSuperAdmin} />
            </nav>

            <div className="flex-shrink-0 p-2 border-t border-secondary/20">
                <BottomNav isCollapsed={isCollapsed} onPersonalizationClick={() => setIsPersonalizationModalOpen(true)} />
            </div>

            <div className="p-4 border-t border-secondary/20">
                <UserProfile user={user} isCollapsed={isCollapsed} />
                <SignOutButton isCollapsed={isCollapsed} />
            </div>
        </aside>

        <PersonalizationModal isOpen={isPersonalizationModalOpen} onClose={() => setIsPersonalizationModalOpen(false)} user={user} />
    </>
  );
}
