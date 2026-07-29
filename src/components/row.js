/**
 * row.js — Horizontal scrollable content row
 * Supports mixed photo + video cards
 */

import { createCard } from './card.js';
import { pick } from '../utils/random.js';

/**
 * Creates a complete Netflix row.
 * @param {{ title: string, captions: string[], items: Array<{url:string, type:string}> }} rowData
 */
export function createRow({ title, captions, items }) {
  if (!items || items.length === 0) return null;

  const row = document.createElement('div');
  row.className = 'content-row';

  row.innerHTML = `
    <div class="row-header">
      <h2 class="row-title">${title}</h2>
      <span class="row-explore">Explore All →</span>
    </div>
    <div class="row-track-wrapper">
      <button class="row-arrow row-arrow-left" aria-label="Scroll left">‹</button>
      <div class="row-track" role="list" aria-label="${title}"></div>
      <button class="row-arrow row-arrow-right" aria-label="Scroll right">›</button>
    </div>
  `;

  const track      = row.querySelector('.row-track');
  const leftArrow  = row.querySelector('.row-arrow-left');
  const rightArrow = row.querySelector('.row-arrow-right');

  items.forEach(({ url, type }) => {
    const caption = pick(captions);
    const cleanTitle = title.replace(/^[^\w\u0900-\u097F]+/, '').trim();
    const card = createCard({ src: url, type, title: cleanTitle, caption, category: title });
    track.appendChild(card);
  });

  // Arrow scroll
  const scrollAmount = () => {
    const w = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-width')) || 200;
    return w * 3 + 8 * 3;
  };

  leftArrow.addEventListener('click',  () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  rightArrow.addEventListener('click', () => track.scrollBy({ left:  scrollAmount(), behavior: 'smooth' }));

  const updateArrows = () => {
    leftArrow.style.opacity      = track.scrollLeft > 10 ? '' : '0';
    leftArrow.style.pointerEvents = track.scrollLeft > 10 ? '' : 'none';
  };

  track.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();

  return row;
}
