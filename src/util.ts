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
