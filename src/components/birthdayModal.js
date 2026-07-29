/**
 * birthdayModal.js — Birthday intro modal with confetti
 */

/**
 * Show the birthday modal. Fires confetti and resolves when user dismisses.
 * @returns {Promise<void>}
 */
export function showBirthdayModal() {
  return new Promise(resolve => {
    const modal = document.getElementById('birthday-modal');
    const enterBtn = document.getElementById('birthday-enter-btn');
    const canvas = document.getElementById('confetti-canvas');

    // Show modal
    modal.classList.remove('hidden');

    // Fire confetti
    fireConfetti(canvas);

    // Enter button handler
    enterBtn.addEventListener('click', () => {
      // Play background music starting at 20 seconds
      const bgMusic = document.getElementById('bg-music');
      if (bgMusic) {
        bgMusic.currentTime = 20;
        bgMusic.play().catch(e => console.warn('Audio playback failed:', e));

        // Custom loop: jump back to 20s when the song finishes
        bgMusic.addEventListener('ended', () => {
          bgMusic.currentTime = 20;
          bgMusic.play().catch(e => console.warn('Audio loop failed:', e));
        });
      }

      modal.style.transition = 'opacity 0.5s ease';
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.style.opacity = '';
        resolve();
      }, 500);
    }, { once: true });
  });
}

function fireConfetti(canvas) {
  // Try to use canvas-confetti if available, otherwise use our own implementation
  if (typeof confetti !== 'undefined') {
    runLibraryConfetti(canvas);
  } else {
    import('canvas-confetti').then(mod => {
      const confettiFn = mod.default;
      runWithConfetti(confettiFn, canvas);
    }).catch(() => {
      // Fallback: simple CSS confetti
      fallbackConfetti(canvas);
    });
  }
}

function runWithConfetti(confettiFn, canvas) {
  const myConfetti = confettiFn.create(canvas, { resize: true });

  const colors = ['#f43f5e', '#e91e63', '#ec4899', '#f59e0b', '#7c3aed', '#ffffff', '#ffd700'];

  // Initial burst
  myConfetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.4 },
    colors,
  });

  // Continuous side cannons
  let count = 0;
  const interval = setInterval(() => {
    count++;
    if (count > 8) { clearInterval(interval); return; }

    myConfetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
    });

    myConfetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
    });
  }, 300);
}

function runLibraryConfetti(canvas) {
  runWithConfetti(window.confetti, canvas);
}

/**
 * Fallback confetti using canvas directly (no library needed)
 */
function fallbackConfetti(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    size: Math.random() * 8 + 4,
    color: ['#f43f5e','#e91e63','#f59e0b','#7c3aed','#ffffff','#ffd700'][Math.floor(Math.random() * 6)],
    speed: Math.random() * 3 + 2,
    angle: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.2,
    oscillation: Math.random() * 40,
    oscillationSpeed: Math.random() * 0.05,
  }));

  let frame = 0;
  let animId;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    let allDone = true;
    particles.forEach(p => {
      if (p.y < canvas.height + 20) {
        allDone = false;
        p.y += p.speed;
        p.x += Math.sin(frame * p.oscillationSpeed) * p.oscillation * 0.05;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (!allDone) {
      animId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animId);
    }
  }

  draw();
}
