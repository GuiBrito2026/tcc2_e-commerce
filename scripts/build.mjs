import { build } from 'vite';
for (const mode of ['baseline','images','routes','interaction','combined']) await build({mode});
