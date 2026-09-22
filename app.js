const pages=[...document.querySelectorAll('.page')],titles={home:'TAZ OVERVIEW',buddy:'BUDDY',understanding:'LIVING MAP',progress:'PROGRESS',toolkit:'MY TOOLKIT',parent:'PARENT',teacher:'TEACHER',metaphysics:'TAZ PROFILE',assessment:'ASSESSMENT',lab:'INTELLIGENCE LAB',roleHome:'ROLE HOME',creatorStudio:'CREATOR STUDIO'};function go(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('.railBtn').forEach(n=>n.classList.toggle('active',n.dataset.page===id));var vt=document.getElementById('viewTitle');if(vt)vt.textContent=titles[id]||id;window.scrollTo(0,0)}document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>go(b.dataset.page));const styleData={Cute:{line:"Let's explore together!",img:"dragon-cute.png",desc:"Warm & Friendly"},Cool:{line:"Aim higher. You've got this!",img:"dragon-cool.png",desc:"Confident & Bold"},Modern:{line:"Small steps create big futures.",img:"dragon-modern.png",desc:"Clean & Calm"},Classic:{line:"With wisdom, we go further.",img:"dragon-classic.png",desc:"Timeless & Meaningful"},Symbolic:{line:"Infinite possibilities within you.",img:"dragon-symbolic.png",desc:"Simple & Stylish"}};let current=localStorage.getItem('buddyStyle')||'Cute';function applySkin(){document.body.dataset.buddyStyle=current}function renderStyles(){applySkin();var sn=document.getElementById('styleName'),bl=document.getElementById('buddyLine'),hi=document.getElementById('heroBuddyImg'),bm=document.getElementById('buddyMainImg'),hs=document.getElementById('heroStyle'),st=document.getElementById('styles');if(sn)sn.textContent=current;if(bl)bl.textContent=styleData[current].line;if(hi)hi.src=styleData[current].img;if(bm)bm.src=styleData[current].img;if(hs)hs.textContent=current+' · '+styleData[current].desc;if(!st)return;st.innerHTML=Object.keys(styleData).map(s=>'<button class="styleBtn '+(s===current?'active':'')+'" data-style="'+s+'"><img src="'+styleData[s].img+'">'+s+'</button>').join('');st.querySelectorAll('button').forEach(b=>b.onclick=()=>{current=b.dataset.style;localStorage.setItem('buddyStyle',current);renderStyles()})}renderStyles();function showTask(){task.classList.remove('hidden')}var confidenceEl=document.getElementById('confidence'),confValEl=document.getElementById('confVal');if(confidenceEl&&confValEl)confidenceEl.oninput=()=>confValEl.textContent=confidenceEl.value+'/5';function recordEvidence(){const a=answer.value.trim();if(!a){taskResult.textContent='Tell Buddy what you think first.';return}const e={time:new Date().toLocaleString(),task:'English explanation',answer:a,confidence:+confidence.value,status:'Observed once'};localStorage.setItem('ciEvidence',JSON.stringify(e));taskResult.innerHTML='<b>Recorded.</b> One observation only — not a permanent label.';renderEvidence()}function renderEvidence(){const e=JSON.parse(localStorage.getItem('ciEvidence')||'null');if(e){eventLog.innerHTML='<div class="event"><b>'+e.status+'</b> · '+e.task+' · confidence '+e.confidence+'/5<br><small>'+e.time+' · Retention and transfer not tested yet</small></div>';behaviourState.textContent='1 observed event';progressTitle.textContent='First observation recorded';progressText.textContent='This is one data point. Retention, transfer and independence still need later evidence.'}else eventLog.innerHTML='<p>No behavioural evidence recorded yet.</p>'}renderEvidence();function renderCheck(){parentCheck.innerHTML='<div class="task"><span class="kicker">PARENT CHECK</span><h3>When work becomes difficult, what have you actually noticed?</h3><div class="styles">'+['Usually keeps trying','Asks for help','Moves away from it','Depends on situation','Not sure yet'].map(x=>'<button class="styleBtn parentOption" data-a="'+x+'">'+x+'</button>').join('')+'</div><p id="parentSave"></p></div>';parentCheck.querySelectorAll('.parentOption').forEach(b=>b.onclick=()=>{localStorage.setItem('parentCheck',b.dataset.a);parentSave.textContent='Saved as Parent observation: '+b.dataset.a+'. Kept separate from Taz’s own view and observed behaviour.'})}
const tazLearner={id:"learner_001",name:"Taz Tay",age:14,school_stage:"Secondary 2",country:"Singapore",subject_context:["English"]};
const tazSource={birth:{date:"2012-05-05",time:"07:21",place:"Singapore",sex:"male"},bazi:{day_master:"Bing Yang Fire",celestial_animal:"Dragon",life_palace:"Wu Shen Earth Monkey",conception_palace:"Yi Wei Wood Goat",main_structure:"Thinkers",main_profile:"Artist / Eating God",four_pillars:["Ren Chen","Bing Yin","Jia Chen","Ren Chen"],profiles_2026:{Philosopher:[98,84],Artist:[98,100],Analyzer:[85,84],Diplomat:[73,46],Friend:[60,100],Warrior:[52,33],Pioneer:[0,0],Director:[0,0],Performer:[0,16],Leader:[0,45]}},qimen:{destiny_palace:"NW",life_stem:"Bing",door:"Life",star:"Grain",guardian:"Earth",gua:"6 White Metal Qian NW",annual_2026:{stem:"Ji",door:"Delusion",star:"Hero",deity:"Harmony"}}};
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function renderHypotheses(data){
 const grid=document.getElementById("hypothesisGrid"),state=document.getElementById("engineState");
 if(!grid||!state)return;
 const hs=Array.isArray(data.hypotheses)?data.hypotheses:[];
 state.innerHTML="<b>Engine "+escapeHtml(data.engine_version||"v0.1")+"</b><span>"+hs.length+" testable hypotheses generated. None are treated as observed facts.</span>";
 grid.innerHTML=hs.length?hs.map((x,i)=>'<article class="hypothesisCard"><div class="hypTop"><span class="status predicted">'+escapeHtml(x.status||"Predicted")+'</span><small>'+escapeHtml(x.domain||"Learning")+'</small></div><h3>'+escapeHtml(x.finding||"Hypothesis "+(i+1))+'</h3><p><b>Why:</b> '+escapeHtml(x.why||"")+'</p><p><b>Need to validate:</b> '+escapeHtml(Array.isArray(x.validation_needed)?x.validation_needed.join(" · "):x.validation_needed||"")+'</p><div class="testBox"><b>Buddy test</b><p>'+escapeHtml(x.buddy_test||"Still discovering")+'</p></div><div class="testBox"><b>Teaching experiment</b><p>'+escapeHtml(x.teaching_experiment||"Still discovering")+'</p></div><p class="micro"><b>Success:</b> '+escapeHtml(Array.isArray(x.success_criteria)?x.success_criteria.join(" · "):x.success_criteria||"")+'</p></article>').join(""):'<p>No hypotheses returned.</p>';
 localStorage.setItem("ciIntelligence",JSON.stringify(data));
 renderRoleIntelligence(data);
}
function renderRoleIntelligence(data){
 const el=document.getElementById("roleIntelligence"); if(!el)return;
 const r=data&&data.role_output; if(!r)return;
 el.innerHTML='<span class="kicker">ENGINE OUTPUT</span><h3>Generated teaching brief</h3><pre>'+escapeHtml(typeof r==="string"?r:JSON.stringify(r,null,2))+'</pre>';
}
async function runIntelligenceEngine(){
 const btn=document.getElementById("runEngineBtn"),state=document.getElementById("engineState");
 if(btn){btn.disabled=true;btn.textContent="Generating..."} if(state)state.innerHTML="<b>AI is analysing Taz</b><span>Creating hypotheses and validation tests from source data.</span>";
 const evidence=[]; const local=JSON.parse(localStorage.getItem("ciEvidence")||"null"); if(local)evidence.push(local);
 try{const r=await fetch("/api/intelligence",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({learner:tazLearner,source:tazSource,evidence,role:"teacher"})});const data=await r.json();if(!r.ok)throw new Error(data.message||data.error||"Engine unavailable");renderHypotheses(data)}
 catch(e){if(state)state.innerHTML="<b>Engine not connected yet</b><span>"+escapeHtml(e.message)+". Add OPENAI_API_KEY in Vercel Environment Variables to activate automatic generation.</span>"}
 finally{if(btn){btn.disabled=false;btn.textContent="Generate intelligence"}}
}
(()=>{try{const saved=JSON.parse(localStorage.getItem("ciIntelligence")||"null");if(saved)renderHypotheses(saved)}catch{}})();

