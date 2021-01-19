import React, { useState } from 'react';
import MainScreen from './MainScreen';
import { parseText } from './parse';
import SettingsModal from './SettingsModal';
import StartScreen from './StartScreen';
import { usePreventWindowUnload } from './util';

const App: React.FC = () => {
  const [rawText, setRawText] = useState<string | null>();
  usePreventWindowUnload(rawText != null);

  return (
    <div>
      {rawText == null ? (
        <StartScreen setRawText={setRawText} />
      ) : (
        <MainScreen results={parseText(rawText)} />
      )}
      <SettingsModal />
    </div>
  );
};

export default App;
