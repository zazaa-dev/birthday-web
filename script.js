const body = document.body;
const sparkleSymbols = ['💗', '🌸', '✨', '🩷'];
let audioContext = null;
let birthdayMusicEnabled = true;
let birthdayMusicStarted = false;

const audioToggle = document.createElement('button');
audioToggle.className = 'audio-toggle';
audioToggle.setAttribute('aria-label', 'Toggle birthday music');
audioToggle.textContent = '🔊';
body.appendChild(audioToggle);

function ensureAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

function playTone(frequency, duration, time, type = 'triangle', volume = 0.05) {
  const context = ensureAudioContext();
  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, time);

  gainNode.gain.setValueAtTime(volume, time);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, time + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(time);
  oscillator.stop(time + duration);
}

function playBirthdayMelody() {
  if (!birthdayMusicEnabled || birthdayMusicStarted) {
    return;
  }

  birthdayMusicStarted = true;
  const context = ensureAudioContext();
  if (!context) {
    return;
  }

  const melody = [
    { frequency: 392, duration: 0.7 },
    { frequency: 392, duration: 0.7 },
    { frequency: 440, duration: 0.7 },
    { frequency: 392, duration: 0.7 },
    { frequency: 523, duration: 0.7 },
    { frequency: 494, duration: 0.7 },
    { frequency: 392, duration: 0.7 },
    { frequency: 392, duration: 0.7 },
    { frequency: 440, duration: 0.7 },
    { frequency: 392, duration: 0.7 },
    { frequency: 587, duration: 0.7 },
    { frequency: 523, duration: 0.7 }
  ];

  const startTime = context.currentTime + 0.1;
  melody.forEach((note, index) => {
    playTone(note.frequency, note.duration, startTime + index * 0.5, 'sine', 0.03);
  });
}

function toggleBirthdayMusic() {
  birthdayMusicEnabled = !birthdayMusicEnabled;
  audioToggle.textContent = birthdayMusicEnabled ? '🔊' : '🔈';
  if (birthdayMusicEnabled && !birthdayMusicStarted) {
    playBirthdayMelody();
  }
}

function createSparkle(x, y) {
  const sparkle = document.createElement('span');
  sparkle.className = 'sparkle';
  sparkle.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1400);
}

function burstLove(x, y) {
  const stage = document.getElementById('loveStage');
  if (!stage) {
    return;
  }

  for (let i = 0; i < 24; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'love-particle';
    particle.textContent = '💗';

    const angle = (Math.PI * 2 * i) / 24;
    const distance = 90 + Math.random() * 110;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 30;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--dx', `${dx}px`);
    particle.style.setProperty('--dy', `${dy}px`);

    stage.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
  }
}

function triggerBubbleTransition(targetUrl) {
  const overlay = document.createElement('div');
  overlay.className = 'bubble-transition';
  body.appendChild(overlay);
  setTimeout(() => {
    window.location.href = targetUrl;
  }, 500);
}

function getCurrentPage() {
  const path = window.location.pathname.replace(/\/$/, '');
  const pageName = path.split('/').filter(Boolean).pop() || 'index.html';

  if (pageName === '' || pageName === 'index.html') {
    return 'index.html';
  }

  return pageName;
}

function autoAdvance() {
  const page = getCurrentPage();
  const nextPageMap = {
    'index.html': 'page-ucapan.html',
    'page-ucapan.html': 'page-foto.html',
    'page-foto.html': 'index.html'
  };

  const nextPage = nextPageMap[page];
  if (!nextPage) {
    return;
  }

  setTimeout(() => {
    triggerBubbleTransition(nextPage);
  }, 2800);
}

document.querySelectorAll('[data-next]').forEach((button) => {
  button.addEventListener('click', () => {
    triggerBubbleTransition(button.getAttribute('data-next'));
  });
});

const loveButton = document.getElementById('loveButton');
if (loveButton) {
  loveButton.addEventListener('click', (event) => {
    const rect = loveButton.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    burstLove(x, y);
    createSparkle(x, y);
  });
}

audioToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleBirthdayMusic();
});

body.addEventListener('click', (event) => {
  createSparkle(event.clientX, event.clientY);
  if (!birthdayMusicStarted) {
    playBirthdayMelody();
  }
});

window.addEventListener('load', () => {
  playBirthdayMelody();

  for (let i = 0; i < 12; i += 1) {
    setTimeout(() => createSparkle(window.innerWidth * Math.random(), window.innerHeight * Math.random()), i * 90);
  }
});
