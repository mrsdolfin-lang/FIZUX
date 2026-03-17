// FIZUX v8.0 — Full App

const { useState, useRef, useEffect, useCallback } = React;

const BRAND = { name:"FIZUX", version:"v8.0", tagline:"Your Personal AI Universe", copy:"© 2025 FIZUX" };

const C = {
  bg:"#07070D", surface:"#0F0F1A", card:"#14141E", border:"#252535",
  text:"#E8E8F8", muted:"#7070A0", dim:"#404060",
  accent:"#C9A84C", purple:"#7B5FE0", blue:"#3A8FEF",
  green:"#28BB7A", red:"#EF4060", orange:"#EF7C30",
  gold:"linear-gradient(135deg,#C9A84C,#E8C96B)",
  gradGreen:"linear-gradient(135deg,#1A8A5A,#28BB7A)",
  shadow:"0 4px 24px rgba(0,0,0,0.5)",
  shadowLg:"0 8px 48px rgba(0,0,0,0.7)",
  shadowGold:"0 4px 20px rgba(201,168,76,0.25)",
};

const USE_CASES = [
  {id:"office",icon:"💼",title:"Office Pro",desc:"Emails, reports, Excel",color:"#3A8FEF"},
  {id:"student",icon:"🎓",title:"Student",desc:"Study, essays, research",color:"#7B5FE0"},
  {id:"creator",icon:"✦",title:"Creator",desc:"Social media, content",color:"#EF5080"},
  {id:"business",icon:"🚀",title:"Business",desc:"Strategy, marketing",color:"#C9A84C"},
  {id:"developer",icon:"⌨",title:"Developer",desc:"Code, SQL, debug",color:"#28BB7A"},
  {id:"personal",icon:"◎",title:"Personal",desc:"Life, health, goals",color:"#EF7C30"},
];

const FEATURES = [
  {id:"excel",icon:"▦",label:"Excel Analyzer",free:true,cat:"office"},
  {id:"pdf",icon:"▤",label:"PDF Reader",free:true,cat:"office"},
  {id:"email",icon:"✉",label:"Email Writer",free:true,cat:"office"},
  {id:"resume",icon:"▣",label:"Resume Builder",free:true,cat:"office"},
  {id:"invoice",icon:"▥",label:"Invoice Gen",free:true,cat:"office"},
  {id:"report",icon:"▦",label:"Report Gen",free:false,cat:"office"},
  {id:"meeting",icon:"◈",label:"Meeting Notes",free:false,cat:"office"},
  {id:"contract",icon:"⚖",label:"Contract Review",free:false,cat:"office"},
  {id:"bizplan",icon:"◉",label:"Business Plan",free:false,cat:"office"},
  {id:"ocr",icon:"◫",label:"OCR",free:true,cat:"data"},
  {id:"sql",icon:"⬡",label:"SQL Generator",free:true,cat:"data"},
  {id:"formula",icon:"⚡",label:"Formula Gen",free:true,cat:"data"},
  {id:"imagegen",icon:"◐",label:"Image Gen",free:true,cat:"creative"},
  {id:"story",icon:"◑",label:"Story Writer",free:true,cat:"creative"},
  {id:"caption",icon:"◇",label:"Caption Writer",free:true,cat:"social"},
  {id:"hashtag",icon:"#",label:"Hashtag Gen",free:true,cat:"social"},
  {id:"linkedin",icon:"▪",label:"LinkedIn Post",free:true,cat:"social"},
  {id:"math",icon:"∑",label:"Math Solver",free:true,cat:"edu"},
  {id:"quiz",icon:"?",label:"Quiz Gen",free:true,cat:"edu"},
  {id:"flash",icon:"◱",label:"Flashcards",free:true,cat:"edu"},
  {id:"essay",icon:"✍",label:"Essay Writer",free:false,cat:"edu"},
  {id:"health",icon:"♥",label:"Health Advisor",free:true,cat:"personal"},
  {id:"travel",icon:"✈",label:"Travel Planner",free:true,cat:"personal"},
  {id:"workout",icon:"◎",label:"Workout Plan",free:true,cat:"personal"},
  {id:"support",icon:"◉",label:"Emotional Support",free:true,cat:"personal"},
  {id:"goals",icon:"◎",label:"Goal Setting",free:true,cat:"personal"},
  {id:"factcheck",icon:"✓",label:"Fact Checker",free:true,cat:"ai"},
  {id:"deepthink",icon:"⬡",label:"Deep Think",free:false,cat:"ai"},
  {id:"translate",icon:"◈",label:"Translator",free:true,cat:"tools"},
  {id:"ytsum",icon:"▷",label:"YouTube Summary",free:true,cat:"tools"},
  {id:"memory",icon:"◈",label:"AI Memory",free:true,cat:"tools"},
];

const MODELS = [
  {id:"claude",name:"Claude",icon:"◆",color:"#C9A84C",tag:"Smart"},
  {id:"gemini",name:"Gemini",icon:"✦",color:"#3A8FEF",tag:"Fast"},
  {id:"deep",name:"DeepThink",icon:"⬡",color:"#7B5FE0",tag:"Logic"},
];

const SESSION = "fizux_v8_session";

const sha256 = async(p) => {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(p+"__FIZUX_V8__"));
  return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("");
};

const toBase64=(f)=>new Promise((r,j)=>{const fr=new FileReader();fr.onload=e=>r(e.target.result);fr.onerror=j;fr.readAsDataURL(f);});
const readText=(f)=>new Promise((r,j)=>{const fr=new FileReader();fr.onload=e=>r(e.target.result);fr.onerror=j;fr.readAsText(f);});

