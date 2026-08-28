// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const isGithubPages = process.env.GITHUB_PAGES === 'true';

// https://astro.build/config
export default defineConfig({
  site: isGithubPages ? 'https://imbimbo.github.io' : 'https://www.stylluscontabil.com.br',
  base: isGithubPages ? '/styllus' : undefined,
  integrations: [react()],
  output: 'static',
});
