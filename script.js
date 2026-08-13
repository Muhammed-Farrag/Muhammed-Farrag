import * as THREE from 'three';

const shell = document.querySelector('.tracker-shell');
const screen = document.querySelector('.screen');
const canvas = document.querySelector('#tracker-canvas');
const intro = document.querySelector('#intro');
const loadingMap = document.querySelector('#loading-map');
const mapHud = document.querySelector('#map-hud');
const markerLayer = document.querySelector('#marker-layer');
const startButton = document.querySelector('#start-tracking');
const centerButton = document.querySelector('#center-map');
const statusText = document.querySelector('#system-status');
const coordinateReadout = document.querySelector('#coordinate-readout');
const signalCard = document.querySelector('#signal-card');
const cardClose = document.querySelector('#card-close');
const infoPanel = document.querySelector('#info-panel');
const panelClose = document.querySelector('#panel-close');
const panelIndex = document.querySelector('#panel-index');
const panelTitle = document.querySelector('#panel-title');
const panelBody = document.querySelector('#panel-body');
const soundToggle = document.querySelector('#sound-toggle');
const volume = document.querySelector('#volume');

let live = false;
let soundOn = true;
let audioContext;
let targetRotationX = 0.12;
let targetRotationY = -0.35;
let dragging = false;
let lastPointer = { x: 0, y: 0 };

const sightings = [
  { place: 'Cairo, Egypt', role: 'AI Operations Engineer · The Cluster', date: 'Jul 2026 — Aug 2026', type: 'Latest signal', copy: 'Data enhancement pipelines, distributor scraping architecture, AI operations, and technical documentation for a pharma and cosmetics supply-chain startup.', lat: 30.04, lon: 31.24 },
  { place: 'Tokyo, Japan', role: 'GCI World 2026 · Matsuo-Iwasawa Lab', date: 'Apr 2026 — Aug 2026', type: 'Research signal', copy: 'Remote research in machine learning, data visualization, and applied data science with the University of Tokyo.', lat: 35.68, lon: 139.69 },
  { place: 'Beijing, China', role: 'RoboRAVE · Creativity Trophy', date: 'Aug 2025', type: 'Award signal', copy: 'Led Montura to an international creativity trophy with an anomaly detection system combining CNN, AdaBoost, and BERT.', lat: 39.9, lon: 116.4 },
  { place: 'United States', role: 'Software Engineer · TJM Labs', date: 'Oct 2025 — Dec 2025', type: 'Engineering signal', copy: 'Built AI automation with BotCity, Playwright, LLM APIs, backend integrations, and scalable workflow services.', lat: 39.8, lon: -98.6 },
  { place: 'Saudi Arabia', role: 'AI & Data Analytics Intern · stc', date: 'Jul 2024 — Aug 2024', type: 'Internship signal', copy: 'Recommendation systems, customer behavior analysis, preprocessing, feature engineering, pandas, and scikit-learn.', lat: 24.71, lon: 46.67 },
  { place: 'Alexandria, Egypt', role: 'B.Sc. AI Science · AIU', date: '2022 — 2026', type: 'Education signal', copy: 'Applied AI studies at Alamein International University, focused on intelligent systems and practical research.', lat: 30.84, lon: 28.95 },
  { place: 'Giza, Egypt', role: 'Software Engineer Intern · ITI', date: 'Jul 2024 — Aug 2024', type: 'Build signal', copy: 'Created a modular JavaFX museum application with a multilingual chatbot, authentication, and navigation flows.', lat: 30.01, lon: 31.2 }
];

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
      <article class="file-entry"><span>01</span><h3>Start tracking</h3><p>Initialize the Three.js intelligence globe and reveal confirmed portfolio signals.</p></article>
      <article class="file-entry"><span>02</span><h3>Explore the globe</h3><p>Drag to rotate. Select a red signal pin to inspect the work associated with that location.</p></article>
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

document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
panelClose.addEventListener('click', () => { infoPanel.hidden = true; beep(280); });
cardClose.addEventListener('click', () => { signalCard.hidden = true; beep(280); });

soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? '◖))' : '×';
  soundToggle.setAttribute('aria-pressed', String(!soundOn));
  soundToggle.setAttribute('aria-label', soundOn ? 'Mute interface sound' : 'Enable interface sound');
  if (soundOn) beep(520);
});

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
} catch (error) {
  canvas.hidden = true;
  screen.classList.add('webgl-fallback');
  statusText.textContent = '2D fallback ready';
  console.warn('WebGL is unavailable; using the CSS tracker fallback.', error);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0, 0.15, 7.1);

const globeGroup = new THREE.Group();
scene.add(globeGroup);

const globeRadius = 2.05;
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(globeRadius, 30, 20),
  new THREE.MeshBasicMaterial({ color: 0x4cb5c9, wireframe: true, transparent: true, opacity: 0.19 })
);
globeGroup.add(sphere);

