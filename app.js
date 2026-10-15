/* Novea — tahap 1: inti novel (novel, bab, tulis, baca). Penyimpanan: IndexedDB. */
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
/* Ikon: SVG sendiri (tanpa CDN). Ukuran diatur lewat CSS (--ic), warna ikut teks (currentColor). */
const P=(w,d,extra='stroke-linecap="round" stroke-linejoin="round"')=>`<path stroke="currentColor" ${extra} stroke-width="${w}" d="${d}"/>`;
const ICONS={
  'chevron-left':P(2,'m15 19-7-7 7-7'),
  'chevron-right':P(2.1,'m9 5 7 7-7 7'),
  'three-dots':P(2,'M6 12h.01m6 0h.01m5.99 0h.01','stroke-linecap="round"'),
  'gear':P(2,'M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z')+P(2,'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'),
  'plus-lg':P(2.5,'M5 12h14m-7 7V5'),
  'x-lg':P(2.5,'M6 18 17.94 6M18 18 6.06 6'),
  'camera':P(2.5,'M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z','stroke-linejoin="round"')+P(2.5,'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z','stroke-linejoin="round"'),
  'feather':`<path fill="currentColor" d="M103.616,221.205c37.822-7.288,112.142-24.705,143.441-53.651c-2.918-4.087-40.701-23.574-40.701-23.574s44.988,0,63.195,0 C300.611,139.707,311.942,0,311.942,0S182.788,70.085,148.508,113.826c-34.274,43.754-67.88,111.396-67.88,111.396l0.019-0.006 c-42.462,45.148-75.053,81.132-75.053,81.132l35.727-18.991L103.616,221.205z M296.556,23.407 c-1.42,11.645-3.432,26.247-6.144,41.087c-10.077,55.271-20.669,65.226-22.635,66.64h-61.421c-5.932,0-11.099,4.055-12.487,9.814 c-1.395,5.765,1.324,11.735,6.594,14.454c8.021,4.145,16.935,8.927,24.094,12.95c-28.13,17.34-73.054,29.473-105.612,36.575 l162.85-172.914C287.141,28.863,292.134,25.952,296.556,23.407z M158.623,121.756c18.529-23.644,67.932-56.318,106.904-80.001 c-29.525,27.044-69.127,64.178-106.756,102.232c-14.717,14.878-29.731,30.373-44.332,45.631 C126.714,168.1,142.653,142.142,158.623,121.756z M179.241,270.737c39.287,4.357,77.739,13.361,114.97,25.63 c-19.261-3.618-38.477-7.127-57.835-9.589c-19.3-2.731-38.664-4.827-57.976-6.048c-16.748-0.88-33.477-1.247-50.001,0.019 c3.528,0.63,7.07,1.253,10.604,1.896c9.621,1.793,19.293,3.573,29.056,5.842c4.904,1.195,9.743,2.359,14.955,4.389 c1.311,0.533,2.654,1.112,4.177,2.012c0.771,0.469,1.594,0.99,2.558,1.889c0.88,0.932,2.32,2.23,2.815,5.264 c0.411,3.162-1.273,5.598-2.269,6.613c-1.099,1.138-1.999,1.671-2.815,2.172l-1.285,0.675l-1.003,0.456l-2.095,0.803 c-10.829,3.419-20.617,3.766-30.65,4.415c-9.949,0.488-19.827,0.418-29.673,0.148c-39.384-1.048-78.401-5.206-117.174-10.977 c19.608,0.27,39.146,1.003,58.696,1.015c19.531,0.296,39.056,0.366,58.491-0.032c9.711-0.257,19.396-0.675,28.972-1.375 c7.417-0.643,15.135-1.42,21.909-3.078c-2.731-0.79-5.566-1.517-8.438-2.172c-9.312-2.069-18.901-3.74-28.522-5.437 c-9.64-1.819-19.21-3.445-29.184-5.945c-2.629-0.765-4.839-1.17-8.451-3.027c-0.54-0.334-1.041-0.611-1.857-1.33 c-0.636-0.688-2.237-1.864-2.487-5.264c-0.058-1.62,0.578-3.117,1.163-3.965c0.572-0.868,1.189-1.414,1.575-1.742 c0.938-0.733,1.485-0.97,2.069-1.273c2.05-0.919,3.368-1.163,4.801-1.497c5.444-1.105,10.257-1.594,15.341-1.999 C139.658,267.742,159.613,268.494,179.241,270.737z"/>`,
  'list':P(2.1,'M5 7h14M5 12h14M5 17h14','stroke-linecap="round"'),
  'sun':P(2.5,'M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'),
  'moon':P(2.5,'M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z'),
  'arrow-counterclockwise':P(2.1,'M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4'),
  'arrow-clockwise':P(2.1,'M21 9H8a5 5 0 0 0 0 10h9m4-10-4-4m4 4-4 4'),
  'arrow-up':P(2.1,'M12 6v13m0-13 4 4m-4-4-4 4'),
  'arrow-down':P(1.5,'M12 19V5m0 14-4-4m4 4 4-4'),
  'align-left':P(2,'M4 6h16M4 10h10M4 14h16M4 18h10'),
  'align-center':P(2,'M4 6h16M7 10h10M4 14h16M7 18h10'),
  'align-right':P(2,'M4 6h16M10 10h10M4 14h16M10 18h10'),
  'align-justify':P(2,'M4 6h16M4 10h16M4 14h16M4 18h16'),
  'indent':P(2,'M4 6h16M12 10h8M12 14h8M4 18h16M4 9l3 3-3 3'),
  'outdent':P(2,'M4 6h16M12 10h8M12 14h8M4 18h16M7 9l-3 3 3 3'),
  'note':P(2,'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6'),
  'quote':P(2,'M5 5v14M10 8h9M10 12h9M10 16h6'),
  'minimize':P(2.5,'M5 9h4m0 0V5m0 4L4 4m15 5h-4m0 0V5m0 4 5-5M5 15h4m0 0v4m0-4-5 5m15-5h-4m0 0v4m0-4 5 5'),
  'expand':P(2.5,'M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5')
};
const ic=n=>`<svg class="ico" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="${n==='feather'?'0 0 317.536 317.536':'0 0 24 24'}" fill="none">${ICONS[n]||''}</svg>`;
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const words=t=>{t=(t||'').replace(/^[ \t]*>[ \t]?/gm,'').trim();return t?t.split(/\s+/).length:0};
const plural=(n,w)=>`${n} ${w}`;
/* Kolom satu baris memakai <textarea> supaya keyboard Android tidak menampilkan saran riwayat/isi otomatis di atasnya. */
const growTA=t=>{if(!t.scrollHeight)return;t.style.height='auto';t.style.height=t.scrollHeight+'px';};
const slEnter=t=>{const k=t.dataset.click&&document.getElementById(t.dataset.click),n=t.dataset.next&&document.getElementById(t.dataset.next);if(k)k.click();else if(n)n.focus();else t.blur();};
document.addEventListener('input',e=>{const t=e.target;if(!t.classList||!t.classList.contains('sl'))return;
  if(/[\r\n]/.test(t.value)){const p=t.selectionStart;t.value=t.value.replace(/[\r\n]+/g,' ');try{t.setSelectionRange(p,p);}catch(_){}}
  if(t.classList.contains('grow'))growTA(t);},true);
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList&&e.target.classList.contains('sl')){e.preventDefault();slEnter(e.target);}},true);
document.addEventListener('beforeinput',e=>{if(e.target.classList&&e.target.classList.contains('sl')&&/^insert(LineBreak|Paragraph)$/.test(e.inputType)){e.preventDefault();slEnter(e.target);}},true);
new MutationObserver(()=>document.querySelectorAll('.sl.grow').forEach(growTA)).observe(document.body,{childList:true,subtree:true});
/* ---------- Penulisan: penanda ringan di teks biasa (**tebal**, *miring*, __garis bawah__, "> " kutipan, tab di awal baris = jorokan paragraf) ---------- */
const mdInline=s=>esc(s).replace(/\*\*\*(.+?)\*\*\*/g,'<b><i>$1</i></b>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/__(.+?)__/g,'<u>$1</u>').replace(/\*(.+?)\*/g,'<i>$1</i>');
function mdParas(t){
  return (t||'').split('\n').map(l=>{
    if(!l.trim())return '';
    const tabs=(l.match(/^\t+/)||[''])[0].length;let b=l.replace(/^\t+/,'').trim();
    const q=/^>\s?/.test(b);if(q)b=b.replace(/^>\s?/,'');
    const st=tabs?` style="text-indent:${tabs*1.5}em"`:'';
    return q?`<blockquote${st}>${mdInline(b)}</blockquote>`:`<p${st}>${mdInline(b)}</p>`;
  }).join('');
}
const autoIndent=()=>ls.get('novea_autoindent')===1;
/* Bar yang menempel di atas keyboard Android. */
function followKb(bar){
  const vv=window.visualViewport;if(!vv)return()=>{};
  const f=()=>{bar.style.bottom=Math.max(0,innerHeight-vv.height-vv.offsetTop)+'px';};
  vv.addEventListener('resize',f);vv.addEventListener('scroll',f);f();
  return()=>{vv.removeEventListener('resize',f);vv.removeEventListener('scroll',f);};
}
/* Bar alat untuk kolom tulis biasa (bab dan sinopsis). Tab = jorokan baris pertama paragraf; baris lanjutan karena teks turun tidak ikut. */
function mdBar(ta,opts={}){
  const bar=document.createElement('div');bar.className='nfmt';
  bar.innerHTML=`<button data-m="b" aria-label="Tebal"><b>B</b></button><button data-m="i" aria-label="Miring"><i>I</i></button><button data-m="u" aria-label="Garis bawah"><u>U</u></button><span class="sep"></span><button data-m="q" aria-label="Kutipan">${ic('quote')}</button><button data-m="sq" aria-label="Tanda petik tunggal">‘ ’</button><button data-m="dq" aria-label="Tanda petik ganda">“ ”</button><button data-m="en" aria-label="Tanda en dash">–</button><button data-m="em" aria-label="Tanda em dash">—</button><span class="sep"></span><button data-m="t+" aria-label="Tab: jorokan awal paragraf">${ic('indent')}</button><button data-m="t-" aria-label="Kurangi jorokan awal paragraf">${ic('outdent')}</button>${opts.notes?`<span class="sep"></span><button data-m="notes" aria-label="Catatan novel ini">${ic('note')}</button>`:''}`;
  bar.addEventListener('mousedown',e=>{if(e.target.closest('button'))e.preventDefault();});
  const put=(v,s,e)=>{ta.focus({preventScroll:true});ta.value=v;ta.setSelectionRange(s,e);ta.dispatchEvent(new Event('input',{bubbles:true}));if(opts.snap)opts.snap();};
  const S=()=>({v:ta.value,s:ta.selectionStart,e:ta.selectionEnd});
  const wrap=(l,r,toggle)=>{const {v,s,e}=S(),pre=v.slice(0,s),mid=v.slice(s,e),post=v.slice(e);
    if(toggle){const ok=l==='*'?(/(^|[^*])\*$/.test(pre)&&/^\*([^*]|$)/.test(post)):(pre.endsWith(l)&&post.startsWith(r));
      if(ok){put(pre.slice(0,-l.length)+mid+post.slice(r.length),s-l.length,e-l.length);return;}}
    put(pre+l+mid+r+post,s+l.length,e+l.length);};
  const lineRange=()=>{const {v,s,e}=S(),a=v.lastIndexOf('\n',s-1)+1,ze=(e>s&&v[e-1]==='\n')?e-1:e;let z=v.indexOf('\n',ze);if(z<0)z=v.length;return {v,s,e,a,z};};
  const mapLines=(fn,pre)=>{const {v,s,e,a,z}=lineRange(),lines=v.slice(a,z).split('\n'),ctx=pre?pre(lines):null,res=[];let pos=a;
    lines.forEach(l=>{res.push({ls:pos,old:l,r:fn(l,lines.length,ctx)});pos+=l.length+1;});
    const mp=p=>{let sh=0;for(const x of res){if(!x.r)continue;const at=x.ls+x.r.o,d=x.r.d;
      if(d>0){if(p>=at)sh+=d;}else{const k=-d;if(p>=at+k)sh+=d;else if(p>at)return at+sh;}}return p+sh;};
    put(v.slice(0,a)+res.map(x=>x.r?x.r.t:x.old).join('\n')+v.slice(z),mp(s),mp(e));};
  const quote=()=>mapLines((l,n,all)=>{
    if(all){const m=l.match(/^(\t*)>( ?)/);return m?{t:l.slice(0,m[1].length)+l.slice(m[0].length),o:m[1].length,d:-(m[0].length-m[1].length)}:null;}
    if(!l.trim()&&n>1)return null;const o=l.match(/^\t*/)[0].length;return {t:l.slice(0,o)+'> '+l.slice(o),o,d:2};
  },ls=>{const f=ls.filter(x=>x.trim());return f.length>0&&f.every(x=>/^\t*>\s?/.test(x));});
  const tab=d=>mapLines((l,n)=>{
    if(d>0){if(!l.trim()&&n>1)return null;if((l.match(/^\t*/)[0].length)>=4)return null;return {t:'\t'+l,o:0,d:1};}
    return l.startsWith('\t')?{t:l.slice(1),o:0,d:-1}:null;});
  const ins=ch=>{const {v,s,e}=S();put(v.slice(0,s)+ch+v.slice(e),s+ch.length,s+ch.length);};
  const act={b:()=>wrap('**','**',true),i:()=>wrap('*','*',true),u:()=>wrap('__','__',true),q:quote,sq:()=>wrap('‘','’'),dq:()=>wrap('“','”'),en:()=>ins('–'),em:()=>ins('—'),'t+':()=>tab(1),'t-':()=>tab(-1),notes:()=>opts.onNotes&&opts.onNotes()};
  bar.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&act[b.dataset.m])act[b.dataset.m]();});
  return bar;
}
/* Pilih genre: sheet berisi kotak centang, pencarian, dan tambah genre baru. */
function genreSheet(selected,onDone){
  let sel=[...selected],custom=ls.get('novea_genres')||[];
  const same=(a,b)=>a.toLowerCase()===b.toLowerCase(),ea=s=>esc(s).replace(/"/g,'&quot;');
  const all=()=>[...DEF_GENRES,...custom.filter(c=>!DEF_GENRES.some(d=>same(d,c)))];
  const sc=document.createElement('div'),sh=document.createElement('div');sc.className='scrim s2';sh.className='sheet s2';
  sh.innerHTML=`<h3>Pilih genre</h3><textarea class="search sl" id="gq" rows="1" wrap="off" enterkeyhint="done" data-click="gEnter" placeholder="Cari atau tambah genre…" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false"></textarea><div class="glist" id="gl"></div><p class="dline" id="gInfo"></p><button type="button" id="gEnter" hidden></button><button type="button" class="btn main" id="gDone">Selesai</button>`;
  document.body.append(sc,sh);requestAnimationFrame(()=>{sc.classList.add('on');sh.classList.add('on');});
  const cap=s=>s.replace(/,/g,' ').replace(/\s+/g,' ').trim().slice(0,24);
  const info=()=>{$('gInfo').textContent=sel.length?sel.length+' genre dipilih':'Belum ada genre dipilih';};
  const draw=()=>{
    const raw=cap($('gq').value),q=raw.toLowerCase(),list=all().filter(g=>!q||g.toLowerCase().includes(q)),exact=all().some(g=>same(g,raw));
    $('gl').innerHTML=(raw&&!exact?`<button type="button" class="gnew" id="gNew">+ Tambah “${esc(raw)}”</button>`:'')
      +list.map(g=>{const cu=custom.some(c=>same(c,g))&&!DEF_GENRES.some(d=>same(d,g));
        return `<div class="gr"><label class="gck"><input type="checkbox" data-g="${ea(g)}"${sel.some(x=>same(x,g))?' checked':''} autocomplete="off"><i></i><span>${esc(g)}</span></label>${cu?`<button type="button" class="gdel" data-x="${ea(g)}" aria-label="Hapus genre ${ea(g)} dari daftar">${ic('x-lg')}</button>`:''}</div>`;}).join('')
      +(!list.length&&!raw?'<p class="dline">Belum ada genre.</p>':'');
    info();
  };
  const add=()=>{const raw=cap($('gq').value);if(!raw)return false;const ex=all().find(g=>same(g,raw));
    if(ex){if(!sel.some(x=>same(x,ex)))sel.push(ex);}else{custom.push(raw);ls.set('novea_genres',custom);sel.push(raw);}
    $('gq').value='';draw();return true;};
  const close=()=>{sc.classList.remove('on');sh.classList.remove('on');setTimeout(()=>{sc.remove();sh.remove();},220);onDone(sel);};
  $('gl').onclick=e=>{const d=e.target.closest('.gdel');
    if(d){const g=d.dataset.x;custom=custom.filter(c=>!same(c,g));ls.set('novea_genres',custom);sel=sel.filter(c=>!same(c,g));draw();return;}
    if(e.target.closest('#gNew'))add();};
  $('gl').onchange=e=>{const c=e.target.closest('input[data-g]');if(!c)return;const g=c.dataset.g,i=sel.findIndex(x=>same(x,g));
    if(c.checked&&i<0)sel.push(g);if(!c.checked&&i>=0)sel.splice(i,1);info();};
  $('gq').oninput=draw;$('gEnter').onclick=()=>{if(!add())$('gq').blur();};
  $('gDone').onclick=close;sc.onclick=close;
  draw();
}
function indentSheet(){
  const cur=autoIndent()?'auto':'man';
  openSheet(`<h3>Indentasi paragraf</h3><p>Yang menjorok hanya baris pertama paragraf. Baris lanjutan karena teks turun (tanpa Enter) tidak ikut menjorok.</p>${[['man','Manual','Menjorok hanya kalau Anda menekan tombol Tab di bar penulisan.'],['auto','Otomatis','Setiap paragraf baru (setelah Enter) langsung menjorok.']].map(([k,l,d])=>`<button class="opt ${cur===k?'on':''}" data-k="${k}"><span style="flex:1"><b style="display:block">${l}</b><span class="od">${d}</span></span></button>`).join('')}<button class="btn sec" id="oX">Tutup</button>`);
  $('oX').onclick=closeSheet;
  $('sheet').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{ls.set('novea_autoindent',b.dataset.k==='auto'?1:0);closeSheet();viewSettings();});
}

