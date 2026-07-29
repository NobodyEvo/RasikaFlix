/**
 * detailsModal.js — Full-screen details overlay with video support
 */

/**
 * Opens the details modal.
 * @param {{ src: string, type?: 'photo'|'video', title: string, caption: string, category: string }} data
 */
export function openDetailsModal(data) {
  const { src, type = 'photo', title, caption, category } = data;

  const modal    = document.getElementById('details-modal');
  const img      = document.getElementById('modal-img');
  const video    = document.getElementById('modal-video');
  const titleEl  = document.getElementById('modal-title');
  const captionEl  = document.getElementById('modal-caption');
  const categoryEl = document.getElementById('modal-category');
  const heartBtn = document.getElementById('modal-heart-btn');

  // Show/hide media elements
  const bgMusic = document.getElementById('bg-music');
  
  if (type === 'video') {
    if (bgMusic) bgMusic.pause();
    img.style.display   = 'none';
    video.style.display = 'block';
    video.src = src;
    video.load();
    video.play().catch(() => {});
  } else {
    video.style.display = 'none';
    video.src = '';
    img.style.display   = 'block';
    img.src = src;
    img.alt = title;
  }

  titleEl.textContent    = title;
  captionEl.textContent  = caption;
  categoryEl.textContent = `Category: ${category}`;
  heartBtn.classList.remove('hearted');
  heartBtn.textContent   = '❤️ Add to Watchlist';

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modal-close');
  setTimeout(() => closeBtn.focus(), 50);
}

/**
 * Closes the details modal.
 */
export function closeDetailsModal() {
  const modal = document.getElementById('details-modal');
  const video = document.getElementById('modal-video');

  // Stop video if playing
  if (video) {
    if (video.src && video.src !== '' && video.style.display !== 'none') {
      const bgMusic = document.getElementById('bg-music');
      if (bgMusic) bgMusic.play().catch(() => {});
    }
    video.pause();
    video.src = '';
  }

  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * Initialise modal event listeners. Call once on app init.
 */
export function initDetailsModal() {
  const modal    = document.getElementById('details-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const heartBtn = document.getElementById('modal-heart-btn');
  const playBtn  = document.getElementById('modal-play-btn');

  closeBtn.addEventListener('click', closeDetailsModal);
  backdrop.addEventListener('click', closeDetailsModal);

  heartBtn.addEventListener('click', () => {
    if (!heartBtn.classList.contains('hearted')) {
      heartBtn.classList.add('hearted');
      heartBtn.textContent = '💖 In Your Watchlist';
    }
  });

  playBtn.addEventListener('click', () => {
    heartBtn.classList.add('hearted');
    heartBtn.textContent = '💖 In Your Watchlist';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeDetailsModal();
    }
  });
}
