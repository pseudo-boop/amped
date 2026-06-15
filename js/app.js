// app.js — router + page renderers + player

// ── PLAYER BAR ────────────────────────────────
const Player = (() => {
  let playing = false;
  let pct = 38;
  let ticker = null;

  function init() {
    const playBtn  = document.getElementById('ctrl-play');
    const progFill = document.getElementById('progress-fill');

    playBtn?.addEventListener('click', () => {
      playing = !playing;
      playBtn.innerHTML = playing
        ? `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>`
        : `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;

      if (playing) {
        ticker = setInterval(() => {
          pct = Math.min(pct + 0.05, 100);
          if (progFill) progFill.style.width = pct + '%';
          if (pct >= 100) { playing = false; clearInterval(ticker); pct = 0; }
        }, 100);
      } else {
        clearInterval(ticker);
      }
    });

    document.querySelector('.pb-heart')?.addEventListener('click', function() {
      this.classList.toggle('liked');
      this.textContent = this.classList.contains('liked') ? '♥' : '♡';
    });
  }

  return { init };
})();

// ── ROUTES ────────────────────────────────────
const ROUTES = [
  { id: 'favourites', label: 'Favorites',           emoji: '🎵' },
  { id: 'Yours',       label: 'Yours',                emoji: '🌸' },
  { id: 'places',     label: 'Places We Have Been', emoji: '📍' },
  { id: 'food',       label: 'Food We Have Eaten',  emoji: '🍜' },
  { id: 'timeline', label: 'Our Timeline', emoji: '🗓' },
  { id: 'bingo',    label: 'Our Bingo',    emoji: '🎯' },
];

let currentPage = 'favourites';

function buildSidebar() {
  const lt = document.getElementById('sidebar-logo-text');
  if (lt) lt.textContent = CONFIG.siteTitle;

  document.getElementById('fav-btn')?.addEventListener('click', () => navigateTo('favourites'));

  const list = document.getElementById('collection-list');
  if (!list) return;
  list.innerHTML = '';

  ROUTES.filter(r => r.id !== 'favourites').forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'collection-item';
    btn.dataset.page = r.id;
    btn.innerHTML = `<div class="collection-thumb">${r.emoji}</div><span class="collection-name">${r.label}</span>`;
    btn.addEventListener('click', () => navigateTo(r.id));
    list.appendChild(btn);
  });
}

function setActiveSidebar(pageId) {
  const fb = document.getElementById('fav-btn');
  if (fb) {
    fb.style.background = pageId === 'favourites' ? 'var(--white)' : 'var(--pink-300)';
    fb.style.color      = 'var(--black)';
    fb.style.fontWeight = pageId === 'favourites' ? '600' : '400';
  }
  document.querySelectorAll('.collection-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === pageId);
  });
}

function navigateTo(pageId) {
  if (currentPage === 'Yours') Chat.destroy();
  currentPage = pageId;
  setActiveSidebar(pageId);

  document.querySelectorAll('.page').forEach(p => {
    p.classList.toggle('active', p.id === 'page-' + pageId);
  });

  if (pageId === 'favourites') Favourites.render();
  if (pageId === 'Yours')       { Yours.render(); Chat.init(); }
  if (pageId === 'places')     Places.render();
  if (pageId === 'food')       Food.render();
  if (pageId === 'timeline') Timeline.render();
  if (pageId === 'bingo')    Bingo.render();

  history.replaceState(null, '', '#' + pageId);
}

// ── FAVOURITES ────────────────────────────────
const Favourites = (() => {
  function render() {
    const el = document.getElementById('page-favourites');
    if (!el) return;

    const cover = el.querySelector('.hero-cover');
    if (cover) cover.innerHTML = CONFIG.heroCover
      ? `<img src="${CONFIG.heroCover}" alt="cover" onerror="this.parentElement.textContent='♪'">`
      : '♪';

    const rows = CONFIG.spotifyLinks.map((s, i) => `
      <a href="${s.url}" target="_blank" rel="noopener" class="track-row">
        <div style="display:contents">
          <div class="track-num"><span>${i+1}</span><span class="track-play-icon">▶</span></div>
          <div class="track-info">
            <div class="track-art">${s.emoji}</div>
            <div>
              <div class="track-name">${s.name}</div>
              <div class="track-desc">${s.description}</div>
            </div>
          </div>
          <div class="track-album">Spotify</div>
          <div class="track-duration">
            <button class="track-heart" onclick="event.preventDefault();this.classList.toggle('liked')">♡</button>
          </div>
        </div>
      </a>`).join('');

    const body = el.querySelector('.page-body');
    if (body) body.innerHTML = `
      <div class="track-header">
        <span>#</span><span>Title</span><span>Platform</span><span style="text-align:right">♡</span>
      </div>
      ${rows}
      <div class="open-spotify-row">
        🎵 &nbsp; All links open in <span class="spotify-green">Spotify</span> — make sure you're logged in
      </div>`;
  }
  return { render };
})();

// ── Yours ─────────────────────────────────────
const Yours = (() => {
  let rendered = false;
  function render() {
    if (rendered) return;
    rendered = true;
    const el = document.getElementById('page-Yours');
    if (!el) return;

    const needsSetup = CONFIG.gistId === 'YOUR_GIST_ID_HERE' || CONFIG.githubToken === 'YOUR_GITHUB_TOKEN_HERE';

    el.innerHTML = `
      <div class="chat-page-wrap">
        <div class="chat-hero">
          <div class="chat-hero-eyebrow">Collections</div>
          <div class="chat-hero-title">Yours</div>
          <div class="chat-hero-sub">A quiet place to write to each other.</div>
        </div>

        ${needsSetup ? `
        <div id="chat-setup-notice" class="chat-setup-notice">
          <strong>Set up the chat — 4 quick steps:</strong><br><br>
          1. Go to <a href="https://gist.github.com" target="_blank">gist.github.com</a>
             → New secret Gist → filename: <code>chat.json</code> → content: <code>[]</code><br>
          2. Go to <a href="https://github.com/settings/tokens" target="_blank">github.com/settings/tokens</a>
             → New classic token → tick only the <em>gist</em> scope → copy the token<br>
          3. Open <code>js/config.js</code> and fill in <code>gistId</code> and <code>githubToken</code><br>
          4. Reload — the chat will appear here
        </div>` : ''}

        <div id="chat-ui" style="${needsSetup ? 'display:none' : 'display:flex'}; flex-direction:column; flex:1; min-height:0; overflow:hidden;">
          <div class="chat-role-bar">
            Sending as:
            <button class="role-pill active" data-role="me">${CONFIG.yourName}</button>
            <button class="role-pill" data-role="them">${CONFIG.herName}</button>
          </div>
          <div class="chat-messages" id="chat-messages"></div>
          <div class="chat-sync-note">syncs via github gist · refreshes every 8s</div>
          <div class="chat-input-bar">
            <textarea id="chat-textarea" class="chat-textarea" placeholder="Write something…" rows="1"></textarea>
            <button id="chat-send" class="chat-send-btn">↑</button>
          </div>
        </div>
      </div>`;
  }
  return { render };
})();

// ── PLACES ───────────────────────────────────
const Places = (() => {
  let currentPlace = null;
  let currentIdx = 0;

  function render() {
    const el = document.getElementById('page-places');
    if (!el) return;

    const cards = CONFIG.places.map((p, i) => {
      const firstImg = p.images?.[0] || p.image || '';
      const count = (p.images || [p.image]).filter(Boolean).length;
      return `
        <div class="place-card" onclick="Places.openLightbox(${i}, 0)">
          <div class="place-img-wrap">
            <img class="place-img" src="${firstImg}" alt="${p.name}"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="place-img-placeholder" style="display:none">
              <div class="ph-big">📍</div>
              <div style="font-size:0.68rem;color:#bbb">${firstImg}</div>
            </div>
            ${count > 1 ? `<div class="place-count-badge">${count} photos</div>` : ''}
          </div>
          <div class="place-info">
            <div class="place-date">${p.date || ''}</div>
            <div class="place-name">${p.name}</div>
            <div class="place-note">${p.note}</div>
          </div>
        </div>`;
    }).join('');

    const body = el.querySelector('.page-body');
    if (body) body.innerHTML = `
      <div class="places-grid">${cards}</div>
      <div id="lightbox-overlay" class="lightbox-overlay" onclick="Places.closeLightbox(event)">
        <div class="lightbox-inner">
          <button class="lightbox-close-btn" onclick="Places.closeLightbox()">✕</button>
          <button class="lb-arrow lb-prev" onclick="event.stopPropagation();Places.shift(-1)">‹</button>
          <button class="lb-arrow lb-next" onclick="event.stopPropagation();Places.shift(1)">›</button>
          <img class="lightbox-img" id="lb-img" src="" alt="">
          <div class="lightbox-cap" id="lb-cap"></div>
          <div class="lb-dots" id="lb-dots"></div>
        </div>
      </div>`;
  }

  function openLightbox(placeIdx, imgIdx) {
    currentPlace = placeIdx;
    currentIdx = imgIdx;
    document.getElementById('lightbox-overlay').classList.add('open');
    updateLightbox();
  }

  function updateLightbox() {
    const p = CONFIG.places[currentPlace];
    const images = p.images || [p.image].filter(Boolean);
    const img = images[currentIdx];

    document.getElementById('lb-img').src = img;
    document.getElementById('lb-cap').innerHTML =
      `<strong>${p.name}</strong>${p.date ? ` &nbsp;·&nbsp; ${p.date}` : ''} &nbsp;·&nbsp; ${currentIdx + 1} / ${images.length}`;

    const dots = document.getElementById('lb-dots');
    dots.innerHTML = images.map((_, i) =>
      `<span class="lb-dot ${i === currentIdx ? 'active' : ''}" onclick="event.stopPropagation();Places.goTo(${i})"></span>`
    ).join('');

    const hasPrev = currentIdx > 0;
    const hasNext = currentIdx < images.length - 1;
    document.querySelector('.lb-prev').style.opacity = hasPrev ? '1' : '0.2';
    document.querySelector('.lb-next').style.opacity = hasNext ? '1' : '0.2';
  }

  function shift(dir) {
    const p = CONFIG.places[currentPlace];
    const images = p.images || [p.image].filter(Boolean);
    currentIdx = Math.max(0, Math.min(images.length - 1, currentIdx + dir));
    updateLightbox();
  }

  function goTo(idx) {
    currentIdx = idx;
    updateLightbox();
  }

  function closeLightbox(e) {
    if (!e || e.target.id === 'lightbox-overlay') {
      document.getElementById('lightbox-overlay')?.classList.remove('open');
    }
  }

  return { render, openLightbox, shift, goTo, closeLightbox };
})();
// const Places = (() => {
//   function render() {
//     const el = document.getElementById('page-places');
//     if (!el) return;

//     const cover = el.querySelector('.hero-cover');
//     if (cover && CONFIG.places[0]) cover.innerHTML = `<img src="${CONFIG.places[0].image}" alt="cover" onerror="this.parentElement.textContent='📍'">`;

//     const cards = CONFIG.places.map((p, i) => `
//       <div class="place-card" onclick="Places.open(${i})">
//         <img class="place-img" src="${p.image}" alt="${p.name}"
//              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
//         <div class="place-img-placeholder">
//           <div class="ph-big">📍</div>
//           <div style="font-size:0.68rem;color:#bbb;text-align:center">${p.image}</div>
//         </div>
//         <div class="place-info">
//           <div class="place-date">${p.date}</div>
//           <div class="place-name">${p.name}</div>
//           <div class="place-note">${p.note}</div>
//         </div>
//       </div>`).join('');

//     const body = el.querySelector('.page-body');
//     if (body) body.innerHTML = `
//       <div class="places-grid">${cards}</div>
//       <div id="lightbox-overlay" class="lightbox-overlay" onclick="Places.close(event)">
//         <div class="lightbox-inner">
//           <button class="lightbox-close-btn" onclick="Places.close()">✕</button>
//           <img class="lightbox-img" id="lb-img" src="" alt="">
//           <div class="lightbox-cap" id="lb-cap"></div>
//         </div>
//       </div>`;
//   }

//   function open(i) {
//     const p = CONFIG.places[i];
//     if (!p) return;
//     document.getElementById('lb-img').src = p.image;
//     document.getElementById('lb-cap').innerHTML = `<strong>${p.name}</strong> &nbsp;·&nbsp; ${p.date}`;
//     document.getElementById('lightbox-overlay').classList.add('open');
//   }

//   function close(e) {
//     if (!e || e.target.id === 'lightbox-overlay' || e.target.classList.contains('lightbox-close-btn')) {
//       document.getElementById('lightbox-overlay')?.classList.remove('open');
//     }
//   }

//   return { render, open, close };
// })();

// ── FOOD ─────────────────────────────────────
const Food = (() => {
  function render() {
    const el = document.getElementById('page-food');
    if (!el) return;

    const cover = el.querySelector('.hero-cover');
    if (cover) cover.textContent = '🍜';

    const items = CONFIG.foodMemories.map(f => `
      <div class="food-item">
        <div class="food-emoji">${f.emoji}</div>
        <div>
          <div class="food-item-name">${f.name}</div>
          <div class="food-item-where">${f.where}</div>
        </div>
      </div>`).join('');

    const body = el.querySelector('.page-body');
    if (!body) return;
    body.className = 'food-page-body';
    body.innerHTML = `
      <div class="food-content">
        <div class="food-gif-wrap">
          <img src="${CONFIG.foodGif}" alt="food gif"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="food-gif-placeholder">
            <div class="big-icon">🍜</div>
            <div class="ph-title">Your GIF goes here</div>
            <div class="ph-path">${CONFIG.foodGif}</div>
          </div>
        </div>
        <div class="food-quote">${CONFIG.foodQuote}</div>
        <div style="width:100%;max-width:520px">
          <div style="font-size:0.65rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#bbb;margin-bottom:8px">Food we remember</div>
          <div class="food-list">${items}</div>
        </div>
      </div>`;
  }
  return { render };
})();
// ── TIMELINE ─────────────────────────────────
const Timeline = (() => {
  function render() {
    const el = document.getElementById('page-timeline');
    if (!el) return;

    const items = CONFIG.timelineEvents.map((e, i) => {
      const isLast = i === CONFIG.timelineEvents.length - 1;
      return `
        <div class="tl-item">
          <div class="tl-dot-col">
            <div class="tl-dot"></div>
            ${isLast ? '' : '<div class="tl-line"></div>'}
          </div>
          <div class="tl-content">
            <div class="tl-date">${e.date}</div>
            <div class="tl-event-row">
              <span class="tl-emoji">${e.emoji}</span>
              <span class="tl-event">${e.title}</span>
            </div>
            <div class="tl-note">${e.note}</div>
          </div>
        </div>`;
    }).join('');

    const body = el.querySelector('.page-body');
    if (body) body.innerHTML = `<div class="tl-list">${items}</div>`;
  }
  return { render };
})();

// ── BINGO ─────────────────────────────────────
const Bingo = (() => {
  const GIST_FILE = 'bingo.json';

  async function load() {
    try {
      const r = await fetch(`https://api.github.com/gists/${CONFIG.gistId}`, {
        headers: { Authorization: `token ${CONFIG.githubToken}` }
      });
      if (!r.ok) return [];
      const d = await r.json();
      return JSON.parse(d.files[GIST_FILE]?.content || '[]');
    } catch { return []; }
  }

  async function save(checked) {
    try {
      await fetch(`https://api.github.com/gists/${CONFIG.gistId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `token ${CONFIG.githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: { [GIST_FILE]: { content: JSON.stringify(checked) } }
        })
      });
    } catch { /* silent */ }
  }

  let checked = [];

  async function render() {
    checked = await load();

    const squares = [...CONFIG.bingoSquares];
    squares.splice(12, 0, '__FREE__');

    const doneCount = checked.length + 1;
    const pct = Math.round((doneCount / 25) * 100);

    const cells = squares.map((sq, i) => {
      const isFree = sq === '__FREE__';
      const isDone = isFree || checked.includes(i);
      return `
        <div class="bingo-cell ${isFree ? 'free' : isDone ? 'done' : ''}"
             data-idx="${i}" onclick="Bingo.toggle(${i})">
          ${isFree ? 'FREE' : sq}
        </div>`;
    }).join('');

    const body = document.getElementById('page-bingo')?.querySelector('.page-body');
    if (body) body.innerHTML = `
      <div class="bingo-wrap">
        <div class="bingo-status">syncs with your friend · last loaded ${new Date().toLocaleTimeString()}</div>
        <div class="bingo-grid">${cells}</div>
        <div class="bingo-progress">
          <span>${doneCount} / 25 done</span>
          <div class="bingo-bar-wrap">
            <div class="bingo-bar-fill" style="width:${pct}%"></div>
          </div>
          <span>${pct}%</span>
        </div>
      </div>`;
  }

  async function toggle(idx) {
    const squares = [...CONFIG.bingoSquares];
    squares.splice(12, 0, '__FREE__');
    if (squares[idx] === '__FREE__') return;

    if (checked.includes(idx)) {
      checked = checked.filter(i => i !== idx);
    } else {
      checked.push(idx);
    }

    // optimistic UI update
    const cell = document.querySelector(`.bingo-cell[data-idx="${idx}"]`);
    if (cell) cell.classList.toggle('done', checked.includes(idx));

    await save(checked);
  }

  return { render, toggle };
})();
// ── BOOT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.title = CONFIG.siteTitle;
  buildSidebar();
  Player.init();
  // Sidebar collapse
const toggleBtn = document.getElementById('sidebar-toggle');
toggleBtn?.addEventListener('click', () => {
  document.body.classList.toggle('sidebar-collapsed');
  const collapsed = document.body.classList.contains('sidebar-collapsed');
  toggleBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
});

  const hash  = window.location.hash.replace('#', '');
  const valid = ROUTES.find(r => r.id === hash);
  navigateTo(valid ? hash : 'favourites');

  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    const v = ROUTES.find(r => r.id === h);
    if (v) navigateTo(h);
  });
});