const chNum=/^bab\s*\d+$/i;
const ownTitle=c=>{const t=(c.title||'').trim();return chNum.test(t)?'':t;};
const chLabel=(c,i)=>{const t=ownTitle(c);return `Bab ${i+1}`+(t?`: ${t}`:'');};

/* ---------- Penyimpanan ---------- */
let dbp;
function db(){return dbp||(dbp=new Promise((res,rej)=>{
  const r=indexedDB.open('novea',3);
  r.onupgradeneeded=e=>{const d=r.result,has=n=>d.objectStoreNames.contains(n);
    if(!has('novels'))d.createObjectStore('novels',{keyPath:'id'});
    if(!has('chapters'))d.createObjectStore('chapters',{keyPath:'id'}).createIndex('novelId','novelId');
    if(e.oldVersion>0&&e.oldVersion<3&&has('notes'))d.deleteObjectStore('notes'); /* catatan lama dihapus: Catatan dibangun ulang dari nol */
    if(!has('notes'))d.createObjectStore('notes',{keyPath:'id'});};
  r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);
}));}
function tx(store,mode,fn){return db().then(d=>new Promise((res,rej)=>{
  const t=d.transaction(store,mode);const rq=fn(t.objectStore(store));
  t.oncomplete=()=>res(rq&&rq.result);t.onerror=t.onabort=()=>rej(t.error||new Error('gagal'));
}));}
const put=(s,o)=>tx(s,'readwrite',st=>st.put(o));
const del=(s,id)=>tx(s,'readwrite',st=>st.delete(id));
const getAll=s=>tx(s,'readonly',st=>st.getAll());
const chaptersOf=id=>tx('chapters','readonly',st=>st.index('novelId').getAll(id)).then(a=>a.sort((x,y)=>x.order-y.order));
const getOne=(s,id)=>tx(s,'readonly',st=>st.get(id));
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});

/* ---------- Tampilan umum ---------- */
$('setBtn').onclick=()=>go('settings');
$('tabLib').onclick=()=>{if(route.name!=='library')goReplace('library');};
$('tabNotes').onclick=()=>{if(route.name!=='notes')goReplace('notes');};
const main=$('main'),title=$('title'),back=$('back'),barAct=$('barAct'),fab=$('fab'),mark=$('mark');
back.innerHTML=ic('chevron-left');barAct.innerHTML=ic('three-dots');$('setBtn').innerHTML=ic('gear');fab.innerHTML=ic('plus-lg');$('hUn').innerHTML=ic('arrow-counterclockwise');$('hRe').innerHTML=ic('arrow-clockwise');
let flush=null; // fungsi simpan terakhir milik editor yang sedang terbuka
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200);}
function openSheet(html){$('sheet').innerHTML=html;$('scrim').classList.add('on');$('sheet').classList.add('on');}
function closeSheet(){$('scrim').classList.remove('on');$('sheet').classList.remove('on');}
$('scrim').onclick=closeSheet;
function confirmSheet(t,body,label,fn){
  openSheet(`<h3>${esc(t)}</h3><p>${esc(body)}</p><button class="btn bad" id="cOk">${esc(label)}</button><button class="btn sec" id="cNo">Batal</button>`);
  $('cOk').onclick=()=>{closeSheet();fn();};$('cNo').onclick=closeSheet;
}
function cover(n){
  const h=200+(hash(n.id+n.title)%40);
  return `<div class="cover" style="background:linear-gradient(160deg,hsl(${h} 75% 42%),hsl(${h+14} 80% 24%))"><img class="cmark" src="${$('mark').src}" alt=""></div>`;
}
function hash(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h);}

/* ---------- Navigasi ---------- */
let route={name:'library'};
function go(name,novelId=null,chapterId=null){
  if(flush){flush();flush=null;}
  route={name,novelId,chapterId};history.pushState(route,'');window.scrollTo(0,0);render();
}
back.onclick=()=>history.back();
/* Pindah bab di pembaca mengganti riwayat (bukan menambah), supaya tombol kembali ke detail novel. */
function goReplace(name,novelId=null,chapterId=null){route={name,novelId,chapterId};history.replaceState(route,'');window.scrollTo(0,0);render();}
window.addEventListener('popstate',e=>{if(flush){flush();flush=null;}route=e.state||{name:'library'};closeSheet();render();});
history.replaceState(route,'');

function render(){
  fab.hidden=true;barAct.hidden=true;fab.onclick=null;
  const lib=route.name==='library'||route.name==='notes';
  $('tabLib').classList.toggle('on',route.name==='library');$('tabNotes').classList.toggle('on',route.name==='notes');$('rule').dataset.active=route.name==='notes'?'notes':'library';
  back.hidden=lib;mark.hidden=!lib;$('htabs').hidden=!lib;$('rule').hidden=!lib;title.hidden=lib;$('setBtn').hidden=!lib;$('hUn').hidden=$('hRe').hidden=!(route.name==='noteEditor'||route.name==='editor');$('hstat').hidden=route.name!=='noteEditor';
  if(lib)title.textContent='';
  if(route.name!=='novel')synOpen=false;
  readerUI(route.name==='reader');
  ({library:viewLibrary,novel:viewNovel,editor:viewEditor,reader:viewReader,settings:viewSettings,notes:viewNotes,noteEditor:viewNoteEditor})[route.name]();
}

/* ---------- Umum: status, sampul, penyimpanan kecil ---------- */
const STATUS=[['draft','Draf'],['ongoing','Sedang Ditulis'],['completed','Selesai'],['hiatus','Hiatus']];
const statusLabel=k=>(STATUS.find(s=>s[0]===k)||STATUS[0])[1];
const ls={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function coverEl(n){return n.coverImage?`<div class="cover has"><img src="${n.coverImage}" alt=""></div>`:cover(n);}
const fileIn=document.createElement('input');fileIn.type='file';fileIn.accept='image/*';fileIn.hidden=true;document.body.appendChild(fileIn);
function pickCover(cb){
  fileIn.onchange=()=>{const f=fileIn.files[0];fileIn.value='';if(!f)return;
    const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{
      const sc=Math.min(1,400/im.width),cv=document.createElement('canvas');cv.width=Math.round(im.width*sc);cv.height=Math.round(im.height*sc);
      cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);cb(cv.toDataURL('image/jpeg',.85));};im.src=r.result;};r.readAsDataURL(f);};
  fileIn.click();
}
async function saveNovel(o){try{await put('novels',o);return true;}catch(e){toast('Gagal menyimpan. Penyimpanan perangkat bermasalah.');return false;}}

