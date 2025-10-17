'use client';

import { useState, useEffect } from 'react';

interface ItemWithId {
  id: string;
}

export function useTableState<T extends ItemWithId>(initialData: T[] = []) {
  const [items, setItems] = useState<T[]>(initialData);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const openModal = (item: T) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleDelete = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    closeModal();
  };
  
  const modalState = {
    isOpen: isModalOpen,
    selectedItem,
    openModal,
    closeModal,
  };

  return {
    items,
    modalState,
    handleDelete,
  };
}
