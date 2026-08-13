import { readFile, writeFile } from 'node:fs/promises';

const inputPath = process.argv[2];
if (!inputPath) throw new Error('Usage: node scripts/build-atlas.mjs <natural-earth-countries.geojson>');

const source = JSON.parse(await readFile(inputPath, 'utf8'));
const width = 1200;
const height = 600;
const continentCodes = {
  Africa: 'AF',
  Asia: 'AS',
  Europe: 'EU',
  'North America': 'NA',
  Oceania: 'OC',
  'South America': 'SA',
  Antarctica: 'AN',
  'Seven seas (open ocean)': 'OC'
};

const round = value => Math.round(value * 10) / 10;
const project = ([longitude, latitude]) => [
  round(((longitude + 180) / 360) * width),
  round(((90 - latitude) / 180) * height)
];

function ringToPath(ring) {
  return ring.map((coordinate, index) => {
    const [x, y] = project(coordinate);
    return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
  }).join('') + 'Z';
}

function geometryToPath(geometry) {
  if (geometry.type === 'Polygon') return geometry.coordinates.map(ringToPath).join('');
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flatMap(polygon => polygon.map(ringToPath)).join('');
  return '';
}

const countries = source.features.map(feature => {
  const properties = feature.properties;
  return {
    name: properties.ADMIN,
    code: properties.ISO_A2_EH || properties.ISO_A2,
    code3: properties.ADM0_A3,
    continent: continentCodes[properties.CONTINENT] || '--',
    path: geometryToPath(feature.geometry)
  };
}).filter(country => country.path && country.code !== '-99');

await writeFile('assets/world-countries.json', JSON.stringify({ width, height, source: 'Natural Earth 1:110m', countries }));
console.log(`Built ${countries.length} country paths in assets/world-countries.json.`);
