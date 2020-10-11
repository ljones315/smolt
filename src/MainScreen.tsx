import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import CommentBox from './CommentBox';
import { parseText } from './parse';
import { Comment } from './types';

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
  rawText: string;
}

const MainScreen: React.FC<Props> = ({ rawText }: Props) => {
  const classes = useStyles();
  const results = parseText(rawText);
  const badResults = results.filter(r => r.value !== 0);
  const [comments, setComments] = useState<Comment[]>(
    badResults.map(r => ({ text: r.name, results: [r] }))
  );

  console.log(results);

  return (
    <div className={classes.root}>
      {comments.map((c, i) => (
        <div key={i} className={classes.cardContainer}>
          <CommentBox comment={c} />
        </div>
      ))}
    </div>
  );
};

export default MainScreen;
