/* 台灣華語 · shared layer used by every page of the app.
   - Display settings (reading aids, theme, voice speed), stored on this device
   - Saved Words, one list shared by Lessons, Stories and the Saved Words page
   - Pinyin / zhuyin engine, Taiwan voice, offline support and install prompt
   Everything lives in the browser's localStorage under keys that start with "tw.". */
(function(){
  'use strict';
  const TW = window.TW = {};
  const root = document.documentElement;

  /* ---------- Storage ---------- */
  const store = TW.store = {
    get(k,d){ try{ const v=localStorage.getItem(k); return v==null?d:JSON.parse(v); }catch(e){ return d; } },
    set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} },
    remove(k){ try{ localStorage.removeItem(k); }catch(e){} }
  };
  const KEYS = TW.KEYS = { mode:'tw.mode2', theme:'tw.theme', rate:'tw.rate', saved:'tw.saved',
    level:'tw.level', bg:'tw.bg', lessons:'tw.lessons' };

  /* ---------- Theme: auto (follows the phone), light or dark ---------- */
  TW.THEMES = [['auto','Auto'],['light','Light'],['dark','Dark']];
  TW.getTheme = () => store.get(KEYS.theme,'auto');
  TW.applyTheme = () => {
    const t = TW.getTheme();
    if(t==='light'||t==='dark') root.setAttribute('data-theme',t); else root.removeAttribute('data-theme');
    const dark = t==='dark' || (t==='auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    let m = document.querySelector('meta[name="theme-color"]');
    if(!m){ m=document.createElement('meta'); m.name='theme-color'; document.head.appendChild(m); }
    m.content = dark ? '#19130E' : '#F1E4D1';   // sand palette background
  };
  TW.setTheme = t => { store.set(KEYS.theme,t); TW.applyTheme(); };
  TW.applyTheme();   // runs in <head>, before the page is drawn, so there's no flash
  try{ matchMedia('(prefers-color-scheme: dark)').addEventListener('change',TW.applyTheme); }catch(e){}

  /* ---------- Reading aids: pinyin, zhuyin, both, or characters only ---------- */
  TW.MODES = [['py','拼音','Pinyin'],['zy','注音','Zhuyin'],['all','拼+注','Both'],['hz','漢字','Hanzi']];
  TW.getMode = () => store.get(KEYS.mode,'py');
  TW.setMode = m => store.set(KEYS.mode,m);

  /* ---------- Voice speed ---------- */
  TW.RATES = [[0.7,'Slow'],[0.85,'Normal'],[1,'Fast']];
  TW.getRate = () => store.get(KEYS.rate,0.85);
  TW.setRate = r => store.set(KEYS.rate,r);

  /* ---------- Saved Words (shared by every section) ----------
     Each item: {k, py, en, pos, lvl, note, src:'lesson'|'story', ref, title, at}
     k is the word as stored by its section (a '#' suffix marks a homograph). */
  const disp = k => String(k).split('#')[0];
  TW.saved = {
    all(){ const a=store.get(KEYS.saved,[]); return Array.isArray(a)?a:[]; },
    count(){ return this.all().length; },
    has(k){ return this.all().some(x=>x.k===k); },
    add(item){ const a=this.all().filter(x=>x.k!==item.k); a.push({...item,at:Date.now()}); store.set(KEYS.saved,a); return a; },
    remove(k){ const a=this.all().filter(x=>x.k!==k); store.set(KEYS.saved,a); return a; },
    toggle(item){ if(this.has(item.k)){ this.remove(item.k); return false; } this.add(item); return true; },
    disp
  };

  /* ---------- Keep every page in sync ----------
     Fires when another tab changes a setting, or when you come back to a page
     with the Back button (the browser may show a cached copy of the page). */
  const subs = [];
  TW.onSync = fn => subs.push(fn);
  const fire = () => { TW.applyTheme(); subs.forEach(fn=>{ try{ fn(); }catch(e){ console.error(e); } }); };
  window.addEventListener('storage', e => { if(!e.key || e.key.startsWith('tw.')) fire(); });
  window.addEventListener('pageshow', e => { if(e.persisted) fire(); });

  /* ---------- Pinyin → tone marks and zhuyin ---------- */
  const MARKS={a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù','ü':'ǖǘǚǜ'};
  TW.toneMark = function(syl){
    const t=+syl.slice(-1); let b=syl.slice(0,-1).replace('v','ü');
    if(!(t>=1&&t<=4)) return b;
    let idx=b.indexOf('a'); if(idx<0) idx=b.indexOf('e'); if(idx<0&&b.includes('ou')) idx=b.indexOf('o');
    if(idx<0){ for(let i=b.length-1;i>=0;i--){ if('iouü'.includes(b[i])){idx=i;break;} } }
    if(idx<0) return b;
    return b.slice(0,idx)+MARKS[b[idx]][t-1]+b.slice(idx+1);
  };
  const INI={b:'ㄅ',p:'ㄆ',m:'ㄇ',f:'ㄈ',d:'ㄉ',t:'ㄊ',n:'ㄋ',l:'ㄌ',g:'ㄍ',k:'ㄎ',h:'ㄏ',j:'ㄐ',q:'ㄑ',x:'ㄒ',zh:'ㄓ',ch:'ㄔ',sh:'ㄕ',r:'ㄖ',z:'ㄗ',c:'ㄘ',s:'ㄙ'};
  const FIN={a:'ㄚ',o:'ㄛ',e:'ㄜ',ai:'ㄞ',ei:'ㄟ',ao:'ㄠ',ou:'ㄡ',an:'ㄢ',en:'ㄣ',ang:'ㄤ',eng:'ㄥ',er:'ㄦ',ong:'ㄨㄥ',
   i:'ㄧ',ia:'ㄧㄚ',ie:'ㄧㄝ',iao:'ㄧㄠ',iu:'ㄧㄡ',iou:'ㄧㄡ',ian:'ㄧㄢ',in:'ㄧㄣ',iang:'ㄧㄤ',ing:'ㄧㄥ',iong:'ㄩㄥ',
   u:'ㄨ',ua:'ㄨㄚ',uo:'ㄨㄛ',uai:'ㄨㄞ',ui:'ㄨㄟ',uei:'ㄨㄟ',uan:'ㄨㄢ',un:'ㄨㄣ',uen:'ㄨㄣ',uang:'ㄨㄤ',ueng:'ㄨㄥ',
   v:'ㄩ',ve:'ㄩㄝ',van:'ㄩㄢ',vn:'ㄩㄣ'};
  const TONE=['','','ˊ','ˇ','ˋ'];
  TW.zhuyin = function(syl){
    const t=+syl.slice(-1); let b=syl.slice(0,-1).replace('ü','v');
    let out='';
    if(/^(zh|ch|sh|r|z|c|s)i$/.test(b)) out=INI[b.slice(0,-1)];
    else{
      if(b[0]==='y'){ if(b.startsWith('yi')) b=b.slice(1); else if(b.startsWith('yu')) b='v'+b.slice(2); else b='i'+b.slice(1); }
      else if(b[0]==='w'){ b = b==='wu' ? 'u' : 'u'+b.slice(1); }
      let ini=''; const two=b.slice(0,2);
      if(['zh','ch','sh'].includes(two)){ini=two;b=b.slice(2);}
      else if(INI[b[0]]&&!'aeiouv'.includes(b[0])){ini=b[0];b=b.slice(1);}
      if(ini&&'jqx'.includes(ini)&&b[0]==='u') b='v'+b.slice(1);
      out=(ini?INI[ini]:'')+(FIN[b]??'');
    }
    return t===5||t===0 ? '˙'+out : out+TONE[t];
  };
  TW.pyStr = p => String(p||'').split(' ').filter(Boolean).map(TW.toneMark).join('');
  TW.zyStr = p => String(p||'').split(' ').filter(Boolean).map(TW.zhuyin).join(' ');
  /* Characters with pinyin above and zhuyin to the right; CSS decides which show */
  TW.ruby = function(text,py){
    const s=String(py||'').split(' ').filter(Boolean); let i=0;
    return [...text].map(c=>{
      const syl=/[，。？！、「」『』（）\s]/.test(c)?null:s[i++];
      return `<span class="c"><span class="py">${syl?TW.toneMark(syl):'&nbsp;'}</span><span class="hz">${c}</span><span class="zy">${syl?TW.zhuyin(syl):''}</span></span>`;
    }).join('');
  };
  TW.esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* ---------- Voice: the device's Taiwan Mandarin (zh-TW) voice ---------- */
  const synth = window.speechSynthesis || null;
  TW.voice = null; TW.voiceNote = '';
  function pickVoice(){
    if(!synth){ TW.voiceNote='Audio isn’t available in this browser.'; return; }
    const vs=synth.getVoices();
    const tw=vs.filter(v=>/zh[-_]TW/i.test(v.lang));
    const pref=['Mei-Jia','美佳','HsiaoChen','曉臻','Hanhan','Yating','Google 國語'];
    TW.voice=tw.find(v=>pref.some(p=>v.name.includes(p)))||tw[0]||null;
    if(TW.voice){ TW.voiceNote=TW.voice.name+' · Taiwan Mandarin'; TW.voiceOk=true; }
    else{
      const zh=vs.find(v=>/^(zh|cmn)/i.test(v.lang)); TW.voice=zh||null; TW.voiceOk=false;
      TW.voiceNote = zh ? 'No Taiwan voice on this device, using '+zh.name+'. On iPhone add one in Settings › Accessibility › Spoken Content › Voices › Chinese (Taiwan).'
                        : vs.length ? 'No Chinese voice found on this device.' : 'Checking the voices on this device…';
    }
    document.dispatchEvent(new CustomEvent('tw:voice'));
  }
  if(synth){ pickVoice(); synth.addEventListener?synth.addEventListener('voiceschanged',pickVoice):(synth.onvoiceschanged=pickVoice); }
  TW.speak = function(text,rate){
    if(!synth) return false;
    synth.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='zh-TW'; u.rate=rate||TW.getRate(); if(TW.voice) u.voice=TW.voice; synth.speak(u);
    return true;
  };

  /* ---------- Offline support + install ---------- */
  TW.isInstalled = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  TW.installPrompt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); TW.installPrompt=e; document.dispatchEvent(new CustomEvent('tw:installable')); });
  window.addEventListener('appinstalled', () => { TW.installPrompt=null; document.dispatchEvent(new CustomEvent('tw:installable')); });
  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1')){
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(()=>{}); });
  }
})();
