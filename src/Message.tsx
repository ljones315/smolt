import React from 'react';
import { createUseStyles } from 'react-jss';
import { getGithubUrl } from './util';

const useStyles = createUseStyles({
  deemph: {
    color: '#CECECE',
    fontStyle: 'italic',
  },
});

interface Props {
  message: string;
}

const Message: React.FC<Props> = ({ message }: Props) => {
  const classes = useStyles();
  const lines = message.split('\n');
  return (
    <pre>
      {lines.map((line, i) => {
        const deemph =
          line.includes('at java.') ||
          line.includes('at org.junit.') ||
          line.match(/\.\.\. \d+ more/);

        const defaultLine = (
          <p key={i} className={deemph ? classes.deemph : ''}>
            {line}
          </p>
        );

        const ghUrl = getGithubUrl(line);

        if (ghUrl != null) {
          const parenMatch = line.match(/\((.+)\)/);
          if (parenMatch == null) return defaultLine;
          line = line.replace(/\(.+\)/, '');

          return (
            <p key={i} className={deemph ? classes.deemph : ''}>
              {line.replace(/\(.+\)/, '')}(
              <a href={ghUrl} target="_blank" rel="noreferrer noopener">
                {parenMatch[1]}
              </a>
              )
            </p>
          );
        }

        return defaultLine;
      })}
    </pre>
  );
};

export default Message;
