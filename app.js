/* Логика сайта: главная, фильтры, страницы проектов, просмотр фото. Обычно менять не нужно. */
const tagLine = p => p.cats.map(c=>CATS[c]).join(", ");
const ph = (ratio, kind, label) => `<div class="ph${kind==="design"?" d":""}" style="aspect-ratio:${ratio}"><span>${label}</span></div>`;

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const thumb = p => p.coverVid && !reduce ? `<img class="img" src="${p.coverVid.replace(/\.mp4$/,".webp")}" alt="${p.t}" decoding="async" style="aspect-ratio:${p.r}">`
  : p.cover ? `<img class="img" src="${p.cover}" alt="${p.t}" loading="lazy" style="aspect-ratio:${p.r}">` : ph(p.r,p.kind,p.kind==="photo"?"кадр":"обложка");
const card = p => `<a class="card" href="#${p.id}">${thumb(p)}
  <div class="cap"><span class="t">${p.t}</span><span class="y">${p.y}</span></div><span class="m it">${tagLine(p)}</span></a>`;

/* ---------- сетка всех работ ---------- */
let filter = "all";
const byId = id => P.find(p=>p.id===id);
const ratio = p => { const [w,h]=p.r.split("/").map(Number); return h/w; };
function worksGrid(n){
  if(matchMedia("(max-width:560px)").matches) n = 1;
  const counts = {}; P.forEach(p=>p.cats.forEach(c=>counts[c]=(counts[c]||0)+1));
  const ok = p => filter==="all" || p.cats.includes(filter);
  const btn = (k,l,c) => `<li><button type="button" data-f="${k}" aria-pressed="${filter===k}"><span class="it">${l}</span><sup>${c}</sup></button></li>`;
  const known = new Set(ORDER_A.flat());
  const rest = P.filter(p=>!known.has(p.id));
  let cols, wide = false;
  if(n===1){
    const a=ORDER_B[0], b=ORDER_B[1], seq=[]; for(let i=0;i<Math.max(a.length,b.length);i++){ if(b[i]) seq.push(b[i]); if(a[i]) seq.push(a[i]); }
    cols = [seq.map(byId).filter(Boolean).concat(rest).filter(ok)];
  } else if(filter==="all"){
    /* «все работы»: узкая колонка вертикальных обложек и широкая горизонтальных */
    wide = true;
    cols = ORDER_A.map(c=>c.map(byId).filter(Boolean).map(p=>A_RATIO[p.id]?{...p,...A_RATIO[p.id]}:p));
    rest.forEach(p=>cols[ratio(p)>1?0:1].push(p));
  } else {
    /* фильтры: равные колонки; для части фильтров порядок задан вручную, остальные выравниваем по высоте */
    if(FILTER_ORDER[filter]){
      cols = FILTER_ORDER[filter].map(c=>c.map(byId).filter(Boolean).filter(ok));
      const placed = new Set(FILTER_ORDER[filter].flat());
      P.filter(p=>ok(p)&&!placed.has(p.id)).forEach(p=>cols[0].length<=cols[1].length?cols[0].push(p):cols[1].push(p));
    } else {
      const list = ORDER_B[0].concat(ORDER_B[1]).map(byId).filter(Boolean).concat(rest).filter(ok);
      cols = [[],[]]; const h=[0,0]; list.forEach(p=>{const i=h[0]<=h[1]?0:1; cols[i].push(p); h[i]+=ratio(p)+0.12;});
    }
  }
  return `<ul class="filters" aria-label="Фильтр по направлениям">${btn("all","все работы",P.length)}${Object.keys(CATS).filter(k=>counts[k]).map(k=>btn(k,CATS[k],counts[k])).join("")}</ul>
    <div class="cols${wide?" va":""}" style="--n:${n}">${cols.map(c=>`<div class="col">${c.map(card).join("")}</div>`).join("")}</div>`;
}

