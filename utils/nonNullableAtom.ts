import { atom, PrimitiveAtom, SetStateAction } from 'jotai';

export function nonNullableAtom<T>(
  anAtom: PrimitiveAtom<T | null>,
  atomNameForErrorMessages = 'anAtom',
): PrimitiveAtom<T> {
  return atom(
    get => {
      const v = get(anAtom);
      if (v === null) {
        throw new Error(
          `${atomNameForErrorMessages} is null. not initialized.`,
        );
      }
      return v;
    },
    (_get, set, action: SetStateAction<T>) => {
      if (action instanceof Function) {
        set(anAtom, prev => {
          if (prev === null) {
            throw new Error(
              `prev ${atomNameForErrorMessages} is null. not initialized.`,
            );
          }
          return action(prev);
        });
      } else {
        set(anAtom, action);
      }
    },
  );
}
