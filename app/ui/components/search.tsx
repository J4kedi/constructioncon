'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type SearchProps = {
  placeholder: string;
};

export default function Search({ placeholder }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        className="peer block w-full rounded-md border border-secondary/30 bg-background py-[9px] pl-10 text-sm text-text outline-none placeholder:text-text/60 focus:border-primary focus:ring-1 focus:ring-primary/50"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query') || ''}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-text/70 peer-focus:text-primary" />
    </div>
  );
}