/* ---------- страница проекта ---------- */
let gallery = [], galleryKind = "photo";
function projectMeta(p, withBack){
  return `<div class="p-head">
      ${withBack?`<a class="back" href="#"><span>←</span><span class="it">все работы</span></a>`:""}
      <h1 class="p-title">${p.t}</h1>
      ${p.sub?`<p class="p-sub it">${p.sub}</p>`:""}
      <dl class="meta">${(p.meta||[["Год",p.y],["Роль",p.role],["Клиент",p.client],["Тип",`<span class="it">${tagLine(p)}</span>`]]).map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
      <div class="p-text">${p.desc ? p.desc.map(t=>`<p>${t}</p>`).join("") : p.kind==="photo"
        ? `<p>Здесь будет 2–4 предложения о концепции серии: идея, настроение, где и с кем снимали.</p><p class="muted">Команда: модель, стилист, визажист. Имена через запятую.</p>`
        : `<p>Здесь будет короткое описание проекта в 2–3 предложения: что за продукт и какая стояла задача.</p>`}</div>
    </div>`;
}
function realBody(p){
  flipSets = []; gallery = []; galleryKind = p.kind; const D = p.dir || FC;
  const media = (type, src, r, poster, label) => {
    const i = gallery.length; gallery.push({type, src, poster, r});
    const el = type==="img"
      ? `<img class="media" src="${src}" alt="${p.t}, ${label||"изображение "+(i+1)}" loading="${i<2?"eager":"lazy"}" style="aspect-ratio:${r}">`
      : `<video class="media" src="${src}" poster="${poster}" ${reduce?"":"autoplay"} muted loop playsinline preload="metadata" style="aspect-ratio:${r}" aria-label="${p.t}, анимация"></video>`;
    return `<button type="button" data-i="${i}" aria-label="Открыть изображение ${i+1}">${el}</button>`;
  };
  const html = p.comp.map(m=>{
    const pos = m.s ? `grid-column:${m.s}/span ${m.n}` : "grid-column:1/-1";
    const cls = [m.bleed?"bleed":"", m.paper?"paper":"", m.cls||""].join(" ").trim();
    if(m.t==="toc") return `<div class="ctoc" style="${pos}"><div class="lab2"><span class="it">структура книги</span><span class="muted">оглавление на развороте ниже, с. 7</span></div>
      <ol>${p.toc.map(([n,t,ch])=>`<li style="display:contents"><span class="muted">${n}</span><span${ch?' style="font-family:var(--sans);font-size:14px;font-weight:500;text-transform:uppercase;letter-spacing:.015em;padding-top:8px"':""}>${t}</span></li>`).join("")}</ol></div>`;
    if(m.t==="ch" && !Array.isArray(p.chapters[m.n])){ const c = p.chapters[m.n];
      return `<section class="chap plain" aria-label="${c.title}"><h2>${c.title}</h2>${c.text&&c.text.length?`<div class="ctext">${c.text.map(t=>`<p>${t}</p>`).join("")}</div>`:""}</section>`; }
    if(m.t==="ch"){ const [num,title,subs] = p.chapters[m.n];
      return `<section class="chap" aria-label="${title}"><span class="num it">${num||"&nbsp;"}</span><h2>${title}</h2><ul class="plain subs">${subs.map(x=>`<li>${x}</li>`).join("")}</ul></section>`; }
    if(m.t==="flip"){ const id = flipSets.length; const data = p.flips[m.g].map(x=>({src:D+x[0], r:x[2], th:D+(x[3]||x[0])}));
      flipSets.push({data, idx:0});
      return `<section class="flip" data-fid="${id}" tabindex="0" aria-label="Листалка: ${p.chapters[m.g].title}">
        <div class="flip-stage"><img class="flip-img" alt="" style="aspect-ratio:${data[0].r}">
          <button type="button" class="flip-hit prev" data-flip="-1" aria-label="Предыдущий разворот"></button>
          <button type="button" class="flip-hit next" data-flip="1" aria-label="Следующий разворот"></button></div>
        <div class="flip-bar"><div class="arrows"><button type="button" data-flip="-1" class="flip-prev">← назад</button><button type="button" data-flip="1" class="flip-next">вперёд →</button></div>
          <span class="flip-count"></span></div>
        <div class="flip-strip" role="list">${data.map((x,i)=>`<button type="button" role="listitem" data-flip-to="${i}" aria-label="Разворот ${i+1}"><img src="${x.th}" alt="" loading="lazy" style="aspect-ratio:${x.r}"><span>${i+1}</span></button>`).join("")}</div>
      </section>`; }
    if(m.t==="pp") return `<div class="pp"><div>${media("img",D+m.items[0][0],m.items[0][1])}</div><div class="mk">${media("img",D+m.items[1][0],m.items[1][1])}</div></div>`;
    if(m.t==="vs"){ const c = m.n!=null ? p.chapters[m.n] : null;
      const head = c ? `<div class="vs-t"><h2>${c.title}</h2>${c.text?`<div class="ctext">${c.text.map(t=>`<p>${t}</p>`).join("")}</div>`:""}</div>` : "<div></div>";
      return `<section class="vs${m.side==="r"?" r":""}${m.items.length===4?" v4":""}${c?" hd":""}"${c?` aria-label="${c.title}"`:""}><div class="vs-v">${media("vid",D+m.v,"798/1608",D+m.v.replace(".mp4","-poster.jpg"))}</div><div class="vs-r">${head}<div class="vs-g${m.items.length===4?" n4":""}">${m.items.map(f=>`<div>${media("img",D+f,"440/888")}</div>`).join("")}</div></div></section>`; }
    if(m.t==="scr") return `<div class="scr" style="--c:${m.c||m.items.length}">${m.items.map(f=>{ const v=f.endsWith(".mp4"); return `<div>${media(v?"vid":"img",D+f,v?"798/1608":"440/888",v?D+f.replace(".mp4","-poster.jpg"):null)}</div>`; }).join("")}</div>`;
    if(m.t==="row") return `<div class="erow${m.join?" join":""}">${m.items.map(([f,r])=>{ const [w,h]=r.split("/").map(Number); return `<div style="flex:${(w/h).toFixed(4)} 1 0">${media("img",D+f,r)}</div>`; }).join("")}</div>`;
    if(m.t==="quote") return `<p class="quote">${p.quote[0]} <span class="it">${p.quote[1]}</span><span class="quote-src it">${p.quote[2]}</span></p>`;
    if(m.t==="trio") return `<div class="trio">${m.items.map(([f,r,c])=>`<figure class="paper">${media("img",D+f,r,null,c)}<figcaption class="it">${c}</figcaption></figure>`).join("")}</div>`;
    const src = m.t==="img" ? D+m.f : D+m.f+".mp4";
    return `<div class="${cls}" style="${pos}">${media(m.t, src, m.r, m.t==="vid"?D+m.f+"-poster.jpg":null)}</div>`;
  }).join("");
  return `<div class="comp">${html}</div>`;
}
function projectBody(p){
  if(p.comp){ const i = P.indexOf(p), prev = P[(i-1+P.length)%P.length], next = P[(i+1)%P.length];
    return realBody(p) + `<nav class="pager pnav" aria-label="Другие проекты">
      <a href="#${prev.id}"><span class="it muted">← предыдущий</span><span class="t">${prev.t}</span></a>
      <a href="#${next.id}"><span class="it muted">следующий →</span><span class="t">${next.t}</span></a></nav>`; }
  const imgs = p.kind==="photo"
    ? [["3/2","full"],["4/5",""],["4/5",""],["3/2","full"],["4/5",""],["2/3",""],["16/9","full"]]
    : [["16/9","full"],["step","задача","Какую проблему решали и для кого. Здесь пара фраз из вашего текста."],["4/3",""],["4/3",""],
       ["step","исследование и идея","Что изучили, к какому образу пришли и почему."],["3/2","full"],
       ["step","решение","Из чего состоит итоговая система: знак, шрифт, цвет, носители."],["1/1",""],["1/1",""],["16/9","full"]];
  gallery = imgs.filter(x=>x[0]!=="step").map(x=>({type:"ph",r:x[0]})); galleryKind = p.kind;
  let n = 0;
  const html = imgs.map(x=>{
    if(x[0]==="step") return `<div class="step"><h3><span class="it">${x[1]}</span></h3><p>${x[2]}</p></div>`;
    const i = n++; return `<button type="button" class="${x[1]}" data-i="${i}" aria-label="Открыть изображение ${i+1}">${ph(x[0],p.kind,`изображение ${i+1}`)}</button>`;
  }).join("");
  const i = P.indexOf(p), prev = P[(i-1+P.length)%P.length], next = P[(i+1)%P.length];
  return `<div class="gallery">${html}</div>
    <nav class="pager" aria-label="Другие проекты">
      <a href="#${prev.id}"><span class="it muted">← предыдущий</span><span class="t">${prev.t}</span></a>
      <a href="#${next.id}"><span class="it muted">следующий →</span><span class="t">${next.t}</span></a>
    </nav>`;
}
const counter = p => `<span class="p-foot">${String(P.indexOf(p)+1).padStart(2,"0")} / ${String(P.length).padStart(2,"0")}</span>`;