const rolePages={learner:["home","buddy","progress","toolkit"],parent:["home","understanding","progress","toolkit","parent"],teacher:["teacher","progress"],superuser:["home","buddy","understanding","progress","toolkit","parent","teacher","metaphysics","lab"],creator:["home","understanding","metaphysics","lab"]};
let currentRole=localStorage.getItem("ciRole")||"superuser";
function applyRole(role){currentRole=role;localStorage.setItem("ciRole",role);document.body.dataset.role=role;document.querySelectorAll(".roleSwitch button").forEach(function(b){b.classList.toggle("active",b.dataset.role===role)});document.querySelectorAll(".railBtn[data-page]").forEach(function(b){b.classList.toggle("roleHidden",rolePages[role].indexOf(b.dataset.page)<0)});}
document.querySelectorAll(".roleSwitch button").forEach(function(b){b.onclick=function(){applyRole(b.dataset.role)}});applyRole(currentRole);

function roleHomeMarkup(role){
 const cards={
 learner:['MY BUDDY','Hey Taz. What do you want to work on today?','Start with Buddy','buddy','Buddy is still learning what helps you best.','My progress','progress','My toolkit','toolkit'],
 parent:['PARENT HOME','How is Taz learning?','Continue Parent Discovery','parent','We are building Taz’s first evidence-backed learning picture.','What we are discovering','understanding','Progress & independence','progress'],
 teacher:['TEACHER HOME','What does Taz need from me today?','Open today’s brief','teacher','Action first: teach, observe, give quick feedback.','Current learning evidence','progress','Teaching brief','teacher'],
 superuser:['SUPER USER','Taz · 360° Learner Intelligence','Open Living Map','understanding','See source, prediction, observation, experiment and outcome separately.','Raw source data','metaphysics','Intelligence Lab','lab'],
 creator:['CREATOR','Build the intelligence system','Open Intelligence Lab','lab','Configure and inspect methodology, evidence logic and system behaviour.','Source & methodology','metaphysics','Evidence pipeline','lab']
 }[role]||[];
 return '<div class="roleHero"><span class="kicker">'+cards[0]+'</span><h1>'+cards[1]+'</h1><p>'+cards[4]+'</p><button class="dark" onclick="go(\''+cards[3]+'\')">'+cards[2]+' →</button></div><div class="roleHomeGrid"><button onclick="go(\''+cards[6]+'\')"><span>'+cards[5]+'</span><b>Open →</b></button><button onclick="go(\''+cards[8]+'\')"><span>'+cards[7]+'</span><b>Open →</b></button></div>';
}
function openRoleHome(role){
 const el=document.getElementById("roleHomeContent");if(el)el.innerHTML=roleHomeMarkup(role);
 go("roleHome");viewTitle.textContent={learner:"MY BUDDY",parent:"PARENT HOME",teacher:"TEACHER HOME",superuser:"360° INTELLIGENCE",creator:"CREATOR"}[role];
}
const oldApplyRole=applyRole;
applyRole=function(role){oldApplyRole(role);document.querySelectorAll(".railBtn[data-page=home] span").forEach(function(x){x.textContent={learner:"Buddy Home",parent:"Parent Home",teacher:"Teacher Home",superuser:"360 Home",creator:"Creator Home"}[role]||"Home"});openRoleHome(role)}
document.querySelectorAll(".roleSwitch button").forEach(function(b){b.onclick=function(){applyRole(b.dataset.role)}});applyRole(currentRole);

