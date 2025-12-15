import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    const normalizeBase = (value: string) => {
      if (!value) return '/';
      const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
      return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
    };

    // Default to root in local builds. In GitHub Actions, derive the repo name so
    // project pages work without hardcoding the path.
    const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
    const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
    const explicitBase = env.VITE_BASE_PATH;
    const base =
      explicitBase
        ? normalizeBase(explicitBase)
        : mode === 'production' && isGitHubActions && repoName
          ? `/${repoName}/`
          : '/';
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