const innerGlow = new THREE.Mesh(
  new THREE.SphereGeometry(globeRadius * .98, 40, 28),
  new THREE.MeshBasicMaterial({ color: 0x102f37, transparent: true, opacity: .65 })
);
globeGroup.add(innerGlow);

const pointPositions = [];
for (let i = 0; i < 900; i += 1) {
  const phi = Math.acos(1 - 2 * Math.random());
  const theta = Math.random() * Math.PI * 2;
  pointPositions.push(
    globeRadius * Math.sin(phi) * Math.cos(theta),
    globeRadius * Math.cos(phi),
    globeRadius * Math.sin(phi) * Math.sin(theta)
  );
}
const pointGeometry = new THREE.BufferGeometry();
pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
const points = new THREE.Points(pointGeometry, new THREE.PointsMaterial({ color: 0x78d7e5, size: .018, transparent: true, opacity: .72 }));
globeGroup.add(points);

const orbit = new THREE.Mesh(
  new THREE.TorusGeometry(2.65, .008, 4, 160),
  new THREE.MeshBasicMaterial({ color: 0xee4c57, transparent: true, opacity: .38 })
);
orbit.rotation.x = Math.PI * .56;
orbit.rotation.y = Math.PI * .12;
globeGroup.add(orbit);

const halo = new THREE.Mesh(
  new THREE.SphereGeometry(globeRadius * 1.08, 36, 24),
  new THREE.MeshBasicMaterial({ color: 0x49b7ce, transparent: true, opacity: .035, side: THREE.BackSide })
);
globeGroup.add(halo);

function latLonToVector(lat, lon, radius = globeRadius + .05) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const markerObjects = sightings.map((sighting, index) => {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = 'map-marker';
  element.setAttribute('aria-label', `${sighting.place}: ${sighting.role}`);
  element.innerHTML = `<span>${sighting.place}</span>`;
  element.addEventListener('click', () => showSighting(index));
  markerLayer.appendChild(element);
  return { element, position: latLonToVector(sighting.lat, sighting.lon), sighting };
});

function showSighting(index) {
  const item = sightings[index];
  document.querySelector('#card-type').textContent = item.type;
  document.querySelector('#card-title').textContent = item.place;
  document.querySelector('#card-role').textContent = item.role;
  document.querySelector('#card-copy').textContent = item.copy;
  document.querySelector('#card-date').textContent = item.date;
  coordinateReadout.textContent = `${Math.abs(item.lat).toFixed(2)}° ${item.lat >= 0 ? 'N' : 'S'} · ${Math.abs(item.lon).toFixed(2)}° ${item.lon >= 0 ? 'E' : 'W'}`;
  signalCard.hidden = false;
  beep(610, .07);
}

function updateMarkers() {
  const width = screen.clientWidth;
  const height = screen.clientHeight;
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);

  markerObjects.forEach(({ element, position }) => {
    const world = position.clone().applyMatrix4(globeGroup.matrixWorld);
    const normal = world.clone().normalize();
    const visible = normal.dot(camera.position.clone().normalize()) > .05;
    const projected = world.clone().project(camera);
    element.style.left = `${(projected.x * .5 + .5) * width}px`;
    element.style.top = `${(-projected.y * .5 + .5) * height}px`;
    element.style.opacity = live && visible ? '1' : '0';
    element.style.pointerEvents = live && visible ? 'auto' : 'none';
  });
}

function resize() {
  const width = screen.clientWidth;
  const height = screen.clientHeight;
  renderer?.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate(time = 0) {
  if (!dragging) targetRotationY += live ? .00075 : .0002;
  globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * .05;
  globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * .05;
  orbit.rotation.z = time * .00008;
  points.rotation.y = time * .000025;
  renderer?.render(scene, camera);
  updateMarkers();
  requestAnimationFrame(animate);
}

screen.addEventListener('pointerdown', event => {
  if (!live || event.target.closest('button, a, aside, article')) return;
  dragging = true;
  lastPointer = { x: event.clientX, y: event.clientY };
  screen.setPointerCapture(event.pointerId);
});
screen.addEventListener('pointermove', event => {
  if (!dragging) return;
  targetRotationY += (event.clientX - lastPointer.x) * .006;
  targetRotationX += (event.clientY - lastPointer.y) * .004;
  targetRotationX = Math.max(-.8, Math.min(.8, targetRotationX));
  lastPointer = { x: event.clientX, y: event.clientY };
});
screen.addEventListener('pointerup', () => { dragging = false; });
screen.addEventListener('pointercancel', () => { dragging = false; });

centerButton.addEventListener('click', () => {
  targetRotationX = .12;
  targetRotationY = -.35;
  signalCard.hidden = true;
  beep(420);
});

startButton.addEventListener('click', () => {
  if (live) return;
  intro.style.pointerEvents = 'none';
  intro.style.opacity = '0';
  loadingMap.hidden = false;
  statusText.textContent = 'Initializing map';
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

window.addEventListener('resize', resize);
resize();
animate();
