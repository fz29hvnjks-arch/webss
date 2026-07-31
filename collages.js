/* Daily art directions for the dashboard hero.
   Three families, drawn from the reference boards:
     · STRIPE / GINGHAM GROUNDS — painted-still-life stagings (cobalt & cream, orange & cream)
     · RISO POSTERS — flat ground, one ink, hand-drawn wobble frame
     · GRAPHIC PRINT — Memphis shapes, halftone, patchwork
   Each entry is pure CSS plus optional real art. */
(function () {
  /* Collage palette resolves from the active theme, so the daily art follows the theme. */
  var CREAM = 'var(--surface2,#F4EFD9)', COCOA = 'var(--text,#5B3A2E)',
      ORANGE = 'var(--accent,#FF6A1A)',
      BLUSH = 'var(--metric-1,#F08AA6)', CORAL = 'var(--metric-2,#FF8A6B)', SUN = 'var(--metric-4,#F5C542)',
      BLUE = 'color-mix(in oklab, var(--accent-deep,#8BB9D9) 62%, var(--surface2,#F4EFD9))',
      SAGE = 'var(--metric-3,#A6B89A)', TERRA = 'var(--accent-deep,#C96B4B)',
      COBALT = 'var(--accent-deep,#2F6FB5)', POSTER_RED = 'var(--accent,#E4372B)', DEEP_RED = 'var(--accent-deep,#8F1F16)',
      POSTER_PINK = 'var(--tint,#F3C4CB)', MINT = 'var(--tint,#BFDDD0)', PINE = 'var(--text,#2F4A38)', OLIVE = 'var(--accent-deep,#6E7A3F)';

  window.HX_COLLAGES = [
    /* ---- stripe & gingham grounds ---- */
    {
      name: 'Cobalt Stripe',
      base: CREAM, plate: CREAM, ink: COCOA, sticker: SUN, stickerInk: COCOA,
      l1: 'repeating-linear-gradient(90deg, ' + COBALT + ' 0 34px, transparent 34px 74px)',
      l2: 'radial-gradient(circle at 78% 24%, ' + SUN + ' 0 76px, transparent 77px)',
      l3: 'radial-gradient(circle at 24% 78%, ' + SAGE + ' 0 60px, transparent 61px)'
    },
    {
      name: 'Orange Ground',
      base: ORANGE, plate: CREAM, ink: COCOA, sticker: COBALT, stickerInk: CREAM,
      l1: 'repeating-linear-gradient(90deg, ' + CREAM + ' 0 30px, transparent 30px 70px)',
      l2: 'radial-gradient(circle at 80% 78%, ' + SUN + ' 0 82px, transparent 83px)',
      l3: 'none'
    },
    {
      name: 'Gingham Table',
      base: CREAM, plate: CREAM, ink: COCOA, sticker: CORAL, stickerInk: COCOA,
      l1: 'repeating-linear-gradient(90deg, ' + BLUE + ' 0 30px, transparent 30px 60px)',
      l2: 'repeating-linear-gradient(0deg, ' + BLUE + ' 0 30px, transparent 30px 60px)',
      l3: 'radial-gradient(circle at 74% 76%, ' + SUN + ' 0 68px, transparent 69px)'
    },
    {
      name: 'Star Plaid',
      base: CREAM, plate: CREAM, ink: COCOA, sticker: BLUSH, stickerInk: COCOA,
      art: 'uploads/download.jpg', artOpacity: 0.5,
      l1: 'none', l2: 'none', l3: 'none'
    },

    /* ---- riso posters: flat ground, one ink, wobble frame ---- */
    {
      name: 'Riso Pink',
      base: POSTER_PINK, plate: POSTER_PINK, ink: DEEP_RED, sticker: POSTER_RED, stickerInk: CREAM,
      frame: DEEP_RED,
      l1: 'none', l2: 'none',
      l3: 'radial-gradient(' + DEEP_RED + ' 1px, transparent 1.1px) 0 0/11px 11px'
    },
    {
      name: 'Riso Mint',
      base: MINT, plate: MINT, ink: PINE, sticker: POSTER_RED, stickerInk: CREAM,
      frame: PINE,
      l1: 'radial-gradient(circle at 82% 20%, ' + SUN + ' 0 60px, transparent 61px)',
      l2: 'none',
      l3: 'radial-gradient(' + PINE + ' 1px, transparent 1.1px) 0 0/13px 13px'
    },
    {
      name: 'Riso Olive',
      base: CREAM, plate: CREAM, ink: OLIVE, sticker: OLIVE, stickerInk: CREAM,
      frame: OLIVE,
      l1: 'repeating-linear-gradient(0deg, ' + OLIVE + ' 0 3px, transparent 3px 24px) 0 0/100% 100%',
      l2: 'none', l3: 'none'
    },

    /* ---- graphic print ---- */
    {
      name: 'Memphis Squiggle',
      base: CREAM, plate: CREAM, ink: COCOA, sticker: COBALT, stickerInk: CREAM,
      l1: 'repeating-linear-gradient(90deg, ' + COBALT + ' 0 26px, transparent 26px 66px) 0 0/100% 100%',
      l2: 'radial-gradient(circle at 80% 22%, ' + SUN + ' 0 74px, transparent 75px)',
      l3: 'radial-gradient(circle at 22% 80%, ' + TERRA + ' 0 58px, transparent 59px)'
    },
    {
      name: 'Halftone Horizon',
      base: CREAM, plate: CREAM, ink: COCOA, sticker: TERRA, stickerInk: CREAM,
      l1: 'radial-gradient(220px 220px at 50% 0%, ' + ORANGE + ' 0 100%, transparent 0)',
      l2: 'radial-gradient(' + CORAL + ' 2.4px, transparent 2.5px) 0 0/15px 15px, linear-gradient(' + BLUE + ',' + BLUE + ') 0 100%/100% 92px no-repeat',
      l3: 'radial-gradient(' + COCOA + ' 1px, transparent 1.1px) 0 0/9px 9px'
    },
    {
      name: 'Patchwork Stripes',
      base: CREAM, plate: CREAM, ink: COCOA, sticker: SAGE, stickerInk: COCOA,
      l1: 'repeating-linear-gradient(90deg, ' + SUN + ' 0 22px, transparent 22px 52px) 0 0/100% 46% no-repeat',
      l2: 'repeating-linear-gradient(0deg, ' + BLUSH + ' 0 14px, transparent 14px 38px) 0 100%/56% 54% no-repeat',
      l3: 'linear-gradient(' + TERRA + ',' + TERRA + ') 60% 100%/40% 54% no-repeat, radial-gradient(circle at 82% 22%, ' + COBALT + ' 0 40px, transparent 41px)'
    }
  ];

  window.HX_COLLAGES.forEach(function (v) {
    v.artCss = v.art ? ('url("' + v.art + '")') : 'none';
    v.artOpacity = v.art ? (v.artOpacity == null ? 0.5 : v.artOpacity) : 0;
    /* frame present → draw it; absent → a transparent border of zero weight */
    v.frameWidth = v.frame ? '5px' : '0px';
    v.frameInk = v.frame || 'transparent';
    v.plate = v.plate || CREAM;
  });

  /* Paint today's collage into any [data-collage-band] on the page.
     Done through a stylesheet so React re-renders can't wipe it. */
  window.HX_PAINT_BAND = function () {
    var v = window.HX_COLLAGE_TODAY();
    var el = document.getElementById('hx-band-style') || document.createElement('style');
    el.id = 'hx-band-style';
    el.textContent =
      '[data-collage-band]{background:' + v.base + '}' +
      '[data-collage-band] .hxl1{background:' + v.l1 + '}' +
      '[data-collage-band] .hxl2{background:' + v.l2 + '}' +
      '[data-collage-band] .hxl3{background:' + v.l3 + '}' +
      '[data-collage-band] .hxart{background-image:' + v.artCss + ';opacity:' + v.artOpacity + '}';
    if (!el.parentNode) document.head.appendChild(el);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.HX_PAINT_BAND(); });
  } else {
    window.HX_PAINT_BAND();
  }

  /* Local-date day number, so it flips at the user's midnight, not UTC. */
  window.HX_COLLAGE_TODAY = function () {
    var d = new Date();
    var day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
    return window.HX_COLLAGES[day % window.HX_COLLAGES.length];
  };
})();
