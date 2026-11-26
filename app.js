'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const FR={potret:{w:1080,h:1620,win:[90,680,900,740]},landskap:{w:1620,h:1080,win:[500,90,1080,900]}};
const IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
let theme=localStorage.getItem('sriti_theme')||'hijau',orient='potret',facing='user',stream=null,mirror=true,stat=null,busy=false,blob=null,fname='';
const imgs={};const frameImg=(t,o)=>imgs[t+o]||(imgs[t+o]=Object.assign(new Image(),{src:`frames/${t}-${o}.png`}));
const show=id=>{$$('.screen').forEach(s=>s.classList.toggle('on',s.id===id));scrollTo(0,0)};
function setTheme(t){theme=t;localStorage.setItem('sriti_theme',t);document.documentElement.dataset.theme=t;
 $('meta[name=theme-color]').content=t==='ungu'?'#2d0c5f':'#0a4628';$$('.chip').forEach(c=>c.classList.toggle('sel',c.dataset.t===t));
 $('#hero').src=`frames/${t}-landskap.png`;$('#c-potret').src=`frames/${t}-potret.png`;$('#c-landskap').src=`frames/${t}-landskap.png`}
$$('.chip').forEach(c=>c.onclick=()=>setTheme(c.dataset.t));
$$('.card').forEach(c=>c.onclick=()=>{orient=c.dataset.o;openCam()});
// ---- lukis (dipakai oleh pratonton DAN gambar disimpan, supaya sama) ----
const tmp=document.createElement('canvas');
function draw(ctx,src,sw,sh,t,o,z,mir){const f=FR[o],[wx,wy,ww,wh]=f.win;ctx.clearRect(0,0,f.w,f.h);ctx.save();ctx.beginPath();ctx.rect(wx,wy,ww,wh);ctx.clip();
 ctx.fillStyle='#222';ctx.fillRect(wx,wy,ww,wh);
 if(mir){ctx.translate(wx+ww/2,0);ctx.scale(-1,1);ctx.translate(-(wx+ww/2),0)}
 const co=Math.min(ww/sw,wh/sh),cv=Math.max(ww/sw,wh/sh),s=z<=1?co+(cv-co)*z:cv*(1+(z-1)*2);
 if(z<1){tmp.width=48;tmp.height=Math.max(8,Math.round(48*sh/sw));tmp.getContext('2d').drawImage(src,0,0,tmp.width,tmp.height);
  ctx.imageSmoothingQuality='high';const bw=sw*cv,bh=sh*cv;ctx.drawImage(tmp,wx+(ww-bw)/2,wy+(wh-bh)/2,bw,bh)}
 ctx.drawImage(src,wx+(ww-sw*s)/2,wy+(wh-sh*s)/2,sw*s,sh*s);ctx.restore();
 const fi=frameImg(t,o);if(fi.complete)ctx.drawImage(fi,0,0,f.w,f.h)}
const cv=$('#view'),cx=cv.getContext('2d'),vid=document.createElement('video');vid.playsInline=true;vid.muted=true;
function src(){if(stat)return{e:stat.e,w:stat.w,h:stat.h};if(vid.readyState>=2&&vid.videoWidth)return{e:vid,w:vid.videoWidth,h:vid.videoHeight};return null}
function loop(){if($('#cam').classList.contains('on')){const s=src();if(s)draw(cx,s.e,s.w,s.h,theme,orient,+$('#zoom').value,mirror&&!stat);else{cx.clearRect(0,0,cv.width,cv.height);const fi=frameImg(theme,orient);if(fi.complete)cx.drawImage(fi,0,0)}}requestAnimationFrame(loop)}
async function startCam(){stopCam();$('#camerr').hidden=true;
 try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:facing},width:{ideal:1920},height:{ideal:1440}},audio:false});
  vid.srcObject=stream;await vid.play();const fm=stream.getVideoTracks()[0].getSettings().facingMode;mirror=fm?fm==='user':facing==='user'}
 catch(e){$('#camerr').textContent='Kamera tidak dapat dibuka. Sila benarkan akses kamera atau guna butang Galeri.';$('#camerr').hidden=false}}
