import React, { useState } from 'react';
import { Comment } from './types';
import { sumPoints } from './util';

interface Props {
  comment: Comment;
}

const CommentBox: React.FC<Props> = ({ comment }: Props) => {
  const [show, setShow] = useState(false);
  return (
    <div onClick={(): void => setShow(!show)}>
      {comment.text} [{sumPoints(comment)}]
      {show && (
        <div>
          {comment.results.map((r, i) => (
            <div key={i}>{r.message}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBox;