const discoveryQuestions=[
 {d:"Thinking",p:"When Taz disagrees with an answer, what do you usually notice?",c:"If an answer does not make sense to you, what do you usually do?",o:["Work it out myself","Ask why","Accept it","Depends"]},
 {d:"Confidence",p:"When Taz is unsure, what do you usually notice?",c:"When you are unsure, what do you usually do?",o:["Still answer","Ask for help","Check again","Avoid answering"]},
 {d:"Learning",p:"When work gets difficult, what help seems useful first?",c:"If you are stuck, what help would you want first?",o:["One hint","An example","Explain steps","More time"]},
 {d:"Expression",p:"How does Taz usually explain a difficult idea best?",c:"How do you prefer explaining a difficult idea?",o:["Writing","Talking","Example","Depends"]}
];
function discoveryData(){try{return JSON.parse(localStorage.getItem("ciDiscovery")||'{"parent":{},"learner":{}}')}catch(e){return {parent:{},learner:{}}}}
function saveDiscovery(x){localStorage.setItem("ciDiscovery",JSON.stringify(x));renderDiscoveryCompare()}
function discoveryForm(who){
 const x=discoveryData(),answers=x[who]||{},isParent=who==="parent";
 return '<div class="discoveryForm"><span class="kicker">'+(isParent?"PARENT OBSERVATION":"TAZ SELF VIEW")+'</span><h3>'+(isParent?"What have you actually noticed?":"There are no right answers.")+'</h3>'+discoveryQuestions.map(function(q,i){return '<div class="discoverQ"><b>'+q.d+'</b><p>'+(isParent?q.p:q.c)+'</p><div class="discoverOptions">'+q.o.map(function(v){return '<button class="'+(answers[i]===v?"selected":"")+'" data-w="'+who+'" data-i="'+i+'" data-v="'+v+'">'+v+'</button>'}).join("")+'</div></div>'}).join("")+'<p class="micro">These answers are kept separate until real learning behaviour supports or contradicts them.</p></div>';
}
function bindDiscovery(host){host.querySelectorAll(".discoverOptions button").forEach(function(b){b.onclick=function(){const x=discoveryData();x[b.dataset.w]=x[b.dataset.w]||{};x[b.dataset.w][b.dataset.i]=b.dataset.v;saveDiscovery(x);if(b.dataset.w==="parent")startParentDiscovery();else startLearnerDiscovery()}})}
function startParentDiscovery(){const h=document.getElementById("parentCheck");h.innerHTML=discoveryForm("parent");bindDiscovery(h);renderDiscoveryCompare()}
function startLearnerDiscovery(){const h=document.getElementById("learnerDiscovery");h.innerHTML=discoveryForm("learner")+'<button class="dark discoveryContinue" onclick="showTask()">Continue to Buddy task</button>';bindDiscovery(h);h.scrollIntoView({behavior:"smooth",block:"start"});renderDiscoveryCompare()}
function renderDiscoveryCompare(){const h=document.getElementById("discoveryCompare"),state=document.getElementById("parentDiscoveryState");const x=discoveryData();const pc=Object.keys(x.parent||{}).length,lc=Object.keys(x.learner||{}).length;if(state)state.innerHTML='<p class="micro"><b>'+pc+'/4</b> Parent checks saved. Taz answers remain separate.</p>';if(!h)return;h.innerHTML=discoveryQuestions.map(function(q,i){const p=x.parent&&x.parent[i],l=x.learner&&x.learner[i];return '<div class="compareRow"><b>'+q.d+'</b><span>Parent<em>'+(p||"Waiting")+'</em></span><span>Taz<em>'+(l||"Waiting")+'</em></span><span>Behaviour<em>Still discovering</em></span></div>'}).join("")}
renderDiscoveryCompare();

