import { useEffect } from 'react';
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
      })
    )
  );
  return out;
};

export const HW_NAME_MAP: Record<string, number> = {
  LinearProbingHashMap: 6,
  AVL: 7,
  Sorting: 8,
  PatternMatching: 9,
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
      console.log('hi');
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return (): void =>
      window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [preventDefault]);
};