/* ---------- Rak buku ---------- */
async function viewLibrary(){
  const [novels,chs]=await Promise.all([getAll('novels'),getAll('chapters')]);
  const count={};chs.forEach(c=>count[c.novelId]=(count[c.novelId]||0)+1);
  novels.sort((a,b)=>b.updatedAt-a.updatedAt);
  let h='';
  const lr=ls.get('novea_lastread'),ln=lr&&novels.find(n=>n.id===lr.novelId);
  if(ln&&ls.get('novea_dismissed')!==lr.chapterId){
    const list=chs.filter(c=>c.novelId===ln.id).sort((a,b)=>a.order-b.order),i=list.findIndex(c=>c.id===lr.chapterId);
    if(i>=0)h+=`<div class="cont"><button class="cbody" id="cGo">${coverEl(ln)}<div class="cinfo"><div class="ct"><b>Melanjutkan:</b> ${esc(ln.title)}</div><div class="cs">${esc(ln.author)||'Tanpa nama penulis'} | ${esc(chLabel(list[i],i))}</div><div class="pbar"><i style="width:${Math.round((i+1)/list.length*100)}%"></i></div></div></button><button class="cx" id="cX" aria-label="Tutup riwayat">${ic('x-lg')}</button></div>`;
    window._cont={n:ln.id,c:lr.chapterId};
  }
  if(!novels.length)h+=`<div class="empty">Rak bukumu masih kosong.<br>Ketuk + untuk mulai menulis novel pertamamu.</div>`;
  else h+=`<textarea class="search sl" id="q" rows="1" wrap="off" enterkeyhint="search" placeholder="Cari judul atau genre…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea><div class="shelf" id="shelf">${novels.map(n=>`<button class="book" data-id="${n.id}" data-q="${esc((n.title+' '+(n.genre||'')).toLowerCase())}">${coverEl(n)}<div class="bt">${esc(n.title)}</div><div class="bs">${plural(count[n.id]||0,'bab')} • ${statusLabel(n.status)}</div></button>`).join('')}</div><div class="empty" id="noRes" hidden>Tidak ada novel yang cocok.</div>`;
  main.innerHTML=h;
  main.querySelectorAll('.book').forEach(b=>b.onclick=()=>go('novel',b.dataset.id));
  if($('cGo')){$('cGo').onclick=()=>go('reader',window._cont.n,window._cont.c);$('cX').onclick=()=>{ls.set('novea_dismissed',window._cont.c);viewLibrary();};}
  if($('q'))$('q').oninput=e=>{const q=e.target.value.trim().toLowerCase();let any=false;
    main.querySelectorAll('.book').forEach(b=>{const m=b.dataset.q.includes(q);b.hidden=!m;any=any||m;});$('noRes').hidden=any;};
  fab.hidden=false;fab.onclick=()=>novelForm(null);
}
/* ---------- Catatan (tahap 1): judul + isi teks biasa ---------- */
const noteSnippet=n=>(n.content||'').trim().replace(/\s+/g,' ')||(/<img/i.test(n.html||'')?'Berisi gambar':'Catatan kosong');
async function noteLinkSheet(n,novels,done){
  const list=[...novels].sort((a,b)=>a.title.localeCompare(b.title));
  openSheet(`<h3>Tautkan ke novel</h3><div class="list" style="max-height:52vh;overflow-y:auto"><div class="row"><button class="main ${!n.novelId?'cur':''}" data-id=""><b>Tidak ditautkan</b></button></div>${list.map(x=>`<div class="row"><button class="main ${x.id===n.novelId?'cur':''}" data-id="${x.id}"><b>${esc(x.title)}</b></button></div>`).join('')}</div><button class="btn sec" id="lkX">Batal</button>`);
  $('lkX').onclick=closeSheet;
  $('sheet').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{n.novelId=b.dataset.id||null;closeSheet();done();});
}
/* Pintasan catatan saat menulis bab: daftar catatan yang ditautkan ke novel ini, dibaca langsung tanpa meninggalkan bab. */
async function novelNotesSheet(novel){
  const notes=(await getAll('notes')).filter(x=>x.novelId===novel.id).sort((a,b)=>b.updatedAt-a.updatedAt);
  const showList=()=>{
    openSheet(`<h3>Catatan: ${esc(novel.title)}</h3>${notes.length?`<div class="list" style="max-height:50vh;overflow-y:auto">${notes.map(x=>`<div class="row"><button class="main" data-id="${x.id}"><b>${esc(x.title)||'Catatan tanpa judul'}</b><span>${esc(noteSnippet(x))}</span></button></div>`).join('')}</div>`:'<p>Belum ada catatan yang ditautkan ke novel ini. Tautkan lewat halaman catatan, atau buat catatan baru di sini.</p>'}<button class="btn main" id="nnNew">Catatan baru untuk novel ini</button><button class="btn sec" id="nnX">Tutup</button>`);
    $('nnX').onclick=closeSheet;$('nnNew').onclick=()=>{closeSheet();newNote(novel.id);};
    $('sheet').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>showNote(notes.find(x=>x.id===b.dataset.id)));
  };
  const showNote=x=>{
    openSheet(`<div class="nvh"><button class="ibtn" id="nvB" aria-label="Kembali ke daftar">${ic('chevron-left')}</button><h3>${esc(x.title)||'Catatan tanpa judul'}</h3></div><div class="nview rte" id="nvC"></div><button class="btn sec" id="nvO">Buka di Catatan</button><button class="btn sec" id="nvX">Tutup</button>`);
    const c=$('nvC');c.innerHTML=cleanHTML(x.html||legacyHTML(x.content));c.querySelectorAll('[contenteditable]').forEach(e=>e.removeAttribute('contenteditable'));
    c.onclick=e=>{if(e.target.tagName==='IMG')viewer(e.target.src);};
    $('nvB').onclick=showList;$('nvX').onclick=closeSheet;$('nvO').onclick=()=>{closeSheet();go('noteEditor',null,x.id);};
  };
  showList();
}
async function newNote(novelId=null){
  const now=Date.now(),n={id:uid(),title:'',content:'',novelId:novelId||null,createdAt:now,updatedAt:now};
  try{await put('notes',n);}catch(e){toast('Gagal membuat catatan.');return;}
  go('noteEditor',null,n.id);
}
async function viewNotes(){
  const notes=(await getAll('notes')).sort((a,b)=>b.updatedAt-a.updatedAt),nm={};(await getAll('novels')).forEach(x=>nm[x.id]=x.title);
  fab.hidden=false;fab.onclick=()=>newNote();
  if(!notes.length){main.innerHTML=`<div class="empty">Belum ada catatan.<br>Ketuk + untuk menulis catatan pertamamu.</div>`;return;}
  main.innerHTML=`<textarea class="search sl" id="nq" rows="1" wrap="off" enterkeyhint="search" placeholder="Cari catatan…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea><div class="list" id="nl"></div><div class="empty" id="nNo" hidden>Tidak ada catatan yang cocok.</div>`;
  const draw=()=>{
    const q=$('nq').value.trim().toLowerCase();
    const items=notes.filter(n=>!q||((n.title||'')+' '+(n.content||'')+' '+(nm[n.novelId]||'')).toLowerCase().includes(q));
    $('nl').hidden=!items.length;$('nNo').hidden=!!items.length;
    $('nl').innerHTML=items.map(n=>`<div class="row" data-id="${n.id}"><button class="main" data-a="open"><b>${esc(n.title)||'Catatan tanpa judul'}</b>${nm[n.novelId]?`<span class="nlt">${esc(nm[n.novelId])}</span>`:''}<span>${esc(noteSnippet(n))}</span></button><button class="ibtn" data-a="more" aria-label="Lainnya">${ic('three-dots')}</button></div>`).join('');
    $('nl').querySelectorAll('.row').forEach(r=>{const n=notes.find(x=>x.id===r.dataset.id);
      r.querySelector('[data-a=open]').onclick=()=>go('noteEditor',null,n.id);
      r.querySelector('[data-a=more]').onclick=()=>noteMenu(n);});
  };
  $('nq').oninput=draw;draw();
}
function noteMenu(n){
  openSheet(`<h3>${esc(n.title)||'Catatan tanpa judul'}</h3><button class="btn main" id="nO">Buka catatan</button><button class="btn txt-bad" id="nD">Hapus catatan</button><button class="btn sec" id="nX">Tutup</button>`);
  $('nX').onclick=closeSheet;$('nO').onclick=()=>{closeSheet();go('noteEditor',null,n.id);};
  $('nD').onclick=()=>{closeSheet();confirmSheet('Hapus catatan ini?',`"${n.title||'Catatan tanpa judul'}" akan dihapus permanen.`,'Hapus catatan',async()=>{await del('notes',n.id);render();});};
}
/* ---------- Editor catatan: teks berformat dasar (bar format di bawah) ---------- */
const NCOL=['#C0392B','#E67E22','#D4A017','#2E9E5B','#0A74C9','#7D4CC3','#6B7684'];
const NHL=['#FFF2A8','#FFD6A5','#C7F0D2','#BFE3FF','#EBD4FF','#FFC9C9'];
const legacyHTML=t=>(t||'').split('\n').map(l=>`<div>${l?esc(l):'<br>'}</div>`).join('')||'<div><br></div>';
function cleanHTML(html){
  const t=document.createElement('template');t.innerHTML=html;
  t.content.querySelectorAll('script,style,iframe,object,embed,link,meta,form').forEach(e=>e.remove());
  t.content.querySelectorAll('img').forEach(i=>{if(!/^data:image\/(jpeg|png|webp|gif);base64,/i.test(i.getAttribute('src')||''))i.remove();});
  t.content.querySelectorAll('*').forEach(e=>[...e.attributes].forEach(a=>{const k=a.name.toLowerCase();
    if(k.startsWith('on')||((k==='href'||k==='src')&&/^\s*javascript:/i.test(a.value)))e.removeAttribute(a.name);}));
  return t.innerHTML;
}
/* Pangkas manual: geser gambar dan perbesar di dalam bingkai berasio tetap; yang terlihat di bingkai adalah hasil akhirnya. */
function cropImage(file,idx,total){
  return new Promise(res=>{
    const url=URL.createObjectURL(file),img=new Image();
    img.onerror=()=>{URL.revokeObjectURL(url);res(null);};
    img.onload=()=>{
      const nw=img.naturalWidth,nh=img.naturalHeight;
      const o=document.createElement('div');o.className='cropper';
      o.innerHTML=`<div class="cpbar"><button type="button" id="cpX">Batal</button><span>Pangkas gambar${total>1?` (${idx}/${total})`:''}</span><button type="button" id="cpOk">Pakai</button></div>
        <div class="cpstage" id="cpS"><img id="cpI" alt="" draggable="false"><div class="cpframe" id="cpF"></div></div>
        <div class="cptools"><div class="cprat" id="cpR"><button type="button" data-r="0">Asli</button><button type="button" data-r="1">1:1</button><button type="button" data-r="0.8">4:5</button><button type="button" data-r="0.75">3:4</button><button type="button" data-r="1.7778">16:9</button></div>
          <label class="cpz">Perbesar<input type="range" id="cpZ" min="100" max="400" value="100"></label></div>`;
      document.body.appendChild(o);
      const S=o.querySelector('#cpS'),I=o.querySelector('#cpI'),F=o.querySelector('#cpF'),Z=o.querySelector('#cpZ');
      I.src=url;
      let r=0.8,z=1,ox=0,oy=0,fw=0,fh=0,sw=0,sh=0,s0=1;
      const layout=()=>{sw=S.clientWidth;sh=S.clientHeight;const R=r||nw/nh,mw=sw-32,mh=sh-32;fw=Math.min(mw,mh*R);fh=fw/R;s0=Math.max(fw/nw,fh/nh);};
      const apply=()=>{z=Math.max(1,Math.min(4,z));const s=s0*z,w=nw*s,h=nh*s,mx=(w-fw)/2,my=(h-fh)/2;
        ox=Math.max(-mx,Math.min(mx,ox));oy=Math.max(-my,Math.min(my,oy));
        I.style.cssText=`width:${w}px;height:${h}px;left:${sw/2+ox-w/2}px;top:${sh/2+oy-h/2}px`;
        F.style.cssText=`width:${fw}px;height:${fh}px;left:${(sw-fw)/2}px;top:${(sh-fh)/2}px`;Z.value=Math.round(z*100);};
      const setRatio=v=>{r=v;z=1;ox=0;oy=0;layout();apply();o.querySelectorAll('#cpR button').forEach(b=>b.classList.toggle('on',+b.dataset.r===v));};
      o.querySelector('#cpR').onclick=e=>{const b=e.target.closest('button');if(b)setRatio(+b.dataset.r);};
      const pts=new Map();let last=0;
      S.addEventListener('pointerdown',e=>{S.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);last=0;});
      S.addEventListener('pointermove',e=>{const pv=pts.get(e.pointerId);if(!pv)return;pts.set(e.pointerId,[e.clientX,e.clientY]);
        if(pts.size===1){ox+=e.clientX-pv[0];oy+=e.clientY-pv[1];apply();}
        else if(pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(last)z*=d/last;last=d;apply();}});
      const up=e=>{pts.delete(e.pointerId);last=0;};S.addEventListener('pointerup',up);S.addEventListener('pointercancel',up);
      S.addEventListener('wheel',e=>{e.preventDefault();z*=e.deltaY<0?1.08:1/1.08;apply();},{passive:false});
      Z.oninput=()=>{z=Z.value/100;apply();};
      const onR=()=>{layout();apply();};window.addEventListener('resize',onR);
      const finish=v=>{window.removeEventListener('resize',onR);URL.revokeObjectURL(url);o.remove();res(v);};
      o.querySelector('#cpX').onclick=()=>finish(null);
      o.querySelector('#cpOk').onclick=()=>{
        const s=s0*z,w=nw*s,h=nh*s,sx=(w/2-fw/2-ox)/s,sy=(h/2-fh/2-oy)/s,sW=fw/s,sH=fh/s,k=Math.min(1,1280/Math.max(sW,sH));
        const cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(sW*k));cv.height=Math.max(1,Math.round(sH*k));
        const g=cv.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,cv.width,cv.height);g.drawImage(img,sx,sy,sW,sH,0,0,cv.width,cv.height);
        finish({src:cv.toDataURL('image/jpeg',.85),r:cv.width/cv.height});};
      setRatio(0.8);
    };
    img.src=url;
  });
}
function viewer(src){const v=document.createElement('div');v.className='viewer';v.innerHTML=`<img src="${src}" alt="">`;v.onclick=()=>v.remove();document.body.appendChild(v);}
async function viewNoteEditor(){
  const n=await getOne('notes',route.chapterId);if(!n)return go('notes');
  title.textContent='';
  main.innerHTML=`<div class="nchips"><button type="button" class="nchip" id="nLk"></button></div><textarea class="etitle sl grow" id="nT" rows="1" data-next="nB" enterkeyhint="next" placeholder="Judul catatan" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false">${esc(n.title)}</textarea><div class="rte" id="nB" contenteditable="true" data-ph="Tulis catatan…"></div>
    <div class="nbar" id="nbar"><div class="nbar-in"><div class="npop" id="npop" hidden></div>
      <div class="nfmt" id="nfmt"><button data-c="bold" data-s="1" aria-label="Tebal"><b>B</b></button><button data-c="italic" data-s="1" aria-label="Miring"><i>I</i></button><button data-c="underline" data-s="1" aria-label="Garis bawah"><u>U</u></button><span class="sep"></span>
        <button data-a="left" aria-label="Rata kiri">${ic('align-left')}</button><button data-a="center" aria-label="Rata tengah">${ic('align-center')}</button><button data-a="right" aria-label="Rata kanan">${ic('align-right')}</button><button data-a="justify" aria-label="Rata kiri-kanan">${ic('align-justify')}</button><span class="sep"></span>
        <button id="bH" aria-label="Judul bagian">H</button><button id="bSz" aria-label="Ukuran teks">Tt</button><button id="bCol" aria-label="Warna teks"><span class="cA">A</span></button><button id="bHl" aria-label="Sorot warna"><span class="hA">ab</span></button><span class="sep"></span>
        <button data-d="1" aria-label="Geser masuk">${ic('indent')}</button><button data-d="-1" aria-label="Geser keluar">${ic('outdent')}</button><span class="sep"></span><button data-q="1" aria-label="Kutipan">${ic('quote')}</button><button id="bPn" aria-label="Tanda petik dan garis">“ ”</button><button data-f="1" aria-label="Tab: jorokan awal paragraf">¶+</button><button data-f="-1" aria-label="Kurangi jorokan awal paragraf">¶−</button><span class="sep"></span><button id="bImg" aria-label="Sisipkan gambar">${ic('camera')}</button></div></div></div><input type="file" id="nF" accept="image/*" multiple hidden>`;
  const root=$('nB'),t=$('nT'),st=$('nSt'),pop=$('npop');
  root.innerHTML=cleanHTML(n.html||legacyHTML(n.content));
  const BLOCK=/^(DIV|H1|H2|H3|H4|BLOCKQUOTE|UL|OL|P)$/;
  /* Chrome kadang memindahkan rata teks/geser ke kotak editor itu sendiri saat isi dihapus; gaya itu dibuang. */
  const ensure=()=>{if(root.hasAttribute('style'))root.removeAttribute('style');if(!root.firstChild||root.innerHTML==='<br>')root.innerHTML='<div><br></div>';
    const l=root.lastElementChild;if(l&&l.classList.contains('imgs')){const d=document.createElement('div');d.innerHTML='<br>';root.append(d);}};
  /* Pastikan semua isi berada di dalam blok (div/judul), supaya perintah blok bekerja per baris. */
  const strays=()=>[...root.childNodes].some(c=>!(c.nodeType===1&&BLOCK.test(c.tagName)));
  const normRoot=()=>{let run=null;[...root.childNodes].forEach(c=>{
    if(c.nodeType===1&&BLOCK.test(c.tagName)){run=null;return;}
    if(!run){run=document.createElement('div');root.insertBefore(run,c);}run.appendChild(c);});ensure();};
  ensure();if(strays())normRoot();
  document.execCommand('defaultParagraphSeparator',false,'div');
  /* Posisi pilihan disimpan sebagai (nomor blok, urutan huruf di blok) supaya tetap benar setelah blok diganti. */
  const blockOf=x=>{while(x&&x.parentNode!==root)x=x.parentNode;return x&&x.parentNode===root?x:null;};
  const ptOf=(node,off)=>{
    const kids=[...root.children];if(!kids.length)return null;
    if(node===root){const i=Math.min(off,kids.length);return i<kids.length?{i,o:0}:{i:kids.length-1,o:kids[kids.length-1].textContent.length};}
    const b=blockOf(node);if(!b)return null;
    const r=document.createRange();r.selectNodeContents(b);r.setEnd(node,off);return {i:kids.indexOf(b),o:r.toString().length};};
  const saveRange=()=>{const s=getSelection();if(!s.rangeCount||!root.contains(s.anchorNode))return null;
    const r=s.getRangeAt(0),a=ptOf(r.startContainer,r.startOffset),b=ptOf(r.endContainer,r.endOffset);return a&&b?{a,b}:null;};
  const locate=pt=>{const blk=root.children[Math.max(0,Math.min(pt.i,root.children.length-1))];
    const w=document.createTreeWalker(blk,NodeFilter.SHOW_TEXT);let x,pos=0;
    while(x=w.nextNode()){const l=x.nodeValue.length;if(pt.o<=pos+l)return [x,pt.o-pos];pos+=l;}
    return [blk,0];};
  const restoreRange=sr=>{if(!sr||!root.children.length)return;const r=document.createRange(),[sn,so]=locate(sr.a),[en,eo]=locate(sr.b);
    try{r.setStart(sn,so);r.setEnd(en,eo);}catch(e){return;}const s=getSelection();s.removeAllRanges();s.addRange(r);};
  let lastSel=null;
  const focusRoot=()=>{
    const s=getSelection(),inside=s.rangeCount&&root.contains(s.anchorNode);
    if(document.activeElement!==root){const sr=inside?saveRange():lastSel;root.focus({preventScroll:true});if(sr)restoreRange(sr);}
    else if(!inside&&lastSel)restoreRange(lastSel);
  };
  let timer=null,dirty=false,saving=Promise.resolve();
  const mark=(c,x)=>{st.className=c;st.textContent=x;};
  const plain=()=>{const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let s='',x;while(x=w.nextNode())s+=x.nodeValue.replace(/\u200b/g,'')+'\n';return s;};
  const hasContent=()=>!!plain().trim()||!!root.querySelector('img');
  const counts=()=>{root.classList.toggle('is-empty',!hasContent());};
  if(!hasContent()&&root.innerHTML!=='<div><br></div>')root.innerHTML='<div><br></div>'; /* catatan kosong selalu mulai bersih (rata kiri, tanpa geser) */
  counts();
  function save(){
    clearTimeout(timer);if(!dirty)return saving;
    dirty=false;n.title=t.value;n.html=root.innerHTML;n.content=plain().trim();n.updatedAt=Date.now();
    saving=put('notes',{id:n.id,title:n.title,content:n.content,html:n.html,novelId:n.novelId||null,createdAt:n.createdAt,updatedAt:n.updatedAt}).then(()=>{if(!dirty)mark('ok','Tersimpan');}).catch(()=>{dirty=true;mark('err','Gagal menyimpan!');});
    return saving;
  }
  const change=()=>{dirty=true;mark('wait','Menyimpan…');counts();clearTimeout(timer);timer=setTimeout(save,600);};
  /* Undo/redo (tombol kanan atas): cuplikan isi catatan, jadi mencakup teks dan semua format. */
  let hs=[root.innerHTML],hi=0,ht=null;
  const updH=()=>{$('hUn').disabled=hi<=0;$('hRe').disabled=hi>=hs.length-1;};updH();
  const pushH=()=>{const v=root.innerHTML;if(v===hs[hi])return;hs=hs.slice(0,hi+1);hs.push(v);hi=hs.length-1;while(hs.length>1&&(hs.length>60||hs.reduce((a,x)=>a+x.length,0)>2.5e7)){hs.shift();hi--;}updH();};
  const caretEnd=()=>{const r=document.createRange();r.selectNodeContents(root);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r);};
  const hgo=d=>{clearTimeout(ht);pushH();const j=hi+d;if(j<0||j>=hs.length)return;const sr=saveRange()||lastSel;hi=j;root.innerHTML=hs[hi];ensure();if(sr)restoreRange(sr);else caretEnd();updH();change();};
  $('hUn').onclick=()=>hgo(-1);$('hRe').onclick=()=>hgo(1);$('hUn').onmousedown=$('hRe').onmousedown=e=>e.preventDefault();
  /* Status tombol mengikuti posisi kursor. */
  const stt=c=>{try{return document.queryCommandState(c);}catch(e){return false;}};
  const capOf=()=>{const s=getSelection();if(!s.rangeCount||!root.contains(s.anchorNode))return null;const el=s.anchorNode.nodeType===1?s.anchorNode:s.anchorNode.parentElement;return el&&el.closest?el.closest('figcaption'):null;};
  const startBlock=()=>{const sr=saveRange();return sr?root.children[sr.a.i]:null;};
  const sync=()=>{
    $('nfmt').querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',stt(b.dataset.c)));
    const cap=capOf(),blk=cap||startBlock(),tag=blk?blk.tagName.toLowerCase():'div',h=/^h[1-4]$/.test(tag)?tag:'div';
    let al='left';if(blk){const a=getComputedStyle(blk).textAlign;al=a==='start'?'left':a;}
    $('nfmt').querySelectorAll('[data-a]').forEach(b=>b.classList.toggle('on',b.dataset.a===al));
    $('bH').classList.toggle('on',h!=='div');
    const an=getSelection().rangeCount&&root.contains(getSelection().anchorNode)?getSelection().anchorNode:null;
    $('bCol').classList.toggle('on',!!(an&&styledAnc(an,'col')));$('bHl').classList.toggle('on',!!(an&&styledAnc(an,'hl')));
    pop.querySelectorAll('[data-b]').forEach(x=>x.classList.toggle('on',x.dataset.b===h));
  };
  const done=()=>{clearTimeout(ht);pushH();change();sync();};
  const ex=(c,v)=>{focusRoot();document.execCommand('styleWithCSS',false,true);document.execCommand(c,false,v);done();};
  /* Perintah per blok (judul, rata teks, geser): dijalankan satu per satu pada setiap baris yang terpilih. */
  const blockCmd=fn=>{focusRoot();if(strays()){const s0=saveRange();normRoot();restoreRange(s0);}
    const sr=saveRange();if(!sr)return;
    const kids=[...root.children];let a=sr.a.i,b=sr.b.i;if(b>a&&sr.b.o===0)b--;
    kids.slice(a,b+1).filter(x=>!x.classList.contains('imgs')).forEach(fn);restoreRange(sr);done();};
  const setBlock=tag=>blockCmd(blk=>{const r=document.createRange();r.selectNodeContents(blk);if(!blk.textContent.trim())r.collapse(true);
    const s=getSelection();s.removeAllRanges();s.addRange(r);document.execCommand('formatBlock',false,'<'+tag+'>');});
  const setAlign=v=>{const c=capOf();if(c){c.style.textAlign=v==='left'?'':v;if(!c.getAttribute('style'))c.removeAttribute('style');done();return;}blockCmd(blk=>{blk.style.textAlign=v==='left'?'':v;if(!blk.getAttribute('style'))blk.removeAttribute('style');});};
  const setFirst=d=>blockCmd(blk=>{const l=Math.max(0,Math.min(4,(parseInt(blk.dataset.fi||'0')||0)+d));
    if(l){blk.dataset.fi=l;blk.style.textIndent=(l*1.5)+'em';}else{blk.removeAttribute('data-fi');blk.style.textIndent='';if(!(blk.getAttribute('style')||'').trim())blk.removeAttribute('style');}});
  const toggleQuote=()=>{const b=startBlock();setBlock(b&&b.tagName==='BLOCKQUOTE'?'div':'blockquote');};
  const insText=k=>{focusRoot();const s=getSelection(),sel=String(s),pairs={'‘ ’':['‘','’'],'“ ”':['“','”']};
    if(pairs[k]){const [l,r]=pairs[k];document.execCommand('insertText',false,l+sel+r);if(!sel){try{s.modify('move','backward','character');}catch(e){}}}
    else document.execCommand('insertText',false,k);
    done();};
  const setIndent=d=>blockCmd(blk=>{const l=Math.max(0,Math.min(6,(parseInt(blk.dataset.in||'0')||0)+d));
    if(l){blk.dataset.in=l;blk.style.marginLeft=(l*24)+'px';}else{blk.removeAttribute('data-in');blk.style.marginLeft='';if(!blk.getAttribute('style'))blk.removeAttribute('style');}});
  /* Warna/sorot: "Hapus" memakai warna penanda sementara lalu membuang gaya itu, supaya tidak ada warna tertinggal. */
  const SENT='rgb(1, 2, 3)';
  const unwrap=el=>{const p=el.parentNode;while(el.firstChild)p.insertBefore(el.firstChild,el);el.remove();};
  const PROP={col:'color',hl:'backgroundColor',size:'fontSize'},CSSP={col:'color',hl:'background-color',size:'font-size'};
  const norm=(k,v)=>{const d=document.createElement('span');d.style[PROP[k]]=v;return d.style[PROP[k]];};
  const styledAnc=(node,k)=>{while(node&&node!==root){if(node.nodeType===1&&node.style&&node.style[PROP[k]])return node;node=node.parentNode;}return null;};
  const dropStyle=(el,k)=>{el.style.removeProperty(CSSP[k]);if(!(el.getAttribute('style')||'').trim()){el.removeAttribute('style');if(el.tagName==='SPAN')unwrap(el);}};
  const stripSent=()=>{const sr=saveRange();
    root.querySelectorAll('[style]').forEach(el=>{if(el.style.color===SENT)dropStyle(el,'col');if(el.parentNode&&el.style.backgroundColor===SENT)dropStyle(el,'hl');});
    root.querySelectorAll('font[color="#010203"]').forEach(unwrap);restoreRange(sr);};
  /* Hapus warna/sorot: pada teks terpilih membuang gayanya; pada kursor tanpa pilihan, membuang gaya di sekitar kursor,
     atau (kalau kursor di ujung teks berwarna) membuat teks berikutnya tidak berwarna. */
  const removeStyle=k=>{
    const s=getSelection();if(!s.rangeCount)return;const r=s.getRangeAt(0);
    if(!r.collapsed){document.execCommand('styleWithCSS',false,true);document.execCommand(k==='col'?'foreColor':'backColor',false,'#010203');stripSent();return;}
    const el=styledAnc(r.startContainer,k);if(!el)return;
    const tail=document.createRange();tail.selectNodeContents(el);tail.setStart(r.startContainer,r.startOffset);
    if(tail.toString()===''){const z=document.createTextNode('\u200b');el.after(z);const c=document.createRange();c.setStart(z,1);c.collapse(true);s.removeAllRanges();s.addRange(c);}
    else{const sr=saveRange();dropStyle(el,k);restoreRange(sr);}
  };
  const colorCmd=(k,val)=>{focusRoot();
    const s=getSelection(),r0=s.rangeCount?s.getRangeAt(0):null,want=norm(k,val);
    const same=!!r0&&root.contains(s.anchorNode)&&(r0.collapsed?(()=>{const a=styledAnc(r0.startContainer,k);return !!a&&a.style[PROP[k]]===want;})()
      :[...root.querySelectorAll('[style]')].some(el=>el.style[PROP[k]]===want&&r0.intersectsNode(el)));
    if(val==='reset'||same){removeStyle(k);}
    else{document.execCommand('styleWithCSS',false,true);document.execCommand(k==='col'?'foreColor':'backColor',false,val);}
    done();};
  /* Ukuran teks (px): memakai ukuran sementara lalu diganti dengan ukuran pilihan; "Standar" membuang ukuran khusus. */
  const FS=[10,12,14,16,18,20,24,28,32];
  const sizeCmd=val=>{focusRoot();document.execCommand('styleWithCSS',false,true);document.execCommand('fontSize',false,'7');
    const sr=saveRange();
    root.querySelectorAll('span[style],font').forEach(el=>{
      const sent=el.style.fontSize==='xxx-large'||(el.tagName==='FONT'&&el.getAttribute('size')==='7');if(!sent)return;
      if(el.tagName==='FONT')el.removeAttribute('size');
      if(val==='reset')dropStyle(el,'size');else el.style.fontSize=val+'px';});
    root.querySelectorAll('font').forEach(f=>{if(!f.attributes.length||(f.attributes.length===1&&f.hasAttribute('style')&&!f.getAttribute('style').trim()))unwrap(f);});
    restoreRange(sr);
    if(val==='reset'){const s=getSelection(),r=s.rangeCount?s.getRangeAt(0):null;
      if(r&&!r.collapsed)root.querySelectorAll('span[style*="font-size"]').forEach(el=>{if(r.intersectsNode(el))dropStyle(el,'size');});}
    done();};
  /* Bar format tidak boleh merebut fokus dari editor, supaya pilihan teks tidak hilang. */
  $('nbar').addEventListener('mousedown',e=>{if(e.target.closest('button'))e.preventDefault();});
  let popM='';
  const showPop=m=>{
    if(!pop.hidden&&popM===m){pop.hidden=true;return;}
    popM=m;pop.hidden=false;
    if(m==='h')pop.innerHTML=['h1','h2','h3','h4','div'].map(k=>`<button class="pt" data-b="${k}">${k==='div'?'Isi':k.toUpperCase()}</button>`).join('');
    else if(m==='pn')pop.innerHTML=['‘ ’','“ ”','–','—'].map(k=>`<button class="pt" data-ins="${k}">${k}</button>`).join('');
    else if(m==='sz')pop.innerHTML=`<button class="pt" data-sz="reset">Standar</button>`+FS.map(n=>`<button class="pt" data-sz="${n}">${n}</button>`).join('');
    else pop.innerHTML=(m==='col'?NCOL:NHL).map(c=>`<button class="pc" data-${m}="${c}" style="background:${c}" aria-label="Warna"></button>`).join('')+`<button class="pt" data-${m}="reset">Hapus</button>`;
    sync();
  };
  $('nfmt').onclick=e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.c)ex(b.dataset.c);
    else if(b.dataset.a)setAlign(b.dataset.a);
    else if(b.dataset.d)setIndent(+b.dataset.d);else if(b.dataset.q)toggleQuote();else if(b.dataset.f)setFirst(+b.dataset.f);else if(b.id==='bPn')showPop('pn');
    else if(b.id==='bH')showPop('h');else if(b.id==='bSz')showPop('sz');else if(b.id==='bCol')showPop('col');else if(b.id==='bHl')showPop('hl');};
  pop.onclick=e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.b)setBlock(b.dataset.b);
    else if(b.dataset.col)colorCmd('col',b.dataset.col);
    else if(b.dataset.hl)colorCmd('hl',b.dataset.hl);
    else if(b.dataset.sz)sizeCmd(b.dataset.sz);
    else if(b.dataset.ins)insText(b.dataset.ins);
    pop.hidden=true;};
  root.addEventListener('paste',e=>{e.preventDefault();const tx=(e.clipboardData||window.clipboardData).getData('text/plain');if(tx)document.execCommand('insertText',false,tx);});
  root.addEventListener('beforeinput',e=>{
    if(e.inputType==='historyUndo'){e.preventDefault();hgo(-1);}
    if(e.inputType==='historyRedo'){e.preventDefault();hgo(1);}
    const an=getSelection().anchorNode,el0=an&&(an.nodeType===1?an:an.parentElement);
    if(e.inputType==='insertParagraph'&&el0&&el0.closest('figcaption'))e.preventDefault(); /* keterangan gambar satu paragraf */
  });
  root.addEventListener('input',e=>{
    ensure();if(strays()){const s0=saveRange();normRoot();restoreRange(s0);}
    /* Baris baru (Enter) tidak mewarisi rata teks atau geseran dari baris di atasnya; keduanya hanya berlaku kalau diatur manual. */
    if(e.inputType==='insertParagraph'){const sr=saveRange(),blk=sr&&root.children[sr.a.i];
      if(blk){blk.style.textAlign='';blk.style.marginLeft='';blk.removeAttribute('data-in');blk.removeAttribute('data-fi');blk.style.textIndent=autoIndent()?'1.5em':'';if(autoIndent())blk.dataset.fi=1;if(!(blk.getAttribute('style')||'').trim())blk.removeAttribute('style');}}
    /* Kalau semua teks dihapus, kembali ke satu baris kosong yang bersih. */
    if(/^delete/.test(e.inputType||'')&&!hasContent()&&root.innerHTML!=='<div><br></div>'){
      root.innerHTML='<div><br></div>';const r=document.createRange();r.setStart(root.firstChild,0);r.collapse(true);const s=getSelection();s.removeAllRanges();s.addRange(r);}
    sync();change();clearTimeout(ht);ht=setTimeout(pushH,700);});
  /* Gambar: dipangkas manual, tampil satu baris yang digeser ke samping, dengan keterangan di bawah tiap gambar. */
  $('bImg').onclick=()=>$('nF').click();
  $('nF').onchange=async e=>{
    const fs=[...e.target.files].slice(0,12);e.target.value='';if(!fs.length)return;
    const out=[];for(let i=0;i<fs.length;i++){const d=await cropImage(fs[i],i+1,fs.length);if(d)out.push(d);}
    if(!out.length)return;
    const figs=out.map(d=>`<figure class="im" data-z="3" style="--r:${d.r.toFixed(4)}"><img src="${d.src}" alt=""><button class="imx" aria-label="Hapus gambar"></button><figcaption contenteditable="true" data-ph="Tambah keterangan…"></figcaption></figure>`).join('');
    const row=document.createElement('div');row.className='imgs';row.setAttribute('contenteditable','false');
    row.innerHTML=`<div class="imgrow">${figs}</div>`;
    root.focus({preventScroll:true});if(lastSel)restoreRange(lastSel);
    const sr=saveRange(),blk=sr?root.children[sr.b.i]:null;
    /* Gambar yang ditambahkan belakangan bergabung ke baris gambar yang sudah ada, bukan membuat baris baru ke bawah. */
    const joinRow=blk&&(blk.classList.contains('imgs')?blk:(blk.tagName==='DIV'&&!blk.textContent.trim()&&!blk.querySelector('img')&&blk.previousElementSibling&&blk.previousElementSibling.classList.contains('imgs')?blk.previousElementSibling:null));
    if(joinRow){const rr=joinRow.querySelector('.imgrow');rr.insertAdjacentHTML('beforeend',figs);
      ensure();rr.scrollTo({left:rr.scrollWidth,behavior:'smooth'});
      const nx=joinRow.nextElementSibling;if(nx){const r=document.createRange();r.selectNodeContents(nx);r.collapse(true);const s=getSelection();s.removeAllRanges();s.addRange(r);}
      done();return;}
    if(blk&&blk.tagName==='DIV'&&!blk.classList.contains('imgs')&&!blk.textContent.trim()&&!blk.querySelector('img'))blk.replaceWith(row);
    else if(blk)blk.after(row);else root.append(row);
    ensure();
    let nx=row.nextElementSibling;if(!nx||nx.classList.contains('imgs')){nx=document.createElement('div');nx.innerHTML='<br>';row.after(nx);}
    const r=document.createRange();r.selectNodeContents(nx);r.collapse(true);const s=getSelection();s.removeAllRanges();s.addRange(r);
    done();
  };
  const removeFig=fig=>{const row=fig.closest('.imgs');fig.remove();if(!row.querySelector('figure'))row.remove();ensure();done();};
  /* Ketuk gambar: ubah ukuran (5 tingkat), lihat utuh, atau hapus. */
  const imgMenu=fig=>{
    const lv=()=>+fig.dataset.z||3;
    const show=()=>{
      openSheet(`<h3>Gambar</h3><p>Ukuran ${lv()} dari 5</p><button class="btn sec" id="gV">Lihat utuh</button><button class="btn sec" id="gP"${lv()>=5?' disabled':''}>Perbesar</button><button class="btn sec" id="gM"${lv()<=1?' disabled':''}>Perkecil</button><button class="btn txt-bad" id="gD">Hapus gambar</button><button class="btn sec" id="gX">Tutup</button>`);
      $('gX').onclick=closeSheet;$('gV').onclick=()=>{closeSheet();viewer(fig.querySelector('img').src);};
      $('gP').onclick=()=>{fig.dataset.z=Math.min(5,lv()+1);done();show();};
      $('gM').onclick=()=>{fig.dataset.z=Math.max(1,lv()-1);done();show();};
      $('gD').onclick=()=>{closeSheet();removeFig(fig);};
    };show();
  };
  root.addEventListener('click',e=>{const x=e.target;
    if(x.classList&&x.classList.contains('imx')){removeFig(x.closest('figure'));return;}
    if(x.tagName==='IMG'&&x.closest('figure'))imgMenu(x.closest('figure'));});
  t.oninput=change;
  /* Bar mengikuti bagian atas keyboard Android. */
  const vv=window.visualViewport,place=()=>{if(vv)$('nbar').style.bottom=Math.max(0,innerHeight-vv.height-vv.offsetTop)+'px';};
  if(vv){vv.addEventListener('resize',place);vv.addEventListener('scroll',place);place();}
  const onsel=()=>{const sr=saveRange();if(sr){lastSel=sr;sync();}};
  const hide=()=>{if(document.visibilityState==='hidden')save();};
  document.addEventListener('selectionchange',onsel);document.addEventListener('visibilitychange',hide);window.addEventListener('pagehide',save);
  flush=()=>{
    save().then(()=>{if(!n.title.trim()&&!n.content.trim()&&!/<img/i.test(n.html||''))del('notes',n.id);});
    document.removeEventListener('selectionchange',onsel);document.removeEventListener('visibilitychange',hide);window.removeEventListener('pagehide',save);
    if(vv){vv.removeEventListener('resize',place);vv.removeEventListener('scroll',place);}
  };
  const novelsAll=await getAll('novels');
  const lkLabel=()=>{const x=novelsAll.find(v=>v.id===n.novelId);$('nLk').innerHTML=x?esc(x.title)+'<span class="nxx" aria-label="Lepas tautan">×</span>':'+ Tautkan novel';$('nLk').classList.toggle('on',!!x);};lkLabel();
  $('nLk').onclick=e=>{if(e.target.closest('.nxx')){n.novelId=null;lkLabel();dirty=true;change();return;}noteLinkSheet(n,novelsAll,()=>{lkLabel();dirty=true;change();});};
  sync();
  if(!n.title&&!n.content)t.focus();
}

