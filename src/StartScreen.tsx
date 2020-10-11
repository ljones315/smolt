import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    border: 'none',
    padding: '0.5em 1em',
    fontSize: '30px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
    color: 'white',
    backgroundColor: '#D53F8C',
  },
});

interface Props {
  setRawText: (s: string) => void;
}

const StartScreen: React.FC<Props> = ({ setRawText }: Props) => {
  const classes = useStyles();

  const readClipboard = (): void => {
    navigator.clipboard.readText().then(data => {
      setRawText(data);
    });
  };

  return (
    <div className={classes.root}>
      <div>
        <button className={classes.button} onClick={readClipboard}>
          here we go
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
