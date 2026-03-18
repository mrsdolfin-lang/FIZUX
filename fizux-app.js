// FIZUX v9.0 - Pure JS, no Babel, no JSX
(function(){
'use strict';
var h=React.createElement;
var useState=React.useState;
var useEffect=React.useEffect;
var useRef=React.useRef;

var SESSION='fizux_v9_session';
var FREE_DAILY=50;
var CONTACT='dofizuxai@gmail.com';

var MODELS=[
  {id:'auto',     name:'Auto',        icon:'⚡',color:'#C9A84C',free:true,  builtin:true},
  {id:'deepseek', name:'DeepSeek V3', icon:'⬡',color:'#2ECC8A',free:true,  builtin:true},
  {id:'r1',       name:'DeepSeek R1', icon:'🧠',color:'#2ECC8A',free:true,  builtin:true},
  {id:'llama',    name:'Llama 3.3',   icon:'🦙',color:'#FF8C42',free:true,  builtin:true},
  {id:'gemini-or',name:'Gemini Free', icon:'✦',color:'#4A9EFF',free:true,  builtin:true},
  {id:'mistral',  name:'Mistral',     icon:'🌬',color:'#8B6FE8',free:true,  builtin:true},
  {id:'qwen',     name:'Qwen 2.5',    icon:'🔮',color:'#FF6B9D',free:true,  builtin:true},
  {id:'gemini',   name:'Gemini API',  icon:'✦',color:'#4A9EFF',free:false, key:'geminiKey'},
  {id:'gpt',      name:'ChatGPT',     icon:'◎',color:'#10A37F',free:false, key:'openaiKey'},
  {id:'grok',     name:'Grok',        icon:'✕',color:'#FF4D6A',free:false, key:'grokKey'},
  {id:'claude',   name:'Claude',      icon:'◆',color:'#C9A84C',free:true,  builtin:true}
];

var USE_CASES=[
  {id:'office',  icon:'💼',name:'Office',   color:'#4A9EFF'},
  {id:'student', icon:'🎓',name:'Student',  color:'#8B6FE8'},
  {id:'creator', icon:'🎨',name:'Creator',  color:'#FF6B9D'},
  {id:'business',icon:'🚀',name:'Business', color:'#C9A84C'},
  {id:'developer',icon:'💻',name:'Developer',color:'#2ECC8A'},
  {id:'personal',icon:'🌟',name:'Personal', color:'#FF8C42'}
];

var FEATURES=[
  {id:'email',   icon:'✉', label:'Email Writer',   free:true},
  {id:'resume',  icon:'📄',label:'Resume Builder',  free:true},
  {id:'excel',   icon:'📊',label:'Excel Analyzer',  free:true},
  {id:'pdf',     icon:'📋',label:'PDF Reader',      free:true},
  {id:'invoice', icon:'🧾',label:'Invoice Gen',     free:true},
  {id:'code',    icon:'💻',label:'Code Generator',  free:true},
  {id:'grammar', icon:'✓', label:'Grammar Fix',     free:true},
  {id:'translate',icon:'🌍',label:'Translator',     free:true},
  {id:'summary', icon:'📝',label:'Summarizer',      free:true},
  {id:'caption', icon:'📱',label:'Caption Writer',  free:true},
  {id:'hashtag', icon:'#', label:'Hashtag Gen',     free:true},
  {id:'math',    icon:'∑', label:'Math Solver',     free:true},
  {id:'quiz',    icon:'❓',label:'Quiz Generator',  free:true},
  {id:'travel',  icon:'✈',label:'Travel Planner',  free:true},
  {id:'health',  icon:'❤',label:'Health Advisor',  free:true},
  {id:'goals',   icon:'🎯',label:'Goal Setting',    free:true},
  {id:'sql',     icon:'⬡', label:'SQL Generator',   free:false},
  {id:'report',  icon:'📈',label:'Report Writer',   free:false},
  {id:'bizplan', icon:'🏢',label:'Business Plan',   free:false},
  {id:'deepthink',icon:'🔬',label:'Deep Think',     free:false}
];

function getFeatPrompt(id,msg){
  var m={
    email:'Write a professional email about: "'+msg+'". Include: subject line, greeting, body with key points, call-to-action, professional closing.',
    resume:'Create an ATS-optimized resume for: "'+msg+'". Include: Contact Info, Professional Summary (keyword-rich), Work Experience (quantified achievements), Skills, Education.',
    excel:'Analyze this data:\n\n'+msg+'\n\n1. KEY METRICS\n2. TRENDS & PATTERNS\n3. TOP INSIGHTS\n4. RECOMMENDATIONS',
    pdf:'Analyze this document:\n\n'+msg+'\n\n1. EXECUTIVE SUMMARY\n2. KEY POINTS\n3. IMPORTANT DATA\n4. ACTION ITEMS',
    invoice:'Create a professional invoice for: "'+msg+'". Include: Invoice #, Date, Due Date, Client details, Itemized list, GST 18%, Total, Payment terms.',
    code:'Generate working code for: "'+msg+'". Include: clean code with comments, usage example, handle edge cases.',
    grammar:'Fix grammar and improve this text: "'+msg+'". Return corrected version, then list all changes made.',
    translate:'Translate to the requested language: "'+msg+'". Natural, accurate translation with any cultural notes.',
    summary:'Summarize: "'+msg+'"\n1. TL;DR (one sentence)\n2. Key points (max 5)\n3. Main takeaway',
    caption:'Write 5 viral social media captions for: "'+msg+'". Variety: funny, emotional, inspiring, informative, controversial. Include emojis.',
    hashtag:'Generate hashtags for: "'+msg+'"\n1. HIGH-REACH (5 tags, millions)\n2. MEDIUM (8 tags, 100k-1M)\n3. NICHE (7 tags, under 100k)',
    math:'Solve step by step:\n\n'+msg+'\n\n1. Identify problem type\n2. Show every step\n3. Final answer\n4. Verify answer',
    quiz:'Create 10 quiz questions on: "'+msg+'". Each: Question, Options A-D, Correct Answer, Brief Explanation.',
    travel:'Plan a trip to: "'+msg+'". Day-by-day itinerary with morning/afternoon/evening activities, food recommendations, transport tips, budget estimate.',
    health:'General wellness info for: "'+msg+'"\n1. General information\n2. Lifestyle tips\n3. Diet suggestions\n4. When to see a doctor\n(Note: General wellness only, not medical advice)',
    goals:'Create a SMART goal plan for: "'+msg+'"\n1. SMART breakdown\n2. 3-month milestones\n3. Weekly actions\n4. Potential obstacles and solutions',
    sql:'Write SQL for: "'+msg+'"\n1. Exact query\n2. Step-by-step explanation\n3. Optimized version with indexes',
    report:'Write a professional report on: "'+msg+'"\n1. Executive Summary\n2. Key Findings\n3. Data Analysis\n4. Conclusions\n5. Recommendations',
    bizplan:'Create a business plan for: "'+msg+'"\n1. Executive Summary\n2. Problem & Solution\n3. Market Analysis\n4. Business Model & Revenue\n5. Marketing Strategy\n6. Financial Projections',
    deepthink:'Deep analytical reasoning for: "'+msg+'"\n1. Surface-level analysis\n2. Root causes\n3. Hidden assumptions\n4. Counter-arguments\n5. Synthesis & conclusion'
  };
  return m[id]||'Help with: "'+msg+'"';
}

function detectFeat(text){
  var t=text.toLowerCase();
  var rules=[
    ['email',['email','write email','compose email','reply to']],
    ['resume',['resume','cv ','job application','cover letter']],
    ['excel',['excel','spreadsheet','csv','data analysis','analyze data']],
    ['pdf',['pdf','document','summarize this']],
    ['code',['write code','generate code','function ','javascript','python','html']],
    ['grammar',['fix grammar','proofread','correct this','grammar check']],
    ['translate',['translate','translation','hindi mein','in english']],
    ['math',['solve','equation','calculate','math','maths']],
    ['caption',['caption','instagram post','social media post']],
    ['hashtag',['hashtag','tags for','#']],
    ['quiz',['quiz','questions on','mcq','test on']],
    ['travel',['travel','trip to','visit','itinerary','vacation']],
    ['health',['health','symptoms','diet plan','wellness']],
    ['goals',['goal','goals','smart goal','objective']],
    ['sql',['sql','database query','select from','mysql']],
    ['bizplan',['business plan','startup','business idea']]
  ];
  for(var i=0;i<rules.length;i++){
    var kws=rules[i][1];
    for(var j=0;j<kws.length;j++){
      if(t.indexOf(kws[j])>-1) return rules[i][0];
    }
  }
  return null;
}

function getDayKey(){ return 'fizux:day:'+new Date().toDateString(); }
function getDailyCount(){
  return ST.get(getDayKey()).then(function(d){ return parseInt(d.value)||0; }).catch(function(){ return 0; });
}
function bumpDaily(){
  return getDailyCount().then(function(c){ return ST.set(getDayKey(),String(c+1)).then(function(){ return c+1; }); });
}

// ── AI CALLS - DIRECT (no backend needed) ──

function callGeminiDirect(msgs, key) {
  if (!key) return Promise.reject(new Error('Gemini API key needed. Add in Settings → AI tab.'));
  var contents = msgs.slice(-20).map(function(m) {
    return { role: m.role === 'user' ? 'user' : 'model', parts: [{ text: String(m.content || '') }] };
  });
  return fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: contents, generationConfig: { maxOutputTokens: 1200 } })
  }).then(function(r) { return r.json(); }).then(function(d) {
    var t = '';
    try { t = d.candidates[0].content.parts[0].text; } catch(e) { t = JSON.stringify(d).slice(0, 200); }
    return { reply: t || 'No response.', model: 'gemini' };
  });
}