function refreshMapFromEvidence(){
 var events=[];try{events=JSON.parse(localStorage.getItem("ciEvidence")||"[]")}catch(e){}
 var has=events.length>0;
 var states={Thinking:has?"Observed":"Still discovering",Confidence:has?"Observed":"Still discovering",Expression:has?"Observed":"Still discovering",Learning:"Still discovering",Focus:"Still discovering",Independence:"Still discovering"};
 document.querySelectorAll(".mapStage .node").forEach(function(n){var b=n.querySelector("b"),v=n.querySelector("span");if(b&&v&&states[b.textContent.trim()])v.textContent=states[b.textContent.trim()]});
 var bs=document.getElementById("behaviourState");if(bs)bs.textContent=has?events.length+" observed learning event"+(events.length===1?"":"s"):"No events yet";
 var pt=document.getElementById("progressTitle"),px=document.getElementById("progressText");if(has&&pt){pt.textContent=events.length+" learning event"+(events.length===1?"":"s")+" captured";px.textContent="Immediate evidence captured. Retention, transfer and independence still need later checks."}
}
var previousRecordEvidence=recordEvidence;
recordEvidence=function(){previousRecordEvidence();refreshMapFromEvidence()}
refreshMapFromEvidence();

function jumpRole(role){
 if(typeof applyRole==="function")applyRole(role);
 var label=document.getElementById("roleLabel");if(label)label.textContent={learner:"Learner",parent:"Parent",teacher:"Teacher",superuser:"Super User",creator:"Creator"}[role];
 document.querySelectorAll("[data-role-jump]").forEach(function(b){b.classList.toggle("active",b.dataset.roleJump===role)});
 if(typeof openRoleHome==="function")openRoleHome(role);
}
document.querySelectorAll("[data-role-jump]").forEach(function(b){b.onclick=function(){jumpRole(b.dataset.roleJump)}});
setTimeout(function(){jumpRole(localStorage.getItem("ciRole")||"superuser")},0);

