import { useState } from 'react';
import { useAtom } from 'jotai';
import { itemsAtom } from '@/features/item/atom';
import { useSelection } from './useSelection';

export const useCopyUrls = () => {
  const [items] = useAtom(itemsAtom);
  const { selectedIds } = useSelection();
  const [copied, setCopied] = useState(false);

  const copyUrls = async () => {
    try {
      const urls = items
        .filter(file => selectedIds.includes(file.id))
        .filter(file => file.gyazoUrl != null)
        .map(file => `[${file.gyazoUrl}]`)
        .join(' ');

      await navigator.clipboard.writeText(urls);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URLs:', error);
    }
  };

  return {
    copyUrls,
    copied,
  };
};
