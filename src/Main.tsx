import React, { useState } from 'react';
import CommentBox from './CommentBox';
import { parseText } from './parse';
import { Comment } from './types';

interface Props {
  rawText: string;
}

const Main: React.FC<Props> = ({ rawText }: Props) => {
  const results = parseText(rawText);
  const badResults = results.filter(r => r.value !== 0);
  const [comments, setComments] = useState<Comment[]>(
    badResults.map(r => ({ text: r.name, results: [r] }))
  );

  console.log(results);

  return (
    <div>
      {comments.map((c, i) => (
        <CommentBox key={i} comment={c} />
      ))}
    </div>
  );
};

export default Main;
