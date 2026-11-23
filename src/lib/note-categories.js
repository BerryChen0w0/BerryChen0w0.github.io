import { published } from './content.js';

const legacyFolders = {
  '计算模型（电路）': ['零知识证明', '电路与约束'],
  '计算理论': ['计算理论'],
  Linux: ['开发工具', 'Linux'],
  'go语言': ['开发工具', 'Go'],
  'jekyll使用': ['开发工具', '建站'],
};

function foldersFor(source) {
  const [, root, ...parts] = source.normalize('NFC').split('/');
  const filename = parts.pop();

  if (root !== '_posts') return parts.slice(1);
  if (!parts.length) {
    return /学习资料|具体计算相关/.test(filename) ? ['零知识证明'] : [];
  }
  return [...(legacyFolders[parts[0]] ?? [parts[0]]), ...parts.slice(1)];
}

function category(name, parentPath = []) {
  const path = name ? [...parentPath, name] : [];
  return {
    name: name || '全部笔记',
    path,
    url: '/notes/' + path.map(encodeURIComponent).map((part) => part + '/').join(''),
    children: new Map(),
    posts: [],
  };
}

export const notes = category();
export const categories = [];

for (const post of published.filter(({ section }) => section === 'notes')) {
  let current = notes;
  current.posts.push(post);
  for (const folder of foldersFor(post.source)) {
    if (!current.children.has(folder)) {
      const child = category(folder, current.path);
      current.children.set(folder, child);
      categories.push(child);
    }
    current = current.children.get(folder);
    current.posts.push(post);
  }
}
