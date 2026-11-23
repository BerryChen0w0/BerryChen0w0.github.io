import { execFileSync } from 'node:child_process';
import { posix } from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeMathjax from 'rehype-mathjax/svg';
import rehypeStringify from 'rehype-stringify';
import { localizedPath } from './locale.js';
import { visit } from 'unist-util-visit';

const files = import.meta.glob(
  ['/_posts/**/*.md', '/content/{notes,journal}/**/*.md'],
  { eager: true, query: '?raw', import: 'default' },
);
const images = import.meta.glob(
  '/content/{notes,journal}/**/*.{png,jpg,jpeg,webp,avif,gif,svg}',
  { eager: true, query: '?url', import: 'default' },
);

const parse = unified().use(remarkParse).use(remarkGfm).use(remarkMath);
const render = unified()
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeMathjax, { tex: { tags: 'ams' }, svg: { fontCache: 'none' } })
  .use(rehypeStringify, { allowDangerousHtml: true });

export const repo = 'https://github.com/BerryChen0w0/BerryChen0w0.github.io';

function pathSlug(value) {
  return value.normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
}

function textOf(node) {
  return node.value ?? node.children?.map(textOf).join('') ?? '';
}

function dateInShanghai(value) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(date);
}

function commitDates(path) {
  const history = execFileSync(
    'git', ['log', '--follow', '--format=%x1e%aI', '--name-status', '--', path],
    { encoding: 'utf8' },
  );
  // A rename with identical contents keeps the old dates.
  return history.split('\x1e').slice(1).flatMap((entry) => {
    const [date, ...changes] = entry.trim().split('\n');
    return changes.some((change) => /^(A|M|R(?!100\t))/.test(change)) ? [dateInShanghai(date)] : [];
  });
}

function legacyMarkdown(markdown) {
  const codeRanges = [];
  visit(parse.parse(markdown), (node) => {
    if (node.type === 'code' || node.type === 'inlineCode') codeRanges.push(node.position);
  });

  const adapt = (text) => text
    .replace(/\{\{\s*["']\/?(assets\/[^"']+)["']\s*\|\s*absolute_url\s*\}\}/g, '/$1')
    .replace(/\)\{:\s*width="\d+"\}/g, ')')
    .replaceAll(repo + '/raw/main/assets/img/', '/assets/img/')
    .replaceAll('/assets/img/计算理论/NP-图示.png', '/assets/img/计算理论/IP-图示.png')
    .replace(/\\overset\{\\?\$\}/g, '\\overset{\\unicode{x24}}')
    .replaceAll('\\eqref{eq:R1CS}', '$\\eqref{eq:R1CS}$');

  let result = '';
  let offset = 0;
  for (const { start, end } of codeRanges) {
    result += adapt(markdown.slice(offset, start.offset)) + markdown.slice(start.offset, end.offset);
    offset = end.offset;
  }
  return result + adapt(markdown.slice(offset));
}

function readPost([source, raw]) {
  const legacy = source.startsWith('/_posts/');
  const { data, content } = matter(raw);
  const name = posix.basename(source, '.md');
  const legacyName = name.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '');
  const relativePath = source.slice(1);
  const [, , sectionName] = source.split('/');
  const section = legacy ? (legacyName === 'berry-site-launched' ? 'journal' : 'notes') : sectionName;
  const tree = parse.parse(legacy ? legacyMarkdown(content) : content);
  const firstHeading = tree.children.find((node) => node.type === 'heading' && node.depth === 1);
  const heading = firstHeading && textOf(firstHeading).trim();
  if (heading && (!data.title || data.title === heading)) {
    tree.children.splice(tree.children.indexOf(firstHeading), 1);
  }

  const title = data.title || heading || name;
  const opening = tree.children.filter((node) => node.type === 'paragraph').slice(0, 3).map(textOf).join(' ');
  const contentLang = data.lang ?? (/\p{Script=Han}/u.test(title + opening) ? 'zh-CN' : 'en');
  const pathParts = source.split('/').slice(3, -1);
  const slug = legacy
    ? pathSlug(legacyName)
    : [section, ...pathParts, name].map((part) => pathSlug(part) || part.normalize('NFC')).join('/');
  const [lastChange, ...earlierChanges] = commitDates(relativePath);
  const date = dateInShanghai(data.date) ?? earlierChanges.at(-1) ?? lastChange;
  const updated = lastChange && date && lastChange > date && earlierChanges.length ? lastChange : undefined;
  return {
    title, slug, source, tree, section, date, updated,
    contentLang,
    url: '/posts/' + slug.split('/').map(encodeURIComponent).join('/') + '/',
    history: lastChange && repo + '/commits/main/' + relativePath.split('/').map(encodeURIComponent).join('/'),
    listed: !(legacy && legacyName === 'welcome-to-jekyll'),
  };
}

export const posts = Object.entries(files).map(readPost);
const bySource = new Map(posts.map((post) => [post.source.normalize('NFC'), post]));
if (new Set(posts.map(({ slug }) => slug)).size !== posts.length) {
  throw new Error('Two posts resolve to the same URL. Rename one of the files or its folder.');
}

export const published = posts.filter((post) => post.listed).sort((a, b) =>
  (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title, 'zh-CN'),
);

function resolveRelative(source, url) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url)) return;
  const [path] = url.split(/[?#]/, 1);
  try {
    return posix.resolve(posix.dirname(source), decodeURIComponent(path)).normalize('NFC');
  } catch {
    return undefined;
  }
}

const imageUrls = new Map(Object.entries(images).map(([source, url]) => [source.normalize('NFC'), url]));

export async function renderPost(post, lang) {
  const tree = structuredClone(post.tree);
  const usedIds = new Set();
  const headings = [];
  visit(tree, (node) => {
    if (node.type === 'image' || node.type === 'link' || node.type === 'definition') {
      const path = resolveRelative(post.source, node.url);
      const target = imageUrls.get(path) ?? bySource.get(path)?.url;
      if (target) node.url = target + (node.url.match(/[#?].*$/)?.[0] ?? '');
      if (node.type !== 'image' && /^\/(?:en\/)?(?:posts|notes|journal|about|research)\//.test(node.url)) {
        node.url = localizedPath(node.url, lang);
      }
    }
    if (node.type === 'heading') {
      const label = textOf(node);
      const base = pathSlug(label.toLowerCase()) || 'section';
      let id = base;
      for (let index = 2; usedIds.has(id); index++) id = base + '-' + index;
      usedIds.add(id);
      node.data = { hProperties: { id } };
      if (node.depth === 2 || node.depth === 3) headings.push({ id, label, depth: node.depth });
    }
  });
  const html = render.stringify(await render.run(tree));
  return { html, headings };
}