/* ---------- Pengaturan: statistik di atas, tampilan (dua tombol memanjang), data ---------- */
/* Versi aplikasi: MAJOR.MINOR.PATCH. Selama masih 0.x: fitur baru = naikkan MINOR, perbaikan kecil = naikkan PATCH. Samakan dengan nama cache di sw.js. */
const APP_VERSION='0.3.0';
const UI_OPTS=[{k:'s',l:'Kecil',v:.9,p:'90%'},{k:'m',l:'Standar',v:1,p:'100%'},{k:'l',l:'Besar',v:1.15,p:'115%'},{k:'xl',l:'Sangat besar',v:1.3,p:'130%'}];
function applyUi(){const o=UI_OPTS.find(x=>x.k===(ls.get('novea_ui')||'m'))||UI_OPTS[1];document.documentElement.style.setProperty('--ui',o.v);}
/* Statistik: kata baru yang ditulis di bab per hari (hanya penambahan; menghapus tidak mengurangi). Hari beruntun = hari berturut-turut dengan kata baru. */
const dayKey=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const shiftDay=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
function addWords(n){if(!(n>0))return;const s=ls.get('novea_stats')||{days:{}};s.days=s.days||{};const k=dayKey();s.days[k]=(s.days[k]||0)+n;ls.set('novea_stats',s);}
function statSummary(){
  const days=(ls.get('novea_stats')||{}).days||{},now=new Date(),n=k=>days[k]||0;
  let streak=0,d=new Date(now);if(!(n(dayKey(d))>0))d=shiftDay(d,-1);
  while(n(dayKey(d))>0){streak++;d=shiftDay(d,-1);}
  let best=0,run=0,prev=null;
  Object.keys(days).filter(k=>days[k]>0).sort().forEach(k=>{const t=new Date(k+'T00:00:00');run=prev&&Math.round((t-prev)/86400000)===1?run+1:1;prev=t;best=Math.max(best,run);});
  const week=[];for(let i=6;i>=0;i--){const x=shiftDay(now,-i);week.push({n:n(dayKey(x)),d:x.toLocaleDateString('id-ID',{weekday:'short'}),t:x.getDate()});}
  const wsum=week.reduce((a,x)=>a+x.n,0);
  const mon=shiftDay(now,-((now.getDay()+6)%7)),start=shiftDay(mon,-21),cells=[];
  for(let i=0;i<28;i++){const x=shiftDay(start,i),k=dayKey(x);cells.push({k,n:n(k),fut:x>now&&k!==dayKey(now),today:k===dayKey(now),dt:x.getDate(),lab:x.toLocaleDateString('id-ID',{day:'numeric',month:'short'})});}
  let active30=0;for(let i=0;i<30;i++)if(n(dayKey(shiftDay(now,-i)))>0)active30++;
  const vals=Object.values(days);
  return {today:n(dayKey(now)),yest:n(dayKey(shiftDay(now,-1))),streak,best,week,wsum,avg:Math.round(wsum/7),cells,active30,record:Math.max(0,...vals),total:vals.reduce((a,b)=>a+b,0)};
}
/* Data: cadangan, pemulihan, hapus */
const clearStore=s=>tx(s,'readwrite',st=>{st.clear();});
const putMany=(s,a)=>tx(s,'readwrite',st=>{a.forEach(x=>st.put(x));});
async function buildBackup(){
  const [novels,chapters,notes]=await Promise.all([getAll('novels'),getAll('chapters'),getAll('notes')]);
  const settings={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('novea_')&&k!=='novea_lastbackup')settings[k]=localStorage.getItem(k);}}catch(e){}
  return {app:'novea',version:1,appVersion:APP_VERSION,exportedAt:new Date().toISOString(),novels,chapters,notes,settings};
}
/* mode 'pick': pemilih folder/nama file (komputer) atau menu bagikan HP (Files/Drive). mode 'download': langsung ke folder Unduhan.
   Mengembalikan 'cap' | 'picker' | 'share' | 'download', atau null kalau dibatalkan. */
