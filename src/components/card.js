/**
 * card.js — Netflix card (photo + video support)
 * Portrait orientation, lazy loading, hover caption, video hover-play
 */

import { openDetailsModal } from './detailsModal.js';

/**
 * Creates a Netflix card element.
 * @param {{ src: string, type: 'photo'|'video', title: string, caption: string, category: string }} data
 * @returns {HTMLElement}
 */
export function createCard({ src, type = 'photo', title, caption, category }) {
  const card = document.createElement('div');
  card.className = 'netflix-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', title);

  if (type === 'video') {
    buildVideoCard(card, { src, title, caption, category });
  } else {
    buildPhotoCard(card, { src, title, caption, category });
  }

  return card;
}

// ── Photo Card ────────────────────────────────────────────────────────────────

function buildPhotoCard(card, { src, title, caption, category }) {
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-skeleton"></div>
      <img
        class="card-img"
        src=""
        data-src="${escapeAttr(src)}"
        alt="${escapeAttr(title)}"
        loading="lazy"
      />
      <div class="card-overlay"></div>
      <div class="card-caption">
        <p class="card-caption-text">${escapeHtml(caption)}</p>
      </div>
      <div class="card-actions">
        <button class="card-action-btn play" title="View" aria-label="View">▶</button>
        <button class="card-action-btn heart" title="Add to watchlist" aria-label="Add to watchlist">❤</button>
      </div>
    </div>
  `;

  // Lazy load
  const img = card.querySelector('.card-img');
  const skeleton = card.querySelector('.card-skeleton');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        img.src = dataSrc;
        img.onload  = () => { skeleton.style.opacity = '0'; setTimeout(() => skeleton.remove(), 300); };
        img.onerror = () => { skeleton.style.background = 'linear-gradient(135deg, #2a1a2a, #1a1a2a)'; };
      }
      obs.unobserve(entry.target);
    });
  }, { rootMargin: '300px' });

  observer.observe(card);
  wireCardInteraction(card, { src, type: 'photo', title, caption, category });
}

// ── Video Card ────────────────────────────────────────────────────────────────

function buildVideoCard(card, { src, title, caption, category }) {
  card.classList.add('card-video-type');

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-video-poster">
        <video
          class="card-video"
          src="${escapeAttr(src)}#t=0.001"
          muted
          loop
          preload="metadata"
          playsinline
        ></video>
        <div class="card-video-play-icon">▶</div>
        <div class="card-video-badge">VIDEO</div>
      </div>
      <div class="card-overlay"></div>
      <div class="card-caption">
        <p class="card-caption-text">${escapeHtml(caption)}</p>
      </div>
      <div class="card-actions">
        <button class="card-action-btn play" title="Play" aria-label="Play">▶</button>
        <button class="card-action-btn heart" title="Add to watchlist" aria-label="Add to watchlist">❤</button>
      </div>
    </div>
  `;

  const video = card.querySelector('.card-video');
  const playIcon = card.querySelector('.card-video-play-icon');

  // Hover preview
  card.addEventListener('mouseenter', () => {
    video.play().catch(() => {});
    playIcon.style.opacity = '0';
  });
  card.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
    playIcon.style.opacity = '';
  });

  wireCardInteraction(card, { src, type: 'video', title, caption, category });
}

// ── Shared interaction ────────────────────────────────────────────────────────

function wireCardInteraction(card, data) {
  const openModal = () => openDetailsModal(data);

  card.addEventListener('click', openModal);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
  });

  // Heart button
  const heartBtn = card.querySelector('.card-action-btn.heart');
  if (heartBtn) {
    heartBtn.addEventListener('click', e => {
      e.stopPropagation();
      heartBtn.style.animation = 'none';
      void heartBtn.offsetWidth;
      heartBtn.style.animation = 'heartbeat 0.6s ease';
      heartBtn.textContent = '💖';
      setTimeout(() => { heartBtn.textContent = '❤'; }, 1500);
    });
  }
}

// ── Utils ─────────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escapeAttr(str) {
  return String(str).replace(/"/g,'&quot;');
}
