// ═══════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════

const gameState = {
  currentDensity: 0,
  vibrationScore: 0,
  exchangeCount: 0,
  conversationHistory: []
};

// ═══════════════════════════════════════════
// GAME DATABASE
// ═══════════════════════════════════════════

const DENSITIES = [
  {
    number: "First Density",
    roman: "I",
    theme: "The Density of Awareness",
    description: "Here, consciousness begins. The elements awaken. Fire, wind, earth, water stir into being. You are invited to simply — be.",
    minExchanges: 2,
    passThreshold: 20
  },
  {
    number: "Second Density",
    roman: "II",
    theme: "The Density of Growth",
    description: "Growth toward the light. Plants reach upward. Animals seek. Love begins as instinct. Choices between fear and love emerge.",
    minExchanges: 2,
    passThreshold: 25
  },
  {
    number: "Third Density",
    roman: "III",
    theme: "The Density of Self-Awareness",
    description: "The great choice. You become aware of yourself as a self. Ego forms. Will you serve others, or serve only yourself?",
    minExchanges: 3,
    passThreshold: 30
  },
  {
    number: "Fourth Density",
    roman: "IV",
    theme: "The Density of Love",
    description: "Love and understanding deepen. The veil thins. You begin to feel others as yourself. Compassion becomes a way of being.",
    minExchanges: 3,
    passThreshold: 35
  },
  {
    number: "Fifth Density",
    roman: "V",
    theme: "The Density of Wisdom",
    description: "Wisdom is the balance of love. Logic and intuition converge. You learn that not all love is wise, and not all wisdom is loving.",
    minExchanges: 3,
    passThreshold: 40
  },
  {
    number: "Sixth Density",
    roman: "VI",
    theme: "The Density of Unity",
    description: "Unity consciousness. The boundary between self and other dissolves. Service to others and service to self become one path.",
    minExchanges: 4,
    passThreshold: 45
  },
  {
    number: "Seventh Density",
    roman: "VII",
    theme: "The Gateway Density",
    description: "The gateway to intelligent infinity. Words begin to fail. You stand at the threshold of complete reunion with the One Creator.",
    minExchanges: 4,
    passThreshold: 50
  }
];

// ═══════════════════════════════════════════
// SECOND DENSITY CHOICES
// ═══════════════════════════════════════════

const SECOND_DENSITY_CHOICES = [
  {
    question: "A wounded animal crosses your path. It looks at you with desperate eyes. What do you do?",
    options: [
      { text: "I stop and tend to its wounds, staying as long as it needs me.", score: 15, good: true },
      { text: "I acknowledge it with compassion but feel I cannot help.", score: 8, good: true },
      { text: "I feel sorrow but feel powerless to help.", score: 4, good: true },
      { text: "I walk past — nature must take its course.", score: -5, good: false }
    ]
  },
  {
    question: "You see a small plant struggling to grow in the shade. What do you feel?",
    options: [
      { text: "A deep kinship — I too reach toward the light despite obstacles.", score: 15, good: true },
      { text: "Curiosity about its nature and quiet admiration.", score: 8, good: true },
      { text: "Nothing in particular — it is just a plant.", score: -3, good: false },
      { text: "Indifference — only strong things deserve to survive.", score: -8, good: false }
    ]
  },
  {
    question: "A stranger weeps alone. You do not know their story. What do you do?",
    options: [
      { text: "I sit beside them in silence — presence itself is love.", score: 15, good: true },
      { text: "I ask if they need anything, ready to listen.", score: 12, good: true },
      { text: "I feel uncomfortable and look away.", score: -3, good: false },
      { text: "Their suffering is their own business.", score: -8, good: false }
    ]
  }
];

// ═══════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════

