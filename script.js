const shell = document.querySelector('.tracker-shell');
const screen = document.querySelector('.screen');
const atlasViewport = document.querySelector('#atlas-viewport');
const atlasStage = document.querySelector('#atlas-stage');
const intro = document.querySelector('#intro');
const loadingMap = document.querySelector('#loading-map');
const mapHud = document.querySelector('#map-hud');
const markerLayer = document.querySelector('#marker-layer');
const startButton = document.querySelector('#start-tracking');
const centerButton = document.querySelector('#center-map');
const zoomInButton = document.querySelector('#zoom-in');
const zoomOutButton = document.querySelector('#zoom-out');
const statusText = document.querySelector('#system-status');
const coordinateReadout = document.querySelector('#coordinate-readout');
const countryLayer = document.querySelector('#country-layer');
const signalCard = document.querySelector('#signal-card');
const cardClose = document.querySelector('#card-close');
const infoPanel = document.querySelector('#info-panel');
const panelClose = document.querySelector('#panel-close');
const panelIndex = document.querySelector('#panel-index');
const panelTitle = document.querySelector('#panel-title');
const panelBody = document.querySelector('#panel-body');
const soundToggle = document.querySelector('#sound-toggle');
const volume = document.querySelector('#volume');
const cardLinks = document.querySelector('#card-links');

let live = false;
let soundOn = true;
let audioContext;
let zoom = 1;
let panX = 0;
let panY = 0;
let dragging = false;
let lastPointer = { x: 0, y: 0 };
let activeContinent = 'ALL';
let selectedCountryCode = '';

const sightings = [
  { place: 'Cairo, Egypt', country: 'EG', continent: 'AF', role: 'AI Operations Engineer · The Cluster', date: 'Jul 2026 — Aug 2026', type: 'Latest signal', copy: 'Data enhancement pipelines, distributor scraping architecture, AI operations, and technical documentation for a pharma and cosmetics supply-chain startup.', lat: 30.04, lon: 31.24, offsetX: 9, offsetY: -8 },
  { place: 'Tokyo, Japan', country: 'JP', continent: 'AS', role: 'GCI World 2026 · Matsuo-Iwasawa Lab', date: 'Apr 2026 — Aug 2026', type: 'Research signal', copy: 'Remote research in machine learning, data visualization, and applied data science with the University of Tokyo.', lat: 35.68, lon: 139.69 },
  { place: 'Beijing, China', country: 'CN', continent: 'AS', role: 'RoboRAVE · Creativity Trophy', date: 'Aug 2025', type: 'Award signal', copy: 'Led Montura to an international creativity trophy with an anomaly detection system combining CNN, AdaBoost, and BERT.', lat: 39.9, lon: 116.4 },
  { place: 'Bear, Delaware, United States', country: 'US', continent: 'NA', role: 'Software Engineer · TJM Labs', date: 'Oct 2025 — Dec 2025', type: 'Engineering signal', copy: 'Built AI automation with BotCity, Playwright, LLM APIs, backend integrations, and scalable workflow services.', lat: 39.63, lon: -75.66 },
  { place: 'Riyadh, Saudi Arabia', country: 'SA', continent: 'AS', role: 'AI & Data Analytics Intern · stc', date: 'Jul 2024 — Aug 2024', type: 'Internship signal', copy: 'Recommendation systems, customer behavior analysis, preprocessing, feature engineering, pandas, and scikit-learn.', lat: 24.71, lon: 46.67 },
  { place: 'New Alamein, Egypt', country: 'EG', continent: 'AF', role: 'B.Sc. AI Science · AIU', date: '2022 — 2026', type: 'Education signal', copy: 'Applied AI studies at Alamein International University, focused on intelligent systems and practical research.', lat: 30.84, lon: 28.95, offsetX: -11, offsetY: -17 },
  { place: 'Smart Village, Giza, Egypt', country: 'EG', continent: 'AF', role: 'Software Engineer Intern · ITI', date: 'Jul 2024 — Aug 2024', type: 'Build signal', copy: 'Created a modular JavaFX museum application with a multilingual chatbot, authentication, and navigation flows.', lat: 30.01, lon: 31.2, offsetX: -5, offsetY: 12 }
];

