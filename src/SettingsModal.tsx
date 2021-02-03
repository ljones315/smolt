import React, { useCallback, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { MdClose, MdSettings } from 'react-icons/md';
import { EMOJI_KEY_LS, NAME_KEY_LS, useLocalStorage } from './util';
import AutosizeInput from 'react-input-autosize';
import { EmojiInfo } from './types';

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
    justifyContent: `center`,
  },
  emojis: {
    marginBottom: `0.5em`,
  },
  numInput: {
    borderBottom: `1px solid black`,
    marginRight: `1em`,
    textAlign: `right`,
  },
  textInput: {
    borderBottom: `1px solid black`,
  },
});

const SettingsModal = (): JSX.Element => {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useLocalStorage<string>(NAME_KEY_LS, 'smolt');

  // I wanted to store an object but it was causing an infinite loop in
  // useLocalStorage()
  const [emojiInfo, setEmojiInfo_as_string] = useLocalStorage<string>(
    EMOJI_KEY_LS,
    JSON.stringify([])
  );

  const getEmojiInfo = useCallback(() => {
    return JSON.parse(emojiInfo) as EmojiInfo;
  }, [emojiInfo]);

  const setEmojiInfo = useCallback(
    (info: EmojiInfo) => {
      setEmojiInfo_as_string(JSON.stringify(info));
    },
    [setEmojiInfo_as_string]
  );

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
          <br />
          <div className={classes.emojis}>
            {(JSON.parse(emojiInfo) as EmojiInfo).map((e, i) => {
              return (
                <div key={i} className={classes.line}>
                  <input
                    className={classes.numInput}
                    type="number"
                    min="0"
                    max="100"
                    // size={2}
                    value={(+e.cutoff).toString()}
                    onChange={e => {
                      const data = getEmojiInfo();
                      const val = Math.max(0, Math.min(100, +e.target.value));
                      data[i].cutoff = val;
                      setEmojiInfo(data);
                    }}
                  />

                  <input
                    className={classes.textInput}
                    type="text"
                    // size={5}
                    value={e.emoji}
                    onChange={e => {
                      const data = getEmojiInfo();
                      data[i].emoji = e.target.value;
                      setEmojiInfo(data);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className={classes.line}>
            <button
              onClick={() => {
                const e = getEmojiInfo();
                e.push({
                  emoji: '',
                  cutoff: 0,
                });
                setEmojiInfo(e);
              }}
            >
              +
            </button>
            {getEmojiInfo().length > 0 && (
              <button
                onClick={() => {
                  const e = getEmojiInfo();
                  e.pop();
                  setEmojiInfo(e);
                }}
              >
                -
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;
