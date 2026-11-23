const copy = {
  'zh-CN': {
    home: '首页', notes: '笔记', journal: '随笔', research: '研究', about: '关于',
    skip: '跳到正文', navigation: '主导航', description: 'Berry Chen 的个人主页，记录学习笔记、随笔和一些小事。',
    allPosts: '全部文章', empty: '还没有公开的文章。', contents: '目录', articleContents: '文章目录',
    updated: '更新于', history: '文件历史',
    notesDescription: '零知识证明、计算理论和开发时的学习记录。',
    allNotes: '全部笔记', topics: '按主题浏览', recentUpdates: '最近更新优先',
    journalDescription: '生活里的小事和偶尔想写下来的东西。',
  },
  en: {
    home: 'Home', notes: 'Notes', journal: 'Musings', research: 'Research', about: 'About',
    skip: 'Skip to content', navigation: 'Main navigation', description: 'Berry Chen’s personal site for study notes and personal writing.',
    allPosts: 'All posts', empty: 'No published posts yet.', contents: 'Contents', articleContents: 'Table of contents',
    updated: 'Updated', history: 'File history',
    notesDescription: 'Study notes on zero-knowledge proofs, computational theory, and software development.',
    allNotes: 'All notes', topics: 'Browse by topic', recentUpdates: 'Recently updated first',
    journalDescription: 'Small moments and things I want to write down.',
  },
};

export function language(path) {
  const lang = path.startsWith('/en/') || path === '/en' ? 'en' : 'zh-CN';
  return { lang, english: lang === 'en', t: copy[lang] };
}

export function localizedPath(path, lang) {
  const unprefixed = path.replace(/^\/en(?=\/|$)/, '') || '/';
  return lang === 'en' ? '/en' + unprefixed : unprefixed;
}

const categoryTranslations = new Map([
  ['零知识证明', 'Zero-knowledge proofs'], ['电路与约束', 'Circuits and constraints'],
  ['计算理论', 'Computational theory'], ['开发工具', 'Developer tools'], ['建站', 'Site development'],
]);

export function categoryLabel(name, lang) {
  return lang === 'en' ? categoryTranslations.get(name) ?? name : name;
}
