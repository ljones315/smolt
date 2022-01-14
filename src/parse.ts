import { Result, Comment } from './types';
import { NAME_KEY_LS, sumPoints } from './util';

export const parseText = (rawText: string): Result[] => {
  const lines = rawText.split('\n');
  lines.shift(); // we have a leading empty line for no reason
  const results: Result[] = [];
  let currResult: Result = {
    name: '',
    value: 0,
    message: '',
  };

  const pointsRegex = /\((-?\d\d?)\/(\d\d?(\.\d+)?)\)/;

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

  let encoded = comments.reduce(
    (acc, c) => acc + (!c.removed ? `[${sumPoints(c)}] ${c.text}\n\n` : ''),
    ''
  );

  const storedName = localStorage.getItem(NAME_KEY_LS);

  if (storedName != null && storedName !== `"smolt"` && storedName !== `""`) {
    const name = JSON.parse(storedName);
    encoded = `${encoded}\n\n-${name}`;
  }

  if (removedSum !== 0) {
    return `[+${-removedSum}] Autograder error\n\n${encoded}`;
  }

  return encoded;
};
