import lighthouse from 'lighthouse';
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';

const output = path.resolve(process.argv[2] || 'resultados-lighthouse');
const modes = ['baseline','images','routes','interaction','combined'];
const profiles = [
  {id:'desktop', preset:'desktop', method:'provided'},
  {id:'mobile4g', preset:'default', method:'simulate', throttle:{rttMs:150,throughputKbps:1638.4,cpuSlowdownMultiplier:4}},
  {id:'mobile3g', preset:'default', method:'simulate', throttle:{rttMs:400,throughputKbps:400,cpuSlowdownMultiplier:6}}
];
await fs.mkdir(output,{recursive:true});
const fingerprint = {};
for(const [index,mode] of modes.entries()){
  const url='http://127.0.0.1:'+(4173+index)+'/';
  const html=await (await fetch(url)).text();
  const src=html.match(/<script[^>]*src="([^"]+\.js)"/)?.[1];
  if(!src)throw Error('Entrada JavaScript ausente: '+url);
  const bytes=Buffer.from(await (await fetch(new URL(src,url))).arrayBuffer());
  const local=await fs.readFile('dist/'+mode+src);
  if(!bytes.equals(local))throw Error('A versão em '+url+' difere da build '+mode);
  fingerprint[mode]=createHash('sha256').update(bytes).digest('hex');
}
const environment={platform:os.version(),cpu:os.cpus()[0].model,ram:os.totalmem(),node:process.version,profiles,fingerprint};
await fs.writeFile(path.join(output,'ambiente.json'),JSON.stringify(environment,null,2));
for(let round=1;round<=10;round++){
  for(let pi=0;pi<3;pi++){
    const profile=profiles[(pi+round-1)%3];
    for(let vi=0;vi<5;vi++){
      const i=(vi+round-1)%5;
      const url='http://127.0.0.1:'+(4173+i)+'/';
      const file=path.join(output,[profile.id,modes[i],String(round).padStart(2,'0')].join('_')+'.json');
      try {await fs.access(file);continue;}catch{}
      const chrome=await chromium.launch({channel:'chrome',args:['--remote-debugging-port=19339']});
      try{
        const settings={onlyCategories:['performance'],throttlingMethod:profile.method,disableStorageReset:false};
        if(profile.throttle)settings.throttling=profile.throttle;
        const config=profile.preset==='desktop' ? structuredClone((await import('lighthouse/core/config/desktop-config.js')).default) : {extends:'lighthouse:default'};
        config.settings={...config.settings,...settings};
        const {lhr}=await lighthouse(url,{port:19339,output:'json',logLevel:'error'},config);
        if(lhr.runtimeError||lhr.finalDisplayedUrl!==url||lhr.categories.performance.score===null)throw Error(JSON.stringify(lhr.runtimeError||lhr.finalDisplayedUrl));
        await fs.writeFile(file+'.tmp',JSON.stringify(lhr));
        await fs.rename(file+'.tmp',file);
        console.log(round,profile.id,modes[i],lhr.categories.performance.score);
      }finally{await chrome.close();}
    }
  }
}
