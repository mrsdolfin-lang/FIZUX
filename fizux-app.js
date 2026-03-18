// ╔══════════════════════════════════════════════════════════╗
// ║  FIZUX v9.0 — THE ULTIMATE AI UNIVERSE                  ║
// ║  10+ AI Models · 130+ Features · Smart Auto-Selection   ║
// ║  © 2025 FIZUX · dofizuxai@gmail.com                     ║
// ╚══════════════════════════════════════════════════════════╝

const { useState, useRef, useEffect, useCallback } = React;

// ── BRAND ──
const BRAND = {
  name: "FIZUX",
  version: "v9.0",
  tagline: "Your Personal AI Universe",
  copy: "© 2025 FIZUX",
  contact: "dofizuxai@gmail.com",
  support: "mailto:dofizuxai@gmail.com?subject=FIZUX Premium Ukey Request",
};

// ── FREE TIER ──
const FREE_DAILY = 50;
const SESSION_KEY = "fizux_v9_session";

// ── AI MODELS CONFIG ──
const AI_MODELS = [
  {
    id: "claude",
    name: "Claude",
    sub: "Sonnet 4.5",
    icon: "◆",
    color: "#C9A84C",
    tag: "Smart",
    free: true,
    desc: "Best reasoning & analysis",
    endpoint: "https://api.anthropic.com/v1/messages",
    model: "claude-sonnet-4-20250514",
  },
  {
    id: "gemini",
    name: "Gemini",
    sub: "Flash 2.0",
    icon: "✦",
    color: "#4A9EFF",
    tag: "Fast",
    free: true,
    desc: "Google AI — fast & accurate",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    model: "gemini-2.0-flash",
    keyName: "geminiKey",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    sub: "Chat v3",
    icon: "⬡",
    color: "#2ECC8A",
    tag: "Free",
    free: true,
    desc: "Powerful open-source AI",
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    model: "deepseek-chat",
    keyName: "deepseekKey",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    sub: "Multi-model",
    icon: "◈",
    color: "#8B6FE8",
    tag: "Multi",
    free: false,
    desc: "Access 100+ AI models",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    model: "mistralai/mistral-7b-instruct:free",
    keyName: "openrouterKey",
  },
  {
    id: "huggingface",
    name: "HuggingFace",
    sub: "Zephyr 7B",
    icon: "⚙",
    color: "#FF8C42",
    tag: "Open",
    free: true,
    desc: "Open-source AI models",
    endpoint: "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
    model: "zephyr-7b-beta",
    keyName: "hfKey",
  },
  {
    id: "gpt",
    name: "ChatGPT",
    sub: "GPT-4o Mini",
    icon: "◎",
    color: "#10A37F",
    tag: "OpenAI",
    free: false,
    desc: "OpenAI's powerful model",
    endpoint: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o-mini",
    keyName: "openaiKey",
  },
  {
    id: "grok",
    name: "Grok",
    sub: "Grok-2",
    icon: "✕",
    color: "#FF4D6A",
    tag: "xAI",
    free: false,
    desc: "Elon's rebellious AI",
    endpoint: "https://api.x.ai/v1/chat/completions",
    model: "grok-2-latest",
    keyName: "grokKey",
  },
  {
    id: "auto",
    name: "Auto",
    sub: "Best AI",
    icon: "⚡",
    color: "#C9A84C",
    tag: "Smart",
    free: true,
    desc: "Automatically picks best AI for your task",
    isAuto: true,
  },
];

// ── USE CASES ──
const USE_CASES = [
  { id:"office", icon:"💼", title:"Office Pro", desc:"Emails, reports, Excel, meetings", color:"#4A9EFF" },
  { id:"student", icon:"🎓", title:"Student", desc:"Study, essays, research, exams", color:"#8B6FE8" },
  { id:"creator", icon:"✦", title:"Creator", desc:"Social media, videos, content", color:"#FF6B9D" },
  { id:"business", icon:"🚀", title:"Business", desc:"Strategy, marketing, growth", color:"#C9A84C" },
  { id:"developer", icon:"⌨", title:"Developer", desc:"Code, SQL, data, debug", color:"#2ECC8A" },
  { id:"personal", icon:"◎", title:"Personal", desc:"Life, health, goals, support", color:"#FF8C42" },
];

// ── ALL FEATURES ──
const ALL_FEATURES = [
  // Office
  { id:"email_writer", icon:"✉", label:"Email Writer", desc:"Context → perfect email", cat:"office", free:true, keywords:["email","mail","write email","compose","reply to","subject"] },
  { id:"excel_analyze", icon:"▦", label:"Excel Analyzer", desc:"Data → instant insights", cat:"office", free:true, keywords:["excel","spreadsheet","data","csv","analyze data","numbers"] },
  { id:"pdf_reader", icon:"▤", label:"PDF Reader", desc:"PDF → summary & Q&A", cat:"office", free:true, keywords:["pdf","document","read","summarize document","extract"] },
  { id:"resume_builder", icon:"▣", label:"Resume Builder", desc:"ATS-optimized resume", cat:"office", free:true, keywords:["resume","cv","job application","portfolio","career"] },
  { id:"invoice_gen", icon:"▥", label:"Invoice Gen", desc:"Professional invoice", cat:"office", free:true, keywords:["invoice","bill","payment","receipt","charge"] },
  { id:"report_gen", icon:"▦", label:"Report Generator", desc:"Data → report", cat:"office", free:false, keywords:["report","analysis","document","business report"] },
  { id:"meeting_notes", icon:"◈", label:"Meeting Notes", desc:"Transcript → minutes", cat:"office", free:false, keywords:["meeting","minutes","notes","transcript","discussion"] },
  { id:"contract_review", icon:"⚖", label:"Contract Review", desc:"Risk analysis", cat:"office", free:false, keywords:["contract","agreement","legal","terms","clause","review"] },
  { id:"business_plan", icon:"◉", label:"Business Plan", desc:"Complete plan", cat:"office", free:false, keywords:["business plan","startup","company","launch","venture"] },
  { id:"presentation", icon:"▶", label:"Presentation", desc:"Slide deck", cat:"office", free:false, keywords:["presentation","slides","ppt","pitch","deck"] },
  // Data
  { id:"ocr", icon:"◫", label:"OCR", desc:"Image → text", cat:"data", free:true, keywords:["ocr","image text","extract text","scan","photo to text"] },
  { id:"sql_gen", icon:"⬡", label:"SQL Generator", desc:"English → SQL query", cat:"data", free:true, keywords:["sql","database","query","select","mysql","postgresql"] },
  { id:"formula_gen", icon:"⚡", label:"Formula Gen", desc:"Describe → formula", cat:"data", free:true, keywords:["formula","excel formula","vlookup","sumif","calculation"] },
  { id:"data_clean", icon:"◎", label:"Data Cleaner", desc:"Messy → clean data", cat:"data", free:false, keywords:["clean data","fix data","format","normalize"] },
  { id:"financial_calc", icon:"◈", label:"Financial Calc", desc:"EMI, ROI, GST", cat:"data", free:false, keywords:["emi","loan","roi","gst","tax","interest","finance calc"] },
  // Creative
  { id:"image_gen", icon:"◐", label:"Image Gen", desc:"Text → AI art", cat:"creative", free:true, keywords:["image","picture","generate image","draw","art","photo","visualize"] },
  { id:"story_writer", icon:"◑", label:"Story Writer", desc:"Prompt → story", cat:"creative", free:true, keywords:["story","write story","fiction","narrative","tale","novel"] },
  { id:"music_gen", icon:"♫", label:"Music & Lyrics", desc:"Genre → song", cat:"creative", free:false, keywords:["song","lyrics","music","compose","melody","verse","chorus"] },
  { id:"script_writer", icon:"▶", label:"Script Writer", desc:"Idea → script", cat:"creative", free:false, keywords:["script","screenplay","dialogue","scene","video script"] },
  // Social
  { id:"social_caption", icon:"◇", label:"Caption Writer", desc:"Post → viral captions", cat:"social", free:true, keywords:["caption","instagram","post","social media","insta","content"] },
  { id:"hashtag_gen", icon:"#", label:"Hashtag Gen", desc:"Topic → hashtags", cat:"social", free:true, keywords:["hashtag","tags","trending","instagram tags","#"] },
  { id:"youtube_script", icon:"▷", label:"YouTube Script", desc:"Title → full script", cat:"social", free:false, keywords:["youtube","video script","channel","thumbnail","vlog"] },
  { id:"linkedin_post", icon:"▪", label:"LinkedIn Post", desc:"Achievement → post", cat:"social", free:true, keywords:["linkedin","professional post","network","career post"] },
  { id:"content_calendar", icon:"◫", label:"Content Calendar", desc:"30-day plan", cat:"social", free:false, keywords:["content plan","calendar","schedule","30 days","posting schedule"] },
  // Education
  { id:"math_solver", icon:"∑", label:"Math Solver", desc:"Problem → steps", cat:"edu", free:true, keywords:["math","solve","calculate","equation","algebra","geometry","calculus"] },
  { id:"quiz_gen", icon:"?", label:"Quiz Generator", desc:"Topic → quiz", cat:"edu", free:true, keywords:["quiz","questions","mcq","test","exam questions","practice"] },
  { id:"flashcard_maker", icon:"◱", label:"Flashcards", desc:"Topic → cards", cat:"edu", free:true, keywords:["flashcard","memorize","study cards","revision","notes"] },
  { id:"essay_writer", icon:"✍", label:"Essay Writer", desc:"Topic → essay", cat:"edu", free:false, keywords:["essay","write essay","academic","article","composition"] },
  { id:"study_planner", icon:"◫", label:"Study Planner", desc:"Exam schedule", cat:"edu", free:false, keywords:["study plan","exam prep","schedule","revision plan","timetable"] },
  { id:"coding_tutor", icon:"⌨", label:"Coding Tutor", desc:"Learn any language", cat:"edu", free:true, keywords:["code","programming","learn coding","python","javascript","debug"] },
  // Personal
  { id:"health_advisor", icon:"♥", label:"Health Advisor", desc:"Wellness tips", cat:"personal", free:true, keywords:["health","wellness","diet","exercise","symptoms","medical","fitness"] },
  { id:"travel_planner", icon:"✈", label:"Travel Planner", desc:"Full itinerary", cat:"personal", free:true, keywords:["travel","trip","itinerary","vacation","tour","places to visit"] },
  { id:"workout_gen", icon:"◎", label:"Workout Plan", desc:"Custom routine", cat:"personal", free:true, keywords:["workout","exercise","gym","fitness","routine","training"] },
  { id:"emotional_support", icon:"◉", label:"Emotional Support", desc:"Empathetic AI", cat:"personal", free:true, keywords:["feeling","sad","anxious","stressed","mental health","support","talk"] },
  { id:"goal_setting", icon:"◎", label:"Goal Setting", desc:"SMART action plan", cat:"personal", free:true, keywords:["goal","target","achieve","plan","motivation","habit"] },
  { id:"diet_planner", icon:"◌", label:"Diet Planner", desc:"Custom meal plan", cat:"personal", free:false, keywords:["diet","meal plan","calories","nutrition","weight loss","food"] },
  // Marketing
  { id:"marketing_writer", icon:"◈", label:"Marketing Copy", desc:"Full campaign copy", cat:"marketing", free:false, keywords:["marketing","campaign","copy","brand","promote","advertisement"] },
  { id:"seo_writer", icon:"◎", label:"SEO Writer", desc:"Optimized article", cat:"marketing", free:false, keywords:["seo","blog","article","keyword","rank","search engine","content"] },
  { id:"ad_copy", icon:"◇", label:"Ad Copy", desc:"Converting ads", cat:"marketing", free:false, keywords:["ad","advertisement","facebook ad","google ad","sales copy","cta"] },
  // AI Tools
  { id:"deep_think", icon:"⬡", label:"Deep Think", desc:"Multi-step reasoning", cat:"ai", free:false, keywords:["think deeply","analyze","reason","complex problem","step by step"] },
  { id:"fact_check", icon:"✓", label:"Fact Checker", desc:"Verify any claim", cat:"ai", free:true, keywords:["fact check","verify","true or false","is it true","check claim"] },
  { id:"translator", icon:"◈", label:"Translator", desc:"100+ languages", cat:"tools", free:true, keywords:["translate","hindi","urdu","spanish","french","language","convert language"] },
  { id:"summarizer", icon:"◎", label:"Summarizer", desc:"Long → short", cat:"tools", free:true, keywords:["summarize","tldr","shorten","brief","key points","overview"] },
  { id:"youtube_summary", icon:"▷", label:"YouTube Summary", desc:"URL → summary", cat:"tools", free:true, keywords:["youtube","video summary","watch","channel","url summary"] },
  { id:"website_chat", icon:"◎", label:"Website Chat", desc:"URL → answers", cat:"tools", free:true, keywords:["website","url","webpage","link","browse","web page"] },
  { id:"code_generator", icon:"⌨", label:"Code Generator", desc:"Description → code", cat:"tools", free:true, keywords:["write code","generate code","function","program","script","code for"] },
  { id:"grammar_fix", icon:"✓", label:"Grammar Fix", desc:"Fix any text", cat:"tools", free:true, keywords:["grammar","spelling","fix text","correct","proofread","edit text"] },
];

// ── FONT OPTIONS ──
const FONT_OPTIONS = [
  { id:"jakarta", name:"Plus Jakarta", family:"'Plus Jakarta Sans', system-ui" },
  { id:"syne", name:"Syne", family:"'Syne', system-ui" },
  { id:"mono", name:"Monospace", family:"'DM Mono', monospace" },
  { id:"system", name:"System", family:"system-ui, sans-serif" },
];

const FONT_SIZES = [12, 13, 14, 15, 16, 18];

