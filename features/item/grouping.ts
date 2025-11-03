// Grouping logic - pure functions for organizing items by capture date

/**
 * Group items by time difference in their capture dates
 * @param items - Array of items with captureDate and file properties
 * @param minutes - Time window in minutes to group items together
 * @returns Array of grouped items
 */
export function groupByTime<T extends { captureDate: number; file: File }>(
  items: T[],
  minutes: number,
): T[][] {
  const ms = minutes * 60 * 1000;

  return items
    .sort((a, b) => {
      const diff = a.captureDate - b.captureDate;
      return diff !== 0 ? diff : a.file.name.localeCompare(b.file.name);
    })
    .reduce((acc: T[][], file) => {
      if (acc.length === 0) return [[file]];

      const lastGroup = acc.at(-1);
      if (lastGroup == null) return acc;

      const lastItem = lastGroup.at(-1);
      if (lastItem == null) return acc;

      const diff = Math.abs(file.captureDate - lastItem.captureDate);

      if (diff > ms) return [...acc, [file]];
      return [...acc.slice(0, -1), [...lastGroup, file]];
    }, []);
}

/**
 * Calculate priority for groups based on earliest capture date
 * Earlier groups (older photos) get higher priority (lower number)
 * @param groups - Array of grouped items
 * @returns Map of item ID to priority number (0 = highest priority)
 */
export function calculateGroupPriority<
  T extends { id: string; captureDate: number },
>(groups: T[][]): Map<string, number> {
  const priorityMap = new Map<string, number>();

  groups.forEach((group, groupIndex) => {
    group.forEach(item => {
      priorityMap.set(item.id, groupIndex);
    });
  });

  return priorityMap;
}

/**
 * Get the earliest capture date in a group
 * @param group - Array of items with captureDate
 * @returns Earliest capture date timestamp
 */
export function getGroupEarliestDate<T extends { captureDate: number }>(
  group: T[],
): number {
  return Math.min(...group.map(item => item.captureDate));
}
