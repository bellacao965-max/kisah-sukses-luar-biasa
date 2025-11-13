// ai.js - client-side helper with server proxy and offline fallback (supports image requests later)
(function(global){
  function localFallback(prompt){
    const p=(prompt||'').toLowerCase();
    if(!p) return "Maaf, saya tidak menerima input. / I didn't get input.";
    if(p.includes('halo')||p.includes('hai')) return "Halo! Saya Kisah Sukses Final AI Hebat — bagaimana saya bisa bantu?";
    if(p.includes('motivasi')) return "Consistency beats intensity. Konsistensi mengalahkan intensitas.";
    if(p.includes('gambar')||p.includes('image')) return "Untuk membuat gambar, gunakan tombol 'Generate Image' (online only).";
    return "Offline fallback: try again when you're online.";
  }

  async function askAI(prompt, opts={}){
    try {
      const res = await fetch('/api/ai', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({prompt, max_tokens: opts.max_tokens||300})
      });
      if(res.ok){
        const j = await res.json();
        return j.text || JSON.stringify(j);
      } else {
        const t = await res.text();
        console.error('AI server returned', t);
      }
    } catch(e){ console.error('AI fetch error', e); }
    return localFallback(prompt);
  }

  global.KSPai = { askAI };
})(window);
