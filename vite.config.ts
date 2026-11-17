import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig(({ mode }) => {
  if (!['baseline','images','routes','interaction','combined'].includes(mode)) throw new Error(`Modo experimental inválido: ${mode}`);
  const routeLazy = mode === 'routes' || mode === 'combined';
  const interactionLazy = mode === 'interaction' || mode === 'combined';
  return { plugins:[react()], resolve:{alias:{'@routes':fileURLToPath(new URL(`./src/experiment/routes.${routeLazy?'lazy':'eager'}.ts`,import.meta.url)), '@interactions':fileURLToPath(new URL(`./src/experiment/interactions.${interactionLazy?'lazy':'eager'}.ts`,import.meta.url))}}, define:{__LAZY_IMAGES__:JSON.stringify(mode==='images'||mode==='combined')}, build:{outDir:`dist/${mode}`,emptyOutDir:true,target:'es2022',cssCodeSplit:false,modulePreload:false,manifest:true}, server:{host:'127.0.0.1'}, preview:{host:'127.0.0.1'}};
});