function generateStars(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const x        = Math.random() * 100;
    const y        = Math.random() * 100;
    const size     = Math.random() * 2 + 0.5;
    const duration = (Math.random() * 4 + 2).toFixed(1);
    const delay    = (Math.random() * 4).toFixed(1);
    star.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      --duration: ${duration}s;
      --delay: ${delay}s;
    `;
    container.appendChild(star);
  }
}

function showScreen(screenId) {
  const allScreens = document.querySelectorAll('.screen');
  allScreens.forEach(function(screen) {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

function typewriterEffect(element, text, speed) {
  element.textContent = '';
  let i = 0;
  const interval = setInterval(function() {
    element.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
    }
  }, speed);
}

function showLoadingDots(element) {
  element.innerHTML = `
    <div class="loading-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
}

function updateHUD() {
  const density = DENSITIES[gameState.currentDensity];
  document.getElementById('hud-density-num').textContent = density.roman;
  document.getElementById('vibration-score').textContent = Math.round(gameState.vibrationScore);
  document.getElementById('hud-exchanges').textContent   = gameState.exchangeCount;
}

function showResult(passed) {
  const density = DENSITIES[gameState.currentDensity];
  document.getElementById('result-score-value').textContent = Math.round(gameState.vibrationScore);
  if (passed) {
    document.getElementById('result-symbol').textContent  = '✦';
    document.getElementById('result-title').textContent   = 'Density Transcended';
    document.getElementById('result-message').textContent = 'Your vibration has been deemed sufficient to ascend. You have demonstrated understanding of the ' + density.theme + '.';
    document.getElementById('btn-ascend').textContent     = gameState.currentDensity < 6 ? 'Ascend to Next Density' : 'Complete the Journey';
  } else {
    document.getElementById('result-symbol').textContent  = '◈';
    document.getElementById('result-title').textContent   = 'Further Learning Required';
    document.getElementById('result-message').textContent = 'Your vibration has not yet reached the threshold. Ra invites you to reflect and try again.';
    document.getElementById('btn-ascend').textContent     = 'Try Again';
  }
  document.getElementById('btn-ascend').dataset.passed = passed;
  showScreen('screen-result');
}

function showDensityIntro() {
  const density = DENSITIES[gameState.currentDensity];
  document.getElementById('density-number').textContent      = density.number;
  document.getElementById('density-theme').textContent       = density.theme;
  document.getElementById('density-description').textContent = density.description;
  showScreen('screen-density');
}

function startDensity() {
  const density = DENSITIES[gameState.currentDensity];

  gameState.vibrationScore      = 0;
  gameState.exchangeCount       = 0;
  gameState.conversationHistory = [];

  updateHUD();

  // second density uses multiple choice
  if (gameState.currentDensity === 1) {
    generateStars('stars-choice', 120);
    showChoiceScreen();
    return;
  }

  const openingMessage = `I am Ra. I greet you in the love and in the light of the One Infinite Creator. We are now within the ${density.number}: ${density.theme}. ${density.description} Speak, seeker. I am listening.`;

  showScreen('screen-game');

  setTimeout(function() {
    typewriterEffect(document.getElementById('ra-text'), openingMessage, 22);
  }, 400);

  gameState.conversationHistory.push({
    role: "assistant",
    content: openingMessage
  });
}

function showChoiceScreen() {
  const questionData = SECOND_DENSITY_CHOICES[
    Math.floor(Math.random() * SECOND_DENSITY_CHOICES.length)
  ];

  document.getElementById('choice-question').textContent = questionData.question;

  const optionsContainer = document.getElementById('choice-options');
  optionsContainer.innerHTML = '';

  questionData.options.forEach(function(option) {
    const btn = document.createElement('button');
    btn.classList.add('choice-btn');
    btn.textContent = option.text;

    btn.addEventListener('click', function() {
      optionsContainer.querySelectorAll('.choice-btn').forEach(function(b) {
        b.disabled = true;
      });

      btn.classList.add(option.good ? 'selected-good' : 'selected-bad');

      gameState.vibrationScore = Math.max(0, Math.min(100,
        gameState.vibrationScore + option.score
      ));
      gameState.exchangeCount += 1;
      updateHUD();

      setTimeout(function() {
        if (gameState.vibrationScore >= 15) {
          showResult(true);
        } else {
          showResult(false);
        }
      }, 1500);
    });

    optionsContainer.appendChild(btn);
  });

  showScreen('screen-choice');
}

