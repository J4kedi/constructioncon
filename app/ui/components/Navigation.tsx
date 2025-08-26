import Link from 'next/link';

type NavLink = {
  href: string;
  label: string;
};

interface NavigationProps {
  links: NavLink[];
  navClassName?: string;
  linkClassName?: string;
}

export const Navigation = ({ links, navClassName, linkClassName }: NavigationProps) => {
  return (
    <nav className={navClassName}>
      {links.map(({ href, label }) => (
        <Link key={label} href={href} className={linkClassName}>
          {label}
        </Link>
      ))}
    </nav>
  );
};