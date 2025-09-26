'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type PaginationProps = {
  totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined;

          if (index === 0) position = 'first';
          if (index === allPages.length - 1) position = 'last';
          if (allPages.length === 1) position = 'single';
          if (page === currentPage) position = 'middle';

          return (
            <PaginationNumber
              key={page}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

type PaginationNumberProps = {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
};

function PaginationNumber({ page, href, isActive, position }: PaginationNumberProps) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border border-secondary/30',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-primary border-primary text-white': isActive,
      'hover:bg-secondary/20': !isActive && position !== 'middle',
      'text-text': !isActive,
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

type PaginationArrowProps = {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
};

function PaginationArrow({ href, direction, isDisabled }: PaginationArrowProps) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border border-secondary/30',
    {
      'pointer-events-none text-text/40': isDisabled,
      'hover:bg-secondary/20': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon = direction === 'left' ? <ArrowLeft className="w-4" /> : <ArrowRight className="w-4" />;

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}