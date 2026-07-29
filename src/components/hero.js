/**
 * hero.js — Netflix-style auto-cycling slideshow hero banner
 *
 * - Crossfades between photos every 7 seconds
 * - Subtle Ken Burns zoom on each slide
 * - Title + subtitle update with each image
 * - "Watch Now" scrolls down to content rows
 */

import { HERO_TITLES, HERO_SUBTITLES } from '../data/categories.js';
import { pick, shuffle } from '../utils/random.js';

let slidePhotos = [];
let currentIndex  = 0;
let activeLayer   = 'a';   // 'a' | 'b'
let slideTimer    = null;

const SLIDE_INTERVAL     = 7000;  // ms between slides
const CROSSFADE_DURATION = 1400;  // ms for the crossfade

// ── Public ──────────────────────────────────────────────────────────────────

export function renderHero(photos) {
  if (!photos || photos.length === 0) {
    renderEmptyHero();
    return;
  }

  slidePhotos = shuffle([...photos]);
  buildSlideshow();
  wireButtons();
  showSlide(0, false);

  // Auto-advance only if more than 1 photo
  if (slidePhotos.length > 1) {
    startAutoSlide();
  }
}

// ── Setup ────────────────────────────────────────────────────────────────────

function buildSlideshow() {
  const container = document.getElementById('hero-image-container');
  container.innerHTML = `
    <img id="hero-layer-a" class="hero-layer hero-layer-active" src="" alt="" />
    <img id="hero-layer-b" class="hero-layer" src="" alt="" />
    <div class="hero-gradient"></div>
  `;

  // Dot navigation (only if multiple photos)
  if (slidePhotos.length > 1) {
    const banner = document.getElementById('hero-banner');
    const dots = document.createElement('div');
    dots.className = 'hero-dots';
    slidePhotos.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `hero-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(i, true);
        startAutoSlide();
      });
      dots.appendChild(dot);
    });
    banner.appendChild(dots);
  }
}

function wireButtons() {
  const playBtn = document.getElementById('hero-play-btn');
  const infoBtn = document.getElementById('hero-info-btn');

  const scrollToContent = () => {
    const rows = document.getElementById('content-rows');
    if (rows) rows.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (playBtn) playBtn.addEventListener('click', scrollToContent);
  if (infoBtn) infoBtn.addEventListener('click', scrollToContent);
}

// ── Slide transitions ────────────────────────────────────────────────────────

function showSlide(index, animate) {
  currentIndex = ((index % slidePhotos.length) + slidePhotos.length) % slidePhotos.length;
  const src = slidePhotos[currentIndex];

  const layerA = document.getElementById('hero-layer-a');
  const layerB = document.getElementById('hero-layer-b');
  if (!layerA || !layerB) return;

  const incoming = activeLayer === 'a' ? layerB : layerA;
  const outgoing = activeLayer === 'a' ? layerA : layerB;

  if (!animate) {
    // Instant — no transition
    layerA.src = src;
    layerA.classList.add('hero-layer-active');
    layerB.classList.remove('hero-layer-active');
    activeLayer = 'a';
    updateText(true);
    updateDots();
    kickKenBurns(layerA);
    return;
  }

  // Load into incoming layer first
  incoming.src = src;
  incoming.onload = () => {
    kickKenBurns(incoming);
    incoming.classList.add('hero-layer-active');
    outgoing.classList.remove('hero-layer-active');
    activeLayer = activeLayer === 'a' ? 'b' : 'a';
    updateText(false);
    updateDots();

    // Clear old layer src after transition
    setTimeout(() => { outgoing.src = ''; }, CROSSFADE_DURATION + 100);
  };

  // Also update text while transitioning
  fadeText(() => updateText(true));
}

function kickKenBurns(el) {
  el.style.animation = 'none';
  void el.offsetWidth; // force reflow
  el.style.animation = '';
  el.classList.remove('kb-running');
  void el.offsetWidth;
  el.classList.add('kb-running');
}

// ── Text ─────────────────────────────────────────────────────────────────────

const _assignedTitles = {};
const _assignedSubtitles = {};

function updateText(instant) {
  const titleEl    = document.getElementById('hero-title');
  const subtitleEl = document.getElementById('hero-subtitle');
  if (!titleEl || !subtitleEl) return;

  // Assign a stable title+subtitle to each photo index
  if (!_assignedTitles[currentIndex]) {
    _assignedTitles[currentIndex]    = pick(HERO_TITLES);
    _assignedSubtitles[currentIndex] = pick(HERO_SUBTITLES);
  }

  titleEl.textContent    = _assignedTitles[currentIndex];
  subtitleEl.textContent = _assignedSubtitles[currentIndex];

  if (!instant) {
    titleEl.classList.remove('hero-text-visible');
    subtitleEl.classList.remove('hero-text-visible');
    void titleEl.offsetWidth;
    titleEl.classList.add('hero-text-visible');
    subtitleEl.classList.add('hero-text-visible');
  } else {
    titleEl.classList.add('hero-text-visible');
    subtitleEl.classList.add('hero-text-visible');
  }
}

function fadeText(callback) {
  const titleEl    = document.getElementById('hero-title');
  const subtitleEl = document.getElementById('hero-subtitle');
  if (!titleEl) { callback(); return; }

  titleEl.classList.add('hero-text-fading');
  subtitleEl.classList.add('hero-text-fading');

  setTimeout(() => {
    titleEl.classList.remove('hero-text-fading');
    subtitleEl.classList.remove('hero-text-fading');
    callback();
  }, 400);
}

// ── Dots ─────────────────────────────────────────────────────────────────────

function updateDots() {
  const dots = document.querySelectorAll('.hero-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
}

// ── Auto-advance ─────────────────────────────────────────────────────────────

function startAutoSlide() {
  stopAutoSlide();
  slideTimer = setInterval(() => {
    showSlide(currentIndex + 1, true);
  }, SLIDE_INTERVAL);
}

function stopAutoSlide() {
  if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
}

// ── Empty state ───────────────────────────────────────────────────────────────

function renderEmptyHero() {
  const heroBanner = document.getElementById('hero-banner');
  heroBanner.style.background = 'linear-gradient(135deg, #1a0a1a 0%, #0f0020 50%, #14141a 100%)';
  const titleEl = document.getElementById('hero-title');
  const subEl   = document.getElementById('hero-subtitle');
  if (titleEl) titleEl.textContent = 'RasikaFlix ❤️';
  if (subEl)   subEl.textContent   = 'Drop photos into assets/photos/ and run npm run build.';
}
