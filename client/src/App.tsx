import React from 'react';
import PromptEditor from './components/PromptEditor';

function App() {
  return (
    <div>
      <header style={{ padding: 20, borderBottom: '1px solid #eee' }}>
        <h1>PromptForge — MVP</h1>
      </header>
      <main>
        <PromptEditor />
      </main>
    </div>
  );
}

export default App;
