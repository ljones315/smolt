import React, { useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import AutosizeInput from 'react-input-autosize';
import { MdCallSplit } from 'react-icons/md';
import { Comment } from './types';
import { sumPoints } from './util';
import Message from './Message';

const useStyles = createUseStyles({
  container: {},
  headerHover: {
    // border: '1px solid blue !important',
    backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 100%, 98%)`,
  },
  header: {
    cursor: 'move',
    border: '1px solid #000000',
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
  merge: (from: number, to: number) => void;
}

const CommentBox: React.FC<Props> = ({
  comment,
  setText,
  splitComment,
  merge,
}: Props) => {
  const classes = useStyles();
  const [show, setShow] = useState(true);
  const [showSplit, setShowSplit] = useState(false);
  const [dragHover, setDragHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const showSplitTimeout = useRef<number>();

  return (
    <div
      className={classes.container}
      onDrop={(e): void => {
        e.preventDefault();
        e.stopPropagation();
        setDragHover(false);
        const fromId = Number(e.dataTransfer.getData('text/plain'));
        if (fromId === comment.id) {
          return;
        }
        merge(fromId, comment.id);
      }}
      onDragOver={(e): void => {
        setDragHover(true);
        e.preventDefault();
      }}
      onDragLeave={(e): void => {
        setDragHover(false);
      }}
    >
      <div
        className={`${classes.header} ${
          dragHover && !dragging ? classes.headerHover : ''
        }`}
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
        draggable
        onDragStart={(e): void => {
          e.dataTransfer.setData('text/plain', String(comment.id));
          setDragging(true);
        }}
        onDragEnd={(e): void => {
          setDragging(false);
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
            background: 'none',
          }}
          onClick={(e): void => {
            e.stopPropagation();
          }}
        />
        {showSplit && comment.results.length > 1 && (
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
              <Message message={r.message} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBox;
