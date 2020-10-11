import { Result } from './types';

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
      console.log(values);
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
  return results;
};