const stopCam=()=>{stream&&stream.getTracks().forEach(t=>t.stop());stream=null};
function openCam(){const f=FR[orient];cv.width=f.w;cv.height=f.h;$('#camtitle').textContent='Bingkai '+(orient==='potret'?'Potret':'Landskap');$('#zoom').value=1;stat=null;show('cam');startCam()}
$('#back').onclick=()=>{stopCam();show('home')};
$('#flip').onclick=()=>{if(stat){stat=null;return}facing=facing==='user'?'environment':'user';startCam()};
$('#file').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
 try{const b=await createImageBitmap(f,{imageOrientation:'from-image'});stat={e:b,w:b.width,h:b.height}}
 catch(_){const i=new Image();i.src=URL.createObjectURL(f);await i.decode();stat={e:i,w:i.naturalWidth,h:i.naturalHeight}}$('#zoom').value=1};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
$('#shot').onclick=async()=>{if(busy)return;const s0=src();if(!s0)return;busy=true;
 if(!stat)for(let n=3;n>0;n--){$('#count').textContent=n;await wait(1000)}$('#count').textContent='';
 const fl=$('#flash');fl.classList.remove('go');void fl.offsetWidth;fl.classList.add('go');
 const s=src()||s0,o=document.createElement('canvas'),f=FR[orient];o.width=f.w;o.height=f.h;
 draw(o.getContext('2d'),s.e,s.w,s.h,theme,orient,+$('#zoom').value,mirror&&!stat);
 o.toBlob(async b=>{blob=b;const d=new Date(),p=n=>String(n).padStart(2,'0');
  fname=`SRITIALFATIH2026_${theme}_${orient}_${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.jpg`;
  $('#out').src=URL.createObjectURL(b);stopCam();show('res');busy=false;
  await qput({name:fname,blob:b});flush()},'image/jpeg',.92)};
$('#retake').onclick=()=>{openCam()};
$('#save').onclick=async()=>{if(!blob)return;const file=new File([blob],fname,{type:'image/jpeg'});
 if(IOS&&navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file]})}catch(_){}return}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fname;document.body.appendChild(a);a.click();a.remove()};
// ---- simpanan luar talian + muat naik ke Google Drive ----
const db=new Promise((ok,no)=>{const r=indexedDB.open('sriti',1);r.onupgradeneeded=()=>r.result.createObjectStore('q',{keyPath:'name'});r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const tx=async(m,f)=>{const d=await db;return new Promise((ok,no)=>{const t=d.transaction('q',m);const r=f(t.objectStore('q'));t.oncomplete=()=>ok(r.result);t.onerror=()=>no(t.error)})};
const qput=o=>tx('readwrite',s=>s.put(o)).catch(()=>{}),qall=()=>tx('readonly',s=>s.getAll()).catch(()=>[]),qdel=n=>tx('readwrite',s=>s.delete(n));
const b64=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result.split(',')[1]);f.readAsDataURL(b)});
const say=t=>{$('#st-res').textContent=t;$('#st-home').textContent=t};
let flushing=false;
async function flush(){if(flushing)return;flushing=true;
 try{let q=await qall();if(!q.length){return}
  const url=(window.CONFIG||{}).UPLOAD_URL||'';
  if(!/^https:\/\/script\.google\.com\//.test(url)){say(`Menunggu: pautan Google Drive belum ditetapkan (${q.length} gambar disimpan dalam peranti)`);return}
  if(!navigator.onLine){say(`Menunggu sambungan internet (${q.length} gambar disimpan dalam peranti)`);return}
  say('Sedang menyimpan…');
  for(const it of q){try{const r=await fetch(url,{method:'POST',body:JSON.stringify({name:it.name,mime:'image/jpeg',data:await b64(it.blob)})});
   const j=await r.json();if(j.ok)await qdel(it.name);else throw 0}catch(_){q=await qall();say(`Menunggu sambungan internet (${q.length} gambar disimpan dalam peranti)`);return}}
  say('Gambar telah disimpan ✓')}finally{flushing=false}}
addEventListener('online',flush);setInterval(flush,30000);
// ---- pasang aplikasi ----
let dp=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#install').hidden=false});
$('#install').onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;$('#install').hidden=true}};
addEventListener('appinstalled',()=>{$('#install').hidden=true});
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
if(IOS&&!standalone)$('#iostip').hidden=false;
if(IOS){$('#save').textContent='Simpan ke Foto';$('#savetip').hidden=false}
setTheme(theme);Object.keys(FR).forEach(o=>['ungu','hijau'].forEach(t=>frameImg(t,o)));loop();flush();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