function projectPage(p){
  const meta = p.meta||[["Год",p.y],["Роль",p.role],["Клиент",p.client],["Тип",`<span class="it">${tagLine(p)}</span>`]];
  const desc = p.desc || [p.kind==="photo" ? "Здесь будет 2–4 предложения о концепции серии: идея, настроение, где и с кем снимали." : "Здесь будет короткое описание проекта в 2–3 предложения: что за продукт и какая стояла задача."];
  return `<header class="ptop">
      <div class="l"><a class="name" href="#">Мария Токтуева</a><a href="#"><span class="it">← все работы</span></a><a href="#about">Обо мне</a></div>
      <div class="r"><a href="mailto:toktuevamaria@gmail.com"><span class="it">toktuevamaria@gmail.com</span></a><a href="https://t.me/mariatoktueva" target="_blank" rel="noopener"><span class="it">telegram</span></a></div>
    </header>
    <section class="phead">
      <div class="ttl"><h1>${p.t}</h1>${p.sub?`<p class="sub it">${p.sub}</p>`:""}
        <dl class="meta">${meta.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl></div>
      <div class="desc">${desc.map(t=>`<p>${t}</p>`).join("")}</div>
    </section>
    <main>${projectBody(p)}</main>
`;
}
function sideA(view){
  const nav = [["#","Работы",view==="home"],["#about","Обо мне",view==="about"]];
  return `<aside class="side">
    <div class="blk">
      <p class="name">Мария Токтуева</p>
      <p class="bio">${BIO_SHORT}</p>
      <nav class="nav" aria-label="Разделы">${nav.map(([h,l,c])=>`<a href="${h}"${c?' aria-current="page"':""}>${l}</a>`).join("")}</nav>
    </div>
    <div class="blk">${F.contacts}</div>
  </aside>`;
}
function viewA(route, p){
  if(p) return projectPage(p);
  if(route==="about") return `<div class="frame">${sideA("about")}<main class="content"><div class="about">
      <img class="me" src="img/about/me2.jpg" alt="Мария Токтуева" style="aspect-ratio:1086/1448"><div class="long">${BIO_LONG.map(t=>`<p>${t}</p>`).join("")}</div>
      <div class="facts2">${F.dirs}${F.edu}${F.tools}${F.cv}</div></div></main></div>`;
  return `<div class="frame">${sideA("home")}<main class="content">${worksGrid(2)}</main></div>`;
}

