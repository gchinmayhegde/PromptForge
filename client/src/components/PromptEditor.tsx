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

  const handlePromptChange = (combinedPrompt: string) => setPrompt(combinedPrompt);

  const handleTest = async () => {
    if (!prompt.trim()) {
      setError('Please fill in at least one block.');
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await callAI(prompt, { model: 'gpt-4o-mini', max_tokens: 400 });
      setResponse(res.reply);
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
    <div className="max-w-4xl mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white/70 backdrop-blur-md border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">🧠 PromptForge</h1>

      {/* History Dropdown */}
      {history.length > 0 && (
        <div className="mb-6 flex items-center gap-3">
          <label className="font-medium text-gray-700">Load Previous:</label>
          <select
            onChange={(e) => handleLoadPrompt(e.target.value)}
            value={selectedId || ''}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">-- Select a Prompt --</option>
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {new Date(h.timestamp).toLocaleString()}
              </option>
            ))}
          </select>
          <button
            onClick={() => selectedId && handleDeletePrompt(selectedId)}
            disabled={!selectedId}
            className={`px-3 py-2 rounded-lg text-white ${
              selectedId ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Delete
          </button>
        </div>
      )}

      {/* Block-based editor */}
      <BlockEditor onPromptChange={handlePromptChange} />

      {/* Prompt Preview */}
      {prompt && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">🧩 Combined Prompt</h4>
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm whitespace-pre-wrap">
            {prompt}
          </pre>
        </div>
      )}

      {/* Test Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleTest}
          disabled={loading}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-indigo-600 disabled:bg-gray-400"
        >
          {loading ? 'Testing…' : '⚙️ Test Prompt'}
        </button>
      </div>

      {/* Response */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">🪄 AI Response</h3>
        {loading && <div className="text-gray-600">Generating response...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {response && (
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap">
            {response}
          </pre>
        )}
      </div>
    </div>
  );
}
