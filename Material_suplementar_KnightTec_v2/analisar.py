from pathlib import Path
import json,csv,sys,statistics as st
from collections import Counter
root=Path(sys.argv[1]); out=Path(sys.argv[2]);out.mkdir(exist_ok=True,parents=True)
modes=['baseline','images','routes','interaction','combined']; labels=['Baseline','Imagens','Rotas','Interação','Combinada']; profiles=['desktop','mobile4g','mobile3g']; titles=['Desktop','Mobile 4G','Mobile 3G']
metrics=['nota','FCP_s','LCP_s','TBT_ms','CLS','SI_s']; rows=[]
def csvout(name,fields,rows):
 with (out/name).open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fields);w.writeheader();w.writerows(rows)
for path in sorted(root.glob('*_*_*.json')):
 p,m,r=path.stem.split('_');j=json.loads(path.read_text(encoding='utf-8-sig'));a=j['audits'];s=j['configSettings']
 assert not j.get('runtimeError') and j['categories']['performance']['score'] is not None and j['finalDisplayedUrl']==f'http://127.0.0.1:{4173+modes.index(m)}/'
 v=[round(j['categories']['performance']['score']*100)]+[a[k]['numericValue']/d for k,d in zip(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'],[1000,1000,1,1,1000])]
 net=a['network-requests']['details']['items']; imgs=[x['url'].split('/')[-1] for x in net if x['resourceType']=='Image']
 lcp=a.get('largest-contentful-paint-element',{}).get('details',{}).get('items',[]);node=(lcp[0]['items'][0]['node'] if lcp and lcp[0].get('items') else {})
 shift=a['layout-shifts'].get('details',{}).get('items',[])
 rows.append(dict(profile=p,mode=m,round=int(r),utc=j['fetchTime'],**dict(zip(metrics,v)),lcp=node.get('nodeLabel',''),bounds=str(node.get('boundingRect','')),shifts='|'.join(x.get('node',{}).get('selector','') for x in shift),images='|'.join(imgs),bytes=sum(x.get('transferSize',0) for x in net),warnings=str(j['runWarnings']),viewport=str(s['screenEmulation']),agent=j['environment']['networkUserAgent']))
rows.sort(key=lambda x:x['utc']);csvout('execucoes.csv',rows[0].keys(),rows)
summary=[]
for p in profiles:
 for m in modes:
  sub=[x for x in rows if x['mode']==m and x['profile']==p]
  for k in metrics:
   a=[x[k] for x in sub];b=[x[k] for x in sub if x['round']<=6]; q=st.quantiles(a,n=4,method='inclusive')
   summary.append(dict(profile=p,mode=m,metric=k,n=len(a),median97=st.median(a),median90=st.median(b),mean=st.mean(a),sd=st.stdev(a),min=min(a),max=max(a),q1=q[0],q3=q[2]))
csvout('estatisticas.csv',summary[0].keys(),summary)
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
for no,keys in [(9,metrics[:3]),(10,metrics[3:])]:
 fig,axes=plt.subplots(3,3,figsize=(10,6.4),layout='constrained')
 for ri,k in enumerate(keys):
  vmax=max(x['median97'] for x in summary if x['metric']==k)
  for pi,p in enumerate(profiles):
   ax=axes[ri,pi];vs=[next(x['median97'] for x in summary if (x['profile'],x['mode'],x['metric'])==(p,m,k)) for m in modes]
   ax.barh(labels,vs,color='#355e7a');ax.invert_yaxis();ax.set_xlim(0,vmax*1.42 or 1)
   for i,v in enumerate(vs):ax.text(v+vmax*.02,i,f'{v:.3f}'.rstrip('0').rstrip('.').replace('.',','),va='center',fontsize=9)
   ax.set_title(titles[pi]+' · '+dict(nota='Nota',FCP_s='FCP (s)',LCP_s='LCP (s)',TBT_ms='TBT (ms)',CLS='CLS',SI_s='SI (s)')[k],fontsize=11);ax.tick_params(axis='y',labelsize=9);ax.set_xticks([]);ax.spines[:].set_visible(False)
 fig.savefig(out/f'figura{no}.png',dpi=200);plt.close(fig)
