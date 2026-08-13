import { mkdir, writeFile } from 'node:fs/promises';

const login = process.env.GITHUB_ACTOR || 'Muhammed-Farrag';
const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error('GITHUB_TOKEN is required to generate profile metrics.');
}

const query = `
  query ProfileMetrics($login: String!) {
    user(login: $login) {
      followers { totalCount }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        isFork: false
        privacy: PUBLIC
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          stargazerCount
          forkCount
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name color } }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount }
          }
        }
      }
    }
  }
`;

const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Muhammed-Farrag-profile-metrics'
  },
  body: JSON.stringify({ query, variables: { login } })
});

if (!response.ok) {
  throw new Error(`GitHub API returned ${response.status}: ${await response.text()}`);
}

const payload = await response.json();
if (payload.errors?.length) {
  throw new Error(payload.errors.map(error => error.message).join('; '));
}

const user = payload.data.user;
if (!user) throw new Error(`GitHub user ${login} was not found.`);

const repositories = user.repositories.nodes;
const days = user.contributionsCollection.contributionCalendar.weeks
  .flatMap(week => week.contributionDays)
  .sort((a, b) => a.date.localeCompare(b.date));

const totals = {
  contributions: user.contributionsCollection.contributionCalendar.totalContributions,
  repositories: user.repositories.totalCount,
  followers: user.followers.totalCount,
  stars: repositories.reduce((sum, repository) => sum + repository.stargazerCount, 0),
  forks: repositories.reduce((sum, repository) => sum + repository.forkCount, 0)
};

const languageMap = new Map();
for (const repository of repositories) {
  for (const edge of repository.languages.edges) {
    const current = languageMap.get(edge.node.name) || { size: 0, color: edge.node.color || '#8a94a6' };
    current.size += edge.size;
    languageMap.set(edge.node.name, current);
  }
}

const languages = [...languageMap]
  .map(([name, data]) => ({ name, ...data }))
  .sort((a, b) => b.size - a.size)
  .slice(0, 6);
const languageTotal = languages.reduce((sum, language) => sum + language.size, 0) || 1;

function calculateStreaks(contributionDays) {
  let longest = 0;
  let running = 0;
  for (const day of contributionDays) {
    if (day.contributionCount > 0) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date();
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);
  const lastActiveIndex = contributionDays.findLastIndex(day => day.contributionCount > 0);
  let current = 0;

  if (lastActiveIndex >= 0 && [today, yesterday].includes(contributionDays[lastActiveIndex].date)) {
    for (let index = lastActiveIndex; index >= 0 && contributionDays[index].contributionCount > 0; index -= 1) {
      current += 1;
    }
  }
  return { current, longest };
}

const streaks = calculateStreaks(days);
const updatedAt = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date());

const escapeXml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const cleanSvg = svg => svg.replace(/[ \t]+$/gm, '');

const svgShell = (width, height, title, body) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">Repository-owned GitHub profile metrics for ${escapeXml(login)}, refreshed ${escapeXml(updatedAt)}.</desc>
  <defs>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111923"/><stop offset="1" stop-color="#0d1117"/></linearGradient>
    <linearGradient id="signal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#ff1744"/><stop offset="1" stop-color="#4d7fff"/></linearGradient>
  </defs>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="8" fill="url(#panel)" stroke="#303b49" stroke-width="2"/>
  <path d="M18 18h28M18 18v18M${width - 18} 18h-28M${width - 18} 18v18M18 ${height - 18}h28M18 ${height - 18}v-18M${width - 18} ${height - 18}h-28M${width - 18} ${height - 18}v-18" fill="none" stroke="#ff1744" stroke-width="2" opacity=".55"/>
  <text x="24" y="33" fill="#ff2d55" font-family="monospace" font-size="12" font-weight="700" letter-spacing="2">${escapeXml(title.toUpperCase())}</text>
  <text x="${width - 24}" y="33" fill="#667384" font-family="monospace" font-size="8" text-anchor="end">UPDATED ${escapeXml(updatedAt.toUpperCase())}</text>
  ${body}
  <rect x="18" y="${height - 10}" width="${width - 36}" height="2" fill="url(#signal)" opacity=".65"><animate attributeName="opacity" values=".25;.9;.25" dur="3s" repeatCount="indefinite"/></rect>
