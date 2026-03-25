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
  var k = {groqKeys:[],cerebrasKeys:[],geminiKeys:[],hfToken:'',geminiKey:'',claudeKey:'',openaiKey:'',grokKey:''};
  try {
    var s = localStorage.getItem('sh_fizux:aikeys');
    if (s) {
      var parsed = JSON.parse(s);
      k.groqKeys = (parsed.groqKeys||[]).filter(function(x){return x&&x.trim();});
      k.cerebrasKeys = (parsed.cerebrasKeys||[]).filter(function(x){return x&&x.trim();});
      k.geminiKeys = (parsed.geminiKeys||[]).filter(function(x){return x&&x.trim();});
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

function getGeminiKey() {
  var k = getAIKeys();
  if (!k.geminiKeys || !k.geminiKeys.length) return '';
  var idx = 0;
  try { idx = parseInt(localStorage.getItem('fizux:geminiIdx')||'0') % k.geminiKeys.length; } catch(e){}
  var key = k.geminiKeys[idx];
  try { localStorage.setItem('fizux:geminiIdx', String((idx+1)%k.geminiKeys.length)); } catch(e){}
  return key;
}

function callGemini(msgs, model, apiKey) {
  var contents = msgs.slice(-12).map(function(m){
    return {role:m.role==='assistant'?'model':'user', parts:[{text:String(m.content||'')}]};
  });
  return fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key='+apiKey,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({contents:contents,generationConfig:{maxOutputTokens:1024,temperature:0.7}})
  }).then(function(r){
    if(!r.ok) throw new Error('Gemini HTTP '+r.status);
    return r.json();
  }).then(function(d){
    var t='';
    try{t=d.candidates[0].content.parts[0].text;}catch(e){}
    if(!t) throw new Error('empty');
    return {reply:t.trim(),model:'FIZUX'};
  });
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
    'openai':   'llama-4-scout-17b-16e-instruct',
    'mistral':  'llama-4-scout-17b-16e-instruct',
    'deepseek': 'qwen-3-32b',
    'llama':    'llama3.1-8b',
    'qwen':     'qwen-3-32b'
  };
  var cModel = CEREBRAS_MODELS[model] || 'llama-4-scout-17b-16e-instruct';
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
    return {reply:t.trim(),model:'FIZUX'};
  });
}

function getModelConfig() {
  try{
    var mc = localStorage.getItem('sh_fizux:modelconfig');
    if(mc) return JSON.parse(mc);
  }catch(e){}
  return {slowModel:'groq_llama33_70b', fastModel:'cerebras_llama4scout'};
}

function callWithModel(modelId, msgs, taskModel) {
  // Manual key - only if user explicitly enabled it
  if(window._manualKeyEnabled && manualTextKey && manualTextKey.trim().length > 10){
    return callManualAPI(msgs, manualTextKey.trim(), manualProvider, manualModel || 'gpt-4o-mini');
  }

  var cfg = getModelConfig();
  var chosenId = modelId==='fast' ? cfg.fastModel : cfg.slowModel;

  // Determine API and model from config
  var api = 'groq';
  var modelName = 'llama-3.3-70b-versatile';

  if (chosenId==='groq_llama33_70b')       { api='groq';     modelName='llama-3.3-70b-versatile'; }
  else if (chosenId==='groq_llama31_8b')    { api='groq';     modelName='llama-3.1-8b-instant'; }
  else if (chosenId==='cerebras_llama4scout'){ api='cerebras'; modelName='llama-4-scout-17b-16e-instruct'; }
  else if (chosenId==='cerebras_qwen3_32b') { api='cerebras'; modelName='qwen-3-32b'; }
  else if (chosenId==='cerebras_llama31_8b'){ api='cerebras'; modelName='llama3.1-8b'; }
  else if (chosenId==='gemini_flash_lite')  { api='gemini';   modelName='gemini-2.5-flash-lite'; }

  var groqKey = getGroqKey();
  var cerebrasKey = getCerebrasKey();
  var geminiKey = getGeminiKey();

  function tryGeminiFallback() {
    if (geminiKey && geminiKey.length > 10) {
      return callGemini(msgs, taskModel, geminiKey).catch(function(){
        return new Promise(function(res){
          setTimeout(function(){
            callGemini(msgs,taskModel,geminiKey)
              .then(res)
              .catch(function(){res({reply:'⚠️ AI is temporarily busy. Please try again.',model:'error'});});
          },1500);
        });
      });
    }
    return Promise.resolve({reply:'⚠️ AI is temporarily busy. Please try again.',model:'error'});
  }

  if (api==='groq') {
    if (!groqKey || groqKey.length <= 10) return tryGeminiFallback();
    return callGroq(msgs, modelName, groqKey).catch(function(){
      return tryGeminiFallback();
    });
  }
  if (api==='cerebras') {
    if (!cerebrasKey || cerebrasKey.length <= 10) {
      // Fallback to Groq if no cerebras key
      if (groqKey && groqKey.length > 10) return callGroq(msgs, 'llama-3.3-70b-versatile', groqKey).catch(tryGeminiFallback);
      return tryGeminiFallback();
    }
    return callCerebras(msgs, modelName, cerebrasKey).catch(function(){
      // Cerebras failed - try Groq fallback
      if (groqKey && groqKey.length > 10) return callGroq(msgs, 'llama-3.3-70b-versatile', groqKey).catch(tryGeminiFallback);
      return tryGeminiFallback();
    });
  }
  if (api==='gemini') {
    if (!geminiKey || geminiKey.length <= 10) {
      if (groqKey && groqKey.length > 10) return callGroq(msgs, 'llama-3.3-70b-versatile', groqKey).catch(tryGeminiFallback);
      return tryGeminiFallback();
    }
    return callGemini(msgs, modelName, geminiKey).catch(function(){
      if (groqKey && groqKey.length > 10) return callGroq(msgs, 'llama-3.3-70b-versatile', groqKey);
      return tryGeminiFallback();
    });
  }
  return tryGeminiFallback();
}

