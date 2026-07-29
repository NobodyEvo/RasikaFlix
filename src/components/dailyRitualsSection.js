/**
 * dailyRitualsSection.js — Interactive ritual cards
 * Fixed: overlay z-index now covers the button properly
 * Fixed: close button fully resets the state
 */

import { DAILY_RITUALS } from '../data/dailyRituals.js';

export function renderRituals() {
  const grid = document.getElementById('rituals-grid');
  if (!grid) return;

  DAILY_RITUALS.forEach(ritual => {
    const card = createRitualCard(ritual);
    grid.appendChild(card);
  });
}

function createRitualCard(ritual) {
  const card = document.createElement('div');
  card.className = 'ritual-card';
  card.style.setProperty('--card-bg', ritual.color);

  // NOTE: ritual-message-overlay comes LAST in DOM so it renders on top naturally
  card.innerHTML = `
    <span class="ritual-emoji" aria-hidden="true">${ritual.emoji}</span>
    <h3 class="ritual-title">${escapeHtml(ritual.title)}</h3>
    <p class="ritual-subtitle">${escapeHtml(ritual.subtitle)}</p>
    <button class="ritual-btn">${escapeHtml(ritual.buttonText)}</button>
    <div class="ritual-message-overlay">
      <span class="ritual-message-emoji">${ritual.activeEmoji}</span>
      <p class="ritual-message-text">${escapeHtml(ritual.message)}</p>
      <button class="ritual-close-btn">Close ✕</button>
    </div>
  `;

  const btn      = card.querySelector('.ritual-btn');
  const closeBtn = card.querySelector('.ritual-close-btn');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    activateRitual(card);
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deactivateRitual(card);
  });

  return card;
}

function activateRitual(card) {
  card.classList.add('activated');
  clearTimeout(card._timer);
  // Auto-dismiss after 10 seconds
  card._timer = setTimeout(() => deactivateRitual(card), 10000);
}

function deactivateRitual(card) {
  clearTimeout(card._timer);
  card.classList.remove('activated');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
