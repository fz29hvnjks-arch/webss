/* Halcyon page extras: draggable sections, look system, password gate. Loaded by every tab. */
(function () {
  if (window.__halcyonExtras) return; window.__halcyonExtras = true;

  /* ---- password gate (shared across all pages) ---- */
  var HX_PASS = '452929';
  var HX_KEY = 'halcyon-auth';
  if (sessionStorage.getItem(HX_KEY) !== 'ok') {
    document.documentElement.style.visibility = 'hidden';
    var lock = document.createElement('div');
    lock.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#f3f2f2;display:flex;align-items:center;justify-content:center;font-family:Archivo,sans-serif;visibility:visible';
    lock.innerHTML = '<form style="display:flex;flex-direction:column;gap:14px;width:260px"><div style="font-weight:800;font-size:18px;letter-spacing:0.02em">SIBS</div><input type="password" placeholder="Password" autofocus style="font-family:inherit;font-size:14px;padding:10px 12px;border:1px solid #201e1d;background:#fff;color:#201e1d"><div style="font-size:12px;opacity:0.6">Hint: a number</div><button type="submit" style="font-family:inherit;font-weight:800;font-size:14px;padding:10px 0;background:#ec3013;color:#fff;border:none;cursor:pointer">Enter</button><div class="hx-err" style="font-size:12px;color:#ec3013;display:none">Incorrect password</div></form>';
    document.addEventListener('DOMContentLoaded', function () {
      document.body.appendChild(lock);
      var input = lock.querySelector('input'), err = lock.querySelector('.hx-err');
      lock.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value === HX_PASS) {
          try { sessionStorage.setItem(HX_KEY, 'ok'); } catch (x) {}
          document.documentElement.style.visibility = 'visible';
          lock.remove();
        } else { err.style.display = 'block'; input.value = ''; }
      });
    });
  }

  var css = [
    '@keyframes hxMarq { to { transform: translateX(-50%); } }',
    '@media (prefers-reduced-motion: reduce) { [data-look] .rnav+section::after, [data-look] .rnav+div::after { animation: none !important; } }',
    '@keyframes hxEnter { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }',
    '@keyframes hxRise { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }',
    '@keyframes hxHold { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0); } }',
    '.widget { transition: left 260ms cubic-bezier(.32,.72,0,1), top 260ms cubic-bezier(.32,.72,0,1), width 260ms cubic-bezier(.32,.72,0,1), height 260ms cubic-bezier(.32,.72,0,1); }',
    'body.hx-dragging .widget { transition: none !important; }',
    '.widget.hx-enter { animation: hxEnter 220ms cubic-bezier(.23,1,.32,1); }',
    '.hx-task { transition: opacity 140ms ease-out; }',
    '.widget button, .widget input { transition: background-color 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out; }',
    '.hx-msg { animation: hxRise 180ms ease-out; }',
    '.hx-hold { position: absolute; inset: 0; pointer-events: none; background: var(--accent); opacity: 0.16; clip-path: inset(0 100% 0 0); }',
    '.hx-hold.on { animation: hxHold 1.6s linear forwards; }',
    '@media (prefers-reduced-motion: reduce) { .widget { transition: none !important; } .widget.hx-enter, .hx-msg { animation: none !important; } .hx-hold.on { animation-duration: 1.6s !important; } }',
    '.hx-grip { position: absolute; top: 4px; right: 4px; z-index: 40; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 6px; border: 1px dashed var(--divider, #ccc); background: var(--surface2, #f8f8f8); color: var(--muted, #999); cursor: grab; opacity: 0; transition: opacity 0.15s; user-select: none; }',
    '.hx-movable:hover > .hx-grip { opacity: 0.9; }',
    '@media (max-width: 820px) { .hx-grip { display: none !important; } }',
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---- generic draggable sections (pages without the Dashboard widget canvas) ---- */
  function keyFor() { return 'halcyon-freemove-' + location.pathname.split('/').pop(); }
  function initMovables() {
    if (document.querySelector('.canvas')) return; // Dashboard has its own system
    var saved = {}; try { saved = JSON.parse(localStorage.getItem(keyFor())) || {}; } catch (x) {}
    var cols = document.querySelectorAll('.rcol');
    cols.forEach(function (el, i) {
      if (el.querySelector(':scope > .hx-grip')) return;
      el.classList.add('hx-movable');
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      var t = saved[i] || { x: 0, y: 0 };
      el.style.transform = 'translate(' + t.x + 'px,' + t.y + 'px)';
      var grip = document.createElement('div');
      grip.className = 'hx-grip'; grip.title = 'Drag to move · double-click to reset';
      grip.textContent = '⣶';
      el.appendChild(grip);
      var drag = null;
      grip.addEventListener('mousedown', function (e) {
        drag = { sx: e.clientX, sy: e.clientY, ox: t.x, oy: t.y };
        function mv(ev) { if (!drag) return; t.x = drag.ox + ev.clientX - drag.sx; t.y = drag.oy + ev.clientY - drag.sy; el.style.transform = 'translate(' + t.x + 'px,' + t.y + 'px)'; }
        function up() { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); drag = null; saved[i] = t; try { localStorage.setItem(keyFor(), JSON.stringify(saved)); } catch (x) {} }
        window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up);
        e.preventDefault();
      });
      grip.addEventListener('dblclick', function () {
        t = { x: 0, y: 0 }; el.style.transform = 'translate(0,0)'; saved[i] = t;
        try { localStorage.setItem(keyFor(), JSON.stringify(saved)); } catch (x) {}
      });
    });
  }

  /* ---- rotating ribbon quotes ---- */
  var HX_QUOTES = [
    'one thing at a time', 'you already started', 'small wins count', 'drink some water',
    'nobody is grading this', 'done beats tidy', 'rest is on the list too',
    'you can restart the day whenever', 'future you says thanks', 'pick the easy one first',
    'the meds, then the world', 'good enough is finished', 'you are allowed to want it',
    'this is your dashboard, not a test'
  ];
  function ribbonFor(seed) {
    var d = new Date(); var day = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
    var s = 0; for (var i = 0; i < seed.length; i++) s += seed.charCodeAt(i);
    var out = [];
    for (var k = 0; k < 4; k++) out.push(HX_QUOTES[(day + s + k * 5) % HX_QUOTES.length]);
    var line = out.map(function (q) { return '✿  ' + q + '  '; }).join('');
    return line + line;
  }

  /* ---- look system: mirror data-theme onto data-look ---- */
  var LOOK = {"riviera":"candy","graza":"poster","plaidcherry":"poster","mustardgrid":"poster","olivediner":"poster","kriti":"poster","cody":"groovy","peachy":"groovy","spark":"groovy","sorbet":"groovy","market":"editorial","cobalt":"editorial","terracotta":"editorial","cherrycream":"editorial","lavender":"editorial","cassjuniper":"cottage","clay":"cottage","kildya":"scrapbook","clodiy":"scrapbook","createheart":"scrapbook","sunflower":"riso","atnn":"riso","plantme":"riso","avocado":"riso","checkermint":"swiss","ginghamblue":"swiss","gridlilac":"swiss","stripetomato":"swiss","bubblegum":"candy","seafoam":"candy","dotbutter":"candy"};
  function syncLook() {
    document.querySelectorAll('[data-theme]').forEach(function (el) {
      var LOOKS = { poster:1, groovy:1, editorial:1, cottage:1, scrapbook:1, riso:1, swiss:1, candy:1 };
      var TYPES = { grotesk:1, rounded:1, typewriter:1, deco:1 };
      var m = (el.getAttribute('data-main') || '').replace(/^look-/, '');
      var l = LOOKS[m] ? m : (LOOK[el.getAttribute('data-theme')] || '');
      var t = TYPES[m] ? m : '';
      if (el.getAttribute('data-type') !== t) { if (t) el.setAttribute('data-type', t); else el.removeAttribute('data-type'); }
      if (l) el.setAttribute('data-zone', ''); else el.removeAttribute('data-zone');
      if (l) {
        var host = el.querySelector('.rnav + section, .rnav + div');
        if (host && !host.getAttribute('data-ribbon')) host.setAttribute('data-ribbon', ribbonFor(l + location.pathname));
      }
      if (el.getAttribute('data-look') !== l) { if (l) el.setAttribute('data-look', l); else el.removeAttribute('data-look'); }
    });
  }
  syncLook();
  new MutationObserver(syncLook).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-theme', 'data-main'] });
  document.addEventListener('DOMContentLoaded', syncLook);

  initMovables();
  setInterval(function () { syncLook(); initMovables(); }, 1200);
})();
