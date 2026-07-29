/**
 * timelineSection.js — Relationship timeline renderer
 */

import { TIMELINE_EVENTS } from '../data/timeline.js';

/**
 * Renders the relationship timeline into #timeline-container.
 */
export function renderTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  TIMELINE_EVENTS.forEach((event, index) => {
    const item = createTimelineItem(event, index);
    container.appendChild(item);
  });

  // Animate items on scroll
  initTimelineAnimations(container);
}

function createTimelineItem(event, index) {
  const item = document.createElement('div');
  item.className = 'timeline-item';
  item.style.animationDelay = `${index * 0.15}s`;

  item.innerHTML = `
    <div class="timeline-dot" style="background: ${event.color}; box-shadow: 0 0 0 4px ${event.color}33, 0 0 20px ${event.color}66;"></div>
    <div class="timeline-card">
      <p class="timeline-date">${escapeHtml(event.date)}</p>
      <span class="timeline-emoji">${event.emoji}</span>
      <h3 class="timeline-title">${escapeHtml(event.title)}</h3>
      <p class="timeline-description">${escapeHtml(event.description)}</p>
    </div>
  `;

  return item;
}

function initTimelineAnimations(container) {
  const items = container.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
