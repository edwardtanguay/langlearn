import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

export interface BasicItem {
  id: string;
  en: string;
  fr: string;
  es: string;
  it: string;
  nl: string;
}

export interface CategoryVideo {
  url: string;
  title: string;
}

export interface BasicCategory {
  id: string;
  title: string;
  items: BasicItem[];
  videos?: Record<string, CategoryVideo[]>;
  links?: Record<string, CategoryVideo[]>;
}

interface ParsedFileCategory {
  name: string;
  items: string[];
  videos: CategoryVideo[];
}

function formatCategoryTitle(raw: string): string {
  const minorWords = new Set(['of', 'and', 'the', 'in', 'on', 'at', 'to', 'for', 'with']);
  return raw
    .split(' ')
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && minorWords.has(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseFile(filePath: string): ParsedFileCategory[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const categories: ParsedFileCategory[] = [];
  let currentCat: ParsedFileCategory | null = null;

  for (const line of lines) {
    if (line.startsWith('- ')) {
      currentCat = { name: line.slice(2).trim(), items: [], videos: [] };
      categories.push(currentCat);
    } else if (line.startsWith('\t- ') && currentCat) {
      const row = line.slice(3).trim();
      if (row.startsWith('http://') || row.startsWith('https://') || row.includes('youtube.com') || row.includes('youtu.be')) {
        const [urlPart, ...labelParts] = row.split(';');
        const url = urlPart.trim();
        const title = labelParts.join(';').trim() || url;
        currentCat.videos.push({ url, title });
      } else {
        const parts = row.split(',').map(s => s.trim()).filter(Boolean);
        currentCat.items.push(...parts);
      }
    }
  }

  return categories;
}

export function parseBasics(): { categories: BasicCategory[]; totalWords: number } {
  const basicsDir = path.join(projectRoot, 'data', 'basics');
  const parsedDir = path.join(projectRoot, 'data-parsed');

  const enCats = parseFile(path.join(basicsDir, 'en-basics.txt'));
  const frCats = parseFile(path.join(basicsDir, 'fr-basics.txt'));
  const esCats = parseFile(path.join(basicsDir, 'es-basics.txt'));
  const itCats = parseFile(path.join(basicsDir, 'it-basics.txt'));
  const nlCats = parseFile(path.join(basicsDir, 'nl-basics.txt'));

  if (!fs.existsSync(parsedDir)) {
    fs.mkdirSync(parsedDir, { recursive: true });
  }

  const resultCategories: BasicCategory[] = [];
  let totalWords = 0;

  for (let c = 0; c < enCats.length; c++) {
    const enCat = enCats[c];
    const frCat = frCats[c];
    const esCat = esCats[c];
    const itCat = itCats[c];
    const nlCat = nlCats[c];

    const catId = slugify(enCat.name);
    const catTitle = formatCategoryTitle(enCat.name);

    let esItems = [...(esCat?.items || [])];
    // For letter pronunciation, exclude 'eñe' so Spanish aligns with the standard 26 A-Z letters
    if (catId === 'letters' || catId.includes('pronunciation-of-letters')) {
      esItems = esItems.filter(item => item !== 'eñe');
    }

    const items: BasicItem[] = [];
    const itemCount = enCat.items.length;

    for (let i = 0; i < itemCount; i++) {
      items.push({
        id: `${catId}-${i + 1}`,
        en: enCat.items[i] || '',
        fr: frCat?.items[i] || '',
        es: esItems[i] || '',
        it: itCat?.items[i] || '',
        nl: nlCat?.items[i] || ''
      });
      totalWords++;
    }

    const videos: Record<string, CategoryVideo[]> = {};
    if (enCat?.videos?.length) videos.en = enCat.videos;
    if (frCat?.videos?.length) videos.fr = frCat.videos;
    if (esCat?.videos?.length) videos.es = esCat.videos;
    if (itCat?.videos?.length) videos.it = itCat.videos;
    if (nlCat?.videos?.length) videos.nl = nlCat.videos;

    resultCategories.push({
      id: catId,
      title: catTitle,
      items,
      ...(Object.keys(videos).length > 0 ? { videos, links: videos } : {})
    });
  }

  const outputPath = path.join(parsedDir, 'basics.json');
  fs.writeFileSync(outputPath, JSON.stringify(resultCategories, null, 2), 'utf8');

  return { categories: resultCategories, totalWords };
}
