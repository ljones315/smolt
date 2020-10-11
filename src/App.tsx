import React, { useState } from 'react';
import MainScreen from './MainScreen';
import { parseText } from './parse';
import StartScreen from './StartScreen';

const App: React.FC = () => {
  const [rawText, setRawText] = useState<string | null>();

  return (
    <div>
      {rawText == null ? (
        <StartScreen setRawText={setRawText} />
      ) : (
        <MainScreen results={parseText(rawText)} />
      )}
    </div>
  );
};

export default App;
