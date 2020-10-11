import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import CommentBox from './CommentBox';
import { encodeText } from './parse';
import { Comment, Result } from './types';
import { mergeComments, splitComment, updateCommentText } from './util';

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
  button: {
    border: 'none',
    padding: '0.5em 1em',
    fontSize: '16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#D53F8C',
  },
});

interface Props {
  results: Result[];
}

const MainScreen: React.FC<Props> = ({ results }: Props) => {
  const classes = useStyles();
  const badResults = results.filter(r => r.value !== 0);
  const commentId = useRef(0);
  const [comments, setComments] = useState<Comment[]>(
    badResults.map(r => ({
      text: r.name,
      results: [r],
      id: commentId.current++,
    }))
  );
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  const updateText = (s: string, i: number): void => {
    setComments(updateCommentText(comments, i, s));
  };

  const split = (i: number): void => {
    setComments(splitComment(comments, i, commentId));
  };

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
            if (fromId === c.id) {
              return;
            }
            setComments(mergeComments(comments, fromId, c.id));
          }}
          onDragStart={(e): void => {
            e.dataTransfer.setData('text/plain', String(c.id));
          }}
          onDragOver={(e): void => {
            e.preventDefault();
          }}
        >
          <CommentBox
            comment={c}
            setText={(s: string): void => {
              updateText(s, i);
            }}
            splitComment={(): void => split(i)}
          />
        </div>
      ))}
      <button
        className={classes.button}
        onClick={(): void => {
          setCopied(true);
          navigator.clipboard.writeText(encodeText(comments));
        }}
      >
        {copied ? 'copied!' : 'copy to clipboard'}
      </button>
    </div>
  );
};

export default MainScreen;
