import { useAtom } from 'jotai';
import { selectedIdsAtom } from '@/features/item/select';

export const useSelection = () => {
  const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);

  const handleSelect = (id: string) => {
    const selected = !selectedIds.includes(id);
    setSelectedIds(
      selected ? [...selectedIds, id] : selectedIds.filter(i => i !== id),
    );
  };

  const handleGroupSelect = (ids: string[]) => {
    const allSelected = ids.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !ids.includes(id)));
    } else {
      setSelectedIds([...new Set([...selectedIds, ...ids])]);
    }
  };

  return {
    selectedIds,
    handleSelect,
    handleGroupSelect,
  };
};