async function saveFile(filename,text,mode){
  try{if(window.claude&&window.claude.use){const d=await window.claude.use('downloads');if(d){await d.save({filename,data:text});return 'cap';}}}
  catch(e){if(e&&e.code==='declined')return null;}
  const file=new File([text],filename,{type:'application/json'});
  if(mode==='pick'){
    if(window.showSaveFilePicker){try{const h=await window.showSaveFilePicker({suggestedName:filename,types:[{description:'Cadangan Novea (JSON)',accept:{'application/json':['.json']}}]});const w=await h.createWritable();await w.write(file);await w.close();return 'picker';}catch(e){if(e&&e.name==='AbortError')return null;}}
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'Cadangan Novea'});return 'share';}catch(e){if(e&&e.name==='AbortError')return null;}}
  }
  const u=URL.createObjectURL(file),a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000);return 'download';
}
async function doBackup(mode){
  try{
    const how=await saveFile(`novea-cadangan-${dayKey()}.json`,JSON.stringify(await buildBackup()),mode);
    if(!how)return;
    ls.set('novea_lastbackup',Date.now());
    toast(how==='download'?'Cadangan diunduh ke folder Unduhan.':how==='share'?'Cadangan dikirim ke tujuan yang Anda pilih.':'Cadangan disimpan.');
    if(route.name==='settings')viewSettings();
  }catch(e){toast('Gagal membuat cadangan.');}
}
function backupSheet(){
  const cap=!!(window.claude&&window.claude.use),pick=!!window.showSaveFilePicker,share=!!(navigator.share&&navigator.canShare);
  const hint=cap?'Anda akan diminta mengonfirmasi lokasi penyimpanan file.':pick?'Membuka pemilih folder dan nama file.':share?'Membuka menu bagikan di HP. Pilih "Files" atau Drive untuk menentukan foldernya.':'Browser ini tidak punya pemilih folder, jadi file akan diunduh ke folder Unduhan.';
  openSheet(`<h3>Cadangkan data</h3><p>Pilih tujuan penyimpanan file cadangan.</p>
    <button class="btn main" id="bkPick">Pilih lokasi simpan…</button><p class="dline" style="margin:6px 0 10px">${hint}</p>
    <button class="btn sec" id="bkDl">Unduh ke folder Unduhan</button><button class="btn sec" id="bkNo">Batal</button>`);
  $('bkNo').onclick=closeSheet;
  $('bkPick').onclick=()=>{closeSheet();doBackup('pick');};
  $('bkDl').onclick=()=>{closeSheet();doBackup('download');};
}
function syncSettingsFromStorage(){
  rs.mode=ls.get('novea_rmode')||rs.mode;rs.light=ls.get('novea_rlight')||'putih';rs.step=ls.get('novea_rstep')||0;rs.lh=ls.get('novea_rlh2')||1.6;
  applyMode();applyUi();
}
function modeSheet(){
  openSheet(`<h3>Mode tampilan</h3>${[['light','Terang','sun'],['dark','Gelap','moon']].map(([k,l,i])=>`<button class="opt ${rs.mode===k?'on':''}" data-m="${k}">${ic(i)}<b>${l}</b>${rs.mode===k?'<em>Aktif</em>':''}</button>`).join('')}<button class="btn sec" id="oX">Tutup</button>`);
  $('oX').onclick=closeSheet;
  $('sheet').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{closeSheet();setMode(b.dataset.m);});
}
function uiSheet(){
  const cur=ls.get('novea_ui')||'m';
  openSheet(`<h3>Ukuran huruf aplikasi</h3><p>Mengubah ukuran teks di seluruh aplikasi. Isi bacaan novel diatur terpisah di Pengaturan baca.</p>${UI_OPTS.map(o=>`<button class="opt ${cur===o.k?'on':''}" data-u="${o.k}"><b>${o.l}</b><em>${o.p}</em></button>`).join('')}<button class="btn sec" id="oX">Tutup</button>`);
  $('oX').onclick=closeSheet;
  $('sheet').querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{ls.set('novea_ui',b.dataset.u);applyUi();closeSheet();viewSettings();});
}
async function viewSettings(){
  title.textContent='Pengaturan';
  const [novels,chs,notes]=await Promise.all([getAll('novels'),getAll('chapters'),getAll('notes')]);
  const sm=statSummary(),totalWords=chs.reduce((a,c)=>a+words(c.content),0),max=Math.max(1,...sm.week.map(d=>d.n)),fm=n=>n.toLocaleString('id-ID');
  let usage='';try{if(navigator.storage&&navigator.storage.estimate){const e=await navigator.storage.estimate();if(e&&e.usage!=null)usage=' · ± '+(e.usage/1048576).toFixed(1)+' MB';}}catch(e){}
  const lb=ls.get('novea_lastbackup'),uiO=UI_OPTS.find(o=>o.k===(ls.get('novea_ui')||'m'))||UI_OPTS[1];
  const msg=sm.today>0?'Anda sudah menulis hari ini.':sm.streak>0?'Tulis hari ini supaya rangkaian tidak putus.':'Tulis hari ini untuk memulai rangkaian.';
  const lvl=n=>n>=500?3:n>=100?2:n>0?1:0;
  const folds=ls.get('novea_folds')||{},act28=sm.cells.filter(c=>c.n>0).length,elapsed=sm.cells.filter(c=>!c.fut).length;
  const fold=(k,t,s,body)=>`<div class="fw${folds[k]===1?' open':''}" id="f_${k}"><button class="fh" data-f="${k}" aria-label="Lipat atau buka ${t}"><span class="ft">${t}</span><span class="fs">${s}</span>${ic('chevron-right')}</button><div class="fb">${body}</div></div>`;
  main.innerHTML=`<div class="set"><b>Statistik menulis</b>
      <div class="hero"><div class="big">${sm.streak}</div><div class="ht"><strong>hari beruntun</strong><span>${msg}</span><span>Rekor ${sm.best} hari · aktif ${sm.active30} dari 30 hari terakhir</span></div></div>
      <div class="stat-grid"><div class="sc"><strong>${fm(sm.today)}</strong><span>Kata hari ini</span></div><div class="sc"><strong>${fm(sm.yest)}</strong><span>Kata kemarin</span></div></div>
      ${fold('hm','4 minggu terakhir',`${act28} dari ${elapsed} hari menulis`,`<div class="hm hmh">${['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x=>`<small>${x}</small>`).join('')}</div>
        <div class="hm" id="hm">${sm.cells.map(c=>`<i class="l${lvl(c.n)}${c.fut?' fut':''}${c.today?' td':''}" title="${esc(c.lab)}: ${c.n} kata">${c.dt}</i>`).join('')}</div>
        <div class="lg">Sedikit <i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i> Banyak</div>
        <p class="dline">Angka di kotak adalah tanggal. Kotak berbingkai adalah hari ini.</p>`)}
      ${fold('wk','7 hari terakhir',`${fm(sm.wsum)} kata`,`<div class="wk2">${sm.week.map((d,i)=>`<div class="${i===6?'today':''}"><em>${fm(d.n)}</em><div class="bx"><i class="${d.n?'':'z'}" style="${d.n?`height:${Math.max(6,Math.round(d.n/max*100))}%`:''}"></i></div><small>${esc(d.d)}</small><small>${d.t}</small></div>`).join('')}</div>
        <p class="dline">Total ${fm(sm.wsum)} kata · rata-rata ${fm(sm.avg)} kata per hari.</p>`)}
      ${fold('all','Keseluruhan',`${fm(totalWords)} kata`,`<div class="kv"><span>Kata terbanyak dalam sehari</span><b>${fm(sm.record)}</b></div><div class="kv"><span>Total kata yang pernah ditulis</span><b>${fm(sm.total)}</b></div><div class="kv"><span>Isi semua novel sekarang</span><b>${fm(totalWords)} kata</b></div>
        <p class="dline">Dihitung dari kata baru di bab (catatan tidak dihitung). Menghapus kata tidak mengurangi hitungan. Hari beruntun = ada minimal satu kata baru.</p>`)}</div>
    <div class="list lrs"><button class="lr" id="lrMode"><b>Mode tampilan</b><span>${rs.mode==='dark'?'Gelap':'Terang'}</span>${ic('chevron-right')}</button><button class="lr" id="lrUi"><b>Ukuran huruf aplikasi</b><span>${uiO.l}</span>${ic('chevron-right')}</button><button class="lr" id="lrIn"><b>Indentasi paragraf</b><span>${autoIndent()?'Otomatis':'Manual'}</span>${ic('chevron-right')}</button></div>
    <div class="set"><b>Data</b>
      <p class="dline" id="dInfo">${novels.length} novel · ${chs.length} bab · ${notes.length} catatan${usage}<br>${lb?'Terakhir dicadangkan: '+new Date(lb).toLocaleString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'Belum pernah dicadangkan.'}</p>
      <button class="btn main" id="dBk">Cadangkan data</button><button class="btn sec" id="dRs">Pulihkan dari file</button><button class="btn txt-bad" id="dDl">Hapus semua data</button><input type="file" id="rsF" accept=".json,application/json" hidden></div>
    <p class="ver">Novea v${APP_VERSION}</p>`;
  main.querySelectorAll('.fh').forEach(b=>b.onclick=()=>{const w=$('f_'+b.dataset.f),o=!w.classList.contains('open');w.classList.toggle('open',o);const f=ls.get('novea_folds')||{};f[b.dataset.f]=o?1:0;ls.set('novea_folds',f);});
  $('lrMode').onclick=modeSheet;$('lrUi').onclick=uiSheet;$('lrIn').onclick=indentSheet;
  $('dBk').onclick=backupSheet;
  $('dRs').onclick=()=>$('rsF').click();
  $('rsF').onchange=e=>{
    const f=e.target.files[0];e.target.value='';if(!f)return;
    const bad=()=>openSheet(`<h3>Pemulihan gagal</h3><p>File ini bukan cadangan Novea yang valid, atau rusak. Tidak ada data yang diubah.</p><button class="btn sec" id="rX">Tutup</button>`)||($('rX').onclick=closeSheet);
    const rd=new FileReader();rd.onerror=bad;
    rd.onload=()=>{
      let d;try{d=JSON.parse(rd.result);}catch(err){return bad();}
      if(!d||d.app!=='novea'||!Array.isArray(d.novels)||!Array.isArray(d.chapters))return bad();
      const nv=d.novels.filter(x=>x&&x.id),ch=d.chapters.filter(x=>x&&x.id&&x.novelId),nt=(Array.isArray(d.notes)?d.notes:[]).filter(x=>x&&x.id);
      const when=d.exportedAt?new Date(d.exportedAt).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}):'tanggal tidak diketahui';
      openSheet(`<h3>Pulihkan data?</h3><p>Cadangan (${esc(when)}) berisi ${nv.length} novel, ${ch.length} bab, dan ${nt.length} catatan.</p>
        <button class="btn main" id="rM">Gabungkan dengan data sekarang</button><p class="dline" style="margin:6px 0 0">Data yang ada tetap. Data dengan id yang sama ditimpa isi cadangan.</p>
        <button class="btn bad" id="rR">Ganti semua data sekarang</button><p class="dline" style="margin:6px 0 0">Semua data sekarang dihapus lalu diganti isi cadangan. Cadangkan dulu kalau ragu.</p>
        <button class="btn sec" id="rN">Batal</button>`);
      $('rN').onclick=closeSheet;
      const run=async replace=>{
        closeSheet();
        try{
          if(replace){for(const s of ['novels','chapters','notes'])await clearStore(s);}
          await putMany('novels',nv);await putMany('chapters',ch);await putMany('notes',nt);
          if(d.settings&&typeof d.settings==='object'){
            if(replace){Object.entries(d.settings).forEach(([k,v])=>{if(k.startsWith('novea_')&&typeof v==='string'){try{localStorage.setItem(k,v);}catch(e){}}});}
            else if(d.settings.novea_stats){try{const a=ls.get('novea_stats')||{days:{}},b=JSON.parse(d.settings.novea_stats)||{days:{}};a.days=a.days||{};Object.entries(b.days||{}).forEach(([k,v])=>{a.days[k]=Math.max(a.days[k]||0,v);});ls.set('novea_stats',a);}catch(e){}}
          }
          syncSettingsFromStorage();toast('Data dipulihkan.');viewSettings();
        }catch(err){toast('Pemulihan gagal. Sebagian data mungkin belum terpulihkan.');}
      };
      $('rM').onclick=()=>run(false);$('rR').onclick=()=>run(true);
    };
    rd.readAsText(f);
  };
  $('dDl').onclick=()=>{
    openSheet(`<h3>Hapus semua data?</h3><p>Semua novel, bab, catatan, dan statistik di perangkat ini akan dihapus permanen dan tidak bisa dikembalikan. Pengaturan tampilan tidak ikut dihapus.</p>
      <button class="btn sec" id="dB2">Cadangkan dulu</button>
      <div class="field" style="margin-top:14px"><label for="dI">Ketik HAPUS untuk melanjutkan</label><textarea class="sl" id="dI" rows="1" wrap="off" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea></div>
      <button class="btn bad" id="dOk" disabled>Hapus semua data</button><button class="btn sec" id="dNo">Batal</button>`);
    $('dNo').onclick=closeSheet;$('dB2').onclick=doBackup;
    $('dI').oninput=e=>{$('dOk').disabled=e.target.value.trim().toUpperCase()!=='HAPUS';};
    $('dOk').onclick=async()=>{
      closeSheet();
      try{for(const s of ['novels','chapters','notes'])await clearStore(s);
        ['novea_stats','novea_lastread','novea_dismissed'].forEach(k=>{try{localStorage.removeItem(k);}catch(e){}});
        toast('Semua data dihapus.');viewSettings();
      }catch(err){toast('Gagal menghapus data.');}
    };
  };
}

