import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import CommentBox from './CommentBox';
import { Comment, Result } from './types';
import { mergeComments } from './util';

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '1em 10%',
    paddingBottom: '-1em',
  },
  cardContainer: {
    width: '100%',
    marginBottom: '1em',
  },
});

interface Props {
  results: Result[];
}

let commentId = 0;

const MainScreen: React.FC<Props> = ({ results }: Props) => {
  const classes = useStyles();
  const badResults = results.filter(r => r.value !== 0);
  const [comments, setComments] = useState<Comment[]>(
    badResults.map(r => ({ text: r.name, results: [r], id: commentId++ }))
  );

  return (
    <div className={classes.root}>
      {comments.map((c, i) => (
        <div
          key={i}
          className={classes.cardContainer}
          draggable
          onDrop={(e): void => {
            e.preventDefault();
            e.stopPropagation();
            const fromId = Number(e.dataTransfer.getData('text/plain'));
            console.log(fromId);
            console.log(c.id);
            setComments(mergeComments(comments, fromId, c.id));
          }}
          onDragStart={e => {
            e.dataTransfer.setData('text/plain', String(c.id));
          }}
          onDragOver={(e): void => {
            e.preventDefault();
          }}
        >
          <CommentBox comment={c} />
        </div>
      ))}
    </div>
  );
};

export default MainScreen;
