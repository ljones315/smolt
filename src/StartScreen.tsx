import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';

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
    fontSize: '30px',
    borderRadius: '8px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#D53F8C',
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

  console.log(isFirefox);

  return (
    <div className={classes.root}>
      {isFirefox && (
        <textarea
          value={input}
          onChange={(e): void => {
            setInput(e.target.value);
          }}
        />
      )}
      <div>
        <button className={classes.button} onClick={readInput}>
          here we go
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
