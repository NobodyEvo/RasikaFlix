/**
 * dailyRituals.js
 * Handcrafted interactive ritual cards.
 * Each ritual has an action that triggers on click.
 */

export const DAILY_RITUALS = [
  {
    id: 'hug',
    emoji: '🤗',
    title: 'Virtual Hug',
    subtitle: 'One free hug, courtesy of RasikaFlix',
    color: 'linear-gradient(135deg, #ff6b8a, #ff4757)',
    action: 'hug',
    message: 'Sending you the biggest, warmest hug right now. 🤗❤️',
    buttonText: 'Claim Your Hug',
    activeEmoji: '💝',
  },
  {
    id: 'forehead',
    emoji: '😘',
    title: 'Forehead Kiss',
    subtitle: 'The best kind of kiss, virtually delivered',
    color: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    action: 'kiss',
    message: '✨ *gentle forehead kiss* ✨\nYou\'re my favourite person in the world.',
    buttonText: 'Receive Kiss',
    activeEmoji: '✨',
  },
  {
    id: 'lockupp',
    emoji: '🔒',
    title: 'Lock Upp',
    subtitle: 'Certified chaos. Season 1 just dropped.',
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    action: 'lockupp',
    message: 'Bachha, lock upp ki kya? 😂\nDramatic behaviour 100% certified.\n🔒 You\'re iconic, honestly.',
    buttonText: 'Enter Lock Upp',
    activeEmoji: '🔒',
  },
  {
    id: 'goodnight',
    emoji: '🌙',
    title: 'Good Night',
    subtitle: 'The softest good night, just for you',
    color: 'linear-gradient(135deg, #1e3a5f, #0f2044)',
    action: 'goodnight',
    message: 'Good night, bachha. 🌙\nSleep well. Dream good dreams.\nYou\'re the last thing I think about. ⭐',
    buttonText: 'Say Good Night',
    activeEmoji: '🌠',
  },
  {
    id: 'love',
    emoji: '❤️',
    title: 'I Love You',
    subtitle: 'Always. Without question.',
    color: 'linear-gradient(135deg, #e11d48, #be123c)',
    action: 'love',
    message: 'I love you so much, bachha. ❤️\nMore than any word can say.\nAlways. Always. Always.',
    buttonText: 'Feel the Love',
    activeEmoji: '💖',
  },
  {
    id: 'birthday',
    emoji: '🎂',
    title: 'Birthday Wish',
    subtitle: 'One more birthday wish, just for you',
    color: 'linear-gradient(135deg, #ec4899, #db2777)',
    action: 'birthday',
    message: '🎂 Happy Birthday, my love! 🎂\nI hope this year is as beautiful as you are.\nYou deserve the world. And more. ❤️',
    buttonText: 'Receive Wish',
    activeEmoji: '🎉',
  },
];