function roleDestination(role){return {learner:"buddy",parent:"parent",teacher:"teacher",superuser:"understanding",creator:"creatorStudio"}[role]||"home"}
var priorJumpRole=jumpRole;
jumpRole=function(role){
 if(typeof applyRole==="function")applyRole(role);
 var label=document.getElementById("roleLabel");if(label)label.textContent={learner:"Learner",parent:"Parent",teacher:"Teacher",superuser:"Super User",creator:"Creator"}[role];
 document.querySelectorAll("[data-role-jump]").forEach(function(b){b.classList.toggle("active",b.dataset.roleJump===role)});
 go(roleDestination(role));
}
document.querySelectorAll("[data-role-jump]").forEach(function(b){b.onclick=function(){jumpRole(b.dataset.roleJump)}});

// usability pass
function rolePurpose(role){return {learner:"Learn with Buddy",parent:"Understand Taz and know what to do",teacher:"Teach Taz with clear actions",superuser:"Inspect the full learner intelligence",creator:"Control methodology and system rules"}[role]||"";}
document.querySelectorAll("[data-role-jump]").forEach(function(b){b.title=rolePurpose(b.dataset.roleJump)});

function friendlyRoleDestination(role){return {learner:"learnerStart",parent:"parentStart",teacher:"teacherStart",superuser:"understanding",creator:"creatorStudio"}[role]||"home"}
jumpRole=function(role){
 localStorage.setItem("ciRole",role);document.body.dataset.role=role;
 var label=document.getElementById("roleLabel");if(label)label.textContent={learner:"Learner",parent:"Parent",teacher:"Teacher",superuser:"Super User",creator:"Creator"}[role];
 document.querySelectorAll("[data-role-jump],[data-role]").forEach(function(b){var r=b.dataset.roleJump||b.dataset.role;b.classList.toggle("active",r===role)});
 if(typeof oldApplyRole==="function")oldApplyRole(role);
 go(friendlyRoleDestination(role));
}
document.querySelectorAll("[data-role-jump],[data-role]").forEach(function(b){b.onclick=function(){jumpRole(b.dataset.roleJump||b.dataset.role)}});


