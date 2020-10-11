import { Comment } from './types';

export const sumPoints = (c: Comment): number => {
  return c.results.reduce((acc, curr) => acc + curr.value, 0);
};