// ═══════════════════════════════════════════
// SEVENTH DENSITY — HAND DETECTION ML
// ═══════════════════════════════════════════

let handDetector     = null;
let handDetectionLoop = null;
let handDetected     = false;

async function loadHandDetector() {
  const model  = handPoseDetection.SupportedModels.MediaPipeHands;
  const config = { runtime: 'tfjs', modelType: 'lite', maxHands: 1 };
  handDetector = await handPoseDetection.createDetector(model, config);
  console.log('Hand detector loaded!');
}

async function startSeventhDensity() {
  showScreen('screen-seventh');
  generateStars('stars-seventh', 150);

  const instruction = document.getElementById('camera-instruction');
  instruction.textContent = 'Activating the gateway...';

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 380, height: 280, facingMode: 'user' }
    });

    const video = document.getElementById('seventh-video');
    video.srcObject = stream;

    video.onloadedmetadata = async function() {
      instruction.textContent = 'Loading sacred geometry engine...';
      await loadHandDetector();
      instruction.textContent = 'Raise your hand to the light, seeker';
      detectHand(video);
    };

  } catch (error) {
    console.error('Camera error:', error);
    instruction.textContent = 'Camera access required. Please allow and refresh.';
  }
}

async function detectHand(video) {
  const canvas      = document.getElementById('seventh-canvas');
  const ctx         = canvas.getContext('2d');
  const instruction = document.getElementById('camera-instruction');

  canvas.width  = 380;
  canvas.height = 280;

  let framesWithHand = 0;

  async function loop() {
    if (!handDetector) return;

    const hands = await handDetector.estimateHands(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (hands.length > 0) {
      framesWithHand++;
      const hand = hands[0];
      drawSacredGeometry(ctx, hand.keypoints);

      if (framesWithHand === 10) instruction.textContent = 'Your pattern is being read...';
      if (framesWithHand === 40) instruction.textContent = 'The Creator recognises you...';

      if (framesWithHand >= 80 && !handDetected) {
        handDetected = true;
        instruction.textContent = 'You are Ra...';
        setTimeout(function() {
          stopCamera();
          showFinalScreen(hand.keypoints);
        }, 2000);
        return;
      }
    } else {
      framesWithHand = Math.max(0, framesWithHand - 2);
      if (framesWithHand === 0) {
        instruction.textContent = 'Raise your hand to the light, seeker';
      }
    }

    handDetectionLoop = requestAnimationFrame(loop);
  }

  loop();
}

function drawSacredGeometry(ctx, keypoints) {
  if (!keypoints || keypoints.length < 21) return;

  const time = Date.now() / 1000;

  const connections = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20],
    [5,9],[9,13],[13,17],
    [4,8],[8,12],[12,16],[16,20]
  ];

  connections.forEach(function(conn) {
    const p1 = keypoints[conn[0]];
    const p2 = keypoints[conn[1]];
    if (!p1 || !p2) return;

    const pulse = 0.5 + 0.5 * Math.sin(time * 3);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = `rgba(201, 168, 76, ${0.4 + pulse * 0.4})`;
    ctx.lineWidth   = 1.5;
    ctx.shadowColor = '#c9a84c';
    ctx.shadowBlur  = 8;
    ctx.stroke();
  });

  keypoints.forEach(function(point, index) {
    if (!point) return;
    const pulse  = 0.5 + 0.5 * Math.sin(time * 3 + index * 0.3);
    const radius = index === 0 ? 5 : 3;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle   = `rgba(240, 208, 128, ${0.6 + pulse * 0.4})`;
    ctx.shadowColor = '#f0d080';
    ctx.shadowBlur  = 12;
    ctx.fill();
  });

  ctx.beginPath();
  ctx.moveTo(keypoints[4].x,  keypoints[4].y);
  ctx.lineTo(keypoints[12].x, keypoints[12].y);
  ctx.lineTo(keypoints[20].x, keypoints[20].y);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(240, 208, 128, 0.3)';
  ctx.lineWidth   = 1;
  ctx.stroke();
}

