import React, { useState, useEffect } from 'react';

interface BlockEditorProps {
  onPromptChange: (combinedPrompt: string) => void;
}

export default function BlockEditor({ onPromptChange }: BlockEditorProps) {
  const [role, setRole] = useState('');
  const [context, setContext] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const combined = `
You are acting as: ${role || '[Specify a role or tone]'}.

Context: ${context || '[Describe background or details here]'}.

Task/Input: ${input || '[State what the user provides or wants to know]'}.

Expected Output: ${output || '[Describe the desired answer or format]'}.
`.trim();

    onPromptChange(combined);
  }, [role, context, input, output]);

  const blocks = [
    { label: 'Role', value: role, setValue: setRole, placeholder: 'e.g., Senior Frontend Developer, Data Scientist' },
    { label: 'Context', value: context, setValue: setContext, placeholder: 'e.g., Working on a dashboard using React' },
    { label: 'Input', value: input, setValue: setInput, placeholder: 'e.g., Need code to fetch API data efficiently' },
    { label: 'Output', value: output, setValue: setOutput, placeholder: 'e.g., Optimized code snippet with explanation' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {blocks.map((block, idx) => (
        <div
          key={idx}
          className="bg-white/60 border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur"
        >
          <h3 className="text-lg font-semibold mb-2 text-primary">{block.label}</h3>
          <textarea
            className="w-full h-28 resize-none border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400"
            value={block.value}
            onChange={(e) => block.setValue(e.target.value)}
            placeholder={block.placeholder}
          />
        </div>
      ))}
    </div>
  );
}
