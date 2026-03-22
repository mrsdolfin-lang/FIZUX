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
  {id:'slow', name:'SLOW', icon:'🐢', color:'#8B6FE8', free:true},
  {id:'fast', name:'FAST', icon:'⚡', color:'#2ECC8A',  free:true}
];
var FAST_DAILY=30;
  var FAST_DAILY_PREMIUM=300;

var USE_CASES=[
  {id:'office',  icon:'💼',name:'Office',   color:'#4A9EFF'},
  {id:'student', icon:'🎓',name:'Student',  color:'#8B6FE8'},
  {id:'creator', icon:'🎨',name:'Creator',  color:'#FF6B9D'},
  {id:'business',icon:'🚀',name:'Business', color:'#000000'},
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

// ── AI CALLS VIA WORKER BACKEND ──




function getAIKeys() {
  var k = {groqKeys:[],cerebrasKeys:[],hfToken:'',geminiKey:'',claudeKey:'',openaiKey:'',grokKey:''};
  try {
    var s = localStorage.getItem('sh_fizux:aikeys');
    if (s) {
      var parsed = JSON.parse(s);
      k.groqKeys = (parsed.groqKeys||[]).filter(function(x){return x&&x.trim();});
      k.cerebrasKeys = (parsed.cerebrasKeys||[]).filter(function(x){return x&&x.trim();});
      k.hfToken = parsed.hfToken||'';
      k.geminiKey = parsed.geminiKey||'';
    }
  } catch(e) {}
  return k;
}

function getGroqKey() {
  var k = getAIKeys();
  if (!k.groqKeys.length) return '';
  var idx = 0;
  try { idx = parseInt(localStorage.getItem('fizux:groqIdx')||'0') % k.groqKeys.length; } catch(e){}
  var key = k.groqKeys[idx];
  try { localStorage.setItem('fizux:groqIdx', String((idx+1)%k.groqKeys.length)); } catch(e){}
  return key;
}

function getCerebrasKey() {
  var k = getAIKeys();
  if (!k.cerebrasKeys.length) return '';
  var idx = 0;
  try { idx = parseInt(localStorage.getItem('fizux:cerebrasIdx')||'0') % k.cerebrasKeys.length; } catch(e){}
  var key = k.cerebrasKeys[idx];
  try { localStorage.setItem('fizux:cerebrasIdx', String((idx+1)%k.cerebrasKeys.length)); } catch(e){}
  return key;
}

function callCerebras(msgs, model, apiKey) {
  var CEREBRAS_MODELS = {
    'openai':   'llama3.3-70b',
    'mistral':  'llama3.3-70b',
    'deepseek': 'llama3.3-70b',
    'llama':    'llama3.1-8b',
    'qwen':     'llama3.1-8b'
  };
  var cModel = CEREBRAS_MODELS[model] || 'llama3.3-70b';
  var messages = msgs.slice(-12).map(function(m){return{role:m.role,content:String(m.content||'')};});
  return fetch('https://api.cerebras.ai/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
    body:JSON.stringify({model:cModel,messages:messages,max_tokens:1024,temperature:0.7})
  }).then(function(r){
    if(!r.ok) throw new Error('Cerebras HTTP '+r.status);
    return r.json();
  }).then(function(d){
    var t='';
    try{t=d.choices[0].message.content;}catch(e){}
    if(!t) throw new Error('empty');
    return {reply:t.trim(),model:'Cerebras'};
  });
}

function callAI(modelId, msgs, keys, userText) {
  var taskModel = pickModel('auto', userText || '');

  if (modelId === 'fast') {
    // FAST mode: Cerebras only
    var cerebrasKey = getCerebrasKey();
    if (cerebrasKey && cerebrasKey.length > 10) {
      return callCerebras(msgs,taskModel,cerebrasKey).catch(function(){
        return Promise.resolve({reply:'⚡ Cerebras busy. Try again in a moment.',model:'error'});
      });
    }
    return Promise.resolve({reply:'⚡ No Cerebras key set. Go to AFZUX → AI Keys to add your Cerebras key.',model:'error'});
  }

  if (modelId === 'slow') {
    // SLOW mode: Groq only
    var groqKey = getGroqKey();
    if (groqKey && groqKey.length > 10) {
      return callGroq(msgs,taskModel,groqKey).catch(function(){
        return Promise.resolve({reply:'🐢 Groq busy. Try again in a moment.',model:'error'});
      });
    }
    return Promise.resolve({reply:'🐢 No Groq key set. Go to AFZUX → AI Keys to add your Groq key.',model:'error'});
  }

  return Promise.resolve({reply:'Please select SLOW or FAST mode.',model:'error'});
}

function pickModel(modelId, text) {
  var t = text.toLowerCase();
  if (modelId === 'mistral')  return 'mistral';
  if (modelId === 'deepseek') return 'deepseek';
  if (modelId === 'llama')    return 'llama';
  if (modelId === 'qwen')     return 'qwen';
  if (modelId === 'r1')       return 'deepseek';
  if (/code|sql|program|function|debug|html|css|javascript|python|java/.test(t)) return 'openai';
  if (/math|calculat|equation|solve|algebra|formula/.test(t))                    return 'openai';
  if (/translat|hindi|urdu|french|spanish|arabic|chinese|japanese/.test(t))      return 'mistral';
  if (/reason|analyze|deep think|compare|pros cons/.test(t))                     return 'deepseek';
  return 'openai';
}

function callGroq(msgs, model, apiKey) {
  var GROQ_MODELS = {
    'openai':   'llama-3.3-70b-versatile',
    'mistral':  'mixtral-8x7b-32768',
    'deepseek': 'deepseek-r1-distill-llama-70b',
    'llama':    'llama-3.2-3b-preview',
    'qwen':     'llama-3.3-70b-versatile'
  };
  var gModel = GROQ_MODELS[model] || 'llama-3.3-70b-versatile';
  var messages = msgs.slice(-12).map(function(m){return{role:m.role,content:String(m.content||'')};});
  return fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
    body:JSON.stringify({model:gModel,messages:messages,max_tokens:1024,temperature:0.7})
  }).then(function(r){
    if(!r.ok) throw new Error('Groq HTTP '+r.status);
    return r.json();
  }).then(function(d){
    var t='';
    try{t=d.choices[0].message.content;}catch(e){}
    if(!t) throw new Error('empty');
    return {reply:t.trim(),model:'Groq '+gModel.split('-')[0]};
  });
}

