import React, { useState } from 'react';
import MainScreen from './MainScreen';
import StartScreen from './StartScreen';

const App: React.FC = () => {
  const [rawText, setRawText] = useState<string | null>();

  return (
    <div>
      {rawText == null ? (
        <StartScreen setRawText={setRawText} />
      ) : (
        <MainScreen rawText={rawText} />
      )}
    </div>
  );
};

export default App;
