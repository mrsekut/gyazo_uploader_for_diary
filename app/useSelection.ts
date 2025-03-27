import { useState } from 'react';
import { useAtom } from 'jotai';
import { selectedIdsAtom } from '@/features/item/select';

export const useSelection = () => {
  const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string, isShiftKey: boolean) => {
    const selected = !selectedIds.includes(id);

    if (isShiftKey && lastSelectedId !== null) {
      // Range selection not supported with IDs - just toggle the single item
      setSelectedIds(
        selected ? [...selectedIds, id] : selectedIds.filter(i => i !== id),
      );
    } else {
      // Single selection
      setSelectedIds(
        selected ? [...selectedIds, id] : selectedIds.filter(i => i !== id),
      );
    }
    setLastSelectedId(id);
  };

  return {
    selectedIds,
    handleSelect,
  };
};
