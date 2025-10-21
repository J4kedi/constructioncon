'use client';

import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ChevronDown, ChevronLeft, ChevronRight, ShoppingCart, Settings2 } from 'lucide-react';
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

const NavGroup = ({ link, isCollapsed }: { link: NavLinkData, isCollapsed: boolean }) => {
    const pathname = usePathname();
    const { hasFeature } = useFeatures();
    const availableChildren = link.children?.filter(child => !child.featureKey || hasFeature(child.featureKey)) || [];
    const isActive = availableChildren.some(child => pathname.startsWith(child.href));
    const [isOpen, setIsOpen] = useState(isActive);

    const LinkIcon = ICON_MAP[link.icon];
    if (!LinkIcon) return null;

    if (isCollapsed) {
        return (
            <div className="px-4 py-1">
                <NavLink href={link.href || '#'} icon={LinkIcon} name={link.name} isCollapsed={isCollapsed} />
            </div>
        );
    }

    return (
        <div className="px-4 py-1">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={clsx(
                                'flex items-center justify-between w-full py-2.5 px-4 rounded-lg transition-colors cursor-pointer',
                                isActive 
                                    ? 'text-primary font-semibold' 
                                    : 'text-text/70 hover:bg-secondary/20 hover:text-text'
                            )}
                        >
                            <div className="flex items-center">
                                <LinkIcon className="h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 font-medium whitespace-nowrap">{link.name}</span>
                            </div>
                            <ChevronDown className={clsx('h-5 w-5 transition-transform', { 'rotate-180': isOpen })} />
                        </button>
                        {isOpen && (
                            <ul className="mt-1 pl-6 border-l-2 border-primary/20">
                                {availableChildren.map(child => {
                                    const ChildIcon = ICON_MAP[child.icon];
                                    if (!ChildIcon) return null;
                                    return (
                                        <li key={child.name} className="py-1">
                                            <NavLink href={child.href} icon={ChildIcon} name={child.name} isCollapsed={isCollapsed} />
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                );
            };
            
            const NavLinksList = ({ isCollapsed, navLinks, isSuperAdmin }: { isCollapsed: boolean, navLinks: NavLinkData[], isSuperAdmin?: boolean }) => {
                const { hasFeature } = useFeatures();
                const availableLinks = isSuperAdmin ? navLinks : navLinks.filter(link => !link.featureKey || hasFeature(link.featureKey));
            
                return (
                    <ul>
                        {availableLinks.map((link) => {
                            if (link.children && link.children.length > 0) {
                                return <li key={link.name}><NavGroup link={link} isCollapsed={isCollapsed} /></li>;
                            }
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
            
                        <nav className="flex-grow mt-4 overflow-y-auto">
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
