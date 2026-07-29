/**
 * intro.js — Netflix-style intro animation controller
 * Handles the "N" logo animation and transition to the app.
 */

const INTRO_DURATION = 3700; // ms — must match CSS animation timing

/**
 * Runs the intro animation, then calls onComplete.
 * If the user has seen the intro this session, skips it.
 */
export function runIntro(onComplete) {
  const introScreen = document.getElementById('intro-screen');

  // Skip intro if already seen this session (e.g., on hash navigation)
  if (sessionStorage.getItem('bf-intro-seen')) {
    introScreen.style.display = 'none';
    onComplete();
    return;
  }

  sessionStorage.setItem('bf-intro-seen', '1');

  // The CSS animation handles the visual. We just wait then call back.
  setTimeout(() => {
    introScreen.addEventListener('animationend', () => {
      introScreen.style.display = 'none';
    }, { once: true });
    onComplete();
  }, INTRO_DURATION);
}
