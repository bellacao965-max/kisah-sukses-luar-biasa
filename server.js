// server.js - Render-ready Express server with OpenAI proxy endpoint
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

app.post('/api/ai', async (req, res) => {
  try {
    const prompt = (req.body && req.body.prompt) || req.query.prompt || '';
    const max_tokens = (req.body && req.body.max_tokens) || 300;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      const text = prompt.toLowerCase().includes('motivasi') ?
        'Tetap semangat! Konsistensi adalah kunci sukses.' :
        'Saya AI offline: mulai dari langkah kecil setiap hari.';
      return res.json({ text });
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are Kisah Sukses Final AI Hebat — a bilingual motivational mentor (Indonesian and English).' },
          { role: 'user', content: prompt }
        ],
        max_tokens
      })
    });
    const j = await r.json();
    const text = j?.choices?.[0]?.message?.content || j?.choices?.[0]?.text || JSON.stringify(j);
    res.json({ text });
  } catch (err) {
    console.error('AI proxy error', err);
    res.status(500).json({ error: 'AI proxy failed', detail: String(err) });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log('🚀 Kisah Sukses Final AI Hebat running on port', PORT));