function callDeepSeekDirect(msgs, key) {
  if (!key) return Promise.reject(new Error('DeepSeek API key needed. Add in Settings → AI tab.'));
  var m = msgs.slice(-20).map(function(m) { return { role: m.role, content: String(m.content || '') }; });
  return fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({ model: 'deepseek-chat', max_tokens: 1200, messages: m })
  }).then(function(r) { return r.json(); }).then(function(d) {
    var t = '';
    try { t = d.choices[0].message.content; } catch(e) { t = 'No response.'; }
    return { reply: t, model: 'deepseek' };
  });
}

function callOpenAIDirect(msgs, key) {
  if (!key) return Promise.reject(new Error('OpenAI API key needed. Add in Settings → AI tab.'));
  var m = msgs.slice(-20).map(function(m) { return { role: m.role, content: String(m.content || '') }; });
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 1200, messages: m })
  }).then(function(r) { return r.json(); }).then(function(d) {
    var t = '';
    try { t = d.choices[0].message.content; } catch(e) { t = 'No response.'; }
    return { reply: t, model: 'gpt' };
  });
}

function callGrokDirect(msgs, key) {
  if (!key) return Promise.reject(new Error('Grok API key needed. Add in Settings → AI tab.'));
  var m = msgs.slice(-20).map(function(m) { return { role: m.role, content: String(m.content || '') }; });
  return fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({ model: 'grok-2-latest', max_tokens: 1200, messages: m })
  }).then(function(r) { return r.json(); }).then(function(d) {
    var t = '';
    try { t = d.choices[0].message.content; } catch(e) { t = 'No response.'; }
    return { reply: t, model: 'grok' };
  });
}

// ── ALL FREE AI MODELS VIA OPENROUTER ──
var OR_KEY = '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';
// OpenRouter free models
var OR_MODELS = {
  'deepseek':  'nousresearch/hermes-3-llama-3.1-405b:free',
  'llama':     'meta-llama/llama-3.1-8b-instruct:free',
  'gemini-or': 'google/gemma-3-27b-it:free',
  'mistral':   'mistralai/mistral-small-3.1-24b-instruct:free',
  'qwen':      'qwen/qwen3-235b-a22b:free',
  'r1':        'deepseek/deepseek-r1-zero:free'
};

function callOpenRouterDirect(msgs, modelKey) {
  var orModel = OR_MODELS[modelKey] || OR_MODELS['deepseek'];
  var m = msgs.slice(-20).map(function(x) { return { role: x.role, content: String(x.content || '') }; });
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + OR_KEY,
      'HTTP-Referer': 'https://mrsdolfin-lang.github.io/FIZUX/',
      'X-Title': 'FIZUX'
    },
    body: JSON.stringify({ model: orModel, max_tokens: 1200, messages: m })
  }).then(function(r) { return r.json(); }).then(function(d) {
    var t = '';
    try { t = d.choices[0].message.content; } catch(e) { t = JSON.stringify(d).slice(0,300); }
    return { reply: t || 'No response.', model: modelKey };
  });
}

// No Cloudflare Worker needed - all AI runs directly
var CLAUDE_KEY = 'sk-ant-api03-3vxrFVadYHRrcywQ3Px7kzmR8yjU8F_ibJ-pK4fU5VStIQOjXMpB2FzvHluIORijaZmMP70fSNxB47DLh6Uwdw-79ioVAAA';

function callClaudeDirect(msgs, system) {
  var m = msgs.slice(-20).map(function(x) { return { role: x.role, content: String(x.content || '') }; });
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1200,
      system: system || 'You are FIZUX, a helpful AI assistant. Be precise and thorough.',
      messages: m
    })
  }).then(function(r) { return r.json(); }).then(function(d) {
    var t = '';
    try { for(var i=0;i<d.content.length;i++) { if(d.content[i].type==='text') t+=d.content[i].text; } } catch(e) {}
    return { reply: t || 'No response.', model: 'claude' };
  });
}

function callAI(modelId, msgs, keys, userText) {
  var k = keys || {};
  try {
    var stored = localStorage.getItem('lc_fizux:apikeys');
    if (stored) { var parsed = JSON.parse(stored); if (parsed && typeof parsed === 'object') k = parsed; }
  } catch(e) {}

  var eff = modelId;

  // Auto select best available
  if (modelId === 'auto') {
    eff = 'claude';
  }

  // FREE BUILT-IN models via OpenRouter (no key needed)
  var freeModels = ['deepseek','llama','gemini-or','mistral','qwen','r1','phi'];
  if (freeModels.indexOf(eff) > -1) {
    return callOpenRouterDirect(msgs, eff);
  }

  // USER KEY models
  if (eff === 'gemini') return callGeminiDirect(msgs, k.geminiKey);
  if (eff === 'gpt') return callOpenAIDirect(msgs, k.openaiKey);
  if (eff === 'grok') return callGrokDirect(msgs, k.grokKey);
  if (eff === 'claude') {
    return callClaudeDirect(msgs);
  }

  // Default fallback
  return callOpenRouterDirect(msgs, 'deepseek');
}