// ── AUTO AI SELECTOR ──
const selectBestAI = (message, features, userKeys) => {
  const msg = message.toLowerCase();
  // Code tasks → Claude
  if(/code|debug|function|programming|sql|api/.test(msg)) return "claude";
  // Creative → Claude
  if(/story|creative|write|song|poem/.test(msg)) return "claude";
  // Math → DeepSeek
  if(/math|equation|solve|calculate|formula/.test(msg)) return userKeys.deepseekKey ? "deepseek" : "claude";
  // Fast factual → Gemini
  if(/what is|who is|define|explain|translate/.test(msg)) return userKeys.geminiKey ? "gemini" : "claude";
  // Default → Claude
  return "claude";
};

// ── FEATURE DETECTOR ──
const detectFeature = (message) => {
  const msg = message.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;
  for(const feature of ALL_FEATURES) {
    let score = 0;
    for(const kw of feature.keywords) {
      if(msg.includes(kw)) score += kw.split(" ").length * 2;
    }
    if(score > bestScore) { bestScore = score; bestMatch = feature; }
  }
  return bestScore >= 2 ? bestMatch : null;
};

// ── DAILY COUNTER ──
const getDayKey = () => `fizux:day:${new Date().toDateString()}`;
const getDailyCount = async () => {
  try { const d = await window.storage.get(getDayKey()).catch(()=>null); return d ? parseInt(d.value)||0 : 0; } catch { return 0; }
};
const bumpDaily = async () => {
  try { const c = await getDailyCount(); await window.storage.set(getDayKey(), String(c+1)); return c+1; } catch { return 0; }
};

// ════════════════════════════════════════════
// ── AI ENGINE ──
// ════════════════════════════════════════════
const callClaude = async (messages, system="", search=true, customKeys={}) => {
  const tools = search ? [{type:"web_search_20250305",name:"web_search"}] : [];
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1200,
      system: system || "You are FIZUX — a brilliant AI assistant. Be precise, helpful, and thorough.",
      ...(tools.length>0?{tools}:{}),
      messages
    })
  });
  if(!res.ok) { const e=await res.json().catch(()=>{}); throw new Error(e?.error?.message||`Claude error ${res.status}`); }
  const data = await res.json();
  let reply="", searched=false;
  for(const b of (data.content||[])) { if(b.type==="text") reply+=b.text; if(b.type==="tool_use") searched=true; }
  return { reply: reply||"No response.", searched, model:"claude" };
};

const callGemini = async (messages, key) => {
  if(!key) throw new Error("Gemini API key required");
  const contents = messages.slice(-20).map(m=>({
    role:m.role==="user"?"user":"model",
    parts:[{text:typeof m.content==="string"?m.content:"[content]"}]
  }));
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({contents, generationConfig:{maxOutputTokens:1200}})
  });
  if(!res.ok) throw new Error(`Gemini error ${res.status}`);
  const data = await res.json();
  return { reply:data.candidates?.[0]?.content?.parts?.[0]?.text||"No response.", searched:false, model:"gemini" };
};

const callDeepSeek = async (messages, key) => {
  if(!key) throw new Error("DeepSeek API key required");
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
    body:JSON.stringify({ model:"deepseek-chat", max_tokens:1200,
      messages: messages.slice(-20).map(m=>({role:m.role,content:typeof m.content==="string"?m.content:"[content]"}))
    })
  });
  if(!res.ok) throw new Error(`DeepSeek error ${res.status}`);
  const data = await res.json();
  return { reply:data.choices?.[0]?.message?.content||"No response.", searched:false, model:"deepseek" };
};

const callOpenRouter = async (messages, key) => {
  if(!key) throw new Error("OpenRouter API key required");
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`,"HTTP-Referer":"https://fizux.app"},
    body:JSON.stringify({ model:"mistralai/mistral-7b-instruct:free", max_tokens:1200,
      messages: messages.slice(-20).map(m=>({role:m.role,content:typeof m.content==="string"?m.content:"[content]"}))
    })
  });
  if(!res.ok) throw new Error(`OpenRouter error ${res.status}`);
  const data = await res.json();
  return { reply:data.choices?.[0]?.message?.content||"No response.", searched:false, model:"openrouter" };
};

const callHuggingFace = async (messages, key) => {
  const lastMsg = messages[messages.length-1];
  const prompt = typeof lastMsg?.content==="string" ? lastMsg.content : "Hello";
  const headers = {"Content-Type":"application/json"};
  if(key) headers["Authorization"] = `Bearer ${key}`;
  const res = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
    method:"POST", headers,
    body:JSON.stringify({ inputs:`<|user|>\n${prompt}\n<|assistant|>`, parameters:{max_new_tokens:800,return_full_text:false} })
  });
  if(!res.ok) throw new Error(`HuggingFace error ${res.status}`);
  const data = await res.json();
  const reply = Array.isArray(data) ? data[0]?.generated_text||"No response." : data?.generated_text||"No response.";
  return { reply:reply.trim(), searched:false, model:"huggingface" };
};

const callOpenAI = async (messages, key) => {
  if(!key) throw new Error("OpenAI API key required");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
    body:JSON.stringify({ model:"gpt-4o-mini", max_tokens:1200,
      messages: messages.slice(-20).map(m=>({role:m.role,content:typeof m.content==="string"?m.content:"[content]"}))
    })
  });
  if(!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = await res.json();
  return { reply:data.choices?.[0]?.message?.content||"No response.", searched:false, model:"gpt" };
};

const callGrok = async (messages, key) => {
  if(!key) throw new Error("Grok API key required");
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
    body:JSON.stringify({ model:"grok-2-latest", max_tokens:1200,
      messages: messages.slice(-20).map(m=>({role:m.role,content:typeof m.content==="string"?m.content:"[content]"}))
    })
  });
  if(!res.ok) throw new Error(`Grok error ${res.status}`);
  const data = await res.json();
  return { reply:data.choices?.[0]?.message?.content||"No response.", searched:false, model:"grok" };
};

// Master AI caller
const callAI = async (modelId, messages, options={}) => {
  const { system="", search=true, keys={}, userMessage="" } = options;
  const effectiveModel = modelId==="auto" ? selectBestAI(userMessage||"", [], keys) : modelId;
  switch(effectiveModel) {
    case "claude": return callClaude(messages, system, search, keys);
    case "gemini": return keys.geminiKey ? callGemini(messages, keys.geminiKey) : callClaude(messages, system, search);
    case "deepseek": return keys.deepseekKey ? callDeepSeek(messages, keys.deepseekKey) : callClaude(messages, system, false);
    case "openrouter": return keys.openrouterKey ? callOpenRouter(messages, keys.openrouterKey) : callClaude(messages, system, false);
    case "huggingface": return callHuggingFace(messages, keys.hfKey||"");
    case "gpt": return keys.openaiKey ? callOpenAI(messages, keys.openaiKey) : callClaude(messages, system, false);
    case "grok": return keys.grokKey ? callGrok(messages, keys.grokKey) : callClaude(messages, system, false);
    default: return callClaude(messages, system, search);
  }
};

// ── FEATURE SMART PROMPTS ──
const getSmartPrompt = (feature, userMessage, context="") => {
  const base = {
    email_writer: `You are an expert email writer. Write a professional email based on: "${userMessage}". Include subject line options, proper greeting, clear body, and closing.`,
    excel_analyze: `You are a data analyst. Analyze this data:\n${context||userMessage}\n\n1. KEY METRICS\n2. TRENDS\n3. INSIGHTS\n4. RECOMMENDATIONS`,
    pdf_reader: `Analyze this document:\n${context||userMessage}\n\nProvide: Executive summary, key points, important data, and answer any questions asked.`,
    resume_builder: `Create an ATS-optimized resume for: "${userMessage}"\n\nInclude: Contact, Professional Summary, Experience, Skills, Education. Use action verbs and quantify achievements.`,
    invoice_gen: `Create a professional invoice for: "${userMessage}"\n\nInclude: Invoice#, date, items, subtotal, GST 18%, total, payment terms.`,
    report_gen: `Write a professional business report on: "${userMessage}"\n\nStructure: Executive Summary, Findings, Analysis, Recommendations, Next Steps.`,
    meeting_notes: `Create meeting minutes from: "${userMessage}"\n\nInclude: Overview, decisions made, action items with owners, next steps.`,
    contract_review: `Review this contract/agreement: "${userMessage}"\n\nIdentify: Type, parties, key obligations, RISK FLAGS 🚨, missing clauses, recommendations.`,
    business_plan: `Create a business plan for: "${userMessage}"\n\nSections: Executive Summary, Problem & Solution, Market Analysis, Revenue Model, Financial Projections.`,
    presentation: `Create a 10-slide presentation for: "${userMessage}"\n\nEach slide: Title + 4 bullet points + speaker notes. Make it engaging.`,
    ocr: `Extract ALL text from this image exactly as written. Maintain formatting.`,
    sql_gen: `Write SQL for: "${userMessage}"\n\n1. The exact query\n2. Step-by-step explanation\n3. Optimized version with indexes`,
    formula_gen: `Create a formula for: "${userMessage}"\n\n1. Exact formula\n2. How it works\n3. Example with real data`,
    data_clean: `Clean and fix this data: "${userMessage}"\n\nFix: formatting, duplicates, missing values, inconsistencies. Show before/after.`,
    financial_calc: `Calculate for: "${userMessage}"\n\nShow: exact formula, step-by-step calculation, result, and interpretation.`,
    image_gen: `Create 3 detailed AI image generation prompts for: "${userMessage}"\n\nEach 50+ words describing: style, lighting, composition, mood, colors, camera angle.`,
    story_writer: `Write a creative story about: "${userMessage}"\n\nInclude: Strong opening hook, developed characters, rising conflict, climax, satisfying resolution. Make it memorable.`,
    music_gen: `Write a complete song for: "${userMessage}"\n\nInclude: Verse 1, Pre-chorus, Chorus, Verse 2, Bridge, Final chorus. Add chord suggestions.`,
    script_writer: `Write a complete script for: "${userMessage}"\n\nInclude: Hook (0-15s), intro, main content chapters, CTA, outro. Format professionally.`,
    social_caption: `Write 5 viral captions for: "${userMessage}"\n\nVariety: 1) Funny 2) Emotional 3) Inspiring 4) Informative 5) Controversial. Include emojis and CTAs.`,
    hashtag_gen: `Generate hashtags for: "${userMessage}"\n\n1. HIGH-REACH (5) — 1M+ posts\n2. MEDIUM (10) — 100K-1M posts\n3. NICHE (10) — under 100K posts\nBest posting time included.`,
    youtube_script: `Write a complete YouTube script for: "${userMessage}"\n\nHook (first 30s), intro, 5 main chapters with transitions, CTA, outro. Include engagement triggers.`,
    linkedin_post: `Write a viral LinkedIn post about: "${userMessage}"\n\nStructure: Pattern-interrupt hook, relatable story, 3 key insights, actionable takeaway, engagement question.`,
    content_calendar: `Create a 30-day content calendar for: "${userMessage}"\n\nFor each week: theme, daily post ideas, best times to post, content type mix.`,
    math_solver: `Solve this math problem step by step:\n${userMessage}\n\n1. Identify approach\n2. Show every step clearly\n3. Final answer (boxed)\n4. Verify the solution`,
    quiz_gen: `Create a 10-question quiz on: "${userMessage}"\n\nEach question: question, 4 options (A-D), correct answer, explanation. Vary difficulty.`,
    flashcard_maker: `Create 20 flashcards for: "${userMessage}"\n\nFRONT: [term/question] | BACK: [definition/answer + memory trick]`,
    essay_writer: `Write a comprehensive essay on: "${userMessage}"\n\nStructure: Hook intro + thesis, 3 body paragraphs (claim+evidence+analysis), strong conclusion, citations.`,
    study_planner: `Create a study plan for: "${userMessage}"\n\nWeek-by-week breakdown, daily sessions, topics to cover, revision schedule, exam strategy.`,
    coding_tutor: `Explain and help with: "${userMessage}"\n\nInclude: concept explanation, working code example, common mistakes, best practices, practice exercise.`,
    health_advisor: `Provide wellness information about: "${userMessage}"\n\nGeneral info, lifestyle tips, prevention, when to see doctor.\n⚠️ Not medical advice — consult a doctor for medical decisions.`,
    travel_planner: `Create a travel itinerary for: "${userMessage}"\n\nDay-by-day: morning/afternoon/evening, food, transport, budget estimate, insider tips.`,
    workout_gen: `Design a workout plan for: "${userMessage}"\n\nWeekly schedule, exercises, sets/reps, rest periods, warm-up/cool-down, progression tips.`,
    emotional_support: `The user says: "${userMessage}"\n\nRespond with genuine warmth and empathy. Validate their feelings, show you understand, ask one caring follow-up question. Be a supportive friend, not a robot.`,
    goal_setting: `Create a SMART goal plan for: "${userMessage}"\n\nSMART breakdown, 90-day milestones, weekly actions, obstacles + solutions, tracking method.`,
    diet_planner: `Create a diet plan for: "${userMessage}"\n\n7-day meal plan, calorie breakdown, macro ratios, shopping list, meal prep tips.`,
    marketing_writer: `Create marketing copy for: "${userMessage}"\n\nInclude: headline options (×5), body copy, CTA variants, target audience, key benefits.`,
    seo_writer: `Write an SEO-optimized article about: "${userMessage}"\n\nInclude: Title (with keyword), meta description, H2s, 800+ words, FAQs section, internal link suggestions.`,
    ad_copy: `Write ad copy for: "${userMessage}"\n\nCreate: 5 headlines, 3 body copies, 5 CTAs. Versions for: Facebook, Google, Instagram. Include A/B variants.`,
    deep_think: `Analyze this deeply: "${userMessage}"\n\nExamine from multiple angles:\n1. Surface level\n2. Root causes\n3. Hidden assumptions\n4. Counter-arguments\n5. Synthesis & recommendation`,
    fact_check: `Fact-check: "${userMessage}"\n\n1. VERDICT: True/False/Partially True/Misleading\n2. Evidence FOR\n3. Evidence AGAINST\n4. Context\n5. Sources\n6. Final conclusion`,
    translator: `Translate to the requested language: "${userMessage}"\n\nProvide: natural translation, any important cultural notes, alternative phrasings if relevant.`,
    summarizer: `Summarize this: "${userMessage}"\n\nProvide: 1-sentence TL;DR, key points (5), what's missing, and who should care.`,
    youtube_summary: `Search and summarize this YouTube video: ${userMessage}\n\nMain topic, 7 key takeaways, best quotes, overall rating, who should watch.`,
    website_chat: `Search and answer about this website/URL: ${userMessage}\n\nMain purpose, key information, relevant answer to any question asked.`,
    code_generator: `Generate code for: "${userMessage}"\n\nProvide: working code, comments, usage example, edge cases handled, potential improvements.`,
    grammar_fix: `Fix grammar and improve this text: "${userMessage}"\n\nShow: corrected version, list of changes made, tone/style notes, optional enhanced version.`,
  };
  return base[feature?.id] || `Help with: "${userMessage}"`;
};

