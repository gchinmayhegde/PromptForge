require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = process.env.OPENROUTER_URL || 'https://openrouter.ai/api/v1/chat/completions';

app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, model = 'gpt-4o-mini', max_tokens = 512 } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    const body = { model, messages: [{ role: 'user', content: prompt }], max_tokens };

    const r = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content ?? JSON.stringify(data);
    res.json({ reply, raw: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`AI proxy listening on ${PORT}`));
