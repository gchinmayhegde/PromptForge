export interface StoredPrompt {
  id: string;
  timestamp: number;
  prompt: string;
}

const STORAGE_KEY = 'promptforge_history';

/** Get all stored prompts, newest first */
export function getPromptHistory(): StoredPrompt[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => b.timestamp - a.timestamp)
      : [];
  } catch {
    return [];
  }
}

/** Save a new prompt to history */
export function savePrompt(prompt: string) {
  if (!prompt.trim()) return;
  const existing = getPromptHistory();
  const newItem: StoredPrompt = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    prompt,
  };
  const updated = [newItem, ...existing].slice(0, 20); // keep max 20
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/** Delete a prompt by ID */
export function deletePrompt(id: string) {
  const updated = getPromptHistory().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