const countryDossiers = {
  CN: {
    summary: 'RoboRAVE World Championship 2025 · confirmed award signal',
    locations: [{
      name: 'National Speed Skating Oval (Ice Ribbon)',
      city: 'Beijing, China',
      coordinates: '40.008° N · 116.390° E',
      links: [
        ['OPEN MAP', 'https://www.google.com/maps/search/?api=1&query=National+Speed+Skating+Oval+Beijing'],
        ['ROBORAVE SOURCE', 'https://blog.roboraveinternational.org/en/blog/2/roborave-world-championship-2025-in-beijing-china-at-the-national-speed-skating-oval-ice-ribbon-china-in-the-heart-of-the-millenary-city-14'],
        ['BEIJING GOV SOURCE', 'https://www.beijing.gov.cn/fuwu/bmfw/sy/jrts/202508/t20250822_4180529.html']
      ]
    }]
  },
  EG: {
    summary: 'Operations, education, and engineering signals',
    locations: [
      { name: 'Cairo', city: 'Cairo, Egypt', coordinates: '30.044° N · 31.236° E', links: [['OPEN MAP', 'https://www.google.com/maps/search/?api=1&query=Cairo+Egypt']] },
      { name: 'Alamein International University', city: 'New Alamein City, Egypt', coordinates: '30.845° N · 28.952° E', links: [['OPEN MAP', 'https://www.google.com/maps/search/?api=1&query=Alamein+International+University'], ['OFFICIAL AIU', 'https://aiu.edu.eg/about-aiu/']] },
      { name: 'Information Technology Institute · B148', city: 'Smart Village, Giza, Egypt', coordinates: '30.074° N · 31.018° E', links: [['OPEN MAP', 'https://www.google.com/maps/search/?api=1&query=Information+Technology+Institute+Smart+Village+Egypt'], ['OFFICIAL ITI', 'https://iti.gov.eg/contact-us']] }
    ]
  },
  JP: {
    summary: 'GCI World 2026 · Matsuo-Iwasawa Laboratory research signal',
    locations: [{ name: 'University of Tokyo · Engineering Building 2', city: '7-3-1 Hongo, Bunkyo-ku, Tokyo', coordinates: '35.713° N · 139.762° E', links: [['OPEN MAP', 'https://www.google.com/maps/search/?api=1&query=University+of+Tokyo+Engineering+Building+2'], ['LAB ACCESS', 'https://www.ymatsuo.com/access/']] }]
  },
  SA: {
    summary: 'stc AI and data analytics internship signal',
    locations: [{ name: 'stc Headquarters · King Abdulaziz Complex', city: 'Al Mursalat, Riyadh, Saudi Arabia', coordinates: '24.749° N · 46.678° E', links: [['OPEN MAP', 'https://www.google.com/maps/search/?api=1&query=stc+Headquarters+King+Abdulaziz+Complex+Riyadh'], ['OFFICIAL STC', 'https://www.stc.com.sa/content/dam/stc/stc-annual-report-2024/about-stc.html']] }]
  },
  US: {
    summary: 'Remote software engineering signal · TJM Labs',
    locations: [{ name: 'TJM Labs', city: 'Bear, Delaware, United States', coordinates: '39.630° N · 75.658° W', links: [['OPEN MAP', 'https://www.google.com/maps/search/?api=1&query=Bear+Delaware+United+States'], ['COMPANY SITE', 'https://tjmlabs.com/enterprise/']] }]
  }
};

const panelContent = {
  profile: {
    index: 'TARGET FILE', title: 'Muhammed Farrag', body: `
      <div class="profile-file">
        <strong>Applied AI Engineer</strong><em>Cairo, Egypt · Signal online</em>
        <p>I build applied AI systems that turn research ideas into reliable products, with a focus on NLP, generative AI, LLM integrations, anomaly detection, and intelligent automation.</p>
      </div>`
  },
  activity: {
    index: 'FILE 01', title: 'Activity log', body: sightings.map(item => `
      <article class="file-entry"><span>${item.date}</span><h3>${item.role}</h3><p>${item.copy}</p></article>`).join('')
  },
  skills: {
    index: 'FILE 02', title: 'Skill scan', body: `<div class="tag-cloud">${[
      'Python','Java','C++','R','JavaScript','TensorFlow','PyTorch','LangChain','OpenCV','Docker','Kubernetes','Terraform','Kafka','LLMOps','NLP','Generative AI'
    ].map(skill => `<span>${skill}</span>`).join('')}</div>`
  },
  events: {
    index: 'FILE 03', title: 'Event log', body: `
      <article class="file-entry"><span>APR 2026</span><h3>DEPI — Top Digital Pioneer</h3><p>Recognized by Egypt's MCIT for outstanding performance and innovation.</p></article>
      <article class="file-entry"><span>AUG 2025</span><h3>RoboRAVE International — Creativity Trophy</h3><p>Led an AI-powered anomaly detection and prevention project among teams from 20+ countries.</p></article>
      <article class="file-entry"><span>AUG 2025</span><h3>RoboRAVE International — Rank 1</h3><p>First-place international ranking in China.</p></article>`
  },
  comms: {
    index: 'FILE 04', title: 'Comms channel', body: `<div class="comms-list">
      <a href="mailto:mohamed.frage19@gmail.com">EMAIL · MOHAMED.FRAGE19@GMAIL.COM</a>
      <a href="https://www.linkedin.com/in/muhammed-farrag-/" target="_blank" rel="noreferrer">LINKEDIN · MUHAMMED-FARRAG</a>
      <a href="https://github.com/Muhammed-Farrag" target="_blank" rel="noreferrer">GITHUB · MUHAMMED-FARRAG</a>
    </div>`
  },
  help: {
    index: 'SYSTEM GUIDE', title: 'Navigation', body: `
      <article class="file-entry"><span>01</span><h3>Start tracking</h3><p>Initialize the intelligence atlas and reveal seven confirmed portfolio signals.</p></article>
      <article class="file-entry"><span>02</span><h3>Explore the world</h3><p>Drag to pan the map, use + and − to zoom, and select a red signal pin to inspect its record.</p></article>
      <article class="file-entry"><span>03</span><h3>Open data files</h3><p>Use the left rail for experience, skills, awards, and contact information.</p></article>`
  }
};