// REAL INTELLIGENCE LOOP V1
// Keeps source, hypotheses, observations, teaching decisions and outcomes separate.
function ciEvidenceList(){
  try{
    var x=JSON.parse(localStorage.getItem("ciEvidence")||"[]");
    return Array.isArray(x)?x:(x?[x]:[]);
  }catch(e){return []}
}
function ciSaveEvidence(list){localStorage.setItem("ciEvidence",JSON.stringify(list));}
recordEvidence=function(){
  var a=answer.value.trim();
  if(!a){taskResult.textContent="Tell Buddy what you think first.";return}
  var list=ciEvidenceList();
  var e={id:"ev_"+Date.now(),time:new Date().toLocaleString(),task:"English explanation",answer:a,confidence:+confidence.value,status:"Observed",source:"learner behaviour",outcome:null};
  list.push(e);ciSaveEvidence(list);
  taskResult.innerHTML="<b>Recorded.</b> This is evidence, not a permanent label. Buddy will use it to choose the next test.";
  renderEvidence();refreshMapFromEvidence();renderRealLoop();
}
renderEvidence=function(){
  var list=ciEvidenceList(),el=document.getElementById("eventLog");
  if(el)el.innerHTML=list.length?list.slice().reverse().map(function(e){return '<div class="event"><b>'+escapeHtml(e.status||"Observed")+'</b> · '+escapeHtml(e.task)+' · confidence '+escapeHtml(e.confidence)+'/5<br><small>'+escapeHtml(e.time)+' · '+(e.outcome?escapeHtml(e.outcome):"Retention and transfer not tested yet")+'</small></div>'}).join(""):"<p>No behavioural evidence recorded yet.</p>";
  var bs=document.getElementById("behaviourState");if(bs)bs.textContent=list.length+" observed event"+(list.length===1?"":"s");
  var pt=document.getElementById("progressTitle"),px=document.getElementById("progressText");if(pt){pt.textContent=list.length?list.length+" learning event"+(list.length===1?"":"s")+" captured":"No behavioural evidence yet";px.textContent=list.length?"Immediate evidence captured. Retention, transfer and independence still need later checks.":"Complete a Buddy task to start building evidence."}
}
refreshMapFromEvidence=function(){
  var events=ciEvidenceList(),has=events.length>0;
  var states={Thinking:has?"Observed":"Still discovering",Confidence:has?"Observed":"Still discovering",Expression:has?"Observed":"Still discovering",Learning:"Still discovering",Focus:"Still discovering",Independence:"Still discovering"};
  document.querySelectorAll(".mapStage .node").forEach(function(n){var b=n.querySelector("b"),v=n.querySelector("span");if(b&&v&&states[b.textContent.trim()])v.textContent=states[b.textContent.trim()]});
  var bs=document.getElementById("behaviourState");if(bs)bs.textContent=has?events.length+" observed learning event"+(events.length===1?"":"s"):"No events yet";
}
function buildLocalIntelligence(){
  var events=ciEvidenceList(),d=discoveryData(),latest=events[events.length-1];
  var hypotheses=[
    {domain:"Thinking",finding:"Taz may respond better when asked to explain reasoning before being corrected.",status:events.length?"Observed":"Predicted",why:events.length?"A real English explanation has been captured; the pattern still needs repetition.":"Starting profile and discovery inputs suggest this is worth testing, not assuming.",validation_needed:["Repeat across 3 different English tasks","Retest after 7+ days","Check whether prompts can be reduced"],buddy_test:"Ask for his reasoning first, then give one targeted prompt.",teaching_experiment:"Compare direct correction vs one reasoning prompt.",success_criteria:["Better explanation quality","Less prompting","Works on a different task"]},
    {domain:"Independence",finding:"The system does not yet know how quickly support can be removed.",status:"Still discovering",why:"Independence requires repeated outcomes, not profile data.",validation_needed:["Track hints used","Retest without the hint","Check transfer"],buddy_test:"Use one hint, then remove support on the next item.",teaching_experiment:"Record whether Taz can apply the same idea independently.",success_criteria:["Fewer hints","Correct transfer","Retained later"]}
  ];
  return {engine_version:"local-loop-v1",hypotheses:hypotheses,role_output:{priority:latest?"Use the latest observed explanation as the starting point.":"Collect one real learning event first.",do:"Ask Taz to explain his reasoning, then give only one prompt.",if_stuck:"Show one example, then return control to Taz.",watch_for:"Self-correction, help-seeking, confidence, transfer and independence.",evidence_count:events.length,parent_checks:Object.keys(d.parent||{}).length,learner_checks:Object.keys(d.learner||{}).length}};
}
runIntelligenceEngine=async function(){
  var btn=document.getElementById("runEngineBtn");if(btn){btn.disabled=true;btn.textContent="Generating..."}
  try{
    var data=buildLocalIntelligence();renderHypotheses(data);renderRealLoop();
    var state=document.getElementById("engineState");if(state)state.innerHTML="<b>Intelligence loop updated</b><span>"+ciEvidenceList().length+" behavioural event(s). Hypotheses remain separate from observed facts.</span>";
  }finally{if(btn){btn.disabled=false;btn.textContent="Update intelligence"}}
}
function renderRealLoop(){
  var lab=document.querySelector("#lab .labFlow");if(!lab)return;
  var n=ciEvidenceList().length, data=buildLocalIntelligence(), decision=data.role_output;
  lab.innerHTML='<div><span class="kicker">RAW</span><h3>Source stays source</h3><p>Birth/profile, Parent and Taz inputs remain separate.</p></div><div class="arrow">→</div><div><span class="kicker">HYPOTHESIS</span><h3>Test, never assume</h3><p>'+escapeHtml(data.hypotheses[0].finding)+'</p></div><div class="arrow">→</div><div><span class="kicker">VALIDATION</span><h3>'+n+' behaviour event'+(n===1?"":"s")+'</h3><p>Need repetition, retention and transfer before establishing a finding.</p></div><div class="arrow">→</div><div><span class="kicker">TEACHING DECISION</span><h3>One prompt, then return control</h3><p>'+escapeHtml(decision.do)+'</p></div><div class="arrow">→</div><div><span class="kicker">BUDDY → EVIDENCE → OUTCOME</span><h3>Close the loop</h3><p>Buddy tests the decision; outcome updates the intelligence instead of creating a fixed label.</p></div>';
  renderRoleIntelligence(data);
}
renderEvidence();refreshMapFromEvidence();renderRealLoop();


