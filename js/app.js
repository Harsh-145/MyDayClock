/* ==========================================================================
   MyDayClock — Main Application
   SpaceX Mission Control Inspired | Harsh Yadav
   ========================================================================== */

;(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     1. CONSTANTS & CONFIGURATION
     ----------------------------------------------------------------------- */
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = 60000;
  const MS_PER_HOUR   = 3600000;
  const MS_PER_DAY    = 86400000;

  const IDLE_TIMEOUT_MS   = 2500;
  const SYNC_INTERVAL_MS  = 60000;
  const CLOCK_INTERVAL_MS = 1000;
  const CYCLE_INTERVAL_MS = 10000;
  const PARTICLE_COUNT    = 42;
  const QUOTE_ROTATE_MS   = 18000;

  const MUSIC_VARIANTS = Object.freeze({
    music_orig:  { rate: 1.00, vol: 0.85, doubleTick: false },
    music_slow:  { rate: 0.82, vol: 0.90, doubleTick: false },
    music_fast:  { rate: 1.18, vol: 0.92, doubleTick: true  },
    music_study: { rate: 0.74, vol: 0.32, doubleTick: false },
    tickonly:    { rate: 1.00, vol: 0.00, doubleTick: false },
    mute:        { rate: 1.00, vol: 0.00, doubleTick: false },
  });

  const TIME_MODES = [
    { hm: '10:00', short: '🕙 GTU: 10:00 AM' },
    { hm: '10:30', short: '🕥 GTU: 10:30 AM' },
  ];

  const QUOTES = [
    '"The only way to do great work is to love what you do." — Steve Jobs',
    '"It does not matter how slowly you go as long as you do not stop." — Confucius',
    '"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt',
    '"Success is not final, failure is not fatal: it is the courage to continue that counts." — Churchill',
    '"Stay hungry, stay foolish." — Steve Jobs',
    '"The harder you work for something, the greater you\'ll feel when you achieve it."',
    '"Don\'t watch the clock; do what it does. Keep going." — Sam Levenson',
    '"Believe you can and you\'re halfway there." — Theodore Roosevelt',
    '"You are never too old to set another goal or to dream a new dream." — C.S. Lewis',
    '"The secret of getting ahead is getting started." — Mark Twain',
    '"Discipline is the bridge between goals and accomplishment." — Jim Rohn',
    '"Your limitation—it\'s only your imagination."',
    '"Push yourself, because no one else is going to do it for you."',
    '"Great things never come from comfort zones."',
    '"Dream it. Wish it. Do it."',
    '"Exam by exam, paper by paper — you WILL get there."',
    '"GATE is not a wall. It is a gate. Walk through it."',
    '"6 exams. 49 days. 1 goal. MYDAYS ARE COMING."',
  ];

  /* -----------------------------------------------------------------------
     DAILY PLAN DATABASE — Harsh's Complete Exam Plan
     ----------------------------------------------------------------------- */
  const DAILY_PLAN_DB = {
    // ── COMPILER DESIGN (14–18 Nov) ──
    '2026-11-14': '<b>Sat 14 Nov — Compiler Design (Units 1–2)</b><br>• <b>Morning (9:30–11:30):</b> Check GOAPS first. Lexical analysis, tokens, FIRST and FOLLOW.<br>• <b>Afternoon (2:00–4:00):</b> FIRST/FOLLOW and LL(1) tables on paper. 3 GTU problems.<br>• <b>Night (8:00–10:00) PYQs:</b> 2026 CS2 Q35; 2026 CS1 Q27; 2025 CS1 Q12, Q46; 2024 CS2 Q21, Q40.',
    '2026-11-15': '<b>Sun 15 Nov — Compiler Design (Unit 3, LR parsing)</b><br>• <b>Morning:</b> LR(0), SLR(1), CLR(1), LALR(1). Item sets, closures, conflicts.<br>• <b>Afternoon:</b> Full LR(0) and SLR(1) tables for 2 GTU grammars.<br>• <b>Night PYQs:</b> 2026 CS1 Q25, Q28; 2026 CS2 Q29, Q41; 2025 CS2 Q40, Q51; 2024 CS1 Q26, Q38; 2024 CS2 Q65.',
    '2026-11-16': '<b>Mon 16 Nov — Compiler Design (Units 4–5, SDT & ICG)</b><br>• <b>Morning (9:30–11:30):</b> S-attributed vs L-attributed SDDs, syntax trees, 3-address code (quadruples, triples, indirect triples), SSA.<br>• <b>Afternoon (2:00–4:00):</b> 4 GTU problems on SDT and 3-address code.<br>• <b>Night (8:00–10:00) PYQs:</b> 2026 CS1 Q53; 2025 CS2 Q22; 2024 CS1 Q37; 2024 CS2 Q29, Q43; 2023 CS Q60; 2022 CS Q65.',
    '2026-11-17': '<b>Tue 17 Nov — Compiler Design (Units 6–7, Runtime & Optimization)</b><br>• <b>Morning:</b> Activation records, basic blocks, CFG, DAG, liveness analysis, code optimization.<br>• <b>Afternoon:</b> Draw CFGs and DAGs. Compute IN[B]/OUT[B] for 2 GTU problems.<br>• <b>Night PYQs:</b> 2026 CS1 Q42; 2026 CS2 Q45; 2025 CS1 Q13, Q52; 2024 CS1 Q39; 2023 CS Q36, Q37.',
    '2026-11-18': '<b>Wed 18 Nov — Compiler Paper Lock-In</b><br>• <b>Morning:</b> Solve Winter 2024 & Summer 2025 GTU Compiler (3170701) papers.<br>• <b>Afternoon:</b> Solve Winter 2023 & Summer 2024 papers.<br>• <b>Night:</b> Make a 4-page Compiler cheat sheet.',

    // ── CLOUD COMPUTING (19–20 Nov) ──
    '2026-11-19': '<b>Thu 19 Nov — Cloud Computing (Units 1–3)</b><br>• <b>Morning:</b> IaaS/PaaS/SaaS, public/private/hybrid cloud, virtualization, Type 1 vs Type 2 hypervisors.<br>• <b>Afternoon:</b> Write answers for the top 15 repeated GTU Cloud questions.<br>• <b>Night PYQs:</b> 2026 CS1 Q54; 2025 CS1 Q14.',
    '2026-11-20': '<b>Fri 20 Nov — Cloud Computing (Units 4–6)</b><br>• <b>Morning:</b> Cloud security, IAM, Hadoop/MapReduce, Docker/containers, disaster recovery.<br>• <b>Afternoon:</b> Solve the last 3 GTU Cloud (3170717) papers.<br>• <b>Night:</b> Make a 3-page Cloud summary sheet (for 4–7 Dec).',

    // ── DISTRIBUTED SYSTEMS (21–22 Nov) ──
    '2026-11-21': '<b>Sat 21 Nov — Distributed Systems (Units 1–3)</b><br>• <b>Morning:</b> Architectures, RPC/RMI, Lamport and Vector clocks, mutual exclusion (Ricart-Agrawala, Token Ring).<br>• <b>Afternoon:</b> Practice Lamport timestamp diagrams and a mutual exclusion comparison table.<br>• <b>Night PYQs:</b> 2017 CS1 Q42; 2024 CS1 Q40.',
    '2026-11-22': '<b>Sun 22 Nov — Distributed Systems (Units 4–6)</b><br>• <b>Morning:</b> Distributed deadlocks, election (Bully and Ring), 2-Phase Commit, consistency and replication.<br>• <b>Afternoon:</b> Solve the last 3 GTU Distributed Systems (3170719) papers.<br>• <b>Night:</b> Make a 3-page cheat sheet (for 16–17 Dec).',

    // ── ARTIFICIAL INTELLIGENCE (23–24 Nov) ──
    '2026-11-23': '<b>Mon 23 Nov — AI (Units 1–3)</b><br>• <b>Morning:</b> BFS, DFS, A*, AO*, best-first, hill climbing, Minimax + Alpha-Beta.<br>• <b>Afternoon:</b> 3 step-by-step A* and Alpha-Beta tree problems on paper.<br>• <b>Night PYQs:</b> 2026 CS2 Q11; 2025 CS1 Q48.',
    '2026-11-24': '<b>Tue 24 Nov — AI (Units 4–6)</b><br>• <b>Morning:</b> Propositional and first-order logic, resolution, unification, Bayesian networks, Prolog cuts/fail.<br>• <b>Afternoon:</b> Solve the last 3 GTU AI (3170716) papers.<br>• <b>Night PYQs:</b> 2024 CS2 Q12; 2023 CS Q26.',

    // ── MOBILE APP DEV (25 Nov) ──
    '2026-11-25': '<b>Wed 25 Nov — Mobile App Dev (Units 1–6)</b><br>• <b>Morning:</b> Android architecture, Activity and Fragment lifecycles, intents, UI layouts, RecyclerView, services, broadcast receivers.<br>• <b>Afternoon:</b> SQLite CRUD code, Room, SharedPreferences, Firebase, REST APIs. Solve 3 GTU MAD papers.<br>• <b>Night:</b> Make a 3-page MAD diagram + code sheet (for 14–15 Dec).',

    // ── MACHINE LEARNING (26–28 Nov) ──
    '2026-11-26': '<b>Thu 26 Nov — Machine Learning (Units 1–2)</b><br>• <b>Morning:</b> Supervised, unsupervised, reinforcement learning. Data preprocessing. Probability and Bayes theorem.<br>• <b>Afternoon:</b> 3 full Naive Bayes table numericals by hand.<br>• <b>Night PYQs:</b> 2025 CS1 Q32; 2026 CS2 Q63; 2021 CS1 Q54; 2018 CS Q44.',
    '2026-11-27': '<b>Fri 27 Nov — Machine Learning (Units 3–4)</b><br>• <b>Morning:</b> Linear and logistic regression, gradient descent, decision trees (ID3, entropy, information gain), SVM, k-NN.<br>• <b>Afternoon:</b> 2 ID3 entropy and information gain numericals by hand.<br>• <b>Night PYQs:</b> 2026 CS2 Q14; 2025 CS1 Q58.',
    '2026-11-28': '<b>Sat 28 Nov — Machine Learning (Units 5–6)</b><br>• <b>Morning:</b> k-Means, hierarchical clustering, PCA, bagging/boosting (Random Forest, AdaBoost), ANN and backpropagation.<br>• <b>Afternoon:</b> 2 k-Means numericals + 1 confusion matrix numerical (precision, recall, F1).<br>• <b>Night:</b> Solve Winter 2024 and Summer 2025 GTU ML (3170724) papers.',

    // ── FINAL REVISION (29 Nov – 18 Dec) ──
    '2026-11-29': '<b>Sun 29 Nov — Compiler Polish</b><br>• <b>Morning:</b> Revise all 7 Compiler units.<br>• <b>Afternoon:</b> 1 LL(1), 1 SLR/CLR/LALR, 1 SDT, 1 liveness/DAG problem on paper.<br>• <b>Night:</b> Read your 4-page cheat sheet.',
    '2026-11-30': '<b>Mon 30 Nov — ML Final Revision + GOAPS</b><br>• <b>Morning:</b> ML Units 1–4 and all numerical formulas.<br>• <b>Afternoon:</b> ML Units 5–6 and diagrams (SVM, backprop, PCA).<br>• <b>Night:</b> Final GOAPS check (gate2027.iitm.ac.in). Defect window closes today.',
    '2026-12-01': '<b>🔴 Tue 1 Dec — EXAM 1: MACHINE LEARNING (3170724)</b><br>• <b>10:30 AM – 1:00 PM:</b> Write the exam at GEC Patan.<br>• <b>Afternoon:</b> Revise Compiler Units 1–2.<br>• <b>Night:</b> Revise Compiler Unit 3 (LR tables).',
    '2026-12-02': '<b>Wed 2 Dec — Compiler Full Revision</b><br>• <b>Morning:</b> Units 4–5. <b>Afternoon:</b> Units 6–7.<br>• <b>Night:</b> Review 3 past GTU Compiler papers. Sleep early.',
    '2026-12-03': '<b>🔴 Thu 3 Dec — EXAM 2: COMPILER DESIGN (3170701)</b><br>• <b>10:30 AM – 1:00 PM:</b> Write the exam.<br>• <b>Afternoon:</b> Rest completely.<br>• <b>Night:</b> Organize your Cloud notes.',
    '2026-12-04': '<b>Fri 4 Dec — Cloud Computing (Units 1–2)</b><br>• Study + 45 min GATE General Aptitude (10 questions from 2024–2026 PDFs).',
    '2026-12-05': '<b>Sat 5 Dec — Cloud Computing (Units 3–4)</b><br>• Study + 45 min GATE GA. Lock in cloud architecture diagrams.',
    '2026-12-06': '<b>Sun 6 Dec — Cloud Computing (Units 5–6)</b><br>• Study + 45 min GATE GA.',
    '2026-12-07': '<b>Mon 7 Dec — Cloud Paper Solve</b><br>• Solve last 4 GTU Cloud papers. Night: lock in virtualization diagrams.',
    '2026-12-08': '<b>🔴 Tue 8 Dec — EXAM 3: CLOUD COMPUTING (3170717)</b><br>• <b>10:30 AM – 1:00 PM:</b> Write the exam.<br>• <b>Afternoon:</b> Rest.<br>• <b>Night:</b> Organize AI and MAD notes.',
    '2026-12-09': '<b>Wed 9 Dec — Pre-revise MAD Units 1–6</b><br>• Android lifecycle, intents, SQLite, Firebase, REST.',
    '2026-12-10': '<b>Thu 10 Dec — AI Units 1–3</b><br>• A*, AO*, Minimax, Alpha-Beta. Practice search tree problems.',
    '2026-12-11': '<b>Fri 11 Dec — AI Units 4–6</b><br>• Logic, resolution, Bayesian nets, Prolog.',
    '2026-12-12': '<b>Sat 12 Dec — AI Paper Solve</b><br>• Solve 4 past GTU AI papers.',
    '2026-12-13': '<b>Sun 13 Dec — AI + MAD Final Polish</b><br>• AI cheat sheet. MAD code review.',
    '2026-12-14': '<b>🔴 Mon 14 Dec — EXAM 4: ARTIFICIAL INTELLIGENCE (3170716)</b><br>• <b>10:30 AM – 1:00 PM:</b> Write the exam.<br>• <b>3:00–6:00 PM:</b> Revise MAD Units 1–3.<br>• <b>7:30–10:30 PM:</b> Revise MAD Units 4–6.',
    '2026-12-15': '<b>Tue 15 Dec — MAD Full Revision</b><br>• <b>Morning:</b> Android lifecycle diagrams, intent code, SQLite helper code.<br>• <b>Afternoon:</b> Services, broadcast receivers, Firebase.<br>• <b>Night:</b> Review 3 past GTU MAD papers.',
    '2026-12-16': '<b>🔴 Wed 16 Dec — EXAM 5: MOBILE APP DEV (3170726)</b><br>• <b>10:30 AM – 1:00 PM:</b> Write the exam.<br>• <b>3:00–6:00 PM:</b> Revise Distributed Systems Units 1–3.<br>• <b>7:30–10:30 PM:</b> Revise Distributed Systems Units 4–6.',
    '2026-12-17': '<b>Thu 17 Dec — Distributed Systems Full Revision</b><br>• <b>Morning:</b> Lamport/Vector clocks, Ricart-Agrawala, Bully/Ring election.<br>• <b>Afternoon:</b> Distributed file systems, consistency models, 2PC/3PC, fault tolerance.<br>• <b>Night:</b> Review 4 past GTU DS papers.',
    '2026-12-18': '<b>🔴🟢 Fri 18 Dec — EXAM 6: DISTRIBUTED SYSTEMS (3170719) — MYDAYS!</b><br>• <b>10:30 AM – 1:00 PM:</b> Write the exam. <b>SEM 7 DONE. 0 BACKLOGS.</b><br>• <b>Rest of the day:</b> Rest fully. Celebrate.<br>• <b>Night:</b> Set up your 200-page notebook for GATE sprint.',

    // ── GATE SPRINT (19 Dec – 5 Feb) ──
    '2026-12-19': '<b>GATE SPRINT DAY 1 — Logic</b><br>• <b>8:30–9:15:</b> General Aptitude (10 Qs).<br>• <b>9:30–1:00:</b> Propositional and first-order logic crash.<br>• <b>2:30–5:30:</b> PYQs on paper.<br>• <b>8:30–9:30:</b> Formula revision.',
    '2026-12-22': '<b>IMPORTANT: Register for BARC OCES today (barcocesexam.in)</b><br>Choose Both: Online Exam and GATE Score.',
    '2027-01-04': '<b>Check GATE city allotment today (gate2027.iitm.ac.in)</b>',
    '2027-01-22': '<b>Mock 1: GATE 2023 CS (timed, 3 hours)</b><br>Log every wrong/skipped question in Error Notebook.',
    '2027-01-28': '<b>BARC Application Deadline — Confirm submission!</b>',
    '2027-02-04': '<b>Final days before GATE. Read ONLY formula + error notebook. Rest eyes. Sleep 8 hours.</b>',
    '2027-02-05': '<b>GATE EVE — Rest. Light revision only. Sleep early.</b>',
  };

  /* -----------------------------------------------------------------------
     2. APPLICATION STATE
     ----------------------------------------------------------------------- */
  const state = {
    audioCtx: null,
    audioUnlocked: false,
    audioMode: 'music_orig',
    tickToggle: false,
    serverTimeOffsetMs: 0,
    timeModeIdx: 1,
    activeIdx: 0,        // Will be auto-detected on init
    manualOverride: false, // true when user manually selected a card
    autoCycle: false,
    cycleTimer: null,
    lastSec: -1,
    idleTimer: null,
    quoteIdx: 0,
    milestones: [],
    motes: [],
    arcBuilt: false,
    isStreamMode: false,
  };

  /* -----------------------------------------------------------------------
     3. DOM REFERENCES (cached once)
     ----------------------------------------------------------------------- */
  const dom = {};
  function cacheDom() {
    dom.loadingScreen    = document.getElementById('loadingScreen');
    dom.soundUnlock      = document.getElementById('soundUnlock');
    dom.musicEl          = document.getElementById('musicAudio');
    dom.networkTime      = document.getElementById('networkTime');
    dom.examModeBadge    = document.getElementById('examModeBadge');
    dom.btnCycle         = document.getElementById('btnCycle');
    dom.audioModeSelect  = document.getElementById('audioModeSelect');
    dom.pathKicker       = document.getElementById('pathKicker');
    dom.headingText      = document.getElementById('headingText');
    dom.tMinus           = document.getElementById('tMinus');
    dom.dMonth           = document.getElementById('dMonth');
    dom.dDays            = document.getElementById('dDays');
    dom.dHours           = document.getElementById('dHours');
    dom.dMinutes         = document.getElementById('dMinutes');
    dom.dSeconds         = document.getElementById('dSeconds');
    dom.quoteBar         = document.getElementById('quoteBar');
    dom.arcSvg           = document.getElementById('arcSvg');
    dom.arcBg            = document.getElementById('arcBg');
    dom.arcFill          = document.getElementById('arcFill');
    dom.arcNodes         = document.getElementById('arcNodes');
    dom.modalOverlay     = document.getElementById('modalOverlay');
    dom.todayModal       = document.getElementById('todayModal');
    dom.todayTitle       = document.getElementById('todayTitle');
    dom.todayBody        = document.getElementById('todayBody');
    dom.ashCanvas        = document.getElementById('ashCanvas');
    dom.bgImgs           = [
      document.getElementById('bg0'),
      document.getElementById('bg1'),
      document.getElementById('bg2'),
      document.getElementById('bg3'),
    ];
    dom.bgBtns = [
      document.getElementById('btnW0'),
      document.getElementById('btnW1'),
      document.getElementById('btnW2'),
      document.getElementById('btnW3'),
    ];
  }

  /* -----------------------------------------------------------------------
     4. AUDIO ENGINE
     ----------------------------------------------------------------------- */
  function unlockAudio() {
    if (!state.audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new Ctx();
    }
    if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
    state.audioUnlocked = true;
    if (dom.soundUnlock) dom.soundUnlock.hidden = true;
    applyMusicVariant();
    playTieTik(true);
  }

  function applyMusicVariant() {
    const v = MUSIC_VARIANTS[state.audioMode] || MUSIC_VARIANTS.music_orig;
    if (!state.audioUnlocked || state.audioMode === 'mute' || state.audioMode === 'tickonly') {
      dom.musicEl.pause();
      return;
    }
    if ('preservesPitch' in dom.musicEl) dom.musicEl.preservesPitch = false;
    if ('webkitPreservesPitch' in dom.musicEl) dom.musicEl.webkitPreservesPitch = false;
    dom.musicEl.playbackRate = v.rate;
    dom.musicEl.volume = v.vol;
    dom.musicEl.play().then(() => {
      if (dom.soundUnlock) dom.soundUnlock.hidden = true;
    }).catch(() => {});
  }

  function playTieTik(isMainTick) {
    if (!state.audioUnlocked || !state.audioCtx || state.audioMode === 'mute') return;
    if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
    const now = state.audioCtx.currentTime;
    state.tickToggle = !state.tickToggle;

    // Mechanical click
    const clickOsc = state.audioCtx.createOscillator();
    const clickGain = state.audioCtx.createGain();
    const clickFilter = state.audioCtx.createBiquadFilter();

    clickFilter.type = 'bandpass';
    clickFilter.frequency.value = state.tickToggle ? 2450 : 1780;
    clickFilter.Q.value = 5.5;

    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(state.tickToggle ? 1200 : 860, now);
    clickOsc.frequency.exponentialRampToValueAtTime(160, now + 0.05);

    const vol = state.audioMode === 'music_study' ? 0.12 : 0.42;
    clickGain.gain.setValueAtTime(vol, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(state.audioCtx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.065);

    // Sub-bass thud on main ticks
    if (isMainTick && state.audioMode !== 'music_study') {
      const thudOsc = state.audioCtx.createOscillator();
      const thudGain = state.audioCtx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(state.tickToggle ? 86 : 68, now);
      thudOsc.frequency.exponentialRampToValueAtTime(24, now + 0.24);
      thudGain.gain.setValueAtTime(0.32, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      thudOsc.connect(thudGain);
      thudGain.connect(state.audioCtx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.28);
    }
  }

  function onAudioModeChange() {
    state.audioMode = dom.audioModeSelect.value;
    if (!state.audioUnlocked && state.audioMode !== 'mute') unlockAudio();
    applyMusicVariant();
  }

  /* -----------------------------------------------------------------------
     5. EXAM TIMELINE DATA
     ----------------------------------------------------------------------- */
  function getNextGtuExam(now, hm) {
    const papers = [
      { name: 'EXAM 1: MACHINE LEARNING', code: 'GTU 3170724', date: '01 DEC', start: `2026-12-01T${hm}:00+05:30`, end: '2026-12-01T13:00:00+05:30' },
      { name: 'EXAM 2: COMPILER DESIGN',  code: 'GTU 3170701', date: '03 DEC', start: `2026-12-03T${hm}:00+05:30`, end: '2026-12-03T13:00:00+05:30' },
      { name: 'EXAM 3: CLOUD COMPUTING',  code: 'GTU 3170717', date: '08 DEC', start: `2026-12-08T${hm}:00+05:30`, end: '2026-12-08T13:00:00+05:30' },
      { name: 'EXAM 4: ARTIFICIAL INTEL', code: 'GTU 3170716', date: '14 DEC', start: `2026-12-14T${hm}:00+05:30`, end: '2026-12-14T13:00:00+05:30' },
      { name: 'EXAM 5: MOBILE APP DEV',   code: 'GTU 3170726', date: '16 DEC', start: `2026-12-16T${hm}:00+05:30`, end: '2026-12-16T13:00:00+05:30' },
      { name: 'EXAM 6: DISTRIBUTED SYS',  code: 'GTU 3170719', date: '18 DEC', start: `2026-12-18T${hm}:00+05:30`, end: '2026-12-18T13:00:00+05:30' },
    ];
    const next = papers.find(p => now < new Date(p.end)) || papers[papers.length - 1];
    return {
      short: `${next.date}: GTU`,
      title: next.name,
      code: `${next.code} // ${next.date} • ${hm} AM IST`,
      dateStr: `${next.date} • ${hm} AM`,
      startIso: next.start,
      endIso: next.end,
      bgIdx: 0,
      variant: 'music_fast',
    };
  }

  function buildTimeline(now) {
    const hm = TIME_MODES[state.timeModeIdx].hm;
    return [
      getNextGtuExam(now, hm),
      {
        short: '18 DEC: MYDAYS',
        title: 'MYDAYS ARE COMING',
        code: 'GTU SEM 7 FINALE // 18 DEC 2026 • 01:00 PM IST',
        dateStr: '18 DEC • 01:00 PM',
        startIso: '2026-12-18T13:00:00+05:30',
        endIso: '2026-12-18T13:00:00+05:30',
        bgIdx: 0, variant: 'music_orig',
      },
      {
        short: '06 FEB: GATE',
        title: 'GATE 2027 CS',
        code: 'IIT MADRAS GATE CS // 06 FEB 2027 • 09:30 AM IST',
        dateStr: '06 FEB • 09:30 AM',
        startIso: '2027-02-06T09:30:00+05:30',
        endIso: '2027-02-06T12:30:00+05:30',
        bgIdx: 1, variant: 'music_slow',
      },
      {
        short: '14 MAR: BARC',
        title: 'BARC OCES 2027 CBT',
        code: 'BARC SCIENTIFIC OFFICER C // 14 MAR 2027 • 09:00 AM IST',
        dateStr: '14 MAR • BARC CBT',
        startIso: '2027-03-14T09:00:00+05:30',
        endIso: '2027-03-14T11:00:00+05:30',
        bgIdx: 1, variant: 'music_fast',
      },
      {
        short: '02 APR: DRDO',
        title: 'DRDO & PSU SELECTION',
        code: 'DRDO SCIENTIST B • BEL PE • ECIL GET • BARC UPLOAD',
        dateStr: '02 APR • DRDO/BARC',
        startIso: '2027-04-02T09:00:00+05:30',
        endIso: '2027-04-02T17:00:00+05:30',
        bgIdx: 3, variant: 'music_orig',
      },
      {
        short: '12 MAY: INTERVIEW',
        title: 'BARC & SEM 8 FINALE',
        code: 'BARC MUMBAI INTERVIEWS & GTU PDC // MAY-JUN 2027',
        dateStr: '12 MAY • MUMBAI',
        startIso: '2027-05-12T09:00:00+05:30',
        endIso: '2027-06-12T17:00:00+05:30',
        bgIdx: 0, variant: 'music_study',
      },
      {
        short: '28 AUG: IBPS',
        title: 'IBPS SO IT OFFICER',
        code: 'IBPS SO PRELIMS (AUG) & MAINS (NOV 2027)',
        dateStr: 'LATE AUG • IBPS SO',
        startIso: '2027-08-28T09:00:00+05:30',
        endIso: '2027-08-28T11:00:00+05:30',
        bgIdx: 3, variant: 'music_slow',
      },
      {
        short: '19 SEP: ISRO',
        title: 'ISRO & NIC SCIENTIST B',
        code: 'ISRO ICRB SCIENTIST SC & NIC SCIENTIST B // SEP 2027',
        dateStr: 'SEP-OCT • ISRO/NIC',
        startIso: '2027-09-19T09:30:00+05:30',
        endIso: '2027-09-19T12:30:00+05:30',
        bgIdx: 1, variant: 'music_orig',
      },
    ];
  }

  /* -----------------------------------------------------------------------
     6. AUTO-DETECT PRESENT MISSION
     Find the first milestone whose endIso is in the future.
     Falls back to the last milestone if all are done.
     ----------------------------------------------------------------------- */
  function detectActiveMission(now) {
    for (let i = 0; i < state.milestones.length; i++) {
      if (now < new Date(state.milestones[i].endIso)) {
        return i;
      }
    }
    return state.milestones.length - 1; // all done, show last
  }

  /* -----------------------------------------------------------------------
     7. SPACEX MISSION ARC TIMELINE (SVG)
     ----------------------------------------------------------------------- */
  function buildMissionArc() {
    if (!dom.arcSvg || !dom.arcBg || !dom.arcNodes) return;

    const count = state.milestones.length;
    if (count === 0) return;

    // Clear previous nodes
    dom.arcNodes.innerHTML = '';

    // Get total path length for positioning
    const totalLen = dom.arcBg.getTotalLength();

    // Set progress fill dasharray
    dom.arcFill.style.strokeDasharray = totalLen;

    const now = getTrueNow();

    state.milestones.forEach((m, i) => {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const pt = dom.arcBg.getPointAtLength(t * totalLen);
      const isDone = now >= new Date(m.endIso);
      const isActive = i === state.activeIdx;

      // Create group
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.classList.add('arc-node');
      g.setAttribute('role', 'button');
      g.setAttribute('tabindex', '0');
      g.setAttribute('aria-label', `${m.short} — ${m.dateStr}`);
      g.addEventListener('click', () => selectCard(i));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectCard(i);
        }
      });

      // Connecting dot
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.classList.add('arc-dot');
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);

      if (isDone) {
        dot.setAttribute('r', '5');
        dot.setAttribute('fill', 'rgba(130, 200, 90, 0.7)');
        dot.setAttribute('stroke', 'rgba(130, 200, 90, 0.4)');
        dot.setAttribute('stroke-width', '1.5');
      } else if (isActive) {
        dot.setAttribute('r', '7');
        dot.setAttribute('fill', '#b8ff6b');
        dot.setAttribute('stroke', 'rgba(184, 255, 107, 0.4)');
        dot.setAttribute('stroke-width', '3');
        dot.classList.add('arc-dot-active');
        dot.setAttribute('filter', 'url(#arcGlow)');
      } else {
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', 'none');
        dot.setAttribute('stroke', 'rgba(165, 255, 100, 0.35)');
        dot.setAttribute('stroke-width', '1.5');
      }
      g.appendChild(dot);

      // Done checkmark
      if (isDone) {
        const check = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        check.setAttribute('x', pt.x);
        check.setAttribute('y', pt.y + 4);
        check.setAttribute('text-anchor', 'middle');
        check.setAttribute('font-size', '8');
        check.setAttribute('fill', '#ffffff');
        check.textContent = '✓';
        g.appendChild(check);
      }

      // Name label (above node)
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.classList.add('arc-node-label');
      if (isActive) label.classList.add('is-active');
      if (isDone) label.classList.add('is-done');
      label.setAttribute('x', pt.x);
      label.setAttribute('y', pt.y - 20);
      label.textContent = m.short;
      g.appendChild(label);

      // Time/countdown label (below node)
      const timeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      timeLabel.classList.add('arc-time-label');
      timeLabel.id = 'arcTime' + i;
      if (isActive) timeLabel.classList.add('is-active');
      timeLabel.setAttribute('x', pt.x);
      timeLabel.setAttribute('y', pt.y + 22);
      timeLabel.textContent = isDone ? '✅ DONE' : m.dateStr;
      g.appendChild(timeLabel);

      dom.arcNodes.appendChild(g);
    });

    // Update arc fill progress
    updateArcProgress();
    state.arcBuilt = true;
  }

  function updateArcProgress() {
    if (!dom.arcFill || !dom.arcBg) return;
    const totalLen = dom.arcBg.getTotalLength();
    const count = state.milestones.length;
    if (count <= 1) return;

    // Find how far we've progressed (based on completed milestones)
    const now = getTrueNow();
    let completedCount = 0;
    state.milestones.forEach(m => {
      if (now >= new Date(m.endIso)) completedCount++;
    });

    // Progress = completed milestones position on the arc
    const progressT = completedCount / (count - 1);
    const offset = totalLen * (1 - progressT);
    dom.arcFill.style.strokeDashoffset = offset;
  }

  function updateArcTimeLabels() {
    const now = getTrueNow();
    state.milestones.forEach((m, i) => {
      const el = document.getElementById('arcTime' + i);
      if (!el) return;
      const tEnd = new Date(m.endIso);
      if (now >= tEnd) {
        el.textContent = '✅ DONE';
      } else {
        const d = computeCalendarDiff(new Date(m.startIso), now);
        el.textContent = `${d.m}:${d.d}:${d.h}:${d.min}:${d.s}`;
      }
    });
  }

  /* -----------------------------------------------------------------------
     8. COUNTDOWN LOGIC
     ----------------------------------------------------------------------- */
  function getTrueNow() {
    return new Date(Date.now() + state.serverTimeOffsetMs);
  }

  function pad2(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function computeCalendarDiff(targetDate, now) {
    if (now >= targetDate) {
      return { m: '00', d: '00', h: '00', min: '00', s: '00', rawS: 0 };
    }
    let months = (targetDate.getFullYear() - now.getFullYear()) * 12
               + (targetDate.getMonth() - now.getMonth());
    let anchor = new Date(
      now.getFullYear(), now.getMonth() + months, now.getDate(),
      now.getHours(), now.getMinutes(), now.getSeconds()
    );
    if (anchor > targetDate) {
      months--;
      anchor = new Date(
        now.getFullYear(), now.getMonth() + months, now.getDate(),
        now.getHours(), now.getMinutes(), now.getSeconds()
      );
    }
    let rem = targetDate - anchor;
    const d   = Math.floor(rem / MS_PER_DAY);    rem -= d   * MS_PER_DAY;
    const h   = Math.floor(rem / MS_PER_HOUR);   rem -= h   * MS_PER_HOUR;
    const min = Math.floor(rem / MS_PER_MINUTE);  rem -= min * MS_PER_MINUTE;
    const s   = Math.floor(rem / MS_PER_SECOND);
    return { m: pad2(months), d: pad2(d), h: pad2(h), min: pad2(min), s: pad2(s), rawS: s };
  }

  function updateClock() {
    const now = getTrueNow();

    // Refresh dynamic first milestone (next GTU exam)
    state.milestones[0] = getNextGtuExam(now, TIME_MODES[state.timeModeIdx].hm);

    // ── AUTO-ADVANCE: if no manual override, always track the next upcoming mission ──
    if (!state.manualOverride && !state.autoCycle) {
      const detected = detectActiveMission(now);
      if (detected !== state.activeIdx) {
        state.activeIdx = detected;
        const m = state.milestones[state.activeIdx];
        if (m) {
          setWallpaper(m.bgIdx);
          if (state.audioMode !== 'mute' && state.audioMode !== 'tickonly') {
            state.audioMode = m.variant;
            dom.audioModeSelect.value = m.variant;
            applyMusicVariant();
          }
        }
        buildMissionArc();
      }
    }

    // IST time display
    const istStr = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short', day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    }).format(now).toUpperCase();
    dom.networkTime.textContent = `🛰️ IST: ${istStr}`;

    // Update arc timeline mini countdowns
    updateArcTimeLabels();

    // Main countdown for active milestone
    const m = state.milestones[state.activeIdx];
    if (!m) return;

    const activeTarget = new Date(m.startIso);
    const diff = computeCalendarDiff(activeTarget, now);

    dom.pathKicker.textContent = m.code;
    dom.headingText.textContent = m.title;
    dom.tMinus.textContent = now >= activeTarget ? 'T+ MISSION ACTIVE' : 'T—';
    dom.dMonth.textContent = diff.m;
    dom.dDays.textContent = diff.d;
    dom.dHours.textContent = diff.h;
    dom.dMinutes.textContent = diff.min;
    dom.dSeconds.textContent = diff.s;

    // Tick pulse animation
    if (diff.rawS !== state.lastSec) {
      state.lastSec = diff.rawS;
      dom.dSeconds.classList.add('tick-pulse');
      setTimeout(() => dom.dSeconds.classList.remove('tick-pulse'), 110);
      playTieTik(true);
      const v = MUSIC_VARIANTS[state.audioMode] || MUSIC_VARIANTS.music_orig;
      if (v.doubleTick) {
        setTimeout(() => playTieTik(false), 500);
      }
    }

    // Update arc progress periodically
    updateArcProgress();
  }

  /* -----------------------------------------------------------------------
     9. CARD / MILESTONE SELECTION
     ----------------------------------------------------------------------- */
  function selectCard(idx) {
    state.manualOverride = true; // User manually chose — don't auto-advance
    stopAutoCycle();
    applyCard(idx);
  }

  function resetToAuto() {
    state.manualOverride = false;
    const now = getTrueNow();
    const detected = detectActiveMission(now);
    applyCard(detected);
  }

  function applyCard(idx) {
    state.activeIdx = idx;
    const m = state.milestones[idx];
    if (!m) return;

    // Switch music variant (unless user chose mute/tickonly)
    if (state.audioMode !== 'mute' && state.audioMode !== 'tickonly') {
      state.audioMode = m.variant;
      dom.audioModeSelect.value = m.variant;
      applyMusicVariant();
    }

    // Switch wallpaper
    setWallpaper(m.bgIdx);

    // Rebuild arc to update active state
    buildMissionArc();

    // Update countdown immediately
    updateClock();
  }

  function cycleTimeMode() {
    state.timeModeIdx = (state.timeModeIdx + 1) % TIME_MODES.length;
    dom.examModeBadge.textContent = TIME_MODES[state.timeModeIdx].short;
    state.milestones = buildTimeline(getTrueNow());
    buildMissionArc();
    updateClock();
  }

  function toggleAutoCycle() {
    state.autoCycle = !state.autoCycle;
    state.manualOverride = false;
    dom.btnCycle.textContent = `🎥 Cycle: ${state.autoCycle ? 'ON' : 'OFF'}`;
    dom.btnCycle.classList.toggle('active', state.autoCycle);
    if (state.cycleTimer) clearInterval(state.cycleTimer);
    if (state.autoCycle) {
      state.cycleTimer = setInterval(() => {
        applyCard((state.activeIdx + 1) % state.milestones.length);
      }, CYCLE_INTERVAL_MS);
    }
  }

  function stopAutoCycle() {
    state.autoCycle = false;
    if (state.cycleTimer) clearInterval(state.cycleTimer);
    dom.btnCycle.textContent = '🎥 Cycle: OFF';
    dom.btnCycle.classList.remove('active');
  }

  /* -----------------------------------------------------------------------
     10. WALLPAPER CONTROL
     ----------------------------------------------------------------------- */
  function setWallpaper(bgIdx) {
    dom.bgImgs.forEach((img, i) => img.classList.toggle('active', i === bgIdx));
    dom.bgBtns.forEach((btn, i) => btn.classList.toggle('active', i === bgIdx));
  }

  function forceBg(idx) {
    stopAutoCycle();
    state.manualOverride = true;
    setWallpaper(idx);
  }

  /* -----------------------------------------------------------------------
     11. AUTO-HIDE UI (IDLE DETECTION)
     ----------------------------------------------------------------------- */
  function wakeUI() {
    document.body.classList.remove('idle');
    clearTimeout(state.idleTimer);
    state.idleTimer = setTimeout(() => {
      if (dom.todayModal && dom.todayModal.classList.contains('visible')) return;
      document.body.classList.add('idle');
    }, IDLE_TIMEOUT_MS);
  }

  /* -----------------------------------------------------------------------
     12. TODAY MODAL
     ----------------------------------------------------------------------- */
  function toggleTodayModal() {
    const isVisible = dom.todayModal.classList.contains('visible');
    if (isVisible) {
      dom.todayModal.classList.remove('visible');
      dom.modalOverlay.classList.remove('visible');
      return;
    }
    const now = getTrueNow();
    const key = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(now);
    dom.todayTitle.textContent = `📅 PLAN FOR ${key} (IST)`;
    dom.todayBody.innerHTML = DAILY_PLAN_DB[key]
      || '<b>Active Phase:</b> Follow today\'s 3 blocks (Morning 9:30-11:30 Learn, Afternoon 2:00-4:00 Write Practice, Night 8:00-10:00 PYQs & GTU PDFs).<br><br><b>Eye Care:</b> 20-20-20 rule. Lubricating drops. Dark mode everywhere.';
    dom.todayModal.classList.add('visible');
    dom.modalOverlay.classList.add('visible');
  }

  /* -----------------------------------------------------------------------
     13. MOTIVATIONAL QUOTES
     ----------------------------------------------------------------------- */
  function rotateQuote() {
    state.quoteIdx = (state.quoteIdx + 1) % QUOTES.length;
    if (dom.quoteBar) {
      dom.quoteBar.style.opacity = '0';
      setTimeout(() => {
        dom.quoteBar.textContent = QUOTES[state.quoteIdx];
        dom.quoteBar.style.opacity = '1';
      }, 500);
    }
  }

  /* -----------------------------------------------------------------------
     14. PARTICLE SYSTEM (MOTES / SPARKS)
     ----------------------------------------------------------------------- */
  let ashCtx = null;

  function initMotes() {
    dom.ashCanvas.width = window.innerWidth;
    dom.ashCanvas.height = window.innerHeight;
    state.motes = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * dom.ashCanvas.width,
      y: Math.random() * dom.ashCanvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -Math.random() * 0.35 - 0.08,
      alpha: Math.random() * 0.55 + 0.15,
    }));
  }

  function animateMotes() {
    // Pause when tab is hidden for performance
    if (document.hidden) {
      requestAnimationFrame(animateMotes);
      return;
    }
    ashCtx.clearRect(0, 0, dom.ashCanvas.width, dom.ashCanvas.height);
    for (const m of state.motes) {
      m.x += m.vx;
      m.y += m.vy;
      if (m.y < 0) m.y = dom.ashCanvas.height;
      if (m.x < 0) m.x = dom.ashCanvas.width;
      if (m.x > dom.ashCanvas.width) m.x = 0;
      ashCtx.beginPath();
      ashCtx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ashCtx.fillStyle = `rgba(215, 255, 175, ${m.alpha})`;
      ashCtx.fill();
    }
    requestAnimationFrame(animateMotes);
  }

  /* -----------------------------------------------------------------------
     15. NETWORK TIME SYNC — Multiple fallback APIs for accurate IST
     Methods tried in order:
       1. Server HEAD request (fastest, works on Netlify)
       2. WorldTimeAPI (reliable public API)
       3. TimeAPI.io (secondary fallback)
       4. Local device clock (last resort)
     ----------------------------------------------------------------------- */
  let syncRetries = 0;
  const MAX_SYNC_RETRIES = 3;

  async function syncTime() {
    // Method 1: Server HEAD (works on Netlify and most hosts)
    try {
      const t0 = Date.now();
      const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
      const dStr = res.headers.get('date');
      if (dStr) {
        const rtt = (Date.now() - t0) / 2;
        state.serverTimeOffsetMs = (new Date(dStr).getTime() + rtt) - Date.now();
        syncRetries = 0;
        return;
      }
    } catch (_) {}

    // Method 2: WorldTimeAPI
    try {
      const t0 = Date.now();
      const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata', {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data && data.datetime) {
        const rtt = (Date.now() - t0) / 2;
        const serverTime = new Date(data.datetime).getTime();
        state.serverTimeOffsetMs = (serverTime + rtt) - Date.now();
        syncRetries = 0;
        return;
      }
    } catch (_) {}

    // Method 3: TimeAPI.io
    try {
      const t0 = Date.now();
      const res = await fetch('https://timeapi.io/api/time/current/zone?timeZone=Asia/Kolkata', {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data && data.dateTime) {
        const rtt = (Date.now() - t0) / 2;
        const serverTime = new Date(data.dateTime + '+05:30').getTime();
        state.serverTimeOffsetMs = (serverTime + rtt) - Date.now();
        syncRetries = 0;
        return;
      }
    } catch (_) {}

    // All methods failed — use local clock (offset stays at 0 or last good value)
    syncRetries++;
    if (syncRetries >= MAX_SYNC_RETRIES) {
      // After 3 failures, reduce sync frequency to save resources
      syncRetries = 0;
    }
  }

  /* -----------------------------------------------------------------------
     16. KEYBOARD SHORTCUTS
     ----------------------------------------------------------------------- */
  function handleKeyboard(e) {
    // Don't capture if modal is open and not Escape
    if (dom.todayModal.classList.contains('visible') && e.key !== 'Escape') return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        if (state.audioMode === 'mute') {
          state.audioMode = 'music_orig';
          dom.audioModeSelect.value = 'music_orig';
        } else {
          state.audioMode = 'mute';
          dom.audioModeSelect.value = 'mute';
        }
        applyMusicVariant();
        break;

      case 'ArrowRight':
        e.preventDefault();
        selectCard((state.activeIdx + 1) % state.milestones.length);
        break;

      case 'ArrowLeft':
        e.preventDefault();
        selectCard((state.activeIdx - 1 + state.milestones.length) % state.milestones.length);
        break;

      case 'f':
      case 'F':
        toggleFullscreen();
        break;

      case 'c':
      case 'C':
        toggleAutoCycle();
        break;

      case 'Escape':
        if (dom.todayModal.classList.contains('visible')) {
          toggleTodayModal();
        } else if (state.manualOverride) {
          // Escape also resets to auto-detect mode
          resetToAuto();
        }
        break;

      case 't':
      case 'T':
        toggleTodayModal();
        break;

      case 'a':
      case 'A':
        // Reset to auto-detect mode
        resetToAuto();
        break;

      default:
        break;
    }
  }

  /* -----------------------------------------------------------------------
     17. FULLSCREEN
     ----------------------------------------------------------------------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  /* -----------------------------------------------------------------------
     18. LOADING SCREEN
     ----------------------------------------------------------------------- */
  function hideLoadingScreen() {
    if (dom.loadingScreen) {
      dom.loadingScreen.classList.add('hidden');
      setTimeout(() => {
        if (dom.loadingScreen.parentNode) {
          dom.loadingScreen.parentNode.removeChild(dom.loadingScreen);
        }
      }, 700);
    }
  }

  /* -----------------------------------------------------------------------
     19. SERVICE WORKER REGISTRATION
     ----------------------------------------------------------------------- */
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  /* -----------------------------------------------------------------------
     20. STREAM MODE (?stream=1)
     For YouTube 24/7 livestream — auto-starts, hides unlock banner
     ----------------------------------------------------------------------- */
  function checkStreamMode() {
    const params = new URLSearchParams(window.location.search);
    state.isStreamMode = params.has('stream') || params.has('obs');
    if (state.isStreamMode) {
      // Hide sound unlock immediately (OBS captures system audio)
      if (dom.soundUnlock) dom.soundUnlock.hidden = true;
      // Auto-idle faster for clean stream look
      document.body.classList.add('idle');
    }
  }

  /* -----------------------------------------------------------------------
     21. EXPOSE HANDLERS TO HTML (onclick attributes)
     ----------------------------------------------------------------------- */
  window.MDC = {
    unlockAudio,
    cycleTimeMode,
    toggleAutoCycle,
    forceBg,
    onAudioModeChange,
    toggleTodayModal,
    toggleFullscreen,
    resetToAuto,
  };

  /* -----------------------------------------------------------------------
     22. INITIALIZATION
     ----------------------------------------------------------------------- */
  function init() {
    cacheDom();
    ashCtx = dom.ashCanvas.getContext('2d');

    // Check for streaming mode
    checkStreamMode();

    // Build timeline
    const now = new Date();
    state.milestones = buildTimeline(now);

    // ── AUTO-DETECT: default to next upcoming mission ──
    state.activeIdx = detectActiveMission(now);

    // Set wallpaper to match detected mission
    const activeMilestone = state.milestones[state.activeIdx];
    if (activeMilestone) {
      setWallpaper(activeMilestone.bgIdx);
      // Set audio variant to match
      state.audioMode = activeMilestone.variant;
      dom.audioModeSelect.value = activeMilestone.variant;
    }

    // Build SpaceX arc
    buildMissionArc();

    // Particles
    initMotes();
    animateMotes();

    // Initial quote
    state.quoteIdx = Math.floor(Math.random() * QUOTES.length);
    if (dom.quoteBar) dom.quoteBar.textContent = QUOTES[state.quoteIdx];

    // Clock loop (1s is sufficient for seconds-resolution)
    updateClock();
    setInterval(updateClock, CLOCK_INTERVAL_MS);

    // Network time sync
    syncTime();
    setInterval(syncTime, SYNC_INTERVAL_MS);

    // Quote rotation
    setInterval(rotateQuote, QUOTE_ROTATE_MS);

    // Auto-hide UI
    window.addEventListener('mousemove', wakeUI);
    window.addEventListener('touchstart', wakeUI, { passive: true });
    window.addEventListener('keydown', wakeUI);
    setTimeout(() => document.body.classList.add('idle'), 3000);

    // Keyboard shortcuts
    window.addEventListener('keydown', handleKeyboard);

    // Resize handler (debounced for performance)
    let resizeTimer = null;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initMotes();
        buildMissionArc();
        // Force dynamic viewport height recalculation on mobile
        document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
        document.documentElement.style.setProperty('--vw', window.innerWidth * 0.01 + 'px');
      }, 150);
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // On orientation change, wait for the new dimensions to settle
      setTimeout(handleResize, 300);
    });
    // Set initial viewport custom properties
    document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
    document.documentElement.style.setProperty('--vw', window.innerWidth * 0.01 + 'px');

    // Handle visibility change (pause/resume when tab hidden)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Tab became visible — re-sync time and rebuild
        syncTime();
        updateClock();
        buildMissionArc();
      }
    });

    // Auto-start audio
    dom.musicEl.volume = 0.85;
    dom.musicEl.play().then(() => unlockAudio()).catch(() => {});
    ['click', 'pointerdown', 'keydown'].forEach(ev => {
      window.addEventListener(ev, () => {
        if (!state.audioUnlocked) unlockAudio();
      }, { once: true });
    });

    // Hide loading screen after images load
    const imgPromises = dom.bgImgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });
    Promise.all(imgPromises).then(() => {
      setTimeout(hideLoadingScreen, 300);
    });

    // Fallback: hide loading screen after 3s regardless
    setTimeout(hideLoadingScreen, 3000);

    // Service worker
    registerSW();
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