function callAI(modelId, msgs, keys, userText) {
  var taskModel = pickModel('auto', userText || '');
  return callWithModel(modelId, msgs, taskModel);
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
    return {reply:t.trim(),model:'FIZUX'};
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
  var s_tw=useState({}); var typewriterMap=s_tw[0]; var setTypewriterMap=s_tw[1];
  var s_twDone=useState({}); var typewriterDone=s_twDone[0]; var setTypewriterDone=s_twDone[1];
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
  var s_igen=useState(false); var imgLoading=s_igen[0]; var setImgLoading=s_igen[1];
  var s_imodel=useState('flux'); var imgModel=s_imodel[0]; var setImgModel=s_imodel[1];
  var s_isize=useState('512'); var imgSize=s_isize[0]; var setImgSize=s_isize[1];
  var s_icount=useState(4); var imgCount=s_icount[0]; var setImgCount=s_icount[1];

  var IMAGE_MODELS = [
    {id:'flux',         label:'Flux',          desc:'Best quality',      badge:'⭐'},
    {id:'flux-realism', label:'Flux Realism',   desc:'Photo realistic',   badge:'📸'},
    {id:'flux-anime',   label:'Flux Anime',     desc:'Anime & manga',     badge:'🎌'},
    {id:'flux-3d',      label:'Flux 3D',        desc:'3D rendered',       badge:'🎮'},
    {id:'flux-cablyai', label:'Flux Cably',     desc:'Artistic style',    badge:'🎨'},
    {id:'turbo',        label:'Turbo',          desc:'Fastest generation', badge:'⚡'},
  ];

  // ── IMAGE IN CHAT ──
  function handleImageInChat(prompt){
    if(!prompt||!prompt.trim()) return;
    var userMsg={role:'user',content:prompt,ts:Date.now()};
    var thinkMsg={role:'assistant',content:'🎨 Generating images...',ts:Date.now()+1,isImgThinking:true};
    setMessages(function(p){return p.concat([userMsg,thinkMsg]);});
    setInput('');
    scrollToBottom(true);
    setLoading(true);

    var encoded=encodeURIComponent(prompt.trim());
    var seeds=[Math.floor(Math.random()*99999),Math.floor(Math.random()*99999),Math.floor(Math.random()*99999),Math.floor(Math.random()*99999)];
    var urls=seeds.map(function(s){
      return 'https://image.pollinations.ai/prompt/'+encoded+'?width=1024&height=1024&seed='+s+'&model='+imgModel+'&nologo=true&enhance=true&safe=false';
    });

    // Load images
    var loaded=0;
    urls.forEach(function(url){
      var img=new Image();
      img.onload=img.onerror=function(){
        loaded++;
        if(loaded===urls.length){
          setLoading(false);
          // Replace thinking message with image message
          setMessages(function(prev){
            return prev.map(function(m){
              if(m.isImgThinking) return {role:'assistant',content:'__IMAGES__',ts:m.ts,images:urls};
              return m;
            });
          });
          scrollToBottom(true);
        }
      };
      img.src=url;
    });

    // Timeout fallback
    setTimeout(function(){
      setLoading(false);
      setMessages(function(prev){
        return prev.map(function(m){
          if(m.isImgThinking) return {role:'assistant',content:'__IMAGES__',ts:m.ts,images:urls};
          return m;
        });
      });
    },12000);
  }

  function generateImage(prompt){
    if(!prompt||!prompt.trim()){notify('Enter image description','err');return;}
    setImgLoading(true);
    setGenImgs([]);
    var encoded = encodeURIComponent(prompt.trim());
    var w = imgSize; var h = imgSize;
    // Generate seeds based on count
    var seeds = [];
    for(var i=0;i<imgCount;i++) seeds.push(Math.floor(Math.random()*99999));
    var urls = seeds.map(function(s){
      return 'https://image.pollinations.ai/prompt/'+encoded+
        '?width='+w+'&height='+h+
        '&seed='+s+
        '&model='+imgModel+
        '&nologo=true&enhance=true&safe=false';
    });
    // Pre-load all images
    var loaded = [];
    var done = 0;
    urls.forEach(function(url, i){
      var img = new Image();
      img.onload = function(){
        loaded[i] = url;
        done++;
        if(done===urls.length){setGenImgs(urls);setImgLoading(false);}
      };
      img.onerror = function(){
        done++;
        if(done===urls.length){
          var valid=urls.filter(function(_,j){return loaded[j];});
          setGenImgs(valid.length?valid:urls);
          setImgLoading(false);
        }
      };
      img.src = url;
    });
    // Timeout fallback
    setTimeout(function(){
      setGenImgs(function(prev){return prev.length?prev:urls;});
      setImgLoading(false);
    },12000);
  }
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
  var BG=isLight?'#F8F8FC':'rgba(8,8,18,0.0)';
  var CARD=isLight?'#FFFFFF':'rgba(14,14,26,0.88)';
  var CARD2=isLight?'#F0F0F8':'rgba(20,20,34,0.85)';
  var BORDER=isLight?'#E0E0EE':'#2A2A3A';
  var TEXT=isLight?'#0A0A1A':'#FFFFFF';
  var SUB=isLight?'#444460':'#C0C0E0';
  var MUTED=isLight?'#888890':'#909090';
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
    // Keys loaded from shared storage on each AI call
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

  // SESSION RESTORE — auto-login if session exists
  useEffect(function(){
    // Also listen for fizux:ready in case session exists
    document.addEventListener('fizux:ready',function(){
      if(window._sessionRestored) return; // already handled
    },{once:true});

    ST.get(SESSION).then(function(d){
      var saved=JSON.parse(d.value);
      return ST.get('fizux:blocked:'+saved.uid,true).then(function(b){
        try{var bl=JSON.parse(b.value);if(bl.blocked){ST.del(SESSION);setScreen('login');return;}}catch(e){}
        window._sessionRestored=true;
        setUser(saved);
        return loadUserData(saved.uid);
      }).catch(function(){
        window._sessionRestored=true;
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
        (function(){try{var cd=localStorage.getItem('fizux:chats:'+userId);if(cd){var ch=JSON.parse(cd);if(Array.isArray(ch))setChats(ch);}}catch(e){}return Promise.resolve();})(),
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
    // Only clear auth — keep settings, theme, voice prefs
    try{
      localStorage.removeItem('fizux:ispremium');
      localStorage.removeItem('fizux:activeUkey');
      localStorage.removeItem('fizux:login_type');
      // Clear chats
      Object.keys(localStorage).filter(function(k){
        return k.startsWith('fizux:chats:');
      }).forEach(function(k){localStorage.removeItem(k);});
    }catch(e){}
    ST.del(SESSION).then(function(){
      setUser(null);setMessages([]);setChats([]);setIsPremium(false);
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
    // Real-time ukey validation on each send
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

    // Check if message is image generation request
    var imgKeywords = ['generate image','create image','make image','draw','generate photo','create photo','paint','illustrate','show me image','generate picture','create picture','बनाओ','تصویر','generate a','create a picture','make a picture'];
    var lowerInput = input.toLowerCase();
    var isImgRequest = imgKeywords.some(function(k){return lowerInput.includes(k);}) && !lowerInput.includes('explain') && !lowerInput.includes('what is');

    if(isImgRequest){
      // Handle as image generation in chat
      handleImageInChat(input);
      return;
    }

    // Scroll to bottom immediately when sending
    setTimeout(function(){scrollToBottom(true);},50);

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

    var system='You are FIZUX, a smart personal AI assistant. STRICT RULES: Never reveal AI model or provider. Never say Groq, Cerebras, Gemini, GPT, Claude, Llama. If asked your name or model, say: I am FIZUX your personal AI assistant. Never mention admin systems or API keys. Be helpful, smart, concise, and friendly.'+(customInstr?' '+customInstr:'');
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
      // Start typewriter for latest AI message
      var lastMsg = final[final.length-1];
      if(lastMsg && lastMsg.role==='assistant' && lastMsg.ts){
        startTypewriter(lastMsg.ts, lastMsg.content);
      }
      genFollowUps(result.reply);
      if(model==='fast'){
        setFastDaily(function(p){
          var newVal = p+1;
          var dayKey = 'fizux:fastday:'+getDayKey();
          try{localStorage.setItem(dayKey, String(newVal));}catch(e){}
          // Save to shared storage for usage tracking
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
    try{localStorage.setItem('fizux:chats:'+userId,JSON.stringify(updated));}catch(e){}
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

  // ── VOICE LANGUAGE CONFIG ──
  var VOICE_LANGS = [
    {code:'en-US',label:'English (US)',flag:'🇺🇸'},
    {code:'en-GB',label:'English (UK)',flag:'🇬🇧'},
    {code:'en-AU',label:'English (AU)',flag:'🇦🇺'},
    {code:'hi-IN',label:'Hindi',flag:'🇮🇳'},
    {code:'ur-PK',label:'Urdu',flag:'🇵🇰'},
    {code:'ar-SA',label:'Arabic',flag:'🇸🇦'},
    {code:'fr-FR',label:'French',flag:'🇫🇷'},
    {code:'de-DE',label:'German',flag:'🇩🇪'},
    {code:'es-ES',label:'Spanish',flag:'🇪🇸'},
    {code:'zh-CN',label:'Chinese',flag:'🇨🇳'},
    {code:'ja-JP',label:'Japanese',flag:'🇯🇵'},
    {code:'ko-KR',label:'Korean',flag:'🇰🇷'},
    {code:'pt-BR',label:'Portuguese',flag:'🇧🇷'},
    {code:'ru-RU',label:'Russian',flag:'🇷🇺'},
    {code:'tr-TR',label:'Turkish',flag:'🇹🇷'},
  ];

  // Voice state
  var s_vl = useState('en-US'); var voiceLang = s_vl[0]; var setVoiceLang = s_vl[1];
  var s_vm = useState(false); var voiceMenu = s_vm[0]; var setVoiceMenu = s_vm[1];

  // TTS state
  var s_tts = useState([]); var ttsVoices = s_tts[0]; var setTtsVoices = s_tts[1];
  var s_tsv = useState(null); var selectedTtsVoice = s_tsv[0]; var setSelectedTtsVoice = s_tsv[1];
  var s_ttsLang = useState('en-US'); var ttsLang = s_ttsLang[0]; var setTtsLang = s_ttsLang[1];
  var s_ttsPanel = useState(false); var ttsPanel = s_ttsPanel[0]; var setTtsPanel = s_ttsPanel[1];
  var s_ttsRate = useState(1.0); var ttsRate = s_ttsRate[0]; var setTtsRate = s_ttsRate[1];
  var s_ttsPitch = useState(1.0); var ttsPitch = s_ttsPitch[0]; var setTtsPitch = s_ttsPitch[1];
  var s_ttsSpeaking = useState(false); var ttsSpeaking = s_ttsSpeaking[0]; var setTtsSpeaking = s_ttsSpeaking[1];
  var s_elKey = useState(''); var elevenKey = s_elKey[0]; var setElevenKey = s_elKey[1];
  var s_elVoice = useState('Rachel'); var elevenVoice = s_elVoice[0]; var setElevenVoice = s_elVoice[1];

  // Manual custom API keys (user enters in settings)
  var s_mtk = useState(''); var manualTextKey = s_mtk[0]; var setManualTextKey = s_mtk[1];
  var s_mik = useState(''); var manualImgKey = s_mik[0]; var setManualImgKey = s_mik[1];
  var s_mm = useState(''); var manualModel = s_mm[0]; var setManualModel = s_mm[1];
  var s_mp = useState('openai'); var manualProvider = s_mp[0]; var setManualProvider = s_mp[1];
  var s_mmp = useState(false); var manualModePanel = s_mmp[0]; var setManualModePanel = s_mmp[1];

  // ElevenLabs voice list
  var ELEVEN_VOICES = [
    // Female voices
    {id:'21m00Tcm4TlvDq8ikWAM',name:'Rachel',gender:'♀',accent:'American',style:'Calm'},
    {id:'AZnzlk1XvdvUeBnXmlld',name:'Domi',gender:'♀',accent:'American',style:'Strong'},
    {id:'EXAVITQu4vr4xnSDxMaL',name:'Bella',gender:'♀',accent:'American',style:'Soft'},
    {id:'MF3mGyEYCl7XYWbV9V6O',name:'Elli',gender:'♀',accent:'American',style:'Emotional'},
    {id:'ThT5KcBeYPX3keUQqHPh',name:'Dorothy',gender:'♀',accent:'British',style:'Pleasant'},
    {id:'XrExE9yKIg1WjnnlVkGX',name:'Matilda',gender:'♀',accent:'American',style:'Warm'},
    {id:'pNInz6obpgDQGcFmaJgB',name:'Nicole',gender:'♀',accent:'American',style:'Whisper'},
    // Male voices
    {id:'VR6AewLTigWG4xSOukaG',name:'Arnold',gender:'♂',accent:'American',style:'Crisp'},
    {id:'pqHfZKP75CvOlQylNhV4',name:'Bill',gender:'♂',accent:'American',style:'Strong'},
    {id:'yoZ06aMxZJJ28mfd3POQ',name:'Sam',gender:'♂',accent:'American',style:'Raspy'},
    {id:'ODq5zmih8GrVes37Dizd',name:'Patrick',gender:'♂',accent:'American',style:'Confident'},
    {id:'GBv7mTt0atIp3Br8iCZE',name:'Thomas',gender:'♂',accent:'American',style:'Calm'},
    {id:'IKne3meq5aSn9XLyUdCD',name:'Charlie',gender:'♂',accent:'Australian',style:'Natural'},
    {id:'N2lVS1w4EtoT3dr4eOWO',name:'Callum',gender:'♂',accent:'Transatlantic',style:'Intense'},
    {id:'TX3LPaxmHKxFdv7VOQHJ',name:'Liam',gender:'♂',accent:'American',style:'Articulate'},
  ];

  // Load browser TTS voices
  useEffect(function(){document.body.classList.add('app-ready');},[]);

  useEffect(function(){
    function loadVoices(){
      var v = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      if(v.length > 0) setTtsVoices(v);
    }
    loadVoices();
    if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadVoices;

    // Load saved voice settings
    try{
      var saved = localStorage.getItem('fizux:voice');
      if(saved){
        var vs = JSON.parse(saved);
        if(vs.lang) setVoiceLang(vs.lang);
        if(vs.ttsLang) setTtsLang(vs.ttsLang);
        if(vs.rate) setTtsRate(vs.rate);
        if(vs.pitch) setTtsPitch(vs.pitch);
        if(vs.elevenVoice) setElevenVoice(vs.elevenVoice);
      }
    }catch(e){}
    // Load ElevenLabs key from shared storage (set by admin)
    try{
      var ek = localStorage.getItem('sh_fizux:elevenkey');
      if(ek) setElevenKey(ek);
    }catch(e){}

    // Load manual custom API keys if set by user (only if non-empty)
    try{
      var manText = localStorage.getItem('fizux:manual_text_key')||'';
      var manImg = localStorage.getItem('fizux:manual_img_key')||'';
      var manModel2 = localStorage.getItem('fizux:manual_model')||'';
      var manProvider2 = localStorage.getItem('fizux:manual_provider')||'openai';
      if(manText.trim().length>10) setManualTextKey(manText);
      if(manImg.trim().length>10) setManualImgKey(manImg);
      if(manModel2) setManualModel(manModel2);
      if(manProvider2) setManualProvider(manProvider2);
    }catch(e){}
  },[]);

  function saveVoiceSettings(updates){
    try{
      var cur = {};
      try{cur = JSON.parse(localStorage.getItem('fizux:voice')||'{}');}catch(e){}
      var merged = Object.assign({},cur,updates);
      localStorage.setItem('fizux:voice', JSON.stringify(merged));
    }catch(e){}
  }

  // Speech recognition
  // ── MANUAL API CALL (any provider) ──
  function callManualAPI(msgs, apiKey, provider, model){
    var providers = {
      'openai':   {url:'https://api.openai.com/v1/chat/completions',   header:'Authorization', prefix:'Bearer '},
      'anthropic':{url:'https://api.anthropic.com/v1/messages',       header:'x-api-key',     prefix:''},
      'groq':     {url:'https://api.groq.com/openai/v1/chat/completions', header:'Authorization', prefix:'Bearer '},
      'gemini':   {url:'https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent?key='+apiKey, header:null, prefix:''},
      'cerebras': {url:'https://api.cerebras.ai/v1/chat/completions', header:'Authorization', prefix:'Bearer '},
      'mistral':  {url:'https://api.mistral.ai/v1/chat/completions',   header:'Authorization', prefix:'Bearer '},
      'cohere':   {url:'https://api.cohere.ai/v2/chat',               header:'Authorization', prefix:'Bearer '},
    };

    var p = providers[provider] || providers['openai'];
    var headers = {'Content-Type':'application/json'};
    if(p.header) headers[p.header] = p.prefix + apiKey;

    var body;
    if(provider === 'anthropic'){
      var sysMsg = msgs.find(function(m){return m.role==='system';});
      var userMsgs = msgs.filter(function(m){return m.role!=='system';});
      body = JSON.stringify({
        model: model || 'claude-3-haiku-20240307',
        max_tokens: 2000,
        system: sysMsg ? sysMsg.content : 'You are FIZUX.',
        messages: userMsgs.map(function(m){return {role:m.role,content:m.content};})
      });
    } else if(provider === 'gemini'){
      var contents = msgs.filter(function(m){return m.role!=='system';}).map(function(m){
        return {role:m.role==='assistant'?'model':'user', parts:[{text:m.content}]};
      });
      body = JSON.stringify({contents:contents});
    } else {
      body = JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: msgs.map(function(m){return {role:m.role,content:m.content};}),
        max_tokens: 2000, temperature: 0.7
      });
    }

    return fetch(p.url, {method:'POST', headers:headers, body:body})
      .then(function(r){return r.json();})
      .then(function(d){
        var text = '';
        if(provider==='anthropic') text = d.content&&d.content[0]&&d.content[0].text || '';
        else if(provider==='gemini') text = d.candidates&&d.candidates[0]&&d.candidates[0].content&&d.candidates[0].content.parts&&d.candidates[0].content.parts[0]&&d.candidates[0].content.parts[0].text || '';
        else text = d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content || '';
        return {reply: text.trim() || 'No response', model:'FIZUX'};
      })
      .catch(function(){
        return {reply:'⚠️ API error. Check your key and model name.', model:'error'};
      });
  }

  function startVoice(){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){notify('Voice input not supported on this browser','err');return;}
    var r=new SR();
    r.lang=voiceLang;
    r.continuous=true;
    r.interimResults=false;
    r.onstart=function(){setListening(true);};
    r.onend=function(){setListening(false);};
    r.onresult=function(e){
      var f='';
      for(var i=e.resultIndex;i<e.results.length;i++)
        if(e.results[i].isFinal) f+=e.results[i][0].transcript;
      if(f) setInput(function(p){return p+(p?' ':'')+f;});
    };
    r.onerror=function(e){setListening(false);notify('Voice error: '+e.error,'err');};
    recRef.current=r;
    r.start();
  }
  function stopVoice(){if(recRef.current)recRef.current.stop();setListening(false);}

  // ── TYPEWRITER EFFECT ──
  function startTypewriter(msgId, text){
    if(!text) return;
    var i = 0;
    var speed = text.length > 500 ? 8 : text.length > 200 ? 12 : 18;
    setTypewriterMap(function(prev){return Object.assign({},prev,{[msgId]:''});});
    setTypewriterDone(function(prev){return Object.assign({},prev,{[msgId]:false});});
    var interval = setInterval(function(){
      i += Math.ceil(text.length / 200); // adaptive speed
      var chunk = text.slice(0, Math.min(i, text.length));
      setTypewriterMap(function(prev){return Object.assign({},prev,{[msgId]:chunk});});
      if(i >= text.length){
        clearInterval(interval);
        setTypewriterMap(function(prev){return Object.assign({},prev,{[msgId]:text});});
        setTypewriterDone(function(prev){return Object.assign({},prev,{[msgId]:true});});
      }
    }, speed);
  }

  // TTS — speak text
  function speakText(text, useEleven){
    if(!text) return;

    // ElevenLabs — real human voice
    if(useEleven || elevenKey.length > 10){
      setTtsSpeaking(true);
      var voice = ELEVEN_VOICES.find(function(v){return v.name===elevenVoice;}) || ELEVEN_VOICES[0];
      fetch('https://api.elevenlabs.io/v1/text-to-speech/'+voice.id+'/stream',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'xi-api-key': elevenKey
        },
        body:JSON.stringify({
          text: text.slice(0,2000),
          model_id:'eleven_multilingual_v2',
          voice_settings:{stability:0.5,similarity_boost:0.75,style:0.3,use_speaker_boost:true}
        })
      }).then(function(r){
        if(!r.ok) throw new Error('ElevenLabs error '+r.status);
        return r.blob();
      }).then(function(blob){
        var url = URL.createObjectURL(blob);
        var audio = new Audio(url);
        audio.onended = function(){setTtsSpeaking(false);URL.revokeObjectURL(url);};
        audio.onerror = function(){setTtsSpeaking(false);};
        audio.play();
      }).catch(function(e){
        setTtsSpeaking(false);
        notify('ElevenLabs error. Using browser voice.','err');
        speakBrowser(text);
      });
      return;
    }

    // Browser TTS — neural voices
    speakBrowser(text);
  }

  function speakBrowser(text){
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text.slice(0,3000));

    // Find best voice for selected language
    var voices = window.speechSynthesis.getVoices();
    var match = null;

    // Try exact language match first
    match = voices.find(function(v){return v.lang===ttsLang && v.localService;});
    // Try language prefix match
    if(!match) match = voices.find(function(v){return v.lang.startsWith(ttsLang.split('-')[0]) && v.localService;});
    // Try selected voice name
    if(selectedTtsVoice) match = voices.find(function(v){return v.name===selectedTtsVoice;});
    // Any match
    if(!match) match = voices.find(function(v){return v.lang.startsWith(ttsLang.split('-')[0]);});

    if(match) u.voice = match;
    u.lang = ttsLang;
    u.rate = ttsRate;
    u.pitch = ttsPitch;
    u.onstart = function(){setTtsSpeaking(true);};
    u.onend = function(){setTtsSpeaking(false);};
    u.onerror = function(){setTtsSpeaking(false);};
    window.speechSynthesis.speak(u);
  }

  function stopSpeaking(){
    window.speechSynthesis && window.speechSynthesis.cancel();
    setTtsSpeaking(false);
  }

  // Signal app ready (triggers video bg)
  useEffect(function(){
    
    document.dispatchEvent(new CustomEvent('fizux:app-mounted'));
  },[]);

  // Auto scroll to bottom
  var chatAreaRef = useRef(null);

  function scrollToBottom(smooth){
    // Method 1: scrollRef div
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behavior:smooth?'smooth':'auto',block:'end'});
    }
    // Method 2: chat area scrollTop
    if(chatAreaRef.current){
      var el = chatAreaRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }

  useEffect(function(){
    scrollToBottom(true);
  },[messages,loading]);

  // Also scroll during typewriter
  useEffect(function(){
    if(Object.keys(typewriterMap).length>0){
      scrollToBottom(false);
    }
  },[typewriterMap]);

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
  function modalStyle(ex){return Object.assign({background:'rgba(12,12,22,0.95)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'24px',padding:'24px',maxWidth:'420px',width:'100%',maxHeight:'85vh',overflowY:'auto',backdropFilter:'blur(20px)',boxShadow:'0 24px 80px rgba(0,0,0,0.8),0 0 0 1px rgba(139,92,246,0.1)',animation:'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards'},ex||{});}

  // ── LOADING SCREEN ──
  if(screen==='loading'){
    return h('div',{style:{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'20px',background:'transparent',position:'relative',overflow:'hidden',perspective:'1000px'}},
      
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
  if(screen==='ukey-entry'){
    // Ukey entry — shown after intro animation, app bg video playing
    return h('div',{style:{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:'20px'},className:'screen-fade'},
      h('div',{style:{width:'100%',maxWidth:'380px',background:'rgba(8,8,20,0.92)',border:'1px solid rgba(139,92,246,0.3)',borderRadius:'24px',padding:'28px',backdropFilter:'blur(32px)',boxShadow:'0 24px 80px rgba(0,0,0,0.8)'}},
        h('div',{style:{textAlign:'center',marginBottom:'20px'}},
          h('div',{style:{fontSize:'28px',fontWeight:900,color:'#F0F0FF',letterSpacing:'-1px',textShadow:'0 0 20px rgba(139,92,246,0.5)'}},'FIZUX'),
          h('div',{style:{fontSize:'12px',color:'#505070',marginTop:'4px'}},'Enter your Ukey to continue')
        ),
        h('input',{
          value:ukeyInput,
          onChange:function(e){setUkeyInput(e.target.value.toUpperCase());setUkeyErr('');},
          onKeyDown:function(e){if(e.key==='Enter')activateUkey();},
          placeholder:'Enter your Ukey',
          autoFocus:true,
          style:{background:'rgba(255,255,255,0.06)',border:'1.5px solid '+(ukeyErr?RED:'rgba(139,92,246,0.3)'),borderRadius:'14px',padding:'14px',color:'#F0F0FF',fontSize:'14px',fontFamily:'JetBrains Mono,monospace',letterSpacing:'3px',textAlign:'center',width:'100%',boxSizing:'border-box',outline:'none',marginBottom:'10px',transition:'all 0.2s'}
        }),
        ukeyErr && h('div',{style:{color:RED,fontSize:'11px',textAlign:'center',marginBottom:'8px'}},ukeyErr),
        loginLoading
          ? h('div',{style:{textAlign:'center',padding:'12px'}},
              h('div',{style:{width:'20px',height:'20px',border:'2px solid rgba(139,92,246,0.3)',borderTopColor:PURPLE,borderRadius:'50%',animation:'spin .7s linear infinite',margin:'0 auto'}})
            )
          : h('button',{
              onClick:activateUkey,
              style:{width:'100%',padding:'14px',background:'linear-gradient(135deg,rgba(139,92,246,0.8),rgba(109,62,216,0.9))',border:'none',borderRadius:'14px',color:'#fff',fontSize:'15px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',transition:'all 0.2s'}
            },'Activate Ukey →'),
        h('button',{
          onClick:function(){loginGuest();},
          style:{width:'100%',marginTop:'10px',padding:'10px',background:'transparent',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',color:'rgba(255,255,255,0.4)',fontSize:'13px',cursor:'pointer',fontFamily:'inherit'}
        },'Skip → Free Login')
      )
    );
  }

if(screen==='login'){
    // Listen for intro completion
    useEffect(function(){
      function onReady(){
        var loginType = window.FIZUX_LOGIN_TYPE || 'free';
        // Check pending ukey
        var pendingUkey='';
        try{pendingUkey=localStorage.getItem('fizux:pending_ukey')||'';}catch(e){}

        if(loginType==='ukey' && pendingUkey){
          try{localStorage.removeItem('fizux:pending_ukey');}catch(e){}
          setUkeyInput(pendingUkey);
          setTimeout(function(){activateUkey();},200);
        } else if(!window._sessionRestored){
          loginGuest();
        }
        // else: session already restored, user is logged in
      }
      document.addEventListener('fizux:ready', onReady, {once:true});
      // If already ready (page reload)
      if(window.FIZUX_READY) onReady();
      return function(){document.removeEventListener('fizux:ready',onReady);};
    },[]);

    return h('div',{style:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'transparent',position:'relative',overflow:'hidden'},className:'screen-fade'},
      // Toast
      toast.msg && h('div',{style:{position:'fixed',top:'16px',left:'50%',transform:'translateX(-50%)',background:'#16161E',border:'1.5px solid '+(toast.type==='err'?RED:GREEN),borderRadius:'12px',padding:'10px 20px',fontSize:'13px',fontWeight:500,color:toast.type==='err'?RED:GREEN,zIndex:9999,whiteSpace:'nowrap'}},toast.msg),
      h('div',{style:{width:'100%',maxWidth:'400px'}},
        // Logo
        h('div',{style:{textAlign:'center',marginBottom:'28px'}},
          h('div',{className:'logo-float',style:{width:'80px',height:'80px',borderRadius:'24px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'36px',fontWeight:900,color:'#FFFFFF',margin:'0 auto 18px'}},'F'),
          h('div',{style:{fontSize:'36px',fontWeight:900,color:'#F0F0FF',marginBottom:'8px',letterSpacing:'-1.5px',textShadow:'0 0 20px rgba(139,92,246,0.5),0 0 40px rgba(139,92,246,0.2)'}},'FIZUX'),
          h('div',{style:{fontSize:'14px',color:'#505070',letterSpacing:'0.3px'}},'Your Personal AI Universe')
        ),
        // Card
        h('div',{className:'login-card',style:{borderRadius:'24px',padding:'32px',animation:'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both',transform:'perspective(1000px) translateZ(0)'}},
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

        // ── MANUAL API KEY SECTION ──
        h('div',{style:{marginBottom:'18px',border:'1px solid rgba(139,92,246,0.25)',borderRadius:'16px',padding:'14px',background:'rgba(139,92,246,0.04)'}},
          h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}},
            h('div',null,
              h('div',{style:{fontSize:'13px',fontWeight:700,color:TEXT}},'🔑 Custom API Key'),
              h('div',{style:{fontSize:'11px',color:MUTED,marginTop:'2px'}},'Any AI provider — bypasses system keys')
            ),
            h('button',{
              onClick:function(){setManualModePanel(!manualModePanel);},
              style:{background:manualModePanel?'rgba(139,92,246,0.2)':CARD2,border:'1px solid '+(manualModePanel?PURPLE:BORDER),borderRadius:'8px',padding:'4px 10px',color:manualModePanel?PURPLE:MUTED,cursor:'pointer',fontSize:'11px',fontFamily:'inherit'}
            },manualModePanel?'Hide':'Setup')
          ),
          manualTextKey.length>10 && h('div',{style:{fontSize:'11px',color:'#2ECC8A',marginBottom:'8px',display:'flex',alignItems:'center',gap:'6px'}},
            h('div',{style:{width:'6px',height:'6px',borderRadius:'50%',background:'#2ECC8A',boxShadow:'0 0 6px #2ECC8A'}}),
            'Custom key active — system keys bypassed'
          ),
          manualModePanel && h('div',null,
            // Provider selector
            h('div',{style:{marginBottom:'10px'}},
              h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'6px'}},'Provider:'),
              h('div',{style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'5px'}},
                ['openai','groq','gemini','anthropic','cerebras','mistral','cohere','custom'].map(function(p){
                  var active=manualProvider===p;
                  return h('button',{key:p,onClick:function(){setManualProvider(p);localStorage.setItem('fizux:manual_provider',p);},
                    style:{padding:'5px 4px',borderRadius:'8px',border:'1.5px solid '+(active?PURPLE:BORDER),
                      background:active?PURPLE+'18':CARD2,cursor:'pointer',fontFamily:'inherit',
                      fontSize:'10px',fontWeight:active?700:400,color:active?PURPLE:TEXT,textTransform:'capitalize'}},p
                  );
                })
              )
            ),
            // Model name
            h('div',{style:{marginBottom:'8px'}},
              h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'5px'}},'Model name:'),
              h('input',{
                value:manualModel,
                onChange:function(e){setManualModel(e.target.value);localStorage.setItem('fizux:manual_model',e.target.value);},
                placeholder:manualProvider==='openai'?'gpt-4o-mini':manualProvider==='anthropic'?'claude-3-haiku-20240307':manualProvider==='gemini'?'gemini-2.0-flash':'Enter model name...',
                style:{width:'100%',padding:'8px',background:CARD2,border:'1px solid '+BORDER,borderRadius:'8px',color:TEXT,fontSize:'12px',fontFamily:'monospace',outline:'none',boxSizing:'border-box'}
              })
            ),
            // Text API Key
            h('div',{style:{marginBottom:'8px'}},
              h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'5px'}},'Text/Chat API Key:'),
              h('div',{style:{display:'flex',gap:'6px'}},
                h('input',{
                  value:manualTextKey,type:'password',
                  onChange:function(e){setManualTextKey(e.target.value);localStorage.setItem('fizux:manual_text_key',e.target.value);},
                  placeholder:'sk-... or API key',
                  style:{flex:1,padding:'8px',background:CARD2,border:'1px solid '+BORDER,borderRadius:'8px',color:TEXT,fontSize:'12px',fontFamily:'monospace',outline:'none'}
                }),
                manualTextKey.length>10 && h('button',{
                  onClick:function(){setManualTextKey('');localStorage.removeItem('fizux:manual_text_key');},
                  style:{padding:'8px',background:'rgba(255,77,106,0.1)',border:'1px solid rgba(255,77,106,0.3)',borderRadius:'8px',color:'#FF4D6A',cursor:'pointer',fontSize:'11px',fontFamily:'inherit'}
                },'✕ Clear')
              )
            ),
            // Image API Key
            h('div',{style:{marginBottom:'8px'}},
              h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'5px'}},'Image API Key (optional — uses text key if empty):'),
              h('input',{
                value:manualImgKey,type:'password',
                onChange:function(e){setManualImgKey(e.target.value);localStorage.setItem('fizux:manual_img_key',e.target.value);},
                placeholder:'Leave empty to use text key',
                style:{width:'100%',padding:'8px',background:CARD2,border:'1px solid '+BORDER,borderRadius:'8px',color:TEXT,fontSize:'12px',fontFamily:'monospace',outline:'none',boxSizing:'border-box'}
              })
            ),
            // Note
            h('div',{style:{fontSize:'10px',color:MUTED,background:CARD2,borderRadius:'8px',padding:'8px'}},
              '⚠️ Your keys are stored locally on this device only. Clear to switch back to system AI.'
            )
          )
        ),

        // ── VOICE SETTINGS ──
        h('div',{style:{marginBottom:'16px'}},
          h('div',{style:{fontSize:'11px',color:MUTED,fontWeight:700,letterSpacing:'0.8px',marginBottom:'10px'}},'🎙 VOICE INPUT LANGUAGE'),
          h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',maxHeight:'160px',overflowY:'auto'}},
            VOICE_LANGS.map(function(l){
              var active = voiceLang===l.code;
              return h('button',{key:l.code,
                onClick:function(){setVoiceLang(l.code);saveVoiceSettings({lang:l.code});},
                style:{padding:'7px 8px',borderRadius:'9px',border:'1.5px solid '+(active?PURPLE:BORDER),
                  background:active?PURPLE+'18':CARD2,cursor:'pointer',textAlign:'left',
                  fontFamily:'inherit',fontSize:'12px',color:active?PURPLE:TEXT,fontWeight:active?700:400}},
                l.flag+' '+l.label
              );
            })
          )
        ),

        // ── TTS SETTINGS ──
        h('div',{style:{marginBottom:'16px'}},
          h('div',{style:{fontSize:'11px',color:MUTED,fontWeight:700,letterSpacing:'0.8px',marginBottom:'10px'}},'🔊 TEXT-TO-SPEECH SETTINGS'),

          // Language for TTS
          h('div',{style:{marginBottom:'10px'}},
            h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'6px'}},'Speak language:'),
            h('select',{
              value:ttsLang,
              onChange:function(e){setTtsLang(e.target.value);saveVoiceSettings({ttsLang:e.target.value});},
              style:{width:'100%',padding:'8px',background:CARD2,border:'1px solid '+BORDER,
                borderRadius:'8px',color:TEXT,fontSize:'12px',fontFamily:'inherit',outline:'none'}},
              VOICE_LANGS.map(function(l){
                return h('option',{key:l.code,value:l.code},l.flag+' '+l.label);
              })
            )
          ),

          // Browser voice selector
          ttsVoices.length>0 && h('div',{style:{marginBottom:'10px'}},
            h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'6px'}},'Browser voice ('+ttsVoices.filter(function(v){return v.lang.startsWith(ttsLang.split('-')[0]);}).length+' available):'),
            h('select',{
              value:selectedTtsVoice||'',
              onChange:function(e){setSelectedTtsVoice(e.target.value||null);},
              style:{width:'100%',padding:'8px',background:CARD2,border:'1px solid '+BORDER,
                borderRadius:'8px',color:TEXT,fontSize:'11px',fontFamily:'inherit',outline:'none'}},
              h('option',{value:''},'Auto (best match)'),
              ttsVoices.map(function(v,i){
                return h('option',{key:i,value:v.name},
                  v.name+' — '+v.lang+(v.localService?' (Neural)':' (Online)'));
              })
            )
          ),

          // Speed + Pitch
          h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}},
            h('div',null,
              h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'4px'}},'Speed: '+ttsRate.toFixed(1)+'x'),
              h('input',{type:'range',min:'0.5',max:'2',step:'0.1',value:ttsRate,
                onChange:function(e){var v=parseFloat(e.target.value);setTtsRate(v);saveVoiceSettings({rate:v});},
                style:{width:'100%',accentColor:PURPLE}})
            ),
            h('div',null,
              h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'4px'}},'Pitch: '+ttsPitch.toFixed(1)),
              h('input',{type:'range',min:'0.5',max:'2',step:'0.1',value:ttsPitch,
                onChange:function(e){var v=parseFloat(e.target.value);setTtsPitch(v);saveVoiceSettings({pitch:v});},
                style:{width:'100%',accentColor:PURPLE}})
            )
          ),

          // Test button
          h('button',{
            onClick:function(){speakText('Hello! This is FIZUX speaking. Testing voice quality.');},
            style:{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid '+PURPLE,
              background:PURPLE+'15',color:PURPLE,cursor:'pointer',fontSize:'12px',fontFamily:'inherit',fontWeight:600}},
            ttsSpeaking?'⏹ Stop':'▶ Test Voice'
          )
        ),

        // ── ELEVENLABS VOICE SELECTOR (key in admin) ──
        h('div',{style:{marginBottom:'16px',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'14px',padding:'12px'}},
          h('div',{style:{fontSize:'11px',color:PURPLE,fontWeight:700,letterSpacing:'0.5px',marginBottom:'8px'}},'✨ REAL HUMAN VOICE'),
          elevenKey.length>10
            ? h('div',null,
                h('div',{style:{fontSize:'11px',color:GREEN,marginBottom:'8px'}},'✅ Premium voice active'),
                h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'8px'}},'Select voice:'),
                h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5px',maxHeight:'200px',overflowY:'auto'}},
                  ELEVEN_VOICES.map(function(v){
                    var active = elevenVoice===v.name;
                    return h('button',{key:v.id,
                      onClick:function(){setElevenVoice(v.name);saveVoiceSettings({elevenVoice:v.name});},
                      style:{padding:'7px 8px',borderRadius:'8px',border:'1.5px solid '+(active?PURPLE:BORDER),
                        background:active?PURPLE+'20':CARD2,cursor:'pointer',textAlign:'left',fontFamily:'inherit'}},
                      h('div',{style:{fontSize:'12px',fontWeight:700,color:active?PURPLE:TEXT}},v.gender+' '+v.name),
                      h('div',{style:{fontSize:'10px',color:MUTED}},v.accent+' · '+v.style)
                    );
                  })
                ),
                h('button',{
                  onClick:function(){speakText('Hello! I am FIZUX, your personal AI assistant.',true);},
                  disabled:ttsSpeaking,
                  style:{width:'100%',padding:'8px',borderRadius:'8px',background:PURPLE,color:'#fff',
                    border:'none',cursor:'pointer',fontSize:'12px',fontFamily:'inherit',fontWeight:700,marginTop:'8px',opacity:ttsSpeaking?0.7:1}},
                  ttsSpeaking?'⏹ Stop':'▶ Test Premium Voice'
                )
              )
            : h('div',{style:{textAlign:'center',padding:'8px'}},
                h('div',{style:{fontSize:'13px',color:MUTED}},
                  '🔒 Premium voice not enabled'
                )
              )
        ),

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
    // Typewriter text for AI messages
    var displayText = msg.content;
    var isTyping = false;

    // Image message in chat
    if(!isUser && msg.content === '__IMAGES__' && msg.images){
      return h('div',{key:i,className:'msg-appear',style:{padding:'4px 16px',maxWidth:'720px',margin:'0 auto'}},
        h('div',{className:'msg-ai',style:{
          maxWidth:'75%',borderRadius:'18px',
          padding:'10px',border:'1px solid rgba(139,92,246,0.2)'
        }},
          h('div',{style:{fontSize:'11px',color:'rgba(139,92,246,0.8)',marginBottom:'8px',fontWeight:600}},
            '🎨 Generated — '+IMAGE_MODELS.find(function(m){return m.id===imgModel;}||{label:'Flux'}).label
          ),
          h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}},
            msg.images.map(function(url,ii){
              return h('div',{key:ii,style:{position:'relative',borderRadius:'10px',overflow:'hidden',cursor:'pointer'},
                onClick:function(){
                  // Download image
                  var a=document.createElement('a');
                  a.href=url;a.download='fizux-img-'+ii+'.jpg';
                  a.target='_blank';a.click();
                }},
                h('img',{src:url,style:{width:'100%',aspectRatio:'1',objectFit:'cover',display:'block'},
                  loading:'lazy'}),
                h('div',{style:{position:'absolute',bottom:0,left:0,right:0,
                  background:'linear-gradient(transparent,rgba(0,0,0,0.6))',
                  padding:'6px 8px',fontSize:'10px',color:'rgba(255,255,255,0.7)',
                  textAlign:'center'}},'⬇ Download')
              );
            })
          )
        )
      );
    }

    if(!isUser && msg.ts){
      var twText = typewriterMap[msg.ts];
      var twDone = typewriterDone[msg.ts];
      if(twText !== undefined){
        displayText = twText;
        isTyping = !twDone;
      }
    }
    return h('div',{key:i,className:'msg-appear pop-3d',style:{display:'flex',justifyContent:isUser?'flex-end':'flex-start',padding:'4px 16px',maxWidth:'720px',margin:'0 auto',animationDelay:(i*0.03)+'s'}},
      h('div',{className:isUser?'msg-user-3d':'msg-ai-3d',style:{
        maxWidth:'75%',
        borderRadius:isUser?'18px 18px 4px 18px':'18px 18px 18px 4px',
        padding:'10px 14px',
        fontSize:fontSize+'px',
        lineHeight:1.75,
        whiteSpace:'pre-wrap',
        wordBreak:'break-word',
        border:isUser?'none':'1px solid #2A2A3E'
      }},
        h('span',null,displayText),
        isTyping && h('span',{className:'typewriter-cursor'}),
        !isUser && h('div',{style:{display:'flex',gap:'8px',marginTop:'6px'}},
          h('button',{onClick:function(){try{navigator.clipboard.writeText(msg.content);}catch(e){}notify('Copied!');},
            style:{background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:'11px',padding:'0',fontFamily:"Inter,system-ui,sans-serif"}},'Copy'),
          h('button',{
            onClick:function(){ttsSpeaking?stopSpeaking():speakText(msg.content);},
            style:{background:'none',border:'none',color:ttsSpeaking?'#EC4899':'#555',cursor:'pointer',fontSize:'11px',padding:'0',fontFamily:"Inter,system-ui,sans-serif",transition:'color 0.2s'}},
            ttsSpeaking?'⏹ Stop':'🔊 Read')
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
    toast.msg && h('div',{className:'toast',style:{position:'fixed',top:'16px',left:'50%',transform:'translateX(-50%)',border:'1.5px solid '+(toast.type==='err'?RED:GREEN),borderRadius:'12px',padding:'10px 20px',fontSize:'13px',fontWeight:500,color:toast.type==='err'?RED:GREEN,zIndex:9999,whiteSpace:'nowrap'}},toast.msg),
    OnboardModal,
    SettingsModal,
    LimitModal,
    CompareModal,

    // Sidebar overlay
    sidebar && h('div',{onClick:function(){setSidebar(false);},style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:98}}),

    // Sidebar
    h('div',{className:'glass-sidebar',style:{position:'fixed',left:0,top:0,bottom:0,width:sidebar?'275px':'0',transition:'width 0.25s ease',overflow:'hidden',zIndex:99}},
      h('div',{style:{width:'275px',height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}},
        // Header
        h('div',{style:{padding:'14px 12px 8px',display:'flex',alignItems:'center',gap:'8px'}},
          h('div',{className:'',style:{width:'30px',height:'30px',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'14px',color:'#FFFFFF'}},'F'),
          h('span',{style:{fontWeight:800,fontSize:'15px',flex:1,color:'#E0E0FF',letterSpacing:'-0.3px'}},'FIZUX'),
          isPremium && h('span',{style:badge(GOLD,{fontSize:'9px'})},'✦'),
          h('button',{onClick:function(){setSidebar(false);},style:{color:MUTED,fontSize:'16px',background:'none',border:'none',cursor:'pointer'}},'✕')
        ),
        h('div',{style:{padding:'0 10px 8px'}},
          h('button',{onClick:newChat,style:{width:'100%',padding:'9px 12px',borderRadius:'10px',border:'1px solid rgba(139,92,246,0.2)',background:'rgba(20,20,36,0.8)',color:'#D0D0F0',fontSize:'13px',cursor:'pointer',textAlign:'left',fontFamily:"Inter,system-ui,sans-serif",fontWeight:600}},'✎ New chat')
        ),
        !isPremium && h('div',{style:{padding:'0 10px 8px'}},
          h('div',{style:{padding:'7px 10px',borderRadius:'9px',background:daily>=FREE_DAILY?'rgba(255,77,106,0.1)':'rgba(46,204,138,0.08)',border:'1px solid '+(daily>=FREE_DAILY?'rgba(255,77,106,0.3)':'rgba(46,204,138,0.25)'),display:'flex',justifyContent:'space-between',fontSize:'11px'}},
            h('span',{style:{color:MUTED}},'Free today:'),
            h('span',{style:{fontWeight:700,color:daily>=FREE_DAILY?RED:GREEN}},remaining()+' left')
          )
        ),
        h('div',{style:{flex:1,overflowY:'auto',padding:'0 10px'}},
          h('div',{style:{fontSize:'9px',color:'#6060A0',fontWeight:700,letterSpacing:'1.5px',marginBottom:'6px',marginTop:'4px'}},'⚡ TOOLS'),
          FEATURES.map(function(f){
            return h('button',{key:f.id,onClick:function(){setSelectedFeat(f);setSidebar(false);if(inputRef.current)inputRef.current.focus();},
              className:'sidebar-item',style:{width:'100%',padding:'7px 8px',borderRadius:'8px',border:'none',color:TEXT,cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:'7px',marginBottom:'1px',fontFamily:"Inter,system-ui,sans-serif",transition:'all 0.15s ease'}},
              h('span',{style:{fontSize:'13px',color:MUTED,flexShrink:0,width:'16px'}},f.icon),
              h('span',{style:{fontSize:'11px',fontWeight:600,color:'#D0D0F0'}},f.label),
              !f.free&&!isPremium && h('span',{style:badge(PURPLE,{fontSize:'8px',padding:'0 3px',marginLeft:'4px'})},'PRO')
            );
          }),
          chats.length>0 && h('div',null,
            h('div',{style:{fontSize:'9px',color:'#6060A0',fontWeight:700,letterSpacing:'1.5px',padding:'10px 2px 5px'}},'RECENT CHATS'),
            chats.slice(0,isPremium?60:10).map(function(c){
              return h('div',{key:c.id,onClick:function(){setMessages(c.messages);setActiveChat(c.id);setSidebar(false);},
                style:{padding:'7px 8px',borderRadius:'8px',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px',background:activeChat===c.id?CARD2:'transparent'}},
                h('span',{style:{flex:1,fontSize:'11px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#8080C0'}},'▪ '+c.title),
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
              return h('button',{key:item[2],onClick:item[1],title:item[2],style:{flex:1,background:'rgba(20,20,36,0.8)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:'7px',padding:'6px 0',cursor:'pointer',fontSize:'12px',color:'#8080C0'}},item[0]);
            })
          )
        )
      )
    ),

    // Header
    h('div',{className:'glass-header',style:{padding:'0 12px',height:'64px',display:'flex',alignItems:'center',gap:'8px',flexShrink:0,background:'rgba(0,0,8,0.7)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.1)'}},
      h('button',{onClick:function(){setSidebar(!sidebar);},style:{background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',gap:'4px',padding:'6px',borderRadius:'8px'}},
        [0,1,2].map(function(i){return h('div',{key:i,style:{width:'17px',height:'2px',borderRadius:'2px',background:'#FFFFFF'}});})
      ),
      h('div',{className:'mode-toggle',style:{display:'flex',gap:'3px',borderRadius:'10px',padding:'3px'}},
        ['slow','fast'].map(function(spd){
          var act=model===spd;
          return h('button',{key:spd,onClick:function(){setModel(spd);},
            className:act?'mode-btn-active':'',
            style:{padding:'5px 14px',borderRadius:'8px',border:'none',
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
      isPremium && h('span',{className:'premium-badge',style:badge(GOLD,{fontSize:'11px',padding:'4px 10px',color:'#000',borderColor:'rgba(0,0,0,0.4)'})},'✦ '+premVer),
      h('button',{onClick:function(){setImgPanel(!imgPanel);},style:{background:'transparent',border:'1px solid '+BORDER,borderRadius:'8px',padding:'6px 9px',cursor:'pointer',fontSize:'12px',color:MUTED}},'🎨'),
      h('button',{onClick:function(){if(!isPremium){notify('✦ Compare mode requires Premium. Activate a Ukey!');return;}setCompareMode(true);},style:{background:'transparent',border:'1px solid '+(isPremium?BLUE:BORDER),borderRadius:'8px',padding:'6px 9px',cursor:'pointer',fontSize:'12px',color:isPremium?BLUE:MUTED,position:'relative'}},isPremium?'⚖':'🔒'),
      h('button',{onClick:function(){setShowSettings(true);},style:{background:'transparent',border:'1px solid '+BORDER,borderRadius:'8px',padding:'6px 9px',cursor:'pointer',fontSize:'12px',color:MUTED}},'⚙'),
      h('button',{onClick:newChat,style:btn({fontSize:'11px',padding:'6px 12px',borderRadius:'9px'})},'✎ New')
    ),
    // Messages area
    h('div',{ref:chatAreaRef,className:'chat-scroll',style:{flex:1,overflowY:'auto',padding:'0',background:'rgba(0,0,8,0.15)'}},
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
                    className:'quick-card',style:{padding:'16px 12px',borderRadius:'14px',border:'1px solid rgba(255,255,255,0.06)',cursor:'pointer',textAlign:'left',fontFamily:'Inter,system-ui,sans-serif'}},
                    h('div',{style:{fontSize:'24px',marginBottom:'8px'}},q.icon),
                    h('div',{style:{fontSize:'13px',fontWeight:600,color:q.color}},q.label)
                  );
                })
              )
            )
          : messages.map(renderMsg),
        loading && h('div',{style:{padding:'4px 16px',display:'flex',justifyContent:'flex-start',maxWidth:'720px',margin:'0 auto'}},
          h('div',{className:'msg-ai',style:{borderRadius:'18px 18px 18px 4px',padding:'12px 16px',display:'inline-flex',alignItems:'center',gap:'8px'}},
            h('div',{className:'ai-thinking'},
              h('div',{className:'dot'}),
              h('div',{className:'dot'}),
              h('div',{className:'dot'})
            ),
            h('span',{style:{fontSize:'11px',color:'rgba(139,92,246,0.6)',letterSpacing:'0.5px'}},'FIZUX is thinking...')
          )
        ),
        followUps.length>0&&!loading && h('div',{style:{padding:'8px 16px 0',display:'flex',gap:'6px',flexWrap:'wrap'}},
          followUps.map(function(q,i){
            return h('button',{key:i,onClick:function(){setInput(q);setTimeout(function(){send();scrollToBottom(true);},50);},
              className:'followup-btn',
              style:{background:'rgba(139,92,246,0.08)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'20px',padding:'6px 14px',fontSize:'11px',color:'rgba(180,160,255,0.9)',cursor:'pointer',fontFamily:"Inter,system-ui,sans-serif",fontWeight:500}},
              h('span',{style:{marginRight:'4px',opacity:0.6}},'↩'),q
            );
          })
        ),
        genImgs.length>0 && h('div',{style:{padding:'8px 16px',maxWidth:'720px',margin:'0 auto'}},
          h('div',{style:{fontSize:'12px',color:MUTED,marginBottom:'8px',fontWeight:600}},'Generated Images — click to download'),
          h('div',{style:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px'}},
            genImgs.map(function(url,i){
              return h('div',{key:i,style:{position:'relative',borderRadius:'12px',overflow:'hidden',cursor:'pointer',
                boxShadow:'0 4px 16px rgba(0,0,0,0.5)',border:'1px solid rgba(139,92,246,0.2)'}},
                h('img',{src:url,
                  style:{width:'100%',height:'200px',objectFit:'cover',display:'block'},
                  onClick:function(){
                    var a=document.createElement('a');
                    a.href=url; a.download='fizux-image-'+i+'.jpg';
                    a.target='_blank'; a.click();
                  }
                }),
                h('div',{style:{position:'absolute',bottom:0,left:0,right:0,padding:'8px',
                  background:'linear-gradient(transparent,rgba(0,0,0,0.7))',
                  fontSize:'11px',color:'#fff',textAlign:'center'}},'Click to download')
              );
            })
          )
        ),
        h('div',{ref:scrollRef,style:{height:'80px',flexShrink:0}})
      )
    ),
    h('div',{style:{flexShrink:0,borderTop:'1px solid rgba(255,255,255,0.1)',padding:'10px 12px 10px',background:'rgba(0,0,8,0.7)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}},
      h('div',{style:{maxWidth:'720px',margin:'0 auto'}},
        // Image generation panel
        imgPanel && h('div',{style:{background:CARD,border:'1px solid '+BORDER,borderRadius:'16px',padding:'14px',marginBottom:'10px',
          boxShadow:'0 4px 24px rgba(0,0,0,0.4)',backdropFilter:'blur(12px)'}},

          // Header
          h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}},
            h('div',{style:{fontSize:'13px',fontWeight:700,color:TEXT}},'🎨 Image Generator'),
            h('button',{onClick:function(){setImgPanel(false);setGenImgs([]);},
              style:{background:'none',border:'none',color:MUTED,cursor:'pointer',fontSize:'16px'}},'✕')
          ),

          // Model selector
          h('div',{style:{marginBottom:'10px'}},
            h('div',{style:{fontSize:'11px',color:MUTED,fontWeight:600,marginBottom:'6px',letterSpacing:'0.5px'}},'MODEL'),
            h('div',{style:{display:'flex',gap:'6px',flexWrap:'wrap'}},
              IMAGE_MODELS.map(function(m){
                var active = imgModel===m.id;
                return h('button',{key:m.id,
                  onClick:function(){setImgModel(m.id);},
                  style:{padding:'6px 10px',borderRadius:'9px',border:'1.5px solid '+(active?PURPLE:BORDER),
                    background:active?PURPLE+'18':BG,cursor:'pointer',
                    fontFamily:'inherit',transition:'all 0.15s'}},
                  h('div',{style:{fontSize:'12px',fontWeight:active?700:500,color:active?PURPLE:TEXT}},m.badge+' '+m.label),
                  h('div',{style:{fontSize:'10px',color:MUTED}},m.desc)
                );
              })
            )
          ),

          // Size + Count row
          h('div',{style:{display:'flex',gap:'8px',marginBottom:'10px'}},
            // Size selector
            h('div',{style:{flex:1}},
              h('div',{style:{fontSize:'11px',color:MUTED,fontWeight:600,marginBottom:'6px',letterSpacing:'0.5px'}},'SIZE'),
              h('div',{style:{display:'flex',gap:'4px'}},
                [['256','256px'],['512','512px'],['768','768px'],['1024','1024px']].map(function(s){
                  var active = imgSize===s[0];
                  return h('button',{key:s[0],
                    onClick:function(){setImgSize(s[0]);},
                    style:{flex:1,padding:'6px 4px',borderRadius:'8px',border:'1.5px solid '+(active?PURPLE:BORDER),
                      background:active?PURPLE+'18':BG,cursor:'pointer',
                      fontSize:'11px',fontWeight:active?700:400,color:active?PURPLE:TEXT,fontFamily:'inherit'}},
                    s[1]
                  );
                })
              )
            ),
            // Count selector
            h('div',{style:{flex:1}},
              h('div',{style:{fontSize:'11px',color:MUTED,fontWeight:600,marginBottom:'6px',letterSpacing:'0.5px'}},'COUNT'),
              h('div',{style:{display:'flex',gap:'4px'}},
                [[1,'1'],[2,'2'],[4,'4'],[6,'6']].map(function(c){
                  var active = imgCount===c[0];
                  return h('button',{key:c[0],
                    onClick:function(){setImgCount(c[0]);},
                    style:{flex:1,padding:'6px 4px',borderRadius:'8px',border:'1.5px solid '+(active?PURPLE:BORDER),
                      background:active?PURPLE+'18':BG,cursor:'pointer',
                      fontSize:'11px',fontWeight:active?700:400,color:active?PURPLE:TEXT,fontFamily:'inherit'}},
                    c[1]
                  );
                })
              )
            )
          ),

          // Prompt input + generate
          h('div',{style:{display:'flex',gap:'8px',marginBottom:'8px'}},
            h('input',{
              value:imgPrompt,
              onChange:function(e){setImgPrompt(e.target.value);},
              onKeyDown:function(e){if(e.key==='Enter')generateImage(imgPrompt);},
              placeholder:'Describe the image you want...',
              style:{flex:1,background:BG,border:'1px solid '+BORDER,borderRadius:'10px',
                padding:'10px 14px',color:'#F0F0FF',fontSize:'13px',fontFamily:'Inter,system-ui,sans-serif',outline:'none'}
            }),
            h('button',{
              onClick:function(){generateImage(imgPrompt);},
              disabled:imgLoading||!imgPrompt.trim(),
              style:{padding:'10px 16px',borderRadius:'10px',background:PURPLE,color:'#fff',
                border:'none',cursor:imgLoading||!imgPrompt.trim()?'not-allowed':'pointer',
                fontWeight:700,fontSize:'13px',opacity:imgLoading||!imgPrompt.trim()?0.6:1,
                fontFamily:'inherit',whiteSpace:'nowrap',transition:'all 0.2s'}},
              imgLoading
                ? h('div',{style:{width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite'}})
                : '✨ Generate'
            )
          ),

          // Status
          imgLoading && h('div',{style:{textAlign:'center',padding:'10px',fontSize:'12px',color:MUTED}},
            h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}},
              h('div',{style:{width:'14px',height:'14px',border:'2px solid '+MUTED,borderTopColor:PURPLE,borderRadius:'50%',animation:'spin .7s linear infinite'}}),
              'Generating '+imgCount+' image'+(imgCount>1?'s':'')+' with '+IMAGE_MODELS.find(function(m){return m.id===imgModel;}  ).label+'...'
            )
          ),

          // Results grid
          !imgLoading && genImgs.length>0 && h('div',{style:{marginTop:'8px'}},
            h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}},
              h('div',{style:{fontSize:'11px',color:MUTED}},genImgs.length+' image'+(genImgs.length>1?'s':'')+' — click to open full size'),
              h('button',{
                onClick:function(){setGenImgs([]);setImgPrompt('');},
                style:{background:'none',border:'none',color:MUTED,cursor:'pointer',fontSize:'11px',fontFamily:'inherit'}},
                '✕ Clear'
              )
            ),
            h('div',{style:{
              display:'grid',
              gridTemplateColumns:genImgs.length===1?'1fr':genImgs.length===2?'1fr 1fr':'repeat('+Math.min(genImgs.length,3)+',1fr)',
              gap:'6px'
            }},
              genImgs.map(function(url,i){
                return h('div',{key:i,
                  style:{position:'relative',borderRadius:'10px',overflow:'hidden',
                    cursor:'pointer',boxShadow:'0 4px 16px rgba(0,0,0,0.5)',
                    border:'1px solid rgba(139,92,246,0.15)',transition:'transform 0.2s'},
                  onClick:function(){window.open(url,'_blank');}},
                  h('img',{src:url,
                    style:{width:'100%',height:genImgs.length===1?'200px':'120px',objectFit:'cover',display:'block'}}),
                  h('div',{style:{position:'absolute',bottom:0,left:0,right:0,padding:'4px 6px',
                    background:'linear-gradient(transparent,rgba(0,0,0,0.7))',
                    fontSize:'10px',color:'rgba(255,255,255,0.7)',textAlign:'center'}},'↗ Open')
                );
              })
            )
          )
        ),
        h('div',{className:'input-area',style:{border:'1.5px solid '+(listening?RED:BORDER),borderRadius:'20px',padding:'13px 15px'}},
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
            style:{width:'100%',background:'transparent',border:'none',color:'#F0F0FF',fontSize:fontSize+'px',fontFamily:"Inter,system-ui,sans-serif",lineHeight:1.6,maxHeight:'140px',boxSizing:'border-box',outline:'none',caretColor:'#8B5CF6'}
          }),
          h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'8px'}},
            h('div',{style:{display:'flex',gap:'4px'}},
              h('button',{onClick:function(){if(fileRef.current)fileRef.current.click();},title:'Attach file',style:{background:'transparent',border:'none',borderRadius:'7px',color:MUTED,cursor:'pointer',fontSize:'15px',padding:'3px 6px'}},'📎'),
              h('input',{ref:fileRef,type:'file',onChange:function(e){Array.from(e.target.files).forEach(processFile);e.target.value='';},style:{display:'none'},multiple:true,accept:'image/*,.txt,.csv,.json,.md,.pdf,.docx,.xlsx,.xls,.js,.py,.html,.sql'}),
              h('div',{style:{position:'relative',display:'inline-flex',alignItems:'center'}},
              h('button',{onClick:listening?stopVoice:startVoice,title:'Voice input',
                style:{background:listening?'rgba(255,77,106,0.1)':'transparent',border:'none',borderRadius:'7px 0 0 7px',color:listening?RED:MUTED,cursor:'pointer',fontSize:'15px',padding:'3px 4px'}},
                listening?'🔴':'🎤'),
              h('button',{onClick:function(){setVoiceMenu(!voiceMenu);},title:'Select language',
                style:{background:'transparent',border:'none',borderRadius:'0 7px 7px 0',color:MUTED,cursor:'pointer',fontSize:'10px',padding:'3px 3px',lineHeight:1}},
                '▾'),
              voiceMenu && h('div',{style:{position:'absolute',bottom:'100%',left:0,background:CARD,border:'1px solid '+BORDER,borderRadius:'10px',padding:'6px',zIndex:200,minWidth:'160px',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',maxHeight:'200px',overflowY:'auto'}},
                h('div',{style:{fontSize:'10px',color:MUTED,fontWeight:700,padding:'2px 6px 6px',letterSpacing:'0.5px'}},'SELECT LANGUAGE'),
                VOICE_LANGS.map(function(l){
                  return h('button',{key:l.code,
                    onClick:function(){setVoiceLang(l.code);setVoiceMenu(false);notify('🎤 '+l.label);},
                    style:{display:'block',width:'100%',padding:'6px 8px',background:voiceLang===l.code?BORDER:'transparent',border:'none',borderRadius:'7px',color:voiceLang===l.code?TEXT:SUB,cursor:'pointer',textAlign:'left',fontFamily:'inherit',fontSize:'12px',fontWeight:voiceLang===l.code?700:400}},
                    l.label
                  );
                })
              )
            ),
              h('button',{onClick:function(){setImgPanel(!imgPanel);},title:'Generate image',
                style:{background:imgPanel?'rgba(139,92,246,0.15)':'transparent',border:'none',
                  borderRadius:'7px',color:imgPanel?PURPLE:MUTED,cursor:'pointer',fontSize:'15px',padding:'3px 6px',
                  transition:'all 0.2s'}},'🎨')
            ),
            h('button',{
              className:(!input.trim()&&!attach.length)||loading?'':'send-3d',
              onClick:function(){send();},
              disabled:(!input.trim()&&!attach.length)||loading,
              style:{width:'34px',height:'34px',borderRadius:'50%',background:(!input.trim()&&!attach.length)||loading?BORDER:'#111111',border:'none',cursor:(!input.trim()&&!attach.length)||loading?'not-allowed':'pointer',fontSize:'15px',display:'flex',alignItems:'center',justifyContent:'center',color:(!input.trim()&&!attach.length)||loading?MUTED:'#FFFFFF',transition:'all 0.2s',boxShadow:(!input.trim()&&!attach.length)||loading?'none':'0 0 16px rgba(139,111,232,0.3)'}},
              loading ? h('div',{style:{width:'14px',height:'14px',border:'2px solid '+MUTED,borderTopColor:'transparent',borderRadius:'50%',animation:'spin .7s linear infinite'}}) : '↑'
            )
          )
        ),
        selectedFeat && h('div',{className:'slide-in-up',style:{display:'flex',alignItems:'center',gap:'6px',marginTop:'6px',paddingLeft:'4px'}},
          h('span',{className:'feat-tag',style:{fontSize:'11px',color:PURPLE,padding:'4px 12px',borderRadius:'20px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px'}},
            h('span',null,selectedFeat.icon),
            h('span',null,selectedFeat.label)
          ),
          h('button',{onClick:function(){setSelectedFeat(null);},style:{background:'rgba(255,77,106,0.1)',border:'1px solid rgba(255,77,106,0.2)',borderRadius:'50%',width:'18px',height:'18px',color:'#FF4D6A',cursor:'pointer',fontSize:'10px',display:'flex',alignItems:'center',justifyContent:'center',padding:0}},'✕')
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
