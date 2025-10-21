'use client';

import React from 'react';
import Search from './search';

interface PageHeaderProps {
  title: string;
  actionButtons?: React.ReactNode;
  searchPlaceholder?: string;
}

export default function PageHeader({ title, actionButtons, searchPlaceholder }: PageHeaderProps) {
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-text">{title}</h1>
        {actionButtons}
      </div>
      {searchPlaceholder && (
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder={searchPlaceholder} />
        </div>
      )}
    </>
  );
}
