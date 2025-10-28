import React, { useState } from 'react';
import { callAI } from '../api/openrouterClient';

export default function PromptEditor() {
  const [prompt, setPrompt] = useState('Write a concise explanation of closures in JavaScript.');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await callAI(prompt, { model: 'gpt-4o-mini', max_tokens: 400 });
      setResponse(res.reply);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '1.5rem auto' }}>
      <h2>Prompt Editor</h2>
      <textarea
        rows={10}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', padding: 10, fontFamily: 'monospace' }}
      />
      <div style={{ marginTop: 10 }}>
        <button onClick={handleTest} disabled={loading}>
          {loading ? 'Testing…' : 'Test Prompt'}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Response</h3>
        {loading && <div>Loading…</div>}
        {error && <pre style={{ color: 'red' }}>{error}</pre>}
        {response && <pre style={{ whiteSpace: 'pre-wrap' }}>{response}</pre>}
      </div>
    </div>
  );
}
