import React, { useState } from 'react';
import Main from './Main';

const App: React.FC = () => {
  const [rawText, setRawText] = useState<string | null>();

  const readClipboard = (): void => {
    navigator.clipboard.readText().then(data => {
      setRawText(data);
    });
  };

  return (
    <div className="App">
      {rawText == null ? (
        <button onClick={readClipboard}>Here we go</button>
      ) : (
        <Main rawText={rawText} />
      )}
    </div>
  );
};

export default App;