function fullEdit(label,val,hint,cb){
  const d=document.createElement('div');d.className='full';
  d.innerHTML=`<div class="fullbar"><h3>${esc(label)}</h3><button type="button" id="fuOk" aria-label="Selesai" title="Selesai">${ic('minimize')}</button></div><textarea id="fuT" placeholder="${esc(hint)}"></textarea><div class="ebar" id="fuBar"></div>`;
  document.body.appendChild(d);const t=d.querySelector('textarea');t.value=val;t.focus();
  const bar=d.querySelector('#fuBar');bar.appendChild(mdBar(t,{}));const un=followKb(bar);
  t.addEventListener('beforeinput',e=>{if(autoIndent()&&e.inputType==='insertLineBreak'){e.preventDefault();document.execCommand('insertText',false,'\n\t');}});
  d.querySelector('#fuOk').onclick=()=>{cb(t.value);un();d.remove();};
}
const DEF_GENRES=['Fantasi','Romansa','Aksi','Petualangan','Misteri','Horor','Fiksi Ilmiah','Drama','Komedi','Sejarah','Thriller','Slice of Life','Wuxia','Xianxia','Isekai','Kultivasi'];
function novelForm(n){
  let img=n?n.coverImage||null:null,st=n?n.status||'draft':'draft';
  let genres=(n&&n.genre?n.genre.split(',').map(s=>s.trim()).filter(Boolean):[]),customG=ls.get('novea_genres')||[];
  const same=(a,b)=>a.toLowerCase()===b.toLowerCase(),ea=s=>esc(s).replace(/"/g,'&quot;');
  /* genre dari novel lama yang bukan bawaan ikut menjadi pilihan */
  genres.forEach(g=>{if(![...DEF_GENRES,...customG].some(x=>same(x,g)))customG.push(g);});ls.set('novea_genres',customG);
  const tmp=()=>({id:n?n.id:'tmp',title:$('fT')&&$('fT').value.trim()||(n?n.title:'Judul novel'),author:'',coverImage:img});
  openSheet(`<h3>${n?'Ubah detail novel':'Novel baru'}</h3>
    <div class="fhead"><div class="fcov"><button type="button" class="cbtn" id="cPrev" aria-label="Pilih sampul"></button><button type="button" class="cclr" id="cClr" hidden aria-label="Pakai sampul otomatis" title="Pakai sampul otomatis">${ic('x-lg')}</button></div>
      <div class="ffields">
        <div class="field"><label for="fT">Judul</label><textarea class="sl" id="fT" rows="1" wrap="off" enterkeyhint="next" placeholder="Judul novel" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false">${esc(n&&n.title)}</textarea></div>
        <div class="field"><label for="fA">Penulis (boleh kosong)</label><textarea class="sl" id="fA" rows="1" wrap="off" enterkeyhint="next" placeholder="Nama pena" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false">${esc(n&&n.author)}</textarea></div>
        
      </div></div>
    <div class="field"><label>Status</label><div class="chips" id="fSt">${STATUS.map(s=>`<button type="button" data-k="${s[0]}" class="${s[0]===st?'on':''}">${s[1]}</button>`).join('')}</div></div>
    <div class="field"><label>Genre${n?'':' (minimal 1)'}</label><button type="button" class="gsel" id="gSel" aria-label="Pilih genre"><span class="gtxt" id="gTxt"></span><span class="gcnt" id="gCnt" hidden></span><span class="gclr" id="gClr" hidden aria-label="Kosongkan genre">${ic('x-lg')}</span><span class="gchev">${ic('chevron-right')}</span></button></div>
    <div class="field"><label>Sinopsis (boleh kosong)</label><div class="synbox"><textarea id="fS" rows="3" placeholder="Ringkasan cerita">${esc(n&&n.synopsis)}</textarea><button type="button" class="synex" id="fSx" aria-label="Perbesar ke layar penuh" title="Layar penuh">${ic('expand')}</button></div></div>
    <button class="btn main" id="fOk">${n?'Simpan':'Buat novel'}</button><button class="btn sec" id="fNo">Batal</button>`);
  const prev=()=>{$('cPrev').innerHTML=coverEl(tmp())+'<span class="cbadge">'+ic('camera')+'</span>';$('cClr').hidden=!img;};
  const drawGsel=()=>{$('gTxt').textContent=genres.length?genres.join(', '):'Pilih genre';$('gTxt').classList.toggle('ph',!genres.length);$('gCnt').hidden=!genres.length;$('gCnt').textContent=genres.length;$('gClr').hidden=!genres.length;};
  $('gSel').onclick=e=>{if(e.target.closest('#gClr')){genres=[];drawGsel();return;}genreSheet(genres,l=>{genres=l;drawGsel();});};
  drawGsel();
  prev();
  $('fT').oninput=()=>{if(!img)prev();};
  $('cPrev').onclick=()=>pickCover(d=>{img=d;prev();});$('cClr').onclick=()=>{img=null;prev();};
  $('fSx').onclick=()=>fullEdit('Sinopsis',$('fS').value,'Ringkasan cerita',v=>{$('fS').value=v;});
  $('fSt').querySelectorAll('button').forEach(b=>b.onclick=()=>{st=b.dataset.k;$('fSt').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));});
  $('fNo').onclick=closeSheet;
  $('fOk').onclick=async()=>{
    const t=$('fT').value.trim();if(!t){$('fT').focus();return;}
    if(!n&&genres.length<1){toast('Pilih minimal 1 genre.');$('gSel').focus();return;}
    const now=Date.now(),o=n||{id:uid(),createdAt:now};
    Object.assign(o,{title:t,author:$('fA').value.trim(),genre:genres.join(', '),status:st,synopsis:$('fS').value.replace(/^(\s*\n)+/,'').replace(/\s+$/,''),coverImage:img,updatedAt:now});
    if(!await saveNovel(o))return;
    closeSheet();n?render():go('novel',o.id);
  };
}