// ════════════════════════════════════════════
// ── MAIN APP COMPONENT ──
// ════════════════════════════════════════════
function FIZUXApp() {
  // ── Auth State ──
  const [screen, setScreen] = useState("loading");
  const [user, setUser] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ── App State ──
  const [theme, setTheme] = useState("dark");
  const [fontFamily, setFontFamily] = useState("jakarta");
  const [fontSize, setFontSize] = useState(14);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("all");

  // ── Premium & Usage ──
  const [isPremium, setIsPremium] = useState(false);
  const [premiumVersion, setPremiumVersion] = useState("");
  const [premiumExpiry, setPremiumExpiry] = useState(null);
  const [dailyCount, setDailyCount] = useState(0);

  // ── Chat State ──
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("auto");
  const [modelMenu, setModelMenu] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [listening, setListening] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [detectedFeature, setDetectedFeature] = useState(null);
  const [useCase, setUseCase] = useState(null);

  // ── API Keys ──
  const [apiKeys, setApiKeys] = useState({
    geminiKey: "", deepseekKey: "", openrouterKey: "",
    hfKey: "", openaiKey: "", grokKey: ""
  });

  // ── Modals ──
  const [showSettings, setShowSettings] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showOnboard, setShowOnboard] = useState(false);
  const [showPWA, setShowPWA] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDeepThink, setShowDeepThink] = useState(false);

  // ── Compare Mode ──
  const [compareModels, setCompareModels] = useState(["claude", "gemini"]);
  const [compareResults, setCompareResults] = useState({});
  const [compareLoading, setCompareLoading] = useState(false);

  // ── Canvas ──
  const [canvasContent, setCanvasContent] = useState("");

  // ── Deep Think ──
  const [thinkSteps, setThinkSteps] = useState([]);

  // ── Image Gen ──
  const [imagePanel, setImagePanel] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [genImages, setGenImages] = useState([]);

  // ── Ukey ──
  const [ukeyInput, setUkeyInput] = useState("");
  const [ukeyError, setUkeyError] = useState("");
  const [ukeyLoading, setUkeyLoading] = useState(false);

  // ── Toast ──
  const [toast, setToast] = useState({ msg:"", type:"ok" });

  // ── Custom Instructions ──
  const [customInstr, setCustomInstr] = useState("");

  // ── PWA ──
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  // Refs
  const bottomRef = useRef();
  const fileRef = useRef();
  const inputRef = useRef();
  const recRef = useRef();

  // ── HELPERS ──
  const notify = (msg, type="ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"ok" }), 3200);
  };

  const getUserId = () => user?.uid || "guest";

  const canSend = () => isPremium || dailyCount < FREE_DAILY;
  const remaining = () => isPremium ? "∞" : Math.max(0, FREE_DAILY - dailyCount);
  const getPremiumLabel = () => {
    if(!isPremium) return null;
    if(premiumExpiry === "lifetime") return "∞ Lifetime";
    return `${Math.ceil((new Date(premiumExpiry)-new Date())/86400000)}d left`;
  };

  // ── THEME APPLY ──
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--fontSize", fontSize+"px");
    const ff = FONT_OPTIONS.find(f=>f.id===fontFamily);
    if(ff) document.documentElement.style.setProperty("--font", ff.family);
  }, [fontSize, fontFamily]);

  // ── PWA ──
  useEffect(() => {
    const sa = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone || false;
    setIsStandalone(sa);
    const h = e => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', h);
    window.addEventListener('appinstalled', () => notify("✅ FIZUX installed!"));
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  // ── LOAD PREFS ──
  useEffect(() => {
    (async () => {
      try {
        const th = await window.storage.get("fizux:theme").catch(()=>null);
        if(th) setTheme(th.value);
        const ff = await window.storage.get("fizux:font").catch(()=>null);
        if(ff) setFontFamily(ff.value);
        const fs = await window.storage.get("fizux:fs").catch(()=>null);
        if(fs) setFontSize(parseInt(fs.value)||14);
        const ci = await window.storage.get("fizux:ci").catch(()=>null);
        if(ci) setCustomInstr(ci.value);
        const keys = await window.storage.get("fizux:apikeys").catch(()=>null);
        if(keys) setApiKeys(JSON.parse(keys.value));
        const uc = await window.storage.get("fizux:uc").catch(()=>null);
        if(uc) setUseCase(uc.value);
        const count = await getDailyCount(); setDailyCount(count);
      } catch {}
    })();
  }, []);

  // ── SESSION RESTORE ──
  useEffect(() => {
    (async () => {
      try {
        const s = await window.storage.get(SESSION_KEY).catch(()=>null);
        if(s) {
          const saved = JSON.parse(s.value);
          setUser(saved);
          await loadUserData(saved.uid);
          setScreen("chat");
        } else {
          setScreen("login");
        }
      } catch(e) {
        setScreen("login");
      }
    })();
  }, []);

;

  const loadUserData = async (uid) => {
    try {
      const chd = await window.storage.get(`fizux:chats:${uid}`).catch(()=>null);
      if(chd) setChats(JSON.parse(chd.value));
      const pd = await window.storage.get(`fizux:premium:${uid}`).catch(()=>null);
      if(pd) {
        const p = JSON.parse(pd.value);
        const ok = p.expiry==="lifetime" || new Date(p.expiry)>new Date();
        if(ok) { setIsPremium(true); setPremiumVersion(p.version); setPremiumExpiry(p.expiry); }
      }
      const uc = await window.storage.get(`fizux:uc:${uid}`).catch(()=>null);
      if(uc) setUseCase(uc.value);
      else setShowOnboard(true);
      const count = await getDailyCount(); setDailyCount(count);
    } catch {}
  };

  // ── GOOGLE LOGIN ──
  const loginWithGoogle = async () => {
    setLoginLoading(true); setLoginError("");
    try {
      const uid = "google_" + Date.now();
      const u = { uid, name:"Google User", email:"user@gmail.com", photo:"", method:"google" };
      setUser(u);
      await window.storage.set(SESSION_KEY, JSON.stringify(u));
      await window.storage.set(`fizux:user:${uid}`, JSON.stringify({...u, lastLogin:new Date().toISOString()}), true).catch(()=>{});
      await loadUserData(uid);
      setScreen("chat");
      notify("✓ Welcome to FIZUX!");
    } catch(e) {
      setLoginError("Login failed. Please try again.");
    }
    setLoginLoading(false);
  };

  // ── UKEY LOGIN (in Settings) ──
  const activateUkey = async () => {
    const key = ukeyInput.trim().toUpperCase();
    if(!key) { setUkeyError("Enter your Ukey"); return; }
    setUkeyLoading(true); setUkeyError("");
    try {
      const d = await window.storage.get(`afzux:ukey:${key}`, true).catch(()=>null);
      if(!d) { setUkeyError("Invalid Ukey — contact dofizuxai@gmail.com"); setUkeyLoading(false); return; }
      const uk = JSON.parse(d.value);
      if(uk.blocked) { setUkeyError("This Ukey has been blocked"); setUkeyLoading(false); return; }
      if(uk.expiry !== "never" && new Date(uk.expiry) < new Date()) { setUkeyError("This Ukey has expired"); setUkeyLoading(false); return; }
      uk.used = true; uk.lastLogin = new Date().toISOString(); uk.usedBy = getUserId();
      await window.storage.set(`afzux:ukey:${key}`, JSON.stringify(uk), true);
      const expiry = uk.expiry === "never" ? "lifetime" : uk.expiry;
      const pd = { version:uk.version, expiry, activatedAt:new Date().toISOString(), ukey:key };
      const uid = getUserId();
      await window.storage.set(`fizux:premium:${uid}`, JSON.stringify(pd));
      setIsPremium(true); setPremiumVersion(uk.version); setPremiumExpiry(expiry);
      setUkeyInput(""); setUkeyError("");
      notify(`🎉 ${uk.version} Premium activated!`);
    } catch(e) { setUkeyError("Error activating. Try again."); }
    setUkeyLoading(false);
  };

  // ── LOGOUT ──
  const logout = async () => {
    await window.storage.delete(SESSION_KEY).catch(()=>{});
    setUser(null); setMessages([]); setChats([]); setIsPremium(false);
    setScreen("login");
  };

  // ── FILE PROCESSING ──
  const processFile = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    const name = file.name;
    try {
      if(["jpg","jpeg","png","gif","webp"].includes(ext)) {
        const b64 = await new Promise((r,j)=>{const fr=new FileReader();fr.onload=e=>r(e.target.result);fr.onerror=j;fr.readAsDataURL(file);});
        setAttachments(p => [...p, {type:"image", name, data:b64, mediaType:file.type}]);
      } else if(ext === "docx") {
        const ab = await file.arrayBuffer();
        const r = await mammoth.extractRawText({arrayBuffer:ab});
        setAttachments(p => [...p, {type:"doc", name, data:r.value.slice(0,12000)}]);
      } else if(["xlsx","xls"].includes(ext)) {
        const ab = await file.arrayBuffer();
        const wb = XLSX.read(ab, {type:"array"});
        let text = "";
        wb.SheetNames.forEach(sn => { text += `\n=== ${sn} ===\n` + XLSX.utils.sheet_to_csv(wb.Sheets[sn]); });
        setAttachments(p => [...p, {type:"excel", name, data:text.slice(0,12000)}]);
      } else {
        const text = await new Promise((r,j)=>{const fr=new FileReader();fr.onload=e=>r(e.target.result);fr.onerror=j;fr.readAsText(file);});
        setAttachments(p => [...p, {type:"text", name, data:text.slice(0,12000)}]);
      }
      notify(`↑ ${name}`);
    } catch { notify(`✗ Could not read ${name}`, "err"); }
  };

  // ── DETECT FEATURE FROM INPUT ──
  const handleInputChange = (val) => {
    setInput(val);
    if(val.length > 5) {
      const f = detectFeature(val);
      setDetectedFeature(f);
    } else {
      setDetectedFeature(null);
    }
  };

  // ── SEND MESSAGE ──
  const send = async (overrideText) => {
    const userText = overrideText || input.trim();
    if(!userText && !attachments.length) return;
    if(loading) return;
    if(!canSend()) { setShowLimitModal(true); return; }

    // Build message content
    const parts = [];
    for(const att of attachments) {
      if(att.type === "image") {
        parts.push({type:"image", source:{type:"base64", media_type:att.mediaType, data:att.data.split(",")[1]}});
        parts.push({type:"text", text:`[Image: ${att.name}]`});
      } else {
        parts.push({type:"text", text:`[${att.type.toUpperCase()}: ${att.name}]\n${att.data}\n`});
      }
    }
    parts.push({type:"text", text:userText});

    const display = attachments.length > 0
      ? `${attachments.map(a=>`📎 ${a.name}`).join(" · ")}\n${userText}`
      : userText;

    // Detect feature
    const feature = detectFeature(userText);
    const system = feature
      ? getSmartPrompt(feature, userText, parts.find(p=>p.type==="text"&&p.text!==userText)?.text||"")
      : `You are FIZUX — a brilliant AI assistant. ${customInstr ? `User preferences: ${customInstr}` : ""} Be helpful, accurate, and thorough.`;

    const userMsg = {role:"user", content:display, _api:parts.length>1?parts:userText, ts:Date.now(), feature:feature?.label};
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput(""); setAttachments([]); setFollowUps([]); setDetectedFeature(null);
    setLoading(true);

    try {
      const apiMsgs = newMsgs.slice(-30).map(m=>({role:m.role, content:m._api||m.content}));
      const result = await callAI(selectedModel, apiMsgs, {
        system, search:true, keys:apiKeys, userMessage:userText
      });

      // Detect if code/canvas content
      if(result.reply.includes("\u0060\u0060\u0060")) {
        setCanvasContent(result.reply);
      }

      // Deep think steps extraction
      if(selectedModel === "deep" || feature?.id === "deep_think") {
        const tm = result.reply.match(/<thinking>([\s\S]*?)<\/thinking>/);
        if(tm) { setThinkSteps(tm[1].split("\n").filter(s=>s.trim().length>3)); setShowDeepThink(true); }
      }

      const aiMsg = {role:"assistant", content:result.reply, model:result.model||selectedModel, searched:result.searched, feature:feature?.label, ts:Date.now()};
      const final = [...newMsgs, aiMsg];
      setMessages(final);

      // Follow-ups
      generateFollowUps(result.reply);

      // Bump counter
      const newCount = await bumpDaily();
      setDailyCount(newCount);

      // Save chat
      await saveChat(final, userText);

    } catch(e) {
      setMessages([...newMsgs, {
        role:"assistant",
        content:`❌ ${e.message || "Connection failed. Check internet and try again."}`,
        model:selectedModel, ts:Date.now()
      }]);
    }
    setLoading(false);
  };

  const saveChat = async (msgs, title) => {
    const uid = getUserId();
    const chatId = activeChat || Date.now().toString();
    if(!activeChat) setActiveChat(chatId);
    const s = {id:chatId, title:title.slice(0,55), date:new Date().toLocaleDateString(), messages:msgs.map(m=>({...m,_api:undefined}))};
    const updated = [s,...chats.filter(c=>c.id!==chatId)].slice(0,60);
    setChats(updated);
    await window.storage.set(`fizux:chats:${uid}`, JSON.stringify(updated)).catch(()=>{});
  };

  // ── COMPARE MODE SEND ──
  const sendCompare = async () => {
    const txt = input.trim();
    if(!txt || compareLoading) return;
    if(!canSend()) { setShowLimitModal(true); return; }
    setCompareLoading(true);
    setCompareResults({});
    const msgs = [{role:"user", content:txt}];
    const promises = compareModels.map(async (mId) => {
      try {
        const r = await callAI(mId, msgs, {system:"Be helpful and accurate.", keys:apiKeys, userMessage:txt});
        return [mId, r.reply];
      } catch(e) {
        return [mId, `Error: ${e.message}`];
      }
    });
    const results = await Promise.all(promises);
    const obj = {};
    results.forEach(([id,reply]) => obj[id]=reply);
    setCompareResults(obj);
    setInput("");
    await bumpDaily();
    setCompareLoading(false);
  };

  const generateFollowUps = async (reply) => {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:80,
          messages:[{role:"user", content:`Give 3 short follow-up questions (max 8 words each) for: "${reply.slice(0,200)}". JSON array only.`}]})
      });
      const data = await res.json();
      const qs = JSON.parse((data.content?.[0]?.text||"[]").replace(/\u0060\u0060\u0060json|\u0060\u0060\u0060/g,"").trim());
      setFollowUps(Array.isArray(qs) ? qs.slice(0,3) : []);
    } catch { setFollowUps([]); }
  };

  // ── VOICE ──
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return notify("Voice not supported", "err");
    const r = new SR(); r.lang="en-US"; r.continuous=true; r.interimResults=false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onresult = e => { let f=""; for(let i=e.resultIndex;i<e.results.length;i++) if(e.results[i].isFinal) f+=e.results[i][0].transcript; if(f) setInput(p=>p+f); };
    r.onerror = () => setListening(false);
    recRef.current = r; r.start();
  };
  const stopVoice = () => { recRef.current?.stop(); setListening(false); };

  // ── NEW CHAT ──
  const newChat = async () => {
    if(messages.length) await saveChat(messages, messages[0]?.content?.slice(0,55)||"Chat");
    setMessages([]); setActiveChat(null); setSidebarOpen(false);
    setFollowUps([]); setThinkSteps([]); setCompareResults({});
    setCanvasContent(""); setDetectedFeature(null);
    inputRef.current?.focus();
  };

  const deleteChat = async (id) => {
    const u = chats.filter(c=>c.id!==id); setChats(u);
    await window.storage.set(`fizux:chats:${getUserId()}`, JSON.stringify(u)).catch(()=>{});
    if(activeChat===id) { setMessages([]); setActiveChat(null); }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages, loading]);

  // ════════════════════════════════════════════
  // ── CSS STYLES ──
  // ════════════════════════════════════════════
  const S = {
    // Inputs
    input: (extra={}) => ({
      background:"var(--card)",
      border:"1.5px solid var(--border)",
      borderRadius:"var(--radiusSm)",
      padding:"11px 16px",
      color:"var(--text)",
      fontSize:"var(--fontSize)",
      fontFamily:"var(--font)",
      width:"100%",
      boxSizing:"border-box",
      outline:"none",
      transition:"border 0.2s",
      ...extra
    }),
    // Buttons
    btnGold: (extra={}) => ({
      padding:"12px 20px",
      borderRadius:"var(--radiusSm)",
      border:"none",
      background:"var(--gradGold)",
      color:"#1A1000",
      fontWeight:700,
      fontSize:"14px",
      cursor:"pointer",
      fontFamily:"var(--font)",
      boxShadow:"var(--shadowGold)",
      transition:"opacity 0.2s, transform 0.1s",
      ...extra
    }),
    btnGhost: (extra={}) => ({
      padding:"8px 14px",
      borderRadius:"var(--radiusSm)",
      border:"1px solid var(--border)",
      background:"transparent",
      color:"var(--textSub)",
      fontSize:"12px",
      cursor:"pointer",
      fontFamily:"var(--font)",
      transition:"all 0.15s",
      ...extra
    }),
    btnIcon: (extra={}) => ({
      padding:"7px 9px",
      borderRadius:"8px",
      border:"1px solid var(--border)",
      background:"transparent",
      color:"var(--textMuted)",
      fontSize:"14px",
      cursor:"pointer",
      display:"flex", alignItems:"center", justifyContent:"center",
      transition:"all 0.15s",
      ...extra
    }),
    // Cards
    card: (extra={}) => ({
      background:"var(--card)",
      border:"1px solid var(--border)",
      borderRadius:"var(--radius)",
      padding:"16px",
      ...extra
    }),
    // Badges
    badge: (color, extra={}) => ({
      background:color+"22",
      color:color,
      border:`1px solid ${color}44`,
      borderRadius:"6px",
      padding:"2px 8px",
      fontSize:"11px",
      fontWeight:600,
      display:"inline-block",
      ...extra
    }),
    // Modal overlay
    overlay: {
      position:"fixed", inset:0,
      background:"rgba(0,0,0,0.75)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:500, padding:"16px",
      backdropFilter:"blur(8px)",
    },
    modalBox: (extra={}) => ({
      background:"var(--card)",
      border:"1px solid var(--borderLight)",
      borderRadius:"20px",
      padding:"24px",
      maxWidth:"400px",
      width:"100%",
      maxHeight:"85vh",
      overflowY:"auto",
      boxShadow:"var(--shadowLg)",
      ...extra
    }),
  };

  const ce = (tag, props, ...children) => React.createElement(tag, props, ...children);

  // ── TOAST ──
  const Toast = () => !toast.msg ? null : ce("div", {
    style:{
      position:"fixed", top:isStandalone?"52px":"16px",
      left:"50%", transform:"translateX(-50%)",
      background:"var(--card)",
      border:`1.5px solid ${toast.type==="err"?"var(--red)":"var(--green)"}`,
      borderRadius:"12px", padding:"10px 20px",
      fontSize:"13px", fontWeight:500,
      color:toast.type==="err"?"var(--red)":"var(--green)",
      zIndex:9999, whiteSpace:"nowrap",
      boxShadow:"var(--shadowLg)",
      animation:"fadeUp 0.3s ease",
    }
  }, toast.msg);

  // ── MODEL BADGE ──
  const getModelInfo = (id) => AI_MODELS.find(m=>m.id===id) || AI_MODELS[0];

  // ── LOADING SCREEN ──
  if(screen === "loading") return ce(React.Fragment, null,
    ce("div", {style:{
      height:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      flexDirection:"column", gap:"16px", background:"var(--bg)"
    }},
      ce("div", {style:{
        width:"80px", height:"80px", borderRadius:"24px",
        background:"var(--gradGold)", display:"flex",
        alignItems:"center", justifyContent:"center",
        fontFamily:"var(--fontDisplay)", fontWeight:800, fontSize:"36px", color:"#1A1000",
        boxShadow:"var(--shadowGold)", animation:"float 2s ease-in-out infinite"
      }}, "F"),
      ce("div", {style:{fontFamily:"var(--fontDisplay)", fontSize:"28px", fontWeight:800}}, "FIZUX"),
      ce("div", {style:{fontSize:"13px", color:"var(--textMuted)"}}, "Your Personal AI Universe"),
      ce("div", {style:{display:"flex", gap:"8px", marginTop:"8px"}},
        [0,1,2].map(i => ce("div", {key:i, style:{
          width:"8px", height:"8px", borderRadius:"50%",
          background:"var(--accent)",
          animation:`bounce 1.2s infinite ${i*0.2}s`
        }}))
      )
    )
  );

  // ── LOGIN SCREEN ──
  if(screen === "login") return ce(React.Fragment, null,
    ce(Toast),
    ce("div", {style:{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      padding:"20px", paddingTop: isStandalone?"52px":"20px",
      background:"var(--bg)",
    }},
      // BG orbs
      ce("div", {style:{position:"fixed",top:"-100px",right:"-100px",width:"400px",height:"400px",borderRadius:"50%",background:"var(--gradGold)",opacity:"0.04",filter:"blur(80px)",pointerEvents:"none"}}),
      ce("div", {style:{position:"fixed",bottom:"-80px",left:"-80px",width:"300px",height:"300px",borderRadius:"50%",background:"var(--gradPurple)",opacity:"0.06",filter:"blur(60px)",pointerEvents:"none"}}),

      ce("div", {style:{width:"100%", maxWidth:"400px", animation:"fadeUp 0.4s ease"}},
        // Logo
        ce("div", {style:{textAlign:"center", marginBottom:"32px"}},
          ce("div", {style:{
            width:"80px",height:"80px",borderRadius:"24px",
            background:"var(--gradGold)",display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"var(--fontDisplay)",fontWeight:800,fontSize:"36px",color:"#1A1000",
            margin:"0 auto 16px",boxShadow:"var(--shadowGold)"
          }}, "F"),
          ce("div", {style:{fontFamily:"var(--fontDisplay)",fontSize:"30px",fontWeight:800,marginBottom:"6px"}}, "FIZUX"),
          ce("div", {style:{fontSize:"14px",color:"var(--textMuted)"}}, "Your Personal AI Universe"),
          ce("div", {style:{fontSize:"11px",color:"var(--textDim)",marginTop:"4px"}}, BRAND.copy)
        ),

        ce("div", {style:{...S.card({padding:"28px",borderRadius:"22px"}),boxShadow:"var(--shadowLg)"}},
          // Google button
          ce("button", {
            onClick:loginWithGoogle, disabled:loginLoading,
            style:{
              width:"100%",padding:"14px 18px",borderRadius:"14px",
              border:"1.5px solid var(--borderLight)",
              background:"var(--surface)",color:"var(--text)",
              fontWeight:600,fontSize:"15px",cursor:"pointer",
              fontFamily:"var(--font)",
              display:"flex",alignItems:"center",justifyContent:"center",gap:"14px",
              marginBottom:"20px",
              transition:"all 0.15s",
              opacity:loginLoading?0.7:1,
            }
          },
            loginLoading
              ? ce("div", {className:"spinner"})
              : ce("svg", {width:20,height:20,viewBox:"0 0 24 24"},
                  ce("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),
                  ce("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),
                  ce("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"}),
                  ce("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"})
                ),
            loginLoading ? "Signing in..." : "Continue with Google"
          ),

          loginError && ce("div",{style:{color:"var(--red)",fontSize:"12px",textAlign:"center",marginBottom:"14px"}},loginError),

          // Free plan info
          ce("div", {style:{
            ...S.card({padding:"14px",borderRadius:"14px",borderColor:"rgba(46,204,138,0.3)",background:"rgba(46,204,138,0.06)",marginBottom:"20px"})
          }},
            ce("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--green)",marginBottom:"6px"}},"🆓 Free Plan — No setup needed:"),
            ["50 AI messages per day","Claude · Gemini · DeepSeek · HuggingFace","Image generation, voice input","All basic features included"].map(t=>
              ce("div",{key:t,style:{fontSize:"12px",color:"var(--textSub)",padding:"2px 0"}},`✓ ${t}`)
            )
          ),

          // Divider
          ce("div",{style:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"14px"}},
            ce("div",{style:{flex:1,height:"1px",background:"var(--border)"}}),
            ce("span",{style:{fontSize:"11px",color:"var(--textDim)"}},"Premium? Enter Ukey in Settings"),
            ce("div",{style:{flex:1,height:"1px",background:"var(--border)"}})
          ),

          // Contact for premium
          ce("div",{style:{
            textAlign:"center",padding:"12px",
            background:"var(--accentSoft)",borderRadius:"12px",
            border:"1px solid rgba(201,168,76,0.2)"
          }},
            ce("div",{style:{fontSize:"12px",color:"var(--accent)",fontWeight:600,marginBottom:"4px"}},"✦ Want Premium Ukey?"),
            ce("a",{href:BRAND.support,style:{fontSize:"12px",color:"var(--textSub)",textDecoration:"none"}},
              `Email: ${BRAND.contact}`
            )
          )
        )
      )
    )
  );

  // ── ONBOARDING MODAL ──
  const OnboardModal = () => ce("div",{style:S.overlay},
    ce("div",{style:{...S.modalBox({maxWidth:"480px"}),animation:"fadeUp 0.3s ease"}},
      ce("div",{style:{textAlign:"center",marginBottom:"20px"}},
        ce("div",{style:{fontSize:"36px",marginBottom:"10px"}},"👋"),
        ce("div",{style:{fontFamily:"var(--fontDisplay)",fontWeight:800,fontSize:"22px",marginBottom:"6px"}},`Welcome, ${user?.name?.split(" ")[0] || "there"}!`),
        ce("div",{style:{fontSize:"13px",color:"var(--textMuted)"}},"How will you mainly use FIZUX?")
      ),
      ce("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"16px"}},
        USE_CASES.map(uc => ce("button",{
          key:uc.id, onClick:()=>setUseCase(uc.id),
          style:{
            padding:"14px 12px",borderRadius:"14px",
            border:`2px solid ${useCase===uc.id?uc.color:"var(--border)"}`,
            background:useCase===uc.id?uc.color+"14":"var(--surface)",
            cursor:"pointer",textAlign:"left",transition:"all 0.15s",fontFamily:"var(--font)"
          }
        },
          ce("div",{style:{fontSize:"20px",marginBottom:"5px"}}),uc.icon,
          ce("div",{style:{fontSize:"12px",fontWeight:700,color:useCase===uc.id?uc.color:"var(--text)",marginBottom:"3px"}}),uc.title,
          ce("div",{style:{fontSize:"10px",color:"var(--textMuted)"}}),uc.desc
        ))
      ),
      useCase && ce("button",{
        onClick:async()=>{
          await window.storage.set(`fizux:uc:${getUserId()}`,useCase).catch(()=>{});
          await window.storage.set("fizux:uc",useCase).catch(()=>{});
          setShowOnboard(false);
          notify("✓ FIZUX personalized for you!");
        },
        style:S.btnGold({width:"100%",borderRadius:"14px",padding:"13px",marginBottom:"10px"})
      },"Let's go →"),
      ce("button",{
        onClick:async()=>{await window.storage.set(`fizux:uc:${getUserId()}`,"general").catch(()=>{});setShowOnboard(false);},
        style:{width:"100%",padding:"9px",background:"none",border:"none",color:"var(--textMuted)",cursor:"pointer",fontFamily:"var(--font)",fontSize:"13px"}
      },"Skip for now")
    )
  );

  // ── SETTINGS MODAL ──
  const SettingsModal = () => {
    const [settingsTab, setSettingsTab] = useState("account");
    const tabs = [
      {id:"account",label:"Account",icon:"◎"},
      {id:"ai",label:"AI Models",icon:"⚡"},
      {id:"appearance",label:"Look & Feel",icon:"◐"},
      {id:"premium",label:"Premium",icon:"✦"},
    ];

    return ce("div",{style:S.overlay},
      ce("div",{style:{...S.modalBox({maxWidth:"460px",maxHeight:"88vh"}),animation:"fadeUp 0.3s ease"}},
        // Header
        ce("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}},
          ce("div",{style:{fontFamily:"var(--fontDisplay)",fontWeight:700,fontSize:"18px"}},"Settings"),
          ce("button",{onClick:()=>setShowSettings(false),style:{background:"none",border:"none",color:"var(--textMuted)",cursor:"pointer",fontSize:"22px",lineHeight:1}},"✕")
        ),

        // Tabs
        ce("div",{style:{display:"flex",gap:"4px",marginBottom:"20px",background:"var(--surface)",borderRadius:"12px",padding:"4px"}},
          tabs.map(t => ce("button",{key:t.id,onClick:()=>setSettingsTab(t.id),style:{
            flex:1,padding:"7px 4px",borderRadius:"9px",border:"none",
            background:settingsTab===t.id?"var(--card)":"transparent",
            color:settingsTab===t.id?"var(--text)":"var(--textMuted)",
            fontWeight:settingsTab===t.id?600:400,fontSize:"11px",cursor:"pointer",
            fontFamily:"var(--font)",transition:"all 0.15s",
            boxShadow:settingsTab===t.id?"var(--shadow)":"none"
          }},t.icon+" "+t.label))
        ),

        // ── ACCOUNT TAB ──
        settingsTab==="account" && ce(React.Fragment,null,
          ce("div",{style:{...S.card({display:"flex",gap:"12px",alignItems:"center",marginBottom:"14px",borderColor:"rgba(201,168,76,0.25)"})}},
            user?.photo
              ? ce("img",{src:user.photo,style:{width:"44px",height:"44px",borderRadius:"50%",flexShrink:0}})
              : ce("div",{style:{width:"44px",height:"44px",borderRadius:"50%",background:"var(--gradGold)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"18px",color:"#1A1000",flexShrink:0}},
                  (user?.name||"U").charAt(0).toUpperCase()
                ),
            ce("div",{style:{flex:1,minWidth:0}},
              ce("div",{style:{fontWeight:700,fontSize:"14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}),user?.name,
              ce("div",{style:{fontSize:"11px",color:"var(--textMuted)",marginTop:"2px"}}),user?.email||"Google Account"
            ),
            isPremium && ce("span",{style:S.badge("#C9A84C",{fontSize:"10px"})},`✦ ${premiumVersion}`)
          ),

          // Daily usage
          ce("div",{style:{...S.card({padding:"14px",marginBottom:"14px"})}},
            ce("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px"}},
              ce("span",{style:{fontSize:"13px",fontWeight:600}},"Daily Messages"),
              ce("span",{style:{fontSize:"13px",fontWeight:700,color:isPremium?"var(--accent)":dailyCount>=FREE_DAILY?"var(--red)":"var(--green)"}}) isPremium ? "∞ Unlimited" : `${remaining()} / ${FREE_DAILY} left`
            ),
            !isPremium && ce(React.Fragment,null,
              ce("div",{style:{height:"5px",background:"var(--border)",borderRadius:"3px",overflow:"hidden",marginBottom:"6px"}},
                ce("div",{style:{height:"100%",width:`${Math.min(100,(dailyCount/FREE_DAILY)*100)}%`,background:dailyCount>=FREE_DAILY?"var(--red)":"var(--green)",borderRadius:"3px",transition:"width 0.3s"}})
              ),
              ce("div",{style:{fontSize:"10px",color:"var(--textMuted)"}}),`Resets at midnight · ${dailyCount}/${FREE_DAILY} used`
            )
          ),

          // Ukey activation
          ce("div",{style:{...S.card({padding:"14px",marginBottom:"14px",borderColor:"rgba(201,168,76,0.2)"})}},
            ce("div",{style:{fontSize:"11px",color:"var(--accent)",fontWeight:700,letterSpacing:"0.8px",marginBottom:"8px"}},"✦ ACTIVATE PREMIUM UKEY"),
            ce("div",{style:{fontSize:"11px",color:"var(--textMuted)",marginBottom:"10px"}}),`Get Ukey from: ${BRAND.contact}`,
            ce("div",{style:{display:"flex",gap:"8px",marginBottom:"6px"}},
              ce("input",{
                value:ukeyInput,
                onChange:e=>{setUkeyInput(e.target.value.toUpperCase());setUkeyError("");},
                onKeyDown:e=>e.key==="Enter"&&activateUkey(),
                placeholder:"Enter 20-char Ukey",
                style:{...S.input({flex:1,fontFamily:"var(--fontMono)",letterSpacing:"2px",textAlign:"center",fontSize:"12px",padding:"10px 12px",borderColor:ukeyError?"var(--red)":"var(--border)"})}
              }),
              ce("button",{onClick:activateUkey,disabled:ukeyLoading,style:S.btnGold({padding:"10px 14px",fontSize:"12px"})},
                ukeyLoading ? ce("div",{className:"spinner"}) : "Activate"
              )
            ),
            ukeyError && ce("div",{style:{color:"var(--red)",fontSize:"11px"}}),ukeyError
          ),

          ce("div",{style:{display:"flex",gap:"8px"}},
            ce("button",{
              onClick:async()=>{await window.storage.delete(`fizux:chats:${getUserId()}`).catch(()=>{});setChats([]);setMessages([]);setActiveChat(null);notify("Chats cleared");},
              style:S.btnGhost({flex:1,fontSize:"11px",color:"var(--red)"})
            },"✕ Clear Chats"),
            ce("button",{onClick:logout,style:S.btnGhost({flex:1,fontSize:"11px",color:"var(--red)"})},
              "↩ Logout"
            )
          )
        ),

        // ── AI MODELS TAB ──
        settingsTab==="ai" && ce(React.Fragment,null,
          ce("div",{style:{fontSize:"11px",color:"var(--textMuted)",marginBottom:"12px"}},"Add API keys to unlock more AI models. All keys are stored locally on your device."),
          [
            {id:"geminiKey",label:"Gemini API Key",link:"https://aistudio.google.com/app/apikey",free:true},
            {id:"deepseekKey",label:"DeepSeek API Key",link:"https://platform.deepseek.com",free:true},
            {id:"hfKey",label:"HuggingFace Token",link:"https://huggingface.co/settings/tokens",free:true},
            {id:"openrouterKey",label:"OpenRouter Key",link:"https://openrouter.ai/keys",free:false},
            {id:"openaiKey",label:"OpenAI API Key",link:"https://platform.openai.com/api-keys",free:false},
            {id:"grokKey",label:"Grok (xAI) Key",link:"https://console.x.ai",free:false},
          ].map(k => ce("div",{key:k.id,style:{marginBottom:"10px"}},
            ce("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"5px"}},
              ce("label",{style:{fontSize:"11px",color:"var(--textMuted)",fontWeight:600}},k.label),
              ce("div",{style:{display:"flex",gap:"6px",alignItems:"center"}},
                k.free && ce("span",{style:S.badge("#2ECC8A",{fontSize:"9px"})},"Free tier"),
                ce("a",{href:k.link,target:"_blank",style:{fontSize:"10px",color:"var(--blue)",textDecoration:"none"}},"Get key ↗")
              )
            ),
            ce("div",{style:{display:"flex",gap:"6px"}},
              ce("input",{
                type:"password",
                value:apiKeys[k.id]||"",
                onChange:e=>setApiKeys(p=>({...p,[k.id]:e.target.value})),
                placeholder:`Enter ${k.label}...`,
                style:S.input({flex:1,fontSize:"12px",padding:"9px 12px",fontFamily:"var(--fontMono)"})
              }),
              ce("button",{
                onClick:async()=>{
                  await window.storage.set("fizux:apikeys",JSON.stringify(apiKeys)).catch(()=>{});
                  notify("✓ Keys saved!");
                },
                style:S.btnGold({padding:"9px 14px",fontSize:"12px"})
              },"Save")
            )
          )),
          ce("div",{style:{...S.card({padding:"12px",marginTop:"10px",borderColor:"rgba(46,204,138,0.2)",background:"rgba(46,204,138,0.05)"})}},
            ce("div",{style:{fontSize:"12px",color:"var(--green)",fontWeight:600,marginBottom:"4px"}},"💡 Pro Tip"),
            ce("div",{style:{fontSize:"11px",color:"var(--textSub)"}},"On Auto mode, FIZUX picks the best AI for each task automatically.")
          )
        ),

        // ── APPEARANCE TAB ──
        settingsTab==="appearance" && ce(React.Fragment,null,
          // Theme
          ce("div",{style:{marginBottom:"16px"}},
            ce("div",{style:{fontSize:"11px",color:"var(--textMuted)",fontWeight:700,letterSpacing:"0.8px",marginBottom:"10px"}},"THEME"),
            ce("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}},
              [["dark","◐ Dark","#0A0A0F","#F0F0FF"],["light","☀ Light","#F8F8FC","#0A0A1A"]].map(([id,label,bg,text]) =>
                ce("button",{key:id,onClick:async()=>{setTheme(id);await window.storage.set("fizux:theme",id).catch(()=>{});},style:{
                  padding:"14px",borderRadius:"12px",
                  border:`2px solid ${theme===id?"var(--accent)":"var(--border)"}`,
                  background:bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"
                }},
                  ce("span",{style:{fontSize:"13px",color:text,fontWeight:theme===id?700:400}}),label
                )
              )
            )
          ),

          // Font style
          ce("div",{style:{marginBottom:"16px"}},
            ce("div",{style:{fontSize:"11px",color:"var(--textMuted)",fontWeight:700,letterSpacing:"0.8px",marginBottom:"10px"}},"FONT STYLE"),
            ce("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}},
              FONT_OPTIONS.map(f =>
                ce("button",{key:f.id,onClick:async()=>{setFontFamily(f.id);await window.storage.set("fizux:font",f.id).catch(()=>{});},style:{
                  padding:"10px",borderRadius:"10px",
                  border:`2px solid ${fontFamily===f.id?"var(--accent)":"var(--border)"}`,
                  background:fontFamily===f.id?"var(--accentSoft)":"var(--surface)",
                  cursor:"pointer",fontFamily:f.family,fontSize:"12px",
                  color:fontFamily===f.id?"var(--accent)":"var(--textSub)"
                }},f.name)
              )
            )
          ),

          // Font size
          ce("div",{style:{marginBottom:"16px"}},
            ce("div",{style:{fontSize:"11px",color:"var(--textMuted)",fontWeight:700,letterSpacing:"0.8px",marginBottom:"10px"}},`FONT SIZE — ${fontSize}px`),
            ce("div",{style:{display:"flex",gap:"6px"}},
              FONT_SIZES.map(s =>
                ce("button",{key:s,onClick:async()=>{setFontSize(s);await window.storage.set("fizux:fs",String(s)).catch(()=>{});},style:{
                  flex:1,padding:"7px 0",borderRadius:"8px",
                  border:`1.5px solid ${fontSize===s?"var(--accent)":"var(--border)"}`,
                  background:fontSize===s?"var(--accent)":"transparent",
                  color:fontSize===s?"#1A1000":"var(--textSub)",
                  fontSize:"12px",cursor:"pointer",fontWeight:fontSize===s?700:400
                }},s)
              )
            )
          ),

          // Custom instructions
          ce("div",null,
            ce("div",{style:{fontSize:"11px",color:"var(--textMuted)",fontWeight:700,letterSpacing:"0.8px",marginBottom:"8px"}},"CUSTOM AI INSTRUCTIONS"),
            ce("textarea",{
              value:customInstr,
              onChange:e=>setCustomInstr(e.target.value),
              onBlur:async()=>{await window.storage.set("fizux:ci",customInstr).catch(()=>{});},
              placeholder:"e.g. Always reply in Hindi. Be concise. I'm a software developer...",
              rows:3,
              style:S.input({resize:"vertical",lineHeight:1.7})
            })
          )
        ),

        // ── PREMIUM TAB ──
        settingsTab==="premium" && ce(React.Fragment,null,
          isPremium
          ? ce("div",{style:{textAlign:"center",padding:"20px 0"}},
              ce("div",{style:{fontSize:"52px",marginBottom:"12px"}},"✦"),
              ce("div",{style:{fontWeight:800,fontSize:"22px",color:"var(--accent)",marginBottom:"8px"}}),premiumVersion,
              ce("span",{style:{...S.badge("#2ECC8A",{display:"inline-block",fontSize:"13px",padding:"6px 16px"})}}),getPremiumLabel(),
              ce("div",{style:{marginTop:"16px",fontSize:"13px",color:"var(--textMuted)"}}),`You have access to all FIZUX features. ${premiumExpiry!=="lifetime"?"Renew before expiry.":""}`
            )
          : ce(React.Fragment,null,
              ce("div",{style:{...S.card({padding:"16px",marginBottom:"14px",borderColor:"rgba(201,168,76,0.25)",background:"var(--accentSoft)"})}},
                ce("div",{style:{fontWeight:700,fontSize:"15px",color:"var(--accent)",marginBottom:"10px"}},"✦ Go Premium"),
                ["Unlimited messages (no daily limit)","Access to ALL AI models","Deep Think reasoning","Compare Mode — all AIs","Canvas & document editor","Priority Claude Sonnet","All 130+ features unlocked","Lifetime access available"].map(t =>
                  ce("div",{key:t,style:{fontSize:"12px",color:"var(--textSub)",padding:"3px 0"}}),`✓ ${t}`
                )
              ),
              ce("div",{style:{...S.card({padding:"14px",marginBottom:"14px"})}},
                ce("div",{style:{fontSize:"12px",color:"var(--textSub)",marginBottom:"12px"}}) "To get a Premium Ukey, email us and we'll send it to you:",
                ce("a",{href:BRAND.support,style:{display:"block",marginTop:"8px",padding:"10px",borderRadius:"10px",background:"var(--accentSoft)",border:"1px solid rgba(201,168,76,0.3)",textAlign:"center",textDecoration:"none",color:"var(--accent)",fontWeight:600,fontSize:"13px"}}) `✉ ${BRAND.contact}`
              ),
              ce("div",{style:{...S.card({padding:"14px",borderColor:"rgba(201,168,76,0.2)"})}},
                ce("div",{style:{fontSize:"11px",color:"var(--accent)",fontWeight:700,marginBottom:"8px"}}) "HAVE A UKEY? Activate in Account tab ↑"
              )
            )
        )
      )
    );
  };

  // ── COMPARE MODAL ──
  const CompareModal = () => ce("div",{style:{...S.overlay,alignItems:"flex-start",paddingTop:"20px"}},
    ce("div",{style:{...S.modalBox({maxWidth:"560px",maxHeight:"90vh"}),animation:"fadeUp 0.3s ease"}},
      ce("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}},
        ce("div",{style:{fontFamily:"var(--fontDisplay)",fontWeight:700,fontSize:"18px"}},"⚖ Compare All AIs"),
        ce("button",{onClick:()=>setShowCompare(false),style:{background:"none",border:"none",color:"var(--textMuted)",cursor:"pointer",fontSize:"22px"}},"✕")
      ),
      ce("div",{style:{fontSize:"12px",color:"var(--textMuted)",marginBottom:"14px"}},"Select AIs to compare, then type your question."),

      // Model selector
      ce("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"14px"}},
        AI_MODELS.filter(m=>!m.isAuto).map(m => {
          const selected = compareModels.includes(m.id);
          return ce("button",{key:m.id,onClick:()=>{
            setCompareModels(p => selected ? p.filter(x=>x!==m.id) : p.length<4?[...p,m.id]:p);
          },style:{
            padding:"6px 12px",borderRadius:"20px",
            border:`1.5px solid ${selected?m.color:"var(--border)"}`,
            background:selected?m.color+"18":"transparent",
            color:selected?m.color:"var(--textMuted)",
            fontSize:"11px",fontWeight:selected?700:400,cursor:"pointer",
            fontFamily:"var(--font)"
          }},m.icon+" "+m.name)
        })
      ),

      // Input
      ce("div",{style:{display:"flex",gap:"8px",marginBottom:"14px"}},
        ce("input",{
          value:input,onChange:e=>setInput(e.target.value),
          onKeyDown:e=>e.key==="Enter"&&sendCompare(),
          placeholder:"Ask all selected AIs...",
          style:S.input({flex:1})
        }),
        ce("button",{onClick:sendCompare,disabled:compareLoading||!input.trim(),style:{...S.btnGold({padding:"11px 16px",fontSize:"13px"}),opacity:compareLoading||!input.trim()?0.6:1}},
          compareLoading ? ce("div",{className:"spinner"}) : "Compare →"
        )
      ),

      // Results
      compareLoading && ce("div",{style:{textAlign:"center",padding:"24px",color:"var(--textMuted)"}},
        ce("div",{className:"spinner",style:{margin:"0 auto 12px"}}) "Asking all AIs..."
      ),
      Object.keys(compareResults).length > 0 && ce("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}},
        Object.entries(compareResults).map(([mId, reply]) => {
          const m = getModelInfo(mId);
          return ce("div",{key:mId,style:{...S.card({padding:"14px"}),borderLeft:`3px solid ${m.color}`}},
            ce("div",{style:{fontSize:"12px",fontWeight:700,color:m.color,marginBottom:"8px"}}),m.icon+" "+m.name,
            ce("div",{style:{fontSize:"var(--fontSize)",lineHeight:1.8,whiteSpace:"pre-wrap",wordBreak:"break-word",maxHeight:"200px",overflowY:"auto"}}),reply,
            ce("button",{onClick:()=>navigator.clipboard.writeText(reply).then(()=>notify("Copied!")),style:S.btnGhost({marginTop:"8px",fontSize:"11px",padding:"3px 8px"})},"Copy")
          );
        })
      )
    )
  );

  // ── LIMIT MODAL ──
  const LimitModal = () => ce("div",{style:S.overlay},
    ce("div",{style:{...S.modalBox(),animation:"fadeUp 0.3s ease",textAlign:"center"}},
      ce("div",{style:{fontSize:"48px",marginBottom:"12px"}},"⏰"),
      ce("div",{style:{fontWeight:800,fontSize:"20px",marginBottom:"8px"}},"Daily Limit Reached"),
      ce("div",{style:{fontSize:"13px",color:"var(--textMuted)",marginBottom:"20px"}}),`${FREE_DAILY} free messages used today. Resets at midnight.`,
      ce("button",{onClick:()=>{setShowLimitModal(false);setShowSettings(true);},style:S.btnGold({width:"100%",borderRadius:"14px",padding:"13px",marginBottom:"10px"})},"✦ Activate Premium Ukey"),
      ce("div",{style:{fontSize:"12px",color:"var(--textMuted)",marginBottom:"16px"}}),`Get Ukey from: ${BRAND.contact}`,
      ce("button",{onClick:()=>setShowLimitModal(false),style:S.btnGhost({width:"100%",textAlign:"center"})},"Come back tomorrow")
    )
  );

  // ── PWA MODAL ──
  const PWAModal = () => ce("div",{style:S.overlay},
    ce("div",{style:{...S.modalBox(),animation:"fadeUp 0.3s ease"}},
      ce("div",{style:{textAlign:"center",marginBottom:"20px"}},
        ce("div",{style:{width:"68px",height:"68px",borderRadius:"20px",background:"var(--gradGold)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fontDisplay)",fontWeight:800,fontSize:"30px",color:"#1A1000",margin:"0 auto 12px",boxShadow:"var(--shadowGold)"}},"F"),
        ce("div",{style:{fontWeight:800,fontSize:"19px",marginBottom:"4px"}},"Install FIZUX"),
        ce("div",{style:{fontSize:"13px",color:"var(--textMuted)"}},"Add to home screen for app experience")
      ),
      installPrompt
        ? ce("button",{onClick:async()=>{installPrompt.prompt();const{outcome}=await installPrompt.userChoice;if(outcome==="accepted"){setShowPWA(false);notify("✅ FIZUX installed!");}},style:S.btnGold({width:"100%",borderRadius:"14px",padding:"13px",marginBottom:"10px"})},"📲 Install FIZUX Now")
        : ce("div",{style:{...S.card({padding:"14px",marginBottom:"12px"})}},
            ce("div",{style:{fontSize:"11px",color:"var(--accent)",fontWeight:700,marginBottom:"8px"}},"ANDROID (Chrome)"),
            ce("div",{style:{fontSize:"12px",color:"var(--textMuted)",lineHeight:1.8}},"1. Tap ⋮ menu\n2. \"Add to Home screen\"\n3. Tap \"Add\""),
            ce("div",{style:{fontSize:"11px",color:"var(--accent)",fontWeight:700,margin:"10px 0 8px"}},"iPHONE (Safari only)"),
            ce("div",{style:{fontSize:"12px",color:"var(--textMuted)",lineHeight:1.8}},"1. Tap Share ↑\n2. \"Add to Home Screen\"\n3. Tap \"Add\"")
          ),
      ce("button",{onClick:()=>setShowPWA(false),style:S.btnGhost({width:"100%",textAlign:"center"})},"Maybe later")
    )
  );

  // ── MESSAGE RENDERER ──
  const renderMsg = (msg, i) => {
    const isUser = msg.role === "user";
    const mInfo = !isUser ? getModelInfo(msg.model||"claude") : null;
    return ce("div",{key:i,style:{padding:"16px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}},
      ce("div",{style:{maxWidth:"720px",margin:"0 auto",padding:"0 16px"}},
        ce("div",{style:{display:"flex",gap:"12px",alignItems:"flex-start"}},
          // Avatar
          isUser
            ? (user?.photo
              ? ce("img",{src:user.photo,style:{width:"34px",height:"34px",borderRadius:"50%",flexShrink:0}})
              : ce("div",{style:{width:"34px",height:"34px",borderRadius:"50%",background:"var(--gradGold)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"14px",color:"#1A1000",flexShrink:0}},(user?.name||"U").charAt(0).toUpperCase()))
            : ce("div",{style:{width:"34px",height:"34px",borderRadius:"50%",background:`linear-gradient(135deg,${mInfo?.color||"#C9A84C"},${mInfo?.color||"#C9A84C"}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",color:"#fff",flexShrink:0}},mInfo?.icon||"F"),

          ce("div",{style:{flex:1,minWidth:0}},
            // Name row
            ce("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"5px",flexWrap:"wrap"}},
              ce("span",{style:{fontSize:"12px",fontWeight:700}}),isUser?(user?.name||"You"):"FIZUX",
              mInfo && ce("span",{style:S.badge(mInfo.color,{fontSize:"9px"})}),mInfo.icon+" "+mInfo.name,
              msg.searched && ce("span",{style:S.badge("#2ECC8A",{fontSize:"9px"})},"⊕ Web"),
              msg.feature && ce("span",{style:S.badge("#8B6FE8",{fontSize:"9px"})},"⚡ "+msg.feature),
              msg.ts && ce("span",{style:{fontSize:"10px",color:"var(--textDim)"}}),new Date(msg.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})
            ),
            // Message content
            ce("div",{style:{fontSize:"var(--fontSize)",lineHeight:1.85,whiteSpace:"pre-wrap",wordBreak:"break-word"}}),msg.content,

            // Action buttons
            !isUser && ce("div",{style:{display:"flex",gap:"4px",marginTop:"8px",flexWrap:"wrap"}},
              [
                ["Copy",()=>navigator.clipboard.writeText(msg.content).then(()=>notify("Copied!"))],
                ["▷ Read",()=>{const u=new SpeechSynthesisUtterance(msg.content.slice(0,400));window.speechSynthesis.speak(u);}],
                ["⊞ Canvas",()=>{setCanvasContent(msg.content);setShowCanvas(true);}],
              ].map(([label,fn]) => ce("button",{key:label,onClick:fn,style:{...S.btnIcon({padding:"3px 9px",fontSize:"11px",borderRadius:"7px"})}}),label)
            )
          )
        )
      )
    );
  };

  // ── CURRENT USE CASE ──
  const currentUC = USE_CASES.find(u=>u.id===useCase);
  const displayFeatures = activeCat==="all" ? ALL_FEATURES : ALL_FEATURES.filter(f=>f.cat===activeCat);

  // ════════════════════════════════════════════
  // ── MAIN APP UI ──
  // ════════════════════════════════════════════
  return ce("div",{
    id:"app",
    style:{height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",paddingTop:isStandalone?"44px":"0"},
    onDrop:e=>{e.preventDefault();Array.from(e.dataTransfer.files).forEach(f=>processFile(f));},
    onDragOver:e=>e.preventDefault(),
  },
    ce(Toast),

    // Modals
    showOnboard && ce(OnboardModal),
    showSettings && ce(SettingsModal),
    showCompare && ce(CompareModal),
    showLimitModal && ce(LimitModal),
    showPWA && ce(PWAModal),

    // Canvas panel
    showCanvas && ce("div",{style:{
      position:"fixed",right:0,top:0,bottom:0,
      width:Math.min(480,window.innerWidth*0.92),
      background:"var(--surface)",borderLeft:"1px solid var(--border)",
      zIndex:200,display:"flex",flexDirection:"column",
      boxShadow:"var(--shadowLg)",
      paddingBottom:isStandalone?"34px":"0"
    }},
      ce("div",{style:{padding:"14px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:"8px"}},
        ce("div",{style:{flex:1,fontWeight:700}},"⊞ Canvas"),
        ce("button",{onClick:()=>navigator.clipboard.writeText(canvasContent).then(()=>notify("Copied!")),style:S.btnGhost({fontSize:"11px",padding:"5px 10px"})},"Copy"),
        ce("button",{onClick:()=>setShowCanvas(false),style:{background:"none",border:"none",color:"var(--textMuted)",cursor:"pointer",fontSize:"20px"}},"✕")
      ),
      ce("textarea",{value:canvasContent,onChange:e=>setCanvasContent(e.target.value),style:{
        flex:1,background:"transparent",border:"none",padding:"16px",
        color:"var(--text)",fontSize:"13px",fontFamily:"var(--fontMono)",
        resize:"none",outline:"none",lineHeight:1.8
      }})
    ),

    // Deep Think panel
    showDeepThink && thinkSteps.length>0 && ce("div",{style:{
      position:"fixed",left:0,top:0,bottom:0,width:"280px",
      background:"var(--surface)",borderRight:"1px solid var(--borderLight)",
      zIndex:150,display:"flex",flexDirection:"column",boxShadow:"var(--shadowLg)",
      paddingTop:isStandalone?"44px":"0"
    }},
      ce("div",{style:{padding:"13px 14px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center"}},
        ce("div",{style:{flex:1,fontWeight:700,fontSize:"13px"}},"⬡ Thinking ({"+thinkSteps.length+"})"),
        ce("button",{onClick:()=>setShowDeepThink(false),style:{background:"none",border:"none",color:"var(--textMuted)",cursor:"pointer",fontSize:"18px"}},"✕")
      ),
      ce("div",{style:{flex:1,overflowY:"auto",padding:"12px"}},
        thinkSteps.map((s,i)=>ce("div",{key:i,style:{...S.card({padding:"10px 12px",marginBottom:"8px",borderLeft:"3px solid var(--purple)"}),fontSize:"12px",lineHeight:1.7}},s))
      )
    ),

    // ── SIDEBAR ──
    sidebarOpen && ce("div",{onClick:()=>setSidebarOpen(false),style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:98}}),
    ce("div",{style:{
      position:"fixed",left:0,top:0,bottom:0,
      width:sidebarOpen?"275px":"0",
      transition:"width 0.25s cubic-bezier(0.4,0,0.2,1)",
      overflow:"hidden",zIndex:99,
      background:"var(--surface)",borderRight:"1px solid var(--border)",
      paddingTop:isStandalone?"44px":"0",
    }},
      ce("div",{style:{width:"275px",height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}},
        // Sidebar header
        ce("div",{style:{padding:"14px 12px 8px",display:"flex",alignItems:"center",gap:"10px"}},
          ce("div",{style:{width:"32px",height:"32px",borderRadius:"10px",background:"var(--gradGold)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fontDisplay)",fontWeight:800,fontSize:"15px",color:"#1A1000"}},"F"),
          ce("span",{style:{fontFamily:"var(--fontDisplay)",fontWeight:700,fontSize:"15px",flex:1}},"FIZUX"),
          isPremium && ce("span",{style:S.badge("#C9A84C",{fontSize:"9px"})},getPremiumLabel()||"∞"),
          ce("button",{onClick:()=>setSidebarOpen(false),style:{background:"none",border:"none",color:"var(--textMuted)",cursor:"pointer",fontSize:"15px"}},"✕")
        ),

        // Daily counter
        !isPremium && ce("div",{style:{padding:"0 12px 8px"}},
          ce("div",{style:{...S.card({padding:"8px 12px",borderRadius:"10px",borderColor:dailyCount>=FREE_DAILY?"rgba(255,77,106,0.4)":"rgba(46,204,138,0.3)",background:dailyCount>=FREE_DAILY?"rgba(255,77,106,0.07)":"rgba(46,204,138,0.07)"})}},
            ce("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"11px"}},
              ce("span",{style:{color:"var(--textMuted)"}},"Free today:"),
              ce("span",{style:{fontWeight:700,color:dailyCount>=FREE_DAILY?"var(--red)":"var(--green)"}}),`${remaining()} left`
            )
          )
        ),

        ce("div",{style:{padding:"0 12px 8px"}},
          ce("button",{onClick:newChat,style:{width:"100%",padding:"9px 12px",borderRadius:"10px",border:"1px solid var(--border)",background:"var(--card)",color:"var(--text)",fontSize:"13px",cursor:"pointer",fontWeight:600,textAlign:"left",fontFamily:"var(--font)"}},"✎ New chat")
        ),

        // Feature categories
        ce("div",{style:{padding:"0 12px 4px"}},
          ce("div",{style:{fontSize:"9px",color:"var(--textMuted)",fontWeight:700,letterSpacing:"1.5px",marginBottom:"6px"}},"⚡ TOOLS"),
          ce("div",{style:{display:"flex",gap:"3px",flexWrap:"wrap",marginBottom:"4px"}},
            ["all","office","data","creative","social","edu","personal","marketing","ai","tools"].map(cat =>
              ce("button",{key:cat,onClick:()=>setActiveCat(cat),style:{
                padding:"2px 6px",borderRadius:"6px",
                border:`1px solid ${activeCat===cat?"var(--accent)":"var(--border)"}`,
                background:activeCat===cat?"var(--accentSoft)":"transparent",
                color:activeCat===cat?"var(--accent)":"var(--textMuted)",
                fontSize:"9px",cursor:"pointer",textTransform:"capitalize",fontFamily:"var(--font)"
              }},cat)
            )
          )
        ),

        ce("div",{style:{flex:1,overflowY:"auto",padding:"0 12px"}},
          displayFeatures.slice(0,24).map(f =>
            ce("button",{key:f.id,onClick:()=>{setInput(f.label+" — ");setSidebarOpen(false);inputRef.current?.focus();},
              style:{width:"100%",padding:"7px 8px",borderRadius:"9px",border:"none",background:"transparent",color:"var(--text)",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:"7px",marginBottom:"1px",transition:"background 0.15s",fontFamily:"var(--font)"}
            },
              ce("span",{style:{fontSize:"13px",color:"var(--textMuted)",flexShrink:0}}),f.icon,
              ce("div",{style:{flex:1,minWidth:0}},
                ce("div",{style:{fontSize:"11px",fontWeight:600,display:"flex",alignItems:"center",gap:"4px"}},
                  f.label,
                  !f.free && !isPremium && ce("span",{style:S.badge("#8B6FE8",{fontSize:"8px",padding:"0px 4px"})},"PRO"),
                  f.free && ce("span",{style:S.badge("#2ECC8A",{fontSize:"8px",padding:"0px 4px"})},"FREE")
                )
              )
            )
          ),

          chats.length > 0 && ce(React.Fragment,null,
            ce("div",{style:{fontSize:"9px",color:"var(--textMuted)",fontWeight:700,letterSpacing:"1.5px",padding:"10px 2px 5px"}},"RECENT CHATS"),
            chats.slice(0,12).map(c =>
              ce("div",{key:c.id,onClick:()=>{setMessages(c.messages);setActiveChat(c.id);setSidebarOpen(false);},
                style:{padding:"7px 8px",borderRadius:"9px",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",background:activeChat===c.id?"var(--card2)":"transparent",transition:"background 0.15s"}
              },
                ce("span",{style:{flex:1,fontSize:"11px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--textSub)"}},"▪ ",c.title),
                ce("button",{onClick:e=>{e.stopPropagation();deleteChat(c.id);},style:{background:"none",border:"none",color:"var(--textDim)",cursor:"pointer",fontSize:"10px",flexShrink:0}},"✕")
              )
            )
          )
        ),

        // Sidebar footer
        ce("div",{style:{borderTop:"1px solid var(--border)",padding:"10px 12px",paddingBottom:isStandalone?"28px":"10px"}},
          ce("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}},
            user?.photo
              ? ce("img",{src:user.photo,style:{width:"30px",height:"30px",borderRadius:"50%",flexShrink:0}})
              : ce("div",{style:{width:"30px",height:"30px",borderRadius:"50%",background:"var(--gradGold)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"13px",color:"#1A1000",flexShrink:0}},(user?.name||"U").charAt(0).toUpperCase()),
            ce("div",{style:{flex:1,minWidth:0}},
              ce("div",{style:{fontSize:"11px",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}),user?.name,
              ce("div",{style:{fontSize:"9px",color:"var(--textMuted)"}}),isPremium?`✦ ${premiumVersion}`:`Free · ${remaining()} msgs`
            )
          ),
          ce("div",{style:{display:"flex",gap:"4px"}},
            [["✦",()=>setShowSettings(true),"Premium"],["⚙",()=>setShowSettings(true),"Settings"],["⚖",()=>setShowCompare(true),"Compare"],["📲",()=>setShowPWA(true),"Install"],["↩",logout,"Logout"]].map(([icon,fn,title]) =>
              ce("button",{key:title,onClick:fn,title,style:{flex:1,background:"var(--card)",border:"1px solid var(--border)",borderRadius:"7px",padding:"5px 0",cursor:"pointer",fontSize:"12px",color:"var(--textMuted)",transition:"all 0.15s"}},icon)
            )
          )
        )
      )
    ),

    // ── HEADER ──
    ce("div",{style:{
      background:"var(--bg)",borderBottom:"1px solid var(--border)",
      padding:"0 12px",height:"50px",
      display:"flex",alignItems:"center",gap:"8px",flexShrink:0,
    }},
      // Hamburger
      ce("button",{onClick:()=>setSidebarOpen(!sidebarOpen),style:{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",gap:"4px",padding:"6px",borderRadius:"8px"}},
        [0,1,2].map(i=>ce("div",{key:i,style:{width:"17px",height:"2px",borderRadius:"2px",background:"var(--text)"}}))
      ),

      // Model selector
      ce("div",{style:{position:"relative"}},
        ce("button",{onClick:()=>setModelMenu(!modelMenu),style:{
          ...S.btnGhost({display:"flex",alignItems:"center",gap:"7px",padding:"6px 11px",borderRadius:"10px",color:"var(--text)",fontWeight:600,fontSize:"13px"})
        }},
          ce("span",{style:{color:getModelInfo(selectedModel).color,fontSize:"15px"}}),getModelInfo(selectedModel).icon,
          getModelInfo(selectedModel).name,
          ce("span",{style:{fontSize:"8px",color:"var(--textDim)"}},"▾")
        ),
        modelMenu && ce("div",{style:{
          position:"absolute",top:"calc(100%+4px)",left:0,
          background:"var(--card)",border:"1px solid var(--borderLight)",
          borderRadius:"16px",padding:"8px",zIndex:100,minWidth:"220px",
          boxShadow:"var(--shadowLg)"
        }},
          AI_MODELS.map(m =>
            ce("button",{key:m.id,onClick:()=>{setSelectedModel(m.id);setModelMenu(false);},style:{
              display:"flex",width:"100%",alignItems:"center",gap:"10px",
              padding:"10px 12px",borderRadius:"10px",border:"none",
              background:selectedModel===m.id?"var(--card2)":"transparent",
              cursor:"pointer",fontFamily:"var(--font)",
              transition:"background 0.15s"
            }},
              ce("span",{style:{fontSize:"16px",color:m.color,flexShrink:0}}),m.icon,
              ce("div",{style:{flex:1,textAlign:"left"}},
                ce("div",{style:{fontSize:"13px",fontWeight:600,color:"var(--text)"}}),m.name,
                ce("div",{style:{fontSize:"10px",color:"var(--textMuted)"}}),m.isAuto?"Auto-picks best AI for task":m.desc
              ),
              m.free && ce("span",{style:S.badge("#2ECC8A",{fontSize:"9px"})},"Free"),
              !m.free && !m.isAuto && ce("span",{style:S.badge("#8B6FE8",{fontSize:"9px"})},"Key")
            )
          )
        )
      ),

      currentUC && ce("button",{onClick:()=>setShowOnboard(true),style:S.badge(currentUC.color,{cursor:"pointer",padding:"4px 10px",fontSize:"11px"})},currentUC.icon+" "+currentUC.title),

      ce("div",{style:{flex:1}}),

      // Detected feature badge
      detectedFeature && ce("span",{style:{...S.badge("#8B6FE8",{fontSize:"10px",padding:"4px 10px",maxWidth:"120px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"})}},
        "⚡ "+detectedFeature.label
      ),

      // Message counter
      !isPremium && ce("button",{onClick:()=>setShowLimitModal(true),style:{...S.badge(dailyCount>=FREE_DAILY?"#FF4D6A":dailyCount>FREE_DAILY-10?"#FF8C42":"#2ECC8A",{cursor:"pointer",fontSize:"10px",padding:"4px 10px"})}},
        dailyCount>=FREE_DAILY ? "⏰ Limit" : `${remaining()} free`
      ),

      isPremium
        ? ce("span",{style:S.badge("#C9A84C",{fontSize:"11px",padding:"4px 10px"})},`✦ ${getPremiumLabel()||"Premium"}`)
        : ce("button",{onClick:()=>setShowSettings(true),style:{...S.btnGold({fontSize:"11px",padding:"6px 12px",borderRadius:"9px"}),boxShadow:"none"}},"✦ Upgrade"),

      ce("button",{onClick:()=>setShowCompare(true),style:{...S.btnIcon({padding:"6px 9px"}),color:"var(--blue)"}},
        "⚖"
      ),
      ce("button",{onClick:async()=>{const n=theme==="dark"?"light":"dark";setTheme(n);await window.storage.set("fizux:theme",n).catch(()=>{});},style:S.btnIcon({padding:"6px 9px"})},
        theme==="dark"?"☀":"◐"
      ),
      ce("button",{onClick:()=>setShowSettings(true),style:S.btnIcon({padding:"6px 9px"})},"⚙"),
      ce("button",{onClick:newChat,style:{...S.btnGold({fontSize:"11px",padding:"6px 12px",borderRadius:"9px"}),boxShadow:"none"}},"✎ New")
    ),

    // ── IMAGE PANEL ──
    imagePanel && ce("div",{style:{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"10px 14px",flexShrink:0}},
      ce("div",{style:{display:"flex",gap:"8px",marginBottom:genImages.length?"10px":"0"}},
        ce("input",{value:imagePrompt,onChange:e=>setImagePrompt(e.target.value),
          onKeyDown:e=>{if(e.key==="Enter"&&imagePrompt.trim()){const s=Math.floor(Math.random()*99999);setGenImages([`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?seed=${s}&width=768&height=768&nologo=true&enhance=true`,`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt+", professional high quality")}?seed=${s+1}&width=768&height=768&nologo=true&enhance=true`,`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt+", artistic cinematic")}?seed=${s+2}&width=768&height=768&nologo=true&enhance=true`]);notify("Generated!");}},
          placeholder:"Describe your image...",style:S.input({flex:1})
        }),
        ce("button",{onClick:()=>{if(!imagePrompt.trim())return;const s=Math.floor(Math.random()*99999);setGenImages([`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?seed=${s}&width=768&height=768&nologo=true&enhance=true`,`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt+", professional")}?seed=${s+1}&width=768&height=768&nologo=true&enhance=true`,`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt+", artistic")}?seed=${s+2}&width=768&height=768&nologo=true&enhance=true`]);notify("Generated!");},style:S.btnGold({padding:"10px 14px",fontSize:"13px"})},"Generate"),
        ce("button",{onClick:()=>{setImagePanel(false);setGenImages([]);},style:S.btnGhost({padding:"10px 11px"})},"✕")
      ),
      genImages.length>0 && ce("div",{style:{display:"flex",gap:"8px",overflowX:"auto",paddingBottom:"4px"}},
        genImages.map((url,i)=>ce("div",{key:i,style:{flexShrink:0}},
          ce("img",{src:url,alt:"",style:{width:"100px",height:"100px",borderRadius:"12px",objectFit:"cover",border:"1px solid var(--border)"},onError:e=>e.target.style.display="none"}),
          ce("a",{href:url,download:true,style:{display:"block",textAlign:"center",fontSize:"9px",color:"var(--textMuted)",marginTop:"3px",textDecoration:"none"}},"↓ Save")
        ))
      )
    ),

    // ── CHAT AREA ──
    ce("div",{style:{flex:1,overflowY:"auto",paddingBottom:"8px"},onClick:()=>setModelMenu(false)},
      messages.length === 0
        ? ce("div",{style:{maxWidth:"720px",margin:"0 auto",padding:"24px 16px"}},
            // Hero
            ce("div",{style:{textAlign:"center",marginBottom:"26px"}},
              ce("div",{style:{width:"72px",height:"72px",borderRadius:"22px",background:"var(--gradGold)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fontDisplay)",fontWeight:800,fontSize:"32px",color:"#1A1000",margin:"0 auto 14px",animation:"float 3s ease-in-out infinite",boxShadow:"var(--shadowGold)"}},"F"),
              ce("div",{style:{fontFamily:"var(--fontDisplay)",fontWeight:800,fontSize:"22px",marginBottom:"6px"}}) currentUC?`${currentUC.icon} ${currentUC.title} Mode`:"FIZUX AI Universe",
              ce("div",{style:{fontSize:"12px",color:"var(--textMuted)",marginBottom:"10px"}}) "10+ AI Models · 130+ Features · Smart Auto-Selection",
              ce("div",{style:{display:"inline-flex",gap:"6px",flexWrap:"wrap",justifyContent:"center"}},
                !isPremium && ce("span",{style:S.badge(dailyCount>=FREE_DAILY?"#FF4D6A":"#2ECC8A",{fontSize:"11px",padding:"4px 12px"})}) dailyCount>=FREE_DAILY?"⏰ Limit reached":`🆓 ${remaining()} free messages today`,
                isStandalone && ce("span",{style:S.badge("#4A9EFF",{fontSize:"11px",padding:"4px 12px",marginLeft:"4px"})},"◎ App Mode")
              )
            ),

            // AI Models row
            ce("div",{style:{fontSize:"10px",color:"var(--textMuted)",fontWeight:700,letterSpacing:"1.2px",marginBottom:"10px"}},"⚡ AI MODELS"),
            ce("div",{style:{display:"flex",gap:"6px",overflowX:"auto",paddingBottom:"4px",marginBottom:"20px"}},
              AI_MODELS.map(m =>
                ce("button",{key:m.id,onClick:()=>setSelectedModel(m.id),style:{
                  padding:"8px 14px",borderRadius:"20px",flexShrink:0,
                  border:`1.5px solid ${selectedModel===m.id?m.color:"var(--border)"}`,
                  background:selectedModel===m.id?m.color+"14":"var(--card)",
                  color:selectedModel===m.id?m.color:"var(--textSub)",
                  fontSize:"11px",fontWeight:selectedModel===m.id?700:400,cursor:"pointer",
                  fontFamily:"var(--font)",display:"flex",alignItems:"center",gap:"5px"
                }},
                  ce("span",{style:{fontSize:"12px"}}),m.icon,m.name
                )
              )
            ),

            // Feature categories
            ce("div",{style:{fontSize:"10px",color:"var(--textMuted)",fontWeight:700,letterSpacing:"1.2px",marginBottom:"8px"}},"🛠 FEATURES"),
            ce("div",{style:{display:"flex",gap:"4px",flexWrap:"wrap",marginBottom:"10px"}},
              ["all","office","data","creative","social","edu","personal","marketing","ai","tools"].map(cat =>
                ce("button",{key:cat,onClick:()=>setActiveCat(cat),style:{
                  padding:"4px 10px",borderRadius:"16px",
                  border:`1px solid ${activeCat===cat?"var(--accent)":"var(--border)"}`,
                  background:activeCat===cat?"var(--accentSoft)":"transparent",
                  color:activeCat===cat?"var(--accent)":"var(--textMuted)",
                  fontSize:"10px",cursor:"pointer",textTransform:"capitalize",fontFamily:"var(--font)"
                }},cat)
              )
            ),
            ce("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(105px,1fr))",gap:"7px",marginBottom:"22px"}},
              displayFeatures.slice(0,12).map(f =>
                ce("button",{key:f.id,onClick:()=>{setInput(f.label+" — ");inputRef.current?.focus();},style:{
                  ...S.card({padding:"13px 11px"}),cursor:"pointer",textAlign:"left",
                  position:"relative",transition:"all 0.15s",fontFamily:"var(--font)"
                }},
                  !f.free && !isPremium && ce("span",{style:{position:"absolute",top:"7px",right:"7px",...S.badge("#8B6FE8",{fontSize:"8px",padding:"1px 4px"})}},"PRO"),
                  ce("div",{style:{fontSize:"18px",marginBottom:"5px",color:"var(--textMuted)"}}),f.icon,
                  ce("div",{style:{fontSize:"10px",fontWeight:700,lineHeight:1.3}}),f.label
                )
              )
            ),

            // Quick starts
            ce("div",{style:{fontSize:"10px",color:"var(--textMuted)",fontWeight:700,letterSpacing:"1.2px",marginBottom:"10px"}},"💡 QUICK START"),
            ce("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}},
              [
                ["💬","Ask me anything","Just type naturally"],
                ["✉","Write an email","For any context"],
                ["◐","Generate an image","AI art instantly"],
                ["◉","I need support","Talk to me"],
              ].map(([icon,title,sub]) =>
                ce("button",{key:title,onClick:()=>{setInput(title+" — ");inputRef.current?.focus();},style:{...S.card({padding:"13px 14px"}),cursor:"pointer",textAlign:"left",transition:"all 0.15s",fontFamily:"var(--font)"}},
                  ce("div",{style:{fontSize:"18px",marginBottom:"5px"}}),icon,
                  ce("div",{style:{fontSize:"13px",fontWeight:700,marginBottom:"3px"}}),title,
                  ce("div",{style:{fontSize:"10px",color:"var(--textMuted)"}}),sub
                )
              )
            )
          )
        : ce("div",null,
            messages.map((msg,i) => renderMsg(msg,i)),
            loading && ce("div",{style:{padding:"16px 0"}},
              ce("div",{style:{maxWidth:"720px",margin:"0 auto",padding:"0 16px"}},
                ce("div",{style:{display:"flex",gap:"12px",alignItems:"center"}},
                  ce("div",{style:{width:"34px",height:"34px",borderRadius:"50%",background:`linear-gradient(135deg,${getModelInfo(selectedModel).color},${getModelInfo(selectedModel).color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",color:"#fff"}}),getModelInfo(selectedModel).icon,
                  ce("div",{style:{display:"flex",gap:"5px",alignItems:"center"}},
                    [0,1,2].map(i=>ce("div",{key:i,style:{width:"7px",height:"7px",borderRadius:"50%",background:"var(--textMuted)",animation:`bounce 1.2s infinite ${i*0.2}s`}}))
                  )
                )
              )
            ),
            followUps.length>0 && !loading && ce("div",{style:{maxWidth:"720px",margin:"0 auto",padding:"8px 16px 0"}},
              ce("div",{style:{fontSize:"10px",color:"var(--textMuted)",marginBottom:"6px",fontWeight:600}},"💡 You might also ask:"),
              ce("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"}},
                followUps.map((q,i)=>ce("button",{key:i,onClick:()=>send(q),style:{...S.btnGhost({fontSize:"11px",borderRadius:"16px",padding:"5px 12px",maxWidth:"260px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"})}}),q)
              )
            ),
            ce("div",{ref:bottomRef})
          )
    ),

    // ── INPUT AREA ──
    ce("div",{style:{padding:"0 14px",paddingBottom:isStandalone?"28px":"12px",flexShrink:0}},
      ce("div",{style:{maxWidth:"720px",margin:"0 auto"}},
        // Attachments
        attachments.length>0 && ce("div",{style:{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"7px"}},
          attachments.map((a,i)=>ce("div",{key:i,style:{...S.card({padding:"5px 11px",borderRadius:"9px"}),display:"flex",alignItems:"center",gap:"5px"}},
            ce("span",{style:{fontSize:"12px"}}),a.type==="image"?"🖼":"📄",
            ce("span",{style:{fontSize:"11px",maxWidth:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}),a.name,
            ce("button",{onClick:()=>setAttachments(p=>p.filter((_,j)=>j!==i)),style:{background:"none",border:"none",color:"var(--textMuted)",cursor:"pointer",fontSize:"12px"}},"✕")
          ))
        ),

        // Detected feature
        detectedFeature && ce("div",{style:{...S.card({padding:"7px 12px",marginBottom:"7px",borderRadius:"10px",borderColor:"rgba(139,111,232,0.3)",background:"rgba(139,111,232,0.07)"})}},
          ce("div",{style:{fontSize:"11px",color:"var(--purple)",fontWeight:600}}),`⚡ Detected: ${detectedFeature.label} — FIZUX will use smart prompts for this`
        ),

        // Limit warning
        !isPremium && dailyCount >= FREE_DAILY-5 && dailyCount < FREE_DAILY && ce("div",{style:{...S.card({padding:"7px 12px",marginBottom:"7px",borderRadius:"10px",borderColor:"rgba(255,140,66,0.3)",background:"rgba(255,140,66,0.07)"})}},
          ce("span",{style:{fontSize:"11px",color:"var(--orange)"}}),`⚠ Only ${remaining()} free messages left today. `,
          ce("span",{style:{fontWeight:700,cursor:"pointer",textDecoration:"underline",color:"var(--accent)"},onClick:()=>setShowSettings(true)},"Get Premium →")
        ),

        // Main input box
        ce("div",{style:{
          background:"var(--card)",
          border:`2px solid ${listening?"var(--red)":"var(--border)"}`,
          borderRadius:"18px",padding:"11px 14px",
          boxShadow:"var(--shadow)",transition:"border 0.2s"
        }},
          dailyCount>=FREE_DAILY && !isPremium
            ? ce("div",{style:{padding:"8px 0",textAlign:"center",fontSize:"13px",color:"var(--textMuted)"}},
                "⏰ Daily limit reached. ",
                ce("span",{style:{color:"var(--accent)",cursor:"pointer",fontWeight:600},onClick:()=>setShowSettings(true)},"Get Premium Ukey"),
                " or come back tomorrow."
              )
            : ce("textarea",{
                ref:inputRef,
                value:input,
                onChange:e=>{handleInputChange(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,150)+"px";},
                onKeyDown:e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}},
                placeholder:listening?"🎤 Listening...":"Message FIZUX — just type naturally, AI understands everything...",
                rows:1,
                style:{width:"100%",background:"transparent",border:"none",color:"var(--text)",fontSize:"var(--fontSize)",fontFamily:"var(--font)",resize:"none",outline:"none",lineHeight:1.7,maxHeight:"150px",boxSizing:"border-box"}
              }),

          ce("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"9px"}},
            ce("div",{style:{display:"flex",gap:"4px"}},
              ce("input",{ref:fileRef,type:"file",onChange:e=>Array.from(e.target.files).forEach(f=>processFile(f)),style:{display:"none"},multiple:true,accept:"image/*,.txt,.csv,.json,.md,.pdf,.docx,.xlsx,.xls,.py,.js,.html,.css"}),
              [
                ["📎",()=>fileRef.current?.click(),false,"Attach file"],
                [listening?"🔴":"🎤",listening?stopVoice:startVoice,listening,"Voice input"],
                ["🖼",()=>setImagePanel(!imagePanel),imagePanel,"Image generator"],
                ["⊞",()=>{if(messages.length>0){setCanvasContent(messages[messages.length-1]?.content||"");setShowCanvas(true);}},false,"Canvas editor"],
                ["⚖",()=>setShowCompare(true),false,"Compare AIs"],
              ].map(([icon,fn,active,title],idx) =>
                ce("button",{key:idx,onClick:fn,title,style:{
                  ...S.btnIcon({padding:"5px 8px",borderRadius:"7px",
                  color:active?"var(--red)":"var(--textMuted)",
                  borderColor:active?"rgba(255,77,106,0.4)":"var(--border)",
                  background:active?"rgba(255,77,106,0.1)":"transparent",
                  fontSize:"14px"})
                }},icon)
              )
            ),

            ce("div",{style:{display:"flex",alignItems:"center",gap:"8px"}},
              !isPremium && ce("span",{style:{fontSize:"10px",color:"var(--textMuted)"}}),`${remaining()}/${FREE_DAILY}`,
              ce("button",{
                onClick:()=>send(),
                disabled:(!input.trim()&&!attachments.length)||loading||(dailyCount>=FREE_DAILY&&!isPremium),
                style:{
                  width:"36px",height:"36px",borderRadius:"50%",
                  background:(input.trim()||attachments.length)&&!loading&&(dailyCount<FREE_DAILY||isPremium)?"var(--gradGold)":"var(--card2)",
                  border:"1px solid var(--border)",
                  cursor:(input.trim()||attachments.length)&&!loading&&(dailyCount<FREE_DAILY||isPremium)?"pointer":"not-allowed",
                  fontSize:"15px",display:"flex",alignItems:"center",justifyContent:"center",
                  color:(input.trim()||attachments.length)&&!loading&&(dailyCount<FREE_DAILY||isPremium)?"#1A1000":"var(--textMuted)",
                  boxShadow:(input.trim()||attachments.length)&&!loading&&(dailyCount<FREE_DAILY||isPremium)?"var(--shadowGold)":"none",
                  transition:"all 0.2s"
                }
              },"↑")
            )
          )
        ),

        // Footer
        ce("div",{style:{textAlign:"center",marginTop:"5px",fontSize:"9px",color:"var(--textDim)"}}) `FIZUX v9.0 · 10+ AI Models · ${FREE_DAILY} free msg/day · ${BRAND.copy}`
      )
    )
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(FIZUXApp));