function stopCamera() {
  const video = document.getElementById('seventh-video');
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(function(track) { track.stop(); });
  }
  if (handDetectionLoop) {
    cancelAnimationFrame(handDetectionLoop);
  }
}

function showFinalScreen() {
  showScreen('screen-final');
  generateStars('stars5', 160);

  const canvas = document.getElementById('final-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  for (let i = 0; i < 80; i++) {
    const angle = (Math.PI * 2 / 80) * i;
    particles.push({
      x:  canvas.width / 2,
      y:  canvas.height / 2,
      vx: Math.cos(angle) * (Math.random() * 3 + 1),
      vy: Math.sin(angle) * (Math.random() * 3 + 1),
      size: Math.random() * 3 + 1,
      opacity: 1
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      p.opacity -= 0.008;
      if (p.opacity <= 0) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle   = `rgba(201, 168, 76, ${p.opacity})`;
      ctx.shadowColor = '#c9a84c';
      ctx.shadowBlur  = 6;
      ctx.fill();
    });
    particles = particles.filter(function(p) { return p.opacity > 0; });
    if (particles.length > 0) requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

// ═══════════════════════════════════════════
// AI AGENT
// ═══════════════════════════════════════════

async function consultRa(playerMessage) {
  const density = DENSITIES[gameState.currentDensity];

  const systemPrompt = `You are Ra, a humble but slightly witty messenger of the Law of One.
You are guiding a seeker through the ${density.number}: ${density.theme}.

CURRENT CONTEXT:
- Exchanges so far: ${gameState.exchangeCount}
- Current vibration score: ${gameState.vibrationScore}/100
- Minimum exchanges before judgement: ${density.minExchanges}
- Pass threshold: ${density.passThreshold}/100

YOUR PERSONA:
- Speak as Ra but with warmth and light humour — like a wise ancient being who finds humans endearing
- Keep responses to 1-2 sentences MAXIMUM — short, punchy, memorable
- Always end your response with ONE specific guiding question related to the density theme
- Occasionally use gentle wit — Ra finds the seeker's journey both profound and amusing
- Use "I am Ra" to start sometimes but not always
- Refer to the player as "seeker"
- Never break character

DENSITY GUIDE QUESTIONS to ask based on theme:
${density.number === "First Density" ?
  "Ask about: awareness of breath, the elements, being present, what they notice right now" :
density.number === "Second Density" ?
  "Ask about: what they feel drawn toward, how they treat living things, instinctive love" :
density.number === "Third Density" ?
  "Ask about: ego vs service, their greatest selfish moment, choosing others over self" :
density.number === "Fourth Density" ?
  "Ask about: feeling others pain, unconditional love, who they love most and why" :
density.number === "Fifth Density" ?
  "Ask about: a time love caused harm, balancing head and heart, wise vs loving decisions" :
density.number === "Sixth Density" ?
  "Ask about: where they end and others begin, seeing themselves in enemies, oneness" :
  "Ask about: releasing all identity, merging with the infinite, what remains when self dissolves"
}

TONE EXAMPLES:
- "I am Ra. Fascinating. You breathe. We had hoped for more. What do you actually notice in this moment?"
- "Curious. Most seekers say love. What did you mean by it?"
- "I am Ra. Short answer. We appreciate efficiency. But tell us — when did you last truly serve another?"
- "Bold claim, seeker. Prove it. What would you sacrifice for a stranger?"

SCORING RULES:
Evaluate the seeker's response and assign a vibrationDelta:
- +10 to +15: Deep understanding of unity, love, service to others
- +5 to +9:   Partial understanding or genuine seeking
- +1 to +4:   Confusion but sincere effort
- -5 to -10:  Fear-based, service-to-self, or dismissive thinking

ASCENSION RULES:
- Only set decision to "ascend" if exchanges >= ${density.minExchanges} AND vibration will reach ${density.passThreshold}
- Only set decision to "descend" if seeker is hostile or completely resistant
- Otherwise set decision to "continue"

VERY IMPORTANT — RESPONSE FORMAT:
You MUST respond ONLY with a valid JSON object. No other text. Example:
{
  "raDialogue": "I am Ra. Interesting. What do you notice around you right now, seeker?",
  "vibrationDelta": 5,
  "decision": "continue",
  "judgement": ""
}
decision must be exactly one of: continue, ascend, descend`;

  gameState.conversationHistory.push({
    role: "user",
    content: playerMessage
  });

  try {
    const response = await fetch('/api/ra', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: gameState.conversationHistory,
        systemPrompt: systemPrompt
      })
    });

    const data   = await response.json();
    const clean  = data.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    gameState.vibrationScore = Math.max(0, Math.min(100,
      gameState.vibrationScore + parsed.vibrationDelta
    ));
    gameState.exchangeCount += 1;

    gameState.conversationHistory.push({
      role: "assistant",
      content: parsed.raDialogue
    });

    updateHUD();
    return parsed;

  } catch (error) {
    console.error("Ra contact failed:", error);
    return {
      raDialogue: "I am Ra. The signal wavers. Please transmit again, seeker.",
      vibrationDelta: 0,
      decision: "continue",
      judgement: ""
    };
  }
}