function beep(frequency = 360, duration = 0.045) {
  if (!soundOn || Number(volume.value) === 0) return;
  audioContext ??= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'square';
  oscillator.frequency.value = frequency;
  gain.gain.value = Number(volume.value) / 1800;
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function openPanel(name) {
  const data = panelContent[name];
  if (!data) return;
  panelIndex.textContent = data.index;
  panelTitle.textContent = data.title;
  panelBody.innerHTML = data.body;
  infoPanel.hidden = false;
  beep(460);
}

function applyAtlasTransform() {
  atlasStage.style.setProperty('--pan-x', `${panX}px`);
  atlasStage.style.setProperty('--pan-y', `${panY}px`);
  atlasStage.style.setProperty('--zoom', zoom);
}

function setZoom(nextZoom) {
  zoom = Math.max(1, Math.min(2.35, nextZoom));
  if (zoom === 1) {
    panX = 0;
    panY = 0;
  }
  applyAtlasTransform();
  beep(420 + zoom * 55);
}

function showSighting(index) {
  const item = sightings[index];
  document.querySelector('#card-type').textContent = item.type;
  document.querySelector('#card-title').textContent = item.place;
  document.querySelector('#card-role').textContent = item.role;
  document.querySelector('#card-copy').textContent = item.copy;
  const dossier = countryDossiers[item.country];
  cardLinks.innerHTML = dossier?.locations
    .flatMap(location => location.links.slice(0, 2))
    .slice(0, 3)
    .map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`)
    .join('') || '';
  document.querySelector('#card-date').textContent = item.date;
  coordinateReadout.textContent = `${Math.abs(item.lat).toFixed(2)}° ${item.lat >= 0 ? 'N' : 'S'} · ${Math.abs(item.lon).toFixed(2)}° ${item.lon >= 0 ? 'E' : 'W'}`;
  signalCard.hidden = false;
  beep(610, .07);
}

function openCountryDossier(country) {
  selectedCountryCode = country.code;
  document.querySelectorAll('.country').forEach(path => path.classList.toggle('is-selected', path.dataset.code === country.code));
  const dossier = countryDossiers[country.code];
  const locations = dossier?.locations || [];
  panelIndex.textContent = `GEO ${country.continent} / ${country.code}`;
  panelTitle.textContent = country.name;
  panelBody.innerHTML = `
    <div class="country-summary">
      <span>CLIENT.GEO.CONTINENT_CODE</span><strong>${country.continent}</strong>
      <span>CLIENT.GEO.COUNTRY_CODE</span><strong>${country.code}</strong>
      <span>CLIENT.GEO.COUNTRY_CODE3</span><strong>${country.code3}</strong>
    </div>
    <p class="country-status">${dossier?.summary || 'No confirmed portfolio signal recorded in this country yet.'}</p>
    ${locations.length ? locations.map(location => `
      <article class="location-entry">
        <span>VERIFIED LOCATION</span>
        <h3>${location.name}</h3>
        <p>${location.city}<br>${location.coordinates}</p>
        <div class="location-links">${location.links.map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`).join('')}</div>
      </article>`).join('') : `<a class="country-map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.name)}" target="_blank" rel="noreferrer">OPEN ${country.name.toUpperCase()} IN MAPS</a>`}
  `;
  infoPanel.hidden = false;
  beep(locations.length ? 620 : 390, .07);
}

function applyContinentFilter(code) {
  activeContinent = code;
  document.querySelectorAll('.continent-filters [data-continent]').forEach(button => button.classList.toggle('is-active', button.dataset.continent === code));
  document.querySelectorAll('.country').forEach(path => path.classList.toggle('is-filtered-out', code !== 'ALL' && path.dataset.continent !== code));
  document.querySelectorAll('.map-marker').forEach((marker, index) => marker.classList.toggle('is-filtered-out', code !== 'ALL' && sightings[index].continent !== code));
  beep(460);
}

async function loadAtlas() {
  try {
    const response = await fetch('assets/world-countries.json');
    if (!response.ok) throw new Error(`Map data returned ${response.status}`);
    const atlas = await response.json();
    const confirmedCodes = new Set(sightings.map(sighting => sighting.country));
    for (const country of atlas.countries) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', country.path);
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', `${country.name}, country code ${country.code}, continent code ${country.continent}`);
      path.dataset.code = country.code;
      path.dataset.continent = country.continent;
      path.classList.add('country');
      if (confirmedCodes.has(country.code)) path.classList.add('has-signal');
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${country.name} · ${country.continent}/${country.code}`;
      path.appendChild(title);
      path.addEventListener('click', event => { event.stopPropagation(); openCountryDossier(country); });
      path.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openCountryDossier(country);
        }
      });
      countryLayer.appendChild(path);
    }
    statusText.textContent = 'Country atlas ready';
  } catch (error) {
    statusText.textContent = 'Atlas data unavailable';
    console.error(error);
  }
}

function createMarkers() {
  sightings.forEach((sighting, index) => {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = 'map-marker';
    element.style.left = `calc(${((sighting.lon + 180) / 360) * 100}% + ${sighting.offsetX || 0}px)`;
    element.style.top = `calc(${((90 - sighting.lat) / 180) * 100}% + ${sighting.offsetY || 0}px)`;
    element.setAttribute('aria-label', `${sighting.place}: ${sighting.role}`);
    element.innerHTML = `<span>${sighting.place}</span>`;
    element.addEventListener('click', event => {
      event.stopPropagation();
      showSighting(index);
    });
    markerLayer.appendChild(element);
  });
}

document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
document.querySelectorAll('.continent-filters [data-continent]').forEach(button => button.addEventListener('click', () => applyContinentFilter(button.dataset.continent)));
panelClose.addEventListener('click', () => {
  infoPanel.hidden = true;
  selectedCountryCode = '';
  document.querySelectorAll('.country').forEach(path => path.classList.remove('is-selected'));
  beep(280);
});
cardClose.addEventListener('click', () => { signalCard.hidden = true; beep(280); });

soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? '◖))' : '×';
  soundToggle.setAttribute('aria-pressed', String(!soundOn));
  soundToggle.setAttribute('aria-label', soundOn ? 'Mute interface sound' : 'Enable interface sound');
  if (soundOn) beep(520);
});

atlasViewport.addEventListener('pointerdown', event => {
  if (!live || event.target.closest('button, a')) return;
  dragging = true;
  lastPointer = { x: event.clientX, y: event.clientY };
  atlasViewport.classList.add('is-dragging');
  atlasViewport.setPointerCapture(event.pointerId);
});

atlasViewport.addEventListener('pointermove', event => {
  if (!dragging) return;
  panX += event.clientX - lastPointer.x;
  panY += event.clientY - lastPointer.y;
  const maxX = screen.clientWidth * .42 * zoom;
  const maxY = screen.clientHeight * .28 * zoom;
  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));
  lastPointer = { x: event.clientX, y: event.clientY };
  applyAtlasTransform();
});

function stopDragging() {
  dragging = false;
  atlasViewport.classList.remove('is-dragging');
}

atlasViewport.addEventListener('pointerup', stopDragging);
atlasViewport.addEventListener('pointercancel', stopDragging);
atlasViewport.addEventListener('wheel', event => {
  if (!live) return;
  event.preventDefault();
  setZoom(zoom + (event.deltaY < 0 ? .15 : -.15));
}, { passive: false });

zoomInButton.addEventListener('click', () => setZoom(zoom + .25));
zoomOutButton.addEventListener('click', () => setZoom(zoom - .25));
centerButton.addEventListener('click', () => {
  zoom = 1;
  panX = 0;
  panY = 0;
  applyAtlasTransform();
  signalCard.hidden = true;
  beep(420);
});

startButton.addEventListener('click', () => {
  if (live) return;
  intro.style.pointerEvents = 'none';
  intro.style.opacity = '0';
  loadingMap.hidden = false;
  statusText.textContent = 'Initializing atlas';
  beep(340, .08);
  window.setTimeout(() => {
    live = true;
    shell.classList.add('is-live');
    intro.hidden = true;
    loadingMap.hidden = true;
    mapHud.hidden = false;
    statusText.textContent = 'Tracking 07 signals';
    beep(650, .09);
  }, 1100);
});

createMarkers();
applyAtlasTransform();
loadAtlas();
