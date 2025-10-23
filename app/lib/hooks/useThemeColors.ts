'use client';

import { useState, useEffect } from 'react';

export function useThemeColors() {
  const [colors, setColors] = useState({
    primary: '#000000',
    text: '#000000',
    background: '#ffffff',
    border: '#e5e7eb',
    muted: '#9ca3af',
    success: '#22c55e',
    warning: '#f59e0b',
    destructive: '#ef4444',
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const style = getComputedStyle(root);

    setColors({
      primary: style.getPropertyValue('--color-primary').trim(),
      text: style.getPropertyValue('--color-text').trim(),
      background: style.getPropertyValue('--color-background').trim(),
      border: style.getPropertyValue('--color-secondary').trim(),
      muted: style.getPropertyValue('--color-accent').trim(),
      success: style.getPropertyValue('--color-success').trim(),
      warning: style.getPropertyValue('--color-warning').trim(),
      destructive: style.getPropertyValue('--color-destructive').trim(),
    });

  }, []);

  return colors;
}