// INTELLIGENCE RECORD V2 — longitudinal finding → experiment → outcome → update
function ciRecords(){
  try{return JSON.parse(localStorage.getItem("ciRecords")||"[]")}catch(e){return []}
}
function ciSaveRecords(x){localStorage.setItem("ciRecords",JSON.stringify(x))}
function ciEnsureRecord(){
  var rs=ciRecords();
  if(!rs.length){
    rs.push({id:"finding_reasoning_support",learner_id:tazLearner.id,domain:"Thinking",finding:"Taz may benefit when he explains his reasoning before correction.",status:"Predicted",sources:["metaphysics hypothesis","learner discovery","parent discovery"],experiments:[],helped:0,did_not_help:0,retention_checks:0,transfer_checks:0,independent_successes:0,next_action:"Collect a real explanation, then test one-prompt support.",updated_at:new Date().toISOString()});
    ciSaveRecords(rs);
  }
  return rs[0];
}
function ciStatus(r){
  var n=r.experiments.length, positive=r.helped, retained=r.retention_checks, transferred=r.transfer_checks, independent=r.independent_successes;
  if(n===0)return "Predicted";
  if(n<3)return "Emerging";
  if(positive===0&&r.did_not_help>=2)return "Contradicted";
  if(positive>=2&&retained<1)return "Observed";
  if(positive>=2&&retained>=1&&transferred>=1&&independent>=1)return "Established";
  return "Tested";
}
function ciRecordOutcome(result){
  var rs=ciRecords(),r=ciEnsureRecord();rs=ciRecords();r=rs.find(function(x){return x.id==="finding_reasoning_support"})||rs[0];
  var ev=ciEvidenceList(),latest=ev[ev.length-1]; if(!latest)return;
  var exp={id:"exp_"+Date.now(),evidence_id:latest.id,method:"One reasoning prompt, then return control",immediate_result:result.helped?"helped":"did not help",hints:+result.hints,independent:!!result.independent,retention:result.retention||"not tested",transfer:result.transfer||"not tested",time:new Date().toISOString()};
  r.experiments.push(exp); if(result.helped)r.helped++;else r.did_not_help++;
  if(result.retention==="retained")r.retention_checks++;
  if(result.transfer==="transferred")r.transfer_checks++;
  if(result.independent)r.independent_successes++;
  r.status=ciStatus(r);
  r.next_action=r.status==="Established"?"Use this method when useful, while continuing to check that Taz stays independent.":r.retention_checks<1?"Retest later to see if the learning is retained.":r.transfer_checks<1?"Try the same skill on a different English task to check transfer.":r.independent_successes<1?"Reduce support and check whether Taz can do it independently.":"Repeat once more before treating this as reliable.";
  r.updated_at=new Date().toISOString();ciSaveRecords(rs);
  latest.outcome=exp.immediate_result+" · "+exp.hints+" hint(s) · "+(exp.independent?"independent":"support still needed");ciSaveEvidence(ev);
  renderEvidence();renderIntelligenceRecord();renderRealLoop();
}
function renderOutcomeCapture(){
  var task=document.getElementById("task");if(!task||document.getElementById("outcomeCapture"))return;
  var box=document.createElement("div");box.id="outcomeCapture";box.className="task hidden";
  box.innerHTML='<span class="kicker">DID IT WORK?</span><h3>Record the teaching outcome</h3><p>After Buddy gives one reasoning prompt, record what actually happened.</p><div class="discoverOptions"><button data-help="yes">Helped</button><button data-help="no">Did not help</button></div><label>Hints used <select id="outcomeHints"><option>0</option><option>1</option><option>2</option><option>3</option></select></label><label><input id="outcomeIndependent" type="checkbox"> Taz completed it independently</label><button id="saveOutcome" class="dark">Save outcome</button><p id="outcomeSaved"></p>';
  task.parentNode.insertBefore(box,task.nextSibling);var helped=null;
  box.querySelectorAll("[data-help]").forEach(function(b){b.onclick=function(){helped=b.dataset.help==="yes";box.querySelectorAll("[data-help]").forEach(function(x){x.classList.toggle("selected",x===b)})}});
  document.getElementById("saveOutcome").onclick=function(){if(helped===null){outcomeSaved.textContent="Choose Helped or Did not help first.";return}ciRecordOutcome({helped:helped,hints:+outcomeHints.value,independent:outcomeIndependent.checked});outcomeSaved.textContent="Saved. The finding and next action have been updated from this outcome."};
}
var ciRecordEvidenceV1=recordEvidence;
recordEvidence=function(){ciRecordEvidenceV1();ciEnsureRecord();renderOutcomeCapture();var b=document.getElementById("outcomeCapture");if(b){b.classList.remove("hidden");b.scrollIntoView({behavior:"smooth",block:"start"})}renderIntelligenceRecord()}
function renderIntelligenceRecord(){
  var r=ciEnsureRecord(),lab=document.getElementById("hypothesisGrid");if(!lab)return;
  var summary='<article class="hypothesisCard"><div class="hypTop"><span class="status predicted">'+escapeHtml(r.status)+'</span><small>'+escapeHtml(r.domain)+'</small></div><h3>'+escapeHtml(r.finding)+'</h3><p><b>Evidence:</b> Tried '+r.experiments.length+' time(s); helped '+r.helped+'; did not help '+r.did_not_help+'.</p><p><b>Long-term:</b> Retention '+r.retention_checks+' · Transfer '+r.transfer_checks+' · Independent '+r.independent_successes+'.</p><div class="testBox"><b>Next best action</b><p>'+escapeHtml(r.next_action)+'</p></div><p class="micro">Status changes from outcomes, not from profile prediction alone.</p></article>';
  lab.innerHTML=summary;
}
var ciBuildV1=buildLocalIntelligence;
buildLocalIntelligence=function(){
  var data=ciBuildV1(),r=ciEnsureRecord();
  data.engine_version="intelligence-record-v2";data.hypotheses[0].status=r.status;
  data.hypotheses[0].why="Tried "+r.experiments.length+" time(s); helped "+r.helped+"; did not help "+r.did_not_help+". Retention "+r.retention_checks+", transfer "+r.transfer_checks+", independent "+r.independent_successes+".";
  data.role_output.priority=r.next_action;data.role_output.record_status=r.status;return data;
}
renderOutcomeCapture();renderIntelligenceRecord();

