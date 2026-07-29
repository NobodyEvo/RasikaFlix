/**
 * main.js — RasikaFlix application entry point
 */

import manifest from 'virtual:photo-manifest';

import { runIntro }             from './components/intro.js';
import { showBirthdayModal }    from './components/birthdayModal.js';
import { initNavbar }           from './components/navbar.js';
import { renderHero }           from './components/hero.js';
import { createRow }            from './components/row.js';
import { initDetailsModal }     from './components/detailsModal.js';
import { renderRituals }        from './components/dailyRitualsSection.js';
import { renderTimeline }       from './components/timelineSection.js';
import { CATEGORIES }           from './data/categories.js';
import { shuffle, distribute }  from './utils/random.js';

// ── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  initDetailsModal();

  await new Promise(resolve => runIntro(resolve));
  await showBirthdayModal();

  const app = document.getElementById('app');
  app.classList.remove('hidden');
  app.style.opacity = '0';
  app.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => { app.style.opacity = '1'; }));

  initNavbar();

  // ── Photos-only for the hero slideshow ──
  const { photos, videos } = manifest;
  renderHero(photos);

  // ── Build all media items tagged with type ──
  const allItems = [
    ...photos.map(url => ({ url, type: 'photo' })),
    ...videos.map(url => ({ url, type: 'video' })),
  ];

  renderContentRows(allItems);
  renderRituals();
  renderTimeline();
}

// ── Content Rows ──────────────────────────────────────────────────────────────

function renderContentRows(allItems) {
  const container = document.getElementById('content-rows');
  if (!container) return;

  if (!allItems || allItems.length === 0) {
    renderEmptyState(container);
    return;
  }

  const shuffledItems = shuffle([...allItems]);

  // Shuffle categories — keep first 2 stable
  const stableHead  = CATEGORIES.slice(0, 2);
  const shuffleTail = shuffle(CATEGORIES.slice(2));
  const orderedCategories = [...stableHead, ...shuffleTail]
    .filter(c => c.id !== 'rituals');

  const numCategories = Math.min(orderedCategories.length, Math.max(2, Math.ceil(shuffledItems.length / 4)));
  const buckets = distribute(shuffledItems, numCategories, 3);

  buckets.forEach((bucket, i) => {
    if (bucket.length === 0) return;
    const category = orderedCategories[i];
    if (!category) return;

    const row = createRow({
      title:    category.title,
      captions: category.captions,
      items:    bucket,
    });

    if (!row) return;

    row.style.opacity    = '0';
    row.style.transform  = 'translateY(20px)';
    row.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    container.appendChild(row);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      row.style.opacity   = '1';
      row.style.transform = 'translateY(0)';
    }));
  });
}

function renderEmptyState(container) {
  container.innerHTML = `
    <div style="text-align:center;padding:4rem 2rem;color:#737373;">
      <p style="font-size:3rem;margin-bottom:1rem">📁</p>
      <h2 style="color:#e5e5e5;margin-bottom:.5rem">No photos yet</h2>
      <p style="font-size:.9rem;line-height:1.6;max-width:400px;margin:0 auto">
        Drop photos or videos into
        <code style="background:#2f2f2f;padding:2px 6px;border-radius:4px">assets/photos/</code>
        and run <code style="background:#2f2f2f;padding:2px 6px;border-radius:4px">npm run build</code>.
      </p>
    </div>`;
}

// ── Start ─────────────────────────────────────────────────────────────────────

main().catch(err => console.error('[RasikaFlix] Fatal error:', err));
