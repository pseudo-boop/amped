// chat.js — GitHub Gist-backed persistent chat

const Chat = (() => {
  let msgs = [];
  let role = 'me';
  let pollTimer = null;
  let lastCount = 0;

  const gistUrl = () => `https://api.github.com/gists/${CONFIG.gistId}`;

  async function load() {
    try {
      const r = await fetch(gistUrl(), {
        headers: { Authorization: `token ${CONFIG.githubToken}` }
      });
      if (!r.ok) return msgs;
      const d = await r.json();
      return JSON.parse(d.files['chat.json']?.content || '[]');
    } catch { return msgs; }
  }

  async function save(list) {
    try {
      await fetch(gistUrl(), {
        method: 'PATCH',
        headers: {
          Authorization: `token ${CONFIG.githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: { 'chat.json': { content: JSON.stringify(list, null, 2) } }
        })
      });
    } catch { /* silent */ }
  }

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }

  function render() {
    const el = document.getElementById('chat-messages');
    if (!el) return;

    if (msgs.length === 0) {
      el.innerHTML = `<div class="chat-empty"><div class="em-icon">✉</div><div class="em-text">The conversation starts here…</div></div>`;
      return;
    }

    let lastDay = null;
    el.innerHTML = '';

    msgs.forEach(m => {
      const day = new Date(m.ts).toLocaleDateString('en-GB', { weekday:'long', month:'long', day:'numeric' });
      if (day !== lastDay) {
        lastDay = day;
        const d = document.createElement('div');
        d.className = 'chat-day-divider';
        d.textContent = day;
        el.appendChild(d);
      }

      const isMe = m.role === 'me';
      const init = isMe ? CONFIG.yourInitial : CONFIG.herInitial;
      const t = new Date(m.ts).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });

      const row = document.createElement('div');
      row.className = `msg-row ${m.role}`;
      row.innerHTML = `
        <div class="msg-av">${init}</div>
        <div class="msg-body">
          <div class="msg-bubble">${esc(m.text)}</div>
          <div class="msg-time">${t}</div>
        </div>`;
      el.appendChild(row);
    });

    el.scrollTop = el.scrollHeight;
  }

  async function send(text) {
    if (!text.trim()) return;
    msgs.push({ role, text: text.trim(), ts: new Date().toISOString() });
    lastCount = msgs.length;
    render();
    await save(msgs);
  }

  function startPoll() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(async () => {
      const freshStr = JSON.stringify(fresh);
        if (freshStr !== JSON.stringify(msgs)) {
          msgs = fresh;
          lastCount = fresh.length;
          render();
        }
    }, 8000);
  }

  function needsSetup() {
    return CONFIG.gistId === 'YOUR_GIST_ID_HERE' || CONFIG.githubToken === 'YOUR_GITHUB_TOKEN_HERE';
  }

  async function init() {
    const setup = document.getElementById('chat-setup-notice');
    const ui    = document.getElementById('chat-ui');

    if (needsSetup()) {
      if (setup) setup.style.display = 'block';
      if (ui)    ui.style.display    = 'none';
      return;
    }

    if (setup) setup.style.display = 'none';
    if (ui)    ui.style.display    = 'flex';

    msgs = await load();
    lastCount = msgs.length;
    render();
    startPoll();

    document.querySelectorAll('.role-pill').forEach(p => {
      p.addEventListener('click', () => {
        role = p.dataset.role;
        document.querySelectorAll('.role-pill').forEach(x => x.classList.remove('active'));
        p.classList.add('active');
      });
    });

    const ta  = document.getElementById('chat-textarea');
    const btn = document.getElementById('chat-send');

    function doSend() {
      const v = ta.value;
      if (!v.trim()) return;
      ta.value = '';
      ta.style.height = 'auto';
      send(v);
    }

    btn?.addEventListener('click', doSend);
    ta?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
    });
    ta?.addEventListener('input', () => {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    });
  }

  function destroy() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  return { init, destroy };
})();
