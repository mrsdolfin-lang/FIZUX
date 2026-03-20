// AFZUX v4.0 - FIZUX Admin Dashboard
// Pure JS, no Babel, no JSX
(function(){
'use strict';
var h=React.createElement;
var useState=React.useState;
var useEffect=React.useEffect;

var MASTER_KEY='MHAG29NL04Q6391339919';

var VERSIONS=[
  {id:'v3',label:'v3.0 Standard',    color:'#8B6FE8',price:799, eb:299, desc:'Claude+Gemini, 35 Tools, AI Memory'},
  {id:'v4',label:'v4.0 Professional',color:'#C9A84C',price:1799,eb:699, desc:'DeepThink, Canvas, Compare, 60+ Tools'},
  {id:'v5',label:'v5.0 Ultimate',    color:'#FF6B9D',price:2999,eb:999, desc:'130+ Tools, All Features'},
  {id:'v6',label:'v6.0 Enterprise',  color:'#EF4060',price:5999,eb:1999,desc:'Source Code, White Label, Reseller'}
];

var DURATIONS=[
  {label:'3 Days',days:3},
  {label:'7 Days',days:7},
  {label:'15 Days',days:15},
  {label:'30 Days',days:30},
  {label:'1 Month',days:30},
  {label:'2 Months',days:60},
  {label:'3 Months',days:90},
  {label:'4 Months',days:120},
  {label:'5 Months',days:150},
  {label:'6 Months',days:180},
  {label:'7 Months',days:210},
  {label:'8 Months',days:240},
  {label:'9 Months',days:270},
  {label:'10 Months',days:300},
  {label:'11 Months',days:330},
  {label:'1 Year',days:365},
  {label:'Lifetime',days:-1}
];

function genUkey(){
  var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result='';
  for(var i=0;i<20;i++) result+=chars[Math.floor(Math.random()*chars.length)];
  return result;
}

function calcCost(ver,dur){
  var v=null;
  for(var i=0;i<VERSIONS.length;i++) if(VERSIONS[i].id===ver) v=VERSIONS[i];
  if(!v) return 0;
  if(dur.days===-1) return v.price*2;
  if(dur.days<=7) return Math.round(v.price*0.1);
  if(dur.days<=30) return Math.round(v.price*0.4);
  if(dur.days<=90) return Math.round(v.price*0.65);
  if(dur.days<=180) return Math.round(v.price*0.8);
  return v.price;
}

function AFZUXApp(){
  var s0=useState('loading'); var screen=s0[0]; var setScreen=s0[1];
  var s1=useState(''); var pwd=s1[0]; var setPwd=s1[1];
  var s2=useState(''); var pwdErr=s2[0]; var setPwdErr=s2[1];
  var s3=useState({msg:'',type:'ok'}); var toast=s3[0]; var setToast=s3[1];
  var s4=useState('overview'); var tab=s4[0]; var setTab=s4[1];
  var s60=useState({orKey:'',geminiKey:'',claudeKey:'',openaiKey:'',grokKey:''}); var aiKeys=s60[0]; var setAiKeys=s60[1];
  // Generate tab
  var s5=useState(VERSIONS[1]); var selVer=s5[0]; var setSelVer=s5[1];
  var s6=useState(DURATIONS[3]); var selDur=s6[0]; var setSelDur=s6[1];
  var s7=useState(1); var qty=s7[0]; var setQty=s7[1];
  var s8=useState(''); var clientLabel=s8[0]; var setClientLabel=s8[1];
  var s9=useState([]); var generatedKeys=s9[0]; var setGeneratedKeys=s9[1];
  var s10=useState(false); var genLoading=s10[0]; var setGenLoading=s10[1];
  // All ukeys
  var s11=useState([]); var allUkeys=s11[0]; var setAllUkeys=s11[1];
  var s12=useState('all'); var ukeyFilter=s12[0]; var setUkeyFilter=s12[1];
  // Users
  var s13=useState([]); var allUsers=s13[0]; var setAllUsers=s13[1];
  var s14=useState('all'); var userFilter=s14[0]; var setUserFilter=s14[1];
  // Stats
  var s15=useState({tu:0,au:0,bu:0,gu:0,uu:0,tk:0,ak:0,uk:0}); var stats=s15[0]; var setStats=s15[1];
  // Security
  var s16=useState(''); var newPwd=s16[0]; var setNewPwd=s16[1];
  var s17=useState(''); var cfmPwd=s17[0]; var setCfmPwd=s17[1];
  var s18=useState(false); var changing=s18[0]; var setChanging=s18[1];

  function notify(msg,type){
    setToast({msg:msg,type:type||'ok'});
    setTimeout(function(){setToast({msg:'',type:'ok'});},3000);
  }

  // COLORS
  var BG='#07070D'; var CARD='#14141E'; var CARD2='#1A1A26';
  var BORDER='#252535'; var TEXT='#E8E8F8'; var SUB='#9090B0';
  var MUTED='#606080'; var GOLD='#C9A84C'; var GREEN='#2ECC8A';
  var RED='#EF4060'; var BLUE='#3A8FEF'; var PURPLE='#8B6FE8';
  var ORANGE='#EF7C30';

  function card(ex){return Object.assign({background:CARD,border:'1px solid '+BORDER,borderRadius:'14px',padding:'16px'},ex||{});}
  function btn(ex){return Object.assign({padding:'10px 16px',borderRadius:'10px',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',color:'#1A1000',fontWeight:700,fontSize:'13px',cursor:'pointer',border:'none',fontFamily:'inherit'},ex||{});}
  function ghost(ex){return Object.assign({padding:'7px 12px',borderRadius:'9px',border:'1px solid '+BORDER,background:'transparent',color:SUB,fontSize:'12px',cursor:'pointer',fontFamily:'inherit'},ex||{});}
  function inpStyle(ex){return Object.assign({background:CARD2,border:'1.5px solid '+BORDER,borderRadius:'10px',padding:'10px 14px',color:TEXT,fontSize:'13px',fontFamily:'inherit',width:'100%',boxSizing:'border-box',outline:'none'},ex||{});}
  function badge(color,ex){return Object.assign({background:color+'22',color:color,border:'1px solid '+color+'44',borderRadius:'6px',padding:'2px 8px',fontSize:'10px',fontWeight:600,display:'inline-block'},ex||{});}

  // LOAD
  useEffect(function(){
    ST.get('fizux:aikeys',true).then(function(d){
      try{var k=JSON.parse(d.value);if(k&&typeof k==='object')setAiKeys(k);}catch(e){}
    }).catch(function(){});
    ST.get('afzux:masterkey').then(function(d){
      if(d.value===MASTER_KEY) setScreen('dashboard');
      else setScreen('login');
    }).catch(function(){
      setScreen('login');
    });
  },[]);

  useEffect(function(){
    if(screen==='dashboard') loadAll();
  },[screen]);

  function loadAll(){
    return Promise.all([loadUkeys(), loadUsers()]);
  }

  function loadUkeys(){
    return ST.list('afzux:ukey:',true).then(function(d){
      if(!d||!d.keys||!d.keys.length){setAllUkeys([]);updateStats([],[]);return;}
      var promises=d.keys.map(function(k){
        // k already has 'afzux:ukey:' prefix from ST.list - strip it to get raw ukey
        var rawKey=k.replace('afzux:ukey:','');
        return ST.get('afzux:ukey:'+rawKey,true).then(function(r){
          var uk=JSON.parse(r.value);
          var expired=uk.expiry!=='never'&&new Date(uk.expiry)<new Date();
          return Object.assign({},uk,{ukey:rawKey,expired:expired});
        }).catch(function(){return null;});
      });
      return Promise.all(promises).then(function(list){
        var valid=list.filter(function(u){return u!==null;});
        valid.sort(function(a,b){return new Date(b.createdAt||0)-new Date(a.createdAt||0);});
        setAllUkeys(valid);
        return valid;
      });
    }).then(function(ukeys){
      return ST.list('fizux:user:',true).then(function(d){
        if(!d||!d.keys||!d.keys.length){setAllUsers([]);updateStats(ukeys||[],[]);return;}
        var promises=d.keys.map(function(k){
          var rawKey=k.replace('fizux:user:','');
          return ST.get('fizux:user:'+rawKey,true).then(function(r){
            var u=JSON.parse(r.value);
            return ST.get('fizux:blocked:'+u.uid,true).then(function(b){
              u.blocked=JSON.parse(b.value).blocked;return u;
            }).catch(function(){u.blocked=false;return u;});
          }).catch(function(){return null;});
        });
        return Promise.all(promises).then(function(list){
          var valid=list.filter(function(u){return u!==null;});
          valid.sort(function(a,b){return new Date(b.lastLogin||0)-new Date(a.lastLogin||0);});
          setAllUsers(valid);
          updateStats(ukeys||[],valid);
        });
      }).catch(function(){updateStats(ukeys||[],[]);});
    }).catch(function(){updateStats([],[]);});
  }

  function loadUsers(){
    return ST.list('fizux:user:',true).then(function(d){
      if(!d||!d.keys||!d.keys.length){setAllUsers([]);return;}
      var promises=d.keys.map(function(k){
        var rawKey=k.replace('fizux:user:','');
        return ST.get('fizux:user:'+rawKey,true).then(function(r){
          var u=JSON.parse(r.value);
          return ST.get('fizux:blocked:'+u.uid,true).then(function(b){
            u.blocked=JSON.parse(b.value).blocked;return u;
          }).catch(function(){u.blocked=false;return u;});
        }).catch(function(){return null;});
      });
      return Promise.all(promises).then(function(list){
        var valid=list.filter(function(u){return u!==null;});
        valid.sort(function(a,b){return new Date(b.lastLogin||0)-new Date(a.lastLogin||0);});
        setAllUsers(valid);
      });
    }).catch(function(){});
  }

  function updateStats(ukeys,users){
    setStats({
      tu:users.length,
      au:users.filter(function(u){return !u.blocked;}).length,
      bu:users.filter(function(u){return u.blocked;}).length,
      gu:users.filter(function(u){return u.method==='google';}).length,
      uu:users.filter(function(u){return u.method==='ukey';}).length,
      tk:ukeys.length,
      ak:ukeys.filter(function(k){return !k.blocked&&!k.expired;}).length,
      uk:ukeys.filter(function(k){return k.used;}).length
    });
  }

  // LOGIN
  function doLogin(){
    setPwdErr('');
    if(pwd.trim()===MASTER_KEY){
      ST.set('afzux:masterkey',MASTER_KEY).then(function(){
        setPwd('');
        setScreen('dashboard');
      });
    } else {
      setPwdErr('Wrong master key');
    }
  }

  // LOGOUT
  function logout(){
    ST.del('afzux:masterkey').then(function(){
      setPwd('');
      setScreen('login');
    });
  }

  // GENERATE UKEYS
  function generateUkeys(){
    setGenLoading(true);
    var newKeys=[];
    var promises=[];
    for(var i=0;i<qty;i++){
      (function(){
        var ukey=genUkey();
        var expiry=selDur.days===-1?'never':new Date(Date.now()+selDur.days*24*60*60*1000).toISOString();
        var data={
          label:clientLabel||('Client-'+Date.now()),
          version:selVer.label,
          versionId:selVer.id,
          duration:selDur.label,
          durationDays:selDur.days,
          expiry:expiry,
          cost:calcCost(selVer.id,selDur),
          used:false,
          blocked:false,
          lastLogin:null,
          usedBy:null,
          createdAt:new Date().toISOString()
        };
        newKeys.push(Object.assign({},data,{ukey:ukey,expired:false}));
        promises.push(ST.set('afzux:ukey:'+ukey,JSON.stringify(data),true));
      })();
    }
    Promise.all(promises).then(function(){
      setGeneratedKeys(newKeys);
      return loadUkeys();
    }).then(function(){
      notify('Generated '+qty+' Ukey'+(qty>1?'s':'')+'!');
      setClientLabel('');
    }).catch(function(){
      notify('Error generating','err');
    }).then(function(){
      setGenLoading(false);
    });
  }

  // BLOCK UKEY
  function blockUkey(ukey,blocked){
    ST.get('afzux:ukey:'+ukey,true).then(function(d){
      var uk=JSON.parse(d.value);
      uk.blocked=blocked;
      return ST.set('afzux:ukey:'+ukey,JSON.stringify(uk),true);
    }).then(function(){
      return loadUkeys();
    }).then(function(){
      notify(blocked?'Ukey blocked':'Ukey unblocked');
    });
  }

  // DELETE UKEY
  function deleteUkey(ukey){
    ST.del('afzux:ukey:'+ukey,true).then(function(){
      return loadUkeys();
    }).then(function(){
      notify('Ukey deleted');
    });
  }

  // BLOCK USER
  function blockUser(uid,blocked){
    ST.set('fizux:blocked:'+uid,JSON.stringify({blocked:blocked,at:Date.now()}),true).then(function(){
      return loadUsers();
    }).then(function(){
      notify(blocked?'User blocked':'User unblocked');
    });
  }

  function copyText(text){
    navigator.clipboard.writeText(text).then(function(){notify('Copied!');}).catch(function(){notify('Copy failed','err');});
  }

  function copyAll(){
    var text=generatedKeys.map(function(k){return k.ukey+' | '+k.version+' | '+k.duration;}).join('\n');
    navigator.clipboard.writeText(text).then(function(){notify('All copied!');}).catch(function(){notify('Copy failed','err');});
  }

  // CHANGE PASSWORD
  function changePwd(){
    if(newPwd.length<8){notify('Min 8 characters','err');return;}
    if(newPwd!==cfmPwd){notify('Passwords do not match','err');return;}
    setChanging(true);
    ST.set('afzux:masterkey',newPwd).then(function(){
      notify('Master key updated!');
      setNewPwd(''); setCfmPwd('');
    }).catch(function(){
      notify('Error','err');
    }).then(function(){
      setChanging(false);
    });
  }

  // FILTERED DATA
  var filteredUkeys=allUkeys.filter(function(u){
    if(ukeyFilter==='all') return true;
    if(ukeyFilter==='active') return !u.blocked&&!u.expired&&!u.used;
    if(ukeyFilter==='used') return u.used;
    if(ukeyFilter==='blocked') return u.blocked;
    if(ukeyFilter==='expired') return u.expired&&!u.used;
    return true;
  });

  var filteredUsers=allUsers.filter(function(u){
    if(userFilter==='all') return true;
    if(userFilter==='active') return !u.blocked;
    if(userFilter==='blocked') return u.blocked;
    if(userFilter==='google') return u.method==='google';
    if(userFilter==='ukey') return u.method==='ukey';
    return true;
  });

  var cost=calcCost(selVer.id,selDur);

  // ── LOADING ──
  if(screen==='loading'){
    return h('div',{style:{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'14px',background:BG}},
      h('div',{style:{width:'64px',height:'64px',borderRadius:'20px',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',fontWeight:800,color:'#1A1000'}},'A'),
      h('div',{style:{fontSize:'24px',fontWeight:800,color:TEXT}},'AFZUX'),
      h('div',{style:{fontSize:'12px',color:MUTED}},'Loading...')
    );
  }

  // ── LOGIN ──
  if(screen==='login'){
    return h('div',{style:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:BG}},
      toast.msg && h('div',{style:{position:'fixed',top:'16px',left:'50%',transform:'translateX(-50%)',background:CARD,border:'1.5px solid '+(toast.type==='err'?RED:GREEN),borderRadius:'12px',padding:'10px 20px',fontSize:'13px',fontWeight:500,color:toast.type==='err'?RED:GREEN,zIndex:9999,whiteSpace:'nowrap'}},toast.msg),
      h('div',{style:{width:'100%',maxWidth:'380px'}},
        h('div',{style:{textAlign:'center',marginBottom:'28px'}},
          h('div',{style:{width:'64px',height:'64px',borderRadius:'20px',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',fontWeight:800,color:'#1A1000',margin:'0 auto 14px'}},'A'),
          h('div',{style:{fontSize:'24px',fontWeight:800,color:TEXT,marginBottom:'5px'}},'AFZUX v4.0'),
          h('div',{style:{fontSize:'12px',color:MUTED}},'FIZUX Admin Dashboard')
        ),
        h('div',{style:{background:CARD,border:'1px solid #2A2A3A',borderRadius:'20px',padding:'24px'}},
          h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'8px',fontWeight:600,letterSpacing:'0.8px'}},'MASTER KEY'),
          h('input',{
            type:'password',value:pwd,
            onChange:function(e){setPwd(e.target.value);setPwdErr('');},
            onKeyDown:function(e){if(e.key==='Enter')doLogin();},
            placeholder:'Enter master key',
            style:inpStyle({marginBottom:'6px',borderColor:pwdErr?RED:BORDER})
          }),
          pwdErr && h('div',{style:{color:RED,fontSize:'11px',marginBottom:'8px'}},pwdErr),
          h('button',{onClick:doLogin,style:btn({width:'100%',padding:'13px',borderRadius:'14px',marginTop:'6px'})},'🔓 Login to AFZUX'),
          h('div',{style:{textAlign:'center',marginTop:'14px',fontSize:'11px',color:MUTED}},'Personal admin only · dofizuxai@gmail.com')
        )
      )
    );
  }

  // ── DASHBOARD ──
  var TABS=[
    {id:'overview',label:'📊 Overview'},
    {id:'users',   label:'👥 Users'},
    {id:'ukeys',   label:'🔑 Ukeys'},
    {id:'generate',label:'🎲 Generate'},
    {id:'aikeys',  label:'🤖 AI Keys'},
    {id:'security',label:'🔒 Security'}
  ];

  return h('div',{style:{minHeight:'100vh',background:BG,color:TEXT}},
    // Toast
    toast.msg && h('div',{style:{position:'fixed',top:'16px',left:'50%',transform:'translateX(-50%)',background:CARD,border:'1.5px solid '+(toast.type==='err'?RED:GREEN),borderRadius:'12px',padding:'10px 20px',fontSize:'13px',fontWeight:500,color:toast.type==='err'?RED:GREEN,zIndex:9999,whiteSpace:'nowrap'}},toast.msg),

    // Header
    h('div',{style:{background:CARD,borderBottom:'1px solid '+BORDER,padding:'12px 16px',display:'flex',alignItems:'center',gap:'10px',position:'sticky',top:0,zIndex:10}},
      h('div',{style:{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#C9A84C,#E8C96B)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'16px',color:'#1A1000'}},'A'),
      h('div',{style:{flex:1}},
        h('div',{style:{fontWeight:700,fontSize:'15px'}},'AFZUX v4.0'),
        h('div',{style:{fontSize:'10px',color:MUTED}},stats.tu+' users · '+stats.tk+' ukeys')
      ),
      h('button',{onClick:function(){loadAll();notify('Refreshed!');},style:ghost({padding:'7px 12px',fontSize:'11px'})},'↻ Refresh'),
      h('button',{onClick:logout,style:ghost({padding:'7px 12px',fontSize:'11px',color:RED})},'↩ Logout')
    ),

    // Tab bar
    h('div',{style:{background:CARD,borderBottom:'1px solid '+BORDER,padding:'0 12px',display:'flex',overflowX:'auto'}},
      TABS.map(function(t){
        return h('button',{key:t.id,onClick:function(){setTab(t.id);},
          style:{padding:'12px 14px',border:'none',borderBottom:'2px solid '+(tab===t.id?GOLD:'transparent'),background:'transparent',color:tab===t.id?TEXT:MUTED,fontWeight:tab===t.id?700:400,fontSize:'12px',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}},
          t.label
        );
      })
    ),

    h('div',{style:{padding:'14px',maxWidth:'760px',margin:'0 auto'}},

      // ── OVERVIEW TAB ──
      tab==='overview' && h('div',null,
        // Stats grid
        h('div',{style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'14px'}},
          [{icon:'👥',label:'Total Users',val:stats.tu,color:PURPLE},
           {icon:'✅',label:'Active Users',val:stats.au,color:GREEN},
           {icon:'🚫',label:'Blocked',val:stats.bu,color:RED},
           {icon:'🔑',label:'Total Ukeys',val:stats.tk,color:BLUE}
          ].map(function(s){
            return h('div',{key:s.label,style:card({textAlign:'center',padding:'14px 8px'})},
              h('div',{style:{fontSize:'18px',marginBottom:'4px'}},s.icon),
              h('div',{style:{fontSize:'24px',fontWeight:900,color:s.color}},s.val),
              h('div',{style:{fontSize:'9px',color:MUTED,marginTop:'2px'}},s.label)
            );
          })
        ),
        h('div',{style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'14px'}},
          [{icon:'🌐',label:'Google',val:stats.gu,color:BLUE},
           {icon:'🔑',label:'Ukey Login',val:stats.uu,color:PURPLE},
           {icon:'✅',label:'Active Keys',val:stats.ak,color:GREEN},
           {icon:'🔓',label:'Used Keys',val:stats.uk,color:ORANGE}
          ].map(function(s){
            return h('div',{key:s.label,style:card({textAlign:'center',padding:'12px 8px'})},
              h('div',{style:{fontSize:'16px',marginBottom:'3px'}},s.icon),
              h('div',{style:{fontSize:'20px',fontWeight:900,color:s.color}},s.val),
              h('div',{style:{fontSize:'9px',color:MUTED,marginTop:'2px'}},s.label)
            );
          })
        ),
        // Recent users
        h('div',{style:card()},
          h('div',{style:{fontWeight:700,fontSize:'14px',marginBottom:'12px'}},'👥 Recent Users'),
          allUsers.length===0
            ? h('div',{style:{textAlign:'center',padding:'20px',color:MUTED}},'No users yet')
            : allUsers.slice(0,5).map(function(u,i){
                return h('div',{key:u.uid||i,style:{display:'flex',gap:'10px',alignItems:'center',padding:'9px 0',borderBottom:i<4?'1px solid rgba(255,255,255,0.04)':'none'}},
                  h('div',{style:{width:'34px',height:'34px',borderRadius:'50%',background:u.method==='google'?'#4285F4':PURPLE,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'14px',color:'#fff',flexShrink:0}},((u.name)||'?').charAt(0).toUpperCase()),
                  h('div',{style:{flex:1,minWidth:0}},
                    h('div',{style:{fontSize:'13px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:'6px'}},
                      u.name||'Unknown',
                      u.blocked && h('span',{style:badge(RED)},'Blocked')
                    ),
                    h('div',{style:{fontSize:'10px',color:MUTED}},(u.method==='google'?'Google':'Ukey')+' · '+(u.lastLogin?new Date(u.lastLogin).toLocaleDateString():'Unknown'))
                  ),
                  h('button',{onClick:function(){blockUser(u.uid,!u.blocked);},
                    style:ghost({padding:'4px 10px',fontSize:'10px',color:u.blocked?GREEN:RED})},
                    u.blocked?'Unblock':'Block'
                  )
                );
              })
        )
      ),

      // ── USERS TAB ──
      tab==='users' && h('div',null,
        h('div',{style:{display:'flex',gap:'6px',marginBottom:'12px',flexWrap:'wrap'}},
          ['all','active','blocked','google','ukey'].map(function(f){
            return h('button',{key:f,onClick:function(){setUserFilter(f);},
              style:{padding:'5px 12px',borderRadius:'20px',border:'1.5px solid '+(userFilter===f?GOLD:BORDER),background:userFilter===f?GOLD+'14':'transparent',color:userFilter===f?GOLD:MUTED,fontSize:'11px',cursor:'pointer',textTransform:'capitalize'}},
              f==='all'?'All Users':f==='active'?'Active':f==='blocked'?'🚫 Blocked':f==='google'?'🌐 Google':'🔑 Ukey'
            );
          })
        ),
        h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'8px'}},filteredUsers.length+' users'),
        filteredUsers.length===0
          ? h('div',{style:card({textAlign:'center',padding:'30px',color:MUTED})},'No users found')
          : filteredUsers.map(function(u,i){
              return h('div',{key:u.uid||i,style:Object.assign({},card({marginBottom:'8px',opacity:u.blocked?0.75:1}),{borderColor:u.blocked?RED+'44':BORDER})},
                h('div',{style:{display:'flex',gap:'10px',alignItems:'flex-start'}},
                  h('div',{style:{width:'40px',height:'40px',borderRadius:'50%',background:u.method==='google'?'#4285F4':PURPLE,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'16px',color:'#fff',flexShrink:0}},((u.name)||'?').charAt(0).toUpperCase()),
                  h('div',{style:{flex:1,minWidth:0}},
                    h('div',{style:{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px',flexWrap:'wrap'}},
                      h('span',{style:{fontSize:'13px',fontWeight:700}},u.name||'Unknown'),
                      u.blocked && h('span',{style:badge(RED)},'🚫 Blocked'),
                      h('span',{style:badge(u.method==='google'?BLUE:PURPLE)},u.method==='google'?'🌐 Google':'🔑 Ukey')
                    ),
                    u.email && h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'3px'}},u.email),
                    h('div',{style:{fontSize:'10px',color:MUTED}},'Last login: '+(u.lastLogin?new Date(u.lastLogin).toLocaleString():'Never')),
                    h('div',{style:{fontSize:'10px',color:MUTED,marginTop:'1px'}},'UID: '+((u.uid||'?').slice(0,24)+'...'))
                  ),
                  h('button',{onClick:function(){blockUser(u.uid,!u.blocked);},
                    style:ghost({padding:'5px 12px',fontSize:'11px',color:u.blocked?GREEN:RED})},
                    u.blocked?'✅ Unblock':'🚫 Block'
                  )
                )
              );
            })
      ),

      // ── UKEYS TAB ──
      tab==='ukeys' && h('div',null,
        h('div',{style:{display:'flex',gap:'6px',marginBottom:'12px',flexWrap:'wrap'}},
          ['all','active','used','blocked','expired'].map(function(f){
            return h('button',{key:f,onClick:function(){setUkeyFilter(f);},
              style:{padding:'5px 12px',borderRadius:'20px',border:'1.5px solid '+(ukeyFilter===f?GOLD:BORDER),background:ukeyFilter===f?GOLD+'14':'transparent',color:ukeyFilter===f?GOLD:MUTED,fontSize:'11px',cursor:'pointer',textTransform:'capitalize'}},
              f
            );
          })
        ),
        h('div',{style:{fontSize:'11px',color:MUTED,marginBottom:'8px'}},filteredUkeys.length+' ukeys'),
        filteredUkeys.length===0
          ? h('div',{style:card({textAlign:'center',padding:'30px',color:MUTED})},'No Ukeys found')
          : filteredUkeys.map(function(u,i){
              var statusColor=u.blocked?RED:u.expired?ORANGE:u.used?BLUE:GREEN;
              var statusLabel=u.blocked?'🚫 Blocked':u.expired?'⏰ Expired':u.used?'🔓 Used':'✅ Active';
              return h('div',{key:u.ukey||i,style:Object.assign({},card({marginBottom:'8px'}),{borderColor:u.blocked?RED+'44':BORDER})},
                h('div',{style:{display:'flex',gap:'10px',alignItems:'flex-start',flexWrap:'wrap'}},
                  h('div',{style:{flex:1,minWidth:0}},
                    h('div',{style:{fontFamily:'monospace',fontSize:'12px',fontWeight:700,letterSpacing:'1px',marginBottom:'7px',wordBreak:'break-all'}},u.ukey),
                    h('div',{style:{display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'6px'}},
                      h('span',{style:badge(u.versionId==='v3'?PURPLE:u.versionId==='v4'?GOLD:u.versionId==='v5'?'#FF6B9D':RED)},u.version),
                      h('span',{style:badge(u.durationDays===-1?ORANGE:BLUE)},u.duration),
                      h('span',{style:badge(statusColor)},statusLabel)
                    ),
                    h('div',{style:{fontSize:'10px',color:MUTED}},
                      'Label: '+u.label+' · Created: '+(u.createdAt?new Date(u.createdAt).toLocaleDateString():'?'),
                      u.expiry!=='never' && (' · Expires: '+new Date(u.expiry).toLocaleDateString()),
                      u.expiry==='never' && ' · 🔥 Never expires',
                      u.used && u.lastLogin && (' · Last used: '+new Date(u.lastLogin).toLocaleDateString())
                    ),
                    h('div',{style:{fontSize:'10px',color:MUTED,marginTop:'1px'}},'Cost estimate: ₹'+u.cost)
                  ),
                  h('div',{style:{display:'flex',gap:'5px',flexShrink:0,flexWrap:'wrap'}},
                    h('button',{onClick:function(){copyText(u.ukey);},style:ghost({padding:'4px 8px',fontSize:'11px'})},'Copy'),
                    h('button',{onClick:function(){blockUkey(u.ukey,!u.blocked);},style:ghost({padding:'4px 8px',fontSize:'11px',color:u.blocked?GREEN:RED})},u.blocked?'Unblock':'Block'),
                    h('button',{onClick:function(){if(confirm('Delete this Ukey?'))deleteUkey(u.ukey);},style:ghost({padding:'4px 8px',fontSize:'11px',color:RED})},'Delete')
                  )
                )
              );
            })
      ),

      // ── GENERATE TAB ──
      tab==='generate' && h('div',null,
        // Version select
        h('div',{style:card({marginBottom:'12px'})},
          h('div',{style:{fontSize:'10px',color:MUTED,fontWeight:700,letterSpacing:'1px',marginBottom:'10px'}},'SELECT VERSION'),
          h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'7px'}},
            VERSIONS.map(function(v){
              var active=selVer.id===v.id;
              return h('button',{key:v.id,onClick:function(){setSelVer(v);},
                style:{padding:'12px 10px',borderRadius:'12px',border:'2px solid '+(active?v.color:BORDER),background:active?v.color+'14':CARD2,cursor:'pointer',textAlign:'left',fontFamily:'inherit'}},
                h('div',{style:{fontSize:'11px',fontWeight:700,color:active?v.color:TEXT,marginBottom:'3px'}},v.label),
                h('div',{style:{fontSize:'9px',color:MUTED}},v.desc),
                h('div',{style:{fontSize:'11px',color:active?v.color:MUTED,marginTop:'4px',fontWeight:600}},'₹'+v.price+' (EB: ₹'+v.eb+')')
              );
            })
          )
        ),
        // Duration select
        h('div',{style:card({marginBottom:'12px'})},
          h('div',{style:{fontSize:'10px',color:MUTED,fontWeight:700,letterSpacing:'1px',marginBottom:'10px'}},'SELECT DURATION'),
          h('div',{style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px'}},
            DURATIONS.map(function(d){
              var active=selDur.label===d.label;
              var isLife=d.days===-1;
              var col=isLife?ORANGE:active?GREEN:MUTED;
              return h('button',{key:d.label,onClick:function(){setSelDur(d);},
                style:{padding:'9px 4px',borderRadius:'10px',border:'2px solid '+(active?col:BORDER),background:active?col+'14':CARD2,color:col,fontSize:'10px',fontWeight:active?700:400,cursor:'pointer',textAlign:'center',fontFamily:'inherit'}},
                (isLife?'🔥 ':'')+d.label
              );
            })
          )
        ),
        // Client label
        h('div',{style:card({marginBottom:'12px'})},
          h('div',{style:{fontSize:'10px',color:MUTED,fontWeight:700,letterSpacing:'1px',marginBottom:'8px'}},'CLIENT LABEL (Optional)'),
          h('input',{value:clientLabel,onChange:function(e){setClientLabel(e.target.value);},placeholder:'e.g. Client Name or Company',style:inpStyle()})
        ),
        // Quantity
        h('div',{style:card({marginBottom:'12px'})},
          h('div',{style:{fontSize:'10px',color:MUTED,fontWeight:700,letterSpacing:'1px',marginBottom:'10px'}},'QUANTITY'),
          h('div',{style:{display:'flex',alignItems:'center',gap:'12px',marginBottom:'10px'}},
            h('button',{onClick:function(){setQty(Math.max(1,qty-1));},style:ghost({padding:'8px 18px',fontSize:'16px',fontWeight:700})},'-'),
            h('div',{style:{flex:1,textAlign:'center',fontSize:'32px',fontWeight:900,color:TEXT}},qty),
            h('button',{onClick:function(){setQty(Math.min(100,qty+1));},style:ghost({padding:'8px 18px',fontSize:'16px',fontWeight:700})},'+')
          ),
          h('div',{style:{display:'flex',gap:'6px'}},
            [1,5,10,25,50,100].map(function(n){
              return h('button',{key:n,onClick:function(){setQty(n);},
                style:{flex:1,padding:'7px 0',borderRadius:'8px',border:'1.5px solid '+(qty===n?GOLD:BORDER),background:qty===n?GOLD:'transparent',color:qty===n?'#1A1000':SUB,fontSize:'11px',cursor:'pointer'}},n);
            })
          )
        ),
        // Summary
        h('div',{style:Object.assign({},card({marginBottom:'12px'}),{background:PURPLE+'11',borderColor:PURPLE+'44'})},
          h('div',{style:{fontSize:'10px',color:MUTED,fontWeight:700,letterSpacing:'1px',marginBottom:'8px'}},'SUMMARY'),
          [['Version',selVer.label,GOLD],['Duration',selDur.label+(selDur.days===-1?' 🔥':''),GREEN],['Quantity',qty+' Ukey'+(qty>1?'s':''),TEXT],['Est. Cost / Ukey','₹'+cost,ORANGE],['Total Est.','₹'+(cost*qty),ORANGE]].map(function(row){
            return h('div',{key:row[0],style:{display:'flex',justifyContent:'space-between',fontSize:'12px',marginBottom:'5px'}},
              h('span',{style:{color:MUTED}},row[0]),
              h('span',{style:{fontWeight:700,color:row[2]}},String(row[1]))
            );
          })
        ),
        h('button',{onClick:generateUkeys,disabled:genLoading,style:btn({width:'100%',padding:'14px',borderRadius:'14px',fontSize:'14px',opacity:genLoading?0.7:1})},
          genLoading
            ? h('div',{style:{width:'16px',height:'16px',border:'2px solid #1A1000',borderTopColor:'transparent',borderRadius:'50%',animation:'spin .7s linear infinite',margin:'0 auto'}})
            : '🎲 Generate '+qty+' Ukey'+(qty>1?'s':'')
        ),
        // Generated keys
        generatedKeys.length>0 && h('div',{style:card({marginTop:'14px'})},
          h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}},
            h('div',{style:{fontWeight:700,fontSize:'14px'}},'✅ Generated ('+generatedKeys.length+')'),
            h('button',{onClick:copyAll,style:ghost({padding:'5px 12px',fontSize:'11px'})},'Copy All')
          ),
          generatedKeys.map(function(k,i){
            return h('div',{key:k.ukey||i,style:{background:CARD2,border:'1px solid '+BORDER,borderRadius:'12px',padding:'12px',marginBottom:'8px'}},
              h('div',{style:{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}},
                h('div',{style:{fontFamily:'monospace',fontSize:'13px',fontWeight:900,letterSpacing:'2px',flex:1,wordBreak:'break-all'}},k.ukey),
                h('button',{onClick:function(){copyText(k.ukey);},style:ghost({padding:'4px 8px',fontSize:'11px'})},'Copy')
              ),
              h('div',{style:{display:'flex',gap:'5px',flexWrap:'wrap'}},
                h('span',{style:badge(GOLD)},k.version),
                h('span',{style:badge(k.durationDays===-1?ORANGE:GREEN)},k.duration),
                h('span',{style:badge(BLUE)},'₹'+k.cost)
              )
            );
          })
        )
      ),

      // ── SECURITY TAB ──

      tab==='aikeys' && h('div',null,
        h('div',{style:{fontSize:'13px',color:MUTED,marginBottom:'16px'}},'API keys are stored in shared storage. FIZUX reads them automatically.'),
        ['orKey','geminiKey','claudeKey','openaiKey','grokKey'].map(function(key){
          var labels={orKey:'OpenRouter Key',geminiKey:'Gemini Key',claudeKey:'Claude (Anthropic) Key',openaiKey:'OpenAI Key',grokKey:'Grok Key'};
          var links={orKey:'openrouter.ai/keys',geminiKey:'aistudio.google.com',claudeKey:'console.anthropic.com',openaiKey:'platform.openai.com',grokKey:'console.x.ai'};
          return h('div',{key:key,style:{marginBottom:'14px',background:CARD,border:'1px solid '+BORDER,borderRadius:'12px',padding:'14px'}},
            h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}},
              h('div',{style:{fontSize:'13px',fontWeight:700,color:TEXT}},labels[key]),
              h('a',{href:'https://'+links[key],target:'_blank',style:{fontSize:'11px',color:GOLD,textDecoration:'none'}},'Get Key ↗')
            ),
            h('div',{style:{display:'flex',gap:'8px'}},
              h('input',{type:'password',value:aiKeys[key]||'',
                onChange:function(e){var nk=Object.assign({},aiKeys);nk[key]=e.target.value;setAiKeys(nk);},
                placeholder:'Enter '+labels[key]+'...',
                style:{flex:1,background:BG,border:'1px solid '+BORDER,borderRadius:'8px',padding:'8px 10px',color:TEXT,fontFamily:'monospace',fontSize:'12px',outline:'none'}}),
              h('button',{onClick:function(){
                ST.set('fizux:aikeys',JSON.stringify(aiKeys),true).then(function(){notify('✅ '+labels[key]+' saved!');}).catch(function(){notify('❌ Save failed');});
              },style:{padding:'8px 14px',background:GOLD,color:'#000',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700,fontSize:'12px',fontFamily:'inherit'}},'Save')
            ),
            aiKeys[key] && h('div',{style:{fontSize:'10px',color:GREEN,marginTop:'6px'}},'✅ Key saved — '+aiKeys[key].slice(0,8)+'...')
          );
        }),
        h('button',{onClick:function(){
          ST.set('fizux:aikeys',JSON.stringify(aiKeys),true).then(function(){notify('✅ All AI Keys saved!');}).catch(function(){notify('❌ Save failed');});
        },style:{width:'100%',padding:'12px',background:GOLD,color:'#000',border:'none',borderRadius:'12px',cursor:'pointer',fontWeight:700,fontSize:'14px',fontFamily:'inherit',marginTop:'8px'}},'💾 Save All Keys')
      ),
      tab==='security' && h('div',null,
        // Stats summary
        h('div',{style:card({marginBottom:'12px'})},
          h('div',{style:{fontWeight:700,fontSize:'14px',marginBottom:'12px'}},'📊 Full Stats'),
          [['Total Users',stats.tu],['Active Users',stats.au],['Blocked Users',stats.bu],['Google Logins',stats.gu],['Ukey Logins',stats.uu],['Total Ukeys',stats.tk],['Active Ukeys',stats.ak],['Used Ukeys',stats.uk]].map(function(row){
            return h('div',{key:row[0],style:{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',fontSize:'12px'}},
              h('span',{style:{color:MUTED}},row[0]),
              h('span',{style:{fontWeight:700,color:TEXT}},row[1])
            );
          })
        ),
        // Change password
        h('div',{style:card({marginBottom:'12px'})},
          h('div',{style:{fontWeight:700,fontSize:'14px',marginBottom:'12px'}},'🔒 Change Master Key'),
          h('input',{type:'password',value:newPwd,onChange:function(e){setNewPwd(e.target.value);},placeholder:'New master key (8+ chars)',style:inpStyle({marginBottom:'8px'})}),
          h('input',{type:'password',value:cfmPwd,onChange:function(e){setCfmPwd(e.target.value);},placeholder:'Confirm new master key',style:inpStyle({marginBottom:'10px'})}),
          h('button',{onClick:changePwd,disabled:changing,style:btn({width:'100%',borderRadius:'12px',opacity:changing?0.7:1})},'🔐 Update Master Key')
        ),
        // About
        h('div',{style:card()},
          h('div',{style:{fontWeight:700,fontSize:'14px',marginBottom:'10px'}},'ℹ About AFZUX v4.0'),
          [['App','AFZUX v4.0'],['Connected to','FIZUX v9.0'],['Contact','dofizuxai@gmail.com'],['Ukey format','20 alphanumeric'],['Max generate','100 at once'],['Versions','v3.0 to v6.0'],['Durations','3 Days to Lifetime']].map(function(row){
            return h('div',{key:row[0],style:{display:'flex',justifyContent:'space-between',fontSize:'11px',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}},
              h('span',{style:{color:MUTED}},row[0]),
              h('span',{style:{color:SUB}},row[1])
            );
          })
        )
      )

    ) // end maxWidth div
  ); // end dashboard
}

var container=document.getElementById('root');
var root=ReactDOM.createRoot(container);
root.render(React.createElement(AFZUXApp));
})();
