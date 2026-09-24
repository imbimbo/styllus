// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import { loadEnv } from 'vite';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  '',
);

// Project Pages preview (imbimbo.github.io/styllus) needs base `/styllus`.
// Custom domain (www.stylluscontabil.com.br) must use base `/`.
const useGithubProjectPath =
  process.env.GITHUB_PAGES === 'true' && process.env.CUSTOM_DOMAIN !== 'true';

// https://astro.build/config
export default defineConfig({
  site: useGithubProjectPath
    ? 'https://imbimbo.github.io'
    : 'https://www.stylluscontabil.com.br',
  base: useGithubProjectPath ? '/styllus' : undefined,
  integrations: [
    react(),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
      apiVersion: '2026-09-21',
    }),
  ],
  output: 'static',
});