function callCerebras(msgs, model, apiKey) {
  var CEREBRAS_MODELS = {
    'openai':   'llama3.3-70b',
    'mistral':  'llama3.3-70b',
    'deepseek': 'llama3.3-70b',
    'llama':    'llama3.1-8b',
    'qwen':     'llama3.1-8b'
  };
  var cModel = CEREBRAS_MODELS[model] || 'llama3.3-70b';
  var messages = msgs.slice(-12).map(function(m){return{role:m.role,content:String(m.content||'')};});
  return fetch('https://api.cerebras.ai/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
    body:JSON.stringify({model:cModel,messages:messages,max_tokens:1024,temperature:0.7})
  }).then(function(r){
    if(!r.ok) throw new Error('Cerebras HTTP '+r.status);
    return r.json();
  }).then(function(d){
    var t='';
    try{t=d.choices[0].message.content;}catch(e){}
    if(!t) throw new Error('empty');
    return {reply:t.trim(),model:'Cerebras'};
  });
}

function callAI(modelId, msgs, keys, userText) {
  var taskModel = pickModel('auto', userText || '');

  if (modelId === 'fast') {
    // FAST mode: Cerebras only
    var cerebrasKey = getCerebrasKey();
    if (cerebrasKey && cerebrasKey.length > 10) {
      return callCerebras(msgs,taskModel,cerebrasKey).catch(function(){
        return Promise.resolve({reply:'⚡ Cerebras busy. Try again in a moment.',model:'error'});
      });
    }
    return Promise.resolve({reply:'⚡ No Cerebras key set. Go to AFZUX → AI Keys to add your Cerebras key.',model:'error'});
  }

  if (modelId === 'slow') {
    // SLOW mode: Groq only
    var groqKey = getGroqKey();
    if (groqKey && groqKey.length > 10) {
      return callGroq(msgs,taskModel,groqKey).catch(function(){
        return Promise.resolve({reply:'🐢 Groq busy. Try again in a moment.',model:'error'});
      });
    }
    return Promise.resolve({reply:'🐢 No Groq key set. Go to AFZUX → AI Keys to add your Groq key.',model:'error'});
  }

  return Promise.resolve({reply:'Please select SLOW or FAST mode.',model:'error'});
}

function pickModel(modelId, text) {
  var t = text.toLowerCase();
  if (modelId === 'mistral')  return 'mistral';
  if (modelId === 'deepseek') return 'deepseek';
  if (modelId === 'llama')    return 'llama';
  if (modelId === 'qwen')     return 'qwen';
  if (modelId === 'r1')       return 'deepseek';
  if (/code|sql|program|function|debug|html|css|javascript|python|java/.test(t)) return 'openai';
  if (/math|calculat|equation|solve|algebra|formula/.test(t))                    return 'openai';
  if (/translat|hindi|urdu|french|spanish|arabic|chinese|japanese/.test(t))      return 'mistral';
  if (/reason|analyze|deep think|compare|pros cons/.test(t))                     return 'deepseek';
  return 'openai';
}

function callGroq(msgs, model, apiKey) {
  var GROQ_MODELS = {
    'openai':   'llama-3.3-70b-versatile',
    'mistral':  'mixtral-8x7b-32768',
    'deepseek': 'deepseek-r1-distill-llama-70b',
    'llama':    'llama-3.2-3b-preview',
    'qwen':     'llama-3.3-70b-versatile'
  };
  var gModel = GROQ_MODELS[model] || 'llama-3.3-70b-versatile';
  var messages = msgs.slice(-12).map(function(m){return{role:m.role,content:String(m.content||'')};});
  return fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
    body:JSON.stringify({model:gModel,messages:messages,max_tokens:1024,temperature:0.7})
  }).then(function(r){
    if(!r.ok) throw new Error('Groq HTTP '+r.status);
    return r.json();
  }).then(function(d){
    var t='';
    try{t=d.choices[0].message.content;}catch(e){}
    if(!t) throw new Error('empty');
    return {reply:t.trim(),model:'Groq '+gModel.split('-')[0]};
  });
}