function App() {
  const [screen,setScreen]=useState("loading");
  const [isStandalone,setIsStandalone]=useState(false);
  const [installPrompt,setInstallPrompt]=useState(null);
  const [showInstallBanner,setShowInstallBanner]=useState(false);
  const [showPWAModal,setShowPWAModal]=useState(false);
  const [ukeyInput,setUkeyInput]=useState("");
  const [loginError,setLoginError]=useState("");
  const [userId,setUserId]=useState("");
  const [userName,setUserName]=useState("");
  const [loginMethod,setLoginMethod]=useState("");
  const [isPremium,setIsPremium]=useState(false);
  const [premiumVersion,setPremiumVersion]=useState("");
  const [premiumExpiry,setPremiumExpiry]=useState(null);
  const [useCase,setUseCase]=useState(null);
  const [showOnboard,setShowOnboard]=useState(false);
  const [onboardStep,setOnboardStep]=useState(0);
  const [messages,setMessages]=useState([]);
  const [chats,setChats]=useState([]);
  const [activeChat,setActiveChat]=useState(null);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [model,setModel]=useState("claude");
  const [modelMenu,setModelMenu]=useState(false);
  const [attachments,setAttachments]=useState([]);
  const [listening,setListening]=useState(false);
  const [followUps,setFollowUps]=useState([]);
  const [memory,setMemory]=useState([]);
  const [geminiKey,setGeminiKey]=useState("");
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [activeCat,setActiveCat]=useState("all");
  const [showSettings,setShowSettings]=useState(false);
  const [showPremium,setShowPremium]=useState(false);
  const [premiumCode,setPremiumCode]=useState("");
  const [premiumErr,setPremiumErr]=useState("");
  const [imagePanel,setImagePanel]=useState(false);
  const [imagePrompt,setImagePrompt]=useState("");
  const [genImages,setGenImages]=useState([]);
  const [fontSize,setFontSize]=useState(14);
  const [activeFeature,setActiveFeature]=useState(null);
  const [fInput,setFInput]=useState("");
  const [fInput2,setFInput2]=useState("");
  const [fResult,setFResult]=useState("");
  const [fLoading,setFLoading]=useState(false);
  const [fFile,setFFile]=useState(null);
  const [toast,setToast]=useState({msg:"",type:"ok"});
  const [customInstr,setCustomInstr]=useState("");
  const [compareMode,setCompareMode]=useState(false);
  const [compareResult,setCompareResult]=useState({claude:"",gemini:""});
  const [canvasContent,setCanvasContent]=useState("");
  const [showCanvas,setShowCanvas]=useState(false);

  const bottomRef=useRef();
  const fileRef=useRef();
  const fFileRef=useRef();
  const recRef=useRef();
  const inputRef=useRef();

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);

  const notify=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast({msg:"",type:"ok"}),3000);};

  useEffect(()=>{
    const sa=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone||false;
    setIsStandalone(sa);
    const h=e=>{e.preventDefault();setInstallPrompt(e);window._fizuxInstall=e;if(!sa)setShowInstallBanner(true);};
    window.addEventListener('beforeinstallprompt',h);
    window.addEventListener('appinstalled',()=>{setShowInstallBanner(false);notify("✅ FIZUX installed!");});
    return()=>window.removeEventListener('beforeinstallprompt',h);
  },[]);

  useEffect(()=>{
    (async()=>{
      try{
        const mem=await window.storage.get("fizux:memory").catch(()=>null);if(mem)setMemory(JSON.parse(mem.value));
        const gk=await window.storage.get("fizux:gemini").catch(()=>null);if(gk)setGeminiKey(gk.value);
        const ci=await window.storage.get("fizux:ci").catch(()=>null);if(ci)setCustomInstr(ci.value);
        const fs=await window.storage.get("fizux:fs").catch(()=>null);if(fs)setFontSize(parseInt(fs.value));
      }catch{}
    })();
  },[]);

  useEffect(()=>{
    (async()=>{
      try{
        const s=await window.storage.get(SESSION).catch(()=>null);
        if(s){
          const{uid,name,method}=JSON.parse(s.value);
          const bl=await window.storage.get(`fizux:blocked:${uid}`,true).catch(()=>null);
          if(bl&&JSON.parse(bl.value).blocked){setScreen("login");return;}
          setUserId(uid);setUserName(name);setLoginMethod(method);
          const cd=await window.storage.get(`fizux:chats:${uid}`).catch(()=>null);if(cd)setChats(JSON.parse(cd.value));
          const uc=await window.storage.get(`fizux:uc:${uid}`).catch(()=>null);
          if(uc)setUseCase(uc.value);else setShowOnboard(true);
          const pd=await window.storage.get(`fizux:premium:${uid}`).catch(()=>null);
          if(pd){const p=JSON.parse(pd.value);if(p.expiry==="lifetime"||new Date(p.expiry)>new Date()){setIsPremium(true);setPremiumVersion(p.version);setPremiumExpiry(p.expiry);}}
          setScreen("chat");
          if(!window.matchMedia('(display-mode: standalone)').matches&&!sessionStorage.getItem("pwa_shown")){
            sessionStorage.setItem("pwa_shown","1");
            setTimeout(()=>setShowPWAModal(true),3000);
          }
          return;
        }
        setScreen("login");
      }catch{setScreen("login");}
    })();
  },[]);

  const loginGoogle=async()=>{
    const uid="google_"+Date.now();
    await doLogin({uid,name:"Google User",email:"user@gmail.com",method:"google"});
    notify("✓ Signed in!");
  };

  const loginUkey=async()=>{
    const key=ukeyInput.trim().toUpperCase();
    if(!key){setLoginError("Enter Ukey");return;}
    setLoginError("");
    try{
      const d=await window.storage.get(`afzux:ukey:${key}`,true).catch(()=>null);
      if(!d){setLoginError("Invalid Ukey");return;}
      const uk=JSON.parse(d.value);
      if(uk.blocked){setLoginError("Ukey blocked");return;}
      if(uk.expiry!=="never"&&new Date(uk.expiry)<new Date()){setLoginError("Ukey expired");return;}
      const uid=`ukey_${key}`;
      uk.used=true;uk.lastLogin=new Date().toISOString();
      await window.storage.set(`afzux:ukey:${key}`,JSON.stringify(uk),true);
      if(uk.version&&uk.version!=="free"){
        const pd={version:uk.version,expiry:uk.expiry==="never"?"lifetime":uk.expiry,activatedAt:new Date().toISOString()};
        await window.storage.set(`fizux:premium:${uid}`,JSON.stringify(pd));
        setIsPremium(true);setPremiumVersion(uk.version);setPremiumExpiry(pd.expiry);
      }
      await doLogin({uid,name:uk.label||"FIZUX User",method:"ukey"});
    }catch(e){setLoginError("Error. Try again.");}
  };

  const doLogin=async(u)=>{
    setUserId(u.uid);setUserName(u.name);setLoginMethod(u.method);
    await window.storage.set(SESSION,JSON.stringify(u));
    const cd=await window.storage.get(`fizux:chats:${u.uid}`).catch(()=>null);if(cd)setChats(JSON.parse(cd.value));
    const uc=await window.storage.get(`fizux:uc:${u.uid}`).catch(()=>null);
    if(uc)setUseCase(uc.value);else setShowOnboard(true);
    await window.storage.set(`fizux:user:${u.uid}`,JSON.stringify({uid:u.uid,name:u.name,method:u.method,lastLogin:new Date().toISOString()}),true).catch(()=>{});
    setUkeyInput("");
    setScreen("chat");
    if(!window.matchMedia('(display-mode: standalone)').matches&&!sessionStorage.getItem("pwa_shown")){
      sessionStorage.setItem("pwa_shown","1");
      setTimeout(()=>setShowPWAModal(true),2500);
    }
  };

  const logout=async()=>{
    await window.storage.delete(SESSION).catch(()=>{});
    setUserId("");setUserName("");setMessages([]);setChats([]);setIsPremium(false);
    setScreen("login");
  };

  const activatePremium=async()=>{
    if(!premiumCode.trim())return;setPremiumErr("");
    try{
      const d=await window.storage.get(`afzux:code:${premiumCode.trim().toUpperCase()}`,true).catch(()=>null);
      if(!d){setPremiumErr("Invalid code");return;}
      const c=JSON.parse(d.value);
      if(c.used){setPremiumErr("Already used");return;}
      if(c.expiry!=="never"&&new Date(c.expiry)<new Date()){setPremiumErr("Expired");return;}
      let expiry=c.durationDays===-1?"lifetime":(()=>{const n=new Date();n.setDate(n.getDate()+c.durationDays);return n.toISOString();})();
      c.used=true;c.usedBy=userId;c.usedAt=new Date().toISOString();
      await window.storage.set(`afzux:code:${premiumCode.trim().toUpperCase()}`,JSON.stringify(c),true);
      const pd={version:c.version,expiry,activatedAt:new Date().toISOString()};
      await window.storage.set(`fizux:premium:${userId}`,JSON.stringify(pd));
      setIsPremium(true);setPremiumVersion(c.version);setPremiumExpiry(expiry);
      setShowPremium(false);setPremiumCode("");notify(`✦ ${c.version} activated!`);
    }catch{setPremiumErr("Error");}
  };

  const checkAccess=(fId)=>{
    const f=FEATURES.find(f=>f.id===fId);
    if(!f||f.free||isPremium)return true;
    setShowPremium(true);return false;
  };

  const getLabel=()=>{
    if(!isPremium)return null;
    if(premiumExpiry==="lifetime")return"∞";
    return`${Math.ceil((new Date(premiumExpiry)-new Date())/86400000)}d`;
  };

  const callClaude=async(msgs,sys="",search=true)=>{
    const tools=search?[{type:"web_search_20250305",name:"web_search"}]:[];
    const res=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
        system:sys||`You are FIZUX AI — helpful assistant. ${customInstr}`,
        ...(tools.length > 0 ? {tools: tools} : {}), messages: msgs
      })
    });
    const data=await res.json();
    let reply="",searched=false;
    for(const b of(data.content||[])){if(b.type==="text")reply+=b.text;if(b.type==="tool_use")searched=true;}
    return{reply:reply||"No response.",searched};
  };

  const callGemini=async(msgs)=>{
    if(!geminiKey){notify("Add Gemini key in settings","err");return{reply:"",searched:false};}
    const contents=msgs.slice(-20).map(m=>({role:m.role==="user"?"user":"model",parts:[{text:typeof m.content==="string"?m.content:"[content]"}]}));
    const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents,generationConfig:{maxOutputTokens:1000}})});
    const data=await res.json();
    return{reply:data.candidates?.[0]?.content?.parts?.[0]?.text||"No response.",searched:false};
  };

  const genFollowUps=async(reply)=>{
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:80,messages:[{role:"user",content:`3 short follow-up questions for: "${reply.slice(0,150)}". JSON array only.`}]})});
      const data=await res.json();
      const qs=JSON.parse((data.content?.[0]?.text||"[]").replace(/```json|```/g,"").trim());
      setFollowUps(Array.isArray(qs)?qs.slice(0,3):[]);
    }catch{setFollowUps([]);}
  };

  const send=async()=>{
    if((!input.trim()&&!attachments.length)||loading)return;
    const userText=input.trim()||"Analyze";
    if(compareMode){
      setLoading(true);setCompareResult({claude:"Loading...",gemini:"Loading..."});
      const msgs=[{role:"user",content:userText}];
      const[cr,gr]=await Promise.all([callClaude(msgs),callGemini(msgs)]);
      setCompareResult({claude:cr.reply,gemini:gr.reply});
      setInput("");setLoading(false);return;
    }
    const parts=[];
    for(const att of attachments){
      if(att.type==="image"){parts.push({type:"image",source:{type:"base64",media_type:att.mediaType,data:att.data.split(",")[1]}});parts.push({type:"text",text:`[Image: ${att.name}]`});}
      else parts.push({type:"text",text:`[FILE: ${att.name}]\n${att.data}\n`});
    }
    parts.push({type:"text",text:userText});
    const display=attachments.length>0?`${attachments.map(a=>`↑ ${a.name}`).join(" · ")}\n${userText}`:userText;
    const userMsg={role:"user",content:display,_api:parts.length>1?parts:userText,ts:Date.now()};
    const newMsgs=[...messages,userMsg];
    setMessages(newMsgs);setInput("");setAttachments([]);setFollowUps([]);setLoading(true);
    try{
      let result;
      const apiMsgs=newMsgs.slice(-30).map(m=>({role:m.role,content:m._api||m.content}));
      if(model==="gemini")result=await callGemini(apiMsgs);
      else if(model==="deep"){
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Think step by step for: "${userText}"\n\n<thinking>\nStep 1:[thought]\nStep 2:[analysis]\nStep 3:[conclusion]\n</thinking>\n<answer>[Final answer]</answer>`}]})});
        const data=await res.json();const full=data.content?.[0]?.text||"";
        const am=full.match(/<answer>([\s\S]*?)<\/answer>/);
        result={reply:am?am[1].trim():full,searched:false};
      }
      else result=await callClaude(apiMsgs);
      if(result.reply.includes("```"))setCanvasContent(result.reply);
      const final=[...newMsgs,{role:"assistant",content:result.reply,searched:result.searched,model,ts:Date.now()}];
      setMessages(final);genFollowUps(result.reply);
      const chatId=activeChat||Date.now().toString();if(!activeChat)setActiveChat(chatId);
      const s={id:chatId,title:userText.slice(0,50),date:new Date().toLocaleDateString(),messages:final.map(m=>({...m,_api:undefined}))};
      const updated=[s,...chats.filter(c=>c.id!==chatId)].slice(0,50);setChats(updated);
      await window.storage.set(`fizux:chats:${userId}`,JSON.stringify(updated)).catch(()=>{});
    }catch(e){setMessages([...newMsgs,{role:"assistant",content:"Connection error. Check your API key and try again.",model}]);}
    setLoading(false);
  };

  const startVoice=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR)return notify("Voice not supported","err");
    const r=new SR();r.lang="en-US";r.continuous=true;r.interimResults=false;
    r.onstart=()=>setListening(true);
    r.onend=()=>setListening(false);
    r.onresult=e=>{let f="";for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)f+=e.results[i][0].transcript;}if(f)setInput(p=>p+f);};
    r.onerror=()=>setListening(false);
    recRef.current=r;r.start();
  };
  const stopVoice=()=>{recRef.current?.stop();setListening(false);};

  const newChat=async()=>{
    if(messages.length){
      const s={id:activeChat||Date.now().toString(),title:messages[0].content.slice(0,50),date:new Date().toLocaleDateString(),messages:messages.map(m=>({...m,_api:undefined}))};
      const u=[s,...chats.filter(c=>c.id!==s.id)].slice(0,50);setChats(u);
      await window.storage.set(`fizux:chats:${userId}`,JSON.stringify(u)).catch(()=>{});
    }
    setMessages([]);setActiveChat(null);setSidebarOpen(false);setActiveFeature(null);
    setFResult("");setFInput("");setFInput2("");setFFile(null);setFollowUps([]);
    inputRef.current?.focus();
  };

  const deleteChat=async(id)=>{
    const u=chats.filter(c=>c.id!==id);setChats(u);
    await window.storage.set(`fizux:chats:${userId}`,JSON.stringify(u)).catch(()=>{});
    if(activeChat===id){setMessages([]);setActiveChat(null);}
  };

  const processFile=async(file,ff=false)=>{
    const ext=file.name.split(".").pop().toLowerCase();
    if(["jpg","jpeg","png","gif","webp"].includes(ext)){
      const b64=await toBase64(file);
      if(ff){setFInput(b64);setFFile(file.name);}
      else setAttachments(p=>[...p,{type:"image",name:file.name,data:b64,mediaType:file.type}]);
      notify(`↑ ${file.name}`);
    } else {
      const text=await readText(file).catch(()=>"[Error]");
      if(ff){setFInput(text.slice(0,10000));setFFile(file.name);}
      else setAttachments(p=>[...p,{type:"text",name:file.name,data:text.slice(0,10000)}]);
      notify(`↑ ${file.name}`);
    }
  };

  const PROMPTS={
    excel:(i)=>`Data analyst. Analyze:\n${i}\n\n1.KEY METRICS\n2.TRENDS\n3.INSIGHTS\n4.RECOMMENDATIONS`,
    pdf:(i,i2)=>`Document:\n${i}\n\nSummary, key points. Q:"${i2||"General"}"`,
    email:(i,i2)=>`Professional email:\nContext:${i}\nTone:${i2||"Professional"}\n\nSubject x3, Body, Closing.`,
    resume:(i)=>`ATS resume:\n${i}\n\nContact, Summary, Experience, Skills, Education, Keywords`,
    invoice:(i)=>`Invoice:\n${i}\nInvoice#, Items, Tax 18%, Total.`,
    report:(i)=>`Report:\n${i}\nSummary, findings, recommendations.`,
    meeting:(i)=>`Meeting minutes:\n${i}\nDecisions, action items, next steps.`,
    contract:(i)=>`Contract:\n${i}\nType, parties, RISKS🚨, recommendations.`,
    bizplan:(i)=>`Business plan:${i}\n\nSummary, market, model, financials.`,
    ocr:()=>`Extract ALL text from this image exactly as written.`,
    sql:(i,i2)=>`SQL for:"${i}" (${i2||"MySQL"})\n1.QUERY\n2.EXPLANATION\n3.OPTIMIZED`,
    formula:(i,i2)=>`Formula for:"${i}" in ${i2||"Excel"}\n1.FORMULA\n2.HOW IT WORKS\n3.EXAMPLE`,
    imagegen:(i)=>`3 detailed image generation prompts for:"${i}". Each 40+ words, with style & mood.`,
    story:(i,i2)=>`${i2||"Short"} story:"${i}"\nHook, character, conflict, climax, resolution.`,
    caption:(i,i2)=>`5 viral ${i2||"Instagram"} captions:"${i}". Vary tones: funny, inspiring, emotional.`,
    hashtag:(i,i2)=>`Hashtags:"${i}" (${i2||"Instagram"})\n1.HIGH-REACH(5)\n2.MEDIUM(10)\n3.NICHE(10)`,
    linkedin:(i)=>`LinkedIn post:"${i}"\nHook, story, 3 lessons, takeaway, question.`,
    math:(i)=>`Solve step by step:\n${i}\n1.FORMULA\n2.STEPS\n3.ANSWER\n4.VERIFY`,
    quiz:(i,i2)=>`${i2||"10"} question quiz:"${i}"\nEach: question, 4 options (A/B/C/D), correct answer, explanation.`,
    flash:(i,i2)=>`${i2||"15"} flashcards:"${i}"\nFRONT: [term] | BACK: [definition + memory tip]`,
    essay:(i,i2)=>`${i2||"Academic"} essay:"${i}"\nIntro, body x3, conclusion, references.`,
    health:(i)=>`Wellness info:"${i}"\nGeneral info, lifestyle tips, when to see doctor. (Not medical advice)`,
    travel:(i,i2)=>`Trip:"${i}" for ${i2||"3 days"}\nDay-by-day: activities, food, budget, tips.`,
    workout:(i,i2)=>`Workout plan:"${i}" level:${i2||"beginner"}\nWeekly schedule with sets, reps, rest.`,
    support:(i)=>`You are a caring, empathetic AI like Pi. User says:"${i}"\nRespond with empathy, validate feelings, ask caring follow-up.`,
    goals:(i)=>`SMART goal plan:"${i}"\n1.DEFINITION\n2.MILESTONES\n3.WEEKLY STEPS\n4.OBSTACLES & SOLUTIONS`,
    factcheck:(i)=>`Fact-check:"${i}"\n1.VERDICT (True/False/Partial)\n2.EVIDENCE FOR\n3.EVIDENCE AGAINST\n4.CONCLUSION`,
    deepthink:(i)=>`Deep reasoning:"${i}"\n\nAnalyze from multiple angles, step by step.`,
    translate:(i,i2)=>`Translate to ${i2||"Hindi"}:\n${i}`,
    ytsum:(i)=>`Search and summarize YouTube video:${i}\nMain points, key takeaways, value rating.`,
    memory:()=>``,
  };

  const runFeature=async(fId,i1,i2="")=>{
    if(!checkAccess(fId))return;
    setFLoading(true);setFResult("");
    try{
      const promptFn=PROMPTS[fId];if(!promptFn){setFLoading(false);return;}
      const prompt=promptFn(i1,i2);
      const isImg=i1&&typeof i1==="string"&&i1.startsWith("data:image");
      const needSearch=["ytsum","factcheck","travel"].includes(fId);
      const msgs=isImg&&fId==="ocr"
        ?[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:i1.split(",")[1]}},{type:"text",text:"Extract ALL text exactly."}]}]
        :[{role:"user",content:prompt}];
      const{reply}=await callClaude(msgs,"You are FIZUX expert AI. Be thorough and professional.",needSearch);
      setFResult(reply);
    }catch(e){notify("Error — check internet connection","err");}
    setFLoading(false);
  };

  const currentUC=USE_CASES.find(u=>u.id===useCase);
  const displayFeatures=activeCat==="all"?FEATURES:FEATURES.filter(f=>f.cat===activeCat);

  const S={
    inp:(x={})=>({background:C.card,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.text,fontSize,fontFamily:"'DM Sans',system-ui",outline:"none",width:"100%",boxSizing:"border-box",...x}),
    btnGold:(x={})=>({padding:"12px 18px",borderRadius:12,border:"none",background:C.gold,color:"#1A1000",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",boxShadow:C.shadowGold,...x}),
    btnGhost:(x={})=>({padding:"7px 12px",borderRadius:9,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit",...x}),
    card:(x={})=>({background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:14,...x}),
    badge:(col,x={})=>({background:col+"20",color:col,border:`1px solid ${col}40`,borderRadius:7,padding:"2px 8px",fontSize:11,fontWeight:600,display:"inline-block",fontFamily:"'DM Sans',system-ui",...x}),
  };

  const ce=(tag,props,...children)=>React.createElement(tag,props,...children);

  const Toast=()=>toast.msg?ce("div",{style:{position:"fixed",top:isStandalone?52:20,left:"50%",transform:"translateX(-50%)",background:C.card,border:`1.5px solid ${toast.type==="err"?C.red+"60":C.green+"60"}`,borderRadius:11,padding:"9px 18px",fontSize:13,zIndex:9999,color:toast.type==="err"?C.red:C.green,boxShadow:C.shadowLg,whiteSpace:"nowrap",fontWeight:500,fontFamily:"'DM Sans',system-ui"}},toast.msg):null;

  const PWAModal=()=>ce("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}},
    ce("div",{style:{...S.card({padding:24,borderRadius:22,maxWidth:340,width:"100%"}),boxShadow:C.shadowLg}},
      ce("div",{style:{textAlign:"center",marginBottom:18}},
        ce("div",{style:{width:68,height:68,borderRadius:22,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:30,color:"#1A1000",margin:"0 auto 12px",boxShadow:C.shadowGold}},"F"),
        ce("div",{style:{fontWeight:800,fontSize:19,color:C.text,marginBottom:4}},"Install FIZUX"),
        ce("div",{style:{fontSize:12,color:C.muted}},"Add to home screen for app experience")
      ),
      installPrompt?ce("button",{onClick:async()=>{installPrompt.prompt();const{outcome}=await installPrompt.userChoice;if(outcome==="accepted"){setShowPWAModal(false);notify("✅ FIZUX installed!");}},style:S.btnGold({width:"100%",borderRadius:13,padding:13,marginBottom:10})},"📲 Install FIZUX Now")
      :ce("div",{style:{...S.card({padding:13,marginBottom:10})}},
        ce("div",{style:{fontSize:11,color:C.accent,fontWeight:700,marginBottom:7}},"ANDROID — Chrome"),
        ce("div",{style:{fontSize:12,color:C.muted,lineHeight:1.8}},"1. Tap ⋮ menu\n2. Tap \"Add to Home screen\"\n3. Tap \"Add\""),
        ce("div",{style:{fontSize:11,color:C.accent,fontWeight:700,margin:"10px 0 7px"}},"iPHONE — Safari only"),
        ce("div",{style:{fontSize:12,color:C.muted,lineHeight:1.8}},"1. Tap Share button ↑\n2. \"Add to Home Screen\"\n3. Tap \"Add\"")
      ),
      ce("button",{onClick:()=>setShowPWAModal(false),style:S.btnGhost({width:"100%",textAlign:"center"})},"Maybe later")
    )
  );

  const renderMsg=(msg,i)=>ce("div",{key:i,style:{padding:"14px 0",borderBottom:`1px solid ${C.border}15`}},
    ce("div",{style:{maxWidth:700,margin:"0 auto",padding:"0 14px"}},
      ce("div",{style:{display:"flex",gap:10,alignItems:"flex-start"}},
        ce("div",{style:{width:32,height:32,borderRadius:"50%",background:msg.role==="user"?C.gold:C.gradGreen,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#1A1000",flexShrink:0}},(msg.role==="user"?(userName||"U").charAt(0).toUpperCase():"F")),
        ce("div",{style:{flex:1,minWidth:0}},
          ce("div",{style:{fontSize:12,fontWeight:700,marginBottom:4,color:C.text,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}},
            msg.role==="user"?userName:"FIZUX",
            msg.searched&&ce("span",{style:S.badge(C.green,{fontSize:9})},"⊕ Web"),
            msg.ts&&ce("span",{style:{fontSize:10,color:C.dim}},new Date(msg.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))
          ),
          ce("div",{style:{fontSize,color:C.text,lineHeight:1.8,whiteSpace:"pre-wrap",wordBreak:"break-word"}},msg.content),
          msg.role==="assistant"&&ce("div",{style:{display:"flex",gap:4,marginTop:7}},
            ce("button",{onClick:()=>navigator.clipboard.writeText(msg.content).then(()=>notify("Copied!")),style:{...S.btnGhost({padding:"3px 9px",fontSize:11,borderRadius:6})}},"Copy"),
            ce("button",{onClick:()=>{const u=new SpeechSynthesisUtterance(msg.content.slice(0,300));window.speechSynthesis.speak(u);},style:{...S.btnGhost({padding:"3px 9px",fontSize:11,borderRadius:6})}},"▷ Read"),
            ce("button",{onClick:()=>{setCanvasContent(msg.content);setShowCanvas(true);},style:{...S.btnGhost({padding:"3px 9px",fontSize:11,borderRadius:6})}},"⊞ Canvas")
          )
        )
      )
    )
  );

  if(screen==="loading")return ce("div",{style:{height:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',system-ui"}},
    ce("div",{style:{textAlign:"center"}},
      ce("div",{style:{width:76,height:76,borderRadius:26,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:34,color:"#1A1000",margin:"0 auto 16px",boxShadow:C.shadowGold,animation:"float 2s ease-in-out infinite"}},"F"),
      ce("div",{style:{fontSize:24,fontWeight:900,color:C.text,letterSpacing:-1,marginBottom:6}},"FIZUX"),
      ce("div",{style:{fontSize:12,color:C.muted,marginBottom:18}},BRAND.tagline),
      ce("div",{style:{display:"flex",gap:8,justifyContent:"center"}},
        [0,1,2].map(i=>ce("div",{key:i,style:{width:8,height:8,borderRadius:"50%",background:C.accent,animation:`bounce 1.2s infinite`,animationDelay:`${i*0.2}s`}}))
      )
    ),
    ce("style",null,`
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes bounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-6px);opacity:1}}
    `)
  );

  if(screen==="login")return ce("div",{style:{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'DM Sans',system-ui",paddingTop:isStandalone?"52px":"20px"}},
    ce(Toast),
    showPWAModal&&ce(PWAModal),
    ce("div",{style:{width:"100%",maxWidth:400}},
      ce("div",{style:{textAlign:"center",marginBottom:28}},
        ce("div",{style:{width:76,height:76,borderRadius:26,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:34,color:"#1A1000",margin:"0 auto 14px",boxShadow:C.shadowGold}},"F"),
        ce("div",{style:{fontWeight:900,fontSize:26,color:C.text,letterSpacing:-1,marginBottom:5}},"FIZUX"),
        ce("div",{style:{fontSize:13,color:C.muted}},BRAND.tagline),
        isStandalone&&ce("div",{style:{marginTop:7,...S.badge(C.green,{display:"inline-block",fontSize:11})}},"◎ Installed as App")
      ),
      ce("div",{style:{...S.card({padding:26,borderRadius:22}),boxShadow:C.shadowLg}},
        ce("button",{onClick:loginGoogle,style:{width:"100%",padding:"13px 18px",borderRadius:13,border:`1.5px solid ${C.border}`,background:C.surface,color:C.text,fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:18}},
          ce("svg",{width:20,height:20,viewBox:"0 0 24 24"},
            ce("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),
            ce("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),
            ce("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"}),
            ce("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"})
          ),
          "Continue with Google"
        ),
        ce("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:16}},
          ce("div",{style:{flex:1,height:1,background:C.border}}),
          ce("span",{style:{fontSize:11,color:C.dim}},"or Ukey"),
          ce("div",{style:{flex:1,height:1,background:C.border}})
        ),
        ce("input",{value:ukeyInput,onChange:e=>{setUkeyInput(e.target.value.toUpperCase());setLoginError("");},onKeyDown:e=>e.key==="Enter"&&loginUkey(),placeholder:"Enter your Ukey",style:{...S.inp({fontFamily:"monospace",letterSpacing:2,textAlign:"center",fontSize:13,padding:14,marginBottom:loginError?4:12,borderColor:loginError?C.red:C.border})}}),
        loginError&&ce("div",{style:{color:C.red,fontSize:12,textAlign:"center",marginBottom:12}},loginError),
        ce("button",{onClick:loginUkey,style:S.btnGold({width:"100%",padding:14,borderRadius:13,fontSize:14})},"Continue →"),
        ce("div",{style:{marginTop:14,padding:"9px 12px",background:C.green+"10",borderRadius:10,border:`1px solid ${C.green}25`,textAlign:"center"}},
          ce("div",{style:{fontSize:12,color:C.green,fontWeight:600}},"◎ v1.0 & v2.0 completely FREE"),
          ce("div",{style:{fontSize:11,color:C.muted,marginTop:2}},"Sign in with Google to start")
        ),
        !isStandalone&&ce("button",{onClick:()=>setShowPWAModal(true),style:{width:"100%",padding:"9px 0",background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:13,marginTop:12,fontFamily:"inherit",fontWeight:600}},"📲 Install FIZUX as App")
      )
    ),
    ce("style",null,"*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}body{margin:0;}")
  );

  return ce("div",{
    style:{height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'DM Sans',system-ui",color:C.text,overflow:"hidden",paddingTop:isStandalone?"44px":"0"},
    onDrop:e=>{e.preventDefault();Array.from(e.dataTransfer.files).forEach(f=>processFile(f));},
    onDragOver:e=>e.preventDefault()
  },
    ce(Toast),
    showPWAModal&&ce(PWAModal),

    // Onboarding
    showOnboard&&ce("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:18}},
      ce("div",{style:{...S.card({padding:24,borderRadius:22,maxWidth:440,width:"100%",maxHeight:"88vh",overflowY:"auto"})},boxShadow:C.shadowLg},
        onboardStep===0?ce(React.Fragment,null,
          ce("div",{style:{textAlign:"center",marginBottom:18}},
            ce("div",{style:{fontSize:34,marginBottom:8}},"◎"),
            ce("div",{style:{fontWeight:800,fontSize:19,marginBottom:4}},`Welcome, ${userName}!`),
            ce("div",{style:{fontSize:12,color:C.muted}},"How will you use FIZUX?")
          ),
          ce("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}},
            USE_CASES.map(uc=>ce("button",{key:uc.id,onClick:()=>setUseCase(uc.id),style:{padding:"13px 11px",borderRadius:14,border:`2px solid ${useCase===uc.id?uc.color:C.border}`,background:useCase===uc.id?uc.color+"12":C.surface,cursor:"pointer",textAlign:"left"}},
              ce("div",{style:{fontSize:18,marginBottom:4}},uc.icon),
              ce("div",{style:{fontSize:12,fontWeight:700,color:useCase===uc.id?uc.color:C.text,marginBottom:2}},uc.title),
              ce("div",{style:{fontSize:10,color:C.muted}},uc.desc)
            ))
          ),
          useCase&&ce("button",{onClick:()=>setOnboardStep(1),style:S.btnGold({width:"100%",borderRadius:13,padding:12,fontSize:13})},"Continue →"),
          ce("button",{onClick:async()=>{await window.storage.set(`fizux:uc:${userId}`,"general").catch(()=>{});setShowOnboard(false);},style:{width:"100%",padding:"9px 0",background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12,marginTop:8,fontFamily:"inherit"}},"Skip")
        ):ce(React.Fragment,null,
          ce("div",{style:{textAlign:"center",marginBottom:16}},
            ce("div",{style:{fontSize:30,marginBottom:6}},currentUC?.icon),
            ce("div",{style:{fontWeight:800,fontSize:18}},currentUC?.title)
          ),
          ce("button",{onClick:async()=>{await window.storage.set(`fizux:uc:${userId}`,useCase).catch(()=>{});setShowOnboard(false);notify("✓ Welcome to FIZUX!");},style:{...S.btnGold({width:"100%",borderRadius:13,padding:12,marginBottom:8}),background:currentUC?.color}},`◎ Start with ${currentUC?.title}`),
          ce("button",{onClick:()=>setOnboardStep(0),style:S.btnGhost({width:"100%",textAlign:"center"})},"← Change")
        )
      )
    ),

    // Premium Modal
    showPremium&&ce("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:18}},
      ce("div",{style:{...S.card({padding:24,borderRadius:22,maxWidth:360,width:"100%"}),boxShadow:C.shadowLg}},
        isPremium?ce(React.Fragment,null,
          ce("div",{style:{textAlign:"center",marginBottom:14}},ce("div",{style:{fontSize:42,marginBottom:8}},"✦"),ce("div",{style:{fontWeight:800,fontSize:19,color:C.accent}},premiumVersion),ce("span",{style:S.badge(C.green,{marginTop:6,display:"inline-block",fontSize:11})},premiumExpiry==="lifetime"?"∞ Lifetime":`${getLabel()} remaining`)),
          ce("button",{onClick:()=>setShowPremium(false),style:S.btnGold({width:"100%",borderRadius:13,padding:12})},"Continue")
        ):ce(React.Fragment,null,
          ce("div",{style:{textAlign:"center",marginBottom:18}},ce("div",{style:{fontSize:38,marginBottom:8}},"◈"),ce("div",{style:{fontWeight:800,fontSize:19}},isPremium?"Premium Active":"Unlock Premium"),ce("div",{style:{fontSize:12,color:C.muted,marginTop:4}},"Enter code from AFZUX app")),
          ce("input",{value:premiumCode,onChange:e=>{setPremiumCode(e.target.value.toUpperCase());setPremiumErr("");},onKeyDown:e=>e.key==="Enter"&&activatePremium(),placeholder:"20-digit activation code",style:{...S.inp({textAlign:"center",letterSpacing:2,fontSize:12,marginBottom:premiumErr?4:12,fontFamily:"monospace"})}}),
          premiumErr&&ce("div",{style:{color:C.red,fontSize:12,textAlign:"center",marginBottom:12}},premiumErr),
          ce("button",{onClick:activatePremium,style:S.btnGold({width:"100%",borderRadius:13,padding:12,marginBottom:8})},"✦ Activate Premium"),
          ce("button",{onClick:()=>setShowPremium(false),style:S.btnGhost({width:"100%",textAlign:"center"})},"Cancel")
        )
      )
    ),

    // Feature Modal
    activeFeature&&ce("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:12,paddingBottom:isStandalone?"28px":"12px"}},
      ce("div",{style:{...S.card({padding:20,borderRadius:20,maxWidth:500,width:"100%",maxHeight:"82vh",overflowY:"auto"}),boxShadow:C.shadowLg}},
        ce("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
          ce("div",{style:{fontWeight:800,fontSize:16}},`${FEATURES.find(f=>f.id===activeFeature)?.icon} ${FEATURES.find(f=>f.id===activeFeature)?.label}`),
          ce("button",{onClick:()=>{setActiveFeature(null);setFResult("");setFInput("");setFInput2("");setFFile(null);},style:{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:22}},"✕")
        ),
        ce("input",{ref:fFileRef,type:"file",onChange:e=>processFile(e.target.files[0],true),style:{display:"none"},accept:"image/*,.txt,.csv,.json,.pdf,.docx,.xlsx"}),
        ["excel","pdf","ocr","meeting","contract"].includes(activeFeature)&&ce("button",{onClick:()=>fFileRef.current?.click(),style:{...S.btnGhost({width:"100%",marginBottom:8,color:fFile?C.green:C.muted,borderColor:fFile?C.green:C.border})}},"↑ "+(fFile?`✓ ${fFile}`:"Upload File")),
        ce("textarea",{value:fInput,onChange:e=>setFInput(e.target.value),placeholder:activeFeature==="support"?"Tell me what's on your mind...":"Describe your requirement...",rows:3,style:{...S.inp({resize:"vertical",lineHeight:1.6,marginBottom:8})}}),
        ce("input",{value:fInput2,onChange:e=>setFInput2(e.target.value),placeholder:"Additional detail (optional)",style:{...S.inp({marginBottom:10})}}),
        ce("button",{onClick:()=>runFeature(activeFeature,fInput,fInput2),disabled:fLoading||(!fInput.trim()&&!fFile),style:{...S.btnGold({width:"100%",borderRadius:12,padding:12,marginBottom:fResult?10:0,opacity:(!fInput.trim()&&!fFile)?0.6:1})},},fLoading?"⚡ Processing...":FEATURES.find(f=>f.id===activeFeature)?.label+" →"),
        fResult&&ce(React.Fragment,null,
          ce("div",{style:{...S.card({padding:13}),fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",maxHeight:220,overflowY:"auto"}},fResult),
          ce("div",{style:{display:"flex",gap:7,marginTop:8}},
            ce("button",{onClick:()=>{setInput(fResult);setActiveFeature(null);setFResult("");},style:S.btnGold({flex:1,fontSize:12,borderRadius:11,padding:9})},"→ Send to Chat"),
            ce("button",{onClick:()=>navigator.clipboard.writeText(fResult).then(()=>notify("Copied!")),style:S.btnGhost({flex:1,fontSize:12,borderRadius:11,padding:9})},"Copy"),
            ce("button",{onClick:()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([fResult],{type:"text/plain"}));a.download=`FIZUX_${activeFeature}_${Date.now()}.txt`;a.click();},style:S.btnGhost({fontSize:12,padding:"9px 11px",borderRadius:11})},"↓")
          )
        )
      )
    ),

    // Canvas
    showCanvas&&ce("div",{style:{position:"fixed",right:0,top:0,bottom:0,width:Math.min(440,window.innerWidth*0.9),background:C.surface,border:`1px solid ${C.border}`,borderRadius:"20px 0 0 20px",zIndex:150,display:"flex",flexDirection:"column",boxShadow:C.shadowLg}},
      ce("div",{style:{padding:"13px 15px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}},
        ce("div",{style:{flex:1,fontWeight:700}},"⊞ Canvas"),
        ce("button",{onClick:()=>navigator.clipboard.writeText(canvasContent).then(()=>notify("Copied!")),style:S.btnGhost({fontSize:11,padding:"5px 9px"})},"Copy"),
        ce("button",{onClick:()=>setShowCanvas(false),style:{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:20}},"✕")
      ),
      ce("textarea",{value:canvasContent,onChange:e=>setCanvasContent(e.target.value),style:{flex:1,background:"transparent",border:"none",padding:16,color:C.text,fontSize:13,fontFamily:"monospace",resize:"none",outline:"none",lineHeight:1.8}})
    ),

    // Settings Modal
    showSettings&&ce("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:12,paddingBottom:isStandalone?"28px":"12px"}},
      ce("div",{style:{...S.card({padding:22,borderRadius:22,maxWidth:460,width:"100%",maxHeight:"80vh",overflowY:"auto"}),boxShadow:C.shadowLg}},
        ce("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}},
          ce("div",{style:{fontWeight:800,fontSize:17}},"◈ Settings"),
          ce("button",{onClick:()=>setShowSettings(false),style:{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:22}},"✕")
        ),
        // Profile
        ce("div",{style:{...S.card({marginBottom:12,display:"flex",gap:10,alignItems:"center"})}},
          ce("div",{style:{width:40,height:40,borderRadius:"50%",background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:17,color:"#1A1000"}},(userName||"U").charAt(0).toUpperCase()),
          ce("div",{style:{flex:1}},ce("div",{style:{fontWeight:700,fontSize:14}},userName),ce("div",{style:{fontSize:11,color:C.muted}},loginMethod==="google"?"🌐 Google":"🔑 Ukey")),
          isPremium&&ce("span",{style:S.badge(C.accent,{fontSize:10})},`✦ ${premiumVersion}`)
        ),
        // Install
        !isStandalone&&ce("button",{onClick:()=>{setShowSettings(false);setShowPWAModal(true);},style:{...S.card({padding:"11px 14px",width:"100%",cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginBottom:12,textAlign:"left",borderColor:C.green+"40",background:C.green+"08"})}},
          ce("span",{style:{fontSize:18}},"📲"),
          ce("div",{style:{flex:1}},ce("div",{style:{fontSize:13,fontWeight:600}},"Install as Phone App"),ce("div",{style:{fontSize:11,color:C.muted}},"Add FIZUX to home screen")),
          ce("span",{style:{color:C.muted}},"›")
        ),
        // Custom instructions
        ce("div",{style:{marginBottom:12}},
          ce("div",{style:{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1,marginBottom:7}},"CUSTOM INSTRUCTIONS"),
          ce("textarea",{value:customInstr,onChange:e=>setCustomInstr(e.target.value),onBlur:async()=>{await window.storage.set("fizux:ci",customInstr).catch(()=>{});},placeholder:"Always reply in Hindi. Be concise...",rows:2,style:{...S.inp({resize:"vertical",fontSize:12})}})
        ),
        // Gemini
        ce("div",{style:{marginBottom:12}},
          ce("div",{style:{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1,marginBottom:7}},"GEMINI API KEY"),
          ce("div",{style:{display:"flex",gap:7}},
            ce("input",{value:geminiKey,onChange:e=>setGeminiKey(e.target.value),placeholder:"AIza...",type:"password",style:S.inp({flex:1})}),
            ce("button",{onClick:async()=>{await window.storage.set("fizux:gemini",geminiKey).catch(()=>{});notify("Saved!");},style:S.btnGold({padding:"11px 14px",fontSize:12})},"Save")
          )
        ),
        // Font
        ce("div",{style:{marginBottom:14}},
          ce("div",{style:{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1,marginBottom:7}},"FONT SIZE"),
          ce("div",{style:{display:"flex",gap:6}},
            [12,14,16,18].map(s=>ce("button",{key:s,onClick:async()=>{setFontSize(s);await window.storage.set("fizux:fs",String(s)).catch(()=>{});},style:{flex:1,padding:"6px 0",borderRadius:8,border:`1.5px solid ${fontSize===s?C.accent:C.border}`,background:fontSize===s?C.accent:"transparent",color:fontSize===s?"#1A1000":C.text,fontSize:12,cursor:"pointer"}},s))
          )
        ),
        ce("div",{style:{display:"flex",gap:7}},
          ce("button",{onClick:async()=>{await window.storage.delete(`fizux:chats:${userId}`).catch(()=>{});setChats([]);setMessages([]);setActiveChat(null);notify("Cleared");},style:S.btnGhost({flex:1,fontSize:11,color:C.red})},"✕ Clear Chats"),
          ce("button",{onClick:logout,style:S.btnGhost({flex:1,fontSize:11,color:C.red})},"↩ Logout")
        )
      )
    ),

    // Install banner
    showInstallBanner&&!isStandalone&&ce("div",{style:{background:C.accent+"15",borderBottom:`1px solid ${C.accent}30`,padding:"7px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}},
      ce("div",{style:{width:26,height:26,borderRadius:8,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#1A1000"}},"F"),
      ce("div",{style:{flex:1,fontSize:12,fontWeight:500}},"Install FIZUX on your phone"),
      ce("button",{onClick:async()=>{if(installPrompt){installPrompt.prompt();const{outcome}=await installPrompt.userChoice;if(outcome==="accepted"){setShowInstallBanner(false);notify("✅ Installed!");}}else setShowPWAModal(true);},style:S.btnGold({fontSize:11,padding:"5px 12px",borderRadius:8})},"Install"),
      ce("button",{onClick:()=>setShowInstallBanner(false),style:{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}},"✕")
    ),

    // Image panel
    imagePanel&&ce("div",{style:{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"10px 12px",flexShrink:0}},
      ce("div",{style:{display:"flex",gap:7,marginBottom:genImages.length?10:0}},
        ce("input",{value:imagePrompt,onChange:e=>setImagePrompt(e.target.value),onKeyDown:e=>{if(e.key==="Enter"&&imagePrompt.trim()){const s=Math.floor(Math.random()*99999);setGenImages([`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?seed=${s}&width=768&height=768&nologo=true&enhance=true`,`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt+", artistic style")}?seed=${s+1}&width=768&height=768&nologo=true&enhance=true`]);notify("Generated!");}},placeholder:"Describe your image...",style:S.inp({flex:1})}),
        ce("button",{onClick:()=>{if(!imagePrompt.trim())return;const s=Math.floor(Math.random()*99999);setGenImages([`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?seed=${s}&width=768&height=768&nologo=true&enhance=true`,`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt+", artistic style")}?seed=${s+1}&width=768&height=768&nologo=true&enhance=true`]);notify("Generated!");},style:S.btnGold({padding:"9px 12px"})},"Gen"),
        ce("button",{onClick:()=>{setImagePanel(false);setGenImages([]);},style:S.btnGhost({padding:"9px 10px"})},"✕")
      ),
      genImages.length>0&&ce("div",{style:{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}},
        genImages.map((url,i)=>ce("div",{key:i,style:{flexShrink:0}},
          ce("img",{src:url,alt:"",style:{width:90,height:90,borderRadius:10,objectFit:"cover",border:`1px solid ${C.border}`},onError:e=>e.target.style.display="none"}),
          ce("a",{href:url,download:true,style:{display:"block",textAlign:"center",fontSize:9,color:C.muted,marginTop:3,textDecoration:"none"}},"↓ Save")
        ))
      )
    ),

    // Sidebar overlay
    sidebarOpen&&ce("div",{onClick:()=>setSidebarOpen(false),style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:99}}),

    // Sidebar
    ce("div",{style:{position:"fixed",left:0,top:0,bottom:0,width:sidebarOpen?270:0,transition:"width 0.25s",overflow:"hidden",zIndex:100,background:C.surface,borderRight:`1px solid ${C.border}`,paddingTop:isStandalone?"44px":"0"}},
      ce("div",{style:{width:270,height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}},
        ce("div",{style:{padding:"13px 12px 8px",display:"flex",alignItems:"center",gap:9}},
          ce("div",{style:{width:30,height:30,borderRadius:9,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#1A1000"}},"F"),
          ce("span",{style:{fontWeight:800,fontSize:14,flex:1}},"FIZUX"),
          isPremium&&ce("span",{style:S.badge(C.accent,{fontSize:9})},`✦ ${getLabel()}`),
          ce("button",{onClick:()=>setSidebarOpen(false),style:{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:15}},"✕")
        ),
        ce("div",{style:{padding:"0 10px 7px"}},
          ce("button",{onClick:newChat,style:{width:"100%",padding:"8px 12px",borderRadius:10,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontSize:12,cursor:"pointer",fontWeight:600,textAlign:"left"}},"✎ New chat")
        ),
        ce("div",{style:{padding:"0 10px 4px"}},
          ce("div",{style:{fontSize:9,color:C.muted,fontWeight:700,letterSpacing:1.5,marginBottom:5}},"⚡ TOOLS"),
          ce("div",{style:{display:"flex",gap:3,flexWrap:"wrap",marginBottom:4}},
            ["all","office","data","creative","social","edu","personal","ai","tools"].map(cat=>ce("button",{key:cat,onClick:()=>setActiveCat(cat),style:{padding:"2px 6px",borderRadius:6,border:`1px solid ${activeCat===cat?C.accent:C.border}`,background:activeCat===cat?C.accent+"12":"transparent",color:activeCat===cat?C.accent:C.muted,fontSize:9,cursor:"pointer",textTransform:"capitalize"}},cat))
          )
        ),
        ce("div",{style:{flex:1,overflowY:"auto",padding:"0 10px"}},
          displayFeatures.slice(0,20).map(f=>ce("button",{key:f.id,onClick:()=>{setActiveFeature(f.id);setFResult("");setFInput("");setFInput2("");setFFile(null);setSidebarOpen(false);},style:{width:"100%",padding:"7px 8px",borderRadius:8,border:"none",background:"transparent",color:C.text,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:7,marginBottom:1}},
            ce("span",{style:{fontSize:13,color:C.muted}},f.icon),
            ce("div",{style:{flex:1,minWidth:0}},
              ce("div",{style:{fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:3}},f.label,!f.free&&!isPremium&&ce("span",{style:{fontSize:8,background:C.purple+"20",color:C.purple,padding:"0 3px",borderRadius:3}},"PRO"))
            )
          )),
          chats.length>0&&ce(React.Fragment,null,
            ce("div",{style:{fontSize:9,color:C.muted,fontWeight:700,letterSpacing:1.5,padding:"8px 2px 4px"}},"CHATS"),
            chats.slice(0,10).map(c=>ce("div",{key:c.id,onClick:()=>{setMessages(c.messages);setActiveChat(c.id);setSidebarOpen(false);},style:{padding:"7px 8px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:5,background:activeChat===c.id?C.border:"transparent"}},
              ce("span",{style:{flex:1,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},"▪ ",c.title),
              ce("button",{onClick:e=>{e.stopPropagation();deleteChat(c.id);},style:{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:10}},"✕")
            ))
          )
        ),
        ce("div",{style:{borderTop:`1px solid ${C.border}`,padding:"10px 12px",paddingBottom:isStandalone?"28px":"10px"}},
          ce("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8}},
            ce("div",{style:{width:28,height:28,borderRadius:"50%",background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:"#1A1000"}},(userName||"U").charAt(0).toUpperCase()),
            ce("div",{style:{flex:1,minWidth:0}},ce("div",{style:{fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},userName),ce("div",{style:{fontSize:9,color:C.muted}},isPremium?`✦ ${premiumVersion}`:"Free"))
          ),
          ce("div",{style:{display:"flex",gap:4}},
            [["✦",()=>setShowPremium(true),"Premium"],["◈",()=>setShowSettings(true),"Settings"],["📲",()=>setShowPWAModal(true),"Install"],["↩",logout,"Logout"]].map(([icon,fn,title])=>ce("button",{key:title,onClick:fn,title,style:{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 0",cursor:"pointer",fontSize:12,color:C.muted}},icon))
          )
        )
      )
    ),

    // Header
    ce("div",{style:{background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"0 12px",height:50,display:"flex",alignItems:"center",gap:7,flexShrink:0}},
      ce("button",{onClick:()=>setSidebarOpen(!sidebarOpen),style:{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",gap:4,padding:6}},
        [0,1,2].map(i=>ce("div",{key:i,style:{width:17,height:2,borderRadius:2,background:C.text}}))
      ),
      // Model selector
      ce("div",{style:{position:"relative"}},
        ce("button",{onClick:()=>setModelMenu(!modelMenu),style:{...S.btnGhost({display:"flex",alignItems:"center",gap:6,padding:"5px 10px",borderRadius:9,fontWeight:600,fontSize:12,color:C.text})}},
          ce("span",{style:{color:MODELS.find(m=>m.id===model)?.color}},MODELS.find(m=>m.id===model)?.icon),
          MODELS.find(m=>m.id===model)?.name,
          ce("span",{style:{fontSize:8,color:C.dim}},"▾")
        ),
        modelMenu&&ce("div",{style:{position:"absolute",top:"calc(100% + 4px)",left:0,background:C.card,border:`1px solid ${C.border}`,borderRadius:13,padding:7,zIndex:100,minWidth:185,boxShadow:C.shadowLg}},
          MODELS.map(m=>ce("button",{key:m.id,onClick:()=>{setModel(m.id);setModelMenu(false);if(m.id==="gemini"&&!geminiKey)setShowSettings(true);},style:{display:"flex",width:"100%",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:8,border:"none",background:model===m.id?C.border:"transparent",cursor:"pointer"}},
            ce("span",{style:{fontSize:14,color:m.color}},m.icon),
            ce("div",{style:{flex:1,textAlign:"left"}},ce("div",{style:{fontSize:12,fontWeight:600,color:C.text}},m.name),ce("div",{style:{fontSize:10,color:C.muted}},m.tag))
          ))
        )
      ),
      currentUC&&ce("span",{onClick:()=>setShowOnboard(true),style:{...S.badge(currentUC.color,{cursor:"pointer",fontSize:10,padding:"3px 8px"})}},currentUC.icon),
      ce("div",{style:{flex:1}}),
      !isStandalone&&ce("button",{onClick:()=>setShowPWAModal(true),style:{...S.badge(C.green,{cursor:"pointer",fontSize:10,padding:"3px 9px"})}},"📲"),
      isPremium?ce("button",{onClick:()=>setShowPremium(true),style:{...S.badge(C.accent,{cursor:"pointer",fontSize:10,padding:"3px 9px"})}},`✦ ${getLabel()}`)
        :ce("button",{onClick:()=>setShowPremium(true),style:{...S.btnGold({fontSize:11,padding:"5px 11px",borderRadius:8}),boxShadow:"none"}},"✦"),
      ce("button",{onClick:()=>setCompareMode(!compareMode),style:{...S.btnGhost({padding:"5px 8px",borderRadius:8,fontSize:12,color:compareMode?C.blue:C.muted,borderColor:compareMode?C.blue:C.border})}},compareMode?"⚖ ON":"⚖"),
      ce("button",{onClick:()=>setShowSettings(true),style:S.btnGhost({padding:"5px 8px",borderRadius:8,fontSize:12})},"◈"),
      ce("button",{onClick:newChat,style:{...S.btnGold({fontSize:11,padding:"5px 11px",borderRadius:8}),boxShadow:"none"}},"✎")
    ),

    compareMode&&ce("div",{style:{background:C.blue+"12",borderBottom:`1px solid ${C.blue}25`,padding:"5px 14px",fontSize:11,color:C.blue,display:"flex",alignItems:"center",gap:8,flexShrink:0}},
      "⚖ Compare Mode — Claude vs Gemini",
      ce("button",{onClick:()=>setCompareMode(false),style:{background:"none",border:"none",color:C.blue,cursor:"pointer",marginLeft:"auto",fontSize:14}},"✕")
    ),

    // Chat area
    ce("div",{style:{flex:1,overflowY:"auto",paddingBottom:8},onClick:()=>setModelMenu(false)},
      compareMode&&(compareResult.claude||compareResult.gemini)?
        ce("div",{style:{maxWidth:700,margin:"0 auto",padding:"14px 12px"}},
          ce("div",{style:{textAlign:"center",fontSize:11,color:C.muted,marginBottom:12}},"⚖ Same question — Two AI answers"),
          ce("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
            [["◆ Claude",compareResult.claude,C.accent],["✦ Gemini",compareResult.gemini,C.blue]].map(([title,content,col])=>ce("div",{key:title,style:{...S.card(),borderLeft:`3px solid ${col}`}},
              ce("div",{style:{fontSize:12,fontWeight:700,color:col,marginBottom:8}},title),
              ce("div",{style:{fontSize,lineHeight:1.8,whiteSpace:"pre-wrap",wordBreak:"break-word"}},content)
            ))
          )
        )
      :messages.length===0?
        ce("div",{style:{maxWidth:700,margin:"0 auto",padding:"22px 14px"}},
          ce("div",{style:{textAlign:"center",marginBottom:22}},
            ce("div",{style:{width:68,height:68,borderRadius:22,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:30,color:"#1A1000",margin:"0 auto 12px",animation:"float 3s ease-in-out infinite",boxShadow:C.shadowGold}},"F"),
            ce("div",{style:{fontWeight:800,fontSize:20,letterSpacing:-.5,marginBottom:4}},currentUC?`${currentUC.icon} ${currentUC.title}`:"FIZUX"),
            ce("div",{style:{fontSize:12,color:C.muted}},"130+ Features · ",BRAND.copy),
            isStandalone&&ce("div",{style:{marginTop:6,...S.badge(C.green,{display:"inline-block",fontSize:10})}},"◎ App Mode")
          ),
          ce("div",{style:{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1.2,marginBottom:8}},"⚡ TOOLS"),
          ce("div",{style:{display:"flex",gap:4,marginBottom:9,flexWrap:"wrap"}},
            ["all","office","data","creative","social","edu","personal","ai","tools"].map(cat=>ce("button",{key:cat,onClick:()=>setActiveCat(cat),style:{padding:"3px 8px",borderRadius:14,border:`1px solid ${activeCat===cat?C.accent:C.border}`,background:activeCat===cat?C.accent+"12":"transparent",color:activeCat===cat?C.accent:C.muted,fontSize:9,cursor:"pointer",textTransform:"capitalize"}},cat))
          ),
          ce("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:6,marginBottom:18}},
            displayFeatures.slice(0,12).map(f=>ce("button",{key:f.id,onClick:()=>{setActiveFeature(f.id);setFResult("");setFInput("");setFInput2("");setFFile(null);},style:{...S.card({padding:"12px 10px"}),cursor:"pointer",textAlign:"left",position:"relative"}},
              !f.free&&!isPremium&&ce("span",{style:{position:"absolute",top:6,right:6,fontSize:8,background:C.purple+"20",color:C.purple,padding:"1px 3px",borderRadius:4}},"PRO"),
              ce("div",{style:{fontSize:16,marginBottom:4,color:C.muted}},f.icon),
              ce("div",{style:{fontSize:10,fontWeight:700}},f.label)
            ))
          ),
          ce("div",{style:{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1.2,marginBottom:8}},"QUICK START"),
          ce("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}},
            [["▦","Analyze my Excel","Instant insights"],["✉","Write email","Professional"],["◐","Generate image","AI art"],["◉","Need support","Talk to me"]].map(([icon,title,sub])=>ce("button",{key:title,onClick:()=>setInput(title),style:{...S.card({padding:"12px 12px"}),cursor:"pointer",textAlign:"left"}},
              ce("div",{style:{fontSize:16,marginBottom:4,color:C.muted}},icon),
              ce("div",{style:{fontSize:12,fontWeight:700,marginBottom:2}},title),
              ce("div",{style:{fontSize:10,color:C.muted}},sub)
            ))
          )
        )
      :ce("div",null,
          messages.map((msg,i)=>renderMsg(msg,i)),
          loading&&ce("div",{style:{padding:"14px 0"}},
            ce("div",{style:{maxWidth:700,margin:"0 auto",padding:"0 14px"}},
              ce("div",{style:{display:"flex",gap:10}},
                ce("div",{style:{width:32,height:32,borderRadius:"50%",background:C.gradGreen,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"#1A1000"}},"F"),
                ce("div",{style:{display:"flex",gap:4,alignItems:"center",paddingTop:9}},
                  [0,1,2].map(i=>ce("div",{key:i,style:{width:7,height:7,borderRadius:"50%",background:C.muted,animation:`bounce 1.2s infinite`,animationDelay:`${i*0.2}s`}}))
                )
              )
            )
          ),
          followUps.length>0&&!loading&&ce("div",{style:{maxWidth:700,margin:"0 auto",padding:"7px 14px 0"}},
            ce("div",{style:{fontSize:10,color:C.muted,marginBottom:5,fontWeight:600}},"◎ Also ask:"),
            ce("div",{style:{display:"flex",flexWrap:"wrap",gap:5}},
              followUps.map((q,i)=>ce("button",{key:i,onClick:()=>{setInput(q);setFollowUps([]);},style:{...S.btnGhost({fontSize:11,borderRadius:14,padding:"4px 10px",maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"})},title:q},q))
            )
          ),
          ce("div",{ref:bottomRef})
        )
    ),

    // Input area
    ce("div",{style:{padding:"0 12px",paddingBottom:isStandalone?"28px":"10px",flexShrink:0}},
      ce("div",{style:{maxWidth:700,margin:"0 auto"}},
        attachments.length>0&&ce("div",{style:{display:"flex",gap:5,flexWrap:"wrap",marginBottom:6}},
          attachments.map((a,i)=>ce("div",{key:i,style:{...S.card({padding:"4px 10px",borderRadius:8}),display:"flex",alignItems:"center",gap:5}},
            ce("span",{style:{fontSize:11,color:C.muted}},a.type==="image"?"◐":"▤"),
            ce("span",{style:{fontSize:11}},a.name.slice(0,14)),
            ce("button",{onClick:()=>setAttachments(p=>p.filter((_,j)=>j!==i)),style:{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:11}},"✕")
          ))
        ),
        ce("div",{style:{background:C.card,border:`2px solid ${listening?C.red:compareMode?C.blue:C.border}`,borderRadius:16,padding:"10px 12px",boxShadow:C.shadow,transition:"border 0.2s"}},
          ce("textarea",{ref:inputRef,value:input,onChange:e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,130)+"px";},onKeyDown:e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}},placeholder:listening?"Listening...":compareMode?"Compare Claude vs Gemini...":"Message FIZUX...",rows:1,style:{width:"100%",background:"transparent",border:"none",color:C.text,fontSize,fontFamily:"inherit",resize:"none",outline:"none",lineHeight:1.6,maxHeight:130,boxSizing:"border-box"}}),
          ce("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:7}},
            ce("div",{style:{display:"flex",gap:4}},
              ce("input",{ref:fileRef,type:"file",onChange:e=>Array.from(e.target.files).forEach(f=>processFile(f)),style:{display:"none"},multiple:true,accept:"image/*,.txt,.csv,.json,.md,.pdf,.docx,.xlsx,.xls"}),
              [["↑",()=>fileRef.current?.click(),false],[listening?"●":"▷",listening?stopVoice:startVoice,listening],["◐",()=>setImagePanel(!imagePanel),imagePanel]].map(([icon,fn,active],idx)=>ce("button",{key:idx,onClick:fn,style:{...S.btnGhost({padding:"4px 8px",borderRadius:7,color:active?C.red:C.muted,borderColor:active?C.red+"40":C.border,background:active?C.red+"10":"transparent",fontSize:13})},},icon))
            ),
            ce("button",{onClick:send,disabled:(!input.trim()&&!attachments.length)||loading,style:{width:34,height:34,borderRadius:"50%",background:(input.trim()||attachments.length)&&!loading?C.gold:C.card,border:`1px solid ${C.border}`,cursor:(input.trim()||attachments.length)&&!loading?"pointer":"not-allowed",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",color:(input.trim()||attachments.length)&&!loading?"#1A1000":C.muted,boxShadow:(input.trim()||attachments.length)&&!loading?C.shadowGold:"none",transition:"all 0.2s"}},"↑")
          )
        ),
        ce("div",{style:{textAlign:"center",marginTop:4,fontSize:9,color:C.dim}},BRAND.name," ",BRAND.version," · ",BRAND.copy)
      )
    ),

    ce("style",null,`
      @keyframes bounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-5px);opacity:1}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
      html,body{margin:0;padding:0;overflow:hidden;}
      textarea::-webkit-scrollbar,input::-webkit-scrollbar{width:0;}
      ::-webkit-scrollbar{width:3px;}
      ::-webkit-scrollbar-thumb{background:#252535;border-radius:3px;}
    `)
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
