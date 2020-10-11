import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import logo from './logo.png';

const useStyles = createUseStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  title: {
    fontSize: '40px',
    marginBottom: '0.5rem',
    display: 'flex',
  },
  logo: {
    fontSize: 'inherit',
    height: '1em',
  },
  tagline: {
    fontSize: '18px',
    marginBottom: '0.5rem',
    color: '#AAAAAA',
    fontStyle: 'italic',
  },
  textarea: {
    marginBottom: '0.5rem',
  },
});

interface Props {
  setRawText: (s: string) => void;
}

const StartScreen: React.FC<Props> = ({ setRawText }: Props) => {
  const classes = useStyles();
  const [input, setInput] = useState<string>('');

  const readInput = (): void => {
    if (isFirefox) {
      setRawText(input);
    } else {
      navigator.clipboard.readText().then(data => {
        setRawText(data);
      });
    }
  };

  const isFirefox = navigator.userAgent.includes('Firefox');

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>
        <img src={logo} className={classes.logo} alt="smolt logo" />
        smolt
      </h1>
      <h3 className={classes.tagline}>the smol autograder for smol TAs</h3>
      {isFirefox && (
        <textarea
          className={classes.textarea}
          value={input}
          onChange={(e): void => {
            setInput(e.target.value);
          }}
        />
      )}
      <div>
        <button className={classes.button} onClick={readInput}>
          boop
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
