import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://berrychen0w0.github.io',
  trailingSlash: 'always',
  redirects: {
    '/archives': '/posts/',
    '/categories': '/notes/',
    '/tags': '/notes/',
    '/page2': '/posts/',
  },
});
