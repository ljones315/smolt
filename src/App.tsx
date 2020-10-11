import React, { useState } from 'react';
import Main from './Main';
import StartScreen from './StartScreen';

const App: React.FC = () => {
  const [rawText, setRawText] = useState<string | null>();

  return (
    <div>
      {rawText == null ? (
        <StartScreen setRawText={setRawText} />
      ) : (
        <Main rawText={rawText} />
      )}
    </div>
  );
};

export default App;