// ── MAIN APP ──
function FIZUXApp(){
  var s0=useState('loading'); var screen=s0[0]; var setScreen=s0[1];
  var s1=useState(null); var user=s1[0]; var setUser=s1[1];
  var s2=useState([]); var messages=s2[0]; var setMessages=s2[1];
  var s3=useState([]); var chats=s3[0]; var setChats=s3[1];
  var s4=useState(null); var activeChat=s4[0]; var setActiveChat=s4[1];
  var s5=useState(''); var input=s5[0]; var setInput=s5[1];
  var s6=useState(false); var loading=s6[0]; var setLoading=s6[1];
  var s7=useState('auto'); var model=s7[0]; var setModel=s7[1];
  var s8=useState(false); var modelMenu=s8[0]; var setModelMenu=s8[1];
  var s9=useState(false); var sidebar=s9[0]; var setSidebar=s9[1];
  var s10=useState({msg:'',type:'ok'}); var toast=s10[0]; var setToast=s10[1];
  var s11=useState(false); var isPremium=s11[0]; var setIsPremium=s11[1];
  var s12=useState(''); var premVer=s12[0]; var setPremVer=s12[1];
  var s13=useState(0); var daily=s13[0]; var setDaily=s13[1];
  var s14=useState(false); var showSettings=s14[0]; var setShowSettings=s14[1];
  var s15=useState(false); var showOnboard=s15[0]; var setShowOnboard=s15[1];
  var s16=useState(null); var useCase=s16[0]; var setUseCase=s16[1];
  var s17=useState(false); var showLimit=s17[0]; var setShowLimit=s17[1];
  var s18=useState([]); var attach=s18[0]; var setAttach=s18[1];
  var s19=useState(false); var listening=s19[0]; var setListening=s19[1];
  var s20=useState(false); var imgPanel=s20[0]; var setImgPanel=s20[1];
  var s21=useState(''); var imgPrompt=s21[0]; var setImgPrompt=s21[1];
  var s22=useState([]); var genImgs=s22[0]; var setGenImgs=s22[1];
  var s23=useState([]); var followUps=s23[0]; var setFollowUps=s23[1];
  var s24=useState(''); var ukeyInput=s24[0]; var setUkeyInput=s24[1];
  var s25=useState(''); var ukeyErr=s25[0]; var setUkeyErr=s25[1];
  var s26=useState(false); var loginLoading=s26[0]; var setLoginLoading=s26[1];
  var s27=useState('account'); var settingsTab=s27[0]; var setSettingsTab=s27[1];
  var s28=useState(''); var customInstr=s28[0]; var setCustomInstr=s28[1];
  var s29=useState({}); var apiKeys=s29[0]; var setApiKeys=s29[1];
  var s30=useState('dark'); var theme=s30[0]; var setTheme=s30[1];
  var s31=useState(14); var fontSize=s31[0]; var setFontSize=s31[1];
  var s32=useState(null); var detFeat=s32[0]; var setDetFeat=s32[1];
  var s33=useState(false); var compareMode=s33[0]; var setCompareMode=s33[1];
  var s34=useState({}); var compareRes=s34[0]; var setCompareRes=s34[1];
  var s35=useState(false); var compareLoad=s35[0]; var setCompareLoad=s35[1];

  var bottomRef=useRef(null);
  var fileRef=useRef(null);
  var inputRef=useRef(null);
  var recRef=useRef(null);

  var isLight=theme==='light';
  var BG=isLight?'#F8F8FC':'#0A0A0F';
  var CARD=isLight?'#FFFFFF':'#16161E';
  var CARD2=isLight?'#F0F0F8':'#1C1C26';
  var BORDER=isLight?'#E0E0EE':'#2A2A3A';
  var TEXT=isLight?'#0A0A1A':'#F0F0FF';
  var SUB=isLight?'#444460':'#A0A0C0';
  var MUTED=isLight?'#888890':'#606080';
  var GOLD='#C9A84C';
  var GREEN='#2ECC8A';
  var RED='#FF4D6A';
  var BLUE='#4A9EFF';
  var PURPLE='#8B6FE8';
  var ORANGE='#FF8C42';

  function notify(msg,type){
    setToast({msg:msg,type:type||'ok'});
    setTimeout(function(){setToast({msg:'',type:'ok'});},3000);
  }

  function uid(){ return user?user.uid:'guest'; }
  function canSend(){ return isPremium||daily<FREE_DAILY; }
  function remaining(){ return isPremium?'∞':Math.max(0,FREE_DAILY-daily); }

  // LOAD PREFS
  useEffect(function(){
    ST.get('fizux:theme').then(function(d){setTheme(d.value);}).catch(function(){});
    ST.get('fizux:fs').then(function(d){setFontSize(parseInt(d.value)||14);}).catch(function(){});
    ST.get('fizux:ci').then(function(d){setCustomInstr(d.value);}).catch(function(){});
    ST.get('fizux:apikeys').then(function(d){try{var k=JSON.parse(d.value);if(k&&typeof k==='object')setApiKeys(k);}catch(e){}}).catch(function(){});
    getDailyCount().then(function(c){setDaily(c);});
  },[]);

  // APPLY THEME TO DOCUMENT
  useEffect(function(){
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.background = theme==='light'?'#F8F8FC':'#0A0A0F';
  },[theme]);

  // SESSION RESTORE
  useEffect(function(){
    ST.get(SESSION).then(function(d){
      var saved=JSON.parse(d.value);
      setUser(saved);
      return loadUserData(saved.uid);
    }).then(function(){
      setScreen('chat');
    }).catch(function(){
      setScreen('login');
    });
  },[]);

  function loadUserData(userId){
    return new Promise(function(resolve){
      var tasks=[
        ST.get('fizux:chats:'+userId).then(function(d){try{setChats(JSON.parse(d.value));}catch(e){}}).catch(function(){}),
        ST.get('fizux:premium:'+userId).then(function(d){
          var p=JSON.parse(d.value);
          var ok=p.expiry==='lifetime'||new Date(p.expiry)>new Date();
          if(ok){setIsPremium(true);setPremVer(p.version);}
        }).catch(function(){}),
        ST.get('fizux:uc:'+userId).then(function(d){setUseCase(d.value);}).catch(function(){setShowOnboard(true);}),
        getDailyCount().then(function(c){setDaily(c);})
      ];
      Promise.all(tasks).then(resolve).catch(resolve);
    });
  }

  // GOOGLE LOGIN
  function loginGoogle(){
    setLoginLoading(true);
    var userId='google_'+Date.now();
    var u={uid:userId,name:'Google User',email:'user@gmail.com',method:'google'};
    ST.set(SESSION,JSON.stringify(u)).then(function(){
      return ST.set('fizux:user:'+userId,JSON.stringify(Object.assign({},u,{lastLogin:new Date().toISOString()})),true);
    }).then(function(){
      setUser(u);
      return loadUserData(userId);
    }).then(function(){
      setScreen('chat');
      notify('Welcome to FIZUX!');
    }).catch(function(){
      notify('Login failed. Try again.','err');
    }).then(function(){
      setLoginLoading(false);
    });
  }

  // UKEY ACTIVATE
  function activateUkey(){
    var key=ukeyInput.trim().toUpperCase();
    if(!key){setUkeyErr('Enter your Ukey');return;}
    setUkeyErr('');
    ST.get('afzux:ukey:'+key,true).then(function(d){
      var uk=JSON.parse(d.value);
      if(uk.blocked) throw new Error('This Ukey is blocked');
      if(uk.expiry!=='never'&&new Date(uk.expiry)<new Date()) throw new Error('This Ukey has expired');
      uk.used=true; uk.lastLogin=new Date().toISOString(); uk.usedBy=uid();
      return ST.set('afzux:ukey:'+key,JSON.stringify(uk),true).then(function(){
        var expiry=uk.expiry==='never'?'lifetime':uk.expiry;
        return ST.set('fizux:premium:'+uid(),JSON.stringify({version:uk.version,expiry:expiry,activatedAt:new Date().toISOString(),ukey:key})).then(function(){
          setIsPremium(true); setPremVer(uk.version);
          setUkeyInput(''); setUkeyErr('');
          notify('🎉 '+uk.version+' Premium activated!');
        });
      });
    }).catch(function(e){
      setUkeyErr(e.message||'Invalid Ukey. Contact: '+CONTACT);
    });
  }

  // LOGOUT
  function logout(){
    ST.del(SESSION).then(function(){
      setUser(null); setMessages([]); setChats([]); setIsPremium(false);
      setScreen('login');
    });
  }

  // FILE UPLOAD
  function processFile(file){
    var ext=file.name.split('.').pop().toLowerCase();
    if(['jpg','jpeg','png','gif','webp'].indexOf(ext)>-1){
      var fr=new FileReader();
      fr.onload=function(e){
        setAttach(function(p){return p.concat([{type:'image',name:file.name,data:e.target.result,mediaType:file.type}]);});
        notify('Attached: '+file.name);
      };
      fr.readAsDataURL(file);
    } else if(ext==='docx'&&typeof mammoth!=='undefined'){
      var fr2=new FileReader();
      fr2.onload=function(e){
        mammoth.extractRawText({arrayBuffer:e.target.result}).then(function(r){
          setAttach(function(p){return p.concat([{type:'doc',name:file.name,data:r.value.slice(0,12000)}]);});
          notify('Attached: '+file.name);
        });
      };
      fr2.readAsArrayBuffer(file);
    } else if(['xlsx','xls'].indexOf(ext)>-1&&typeof XLSX!=='undefined'){
      var fr3=new FileReader();
      fr3.onload=function(e){
        var wb=XLSX.read(e.target.result,{type:'array'});
        var text='';
        wb.SheetNames.forEach(function(sn){text+='\n=== '+sn+' ===\n'+XLSX.utils.sheet_to_csv(wb.Sheets[sn]);});
        setAttach(function(p){return p.concat([{type:'excel',name:file.name,data:text.slice(0,12000)}]);});
        notify('Attached: '+file.name);
      };
      fr3.readAsArrayBuffer(file);
    } else {
      var fr4=new FileReader();
      fr4.onload=function(e){
        setAttach(function(p){return p.concat([{type:'text',name:file.name,data:(e.target.result||'').slice(0,12000)}]);});
        notify('Attached: '+file.name);
      };
      fr4.readAsText(file);
    }
  }

  // SEND
  function send(){
    var userText=input.trim();
    if(!userText&&!attach.length) return;
    if(loading) return;
    if(!canSend()){setShowLimit(true);return;}

    var parts=[];
    attach.forEach(function(a){
      if(a.type==='image'){
        parts.push({type:'image',source:{type:'base64',media_type:a.mediaType,data:a.data.split(',')[1]}});
        parts.push({type:'text',text:'[Image: '+a.name+']'});
      } else {
        parts.push({type:'text',text:'['+a.name+']\n'+a.data+'\n'});
      }
    });
    if(userText) parts.push({type:'text',text:userText});

    var display=attach.length>0 ? attach.map(function(a){return '📎 '+a.name;}).join(' ')+'\n'+userText : userText;
    var feat=detectFeat(userText);

    var system='You are FIZUX, a helpful AI assistant.'+(customInstr?' '+customInstr:'');
    if(feat) system=getFeatPrompt(feat,userText);

    var userMsg={role:'user',content:display,_api:parts.length>1?parts:(userText||'Analyze files'),ts:Date.now()};
    var newMsgs=messages.concat([userMsg]);
    setMessages(newMsgs);
    setInput(''); setAttach([]); setFollowUps([]); setDetFeat(null);
    setLoading(true);

    var apiMsgs=newMsgs.slice(-30).map(function(m){return {role:m.role,content:m._api||m.content};});

    callAI(model,apiMsgs,apiKeys,userText).then(function(result){
      var aiMsg={role:'assistant',content:result.reply,model:result.model||model,searched:result.searched,ts:Date.now()};
      var final=newMsgs.concat([aiMsg]);
      setMessages(final);
      genFollowUps(result.reply);
      return bumpDaily().then(function(c){setDaily(c);return saveChat(final,userText);});
    }).catch(function(e){
      setMessages(newMsgs.concat([{role:'assistant',content:'Sorry, there was an error: '+(e.message||'Please try again.'),ts:Date.now()}]));
    }).then(function(){
      setLoading(false);
    });
  }

  function saveChat(msgs,title){
    var userId=uid();
    var chatId=activeChat||String(Date.now());
    if(!activeChat) setActiveChat(chatId);
    var s={id:chatId,title:(title||'Chat').slice(0,55),date:new Date().toLocaleDateString(),messages:msgs.map(function(m){return Object.assign({},m,{_api:undefined});})};
    var updated=[s].concat(chats.filter(function(c){return c.id!==chatId;})).slice(0,60);
    setChats(updated);
    ST.set('fizux:chats:'+userId,JSON.stringify(updated)).catch(function(){});
  }

  function genFollowUps(reply){
    fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:80,
        messages:[{role:'user',content:'3 short follow-up questions (max 8 words each) for: "'+reply.slice(0,200)+'". Return JSON array only.'}]})
    }).then(function(r){return r.json();}).then(function(d){
      var text=(d.content&&d.content[0]&&d.content[0].text)||'[]';
      var clean=text.replace(/\u0060\u0060\u0060json|\u0060\u0060\u0060/g,'').trim();
      try{var qs=JSON.parse(clean);setFollowUps(Array.isArray(qs)?qs.slice(0,3):[]);}catch(e){setFollowUps([]);}
    }).catch(function(){setFollowUps([]);});
  }

  function sendCompare(){
    if(!input.trim()||compareLoad) return;
    if(!canSend()){setShowLimit(true);return;}
    setCompareLoad(true); setCompareRes({});
    var txt=input.trim();
    var msgs=[{role:'user',content:txt}];
    var toCompare=['claude'];
    if(apiKeys.geminiKey) toCompare.push('gemini');
    if(toCompare.length<2) toCompare.push('claude'); // fallback

    Promise.all(toCompare.map(function(mId){
      return callAI(mId,msgs,apiKeys,txt).then(function(r){return [mId,r.reply];}).catch(function(e){return [mId,'Error: '+e.message];});
    })).then(function(results){
      var obj={};
      results.forEach(function(r){obj[r[0]]=r[1];});
      setCompareRes(obj);
      setInput('');
      bumpDaily().then(function(c){setDaily(c);});
    }).then(function(){setCompareLoad(false);});
  }

  function newChat(){
    if(messages.length) saveChat(messages,(messages[0]&&messages[0].content)||'Chat');
    setMessages([]); setActiveChat(null); setSidebar(false);
    setFollowUps([]); setCompareRes({}); setDetFeat(null);
    if(inputRef.current) inputRef.current.focus();
  }

  function delChat(id){
    var updated=chats.filter(function(c){return c.id!==id;});
    setChats(updated);
    ST.set('fizux:chats:'+uid(),JSON.stringify(updated)).catch(function(){});
    if(activeChat===id){setMessages([]);setActiveChat(null);}
  }

  function startVoice(){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){notify('Voice not supported','err');return;}
    var r=new SR(); r.lang='en-US'; r.continuous=true; r.interimResults=false;
    r.onstart=function(){setListening(true);};
    r.onend=function(){setListening(false);};
    r.onresult=function(e){var f='';for(var i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)f+=e.results[i][0].transcript;if(f)setInput(function(p){return p+f;});};
    r.onerror=function(){setListening(false);};
    recRef.current=r; r.start();
  }
  function stopVoice(){if(recRef.current)recRef.current.stop();setListening(false);}

  useEffect(function(){
    if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:'smooth'});
  },[messages,loading]);

  function mInfo(id){for(var i=0;i<MODELS.length;i++)if(MODELS[i].id===id)return MODELS[i];return MODELS[0];}
  function ucInfo(id){for(var i=0;i<USE_CASES.length;i++)if(USE_CASES[i].id===id)return USE_CASES[i];return null;}

  var curModel=mInfo(model);
  var curUC=ucInfo(useCase);

  // ── STYLE HELPERS ──
  function card(ex){return Object.assign({background:CARD,border:'1px solid '+BORDER,borderRadius:'14px',padding:'14px'},ex||{});}
  function btn(ex){return Object.assign({padding:'10px 16px',borderRadius:'10px',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',color:'#1A1000',fontWeight:700,fontSize:'13px',cursor:'pointer',border:'none',fontFamily:'inherit'},ex||{});}
  function ghost(ex){return Object.assign({padding:'7px 12px',borderRadius:'9px',border:'1px solid '+BORDER,background:'transparent',color:SUB,fontSize:'12px',cursor:'pointer',fontFamily:'inherit'},ex||{});}
  function inpStyle(ex){return Object.assign({background:CARD,border:'1.5px solid '+BORDER,borderRadius:'10px',padding:'10px 14px',color:TEXT,fontSize:'14px',fontFamily:'inherit',width:'100%',boxSizing:'border-box',outline:'none'},ex||{});}
  function badge(color,ex){return Object.assign({background:color+'22',color:color,border:'1px solid '+color+'44',borderRadius:'6px',padding:'2px 8px',fontSize:'11px',fontWeight:600,display:'inline-block'},ex||{});}
  function overlay(){return {position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:500,padding:'16px',backdropFilter:'blur(8px)'};}
  function modalStyle(ex){return Object.assign({background:CARD,border:'1px solid #363648',borderRadius:'20px',padding:'24px',maxWidth:'420px',width:'100%',maxHeight:'85vh',overflowY:'auto'},ex||{});}

  // ── LOADING SCREEN ──
  if(screen==='loading'){
    return h('div',{style:{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'16px',background:'#0A0A0F'}},
      h('div',{style:{width:'80px',height:'80px',borderRadius:'24px',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'36px',fontWeight:800,color:'#1A1000',boxShadow:'0 4px 20px rgba(201,168,76,0.3)'}},'F'),
      h('div',{style:{fontSize:'28px',fontWeight:800,color:'#F0F0FF',letterSpacing:'-1px'}},'FIZUX'),
      h('div',{style:{fontSize:'13px',color:'#606080'}},'Your Personal AI Universe'),
      h('div',{style:{display:'flex',gap:'8px',marginTop:'8px'}},
        [0,1,2].map(function(i){
          return h('div',{key:i,style:{width:'8px',height:'8px',borderRadius:'50%',background:'#C9A84C',animation:'bounce 1.2s infinite',animationDelay:(i*0.2)+'s'}});
        })
      )
    );
  }

  // ── LOGIN SCREEN ──
  if(screen==='login'){
    return h('div',{style:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'#0A0A0F'}},
      // Toast
      toast.msg && h('div',{style:{position:'fixed',top:'16px',left:'50%',transform:'translateX(-50%)',background:'#16161E',border:'1.5px solid '+(toast.type==='err'?RED:GREEN),borderRadius:'12px',padding:'10px 20px',fontSize:'13px',fontWeight:500,color:toast.type==='err'?RED:GREEN,zIndex:9999,whiteSpace:'nowrap'}},toast.msg),
      h('div',{style:{width:'100%',maxWidth:'400px'}},
        // Logo
        h('div',{style:{textAlign:'center',marginBottom:'28px'}},
          h('div',{style:{width:'72px',height:'72px',borderRadius:'22px',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',fontWeight:800,color:'#1A1000',margin:'0 auto 14px',boxShadow:'0 4px 20px rgba(201,168,76,0.3)'}},'F'),
          h('div',{style:{fontSize:'26px',fontWeight:800,color:'#F0F0FF',marginBottom:'6px'}},'FIZUX'),
          h('div',{style:{fontSize:'13px',color:'#606080'}},'Your Personal AI Universe')
        ),
        // Card
        h('div',{style:{background:'#16161E',border:'1px solid #363648',borderRadius:'22px',padding:'26px',boxShadow:'0 8px 48px rgba(0,0,0,0.6)'}},
          // Google btn
          h('button',{
            onClick:loginGoogle, disabled:loginLoading,
            style:{width:'100%',padding:'14px',borderRadius:'14px',border:'1.5px solid #2A2A3A',background:'#111118',color:'#F0F0FF',fontWeight:600,fontSize:'15px',cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',marginBottom:'18px',opacity:loginLoading?0.7:1}
          },
            loginLoading
              ? h('div',{style:{width:'18px',height:'18px',border:'2.5px solid #2A2A3A',borderTopColor:'#C9A84C',borderRadius:'50%',animation:'spin .7s linear infinite'}})
              : h('svg',{width:20,height:20,viewBox:'0 0 24 24'},
                  h('path',{fill:'#4285F4',d:'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'}),
                  h('path',{fill:'#34A853',d:'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'}),
                  h('path',{fill:'#FBBC05',d:'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'}),
                  h('path',{fill:'#EA4335',d:'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'})
                ),
            loginLoading?'Signing in...':'Continue with Google'
          ),
          // Divider
          h('div',{style:{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}},
            h('div',{style:{flex:1,height:'1px',background:'#2A2A3A'}}),
            h('span',{style:{fontSize:'12px',color:'#606080'}},'or use Ukey'),
            h('div',{style:{flex:1,height:'1px',background:'#2A2A3A'}})
          ),
          // Ukey
          h('input',{value:ukeyInput,onChange:function(e){setUkeyInput(e.target.value.toUpperCase());setUkeyErr('');},onKeyDown:function(e){if(e.key==='Enter')activateUkey();},placeholder:'Enter your Ukey',
            style:{background:'#111118',border:'1.5px solid '+(ukeyErr?RED:'#2A2A3A'),borderRadius:'12px',padding:'13px',color:'#F0F0FF',fontSize:'13px',fontFamily:'monospace',letterSpacing:'2px',textAlign:'center',width:'100%',boxSizing:'border-box',outline:'none',marginBottom:'8px'}}),
          ukeyErr && h('div',{style:{color:RED,fontSize:'11px',textAlign:'center',marginBottom:'8px'}},ukeyErr),
          h('button',{onClick:activateUkey,style:btn({width:'100%',padding:'13px',borderRadius:'14px',fontSize:'14px',marginBottom:'14px'})},'Activate Ukey →'),
          // Free note
          h('div',{style:{background:'rgba(46,204,138,0.08)',border:'1px solid rgba(46,204,138,0.25)',borderRadius:'10px',padding:'10px 14px',textAlign:'center',marginBottom:'10px'}},
            h('div',{style:{fontSize:'12px',fontWeight:600,color:GREEN}},'🆓 50 free messages/day — No key needed'),
            h('div',{style:{fontSize:'11px',color:'#606080',marginTop:'3px'}},'Just sign in with Google to start')
          ),
          h('div',{style:{textAlign:'center',fontSize:'11px',color:'#606080'}},
            'Premium Ukey: ',h('a',{href:'mailto:'+CONTACT,style:{color:GOLD,textDecoration:'none'}},CONTACT)
          )
        )
      )
    );
  }

  // ── ONBOARD MODAL ──
  var OnboardModal=showOnboard ? h('div',{style:overlay()},
    h('div',{style:modalStyle({maxWidth:'480px'})},
      h('div',{style:{textAlign:'center',marginBottom:'16px'}},
        h('div',{style:{fontSize:'32px',marginBottom:'8px'}},'👋'),
        h('div',{style:{fontWeight:800,fontSize:'20px',marginBottom:'4px'}},'Welcome'+(user&&user.name?' '+user.name.split(' ')[0]:'')+'!'),
        h('div',{style:{fontSize:'13px',color:MUTED}},'How will you mainly use FIZUX?')
      ),
      h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'14px'}},
        USE_CASES.map(function(uc){
          return h('button',{key:uc.id,onClick:function(){setUseCase(uc.id);},
            style:{padding:'14px 12px',borderRadius:'14px',border:'2px solid '+(useCase===uc.id?uc.color:BORDER),background:useCase===uc.id?uc.color+'14':CARD2,cursor:'pointer',textAlign:'left',fontFamily:'inherit'}},
            h('div',{style:{fontSize:'22px',marginBottom:'5px'}},uc.icon),
            h('div',{style:{fontSize:'12px',fontWeight:700,color:useCase===uc.id?uc.color:TEXT}},uc.name)
          );
        })
      ),
      useCase && h('button',{onClick:function(){ST.set('fizux:uc:'+uid(),useCase).catch(function(){});setShowOnboard(false);notify('FIZUX personalized!');},style:btn({width:'100%',borderRadius:'14px',padding:'12px',marginBottom:'8px'})},"Let's go →"),
      h('button',{onClick:function(){ST.set('fizux:uc:'+uid(),'general').catch(function(){});setShowOnboard(false);},style:{width:'100%',padding:'8px',background:'none',border:'none',color:MUTED,cursor:'pointer',fontFamily:'inherit',fontSize:'13px'}},'Skip for now')
    )
  ) : null;

  // ── LIMIT MODAL ──
  var LimitModal=showLimit ? h('div',{style:overlay()},
    h('div',{style:modalStyle({textAlign:'center'})},
      h('div',{style:{fontSize:'48px',marginBottom:'10px'}},'⏰'),
      h('div',{style:{fontWeight:800,fontSize:'18px',marginBottom:'6px'}},'Daily Limit Reached'),
      h('div',{style:{fontSize:'13px',color:MUTED,marginBottom:'18px'}},FREE_DAILY+' free messages used. Resets at midnight.'),
      h('button',{onClick:function(){setShowLimit(false);setShowSettings(true);setSettingsTab('account');},style:btn({width:'100%',borderRadius:'14px',padding:'12px',marginBottom:'8px'})},'Activate Premium Ukey'),
      h('div',{style:{fontSize:'12px',color:MUTED,marginBottom:'12px'}},'Get Ukey: '+CONTACT),
      h('button',{onClick:function(){setShowLimit(false);},style:ghost({width:'100%',textAlign:'center'})},'Come back tomorrow')
    )
  ) : null;

  // ── SETTINGS MODAL ──
  var SettingsModal=showSettings ? h('div',{style:overlay()},
    h('div',{style:modalStyle({maxWidth:'440px'})},
      h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}},
        h('div',{style:{fontWeight:700,fontSize:'17px'}},'⚙ Settings'),
        h('button',{onClick:function(){setShowSettings(false);},style:{color:MUTED,fontSize:'22px',background:'none',border:'none',cursor:'pointer'}},'✕')
      ),
      // Tabs
      h('div',{style:{display:'flex',gap:'4px',marginBottom:'18px',background:isLight?'#F0F0F8':'#111118',borderRadius:'12px',padding:'4px'}},
        ['account','ai','appearance'].map(function(tab){
          return h('button',{key:tab,onClick:function(){setSettingsTab(tab);},style:{flex:1,padding:'7px',borderRadius:'9px',border:'none',background:settingsTab===tab?CARD:'transparent',color:settingsTab===tab?TEXT:MUTED,fontWeight:settingsTab===tab?600:400,fontSize:'11px',cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize'}},tab);
        })
      ),
      // ACCOUNT
      settingsTab==='account' && h('div',null,
        h('div',{style:card({display:'flex',gap:'12px',alignItems:'center',marginBottom:'12px'})},
          h('div',{style:{width:'44px',height:'44px',borderRadius:'50%',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'18px',color:'#1A1000',flexShrink:0}},((user&&user.name)||'U').charAt(0).toUpperCase()),
          h('div',{style:{flex:1}},
            h('div',{style:{fontWeight:700,fontSize:'14px'}},user&&user.name||'User'),
            h('div',{style:{fontSize:'11px',color:MUTED}},user&&user.email||'Google Account')
          ),
          isPremium && h('span',{style:badge(GOLD)},'✦ '+premVer)
        ),
        h('div',{style:card({marginBottom:'12px'})},
          h('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:'8px'}},
            h('span',{style:{fontSize:'13px',fontWeight:600}},'Daily Usage'),
            h('span',{style:{fontSize:'13px',fontWeight:700,color:isPremium?GOLD:daily>=FREE_DAILY?RED:GREEN}},isPremium?'∞ Unlimited':remaining()+' / '+FREE_DAILY+' left')
          ),
          !isPremium && h('div',{style:{height:'5px',background:BORDER,borderRadius:'3px',overflow:'hidden'}},
            h('div',{style:{height:'100%',width:Math.min(100,(daily/FREE_DAILY)*100)+'%',background:daily>=FREE_DAILY?RED:GREEN,borderRadius:'3px'}})
          )
        ),
        h('div',{style:card({marginBottom:'12px',borderColor:'rgba(201,168,76,0.3)'})},
          h('div',{style:{fontSize:'11px',color:GOLD,fontWeight:700,letterSpacing:'0.8px',marginBottom:'8px'}},'✦ ACTIVATE PREMIUM UKEY'),
          h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'8px'}},'Get Ukey from: '+CONTACT),
          h('div',{style:{display:'flex',gap:'8px',marginBottom:'6px'}},
            h('input',{value:ukeyInput,onChange:function(e){setUkeyInput(e.target.value.toUpperCase());setUkeyErr('');},onKeyDown:function(e){if(e.key==='Enter')activateUkey();},placeholder:'Enter 20-char Ukey',
              style:inpStyle({flex:1,fontFamily:'monospace',letterSpacing:'2px',textAlign:'center',fontSize:'11px',padding:'9px 10px',borderColor:ukeyErr?RED:BORDER})}),
            h('button',{onClick:activateUkey,style:btn({padding:'9px 12px',fontSize:'12px'})},'Activate')
          ),
          ukeyErr && h('div',{style:{color:RED,fontSize:'11px'}},ukeyErr)
        ),
        h('div',{style:{display:'flex',gap:'8px'}},
          h('button',{onClick:function(){ST.del('fizux:chats:'+uid()).catch(function(){});setChats([]);setMessages([]);setActiveChat(null);notify('Chats cleared');},style:ghost({flex:1,fontSize:'11px',color:RED})},'✕ Clear Chats'),
          h('button',{onClick:logout,style:ghost({flex:1,fontSize:'11px',color:RED})},'↩ Logout')
        )
      ),
      // AI KEYS
      settingsTab==='ai' && h('div',null,
        // Free models info
        h('div',{style:{background:'rgba(46,204,138,0.08)',border:'1px solid rgba(46,204,138,0.2)',borderRadius:'12px',padding:'10px 12px',marginBottom:'12px'}},
          h('div',{style:{fontSize:'12px',fontWeight:700,color:GREEN,marginBottom:'4px'}},'✅ Free AI Models Active (No key needed)'),
          h('div',{style:{fontSize:'11px',color:MUTED}},'Claude • DeepSeek • Llama • Gemini • Mistral • Qwen — all built-in')
        ),
        h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'12px'}},'Optional: Add your own API keys for more models.'),

        [{id:'geminiKey',label:'Gemini API Key',link:'https://aistudio.google.com',free:true},
         {id:'openaiKey',label:'OpenAI Key',link:'https://platform.openai.com',free:false},
         {id:'grokKey',label:'Grok (xAI) Key',link:'https://console.x.ai',free:false}
        ].map(function(k){
          return h('div',{key:k.id,style:{marginBottom:'10px'}},
            h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'5px'}},
              h('label',{style:{fontSize:'11px',color:MUTED,fontWeight:600}},k.label),
              h('div',{style:{display:'flex',gap:'6px',alignItems:'center'}},
                k.free && h('span',{style:badge(GREEN,{fontSize:'9px'})},'Free'),
                h('a',{href:k.link,target:'_blank',style:{fontSize:'10px',color:BLUE,textDecoration:'none'}},'Get ↗')
              )
            ),
            h('div',{style:{display:'flex',gap:'6px'}},
              h('input',{type:'password',value:apiKeys[k.id]||'',onChange:function(e){var nk=Object.assign({},apiKeys);nk[k.id]=e.target.value;setApiKeys(nk);},
                placeholder:'Enter key...',style:inpStyle({flex:1,fontSize:'11px',padding:'8px 10px',fontFamily:'monospace'})}),
              h('button',{onClick:function(){var nk=Object.assign({},apiKeys);ST.set('fizux:apikeys',JSON.stringify(nk)).catch(function(){});notify('✅ Saved!');},style:btn({padding:'8px 12px',fontSize:'11px'})},'Save')
            )
          );
        })
      ),
      // APPEARANCE
      settingsTab==='appearance' && h('div',null,
        h('div',{style:{marginBottom:'14px'}},
          h('div',{style:{fontSize:'11px',color:MUTED,fontWeight:700,letterSpacing:'0.8px',marginBottom:'8px'}},'THEME'),
          h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}},
            [['dark','◐ Dark'],['light','☀ Light']].map(function(item){
              return h('button',{key:item[0],onClick:function(){setTheme(item[0]);ST.set('fizux:theme',item[0]).catch(function(){});},
                style:{padding:'12px',borderRadius:'12px',border:'2px solid '+(theme===item[0]?GOLD:BORDER),background:theme===item[0]?'rgba(201,168,76,0.1)':CARD2,cursor:'pointer',color:theme===item[0]?GOLD:TEXT,fontFamily:'inherit',fontSize:'13px',fontWeight:theme===item[0]?700:400}},item[1]);
            })
          )
        ),
        h('div',{style:{marginBottom:'14px'}},
          h('div',{style:{fontSize:'11px',color:MUTED,fontWeight:700,letterSpacing:'0.8px',marginBottom:'8px'}},'FONT SIZE — '+fontSize+'px'),
          h('div',{style:{display:'flex',gap:'6px'}},
            [12,13,14,15,16,18].map(function(s){
              return h('button',{key:s,onClick:function(){setFontSize(s);ST.set('fizux:fs',String(s)).catch(function(){});},
                style:{flex:1,padding:'7px 0',borderRadius:'8px',border:'1.5px solid '+(fontSize===s?GOLD:BORDER),background:fontSize===s?GOLD:'transparent',color:fontSize===s?'#1A1000':SUB,fontSize:'12px',cursor:'pointer'}},s);
            })
          )
        ),
        h('div',null,
          h('div',{style:{fontSize:'11px',color:MUTED,fontWeight:700,letterSpacing:'0.8px',marginBottom:'8px'}},'CUSTOM INSTRUCTIONS'),
          h('textarea',{value:customInstr,rows:3,onChange:function(e){setCustomInstr(e.target.value);},onBlur:function(){ST.set('fizux:ci',customInstr).catch(function(){});},
            placeholder:'e.g. Always reply in Hindi. I am a developer...',style:inpStyle({lineHeight:1.7})})
        )
      )
    )
  ) : null;

  // ── COMPARE MODAL ──
  var CompareModal=compareMode ? h('div',{style:overlay()},
    h('div',{style:modalStyle({maxWidth:'560px',maxHeight:'90vh'})},
      h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}},
        h('div',{style:{fontWeight:700,fontSize:'17px'}},'⚖ Compare AIs'),
        h('button',{onClick:function(){setCompareMode(false);setCompareRes({});},style:{color:MUTED,fontSize:'22px',background:'none',border:'none',cursor:'pointer'}},'✕')
      ),
      h('div',{style:{display:'flex',gap:'8px',marginBottom:'12px'}},
        h('input',{value:input,onChange:function(e){setInput(e.target.value);},onKeyDown:function(e){if(e.key==='Enter')sendCompare();},
          placeholder:'Ask Claude & Gemini simultaneously...',style:inpStyle({flex:1})}),
        h('button',{onClick:sendCompare,disabled:compareLoad||!input.trim(),style:btn({padding:'10px 14px',fontSize:'12px',opacity:compareLoad||!input.trim()?0.6:1})},
          compareLoad ? h('div',{style:{width:'16px',height:'16px',border:'2px solid #1A1000',borderTopColor:'transparent',borderRadius:'50%',animation:'spin .7s linear infinite'}}) : 'Compare →'
        )
      ),
      compareLoad && h('div',{style:{textAlign:'center',padding:'24px',color:MUTED}},'Comparing AIs...'),
      Object.keys(compareRes).length>0 && h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}},
        Object.keys(compareRes).map(function(mId){
          var mi=mInfo(mId);
          return h('div',{key:mId,style:card({borderLeft:'3px solid '+mi.color})},
            h('div',{style:{fontSize:'12px',fontWeight:700,color:mi.color,marginBottom:'8px'}},mi.icon+' '+mi.name),
            h('div',{style:{fontSize:'13px',lineHeight:1.8,whiteSpace:'pre-wrap',wordBreak:'break-word',maxHeight:'200px',overflowY:'auto'}},compareRes[mId]),
            h('button',{onClick:function(){navigator.clipboard.writeText(compareRes[mId]).then(function(){notify('Copied!');});},style:ghost({marginTop:'8px',fontSize:'11px',padding:'3px 8px'})},'Copy')
          );
        })
      )
    )
  ) : null;

  // ── MESSAGE RENDER ──
  function renderMsg(msg,i){
    var isUser=msg.role==='user';
    var mi=!isUser?mInfo(msg.model||'claude'):null;
    return h('div',{key:i,style:{padding:'16px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}},
      h('div',{style:{maxWidth:'720px',margin:'0 auto',padding:'0 16px'}},
        h('div',{style:{display:'flex',gap:'12px',alignItems:'flex-start'}},
          isUser
            ? h('div',{style:{width:'34px',height:'34px',borderRadius:'50%',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'13px',color:'#1A1000',flexShrink:0}},((user&&user.name)||'U').charAt(0).toUpperCase())
            : h('div',{style:{width:'34px',height:'34px',borderRadius:'50%',background:mi.color+'33',border:'1px solid '+mi.color+'66',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}},mi.icon),
          h('div',{style:{flex:1,minWidth:0}},
            h('div',{style:{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}},
              h('span',{style:{fontSize:'12px',fontWeight:700,color:TEXT}},isUser?((user&&user.name)||'You'):'FIZUX'),
              mi && h('span',{style:badge(mi.color,{fontSize:'9px'})},mi.name),
              msg.searched && h('span',{style:badge(GREEN,{fontSize:'9px'})},'⊕ Web'),
              msg.ts && h('span',{style:{fontSize:'10px',color:MUTED}},new Date(msg.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}))
            ),
            h('div',{style:{fontSize:fontSize+'px',lineHeight:1.85,whiteSpace:'pre-wrap',wordBreak:'break-word',color:TEXT}},msg.content),
            !isUser && h('div',{style:{display:'flex',gap:'4px',marginTop:'8px',flexWrap:'wrap'}},
              h('button',{onClick:function(){navigator.clipboard.writeText(msg.content).then(function(){notify('Copied!');});},style:ghost({padding:'3px 8px',fontSize:'11px'})},'Copy'),
              h('button',{onClick:function(){var u=new SpeechSynthesisUtterance(msg.content.slice(0,300));window.speechSynthesis.speak(u);},style:ghost({padding:'3px 8px',fontSize:'11px'})},'▷ Read')
            )
          )
        )
      )
    );
  }

  // ── MAIN UI ──
  return h('div',{
    style:{height:'100vh',display:'flex',flexDirection:'column',overflow:'hidden',background:BG},
    onDragOver:function(e){e.preventDefault();},
    onDrop:function(e){e.preventDefault();Array.from(e.dataTransfer.files).forEach(processFile);}
  },
    // Toast
    toast.msg && h('div',{style:{position:'fixed',top:'16px',left:'50%',transform:'translateX(-50%)',background:CARD,border:'1.5px solid '+(toast.type==='err'?RED:GREEN),borderRadius:'12px',padding:'10px 20px',fontSize:'13px',fontWeight:500,color:toast.type==='err'?RED:GREEN,zIndex:9999,whiteSpace:'nowrap'}},toast.msg),
    OnboardModal,
    SettingsModal,
    LimitModal,
    CompareModal,

    // Sidebar overlay
    sidebar && h('div',{onClick:function(){setSidebar(false);},style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:98}}),

    // Sidebar
    h('div',{style:{position:'fixed',left:0,top:0,bottom:0,width:sidebar?'275px':'0',transition:'width 0.25s ease',overflow:'hidden',zIndex:99,background:isLight?'#F0F0F8':'#111118',borderRight:'1px solid '+BORDER}},
      h('div',{style:{width:'275px',height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}},
        // Header
        h('div',{style:{padding:'14px 12px 8px',display:'flex',alignItems:'center',gap:'8px'}},
          h('div',{style:{width:'30px',height:'30px',borderRadius:'10px',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'14px',color:'#1A1000'}},'F'),
          h('span',{style:{fontWeight:700,fontSize:'14px',flex:1,color:TEXT}},'FIZUX'),
          isPremium && h('span',{style:badge(GOLD,{fontSize:'9px'})},'✦'),
          h('button',{onClick:function(){setSidebar(false);},style:{color:MUTED,fontSize:'16px',background:'none',border:'none',cursor:'pointer'}},'✕')
        ),
        h('div',{style:{padding:'0 10px 8px'}},
          h('button',{onClick:newChat,style:{width:'100%',padding:'9px 12px',borderRadius:'10px',border:'1px solid '+BORDER,background:CARD,color:TEXT,fontSize:'13px',cursor:'pointer',textAlign:'left',fontFamily:'inherit',fontWeight:600}},'✎ New chat')
        ),
        !isPremium && h('div',{style:{padding:'0 10px 8px'}},
          h('div',{style:{padding:'7px 10px',borderRadius:'9px',background:daily>=FREE_DAILY?'rgba(255,77,106,0.1)':'rgba(46,204,138,0.08)',border:'1px solid '+(daily>=FREE_DAILY?'rgba(255,77,106,0.3)':'rgba(46,204,138,0.25)'),display:'flex',justifyContent:'space-between',fontSize:'11px'}},
            h('span',{style:{color:MUTED}},'Free today:'),
            h('span',{style:{fontWeight:700,color:daily>=FREE_DAILY?RED:GREEN}},remaining()+' left')
          )
        ),
        h('div',{style:{flex:1,overflowY:'auto',padding:'0 10px'}},
          h('div',{style:{fontSize:'9px',color:MUTED,fontWeight:700,letterSpacing:'1.5px',marginBottom:'6px',marginTop:'4px'}},'⚡ TOOLS'),
          FEATURES.map(function(f){
            return h('button',{key:f.id,onClick:function(){setInput(f.label+' ');setSidebar(false);if(inputRef.current)inputRef.current.focus();},
              style:{width:'100%',padding:'7px 8px',borderRadius:'8px',border:'none',background:'transparent',color:TEXT,cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:'7px',marginBottom:'1px',fontFamily:'inherit'}},
              h('span',{style:{fontSize:'13px',color:MUTED,flexShrink:0,width:'16px'}},f.icon),
              h('span',{style:{fontSize:'11px',fontWeight:600}},f.label),
              !f.free&&!isPremium && h('span',{style:badge(PURPLE,{fontSize:'8px',padding:'0 3px',marginLeft:'4px'})},'PRO')
            );
          }),
          chats.length>0 && h('div',null,
            h('div',{style:{fontSize:'9px',color:MUTED,fontWeight:700,letterSpacing:'1.5px',padding:'10px 2px 5px'}},'RECENT CHATS'),
            chats.slice(0,12).map(function(c){
              return h('div',{key:c.id,onClick:function(){setMessages(c.messages);setActiveChat(c.id);setSidebar(false);},
                style:{padding:'7px 8px',borderRadius:'8px',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px',background:activeChat===c.id?CARD2:'transparent'}},
                h('span',{style:{flex:1,fontSize:'11px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:SUB}},'▪ '+c.title),
                h('button',{onClick:function(e){e.stopPropagation();delChat(c.id);},style:{background:'none',border:'none',color:MUTED,cursor:'pointer',fontSize:'11px'}},'✕')
              );
            })
          )
        ),
        h('div',{style:{borderTop:'1px solid '+BORDER,padding:'10px 12px'}},
          h('div',{style:{display:'flex',gap:'4px'}},
            [['⚙',function(){setShowSettings(true);setSidebar(false);},'Settings'],
             ['⚖',function(){setCompareMode(true);setSidebar(false);},'Compare'],
             ['◐',function(){var n=theme==='dark'?'light':'dark';setTheme(n);ST.set('fizux:theme',n).catch(function(){});},'Theme'],
             ['↩',logout,'Logout']
            ].map(function(item){
              return h('button',{key:item[2],onClick:item[1],title:item[2],style:{flex:1,background:CARD,border:'1px solid '+BORDER,borderRadius:'7px',padding:'6px 0',cursor:'pointer',fontSize:'12px',color:MUTED}},item[0]);
            })
          )
        )
      )
    ),

    // Header
    h('div',{style:{background:BG,borderBottom:'1px solid '+BORDER,padding:'0 12px',height:'50px',display:'flex',alignItems:'center',gap:'8px',flexShrink:0}},
      h('button',{onClick:function(){setSidebar(!sidebar);},style:{background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',gap:'4px',padding:'6px',borderRadius:'8px'}},
        [0,1,2].map(function(i){return h('div',{key:i,style:{width:'17px',height:'2px',borderRadius:'2px',background:TEXT}});})
      ),
      // Model select
      h('div',{style:{position:'relative'}},
        h('button',{onClick:function(){setModelMenu(!modelMenu);},style:{background:'transparent',border:'1px solid '+BORDER,borderRadius:'10px',padding:'6px 11px',color:TEXT,cursor:'pointer',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'6px',fontFamily:'inherit'}},
          h('span',{style:{color:curModel.color}},curModel.icon),
          curModel.name,
          h('span',{style:{fontSize:'8px',color:MUTED}},'▾')
        ),
        modelMenu && h('div',{style:{position:'absolute',top:'calc(100% + 4px)',left:0,background:CARD,border:'1px solid #363648',borderRadius:'16px',padding:'8px',zIndex:100,minWidth:'200px',boxShadow:'0 8px 40px rgba(0,0,0,0.5)'}},
          MODELS.map(function(m){
            return h('button',{key:m.id,onClick:function(){setModel(m.id);setModelMenu(false);},
              style:{display:'flex',width:'100%',alignItems:'center',gap:'10px',padding:'9px 12px',borderRadius:'10px',border:'none',background:model===m.id?CARD2:'transparent',cursor:'pointer',fontFamily:'inherit'}},
              h('span',{style:{fontSize:'14px',color:m.color,flexShrink:0}},m.icon),
              h('div',{style:{flex:1,textAlign:'left'}},
                h('div',{style:{fontSize:'12px',fontWeight:600,color:TEXT}},m.name),
                h('div',{style:{fontSize:'10px',color:MUTED}},m.id==='auto'?'Smart auto-select':m.free?'Free':'Key needed')
              ),
              m.free && h('span',{style:badge(GREEN,{fontSize:'9px'})},'Free')
            );
          })
        )
      ),
      curUC && h('span',{style:badge(curUC.color,{fontSize:'11px',padding:'4px 10px'})},curUC.icon+' '+curUC.name),
      h('div',{style:{flex:1}}),
      detFeat && h('span',{style:badge(PURPLE,{fontSize:'10px',maxWidth:'100px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'})},'⚡ '+detFeat),
      !isPremium && h('span',{style:badge(daily>=FREE_DAILY?RED:GREEN,{fontSize:'10px',padding:'4px 9px'})},daily>=FREE_DAILY?'⏰ Limit':remaining()+' free'),
      isPremium && h('span',{style:badge(GOLD,{fontSize:'11px',padding:'4px 9px'})},'✦ '+premVer),
      h('button',{onClick:function(){setImgPanel(!imgPanel);},style:{background:'transparent',border:'1px solid '+BORDER,borderRadius:'8px',padding:'6px 9px',cursor:'pointer',fontSize:'12px',color:MUTED}},'🎨'),
      h('button',{onClick:function(){setCompareMode(true);},style:{background:'transparent',border:'1px solid '+BORDER,borderRadius:'8px',padding:'6px 9px',cursor:'pointer',fontSize:'12px',color:BLUE}},'⚖'),
      h('button',{onClick:function(){setShowSettings(true);},style:{background:'transparent',border:'1px solid '+BORDER,borderRadius:'8px',padding:'6px 9px',cursor:'pointer',fontSize:'12px',color:MUTED}},'⚙'),
      h('button',{onClick:newChat,style:btn({fontSize:'11px',padding:'6px 12px',borderRadius:'9px'})},'✎ New')
    ),

    // Image panel
    imgPanel && h('div',{style:{background:isLight?'#F0F0F8':'#111118',borderBottom:'1px solid '+BORDER,padding:'10px 14px',flexShrink:0}},
      h('div',{style:{display:'flex',gap:'8px',marginBottom:genImgs.length?'10px':'0'}},
        h('input',{value:imgPrompt,onChange:function(e){setImgPrompt(e.target.value);},
          onKeyDown:function(e){if(e.key==='Enter'&&imgPrompt.trim()){var s=Math.floor(Math.random()*99999);setGenImgs(['https://image.pollinations.ai/prompt/'+encodeURIComponent(imgPrompt)+'?seed='+s+'&width=768&height=768&nologo=true','https://image.pollinations.ai/prompt/'+encodeURIComponent(imgPrompt+', professional')+'?seed='+(s+1)+'&width=768&height=768&nologo=true','https://image.pollinations.ai/prompt/'+encodeURIComponent(imgPrompt+', artistic')+'?seed='+(s+2)+'&width=768&height=768&nologo=true']);notify('Generated!');}},
          placeholder:'Describe your image...',style:inpStyle({flex:1})}),
        h('button',{onClick:function(){if(!imgPrompt.trim())return;var s=Math.floor(Math.random()*99999);setGenImgs(['https://image.pollinations.ai/prompt/'+encodeURIComponent(imgPrompt)+'?seed='+s+'&width=768&height=768&nologo=true','https://image.pollinations.ai/prompt/'+encodeURIComponent(imgPrompt+', professional')+'?seed='+(s+1)+'&width=768&height=768&nologo=true','https://image.pollinations.ai/prompt/'+encodeURIComponent(imgPrompt+', artistic')+'?seed='+(s+2)+'&width=768&height=768&nologo=true']);notify('Generated!');},style:btn({padding:'10px 14px',fontSize:'12px'})},'Generate'),
        h('button',{onClick:function(){setImgPanel(false);setGenImgs([]);},style:ghost({padding:'10px 11px'})},'✕')
      ),
      genImgs.length>0 && h('div',{style:{display:'flex',gap:'8px',overflowX:'auto'}},
        genImgs.map(function(url,i){
          return h('div',{key:i,style:{flexShrink:0}},
            h('img',{src:url,alt:'',style:{width:'100px',height:'100px',borderRadius:'10px',objectFit:'cover',border:'1px solid '+BORDER},onError:function(e){e.target.style.display='none';}}),
            h('a',{href:url,download:true,style:{display:'block',textAlign:'center',fontSize:'9px',color:MUTED,marginTop:'3px',textDecoration:'none'}},'↓ Save')
          );
        })
      )
    ),

    // Chat area
    h('div',{style:{flex:1,overflowY:'auto',paddingBottom:'8px'},onClick:function(){setModelMenu(false);}},
      messages.length===0
        // Welcome
        ? h('div',{style:{maxWidth:'720px',margin:'0 auto',padding:'24px 16px'}},
            h('div',{style:{textAlign:'center',marginBottom:'24px'}},
              h('div',{style:{width:'72px',height:'72px',borderRadius:'22px',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',fontWeight:800,color:'#1A1000',margin:'0 auto 14px',boxShadow:'0 4px 20px rgba(201,168,76,0.3)'}},'F'),
              h('div',{style:{fontSize:'22px',fontWeight:800,color:TEXT,marginBottom:'6px'}},curUC?curUC.icon+' '+curUC.name+' Mode':'FIZUX AI Universe'),
              h('div',{style:{fontSize:'12px',color:MUTED}},'10+ AI Models · 130+ Features'),
              !isPremium && h('div',{style:{marginTop:'8px'}},h('span',{style:badge(daily>=FREE_DAILY?RED:GREEN,{fontSize:'11px',padding:'4px 12px'})},daily>=FREE_DAILY?'⏰ Limit reached':'🆓 '+remaining()+' free messages today'))
            ),
            h('div',{style:{fontSize:'10px',color:MUTED,fontWeight:700,letterSpacing:'1.2px',marginBottom:'8px'}},'⚡ AI MODELS'),
            h('div',{style:{display:'flex',gap:'6px',overflowX:'auto',paddingBottom:'4px',marginBottom:'18px'}},
              MODELS.map(function(m){
                return h('button',{key:m.id,onClick:function(){setModel(m.id);},
                  style:{padding:'7px 12px',borderRadius:'20px',flexShrink:0,border:'1.5px solid '+(model===m.id?m.color:BORDER),background:model===m.id?m.color+'14':CARD,color:model===m.id?m.color:SUB,fontSize:'11px',fontWeight:model===m.id?700:400,cursor:'pointer',display:'flex',alignItems:'center',gap:'5px',fontFamily:'inherit'}},
                  m.icon,' ',m.name
                );
              })
            ),
            h('div',{style:{fontSize:'10px',color:MUTED,fontWeight:700,letterSpacing:'1.2px',marginBottom:'8px'}},'🛠 QUICK TOOLS'),
            h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:'7px',marginBottom:'20px'}},
              FEATURES.slice(0,12).map(function(f){
                return h('button',{key:f.id,onClick:function(){setInput(f.label+' ');if(inputRef.current)inputRef.current.focus();},
                  style:{background:CARD,border:'1px solid '+BORDER,borderRadius:'12px',padding:'12px 8px',cursor:'pointer',textAlign:'center',fontFamily:'inherit',position:'relative'}},
                  !f.free&&!isPremium && h('span',{style:{position:'absolute',top:'6px',right:'6px',fontSize:'8px',background:PURPLE+'22',color:PURPLE,padding:'1px 4px',borderRadius:'4px',fontWeight:700}},'PRO'),
                  h('div',{style:{fontSize:'18px',marginBottom:'5px'}},f.icon),
                  h('div',{style:{fontSize:'10px',fontWeight:700,color:TEXT,lineHeight:1.3}},f.label)
                );
              })
            ),
            h('div',{style:{fontSize:'10px',color:MUTED,fontWeight:700,letterSpacing:'1.2px',marginBottom:'8px'}},'💬 QUICK START'),
            h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}},
              [['✉','Write a professional email','Office task'],
               ['📄','Build my resume','Job ready'],
               ['💻','Write code for me','Developer'],
               ['🌟','Set my goals','Personal']
              ].map(function(item){
                return h('button',{key:item[0],onClick:function(){setInput(item[1]+' ');if(inputRef.current)inputRef.current.focus();},
                  style:{background:CARD,border:'1px solid '+BORDER,borderRadius:'12px',padding:'13px 12px',cursor:'pointer',textAlign:'left',fontFamily:'inherit'}},
                  h('div',{style:{fontSize:'18px',marginBottom:'5px'}},item[0]),
                  h('div',{style:{fontSize:'12px',fontWeight:700,color:TEXT,marginBottom:'3px'}},item[1]),
                  h('div',{style:{fontSize:'10px',color:MUTED}},item[2])
                );
              })
            )
          )
        // Messages
        : h('div',null,
            messages.map(function(msg,i){ return renderMsg(msg,i); }),
            loading && h('div',{style:{padding:'16px 0'}},
              h('div',{style:{maxWidth:'720px',margin:'0 auto',padding:'0 16px'}},
                h('div',{style:{display:'flex',gap:'12px'}},
                  h('div',{style:{width:'34px',height:'34px',borderRadius:'50%',background:curModel.color+'33',border:'1px solid '+curModel.color+'66',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}},curModel.icon),
                  h('div',{style:{display:'flex',gap:'4px',alignItems:'center',paddingTop:'10px'}},
                    [0,1,2].map(function(i){return h('div',{key:i,style:{width:'7px',height:'7px',borderRadius:'50%',background:MUTED,animation:'bounce 1.2s infinite',animationDelay:(i*0.2)+'s'}});})
                  )
                )
              )
            ),
            followUps.length>0&&!loading && h('div',{style:{maxWidth:'720px',margin:'0 auto',padding:'8px 16px 0'}},
              h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'5px',fontWeight:600}},'💡 Follow-ups:'),
              h('div',{style:{display:'flex',flexWrap:'wrap',gap:'5px'}},
                followUps.map(function(q,i){
                  return h('button',{key:i,onClick:function(){send(q);setFollowUps([]);},
                    style:{background:CARD,border:'1px solid '+BORDER,borderRadius:'20px',color:MUTED,padding:'5px 12px',cursor:'pointer',fontSize:'12px',fontFamily:'inherit'}},q);
                })
              )
            ),
            h('div',{ref:bottomRef})
          )
    ),

    // Input area
    h('div',{style:{padding:'0 12px 14px',flexShrink:0}},
      h('div',{style:{maxWidth:'720px',margin:'0 auto'}},
        attach.length>0 && h('div',{style:{display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'7px'}},
          attach.map(function(a,i){
            return h('div',{key:i,style:{background:CARD,border:'1px solid '+BORDER,borderRadius:'8px',padding:'4px 9px',display:'flex',alignItems:'center',gap:'4px',fontSize:'11px'}},
              a.type==='image'?'🖼':a.type==='excel'?'📊':'📄',
              h('span',{style:{color:TEXT}},a.name.slice(0,18)),
              h('button',{onClick:function(){setAttach(function(p){return p.filter(function(_,j){return j!==i;});});},style:{background:'none',border:'none',color:MUTED,cursor:'pointer',fontSize:'11px'}},'✕')
            );
          })
        ),
        h('div',{style:{background:CARD,border:'2px solid '+(listening?RED:BORDER),borderRadius:'18px',padding:'11px 13px',boxShadow:'0 2px 12px rgba(0,0,0,0.3)',transition:'border 0.2s'}},
          h('textarea',{
            ref:inputRef,value:input,rows:1,
            onChange:function(e){
              setInput(e.target.value);
              e.target.style.height='auto';
              e.target.style.height=Math.min(e.target.scrollHeight,140)+'px';
              if(e.target.value.length>5) setDetFeat(detectFeat(e.target.value));
              else setDetFeat(null);
            },
            onKeyDown:function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}},
            placeholder:listening?'Listening...':'Message FIZUX... (Shift+Enter for new line)',
            style:{width:'100%',background:'transparent',border:'none',color:TEXT,fontSize:fontSize+'px',fontFamily:'inherit',lineHeight:1.6,maxHeight:'140px',boxSizing:'border-box',outline:'none'}
          }),
          h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'8px'}},
            h('div',{style:{display:'flex',gap:'4px'}},
              h('button',{onClick:function(){if(fileRef.current)fileRef.current.click();},title:'Attach file',style:{background:'transparent',border:'none',borderRadius:'7px',color:MUTED,cursor:'pointer',fontSize:'15px',padding:'3px 6px'}},'📎'),
              h('input',{ref:fileRef,type:'file',onChange:function(e){Array.from(e.target.files).forEach(processFile);e.target.value='';},style:{display:'none'},multiple:true,accept:'image/*,.txt,.csv,.json,.md,.pdf,.docx,.xlsx,.xls,.js,.py,.html,.sql'}),
              h('button',{onClick:listening?stopVoice:startVoice,title:'Voice input',style:{background:listening?'rgba(255,77,106,0.1)':'transparent',border:'none',borderRadius:'7px',color:listening?RED:MUTED,cursor:'pointer',fontSize:'15px',padding:'3px 6px'}},listening?'🔴':'🎤'),
              h('button',{onClick:function(){setImgPanel(!imgPanel);},title:'Generate image',style:{background:'transparent',border:'none',borderRadius:'7px',color:MUTED,cursor:'pointer',fontSize:'15px',padding:'3px 6px'}},'🎨')
            ),
            h('button',{
              onClick:function(){send();},
              disabled:(!input.trim()&&!attach.length)||loading,
              style:{width:'34px',height:'34px',borderRadius:'50%',background:(!input.trim()&&!attach.length)||loading?BORDER:'linear-gradient(135deg,#C9A84C,#E8C96B)',border:'none',cursor:(!input.trim()&&!attach.length)||loading?'not-allowed':'pointer',fontSize:'15px',display:'flex',alignItems:'center',justifyContent:'center',color:(!input.trim()&&!attach.length)||loading?MUTED:'#1A1000',transition:'all 0.2s'}},
              loading ? h('div',{style:{width:'14px',height:'14px',border:'2px solid '+MUTED,borderTopColor:'transparent',borderRadius:'50%',animation:'spin .7s linear infinite'}}) : '↑'
            )
          )
        ),
        h('div',{style:{textAlign:'center',marginTop:'5px',fontSize:'10px',color:MUTED}},'FIZUX v9.0 · '+remaining()+' free msgs · dofizuxai@gmail.com')
      )
    )
  );
}

var container=document.getElementById('root');
var root=ReactDOM.createRoot(container);
root.render(React.createElement(FIZUXApp));
})();
