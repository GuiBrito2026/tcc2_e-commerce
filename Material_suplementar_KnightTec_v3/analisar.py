from pathlib import Path
import json,csv,sys,statistics as st
import math
import re
root=Path(sys.argv[1]); out=Path(sys.argv[2])
modes=['baseline','images','routes','interaction','combined']; labels=['Baseline','Imagens','Rotas','Interação','Combinada']; profiles=['desktop','mobile4g','mobile3g']; titles=['Desktop','Mobile 4G','Mobile 3G']
metrics=['nota','FCP_s','LCP_s','TBT_ms','CLS','SI_s']; rows=[]
def csvout(name,fields,rows):
 with (out/name).open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fields);w.writeheader();w.writerows(rows)
# Configuração prescrita pelo coletor e padrões efetivos do Lighthouse 12.8.2.
DESKTOP_SCREEN = dict(mobile=False, width=1350, height=940, deviceScaleFactor=1, disabled=False)
MOBILE_SCREEN = dict(mobile=True, width=412, height=823, deviceScaleFactor=1.75, disabled=False)
DESKTOP_NETWORK = dict(requestLatencyMs=0, downloadThroughputKbps=0, uploadThroughputKbps=0)
MOBILE_NETWORK = dict(requestLatencyMs=562.5, downloadThroughputKbps=1474.56, uploadThroughputKbps=675)
EXPECTED_PROFILES = {
    'desktop': dict(throttlingMethod='provided', formFactor='desktop', screenEmulation=DESKTOP_SCREEN,
                    throttling=dict(DESKTOP_NETWORK, rttMs=40, throughputKbps=10240, cpuSlowdownMultiplier=1)),
    'mobile4g': dict(throttlingMethod='simulate', formFactor='mobile', screenEmulation=MOBILE_SCREEN,
                     throttling=dict(MOBILE_NETWORK, rttMs=150, throughputKbps=1638.4, cpuSlowdownMultiplier=4)),
    'mobile3g': dict(throttlingMethod='simulate', formFactor='mobile', screenEmulation=MOBILE_SCREEN,
                     throttling=dict(MOBILE_NETWORK, rttMs=400, throughputKbps=400, cpuSlowdownMultiplier=6)),
}
AUDIT_FIELDS = [
    ('first-contentful-paint', 1000), ('largest-contentful-paint', 1000),
    ('total-blocking-time', 1), ('cumulative-layout-shift', 1), ('speed-index', 1000),
]

def check_fields(actual, expected, prefix):
    if not isinstance(actual, dict):
        raise ValueError(f'{prefix}: objeto ausente ou inválido')
    for field, target in expected.items():
        value = actual.get(field)
        location = f'{prefix}.{field}'
        if isinstance(target, dict):
            check_fields(value, target, location)
            continue
        if type(target) in (int, float):
            matches = type(value) in (int, float) and math.isclose(value, target, rel_tol=0, abs_tol=1e-9)
        else:
            matches = type(value) is type(target) and value == target
        if not matches:
            raise ValueError(f'{location}: esperado {target!r}, encontrado {value!r}')

def finite(value, field):
    if type(value) not in (int, float) or not math.isfinite(value):
        raise ValueError(f'{field}: esperado número finito, encontrado {value!r}')
    return value

def validate_report(path, seen):
    match = re.fullmatch(r'([^_]+)_([^_]+)_([0-9]+)', path.stem)
    if not match:
        raise ValueError('nome esperado: perfil_versao_rodada.json')
    profile, mode, number = match.groups()
    round_number = int(number)
    if profile not in EXPECTED_PROFILES or mode not in modes or not 1 <= round_number <= 10:
        raise ValueError('perfil, versão ou rodada fora do protocolo')
    key = (profile, mode, round_number)
    if key in seen:
        raise ValueError(f'chave perfil–versão–rodada duplicada: {key}')
    report = json.loads(path.read_text(encoding='utf-8-sig'))
    if report.get('runtimeError') is not None:
        raise ValueError('runtimeError presente')
    expected_url = f'http://127.0.0.1:{4173 + modes.index(mode)}/'
    if report.get('finalDisplayedUrl') != expected_url:
        raise ValueError(f'URL final esperada: {expected_url}')
    check_fields(report.get('configSettings'), EXPECTED_PROFILES[profile], 'configSettings')
    score = finite(report['categories']['performance']['score'], 'categories.performance.score')
    if not 0 <= score <= 1:
        raise ValueError('nota Lighthouse fora do intervalo de 0 a 1')
    audits = report['audits']
    values = [round(score * 100)] + [
        finite(audits[audit]['numericValue'], f'{audit}.numericValue') / divisor
        for audit, divisor in AUDIT_FIELDS
    ]
    seen.add(key)
    return key, report, values

seen = set()
for path in sorted(root.glob('*_*_*.json')):
 try:
  (p,m,r),j,v=validate_report(path,seen)
 except (ValueError, KeyError, TypeError, OSError, OverflowError) as error:
  raise SystemExit(f'{path.name}: {error}') from None
 a=j['audits'];s=j['configSettings']
 net=a['network-requests']['details']['items']; imgs=[x['url'].split('/')[-1] for x in net if x['resourceType']=='Image']
 lcp=a.get('largest-contentful-paint-element',{}).get('details',{}).get('items',[]);node=(lcp[0]['items'][0]['node'] if lcp and lcp[0].get('items') else {})
 shift=a['layout-shifts'].get('details',{}).get('items',[])
 rows.append(dict(profile=p,mode=m,round=int(r),utc=j['fetchTime'],**dict(zip(metrics,v)),lcp=node.get('nodeLabel',''),bounds=str(node.get('boundingRect','')),shifts='|'.join(x.get('node',{}).get('selector','') for x in shift),images='|'.join(imgs),bytes=sum(x.get('transferSize',0) for x in net),warnings=str(j['runWarnings']),viewport=str(s['screenEmulation']),agent=j['environment']['networkUserAgent']))
if not rows:
 raise SystemExit(f'Nenhum relatório encontrado em {root}')
rows.sort(key=lambda x:x['utc'])
summary=[]
for p in profiles:
 for m in modes:
  sub=[x for x in rows if x['mode']==m and x['profile']==p]
  for k in metrics:
   a=[x[k] for x in sub];b=[x[k] for x in sub if x['round']<=6]; q=st.quantiles(a,n=4,method='inclusive')
   summary.append(dict(profile=p,mode=m,metric=k,n=len(a),median97=st.median(a),median90=st.median(b),mean=st.mean(a),sd=st.stdev(a),min=min(a),max=max(a),q1=q[0],q3=q[2]))
out.mkdir(exist_ok=True,parents=True)
csvout('execucoes.csv',rows[0].keys(),rows)
csvout('estatisticas.csv',summary[0].keys(),summary)
print(f'{len(rows)} relatórios validados; {len(summary)} resumos calculados.')
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
