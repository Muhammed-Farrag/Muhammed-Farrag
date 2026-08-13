<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SpideyTracker · Profile</title>
  <!-- Font & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
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
    }

    .tracker-container {
      max-width: 1100px;
      width: 100%;
      background: #0d1624;
      border: 1px solid #1f3145;
      border-radius: 24px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 255, 200, 0.05);
      backdrop-filter: blur(2px);
    }

    /* glitch / scan-line effect (subtle) */
    .tracker-container::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      background: repeating-linear-gradient(0deg, rgba(0,255,200,0.01) 0px, rgba(0,255,200,0.01) 2px, transparent 2px, transparent 6px);
      border-radius: 24px;
    }

    .tracker-container {
      position: relative;
      overflow: hidden;
    }

    h1, h2, h3 {
      font-weight: 600;
      letter-spacing: -0.02em;
    }

    .terminal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 2rem;
      border-bottom: 1px solid #1e3146;
      padding-bottom: 1rem;
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
    }
    .dot.red { background: #ff5f5f; }
    .dot.yellow { background: #ffbd5f; }
    .dot.green { background: #5fff8a; }

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
      background: #7ce0c6;
      animation: blink 0.9s step-end infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .badge-strip {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 14px 24px;
      margin: 1.2rem 0 2rem 0;
      background: #0f1a29;
      padding: 0.9rem 1.5rem;
      border-radius: 60px;
      border: 1px solid #1a2d44;
    }
    .badge {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .badge span {
      color: #76b8e8;
    }
    .badge .highlight {
      color: #39ff9e;
    }
    .badge .highlight2 {
      color: #ff7b7b;
    }

    .code-block {
      background: #09101c;
      border-radius: 16px;
      padding: 1.2rem 1.8rem;
      border-left: 4px solid #2bd4a0;
      font-size: 0.9rem;
      line-height: 1.8;
      color: #b0cde0;
      margin: 1.8rem 0 2.2rem 0;
      box-shadow: inset 0 0 20px rgba(0,20,30,0.5);
    }
    .code-block .var { color: #f5b37c; }
    .code-block .str { color: #9ae0b5; }
    .code-block .cmd { color: #97c1f0; }

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
      background: #18304a;
      padding: 4px 12px;
      border-radius: 30px;
      font-size: 0.8rem;
      color: #80d6c4;
    }

    /* table styling — sightings */
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
      border-bottom: 1px solid #1d314a;
      letter-spacing: 0.5px;
    }
    .sightings-table td {
      padding: 0.9rem 0.8rem;
      border-bottom: 1px solid #142233;
      vertical-align: top;
    }
    .sightings-table tr:last-child td {
      border-bottom: none;
    }
    .sightings-table .when {
      color: #a1c6f0;
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

    .skill-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px 20px;
      margin: 1.5rem 0 0.5rem 0;
    }
    .skill-grid img {
      height: 38px;
      width: auto;
      filter: drop-shadow(0 0 4px rgba(60, 200, 255, 0.2));
      background: #0b1422;
      padding: 6px 8px;
      border-radius: 10px;
      border: 1px solid #1e314a;
    }

    .pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 18px;
      background: #0b1422;
      padding: 1.2rem 1.8rem;
      border-radius: 20px;
      border: 1px solid #1a2d46;
      margin: 0.5rem 0 1rem 0;
    }
    .pill-list .pill {
      font-size: 0.75rem;
      background: #122236;
      padding: 4px 14px;
      border-radius: 40px;
      border: 1px solid #1f3a58;
      color: #b3d2f0;
    }
    .pill-list .pill strong {
      color: #e0f0ff;
      font-weight: 600;
      margin-right: 4px;
    }

    .achievement-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1.8fr;
      gap: 0.8rem 1.2rem;
      background: #0b1422;
      padding: 1.2rem 1.8rem;
      border-radius: 18px;
      border: 1px solid #1d314a;
      font-size: 0.8rem;
    }
    .achievement-grid .date {
      color: #7fb4e0;
      font-weight: 500;
    }
    .achievement-grid .event {
      color: #d6ecff;
      font-weight: 600;
    }
    .achievement-grid .note {
      color: #b0cde0;
    }

    .mission-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 1rem 1.8rem;
      background: #0a131f;
      border-radius: 20px;
      border: 1px solid #1d3148;
      margin: 0.5rem 0 0.2rem 0;
    }
    .mission-box .mission-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.9rem;
      color: #b8d3ee;
    }
    .mission-box .mission-item .bracket {
      color: #3a8a6a;
      font-weight: 300;
    }

    .comms-channel {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px 30px;
      background: #0d1828;
      padding: 1.5rem 1.5rem;
      border-radius: 50px;
      margin: 1.5rem 0 1rem 0;
      border: 1px solid #1e314a;
    }
    .comms-channel a {
      text-decoration: none;
      color: #b0d0ee;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      transition: 0.2s;
    }
    .comms-channel a:hover {
      color: #7ce0c6;
      text-shadow: 0 0 8px #47b89c;
    }

    .signoff {
      text-align: center;
      margin-top: 2.5rem;
      font-size: 0.8rem;
      color: #3e5d7a;
      letter-spacing: 0.3px;
    }
    .signoff .cursor-line {
      display: inline-block;
      width: 14px;
      height: 1.5px;
      background: #2b7a67;
      margin-left: 8px;
      vertical-align: middle;
    }

    hr {
      border: none;
      border-top: 1px solid #1a2d46;
      margin: 1rem 0;
    }

    /* responsive */
    @media (max-width: 700px) {
      .tracker-container { padding: 1.5rem 1rem; }
      .sightings-table td, .sightings-table th { padding: 0.6rem 0.4rem; font-size: 0.75rem; }
      .achievement-grid { grid-template-columns: 1fr; gap: 6px; }
      .badge-strip { border-radius: 30px; }
    }
  </style>
</head>
<body>
<div class="tracker-container">

  <!-- header / terminal -->
  <div class="terminal-header">
    <div class="dot-group">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
    </div>
    <div class="prompt-line">
      <span>spidey-tracker · ~/profile</span>
      <span class="cursor"></span>
    </div>
  </div>

  <!-- main heading -->
  <div align="center" style="margin-bottom: 0.5rem;">
    <h1 style="font-weight: 700; font-size: 2.6rem; letter-spacing: -1px; background: linear-gradient(135deg, #70e0c0, #8bb8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">⌗ SPIDEY_TRACKER</h1>
    <div style="font-size: 0.85rem; color: #6b93b5; margin-top: 4px; letter-spacing: 0.4px;">
      <span style="background: #0d1a2a; padding: 0.2rem 1.2rem; border-radius: 30px; border: 1px solid #1f3752;">> TARGET: AHMED SPIDEY · AI ENGINEER · STATUS: ONLINE</span>
    </div>
  </div>

  <!-- badge strip -->
  <div class="badge-strip">
    <span class="badge"><span>📡</span> STATUS <span class="highlight">ACTIVE</span></span>
    <span class="badge"><span>📍</span> LOCATION <span>EGYPT</span></span>
    <span class="badge"><span>🎯</span> FOCUS <span class="highlight2">NLP · GEN AI · LLMOps</span></span>
  </div>

  <!-- code block : identity -->
  <div class="code-block">
    <div><span class="cmd">IDENTITY........</span> <span class="str">Ahmed Spidey</span></div>
    <div><span class="cmd">CLASS...........</span> <span class="str">Applied AI Engineer</span></div>
    <div><span class="cmd">SPECIALTY.......</span> <span class="str">NLP · Generative AI · LLM Integrations · Anomaly Detection</span></div>
    <div><span class="cmd">EDUCATION.......</span> <span class="str">B.Sc. AI Science — Alamein International University (2022–2026)</span></div>
    <div style="margin-top: 10px; color: #87b9db;"><span class="var">></span> Applied AI Engineer · production-ready NLP/Gen AI/LLM integrations, anomaly detection, recommendation engines.</div>
  </div>

  <!-- SIGHTINGS -->
  <div class="section-title">
    <span>🛰️ SIGHTINGS — CONFIRMED APPEARANCES</span>
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

  <!-- SKILL SCAN -->
  <div class="section-title" style="margin-top: 2.8rem;">
    <span>⚡ SKILL SCAN — DETECTED CAPABILITIES</span>
    <i>verified</i>
  </div>

  <div class="skill-grid">
    <!-- using simple text icons as skillicons (since we want no external images) — but I'll add inline svg-like badges -->
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">🐍 Python</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">☕ Java</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">⚙️ C++</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">📊 R</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">🟨 JS</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">🌐 HTML/CSS</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">🧠 PyTorch</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">🔮 TensorFlow</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">⛓️ LangChain</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">👁️ OpenCV</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">🐳 Docker</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">☸️ Kubernetes</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">📦 Terraform</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">📨 Kafka</span>
    <span style="background:#0f1f32; padding:6px 16px; border-radius:30px; border:1px solid #263e5c; font-size:0.8rem;">🐙 Git/GitHub</span>
  </div>

  <div class="pill-list">
    <span class="pill"><strong>[LANGUAGES]</strong> Python · Java · C++ · R · JavaScript · HTML · CSS</span>
    <span class="pill"><strong>[AI / ML]</strong> TensorFlow · PyTorch · LangChain · OpenCV · Data Viz</span>
    <span class="pill"><strong>[CLOUD/DEVOPS]</strong> Docker · Kubernetes · Terraform · Kafka</span>
    <span class="pill"><strong>[SOFT SKILLS]</strong> Critical Thinking · Communication · Leadership</span>
  </div>

  <!-- ACHIEVEMENTS -->
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

  <!-- CURRENT MISSION -->
  <div class="section-title" style="margin-top: 2.5rem;">
    <span>🎯 CURRENT MISSION</span>
    <i>active</i>
  </div>
  <div class="mission-box">
    <div class="mission-item"><span class="bracket">[ ]</span> Advanced NLP & Generative AI systems</div>
    <div class="mission-item"><span class="bracket">[ ]</span> Emotion-aware conversational AI</div>
    <div class="mission-item"><span class="bracket">[ ]</span> Research-grade AI architectures</div>
  </div>

  <!-- COMMS -->
  <div class="section-title" style="margin-top: 2.5rem;">
    <span>📶 COMMS CHANNEL — ESTABLISH CONTACT</span>
    <i>open</i>
  </div>

  <div class="comms-channel">
    <a href="mailto:spidey@example.com">📧 spidey@tracker.ai</a>
    <a href="#">🔗 LinkedIn</a>
    <a href="#">🐙 GitHub</a>
    <a href="#">🐦 Twitter/X</a>
  </div>

  <!-- signoff -->
  <div class="signoff">
    <span>> TRACKER SESSION ENDING ... THANKS FOR STOPPING BY.</span>
    <span class="cursor-line"></span>
    <div style="margin-top: 6px; color: #26445f; font-size: 0.7rem;">SPIDEY_TRACKER v2.1 · 2026</div>
  </div>

</div>
</body>
</html>