function FIZUXApp(){
  var s0=useState('loading'); var screen=s0[0]; var setScreen=s0[1];
  var s1=useState(null); var user=s1[0]; var setUser=s1[1];
  var s2=useState([]); var messages=s2[0]; var setMessages=s2[1];
  var s3=useState([]); var chats=s3[0]; var setChats=s3[1];
  var s4=useState(null); var activeChat=s4[0]; var setActiveChat=s4[1];
  var s5=useState(''); var input=s5[0]; var setInput=s5[1];
  var s6=useState(false); var loading=s6[0]; var setLoading=s6[1];
  var s7=useState('slow'); var model=s7[0]; var setModel=s7[1];
  var s8=useState(false); var modelMenu=s8[0]; var setModelMenu=s8[1];
  var s9=useState(false); var sidebar=s9[0]; var setSidebar=s9[1];
  var s10=useState({msg:'',type:'ok'}); var toast=s10[0]; var setToast=s10[1];
  var s11=useState(false); var isPremium=s11[0]; var setIsPremium=s11[1];
  var s12=useState(''); var premVer=s12[0]; var setPremVer=s12[1];
  var s13=useState(0); var daily=s13[0]; var setDaily=s13[1];
  var s_fd=useState(0); var fastDaily=s_fd[0]; var setFastDaily=s_fd[1];
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
  var s62=useState(null); var selectedFeat=s62[0]; var setSelectedFeat=s62[1];
  var s33=useState(false); var compareMode=s33[0]; var setCompareMode=s33[1];
  var s34=useState({}); var compareRes=s34[0]; var setCompareRes=s34[1];
  var s35=useState(false); var compareLoad=s35[0]; var setCompareLoad=s35[1];

  var bottomRef=useRef(null);
  var scrollRef=useRef(null);
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
  var GOLD='#000000';
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
  function canSend(){ if(model==='slow') return true; if(model==='fast') return fastDaily<(isPremium?FAST_DAILY_PREMIUM:FAST_DAILY); return true; }
  function remaining(){ if(model==='slow') return '∞'; var lim=isPremium?FAST_DAILY_PREMIUM:FAST_DAILY; return Math.max(0,lim-fastDaily)+' fast left'; }

  // LOAD PREFS
  useEffect(function(){
    ST.get('fizux:theme').then(function(d){setTheme(d.value);}).catch(function(){});
    ST.get('fizux:fs').then(function(d){setFontSize(parseInt(d.value)||14);}).catch(function(){});
    ST.get('fizux:ci').then(function(d){setCustomInstr(d.value);}).catch(function(){});
    // Keys loaded from AFZUX shared storage on each AI call
    getDailyCount().then(function(c){setDaily(c);});
        // Load fast daily count
        var fastDayKey = 'fizux:fastday:'+getDayKey();
        try{
          var fd = parseInt(localStorage.getItem(fastDayKey)||'0');
          setFastDaily(isNaN(fd)?0:fd);
        }catch(e){}
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
      return ST.get('fizux:blocked:'+saved.uid,true).then(function(b){
        try{var bl=JSON.parse(b.value);if(bl.blocked){ST.del(SESSION);setScreen('login');return;}}catch(e){}
        setUser(saved);
        return loadUserData(saved.uid);
      }).catch(function(){
        setUser(saved);
        return loadUserData(saved.uid);
      });
    }).then(function(){
      setScreen('chat');
    }).catch(function(){
      setScreen('login');
    });
  },[]);

  function loadUserData(userId){
    return new Promise(function(resolve){
      var tasks=[
        (function(){try{var cd=sessionStorage.getItem('fizux:chats:'+userId);if(cd){var ch=JSON.parse(cd);if(Array.isArray(ch))setChats(ch);}}catch(e){}return Promise.resolve();})(),
        ST.get('fizux:premium:'+userId).then(function(d){
          var p=JSON.parse(d.value);
          var ok=p.expiry==='lifetime'||new Date(p.expiry)>new Date();
          if(ok){setIsPremium(true);setPremVer(p.version);try{localStorage.setItem('fizux:ispremium','1');}catch(e){}}
        }).catch(function(){}),
        ST.get('fizux:uc:'+userId).then(function(d){setUseCase(d.value);}).catch(function(){setShowOnboard(true);}),
        getDailyCount().then(function(c){setDaily(c);})
      ];
      Promise.all(tasks).then(resolve).catch(resolve);
    });
  }

  // GUEST LOGIN (no google)
  function loginGuest(){
    setLoginLoading(true);
    var userId='guest_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
    var u={uid:userId,name:'Guest User',email:'',method:'guest'};
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
          try{localStorage.setItem('fizux:ispremium','1');localStorage.setItem('fizux:activeUkey',key);}catch(e){}
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
      setUser(null); setMessages([]); setChats([]); setIsPremium(false); try{localStorage.removeItem('fizux:ispremium');localStorage.removeItem('fizux:activeUkey');}catch(e){}
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
  function sendText(txt){
    if(!txt||!txt.trim()) return;
    if(loading) return;
    if(!canSend()){setShowLimit(true);return;}
    setInput(txt);
    setTimeout(function(){ send(); }, 50);
  }
  function send(){
    var userText=input.trim();
    if(!userText&&!attach.length) return;
    // Real-time ukey validation - check if ukey still valid in AFZUX
    var storedUkey=null;
    try{storedUkey=localStorage.getItem('fizux:activeUkey');}catch(e){}
    if(storedUkey && isPremium){
      var ukData=null;
      try{var raw=localStorage.getItem('sh_afzux:ukey:'+storedUkey);if(raw)ukData=JSON.parse(raw);}catch(e){}
      if(!ukData || ukData.blocked || ukData.deleted){
        // Ukey blocked or deleted - revoke premium immediately
        setIsPremium(false); setPremVer('');
        try{localStorage.removeItem('fizux:ispremium');localStorage.removeItem('fizux:activeUkey');}catch(e){}
        ST.del('fizux:premium:'+uid()).catch(function(){});
        notify('⚠️ Your Ukey has been revoked. Premium access removed.','err');
        return;
      }
      if(ukData.expiry!=='never'&&new Date(ukData.expiry)<new Date()){
        setIsPremium(false); setPremVer('');
        try{localStorage.removeItem('fizux:ispremium');localStorage.removeItem('fizux:activeUkey');}catch(e){}
        notify('⚠️ Your Ukey has expired.','err');
        return;
      }
    }
    // Add feature context if selected
    if(selectedFeat && userText) {
      if(!selectedFeat.free && !isPremium) {
        notify('✦ Premium required for '+selectedFeat.label+'. Activate a Ukey!');
        setLoading(false);
        return;
      }
      userText = '['+selectedFeat.label+']: '+userText;
    }
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
      var aiMsg={role:'assistant',content:result.reply,model:result.model||model,ts:Date.now()};
      var final=newMsgs.concat([aiMsg]);
      setMessages(final);
      setLoading(false);
      genFollowUps(result.reply);
      if(model==='fast'){
        setFastDaily(function(p){
          var newVal = p+1;
          var dayKey = 'fizux:fastday:'+getDayKey();
          try{localStorage.setItem(dayKey, String(newVal));}catch(e){}
          // Save to shared storage for AFZUX tracking
          var sharedKey = 'fizux:usage:cerebras:'+getDayKey();
          try{
            var cur = parseInt(localStorage.getItem('sh_'+sharedKey)||'0');
            localStorage.setItem('sh_'+sharedKey, String(cur+1));
          }catch(e){}
          return newVal;
        });
      }
      if(model!=='fast'){
        bumpDaily().then(function(c){setDaily(c);}).catch(function(){});
        // Save Groq usage to shared storage
        var sharedGroq = 'fizux:usage:groq:'+getDayKey();
        try{
          var curG = parseInt(localStorage.getItem('sh_'+sharedGroq)||'0');
          localStorage.setItem('sh_'+sharedGroq, String(curG+1));
        }catch(e){}
      }
      saveChat(final,userText);
    }).catch(function(e){
      setMessages(newMsgs.concat([{role:'assistant',content:'Error: '+(e.message||'Try again.'),ts:Date.now()}]));
      setLoading(false);
    });
  }

  function saveChat(msgs,title){
    var userId=uid();
    var chatId=activeChat||String(Date.now());
    if(!activeChat) setActiveChat(chatId);
    var s={id:chatId,title:(title||'Chat').slice(0,55),date:new Date().toLocaleDateString(),messages:msgs.map(function(m){return Object.assign({},m,{_api:undefined});})};
    var updated=[s].concat(chats.filter(function(c){return c.id!==chatId;})).slice(0,isPremium?60:10);
    setChats(updated);
    // Store in sessionStorage - clears when browser closes (privacy-first)
    try{sessionStorage.setItem('fizux:chats:'+userId,JSON.stringify(updated));}catch(e){}
  }

    function genFollowUps(reply){
    var groqKey = getGroqKey();
    var cerebrasKey = getCerebrasKey();
    var prompt = 'Give exactly 3 short follow-up questions (max 8 words each) for: "'+reply.slice(0,200)+'". Reply with JSON array ONLY: ["q1","q2","q3"]';
    var msgs = [{role:'user',content:prompt}];

    function parseFollowUps(text) {
      var match = (text||'').match(/\["[^"]*"[^\]]*\]/);
      if(match){try{var qs=JSON.parse(match[0]);setFollowUps(Array.isArray(qs)?qs.slice(0,3):[]);}catch(e){setFollowUps([]);}}
      else setFollowUps([]);
    }

    if (groqKey && groqKey.length > 10) {
      callGroq(msgs,'openai',groqKey).then(function(r){parseFollowUps(r.reply);}).catch(function(){setFollowUps([]);});
    } else if (cerebrasKey && cerebrasKey.length > 10) {
      callCerebras(msgs,'openai',cerebrasKey).then(function(r){parseFollowUps(r.reply);}).catch(function(){setFollowUps([]);});
    } else {
      setFollowUps([]);
    }
  }

  function sendCompare(){
    if(!input.trim()||compareLoad) return;
    if(!canSend()){setShowLimit(true);return;}
    setCompareLoad(true); setCompareRes({});
    var txt=input.trim();
    var msgs=[{role:'user',content:txt}];
    var toCompare=['mistral'];
    if(apiKeys.geminiKey) toCompare.push('gemini');
    if(toCompare.length<2) toCompare.push('deepseek'); // fallback

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
  function btn(ex){return Object.assign({padding:'10px 16px',borderRadius:'10px',background:'#111111',color:'#FFFFFF',fontWeight:700,fontSize:'13px',cursor:'pointer',border:'none',fontFamily:"Inter,system-ui,sans-serif"},ex||{});}
  function ghost(ex){return Object.assign({padding:'7px 12px',borderRadius:'9px',border:'1px solid '+BORDER,background:'transparent',color:SUB,fontSize:'12px',cursor:'pointer',fontFamily:"Inter,system-ui,sans-serif"},ex||{});}
  function inpStyle(ex){return Object.assign({background:CARD,border:'1.5px solid '+BORDER,borderRadius:'10px',padding:'10px 14px',color:TEXT,fontSize:'14px',fontFamily:"Inter,system-ui,sans-serif",width:'100%',boxSizing:'border-box',outline:'none'},ex||{});}
  function badge(color,ex){return Object.assign({background:color+'22',color:color,border:'1px solid '+color+'44',borderRadius:'6px',padding:'2px 8px',fontSize:'11px',fontWeight:600,display:'inline-block'},ex||{});}
  function overlay(){return {position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:500,padding:'16px',backdropFilter:'blur(8px)'};}
  function modalStyle(ex){return Object.assign({background:CARD,border:'1px solid #363648',borderRadius:'20px',padding:'24px',maxWidth:'420px',width:'100%',maxHeight:'85vh',overflowY:'auto'},ex||{});}

  // ── LOADING SCREEN ──
  if(screen==='loading'){
    return h('div',{style:{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'20px',background:'#050508',position:'relative',overflow:'hidden'}},
      h('div',{style:{position:'absolute',top:'20%',left:'30%',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,111,232,0.1) 0%,transparent 70%)',animation:'orb 8s ease infinite',pointerEvents:'none'}}),
      h('div',{style:{width:'88px',height:'88px',borderRadius:'26px',background:'linear-gradient(135deg,#1a1a2e,#111)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px',fontWeight:900,color:'#FFFFFF',boxShadow:'0 0 0 1px rgba(139,111,232,0.3),0 16px 48px rgba(0,0,0,0.6)',animation:'pulse 2s ease infinite'}},'F'),
      h('div',{style:{fontSize:'32px',fontWeight:800,color:'#F0F0FF',letterSpacing:'-1.5px'}},'FIZUX'),
      h('div',{style:{fontSize:'14px',color:'#505070',letterSpacing:'0.5px'}},'Your Personal AI Universe'),
      h('div',{style:{display:'flex',gap:'8px',marginTop:'8px'}},
        [0,1,2].map(function(i){
          return h('div',{key:i,style:{width:'8px',height:'8px',borderRadius:'50%',background:'#000000',animation:'bounce 1.2s infinite',animationDelay:(i*0.2)+'s'}});
        })
      )
    );
  }

  // ── LOGIN SCREEN ──
  if(screen==='login'){
    return h('div',{style:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'#050508',position:'relative',overflow:'hidden'},className:'screen-fade'},
      h('div',{style:{position:'absolute',top:'-20%',left:'-10%',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,111,232,0.12) 0%,transparent 70%)',pointerEvents:'none'}}),
      h('div',{style:{position:'absolute',bottom:'-20%',right:'-10%',width:'700px',height:'700px',borderRadius:'50%',background:'radial-gradient(circle,rgba(74,158,255,0.08) 0%,transparent 70%)',pointerEvents:'none'}}),
      // Toast
      toast.msg && h('div',{style:{position:'fixed',top:'16px',left:'50%',transform:'translateX(-50%)',background:'#16161E',border:'1.5px solid '+(toast.type==='err'?RED:GREEN),borderRadius:'12px',padding:'10px 20px',fontSize:'13px',fontWeight:500,color:toast.type==='err'?RED:GREEN,zIndex:9999,whiteSpace:'nowrap'}},toast.msg),
      h('div',{style:{width:'100%',maxWidth:'400px'}},
        // Logo
        h('div',{style:{textAlign:'center',marginBottom:'28px'}},
          h('div',{style:{width:'72px',height:'72px',borderRadius:'22px',background:'#111111',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',fontWeight:800,color:'#FFFFFF',margin:'0 auto 14px',boxShadow:'0 4px 20px rgba(201,168,76,0.3)'}},'F'),
          h('div',{style:{fontSize:'32px',fontWeight:900,color:'#F0F0FF',marginBottom:'8px',letterSpacing:'-1px'}},'FIZUX'),
          h('div',{style:{fontSize:'14px',color:'#505070',letterSpacing:'0.3px'}},'Your Personal AI Universe')
        ),
        // Card
        h('div',{style:{background:'rgba(16,16,28,0.85)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'24px',padding:'32px',boxShadow:'0 24px 80px rgba(0,0,0,0.7)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)'}},
          // Google btn
          h('button',{
            onClick:loginGuest, disabled:loginLoading,
            style:{width:'100%',padding:'14px',borderRadius:'14px',border:'1.5px solid #2A2A3A',background:'#111118',color:'#F0F0FF',fontWeight:600,fontSize:'15px',cursor:'pointer',fontFamily:"Inter,system-ui,sans-serif",display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',marginBottom:'18px',opacity:loginLoading?0.7:1}
          },
            loginLoading
              ? h('div',{style:{width:'18px',height:'18px',border:'2.5px solid #2A2A3A',borderTopColor:'#000000',borderRadius:'50%',animation:'spin .7s linear infinite'}})
              : h('svg',{width:20,height:20,viewBox:'0 0 24 24'},
                  h('path',{fill:'#4285F4',d:'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'}),
                  h('path',{fill:'#34A853',d:'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'}),
                  h('path',{fill:'#FBBC05',d:'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'}),
                  h('path',{fill:'#EA4335',d:'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'})
                ),
            loginLoading?'Starting...':'Start Free (No Signup)'
          ),
          // Divider
          h('div',{style:{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}},
            h('div',{style:{flex:1,height:'1px',background:'#2A2A3A'}}),
            h('span',{style:{fontSize:'12px',color:'#606080'}},'or use Ukey'),
            h('div',{style:{flex:1,height:'1px',background:'#2A2A3A'}})
          ),
          // Ukey
          h('input',{value:ukeyInput,onChange:function(e){setUkeyInput(e.target.value.toUpperCase());setUkeyErr('');},onKeyDown:function(e){if(e.key==='Enter')activateUkey();},placeholder:'Enter your Ukey',
            style:{background:'rgba(255,255,255,0.04)',border:'1.5px solid '+(ukeyErr?RED:'rgba(255,255,255,0.1)'),borderRadius:'14px',padding:'14px',color:'#F0F0FF',fontSize:'14px',fontFamily:'JetBrains Mono,monospace',letterSpacing:'3px',textAlign:'center',width:'100%',boxSizing:'border-box',outline:'none',marginBottom:'10px',transition:'all 0.2s'}}),
          ukeyErr && h('div',{style:{color:RED,fontSize:'11px',textAlign:'center',marginBottom:'8px'}},ukeyErr),
          h('button',{onClick:activateUkey,style:{width:'100%',padding:'14px',borderRadius:'14px',fontSize:'14px',fontWeight:700,background:'#111111',color:'#ffffff',border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',fontFamily:'Inter,system-ui,sans-serif',marginBottom:'14px',transition:'all 0.2s',boxShadow:'0 2px 12px rgba(0,0,0,0.4)'}},'Activate Ukey →'),
          // Free note
          h('div',{style:{background:'rgba(46,204,138,0.08)',border:'1px solid rgba(46,204,138,0.25)',borderRadius:'10px',padding:'10px 14px',textAlign:'center',marginBottom:'10px'}},
            h('div',{style:{fontSize:'12px',fontWeight:600,color:GREEN}},'🆓 50 free messages/day — No key needed'),
            h('div',{style:{fontSize:'11px',color:'#606080',marginTop:'3px'}},'No account needed. Start instantly.')
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
            style:{padding:'14px 12px',borderRadius:'14px',border:'2px solid '+(useCase===uc.id?uc.color:BORDER),background:useCase===uc.id?uc.color+'14':CARD2,cursor:'pointer',textAlign:'left',fontFamily:"Inter,system-ui,sans-serif"}},
            h('div',{style:{fontSize:'22px',marginBottom:'5px'}},uc.icon),
            h('div',{style:{fontSize:'12px',fontWeight:700,color:useCase===uc.id?uc.color:TEXT}},uc.name)
          );
        })
      ),
      useCase && h('button',{onClick:function(){ST.set('fizux:uc:'+uid(),useCase).catch(function(){});setShowOnboard(false);notify('FIZUX personalized!');},style:btn({width:'100%',borderRadius:'14px',padding:'12px',marginBottom:'8px'})},"Let's go →"),
      h('button',{onClick:function(){ST.set('fizux:uc:'+uid(),'general').catch(function(){});setShowOnboard(false);},style:{width:'100%',padding:'8px',background:'none',border:'none',color:MUTED,cursor:'pointer',fontFamily:"Inter,system-ui,sans-serif",fontSize:'13px'}},'Skip for now')
    )
  ) : null;

  // ── LIMIT MODAL ──
  var LimitModal=showLimit ? h('div',{style:overlay()},
    h('div',{style:modalStyle({textAlign:'center'})},
      h('div',{style:{fontSize:'48px',marginBottom:'10px'}},'⏰'),
      h('div',{style:{fontWeight:800,fontSize:'18px',marginBottom:'6px'}},'Daily Limit Reached'),
      h('div',{style:{fontSize:'13px',color:MUTED,marginBottom:'18px'}},(model==='fast'?FAST_DAILY+' fast messages used':FREE_DAILY+' free messages used')+'. Resets at midnight.'),
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
        ['account','appearance'].map(function(tab){
          return h('button',{key:tab,onClick:function(){setSettingsTab(tab);},style:{flex:1,padding:'7px',borderRadius:'9px',border:'none',background:settingsTab===tab?CARD:'transparent',color:settingsTab===tab?TEXT:MUTED,fontWeight:settingsTab===tab?600:400,fontSize:'11px',cursor:'pointer',fontFamily:"Inter,system-ui,sans-serif",textTransform:'capitalize'}},tab);
        })
      ),
      // ACCOUNT
      settingsTab==='account' && h('div',null,
        h('div',{style:card({display:'flex',gap:'12px',alignItems:'center',marginBottom:'12px'})},
          h('span',{style:{fontSize:'14px',fontWeight:700,color:TEXT}},((user&&user.name)||'You').split(' ')[0]),
          h('div',{style:{flex:1}},
            h('div',{style:{fontWeight:700,fontSize:'14px'}},user&&user.name||'User'),
            h('div',{style:{fontSize:'11px',color:MUTED}},user&&user.email||'Guest Session')
          ),
          isPremium && h('span',{style:badge(GOLD)},'✦ '+premVer)
        ),
        isPremium ? h('div',{style:card({marginBottom:'12px',borderColor:'rgba(0,0,0,0.4)',background:'rgba(0,0,0,0.08)'})},
          h('div',{style:{fontSize:'11px',color:GOLD,fontWeight:700,letterSpacing:'0.8px',marginBottom:'10px'}},'✦ PREMIUM BENEFITS'),
          [
            ['⚡ FAST mode',FAST_DAILY_PREMIUM+' req/day + Groq priority'],
            ['🔓 PRO Features','SQL, Report, BizPlan, DeepThink unlocked'],
            ['⚖ Compare Mode','Compare 2 AIs side by side'],
            ['💬 Custom Instructions','Set your AI persona'],
            ['📚 Chat History','60 chats saved (free: 10)'],
          ].map(function(b,i){
            return h('div',{key:i,style:{display:'flex',gap:'8px',marginBottom:'6px',alignItems:'flex-start'}},
              h('span',{style:{fontSize:'12px',minWidth:'130px',color:TEXT,fontWeight:600}},b[0]),
              h('span',{style:{fontSize:'11px',color:MUTED}},b[1])
            );
          })
        ) : h('div',{style:card({marginBottom:'12px'})},
          h('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:'8px'}},
            h('span',{style:{fontSize:'13px',fontWeight:600}},'Daily Usage'),
            h('span',{style:{fontSize:'13px',fontWeight:700,color:model==='fast'&&fastDaily>=(isPremium?FAST_DAILY_PREMIUM:FAST_DAILY)?RED:GREEN}},remaining())
          ),
          model==='fast' && h('div',{style:{height:'5px',background:BORDER,borderRadius:'3px',overflow:'hidden'}},
            h('div',{style:{height:'100%',width:Math.min(100,(fastDaily/(isPremium?FAST_DAILY_PREMIUM:FAST_DAILY))*100)+'%',background:fastDaily>=(isPremium?FAST_DAILY_PREMIUM:FAST_DAILY)?RED:GREEN,borderRadius:'3px'}})
          ),
          model==='slow' && h('div',{style:{fontSize:'11px',color:GREEN,marginTop:'4px'}},'∞ Slow mode is unlimited & free')
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
            settingsTab==='appearance' && h('div',null,
        h('div',{style:{marginBottom:'14px'}},
          h('div',{style:{fontSize:'11px',color:MUTED,fontWeight:700,letterSpacing:'0.8px',marginBottom:'8px'}},'THEME'),
          h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}},
            [['dark','◐ Dark'],['light','☀ Light']].map(function(item){
              return h('button',{key:item[0],onClick:function(){setTheme(item[0]);ST.set('fizux:theme',item[0]).catch(function(){});},
                style:{padding:'12px',borderRadius:'12px',border:'2px solid '+(theme===item[0]?GOLD:BORDER),background:theme===item[0]?'rgba(201,168,76,0.1)':CARD2,cursor:'pointer',color:theme===item[0]?GOLD:TEXT,fontFamily:"Inter,system-ui,sans-serif",fontSize:'13px',fontWeight:theme===item[0]?700:400}},item[1]);
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
          h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}},
            h('div',{style:{fontSize:'11px',color:MUTED,fontWeight:700,letterSpacing:'0.8px'}},'CUSTOM INSTRUCTIONS'),
            !isPremium && h('span',{style:badge(PURPLE,{fontSize:'9px'})},'✦ PREMIUM')
          ),
          isPremium
            ? h('textarea',{value:customInstr,rows:3,onChange:function(e){setCustomInstr(e.target.value);},onBlur:function(){ST.set('fizux:ci',customInstr).catch(function(){});},
                placeholder:'e.g. Always reply in Hindi. I am a developer...',style:inpStyle({lineHeight:1.7})})
            : h('div',{style:{background:CARD2,borderRadius:'10px',padding:'12px',textAlign:'center',border:'1px dashed '+BORDER}},
                h('div',{style:{fontSize:'12px',color:MUTED,marginBottom:'6px'}},'🔒 Custom instructions require Premium'),
                h('div',{style:{fontSize:'11px',color:MUTED}},'Activate a Ukey to unlock')
              )
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
          placeholder:'Compare 2 AI models simultaneously...',style:inpStyle({flex:1})}),
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
    return h('div',{key:i,className:'msg-appear',style:{display:'flex',justifyContent:isUser?'flex-end':'flex-start',padding:'4px 16px',maxWidth:'720px',margin:'0 auto',animationDelay:(i*0.03)+'s'}},
      h('div',{style:{
        maxWidth:'75%',
        background:isUser?'#0F0F0F':'#1A1A2E',
        color:'#FFFFFF',
        borderRadius:isUser?'18px 18px 4px 18px':'18px 18px 18px 4px',
        boxShadow:isUser?'0 2px 12px rgba(0,0,0,0.4)':'0 2px 8px rgba(0,0,0,0.3)',
        padding:'10px 14px',
        fontSize:fontSize+'px',
        lineHeight:1.75,
        whiteSpace:'pre-wrap',
        wordBreak:'break-word',
        border:isUser?'none':'1px solid #2A2A3E'
      }},
        msg.content,
        !isUser && h('div',{style:{display:'flex',gap:'8px',marginTop:'6px'}},
          h('button',{onClick:function(){try{navigator.clipboard.writeText(msg.content);}catch(e){}notify('Copied!');},
            style:{background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:'11px',padding:'0',fontFamily:"Inter,system-ui,sans-serif"}},'Copy'),
          'speechSynthesis' in window && h('button',{onClick:function(){var u=new SpeechSynthesisUtterance(msg.content);window.speechSynthesis.speak(u);},
            style:{background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:'11px',padding:'0',fontFamily:"Inter,system-ui,sans-serif"}},'Read')
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
    h('div',{style:{position:'fixed',left:0,top:0,bottom:0,width:sidebar?'275px':'0',transition:'width 0.25s ease',overflow:'hidden',zIndex:99,background:isLight?'rgba(240,240,248,0.95)':'rgba(12,12,20,0.97)',borderRight:'1px solid '+BORDER,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}},
      h('div',{style:{width:'275px',height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}},
        // Header
        h('div',{style:{padding:'14px 12px 8px',display:'flex',alignItems:'center',gap:'8px'}},
          h('div',{style:{width:'30px',height:'30px',borderRadius:'10px',background:'#111111',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'14px',color:'#FFFFFF'}},'F'),
          h('span',{style:{fontWeight:800,fontSize:'15px',flex:1,color:TEXT,letterSpacing:'-0.3px'}},'FIZUX'),
          isPremium && h('span',{style:badge(GOLD,{fontSize:'9px'})},'✦'),
          h('button',{onClick:function(){setSidebar(false);},style:{color:MUTED,fontSize:'16px',background:'none',border:'none',cursor:'pointer'}},'✕')
        ),
        h('div',{style:{padding:'0 10px 8px'}},
          h('button',{onClick:newChat,style:{width:'100%',padding:'9px 12px',borderRadius:'10px',border:'1px solid '+BORDER,background:CARD,color:TEXT,fontSize:'13px',cursor:'pointer',textAlign:'left',fontFamily:"Inter,system-ui,sans-serif",fontWeight:600}},'✎ New chat')
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
            return h('button',{key:f.id,onClick:function(){setSelectedFeat(f);setSidebar(false);if(inputRef.current)inputRef.current.focus();},
              style:{width:'100%',padding:'7px 8px',borderRadius:'8px',border:'none',background:'transparent',color:TEXT,cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:'7px',marginBottom:'1px',fontFamily:"Inter,system-ui,sans-serif"}},
              h('span',{style:{fontSize:'13px',color:MUTED,flexShrink:0,width:'16px'}},f.icon),
              h('span',{style:{fontSize:'11px',fontWeight:600}},f.label),
              !f.free&&!isPremium && h('span',{style:badge(PURPLE,{fontSize:'8px',padding:'0 3px',marginLeft:'4px'})},'PRO')
            );
          }),
          chats.length>0 && h('div',null,
            h('div',{style:{fontSize:'9px',color:MUTED,fontWeight:700,letterSpacing:'1.5px',padding:'10px 2px 5px'}},'RECENT CHATS'),
            chats.slice(0,isPremium?60:10).map(function(c){
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
             ['⚖',function(){if(!isPremium){notify('✦ Compare requires Premium!');return;}setCompareMode(true);setSidebar(false);},'Compare'],
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
    h('div',{style:{background:BG,borderBottom:'1px solid '+BORDER,padding:'0 12px',height:'64px',display:'flex',alignItems:'center',gap:'8px',flexShrink:0,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}},
      h('button',{onClick:function(){setSidebar(!sidebar);},style:{background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',gap:'4px',padding:'6px',borderRadius:'8px'}},
        [0,1,2].map(function(i){return h('div',{key:i,style:{width:'17px',height:'2px',borderRadius:'2px',background:TEXT}});})
      ),
      h('div',{style:{display:'flex',gap:'3px',background:CARD,borderRadius:'10px',padding:'3px'}},
        ['slow','fast'].map(function(spd){
          var act=model===spd;
          return h('button',{key:spd,onClick:function(){setModel(spd);},
            style:{padding:'5px 14px',borderRadius:'8px',border:'none',
              background:act?'#000000':'transparent',
              color:act?'#FFFFFF':MUTED,
              fontWeight:act?700:400,fontSize:'12px',cursor:'pointer',fontFamily:"Inter,system-ui,sans-serif",
              transition:'all 0.2s'}},
            spd==='slow'?'🐢 SLOW':'⚡ FAST'
          );
        })
      ),
      curUC && h('span',{style:badge(curUC.color,{fontSize:'11px',padding:'4px 10px'})},curUC.icon+' '+curUC.name),
      h('div',{style:{flex:1}}),
      detFeat && h('span',{style:badge(PURPLE,{fontSize:'10px',maxWidth:'100px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'})},'⚡ '+detFeat),
      !isPremium && h('span',{style:badge(daily>=FREE_DAILY?RED:GREEN,{fontSize:'10px',padding:'4px 9px'})},daily>=FREE_DAILY?'⏰ Limit':remaining()),
      isPremium && h('span',{style:Object.assign(badge(GOLD,{fontSize:'11px',padding:'4px 10px'}),{boxShadow:'0 0 12px rgba(0,0,0,0.4)',background:'rgba(0,0,0,0.15)',borderColor:'rgba(0,0,0,0.4)',color:'#000'})},'✦ '+premVer),
      h('button',{onClick:function(){setImgPanel(!imgPanel);},style:{background:'transparent',border:'1px solid '+BORDER,borderRadius:'8px',padding:'6px 9px',cursor:'pointer',fontSize:'12px',color:MUTED}},'🎨'),
      h('button',{onClick:function(){if(!isPremium){notify('✦ Compare mode requires Premium. Activate a Ukey!');return;}setCompareMode(true);},style:{background:'transparent',border:'1px solid '+(isPremium?BLUE:BORDER),borderRadius:'8px',padding:'6px 9px',cursor:'pointer',fontSize:'12px',color:isPremium?BLUE:MUTED,position:'relative'}},isPremium?'⚖':'🔒'),
      h('button',{onClick:function(){setShowSettings(true);},style:{background:'transparent',border:'1px solid '+BORDER,borderRadius:'8px',padding:'6px 9px',cursor:'pointer',fontSize:'12px',color:MUTED}},'⚙'),
      h('button',{onClick:newChat,style:btn({fontSize:'11px',padding:'6px 12px',borderRadius:'9px'})},'✎ New')
    ),
    // Messages area
    h('div',{style:{flex:1,overflowY:'auto',padding:'0'}},
      h('div',{style:{maxWidth:'720px',margin:'0 auto'}},
        messages.length===0
          ? h('div',{style:{padding:'48px 24px',maxWidth:'720px',margin:'0 auto'},className:'screen-fade'},
              h('div',{style:{textAlign:'center',marginBottom:'32px'}},
                h('div',{style:{width:'64px',height:'64px',borderRadius:'20px',background:'linear-gradient(135deg,#1a1a2e,#111)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',fontWeight:900,color:'#fff',margin:'0 auto 16px',boxShadow:'0 0 0 1px rgba(139,111,232,0.2),0 8px 24px rgba(0,0,0,0.4)'}},'F'),
                h('div',{style:{fontSize:'22px',fontWeight:700,color:TEXT,marginBottom:'8px'}},'How can I help you today?'),
                h('div',{style:{fontSize:'14px',color:MUTED}},'Choose a quick action or type anything below')
              ),
              h('div',{style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}},
                [{icon:'📧',label:'Write Email',color:'#4A9EFF'},{icon:'💻',label:'Generate Code',color:'#2ECC8A'},
                 {icon:'🧮',label:'Solve Math',color:'#EC4899'},{icon:'🌍',label:'Translate',color:'#F59E0B'},
                 {icon:'📄',label:'Write Resume',color:'#8B6FE8'},{icon:'🎨',label:'Create Image',color:'#06B6D4'}
                ].map(function(q){
                  return h('button',{key:q.label,onClick:function(){setInput(q.label+': ');if(inputRef.current)inputRef.current.focus();},
                    style:{padding:'16px 12px',borderRadius:'14px',border:'1px solid '+BORDER,background:CARD,cursor:'pointer',
                           textAlign:'left',fontFamily:'Inter,system-ui,sans-serif',transition:'all 0.2s',
                           boxShadow:'0 2px 8px rgba(0,0,0,0.2)'}},
                    h('div',{style:{fontSize:'24px',marginBottom:'8px'}},q.icon),
                    h('div',{style:{fontSize:'13px',fontWeight:600,color:q.color}},q.label)
                  );
                })
              )
            )
          : messages.map(renderMsg),
        loading && h('div',{style:{padding:'4px 16px',display:'flex',justifyContent:'flex-start',maxWidth:'720px',margin:'0 auto'}},
          h('div',{style:{background:'#1A1A2E',borderRadius:'18px 18px 18px 4px',padding:'12px 16px',border:'1px solid #2A2A3E',display:'flex',gap:'5px',alignItems:'center'}},
            [0,1,2].map(function(i){return h('div',{key:i,style:{width:'7px',height:'7px',borderRadius:'50%',background:MUTED,animation:'bounce 1.2s infinite',animationDelay:(i*0.2)+'s'}});})
          )
        ),
        followUps.length>0&&!loading && h('div',{style:{padding:'8px 16px 0',display:'flex',gap:'6px',flexWrap:'wrap'}},
          followUps.map(function(q,i){
            return h('button',{key:i,onClick:function(){setInput(q);setTimeout(function(){send();},50);},
              style:{background:CARD,border:'1px solid '+BORDER,borderRadius:'20px',padding:'5px 12px',fontSize:'11px',color:SUB,cursor:'pointer',fontFamily:"Inter,system-ui,sans-serif"}},q);
          })
        ),
        genImgs.length>0 && h('div',{style:{padding:'8px 16px',display:'flex',gap:'8px',overflowX:'auto'}},
          genImgs.map(function(url,i){return h('img',{key:i,src:url,style:{height:'160px',borderRadius:'12px',objectFit:'cover'}});})
        ),
        h('div',{ref:scrollRef,style:{height:'1px'}})
      )
    ),
    h('div',{style:{flexShrink:0,borderTop:'1px solid '+BORDER,padding:'10px 12px 10px',background:BG}},
      h('div',{style:{maxWidth:'720px',margin:'0 auto'}},
        h('div',{style:{background:isLight?'rgba(255,255,255,0.9)':'rgba(22,22,30,0.9)',border:'1.5px solid '+(listening?RED:BORDER),borderRadius:'20px',padding:'13px 15px',boxShadow:'0 4px 24px rgba(0,0,0,0.3)',transition:'all 0.2s',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)'}},
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
            style:{width:'100%',background:'transparent',border:'none',color:TEXT,fontSize:fontSize+'px',fontFamily:"Inter,system-ui,sans-serif",lineHeight:1.6,maxHeight:'140px',boxSizing:'border-box',outline:'none'}
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
              style:{width:'34px',height:'34px',borderRadius:'50%',background:(!input.trim()&&!attach.length)||loading?BORDER:'#111111',border:'none',cursor:(!input.trim()&&!attach.length)||loading?'not-allowed':'pointer',fontSize:'15px',display:'flex',alignItems:'center',justifyContent:'center',color:(!input.trim()&&!attach.length)||loading?MUTED:'#FFFFFF',transition:'all 0.2s',boxShadow:(!input.trim()&&!attach.length)||loading?'none':'0 0 16px rgba(139,111,232,0.3)'}},
              loading ? h('div',{style:{width:'14px',height:'14px',border:'2px solid '+MUTED,borderTopColor:'transparent',borderRadius:'50%',animation:'spin .7s linear infinite'}}) : '↑'
            )
          )
        ),
        selectedFeat && h('div',{style:{display:'flex',alignItems:'center',gap:'6px',marginTop:'6px',paddingLeft:'4px'}},
          h('span',{style:{fontSize:'11px',background:PURPLE+'22',color:PURPLE,padding:'3px 10px',borderRadius:'20px',fontWeight:600}},selectedFeat.icon+' '+selectedFeat.label),
          h('button',{onClick:function(){setSelectedFeat(null);},style:{background:'none',border:'none',color:MUTED,cursor:'pointer',fontSize:'13px',padding:'0 4px'}},'✕')
        ),
        h('div',{style:{textAlign:'center',marginTop:'5px',fontSize:'10px',color:MUTED}},'FIZUX v9.0 · '+remaining()+' · dofizuxai@gmail.com')
      )
    )
  );
}

var container=document.getElementById('root');
var root=ReactDOM.createRoot(container);
root.render(React.createElement(FIZUXApp));
})();
