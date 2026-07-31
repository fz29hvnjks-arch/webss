/* Hover peek for calendar days. Click still opens the editable popup.
   Listens on the document so it survives the page re-drawing itself. */
(function () {
  if (window.__hxDayHover) return; window.__hxDayHover = true;

  /* Touchscreens have no hover — the popup on tap does the job there. */
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

  var tip = null;

  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement('div');
    tip.setAttribute('role', 'tooltip');
    tip.style.cssText = [
      'position:fixed', 'z-index:200', 'pointer-events:none',
      'max-width:260px', 'padding:9px 11px', 'border-radius:9px',
      'font-family:var(--font, sans-serif)', 'font-size:12px', 'line-height:1.5',
      'background:var(--text, #222)', 'color:var(--bg, #fff)',
      'box-shadow:0 6px 22px rgba(0,0,0,0.22)',
      'opacity:0', 'transition:opacity 120ms ease-out', 'white-space:pre-line'
    ].join(';');
    document.body.appendChild(tip);
    return tip;
  }

  function hide() { if (tip) tip.style.opacity = '0'; }

  document.addEventListener('mouseover', function (e) {
    var el = e.target && e.target.closest && e.target.closest('[data-preview]');
    if (!el) return hide();
    var text = el.getAttribute('data-preview');
    if (!text) return hide();

    var t = ensureTip();
    t.textContent = text;
    t.style.opacity = '1';

    var r = el.getBoundingClientRect();
    var w = t.offsetWidth || 260;
    var h = t.offsetHeight || 40;
    /* keep it on screen: flip above the cell if there's no room below */
    var top = r.bottom + 8;
    if (top + h > window.innerHeight - 8) top = r.top - h - 8;
    t.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left)) + 'px';
    t.style.top = Math.max(8, top) + 'px';
  });

  document.addEventListener('mouseout', function (e) {
    var to = e.relatedTarget;
    if (!to || !to.closest || !to.closest('[data-preview]')) hide();
  });

  window.addEventListener('scroll', hide, true);
  window.addEventListener('blur', hide);
})();
