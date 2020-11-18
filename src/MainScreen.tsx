import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import CommentBox from './CommentBox';
import { encodeText } from './parse';
import { Comment, Result } from './types';
import {
  deleteComment,
  mergeComments,
  splitComment,
  toggleComment,
  updateCommentText,
} from './util';

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
  addCommentContainer: {
    width: '100%',
    height: 'calc(2em + 4px)',
    marginBottom: '1em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    '&:hover': {
      border: '2px #CECECE dashed',
      height: '2em',
      color: '#CECECE',
    },
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
  const commentId = useRef(0);

  const badResults = results.filter(r => r.value !== 0);
  const [comments, setComments] = useState<Comment[]>(
    badResults.map(r => ({
      text: r.name,
      results: [r],
      id: commentId.current++,
      removed: false,
      custom: false,
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

  return (
    <div className={classes.root}>
      {comments.map((c, i) => (
        <div key={i} className={classes.cardContainer}>
          <CommentBox
            comment={c}
            setText={(s: string): void => {
              updateText(s, i);
            }}
            splitComment={(): void =>
              setComments(splitComment(comments, i, commentId))
            }
            toggleComment={(): void =>
              setComments(toggleComment(comments, i, commentId))
            }
            merge={(from, to): void => {
              setComments(mergeComments(comments, from, to));
            }}
            deleteComment={(): void => {
              setComments(deleteComment(comments, i));
            }}
          />
        </div>
      ))}
      <div
        className={classes.addCommentContainer}
        onClick={(): void => {
          setComments([
            ...comments,
            {
              text: 'Efficiency',
              results: [
                {
                  name: 'Efficiency',
                  value: -5,
                  message: 'Added by smolt',
                },
              ],
              id: commentId.current++,
              removed: false,
              custom: true,
            },
          ]);
        }}
      >
        +
      </div>
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