// ═══════════════════════════════════════════
// MAIN GAME LOOP
// ═══════════════════════════════════════════

async function handlePlayerInput() {
  const inputEl   = document.getElementById('player-input');
  const raTextEl  = document.getElementById('ra-text');
  const sendBtn   = document.getElementById('btn-send');
  const playerMsg = inputEl.value.trim();

  if (!playerMsg) return;

  sendBtn.disabled = true;
  inputEl.disabled = true;
  inputEl.value    = '';

  showLoadingDots(raTextEl);

  const result = await consultRa(playerMsg);

  typewriterEffect(raTextEl, result.raDialogue, 25);

  sendBtn.disabled = false;
  inputEl.disabled = false;
  inputEl.focus();

  if (result.decision === 'ascend') {
    const delay = result.raDialogue.length * 25 + 1500;
    setTimeout(function() { showResult(true); }, delay);
  } else if (result.decision === 'descend') {
    const delay = result.raDialogue.length * 25 + 1500;
    setTimeout(function() { showResult(false); }, delay);
  }
}

// ═══════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════

document.getElementById('btn-start').addEventListener('click', function() {
  gameState.currentDensity = 0;
  showDensityIntro();
});

document.getElementById('btn-enter-density').addEventListener('click', function() {
  startDensity();
});

document.getElementById('btn-send').addEventListener('click', function() {
  handlePlayerInput();
});

document.getElementById('player-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handlePlayerInput();
  }
});

document.getElementById('btn-ascend').addEventListener('click', function() {
  const passed = document.getElementById('btn-ascend').dataset.passed === 'true';
  if (passed) {
    if (gameState.currentDensity >= 6) {
      // seventh density — hand detection finale
      handDetected = false;
      startSeventhDensity();
    } else {
      gameState.currentDensity += 1;
      showDensityIntro();
    }
  } else {
    showDensityIntro();
  }
});

document.getElementById('btn-restart').addEventListener('click', function() {
  gameState.currentDensity      = 0;
  gameState.vibrationScore      = 0;
  gameState.exchangeCount       = 0;
  gameState.conversationHistory = [];
  showScreen('screen-intro');
});

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════

function init() {
  generateStars('stars',        150);
  generateStars('stars2',       120);
  generateStars('stars3',       100);
  generateStars('stars4',       130);
  generateStars('stars5',       160);
  generateStars('stars-choice', 120);
  console.log("Ra Contact initialised!");
}

init();
