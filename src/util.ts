import { useCallback, useEffect, useState } from 'react';
import { Comment } from './types';

export const sumPoints = (c: Comment): number => {
  return c.results.reduce((acc, curr) => acc + curr.value, 0);
};

export const mergeComments = (
  comments: Comment[],
  fromId: number,
  toId: number
): Comment[] => {
  const toIdx = comments.findIndex(c => c.id === toId);
  const fromIdx = comments.findIndex(c => c.id === fromId);

  if (toIdx === -1) {
    console.error(`Couldn't find Comment with id ${toId}`);
    return comments;
  }
  if (fromIdx === -1) {
    console.error(`Couldn't find Comment with id ${fromId}`);
    return comments;
  }
  const newComment: Comment = {
    ...comments[toIdx],
    results: comments[toIdx].results.concat(comments[fromIdx].results),
  };

  const out = [...comments];
  out[toIdx] = newComment;
  out.splice(fromIdx, 1);
  return out;
};

export const updateCommentText = (
  comments: Comment[],
  index: number,
  newText: string
): Comment[] => {
  const out = [...comments];
  out[index].text = newText;
  return out;
};

export const splitComment = (
  comments: Comment[],
  index: number,
  base: React.MutableRefObject<number>
): Comment[] => {
  const out = [...comments];
  out.splice(
    index,
    1,
    ...comments[index].results.map(
      (r): Comment => ({
        id: base.current++,
        text: comments[index].text,
        results: [r],
        removed: comments[index].removed,
        custom: comments[index].custom,
      })
    )
  );
  return out;
};

export const deleteComment = (
  comments: Comment[],
  index: number
): Comment[] => {
  const out = [...comments];
  out.splice(index, 1);
  return out;
};

export const toggleComment = (
  comments: Comment[],
  index: number,
  base: React.MutableRefObject<number>
): Comment[] => {
  const out = [...comments];
  out[index] = { ...comments[index], removed: !comments[index].removed };
  return out;
};

export const HW_NAME_MAP: Record<string, number> = {
  ArrayList: 1,
  LinearProbingHashMap: 6,
  AVL: 7,
  Sorting: 8,
  PatternMatching: 9,
  GraphAlgorithms: 10,
};

const getHwNum = (s: string): number | undefined => {
  for (const key in HW_NAME_MAP) {
    if (s.includes(key)) return HW_NAME_MAP[key];
  }
};

export const getGithubUrl = (s: string): string | null => {
  if (s.includes('student.')) return null;
  const fileMatch = s.match(/\((\w+)\.java:(\d+)\)/);
  if (fileMatch == null) return null;

  const hwNum = getHwNum(fileMatch[1]);
  if (hwNum == null) return null;

  const hw = String(hwNum).padStart(2, '0');
  const fileName = `${fileMatch[1]}.java`;
  const lineNum = `${fileMatch[2]}`;
  const url = `https://github.gatech.edu/cs-1332-fall-2020/homework/blob/master/homework${hw}/TAResources/${fileName}#L${lineNum}`;
  return url;
};

export const usePreventWindowUnload = (preventDefault: boolean): void => {
  useEffect(() => {
    if (!preventDefault) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return (): void =>
      window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [preventDefault]);
};

export const NAME_KEY_LS = 'ta-name';
export const EMOJI_KEY_LS = 'emoji-settings';

// https://usehooks-typescript.com/react-hook/use-local-storage
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useCallback(() => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(readValue);
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window == 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }
    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value;
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(newValue));
      // Save state
      setStoredValue(newValue);
      // We dispatch a custom event so every useLocalStorage hook are notified
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    // this only works for other documents, not the current one
    window.addEventListener('storage', handleStorageChange);
    // this is a custom event, triggered in writeValueToLocalStorage
    window.addEventListener('local-storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);
  return [storedValue, setValue];
}
