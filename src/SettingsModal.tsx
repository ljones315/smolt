import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { MdClose, MdSettings } from 'react-icons/md';
import { NAME_KEY_LS, useLocalStorage } from './util';
import AutosizeInput from 'react-input-autosize';

const useStyles = createUseStyles({
  topRight: {
    position: `absolute`,
    zIndex: 1,
    top: `1em`,
    right: `1em`,
  },
  icon: {
    cursor: 'pointer',
    marginRight: '2px',
    color: '#CECECE',
    '&:hover': {
      color: '#000000',
    },
  },
  title: {
    fontSize: `1.5em`,
  },
  label: { marginRight: `0.5em` },
  page: {
    position: `absolute`,
    top: 0,
    left: 0,
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `white`,
    zIndex: 2,
  },
  line: {
    display: `flex`,
    alignItems: `center`,
  },
});

const SettingsModal = (): JSX.Element => {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useLocalStorage<string>(NAME_KEY_LS, 'smolt');

  return (
    <>
      <div className={classes.topRight}>
        <div className={classes.icon}>
          <MdSettings size={24} onClick={() => setOpen(!isOpen)} />
        </div>
      </div>

      {isOpen && (
        <div className={classes.page}>
          <div className={classes.topRight}>
            <div className={classes.icon}>
              <MdClose size={24} onClick={() => setOpen(!isOpen)} />
            </div>
          </div>
          <h1 className={classes.title}>settings</h1>
          <br />
          <div className={classes.line}>
            <p className={classes.label}>your name: </p>
            <AutosizeInput
              onChange={e => setName(e.target.value)}
              value={name}
              style={{
                fontFamily: 'Open Sans',
                fontSize: '16px',
                background: 'none',
              }}
              onClick={(e): void => {
                e.stopPropagation();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;
