'use client';

import { useState, useEffect } from 'react';

const getColor = (variableName: string) => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};

export function useThemeColors() {
  const [colors, setColors] = useState({
    primary: '',
    destructive: '',
    success: '',
  });

  useEffect(() => {
    const primary = getColor('--primary');
    const destructive = getColor('--destructive');
    const success = getColor('--success');

    setColors({ primary, destructive, success });
  }, []);

  return colors;
}