/* ---------- типограф: никаких висячих предлогов, союзов и тире ---------- */
function typograph(root){
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const short = /(^|[\s («"„])([А-Яа-яЁёA-Za-z]{1,2})[ \t\n]+(?=\S)/g;
  for(let n; (n = w.nextNode());){
    let t = n.nodeValue;
    if(!/\S/.test(t)) continue;
    t = t.replace(short, "$1$2 ").replace(short, "$1$2 ")   // twice: «и в доме»
         .replace(/\s+([—–])/g, " $1")                              // dash stays with the previous word
         .replace(/(\d)\s+(?=[А-Яа-яЁё%])/g, "$1 ");                 // 300 изображений, 25 мм
    if(t !== n.nodeValue) n.nodeValue = t;
  }
}

/* автозапуск «гифок»: iOS (режим энергосбережения), встроенные браузеры Telegram/Instagram
   могут запретить autoplay — тогда подменяем видео на анимированный WebP */
function swapVid(v){ if(!v.dataset.alt||!v.isConnected) return; const i=document.createElement("img");
  i.className=v.className; i.src=v.dataset.alt; i.alt=v.getAttribute("aria-label")||""; i.style.cssText=v.style.cssText; i.decoding="async"; v.replaceWith(i); }
function kickVids(root=document){
  root.querySelectorAll("video[autoplay]").forEach(v=>{
    v.muted=true; v.defaultMuted=true; v.playsInline=true; v.controls=false;
    const pr=v.play(); if(pr&&pr.catch) pr.catch(e=>{ if(!e||e.name!=="AbortError") swapVid(v); });
  });
}
["touchstart","click","visibilitychange"].forEach(ev=>document.addEventListener(ev,()=>{ if(!document.hidden) document.querySelectorAll("video[autoplay]").forEach(v=>{ if(v.paused) v.play().catch(()=>{}); }); },{passive:true}));
/* ---------- роутинг ---------- */
const app = document.getElementById("app");
function render(){
  const h = location.hash.slice(1);
  const p = P.find(x=>x.id===h);
  const route = p ? "project" : (h==="about" ? "about" : "home");
  app.innerHTML = viewA(route,p);
  document.title = p ? p.t+" · Мария Токтуева" : route==="about" ? "Обо мне · Мария Токтуева" : "Мария Токтуева";
  typograph(app);
  app.querySelectorAll(".flip").forEach(el=>flipShow(el,0,true));
  closeLb();
  kickVids(app);
}
window.addEventListener("hashchange",()=>{render();window.scrollTo(0,0);});
app.addEventListener("click",e=>{
  const f = e.target.closest("[data-f]");
  if(f){ filter = f.dataset.f; const y = window.scrollY; render(); window.scrollTo(0,y); return; }
  const g = e.target.closest("[data-i]");
  if(g) openLb(+g.dataset.i);
});

/* ---------- листалка ---------- */
let flipSets = [];
function flipShow(el, i, initial){
  const st = flipSets[+el.dataset.fid]; if(!st) return;
  st.idx = Math.max(0, Math.min(st.data.length-1, i));
  const d = st.data[st.idx], img = el.querySelector(".flip-img");
  img.src = d.src; img.alt = "Разворот " + (st.idx+1); img.style.aspectRatio = d.r;
  el.querySelector(".flip-count").textContent = `${st.idx+1} / ${st.data.length}`;
  el.querySelector(".flip-prev").disabled = st.idx===0;
  el.querySelector(".flip-next").disabled = st.idx===st.data.length-1;
  el.querySelectorAll("[data-flip-to]").forEach((b,k)=>{ b.setAttribute("aria-current", k===st.idx);
    if(k===st.idx && !initial){ const strip = b.parentElement; strip.scrollTo({left: b.offsetLeft - strip.clientWidth/2 + b.clientWidth/2, behavior: reduce?"auto":"smooth"}); } });
  const n = st.data[st.idx+1]; if(n && !initial){ const pre = new Image(); pre.src = n.src; }
}
const flipOf = t => t.closest && t.closest(".flip");
app.addEventListener("click",e=>{
  const el = flipOf(e.target); if(!el) return; const st = flipSets[+el.dataset.fid];
  const f = e.target.closest("[data-flip]"); if(f){ flipShow(el, st.idx + +f.dataset.flip); return; }
  const t = e.target.closest("[data-flip-to]"); if(t){ flipShow(el, +t.dataset.flipTo); }
});
app.addEventListener("keydown",e=>{
  const el = flipOf(e.target); if(!el) return; const st = flipSets[+el.dataset.fid];
  if(e.key==="ArrowRight"){ flipShow(el, st.idx+1); e.preventDefault(); }
  if(e.key==="ArrowLeft"){ flipShow(el, st.idx-1); e.preventDefault(); }
});
let touchX = null;
let touchEl = null;
app.addEventListener("touchstart",e=>{ if(e.target.closest(".flip-stage")){ touchX = e.touches[0].clientX; touchEl = flipOf(e.target); } },{passive:true});
app.addEventListener("touchend",e=>{ if(touchX===null) return; const dx = e.changedTouches[0].clientX - touchX; touchX = null; if(Math.abs(dx)>40 && touchEl) flipShow(touchEl, flipSets[+touchEl.dataset.fid].idx + (dx<0?1:-1)); });

/* ---------- лайтбокс ---------- */
const lb = document.getElementById("lb"); let cur = 0, lastFocus = null;
function drawLb(){
  const g = gallery[cur]; const [w,h] = g.r.split("/").map(Number);
  const box = document.getElementById("lb-img");
  box.style.width = Math.min(window.innerWidth*0.84, 2000, window.innerHeight*0.84*w/h) + "px";
  box.innerHTML = g.type==="img" ? `<img class="lb-media" src="${g.src}" alt="">`
    : g.type==="vid" ? `<video class="lb-media" src="${g.src}" poster="${g.poster}" autoplay muted loop playsinline></video>`
    : ph(g.r, galleryKind, `изображение ${cur+1}`);
  document.getElementById("lb-count").textContent = `${cur+1} / ${gallery.length}`;
}
function openLb(i){ cur=i; lastFocus=document.activeElement; lb.hidden=false; document.body.style.overflow="hidden"; drawLb(); document.getElementById("lb-close").focus(); }
function closeLb(){ if(lb.hidden) return; lb.hidden=true; document.body.style.overflow=""; if(lastFocus&&lastFocus.focus) lastFocus.focus(); }
const step = d => { cur=(cur+d+gallery.length)%gallery.length; drawLb(); };
document.getElementById("lb-close").onclick = closeLb;
document.getElementById("lb-prev").onclick = ()=>step(-1);
document.getElementById("lb-next").onclick = ()=>step(1);
window.addEventListener("keydown",e=>{ if(lb.hidden) return; if(e.key==="Escape") closeLb(); if(e.key==="ArrowRight") step(1); if(e.key==="ArrowLeft") step(-1); });
window.addEventListener("resize",()=>{ if(!lb.hidden) drawLb(); });

render();
