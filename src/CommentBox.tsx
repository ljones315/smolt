import React, { useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import AutosizeInput from 'react-input-autosize';
import { MdCallSplit } from 'react-icons/md';
import { Comment } from './types';
import { sumPoints } from './util';

const useStyles = createUseStyles({
  container: {},
  header: {
    border: '1px black inset',
    padding: '1em',
  },
  results: {
    fontSize: '14px',
    marginTop: '0.5em',
    overflowX: 'auto',
    overflowY: 'hidden',
    // backgroundColor:
  },
  resultTitle: {
    fontSize: '14px',
    marginBottom: '0.5em',
    color: '#888888',
  },
  resultsContainer: {
    margin: '0 1em',
    marginTop: '0.5em',
  },
  input: {
    // styles have to be inline
  },
  points: {
    color: '#888888',
  },
  splitIcon: {
    cursor: 'pointer',
  },
});

interface Props {
  comment: Comment;
  setText: (s: string) => void;
  splitComment: () => void;
}

const CommentBox: React.FC<Props> = ({
  comment,
  setText,
  splitComment,
}: Props) => {
  const classes = useStyles();
  const [show, setShow] = useState(true);
  const [showSplit, setShowSplit] = useState(false);
  const showSplitTimeout = useRef<number>();

  return (
    <div className={classes.container}>
      <div
        className={classes.header}
        onClick={(): void => setShow(!show)}
        onMouseEnter={(): void => {
          window.clearTimeout(showSplitTimeout.current);
          setShowSplit(true);
        }}
        onMouseLeave={(): void => {
          showSplitTimeout.current = window.setTimeout(
            () => setShowSplit(false),
            50
          );
        }}
      >
        <span className={classes.points}>[{sumPoints(comment)}]</span>{' '}
        <AutosizeInput
          className={classes.input}
          onChange={(e): void => setText(e.target.value)}
          value={comment.text}
          style={{
            fontFamily: 'Open Sans',
            fontSize: '16px',
          }}
          onClick={(e): void => {
            e.stopPropagation();
          }}
        />
        {showSplit && (
          <MdCallSplit
            className={classes.splitIcon}
            onClick={(e): void => {
              e.stopPropagation();
              splitComment();
            }}
          />
        )}
      </div>
      {show && (
        <div className={classes.resultsContainer}>
          {comment.results.map((r, i) => (
            <div key={i} className={classes.results}>
              <p className={classes.resultTitle}>{r.name}</p>
              <pre>{r.message}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBox;