// Approved V2 master navigation + Zodiac selector
const zodiacNames=["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
let selectedZodiac=localStorage.getItem("ciZodiac")||"Dragon";
function selectZodiac(name){selectedZodiac=name;localStorage.setItem("ciZodiac",name);document.querySelectorAll(".zodiacBuddy").forEach(b=>b.classList.toggle("selected",b.dataset.zodiac===name));document.querySelectorAll(".buddyTile h3").forEach(x=>x.textContent=name);}
document.querySelectorAll(".zodiacBuddy").forEach(b=>b.onclick=()=>{selectZodiac(b.dataset.zodiac);go("buddy")});selectZodiac(selectedZodiac);
document.querySelectorAll(".approvedNav [data-page]").forEach(b=>b.onclick=()=>{document.querySelectorAll(".approvedNav button").forEach(x=>x.classList.toggle("active",x===b));go(b.dataset.page)});

// Approved home Buddy style selector
function syncHomeBuddyStyle(name){var key=name.toLowerCase();var img=document.getElementById("homeDragon");if(img)img.src="dragon-"+key+".png";document.querySelectorAll("[data-home-style]").forEach(b=>b.classList.toggle("selected",b.dataset.homeStyle===key));if(styleData[name]){current=name;localStorage.setItem("ciBuddyStyle",name);renderStyles();}}
document.querySelectorAll("[data-home-style]").forEach(b=>b.onclick=()=>syncHomeBuddyStyle(b.dataset.homeStyle[0].toUpperCase()+b.dataset.homeStyle.slice(1)));syncHomeBuddyStyle(current);
