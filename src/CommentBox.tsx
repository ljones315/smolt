import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
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
    // backgroundColor:
  },
  resultsContainer: {
    margin: '0 1em',
    overflowX: 'auto',
    overflowY: 'hidden',
    marginTop: '0.5em',
  },
});

interface Props {
  comment: Comment;
}

const CommentBox: React.FC<Props> = ({ comment }: Props) => {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  return (
    <div className={classes.container}>
      <div className={classes.header} onClick={(): void => setShow(!show)}>
        {comment.text} [{sumPoints(comment)}]
      </div>
      {show && (
        <div className={classes.resultsContainer}>
          {comment.results.map((r, i) => (
            <div key={i} className={classes.results}>
              <pre>{r.message}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBox;
