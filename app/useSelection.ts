import { useState } from 'react';
import { useAtom } from 'jotai';
import { selectedIndexAtom } from '@/features/item/select';

export const useSelection = () => {
  const [selectedIndexes, setSelectedIndexes] = useAtom(selectedIndexAtom);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null,
  );

  const handleSelect = (index: number, isShiftKey: boolean) => {
    const selected = !selectedIndexes.includes(index);

    if (isShiftKey && lastSelectedIndex !== null) {
      // Range selection
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const newSelectedIndexes = new Set(selectedIndexes);
      for (let i = start; i <= end; i++) {
        newSelectedIndexes.add(i);
      }
      setSelectedIndexes(Array.from(newSelectedIndexes));
    } else {
      // Single selection
      setSelectedIndexes(
        selected
          ? [...selectedIndexes, index]
          : selectedIndexes.filter(i => i !== index),
      );
    }
    setLastSelectedIndex(index);
  };

  return {
    selectedIndexes,
    handleSelect,
  };
};
