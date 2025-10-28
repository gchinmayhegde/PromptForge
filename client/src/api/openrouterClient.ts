export type AIResponse = { reply: string; raw?: any };

export async function callAI(prompt: string, opts?: { model?: string; max_tokens?: number }): Promise<AIResponse> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model: opts?.model, max_tokens: opts?.max_tokens }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'AI request failed');
  }
  return res.json();
}
