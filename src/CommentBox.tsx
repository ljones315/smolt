import React, { useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import TextareaAutosize from 'react-autosize-textarea';
import { MdAdd, MdCallSplit, MdCancel, MdClose } from 'react-icons/md';
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
  icon: {
    cursor: 'pointer',
    marginRight: '2px',
    color: '#CECECE',
    '&:hover': {
      color: '#000000',
    },
  },
  iconContainer: {
    display: 'inline-block',
    top: '2px',
    position: 'relative',
  },
});

interface Props {
  comment: Comment;
  setText: (s: string) => void;
  splitComment: () => void;
  toggleComment: () => void;
  deleteComment: () => void;
  merge: (from: number, to: number) => void;
}

const CommentBox: React.FC<Props> = ({
  comment,
  setText,
  splitComment,
  toggleComment,
  deleteComment,
  merge,
}: Props) => {
  const classes = useStyles();
  const [show, setShow] = useState(true);
  const [isHovered, setHovered] = useState(false);
  const [dragHover, setDragHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const hoverTimeout = useRef<number>();

  const icons = (
    <div className={classes.iconContainer}>
      {comment.results.length > 1 && (
        <MdCallSplit
          className={classes.icon}
          onClick={(e): void => {
            e.stopPropagation();
            splitComment();
          }}
        />
      )}
      {comment.removed ? (
        <MdAdd
          className={classes.icon}
          onClick={(e): void => {
            e.stopPropagation();
            toggleComment();
          }}
        />
      ) : !comment.custom ? (
        <MdClose
          className={classes.icon}
          onClick={(e): void => {
            e.stopPropagation();
            toggleComment();
          }}
        />
      ) : (
        <MdCancel
          className={classes.icon}
          onClick={(e): void => {
            e.stopPropagation();
            deleteComment();
          }}
        />
      )}
    </div>
  );

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
      onDragLeave={(): void => {
        setDragHover(false);
      }}
    >
      <div
        className={`${classes.header} ${
          dragHover && !dragging ? classes.headerHover : ''
        }`}
        onClick={(): void => setShow(!show)}
        onMouseEnter={(): void => {
          window.clearTimeout(hoverTimeout.current);
          setHovered(true);
        }}
        onMouseLeave={(): void => {
          hoverTimeout.current = window.setTimeout(() => setHovered(false), 50);
        }}
        draggable
        onDragStart={(e): void => {
          e.dataTransfer.setData('text/plain', String(comment.id));
          setDragging(true);
        }}
        onDragEnd={(): void => {
          setDragging(false);
        }}
      >
        <span className={classes.points}>
          [{comment.removed ? `0` : sumPoints(comment)}]
        </span>{' '}
        <TextareaAutosize
          className={classes.input}
          onChange={(e): void => setText(e.currentTarget.value)}
          value={comment.text}
          style={{
            fontFamily: 'Open Sans',
            fontSize: '16px',
            background: 'none',
            width: '92%',
            color: comment.removed ? '#888888' : 'inherit',
            textDecoration: comment.removed ? 'line-through' : '',
            resize: 'none',
            border: 'none',
          }}
          onClick={(e): void => {
            e.stopPropagation();
          }}
        />
        {isHovered && icons}
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
