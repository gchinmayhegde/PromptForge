import React, { useState, useEffect } from 'react';

export interface BlockData {
  role: string;
  context: string;
  input: string;
  outputStyle: string;
}

interface BlockEditorProps {
  onPromptChange: (prompt: string) => void;
}

export default function BlockEditor({ onPromptChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<BlockData>({
    role: '',
    context: '',
    input: '',
    outputStyle: '',
  });

  // Update parent whenever block content changes
  useEffect(() => {
    const combinedPrompt = buildPrompt(blocks);
    onPromptChange(combinedPrompt);
  }, [blocks]);

  const handleChange = (key: keyof BlockData, value: string) => {
    setBlocks((prev) => ({ ...prev, [key]: value }));
  };

  const buildPrompt = (b: BlockData) => {
    let parts: string[] = [];
    if (b.role.trim()) parts.push(`You are ${b.role.trim()}.`);
    if (b.context.trim()) parts.push(`Context: ${b.context.trim()}`);
    if (b.input.trim()) parts.push(`Task: ${b.input.trim()}`);
    if (b.outputStyle.trim()) parts.push(`Respond in ${b.outputStyle.trim()} style.`);
    return parts.join('\n\n');
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Prompt Blocks</h3>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '0.5rem' }}>
        <textarea
          placeholder="Role (e.g. expert JavaScript tutor)"
          value={blocks.role}
          onChange={(e) => handleChange('role', e.target.value)}
          rows={2}
          style={{ width: '100%', fontFamily: 'monospace', padding: 8 }}
        />
        <textarea
          placeholder="Context (e.g. helping a student understand closures)"
          value={blocks.context}
          onChange={(e) => handleChange('context', e.target.value)}
          rows={3}
          style={{ width: '100%', fontFamily: 'monospace', padding: 8 }}
        />
        <textarea
          placeholder="Task (e.g. explain with a short code example)"
          value={blocks.input}
          onChange={(e) => handleChange('input', e.target.value)}
          rows={3}
          style={{ width: '100%', fontFamily: 'monospace', padding: 8 }}
        />
        <textarea
          placeholder="Output Style (e.g. friendly, concise, markdown)"
          value={blocks.outputStyle}
          onChange={(e) => handleChange('outputStyle', e.target.value)}
          rows={2}
          style={{ width: '100%', fontFamily: 'monospace', padding: 8 }}
        />
      </div>
    </div>
  );
}
