import { Result, Comment, EmojiInfo } from './types';
import { EMOJI_KEY_LS, NAME_KEY_LS, sumPoints } from './util';

export const parseText = (rawText: string): Result[] => {
  const lines = rawText.split('\n');
  lines.shift(); // we have a leading empty line for no reason
  const results: Result[] = [];
  let currResult: Result = {
    name: '',
    value: 0,
    message: '',
  };

  const pointsRegex = /\((-?\d\d?)\/(\d\d?)\)/;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(pointsRegex) != null) {
      results.push(currResult);
      const values = lines[i].match(pointsRegex);
      const name = lines[i].match(/(.+) \(/);
      currResult = {
        name: name != null ? name[1] : '',
        value: values != null ? Number(values[1]) - Number(values[2]) : 0,
        message: '',
      };
    } else {
      currResult.message = `${currResult.message}\n${lines[i]}`;
    }
  }
  results.push(currResult);
  return results.map(r => ({ ...r, message: r.message.trim() }));
};

export const encodeText = (comments: Comment[]): string => {
  const removedSum = comments.reduce(
    (acc, c) => acc + (c.removed ? sumPoints(c) : 0),
    0
  );
  const removed =
    removedSum !== 0 ? `[+${-removedSum}] Autograder error` : null;

  const totalPoints =
    100 + comments.reduce((acc, c) => acc + (!c.removed ? sumPoints(c) : 0), 0);

  const storedName = localStorage.getItem(NAME_KEY_LS);
  let name = null;
  if (storedName != null && storedName !== `"smolt"` && storedName !== `""`) {
    name = `-${JSON.parse(storedName)}`;
  }

  const storedEmojis = localStorage.getItem(EMOJI_KEY_LS);
  let emojis = null;
  if (storedEmojis != null && storedEmojis !== `""`) {
    let emojiData = JSON.parse(JSON.parse(storedEmojis) as string) as EmojiInfo;

    emojiData = emojiData.sort((a, b) => b.cutoff - a.cutoff);
    console.log(emojiData);

    const match = emojiData.find(e => totalPoints >= e.cutoff);
    if (match) {
      emojis = `${match.emoji}`;
    }
  }

  const encoded = comments
    .map(c => (!c.removed ? `[${sumPoints(c)}] ${c.text}` : null))
    .filter(c => c)
    .join('\n\n');

  return [removed, encoded, emojis, name].filter(c => c).join('\n\n');
};