/* ---------- Detail novel & daftar bab ---------- */
let synOpen=false;
async function viewNovel(){
  const n=await getOne('novels',route.novelId);if(!n)return go('library');
  const chs=await chaptersOf(n.id);
  title.textContent=n.title;barAct.hidden=false;
  const total=chs.reduce((s,c)=>s+words(c.content),0);
  const genres=(n.genre||'').split(',').map(g=>g.trim()).filter(Boolean);
  const long=(n.synopsis||'').length>250,syn=long&&!synOpen?n.synopsis.slice(0,250).replace(/\s+$/,'')+'…':n.synopsis;
  main.innerHTML=`<div class="head"><button class="cbtn" id="chCov" aria-label="Ganti sampul">${coverEl(n)}</button><div class="hinfo"><h2>${esc(n.title)}</h2><p class="aut">${ic('feather')}<span>${esc(n.author)||'Tanpa nama penulis'}</span></p><p class="stats">${plural(chs.length,'bab')} • ${total.toLocaleString('id-ID')} kata</p></div></div>
    <div class="chips ro"><span class="st st-${n.status||'draft'}">${statusLabel(n.status)}</span>${genres.map(g=>`<span>${esc(g)}</span>`).join('')}</div>
    ${n.synopsis?`<div class="syn">${mdParas(syn)}${long?`<button class="lnk" id="synT">${synOpen?'Lebih sedikit':'Selengkapnya'}</button>`:''}</div>`:''}
    ${chs.length?`<textarea class="search sl" id="cq" rows="1" wrap="off" enterkeyhint="search" placeholder="Cari bab, isi cerita, atau nomor…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea><div class="list" id="chList">${chs.map((c,i)=>`<div class="row" data-id="${c.id}"><button class="main" data-a="read"><b>${esc(chLabel(c,i))}</b><span>${plural(words(c.content),'kata')}</span></button><button class="ibtn" data-a="more" aria-label="Lainnya">${ic('three-dots')}</button></div>`).join('')}</div><div class="empty" id="noCh" hidden>Tidak ada bab yang cocok.</div>`
      :`<div class="empty">Belum ada bab.<br>Ketuk + untuk menulis bab pertama.</div>`}`;
  $('chCov').onclick=()=>pickCover(async d=>{n.coverImage=d;n.updatedAt=Date.now();if(await saveNovel(n))render();});
  if($('synT'))$('synT').onclick=()=>{synOpen=!synOpen;render();};
  barAct.onclick=()=>{
    openSheet(`<h3>${esc(n.title)}</h3><button class="btn sec" id="mE">Ubah detail</button><button class="btn txt-bad" id="mD">Hapus novel</button><button class="btn sec" id="mX">Tutup</button>`);
    $('mE').onclick=()=>{closeSheet();novelForm(n);};$('mX').onclick=closeSheet;
    $('mD').onclick=()=>{closeSheet();confirmSheet('Hapus novel ini?',`"${n.title}" dan semua babnya akan dihapus permanen.`,'Hapus novel',async()=>{
      for(const c of chs)await del('chapters',c.id);await del('novels',n.id);for(const nt of await getAll('notes'))if(nt.novelId===n.id){nt.novelId=null;await put('notes',nt);}go('library');});};
  };
  main.querySelectorAll('.row').forEach(r=>{
    const id=r.dataset.id;
    r.querySelector('[data-a=read]').onclick=()=>go('reader',n.id,id);
    r.querySelector('[data-a=more]').onclick=()=>chapterMenu(n,chs,id);
  });
  if($('cq'))$('cq').oninput=e=>{const q=e.target.value.trim().toLowerCase(),num=q.match(/^(?:bab\s*)?(\d+)$/);let any=false;
    main.querySelectorAll('#chList .row').forEach((r,i)=>{const c=chs[i];
      const m=chHit(c,i,q);r.hidden=!m;any=any||m;});$('noCh').hidden=any;};
  fab.hidden=false;fab.onclick=async()=>{
    const c={id:uid(),novelId:n.id,order:chs.length?Math.max(...chs.map(x=>x.order))+1:1,title:'',content:'',updatedAt:Date.now()};
    try{await put('chapters',c);}catch(e){toast('Gagal membuat bab.');return;}
    go('editor',n.id,c.id);
  };
}

function chapterMenu(n,chs,id){
  const i=chs.findIndex(c=>c.id===id),c=chs[i];
  openSheet(`<h3>${esc(chLabel(c,i))}</h3><button class="btn main" id="cW">Tulis bab ini</button>
    ${i>0?'<button class="btn sec" id="cU">Pindah ke atas</button>':''}
    
    ${chs.length>1?'<button class="btn sec" id="cM">Pindah ke nomor…</button>':''}<button class="btn txt-bad" id="cX">Hapus bab</button><button class="btn sec" id="cN">Tutup</button>`);
  $('cN').onclick=closeSheet;$('cW').onclick=()=>{closeSheet();go('editor',n.id,c.id);};
  const swap=async j=>{const o=chs[j];[c.order,o.order]=[o.order,c.order];await put('chapters',c);await put('chapters',o);closeSheet();render();};
  if($('cU'))$('cU').onclick=()=>swap(i-1);
  
  if($('cM'))$('cM').onclick=()=>{
    openSheet(`<h3>Pindah ke nomor</h3><p>${esc(chLabel(c,i))} sekarang di nomor ${i+1} dari ${chs.length}.</p><div class="field"><label for="mN">Nomor tujuan (1–${chs.length})</label><input id="mN" type="number" inputmode="numeric" autocomplete="off" min="1" max="${chs.length}" value="${i+1}"></div><button class="btn main" id="mOk">Pindahkan</button><button class="btn sec" id="mNo">Batal</button>`);
    $('mNo').onclick=closeSheet;
    $('mOk').onclick=async()=>{const to=Math.min(chs.length,Math.max(1,parseInt($('mN').value)||i+1));if(to===i+1){closeSheet();return;}
      const arr=chs.filter(x=>x.id!==c.id);arr.splice(to-1,0,c);
      try{for(let k=0;k<arr.length;k++)if(arr[k].order!==k+1){arr[k].order=k+1;await put('chapters',arr[k]);}}catch(e){toast('Gagal memindahkan bab.');return;}
      closeSheet();render();};};
  $('cX').onclick=()=>{closeSheet();confirmSheet('Hapus bab ini?',`"${chLabel(c,i)}" akan dihapus permanen.`,'Hapus bab',async()=>{await del('chapters',c.id);render();});};
}

/* ---------- Editor (autosave aman) ---------- */
async function viewEditor(){
  const n=await getOne('novels',route.novelId),c=await getOne('chapters',route.chapterId);
  if(!n||!c)return go('library');
  const idx=(await chaptersOf(n.id)).findIndex(x=>x.id===c.id);c.title=ownTitle(c);
  title.textContent=n.title;
  main.innerHTML=`<div class="enum">Bab ${idx+1}</div><textarea class="etitle sl grow" id="eT" rows="1" data-next="eB" enterkeyhint="next" placeholder="Judul bab (boleh kosong)" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false">${esc(c.title)}</textarea><textarea class="ebody" id="eB" placeholder="Mulai menulis…">${esc(c.content)}</textarea>
    <div class="ebar" id="ebar"><div class="eline"><span id="st" class="ok">Tersimpan</span><span id="wc">${plural(words(c.content),'kata')}</span></div><div id="eTools"></div></div>`;
  const t=$('eT'),b=$('eB'),st=$('st');let timer=null,dirty=false,saving=Promise.resolve();
  const fit=()=>{b.style.height='auto';b.style.height=Math.max(b.scrollHeight,window.innerHeight*.55)+'px';};
  fit();
  function mark(cls,txt){st.className=cls;st.textContent=txt;}
  let lastW=words(c.content);
  function save(){
    clearTimeout(timer);if(!dirty)return saving;
    dirty=false;c.title=t.value;c.content=b.value;c.updatedAt=Date.now();n.updatedAt=c.updatedAt;
    const w=words(c.content);if(w>lastW)addWords(w-lastW);lastW=w;
    const snap={...c},nsnap={...n};
    saving=Promise.all([put('chapters',snap),put('novels',nsnap)])
      .then(()=>{if(!dirty)mark('ok','Tersimpan');})
      .catch(()=>{dirty=true;mark('err','Gagal menyimpan!');});
    return saving;
  }
  const change=()=>{dirty=true;mark('wait','Menyimpan…');$('wc').textContent=plural(words(b.value),'kata');clearTimeout(timer);timer=setTimeout(save,600);};
  const ub=$('hUn'),rb=$('hRe');ub.onmousedown=rb.onmousedown=e=>e.preventDefault();let hs=[c.content||''],hi=0,ht=null;
  const hb=()=>{ub.disabled=hi<=0;rb.disabled=hi>=hs.length-1;};hb();
  const hpush=()=>{const v=b.value;if(v===hs[hi])return;hs=hs.slice(0,hi+1);hs.push(v);hi=hs.length-1;if(hs.length>60){hs.shift();hi--;}hb();};
  const hgo=d=>{clearTimeout(ht);hpush();const j=hi+d;if(j<0||j>=hs.length)return;hi=j;b.value=hs[hi];fit();hb();change();};
  ub.onclick=()=>hgo(-1);rb.onclick=()=>hgo(1);
  $('eTools').appendChild(mdBar(b,{snap:()=>{clearTimeout(ht);hpush();},notes:true,onNotes:()=>novelNotesSheet(n)}));
  const unKb=followKb($('ebar'));
  t.oninput=change;b.oninput=()=>{change();fit();clearTimeout(ht);ht=setTimeout(hpush,1000);};
  b.addEventListener('beforeinput',e=>{if(autoIndent()&&e.inputType==='insertLineBreak'){e.preventDefault();document.execCommand('insertText',false,'\n\t');}});
  const hide=()=>{if(document.visibilityState==='hidden')save();};
  document.addEventListener('visibilitychange',hide);window.addEventListener('pagehide',save);
  flush=()=>{save();unKb();document.removeEventListener('visibilitychange',hide);window.removeEventListener('pagehide',save);};
  if(!c.content)b.focus();
}

/* ---------- Pembaca ---------- */
const RT={putih:{bg:'#FFFFFF',ink:'#1E2530',dim:'#6B7684',line:'#E4E8EE',surface:'#F2F4F7'},krem:{bg:'#F1E3C6',ink:'#4B3621',dim:'#7A6548',line:'#DAC48E',surface:'#E9D9AC'},hijau:{bg:'#DCE8D2',ink:'#28331F',dim:'#5C6F4E',line:'#BFD4AE',surface:'#CFE0C2'},biru:{bg:'#CFE0EC',ink:'#1E2A33',dim:'#51697A',line:'#B0CBDA',surface:'#C2D7E4'},gelap:{bg:'#12151C',ink:'#E6EAF0',dim:'#98A3B3',line:'#2A303C',surface:'#1B2029'}};
const RCOL={putih:'#FFFFFF',krem:'#F1E3C6',hijau:'#DCE8D2',biru:'#CFE0EC',gelap:'#2B2F36'};
const rs={light:ls.get('novea_rlight')||'putih',step:ls.get('novea_rstep')||0,mode:ls.get('novea_rmode')||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'),lh:ls.get('novea_rlh2')||1.6};
/* Mode (terang/gelap) satu untuk seluruh aplikasi. Latar baca: gelap kalau mode gelap; kalau terang, warna terang pilihan pengguna (putih/krem/hijau/biru). */
const rTheme=()=>rs.mode==='dark'?'gelap':rs.light;
function applyMode(){const d=rs.mode==='dark';document.documentElement.dataset.theme=d?'dark':'light';const mt=document.querySelector('meta[name=theme-color]');if(mt)mt.content=d?'#0F1621':'#F3F7FB';}
function setMode(m){rs.mode=m;ls.set('novea_rmode',m);
  applyMode();if(route.name==='reader'){applyRTheme();updMode();}if(route.name==='settings')viewSettings();}
const IC={list:ic('list'),gear:ic('gear'),sun:ic('sun'),moon:ic('moon'),undo:ic('arrow-counterclockwise'),redo:ic('arrow-clockwise'),sort:ic('arrow-up')};
let curR=null,rbar=null,lastY=0;
const applyRTheme=()=>{const t=RT[rTheme()]||RT.putih,r=document.documentElement.style;r.setProperty('--bg',t.bg);r.setProperty('--ink',t.ink);r.setProperty('--dim',t.dim);r.setProperty('--line',t.line);r.setProperty('--surface',t.surface);};
const clearRTheme=()=>['--bg','--ink','--dim','--line','--surface'].forEach(p=>document.documentElement.style.removeProperty(p));
function setChrome(show){rbar.classList.toggle('hide',!show);if(show)lastY=window.scrollY;}
function updMode(){$('rbM').innerHTML=(rs.mode==='dark'?IC.moon:IC.sun)+`<span>${rs.mode==='dark'?'Gelap':'Terang'}</span>`;}
function readerUI(on){
  if(!rbar){
    rbar=document.createElement('nav');rbar.className='rbar';
    rbar.innerHTML=`<button id="rbC">${IC.list}<span>Konten</span></button><button id="rbM"></button><button id="rbS">${IC.gear}<span>Pengaturan</span></button>`;
    document.body.appendChild(rbar);
    $('rbC').onclick=rContents;$('rbS').onclick=rSettings;
    $('rbM').onclick=()=>setMode(rs.mode==='dark'?'light':'dark');
    addEventListener('scroll',()=>{if(route.name==='reader'&&!rbar.classList.contains('hide')&&Math.abs(window.scrollY-lastY)>40)setChrome(false);},{passive:true});
  }
  rbar.hidden=!on;rbar.classList.remove('hide');$('bar').classList.remove('hide');main.onclick=null;
  if(on){applyRTheme();updMode();lastY=0;}else clearRTheme();
}
let cSort='asc';
function rContents(){
  const {n,chs,i}=curR,last=chs.reduce((m,c)=>Math.max(m,c.updatedAt||0),n.updatedAt||0);
  openSheet(`<div class="chead">${coverEl(n)}<div class="cinfo"><div class="ct">${esc(n.title)}</div><div class="ca">${esc(n.author)||'Tanpa nama penulis'} | Diperbarui ${new Date(last).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</div></div></div>
    <textarea class="search sl" id="sq" rows="1" wrap="off" enterkeyhint="search" placeholder="Cari bab, isi cerita, atau nomor…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
    <div class="cmeta"><span id="cn"></span><button id="cs">${IC.sort}<span></span></button></div>
    <div class="list" id="cl" style="max-height:44vh;overflow-y:auto"></div>`);
  const draw=()=>{
    const q=$('sq').value.trim().toLowerCase();
    const items=chs.map((c,k)=>({c,k})).filter(x=>chHit(x.c,x.k,q));if(cSort==='desc')items.reverse();
    $('cn').textContent=plural(items.length,'bab');$('cs').innerHTML=ic(cSort==='asc'?'arrow-up':'arrow-down')+'<span>'+(cSort==='asc'?'Menaik':'Menurun')+'</span>';
    $('cl').innerHTML=items.length?items.map(x=>`<div class="row"><button class="main ${x.k===i?'cur':''}" data-k="${x.k}"><b>${esc(chLabel(x.c,x.k))}</b></button></div>`).join(''):`<div class="empty" style="padding:28px 16px">Tidak ada bab yang cocok.</div>`;
    $('cl').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{closeSheet();goReplace('reader',n.id,chs[+b.dataset.k].id);});
  };
  $('sq').oninput=draw;$('cs').onclick=()=>{cSort=cSort==='asc'?'desc':'asc';draw();};draw();
  const cur=$('cl').querySelector('.cur');if(cur)cur.scrollIntoView({block:'center'});
}
const LH=[1.3,1.4,1.5,1.6,1.7,1.8,1.9];
function track(el,n,set){
  const pick=e=>{const r=el.getBoundingClientRect();set(Math.max(0,Math.min(n-1,Math.round((e.clientX-r.left)/r.width*(n-1)))));};
  el.onpointerdown=e=>{el.setPointerCapture(e.pointerId);pick(e);el.onpointermove=pick;};
  el.onpointerup=el.onpointercancel=()=>{el.onpointermove=null;};
}
function rLH(){
  openSheet(`<h3>Lainnya</h3><div class="rlab">Jarak baris</div><div class="fsz"><button id="lhM" aria-label="Lebih rapat">−</button><div class="fdots" id="ld"></div><button id="lhP" aria-label="Lebih renggang">+</button></div><div class="fcur" id="lc"></div>
    <p class="xs" style="margin:14px 0 0;text-align:center">Jarak baris ikut menyesuaikan otomatis saat ukuran font diubah.</p><button class="btn sec" id="lhB">Kembali</button>`);
  let k=LH.findIndex(v=>Math.abs(v-rs.lh)<.01);if(k<0)k=3;
  const upd=()=>{rs.lh=LH[k];ls.set('novea_rlh2',rs.lh);
    $('ld').innerHTML=LH.map((_,j)=>`<i class="${j===3?'mid ':''}${j===k?'on':''}"></i>`).join('');
    $('lc').textContent=(k===3?'Standar · ':'')+String(rs.lh).replace('.',',');
    $('lhM').disabled=k<=0;$('lhP').disabled=k>=LH.length-1;applyType();};
  $('lhM').onclick=()=>{k--;upd();};track($('ld'),LH.length,j=>{k=j;upd();});$('lhP').onclick=()=>{k++;upd();};$('lhB').onclick=rSettings;upd();
}
const chHit=(c,i,q)=>{if(!q)return true;const num=q.match(/^(?:bab\s*)?(\d+)$/);return num?String(i+1)===num[1]:(chLabel(c,i)+' '+(c.content||'')).toLowerCase().includes(q);};
/* Jarak baris: rasio dasar pilihan pengguna, dikurangi sedikit saat font membesar (dan dilonggarkan saat mengecil). */
function applyType(){const t=document.querySelector('.rtext');if(t){t.style.setProperty('--rstep',rs.step);t.style.setProperty('--rlh',(rs.lh-rs.step*0.02).toFixed(3));}}
function rSettings(){
  const ths=['putih','krem','hijau','biru'].concat(rs.mode==='dark'?['gelap']:[]);
  openSheet(`<h3>Pengaturan baca</h3><div class="rlab">Latar belakang</div>
    <div class="rth" id="rth">${ths.map(k=>`<button data-t="${k}" class="${k===rTheme()?'on':''}" style="background:${RCOL[k]}" aria-label="${k}">${k==='gelap'?IC.moon:''}</button>`).join('')}<button class="more" id="rMore">Lainnya${ic('chevron-right')}</button></div>
    <div class="rlab">Ukuran font</div><div class="fsz"><button id="fsM" aria-label="Perkecil">A−</button><div class="fdots" id="fd"></div><button id="fsP" aria-label="Perbesar">A+</button></div><div class="fcur" id="fc"></div>`);
  $('rth').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const t=b.dataset.t;if(t==='gelap')setMode('dark');else{rs.light=t;ls.set('novea_rlight',t);setMode('light');}rSettings();});
  $('rMore').onclick=rLH;
  const upd=()=>{
    $('fd').innerHTML=Array.from({length:11},(_,k)=>`<i class="${k===5?'mid ':''}${k-5===rs.step?'on':''}"></i>`).join('');
    $('fc').textContent=rs.step===0?'Standar':(rs.step>0?'+':'')+rs.step;
    $('fsM').disabled=rs.step<=-5;$('fsP').disabled=rs.step>=5;ls.set('novea_rstep',rs.step);
    applyType();};
  track($('fd'),11,j=>{rs.step=j-5;upd();});$('fsM').onclick=()=>{rs.step=Math.max(-5,rs.step-1);upd();};$('fsP').onclick=()=>{rs.step=Math.min(5,rs.step+1);upd();};
  upd();
}
async function viewReader(){
  const n=await getOne('novels',route.novelId);if(!n)return go('library');
  const chs=await chaptersOf(n.id),i=chs.findIndex(c=>c.id===route.chapterId);
  if(i<0)return go('novel',n.id);
  const c=chs[i],w=words(c.content);curR={n,chs,i};
  title.textContent=n.title;ls.set('novea_lastread',{novelId:n.id,chapterId:c.id});ls.set('novea_dismissed',null);
  main.innerHTML=`<h2 class="rtitle">${esc(chLabel(c,i))}</h2><div class="rmeta">Bab ${i+1} dari ${chs.length} · ${plural(w,'kata')}</div>
    <div class="rtext">${mdParas(c.content)||'(Bab ini masih kosong.)'}</div>
    <div class="rnav"><button class="btn sec" id="rP" ${i?'':'disabled'}>Sebelumnya</button><button class="btn main" id="rN" ${i<chs.length-1?'':'disabled'}>Berikutnya</button></div>`;
  applyType();
  if(i)$('rP').onclick=()=>goReplace('reader',n.id,chs[i-1].id);
  if(i<chs.length-1)$('rN').onclick=()=>goReplace('reader',n.id,chs[i+1].id);
  main.onclick=e=>{if(e.target.closest('button'))return;setChrome(rbar.classList.contains('hide'));};
}

applyMode();applyUi();
render();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
