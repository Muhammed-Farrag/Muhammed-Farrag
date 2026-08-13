<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🕷️ SpideyTracker · Profile</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #0a0e17;
      display: flex;
      justify-content: center;
      padding: 2.5rem 1.5rem;
      font-family: 'JetBrains Mono', monospace;
      color: #c2d4e6;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* Animated background particles */
    #particles-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }

    .tracker-container {
      max-width: 1100px;
      width: 100%;
      background: rgba(13, 22, 36, 0.92);
      border: 1px solid #1f3145;
      border-radius: 24px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 0, 0, 0.1), 0 0 30px rgba(255, 0, 0, 0.05);
      backdrop-filter: blur(10px);
      position: relative;
      z-index: 1;
      animation: containerPulse 4s ease-in-out infinite;
    }

    @keyframes containerPulse {
      0%, 100% { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 0, 0, 0.1), 0 0 30px rgba(255, 0, 0, 0.05); }
      50% { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 0 2px rgba(255, 50, 50, 0.3), 0 0 60px rgba(255, 0, 0, 0.1); }
    }

    /* Scanline overlay */
    .tracker-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: repeating-linear-gradient(0deg, 
        rgba(255, 0, 0, 0.02) 0px, 
        rgba(255, 0, 0, 0.02) 2px, 
        transparent 2px, 
        transparent 6px
      );
      border-radius: 24px;
      animation: scanlineMove 8s linear infinite;
    }

    @keyframes scanlineMove {
      0% { background-position: 0 0; }
      100% { background-position: 0 100px; }
    }

    /* Spider-web corner decorations */
    .tracker-container::after {
      content: '🕸️';
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 3rem;
      opacity: 0.15;
      animation: webSpin 20s linear infinite;
    }

    @keyframes webSpin {
      0% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(1.2); }
      100% { transform: rotate(360deg) scale(1); }
    }

    .spider-corner {
      position: absolute;
      font-size: 2.5rem;
      opacity: 0.12;
      animation: webSpin 25s linear infinite;
    }
    .spider-corner.tl { top: -8px; left: -8px; animation-delay: -5s; }
    .spider-corner.tr { top: -8px; right: -8px; animation-delay: 0s; }
    .spider-corner.bl { bottom: -8px; left: -8px; animation-delay: -10s; }
    .spider-corner.br { bottom: -8px; right: -8px; animation-delay: -15s; }

    h1, h2, h3 {
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    /* Spidey header with swinging animation */
    .terminal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 2rem;
      border-bottom: 1px solid #1e3146;
      padding-bottom: 1rem;
      position: relative;
    }

    .spidey-swing {
      display: inline-block;
      animation: spideySwing 3s ease-in-out infinite;
      font-size: 1.8rem;
      margin-right: 6px;
    }

    @keyframes spideySwing {
      0%, 100% { transform: rotate(-15deg) scale(1); }
      50% { transform: rotate(15deg) scale(1.1); }
    }

    .dot-group {
      display: flex;
      gap: 8px;
    }

    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #2b3f5a;
      transition: all 0.3s;
      animation: dotPulse 2s ease-in-out infinite;
    }
    .dot.red { background: #ff1744; animation-delay: 0s; }
    .dot.yellow { background: #ffea00; animation-delay: 0.3s; }
    .dot.green { background: #00e676; animation-delay: 0.6s; }

    @keyframes dotPulse {
      0%, 100% { opacity: 0.4; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    .prompt-line {
      font-size: 0.9rem;
      color: #7a9bcb;
      margin-left: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .prompt-line .cursor {
      display: inline-block;
      width: 12px;
      height: 2px;
      background: #ff1744;
      animation: blink 0.6s step-end infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    /* Status bar with glitch */
    .badge-strip {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 14px 24px;
      margin: 1.2rem 0 2rem 0;
      background: rgba(15, 26, 41, 0.8);
      padding: 0.9rem 1.5rem;
      border-radius: 60px;
      border: 1px solid #1a2d44;
      position: relative;
      overflow: hidden;
    }

    .badge-strip::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba(255, 0, 0, 0.03), transparent, rgba(255, 0, 0, 0.03), transparent);
      animation: rotateGlow 8s linear infinite;
    }

    @keyframes rotateGlow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .badge {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      position: relative;
      z-index: 1;
    }
    .badge span { color: #76b8e8; }
    .badge .highlight { color: #ff1744; animation: textGlow 2s ease-in-out infinite; }
    .badge .highlight2 { color: #ff6d6d; }

    @keyframes textGlow {
      0%, 100% { text-shadow: 0 0 5px rgba(255, 23, 68, 0.3); }
      50% { text-shadow: 0 0 20px rgba(255, 23, 68, 0.8), 0 0 40px rgba(255, 23, 68, 0.3); }
    }

    /* Spidey code block */
    .code-block {
      background: rgba(9, 16, 28, 0.9);
      border-radius: 16px;
      padding: 1.2rem 1.8rem;
      border-left: 4px solid #ff1744;
      font-size: 0.9rem;
      line-height: 1.8;
      color: #b0cde0;
      margin: 1.8rem 0 2.2rem 0;
      box-shadow: inset 0 0 20px rgba(255, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
    }

    .code-block::before {
      content: '🕷️';
      position: absolute;
      right: 15px;
      top: 10px;
      font-size: 1.5rem;
      opacity: 0.1;
      animation: spideySwing 3s ease-in-out infinite;
    }

    .code-block .var { color: #ff6b6b; }
    .code-block .str { color: #69db7c; }
    .code-block .cmd { color: #74c0fc; }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.2rem;
      margin: 2.5rem 0 1.2rem 0;
      color: #cbdef5;
      border-bottom: 1px dashed #1d3148;
      padding-bottom: 0.5rem;
      letter-spacing: -0.3px;
    }
    .section-title i {
      font-style: normal;
      background: rgba(255, 23, 68, 0.15);
      padding: 4px 12px;
      border-radius: 30px;
      font-size: 0.8rem;
      color: #ff6b6b;
      border: 1px solid rgba(255, 23, 68, 0.2);
    }

    /* Table with hover effects */
    .sightings-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      margin: 1rem 0 0.5rem 0;
    }
    .sightings-table th {
      text-align: left;
      padding: 0.5rem 0.8rem;
      color: #98bde0;
      font-weight: 600;
      border-bottom: 2px solid rgba(255, 23, 68, 0.2);
      letter-spacing: 0.5px;
    }
    .sightings-table td {
      padding: 0.9rem 0.8rem;
      border-bottom: 1px solid #142233;
      vertical-align: top;
      transition: all 0.3s;
    }
    .sightings-table tr {
      transition: all 0.3s;
    }
    .sightings-table tr:hover {
      background: rgba(255, 23, 68, 0.05);
      transform: scale(1.002);
    }
    .sightings-table tr:hover td {
      border-bottom-color: rgba(255, 23, 68, 0.2);
    }
    .sightings-table .when {
      color: #ff6b6b;
      font-weight: 500;
      white-space: nowrap;
    }
    .sightings-table .sighting-title {
      color: #e0efff;
      font-weight: 600;
    }
    .sightings-table .sub {
      color: #88abc9;
      font-size: 0.75rem;
    }
    .sightings-table .detail {
      color: #b6d0e8;
      line-height: 1.6;
      font-size: 0.8rem;
    }

    /* Skill badges with hover animations */
    .skill-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px 20px;
      margin: 1.5rem 0 0.5rem 0;
    }
    .skill-grid .skill-item {
      background: rgba(15, 31, 50, 0.8);
      padding: 8px 18px;
      border-radius: 30px;
      border: 1px solid #263e5c;
      font-size: 0.8rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: default;
      position: relative;
      overflow: hidden;
    }

    .skill-grid .skill-item::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 23, 68, 0.1), transparent 70%);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .skill-grid .skill-item:hover {
      transform: translateY(-3px) scale(1.05);
      border-color: #ff1744;
      box-shadow: 0 0 20px rgba(255, 23, 68, 0.2);
    }

    .skill-grid .skill-item:hover::before {
      opacity: 1;
    }

    .pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 18px;
      background: rgba(11, 20, 34, 0.8);
      padding: 1.2rem 1.8rem;
      border-radius: 20px;
      border: 1px solid #1a2d46;
      margin: 0.5rem 0 1rem 0;
      position: relative;
    }

    .pill-list .pill {
      font-size: 0.75rem;
      background: rgba(18, 34, 54, 0.8);
      padding: 4px 14px;
      border-radius: 40px;
      border: 1px solid #1f3a58;
      color: #b3d2f0;
      transition: all 0.3s;
    }

    .pill-list .pill:hover {
      border-color: #ff1744;
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(255, 23, 68, 0.1);
    }

    .pill-list .pill strong {
      color: #ff6b6b;
      font-weight: 600;
      margin-right: 4px;
    }

    /* Achievement cards with animation */
    .achievement-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1.8fr;
      gap: 0.8rem 1.2rem;
      background: rgba(11, 20, 34, 0.8);
      padding: 1.2rem 1.8rem;
      border-radius: 18px;
      border: 1px solid #1d314a;
      font-size: 0.8rem;
    }
    .achievement-grid > div {
      padding: 4px 0;
      transition: all 0.3s;
    }
    .achievement-grid > div:hover {
      transform: translateX(5px);
    }
    .achievement-grid .date {
      color: #ff6b6b;
      font-weight: 500;
    }
    .achievement-grid .event {
      color: #d6ecff;
      font-weight: 600;
    }
    .achievement-grid .note {
      color: #b0cde0;
    }

    /* Mission items with progress animation */
    .mission-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 1rem 1.8rem;
      background: rgba(10, 19, 31, 0.8);
      border-radius: 20px;
      border: 1px solid #1d3148;
      margin: 0.5rem 0 0.2rem 0;
      position: relative;
    }

    .mission-box .mission-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.9rem;
      color: #b8d3ee;
      position: relative;
    }

    .mission-box .mission-item .bracket {
      color: #ff1744;
      font-weight: 300;
      animation: bracketPulse 2s ease-in-out infinite;
    }

    @keyframes bracketPulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }

    .mission-progress {
      width: 100%;
      height: 2px;
      background: rgba(255, 23, 68, 0.1);
      border-radius: 2px;
      margin-top: 4px;
      overflow: hidden;
    }

    .mission-progress .bar {
      height: 100%;
      background: linear-gradient(90deg, #ff1744, #ff6b6b);
      border-radius: 2px;
      animation: progressFill 3s ease-in-out infinite;
    }

    @keyframes progressFill {
      0% { width: 30%; }
      50% { width: 70%; }
      100% { width: 30%; }
    }

    /* Comms with web effect */
    .comms-channel {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px 30px;
      background: rgba(13, 24, 40, 0.8);
      padding: 1.5rem 1.5rem;
      border-radius: 50px;
      margin: 1.5rem 0 1rem 0;
      border: 1px solid #1e314a;
      position: relative;
      overflow: hidden;
    }

    .comms-channel::before {
      content: '🕸️';
      position: absolute;
      font-size: 4rem;
      opacity: 0.03;
      animation: webSpin 30s linear infinite;
    }

    .comms-channel a {
      text-decoration: none;
      color: #b0d0ee;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      transition: all 0.3s;
      padding: 8px 16px;
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.02);
      position: relative;
      z-index: 1;
    }

    .comms-channel a:hover {
      color: #ff1744;
      transform: translateY(-2px) scale(1.05);
      background: rgba(255, 23, 68, 0.1);
      box-shadow: 0 0 30px rgba(255, 23, 68, 0.1);
    }

    /* Spidey signoff */
    .signoff {
      text-align: center;
      margin-top: 2.5rem;
      font-size: 0.8rem;
      color: #3e5d7a;
      letter-spacing: 0.3px;
      position: relative;
    }

    .signoff .spidey-wave {
      display: inline-block;
      animation: spideySwing 2s ease-in-out infinite;
      font-size: 1.5rem;
      margin-right: 10px;
      vertical-align: middle;
    }

    .signoff .cursor-line {
      display: inline-block;
      width: 14px;
      height: 2px;
      background: #ff1744;
      margin-left: 8px;
      vertical-align: middle;
      animation: blink 0.6s step-end infinite;
    }

    hr {
      border: none;
      border-top: 1px solid rgba(255, 23, 68, 0.1);
      margin: 1rem 0;
    }

    /* Responsive */
    @media (max-width: 700px) {
      .tracker-container { padding: 1.5rem 1rem; }
      .sightings-table td, .sightings-table th { padding: 0.6rem 0.4rem; font-size: 0.75rem; }
      .achievement-grid { grid-template-columns: 1fr; gap: 6px; }
      .badge-strip { border-radius: 30px; }
    }
  </style>
</head>
<body>

<!-- Particle Canvas -->
<canvas id="particles-canvas"></canvas>

<div class="tracker-container">
  <!-- Spider-web corners -->
  <div class="spider-corner tl">🕸️</div>
  <div class="spider-corner tr">🕸️</div>
  <div class="spider-corner bl">🕸️</div>
  <div class="spider-corner br">🕸️</div>

  <!-- Header -->
  <div class="terminal-header">
    <div class="dot-group">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
    </div>
    <div class="prompt-line">
      <span class="spidey-swing">🕷️</span>
      <span>spidey-tracker · ~/profile</span>
      <span class="cursor"></span>
    </div>
  </div>

  <!-- Main Title -->
  <div align="center" style="margin-bottom: 0.5rem;">
    <h1 style="font-weight: 800; font-size: 2.8rem; letter-spacing: -1px; background: linear-gradient(135deg, #ff1744, #ff6b6b, #ff1744); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: textGlow 3s ease-in-out infinite;">
      🕷️ SPIDEY_TRACKER
    </h1>
    <div style="font-size: 0.85rem; color: #6b93b5; margin-top: 4px; letter-spacing: 0.4px;">
      <span style="background: rgba(255, 23, 68, 0.1); padding: 0.2rem 1.2rem; border-radius: 30px; border: 1px solid rgba(255, 23, 68, 0.2);">
        > TARGET: AHMED SPIDEY · AI ENGINEER · STATUS: <span style="color: #ff1744; animation: textGlow 2s ease-in-out infinite;">ONLINE</span>
      </span>
    </div>
  </div>

  <!-- Badges -->
  <div class="badge-strip">
    <span class="badge"><span>🕷️</span> STATUS <span class="highlight">ACTIVE</span></span>
    <span class="badge"><span>📍</span> LOCATION <span>EGYPT</span></span>
    <span class="badge"><span>🎯</span> FOCUS <span class="highlight2">NLP · GEN AI · LLMOps</span></span>
  </div>

  <!-- Identity -->
  <div class="code-block">
    <div><span class="cmd">IDENTITY........</span> <span class="str">Ahmed Spidey</span></div>
    <div><span class="cmd">CLASS...........</span> <span class="str">Applied AI Engineer</span></div>
    <div><span class="cmd">SPECIALTY.......</span> <span class="str">NLP · Generative AI · LLM Integrations · Anomaly Detection</span></div>
    <div><span class="cmd">EDUCATION.......</span> <span class="str">B.Sc. AI Science — Alamein International University (2022–2026)</span></div>
    <div style="margin-top: 10px; color: #87b9db;"><span class="var">></span> Applied AI Engineer · production-ready NLP/Gen AI/LLM integrations, anomaly detection, recommendation engines.</div>
  </div>

  <!-- Sightings -->
  <div class="section-title">
    <span>🕸️ SIGHTINGS — CONFIRMED APPEARANCES</span>
    <i>tracked</i>
  </div>

  <table class="sightings-table">
    <thead><tr><th>WHEN</th><th>SIGHTING</th><th>DETAILS</th></tr></thead>
    <tbody>
      <tr>
        <td class="when"><code>Jul 2026 – Aug 2026</code></td>
        <td><span class="sighting-title">The Cluster</span><br><span class="sub">AI Operations Engineer · Cairo, Egypt · Remote</span></td>
        <td class="detail">AI operations at an Egyptian pharma/cosmetics supply-chain startup — data pipelines, scraping architecture, documentation.</td>
      </tr>
      <tr>
        <td class="when"><code>Apr 2026 – Aug 2026</code></td>
        <td><span class="sighting-title">GCI World 2026 — Data Science & AI Program</span><br><span class="sub">Matsuo-Iwasawa Lab, University of Tokyo · Remote</span></td>
        <td class="detail">3-month remote research: ML, data visualization, applied data science.</td>
      </tr>
      <tr>
        <td class="when"><code>Feb 2025 – Apr 2026</code></td>
        <td><span class="sighting-title">IEEE AIU Student Branch</span><br><span class="sub">AI Committee Member / AI Member — 1 yr 3 mos</span></td>
        <td class="detail">Active AI committee member, university IEEE branch.</td>
      </tr>
      <tr>
        <td class="when"><code>Oct 2025 – Dec 2025</code></td>
        <td><span class="sighting-title">TJM Labs</span><br><span class="sub">Software Engineer · United States · Remote</span></td>
        <td class="detail">AI automation with BotCity, Playwright, LLM APIs; backend integrations, workflow automation, scalable API services.</td>
      </tr>
      <tr>
        <td class="when"><code>Jun 2025 – Dec 2025</code></td>
        <td><span class="sighting-title">Digital Egypt Pioneers Initiative (DEPI)</span><br><span class="sub">Internship Trainee — Generative AI Professional Track</span></td>
        <td class="detail">National MCIT initiative. LLMs, GANs, Hugging Face; ML/DL/CV in Python; prompt engineering, transfer learning, attention-based NLP; capstone + ethics.</td>
      </tr>
      <tr>
        <td class="when"><code>Jul 2024 – Aug 2024</code></td>
        <td><span class="sighting-title">stc</span><br><span class="sub">AI & Data Analytics Intern · Saudi Arabia · Remote</span></td>
        <td class="detail">Recommendation systems (collaborative + content-based); customer behavior analysis, preprocessing, feature engineering, Python (pandas, scikit-learn).</td>
      </tr>
      <tr>
        <td class="when"><code>Jul 2024 – Aug 2024</code></td>
        <td><span class="sighting-title">Information Technology Institute (ITI)</span><br><span class="sub">Software Engineer Intern · Hybrid</span></td>
        <td class="detail">JavaFX app for Grand Egyptian Museum — multi-language chatbot, auth, navigation, modular architecture.</td>
      </tr>
    </tbody>
  </table>

  <!-- Skills -->
  <div class="section-title" style="margin-top: 2.8rem;">
    <span>⚡ SKILL SCAN — DETECTED CAPABILITIES</span>
    <i>verified</i>
  </div>

  <div class="skill-grid">
    <span class="skill-item">🐍 Python</span>
    <span class="skill-item">☕ Java</span>
    <span class="skill-item">⚙️ C++</span>
    <span class="skill-item">📊 R</span>
    <span class="skill-item">🟨 JavaScript</span>
    <span class="skill-item">🌐 HTML/CSS</span>
    <span class="skill-item">🧠 PyTorch</span>
    <span class="skill-item">🔮 TensorFlow</span>
    <span class="skill-item">⛓️ LangChain</span>
    <span class="skill-item">👁️ OpenCV</span>
    <span class="skill-item">🐳 Docker</span>
    <span class="skill-item">☸️ Kubernetes</span>
    <span class="skill-item">📦 Terraform</span>
    <span class="skill-item">📨 Kafka</span>
    <span class="skill-item">🐙 Git/GitHub</span>
  </div>

  <div class="pill-list">
    <span class="pill"><strong>[LANGUAGES]</strong> Python · Java · C++ · R · JavaScript · HTML · CSS</span>
    <span class="pill"><strong>[AI / ML]</strong> TensorFlow · PyTorch · LangChain · OpenCV · Data Viz</span>
    <span class="pill"><strong>[CLOUD/DEVOPS]</strong> Docker · Kubernetes · Terraform · Kafka</span>
    <span class="pill"><strong>[SOFT SKILLS]</strong> Critical Thinking · Communication · Leadership</span>
  </div>

  <!-- Achievements -->
  <div class="section-title">
    <span>🏆 EVENT LOG — VERIFIED ACHIEVEMENTS</span>
    <i>confirmed</i>
  </div>

  <div class="achievement-grid">
    <div class="date"><code>Apr 2026</code></div>
    <div class="event">DEPI — Top Digital Pioneer Honoree</div>
    <div class="note">Recognized by Egypt's MCIT for outstanding performance.</div>

    <div class="date"><code>Aug 2025</code></div>
    <div class="event">RoboRAVE International — Best Creativity Trophy</div>
    <div class="note">Beijing, China · Led Montura to Excellent Creativity Trophy among 20+ countries — anomaly detection system (CNN, AdaBoost, BERT).</div>

    <div class="date"><code>Aug 2025</code></div>
    <div class="event">RoboRAVE International — Rank 1</div>
    <div class="note">China · first place.</div>

    <div class="date"><code>—</code></div>
    <div class="event">RoboRAVE International — Judge</div>
    <div class="note">Served as judge.</div>
  </div>
  <div style="margin-top: 12px; font-size: 0.85rem; color: #6f95b5; padding-left: 8px;">
    <strong>Certifications:</strong> Programming Generative AI · Mastering Recommendation Systems with Python · LangChain & LangGraph
  </div>

  <!-- Mission -->
  <div class="section-title" style="margin-top: 2.5rem;">
    <span>🎯 CURRENT MISSION</span>
    <i>active</i>
  </div>
  <div class="mission-box">
    <div class="mission-item">
      <span class="bracket">[ ]</span> Advanced NLP & Generative AI systems
      <div class="mission-progress"><div class="bar" style="width: 65%;"></div></div>
    </div>
    <div class="mission-item">
      <span class="bracket">[ ]</span> Emotion-aware conversational AI
      <div class="mission-progress"><div class="bar" style="width: 45%; animation-delay: 1s;"></div></div>
    </div>
    <div class="mission-item">
      <span class="bracket">[ ]</span> Research-grade AI architectures
      <div class="mission-progress"><div class="bar" style="width: 80%; animation-delay: 2s;"></div></div>
    </div>
  </div>

  <!-- Comms -->
  <div class="section-title" style="margin-top: 2.5rem;">
    <span>📶 COMMS CHANNEL — ESTABLISH CONTACT</span>
    <i>open</i>
  </div>

  <div class="comms-channel">
    <a href="mailto:spidey@example.com">🕷️ spidey@tracker.ai</a>
    <a href="#">🔗 LinkedIn</a>
    <a href="#">🐙 GitHub</a>
    <a href="#">🐦 Twitter/X</a>
  </div>

  <!-- Signoff -->
  <div class="signoff">
    <span class="spidey-wave">🕷️</span>
    <span>> TRACKER SESSION ENDING ... THANKS FOR STOPPING BY.</span>
    <span class="cursor-line"></span>
    <div style="margin-top: 6px; color: #26445f; font-size: 0.7rem;">SPIDEY_TRACKER v3.0 · 2026 · 🕸️</div>
  </div>

</div>

<script>
  // Particle System
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 80;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.7 ? '255, 23, 68' : '100, 180, 255';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x >
