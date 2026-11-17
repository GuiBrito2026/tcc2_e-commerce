import { defineConfig } from '@playwright/test';
const modes=['baseline','images','routes','interaction','combined'];
export default defineConfig({testDir:'tests',workers:1,use:{viewport:{width:1365,height:900}},projects:modes.map((name,i)=>({name,use:{baseURL:`http://127.0.0.1:${4173+i}`}})),webServer:modes.map((mode,i)=>({command:`npx vite preview --mode ${mode} --port ${4173+i} --strictPort`,url:`http://127.0.0.1:${4173+i}`,reuseExistingServer:false}))});
