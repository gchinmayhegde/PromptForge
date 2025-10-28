import React, { useState, useEffect } from 'react';
import { callAI } from '../api/openrouterClient';
import BlockEditor from './BlockEditor';
import { getPromptHistory, savePrompt, deletePrompt } from '../utils/storage';
import type { StoredPrompt } from '../utils/storage';


export default function PromptEditor() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<StoredPrompt[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getPromptHistory());
  }, []);

  const handlePromptChange = (combinedPrompt: string) => {
    setPrompt(combinedPrompt);
  };

  const handleTest = async () => {
    if (!prompt.trim()) {
      setError('Please fill in at least one block to generate a prompt.');
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await callAI(prompt, { model: 'gpt-4o-mini', max_tokens: 400 });
      setResponse(res.reply);
      // Save prompt to history if success
      savePrompt(prompt);
      setHistory(getPromptHistory());
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPrompt = (id: string) => {
    const item = history.find((h) => h.id === id);
    if (item) {
      setPrompt(item.prompt);
      setSelectedId(id);
      setError(null);
      setResponse(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeletePrompt = (id: string) => {
    deletePrompt(id);
    const updated = getPromptHistory();
    setHistory(updated);
    if (selectedId === id) {
      setSelectedId(null);
      setPrompt('');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '1.5rem auto' }}>
      <h2>Prompt Builder</h2>

      {/* History Dropdown */}
      {history.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '0.5rem' }}>Load Previous Prompt:</label>
          <select
            onChange={(e) => handleLoadPrompt(e.target.value)}
            value={selectedId || ''}
          >
            <option value="">-- Select --</option>
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {new Date(h.timestamp).toLocaleString()}
              </option>
            ))}
          </select>
          <button
            style={{ marginLeft: '0.5rem' }}
            onClick={() => {
              if (selectedId) handleDeletePrompt(selectedId);
            }}
            disabled={!selectedId}
          >
            Delete
          </button>
        </div>
      )}

      {/* Block-based editor */}
      <BlockEditor onPromptChange={handlePromptChange} />

      {/* Show the generated prompt preview */}
      {prompt && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Generated Prompt Preview:</h4>
          <pre
            style={{
              background: '#000000ff',
              padding: 10,
              borderRadius: 6,
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
            }}
          >
            {prompt}
          </pre>
        </div>
      )}

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