</svg>`.trim();

const metric = (x, value, label) => `
  <g transform="translate(${x} 0)">
    <text x="0" y="94" fill="#f0f4f8" font-family="monospace" font-size="29" font-weight="700" text-anchor="middle">${escapeXml(value)}</text>
    <text x="0" y="116" fill="#7dd9e8" font-family="monospace" font-size="9" font-weight="700" letter-spacing="1" text-anchor="middle">${escapeXml(label)}</text>
  </g>`;

const overview = svgShell(850, 165, 'Profile telemetry', `
  ${metric(95, totals.contributions, 'CONTRIBUTIONS')}
  ${metric(260, totals.repositories, 'PUBLIC REPOS')}
  ${metric(425, totals.stars, 'STARS')}
  ${metric(590, totals.followers, 'FOLLOWERS')}
  ${metric(755, totals.forks, 'FORKS')}
`);

let barX = 24;
const languageSegments = languages.map(language => {
  const width = Math.max(3, (language.size / languageTotal) * 802);
  const segment = `<rect x="${barX.toFixed(1)}" y="56" width="${width.toFixed(1)}" height="10" fill="${escapeXml(language.color)}"/>`;
  barX += width;
  return segment;
}).join('');

const languageRows = languages.map((language, index) => {
  const column = index % 3;
  const row = Math.floor(index / 3);
  const percentage = ((language.size / languageTotal) * 100).toFixed(1);
  const x = 35 + column * 270;
  const y = 94 + row * 32;
  return `<circle cx="${x}" cy="${y - 4}" r="5" fill="${escapeXml(language.color)}"/><text x="${x + 13}" y="${y}" fill="#c9d1d9" font-family="monospace" font-size="11">${escapeXml(language.name)} · ${percentage}%</text>`;
}).join('');

const languageCard = svgShell(850, 175, 'Language scan', `${languageSegments}${languageRows}`);

const recentDays = days.slice(-91);
const maxCount = Math.max(1, ...recentDays.map(day => day.contributionCount));
const grid = recentDays.map((day, index) => {
  const column = Math.floor(index / 7);
  const row = index % 7;
  const level = day.contributionCount === 0 ? 0 : Math.max(.25, day.contributionCount / maxCount);
  const fill = day.contributionCount === 0 ? '#202a35' : '#ff1744';
  return `<rect x="${430 + column * 17}" y="${51 + row * 14}" width="11" height="11" rx="2" fill="${fill}" opacity="${level.toFixed(2)}"><title>${day.date}: ${day.contributionCount} contributions</title></rect>`;
}).join('');

const streakCard = svgShell(850, 170, 'Contribution signal', `
  ${metric(92, streaks.current, 'CURRENT STREAK')}
  ${metric(250, streaks.longest, 'LONGEST STREAK')}
  ${metric(395, totals.contributions, 'YEAR TOTAL')}
  ${grid}
`);

const achievements = [
  ['AI', 'APPLIED AI'],
  [totals.repositories, 'REPO ARCHITECT'],
  [totals.contributions, 'COMMIT SIGNAL'],
  [languages.length, 'POLYGLOT'],
  [totals.stars, 'STAR COLLECTOR'],
  ['#1', 'ROBOrAVE'],
  ['LIVE', 'OPEN SOURCE']
];

const trophyBody = achievements.map(([value, label], index) => {
  const x = 68 + index * 119;
  return `<g transform="translate(${x} 0)"><path d="M-22 57h44v38H12v11H22v8h-44v-8h10V95h-10Z" fill="#151f2a" stroke="#ff1744" stroke-width="2"/><text x="0" y="82" fill="#f4f1de" font-family="monospace" font-size="14" font-weight="700" text-anchor="middle">${escapeXml(value)}</text><text x="0" y="133" fill="#7dd9e8" font-family="monospace" font-size="7" font-weight="700" text-anchor="middle">${escapeXml(label)}</text></g>`;
}).join('');
const trophyCard = svgShell(850, 155, 'Achievement array', trophyBody);

await mkdir('assets/metrics', { recursive: true });
await Promise.all([
  writeFile('assets/metrics/overview.svg', cleanSvg(overview)),
  writeFile('assets/metrics/languages.svg', cleanSvg(languageCard)),
  writeFile('assets/metrics/streak.svg', cleanSvg(streakCard)),
  writeFile('assets/metrics/achievements.svg', cleanSvg(trophyCard))
]);

console.log(`Generated README metrics for ${login}: ${totals.repositories} repositories, ${totals.contributions} contributions, ${languages.length} languages.`);
