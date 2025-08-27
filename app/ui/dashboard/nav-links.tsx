// app/dashboard/components/nav-links.tsx
'use client';

import clsx from 'clsx';
import { BarChart3, FileText, Settings2, Users, Wallet, Warehouse } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/dashboard/', name: 'Acompanhamento', icon: BarChart3 },
  { href: '/dashboard/financeiro', name: 'Financeiro', icon: Wallet },
  { href: '/dashboard/users', name: 'Usuários', icon: Users },
  { href: '/dashboard/estoque', name: 'Estoque', icon: Warehouse },
  { href: '/dashboard/relatorios', name: 'Relatórios', icon: FileText },
];

// O link de configurações também pode ficar aqui para manter tudo organizado
export const settingsLink = {
    href: '/dashboard/settings',
    name: 'Personalização',
    icon: Settings2,
};

// O componente agora aceita a prop isCollapsed
export default function NavLinks({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <ul>
      {navLinks.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <li key={link.name} className="px-4 py-1">
            <Link
              href={link.href}
              className={clsx(
                'flex items-center py-2.5 px-4 rounded-lg transition-colors',
                {
                  'bg-primary text-white shadow-md': isActive,
                  'text-text/70 hover:bg-secondary/20 hover:text-text': !isActive,
                },
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