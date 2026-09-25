const views=[...document.querySelectorAll(".view")], nav=[...document.querySelectorAll(".nav[data-view]")];
function show(id){views.forEach(v=>v.classList.toggle("active",v.id===id));nav.forEach(n=>n.classList.toggle("active",n.dataset.view===id));window.scrollTo(0,0)}
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.view)));
document.getElementById("whyBtn")?.addEventListener("click",()=>document.getElementById("buddyLine").textContent="Because yesterday you explained your answer well after finding the clue. I want to see if that works again.");
document.getElementById("hintBtn")?.addEventListener("click",()=>document.getElementById("buddyLine").textContent="Watch what Maya does, not only what she says.");
document.querySelectorAll(".answers button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".answers button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");document.getElementById("reason").classList.remove("hidden")}));
document.getElementById("helpBtn")?.addEventListener("click",()=>{document.getElementById("supportState").textContent="Buddy: one clue";document.getElementById("coachTitle").textContent="Look for the mismatch.";document.getElementById("coachText").textContent="What Maya says and what Maya does do not match. Which clue matters more?"});
document.getElementById("reasonDone")?.addEventListener("click",()=>{document.getElementById("coachTitle").textContent="I noticed how you reasoned.";document.getElementById("coachText").textContent="You used behaviour as evidence instead of guessing from the word “fine”. I’ll check whether you do that again in another context.";document.getElementById("reasonDone").textContent="Recorded"});
const mind={thinking:["You may reason better when you find the clue first.","Tried 1 time · still checking","A different inference question"],confidence:["I'm still learning when you feel sure enough to answer.","Not enough evidence yet","Compare first answer vs changed answer"],expression:["I'm still discovering how you explain ideas best.","Not enough evidence yet","A short explain-in-your-own-words task"],independence:["I'm checking how much help you actually need.","Not enough evidence yet","Same task with Buddy quieter"],focus:["I'm still discovering what helps you stay with a task.","Not enough evidence yet","Compare two task formats"]};
document.querySelectorAll("[data-detail]").forEach(b=>b.addEventListener("click",()=>{const d=mind[b.dataset.detail];document.getElementById("mindTitle").textContent=d[0];document.getElementById("mindEvidence").textContent=d[1];document.getElementById("mindNext").textContent=d[2]}));
function ask(){const i=document.getElementById("homeAsk");if(!i.value.trim())return;show("buddy");const ci=document.querySelector(".chatInput input");ci.value=i.value;i.value="";ci.focus()}
document.getElementById("sendAsk")?.addEventListener("click",ask);document.getElementById("homeAsk")?.addEventListener("keydown",e=>{if(e.key==="Enter")ask()});
show("home");

/* CHILD INTELLIGENCE: adaptive support + challenge + global transfer */
const CI_CHALLENGE={
  support:["Independent","Prompt","Clue","Strategy","Partial teaching","Full teaching"],
  challenge:["Current level","Deeper thinking","Higher year/grade","High-ability challenge","Country challenge","Cross-system challenge"],
  homeCurriculum:"Singapore MOE",
  rule:"Home curriculum stays the anchor. Challenge results are evidence, not a new school-level label."
};
function ciChallengeState(){
  try{return JSON.parse(localStorage.getItem("ciChallengeState"))||{skill:"English inference",support:0,challenge:0,friction:"green",evidence:[],country:null}}
  catch(e){return {skill:"English inference",support:0,challenge:0,friction:"green",evidence:[],country:null}}
}
function ciSaveChallenge(s){localStorage.setItem("ciChallengeState",JSON.stringify(s))}
function ciReadiness(s){
  const recent=s.evidence.slice(-5);
  if(recent.length<3)return false;
  const independent=recent.filter(x=>x.correct&&x.support===0).length;
  const transfer=recent.some(x=>x.transfer);
  return independent>=3&&transfer;
}
function ciRecordChallenge(result){
  const s=ciChallengeState();
  s.evidence.push({time:new Date().toISOString(),correct:!!result.correct,support:result.support||0,transfer:!!result.transfer,retained:!!result.retained,country:result.country||null,challenge:s.challenge});
  if(result.friction)s.friction=result.friction;
  if(ciReadiness(s)&&s.friction!=="red")s.challenge=Math.min(5,s.challenge+1);
  if(s.friction==="red")s.support=Math.min(5,s.support+1);
  else if(result.correct&&s.support>0)s.support--;
  ciSaveChallenge(s);return s;
}
function ciChooseChallenge(mode,country){
  const s=ciChallengeState();
  const map={deeper:1,higher:2,advanced:3,country:4,global:5};
  s.challenge=map[mode]??s.challenge;
  s.country=mode==="country"?country:null;
  s.support=0;
  ciSaveChallenge(s);
  return {
    skill:s.skill,
    homeCurriculum:CI_CHALLENGE.homeCurriculum,
    challenge:CI_CHALLENGE.challenge[s.challenge],
    country:s.country,
    instruction:s.challenge===4
      ?"Create a comparable "+country+" curriculum-aligned task for the same underlying skill; do not claim the learner is at that country's school level."
      :s.challenge===5
      ?"Create an unfamiliar cross-system task that tests transfer, evidence use and reasoning without Buddy help."
      :"Increase reasoning demand while preserving the target skill."
  };
}
function ciChallengeOffer(){
  const s=ciChallengeState();
  return ciReadiness(s)
    ?"You’re handling this independently. Want a harder one?"
    :"Let’s build a little more evidence before Buddy raises the level automatically.";
}
window.ChildIntelligenceChallenge={config:CI_CHALLENGE,state:ciChallengeState,record:ciRecordChallenge,choose:ciChooseChallenge,offer:ciChallengeOffer};


/* COMPLETE LEARNING LOOP V1
   Attempt -> diagnose -> minimum useful help -> same-question repair ->
   new-question confirmation -> transfer -> exam -> retention -> challenge.
*/
const CI_ENGINE={
  stages:["repair","confirm","transfer","exam","retention"],
  lifecycle:["Predicted","Emerging","Observed","Tested","Established","Contradicted"],
  causes:["vocabulary","question_interpretation","evidence_detection","evidence_connection","reasoning","expression","rushing","attention","confidence","knowledge_gap","strategy_gap","dependency"],
  evidenceLayers:["Predicted","Reported","Observed","Tested","Established"],
  principle:"Observed behaviour overrides predicted profile."
};
function ciEngineState(){
  try{return JSON.parse(localStorage.getItem("ciEngineState"))||{
    skill:"English comprehension · inference",stage:"repair",support:0,friction:"green",
    hypotheses:{},attempts:[],independentSuccesses:0,transferSuccesses:0,retentionSuccesses:0,
    profile:{metaphysics:"starting hypothesis",psychometric:"starting hypothesis"},
    nextAction:"independent_attempt"
  }}catch(e){return null}
}
function ciSaveEngine(s){localStorage.setItem("ciEngineState",JSON.stringify(s))}
function ciTopCause(h){
  const keys=Object.keys(h);if(!keys.length)return "reasoning";
  return keys.sort((a,b)=>h[b]-h[a])[0];
}
function ciObserveAttempt(x){
  let s=ciEngineState(),h=s.hypotheses;
  if(!x.correct){
    if(x.responseMs!=null&&x.responseMs<4000&&!x.reread)h.rushing=(h.rushing||0)+2;
    if(!x.evidenceSelected)h.evidence_detection=(h.evidence_detection||0)+1;
    if(x.evidenceSelected&&x.evidenceRelevant)h.evidence_connection=(h.evidence_connection||0)+1;
    if(x.asksWordMeaning)h.vocabulary=(h.vocabulary||0)+2;
    if(x.changedCorrectAnswer)h.confidence=(h.confidence||0)+1;
    if(x.repeatedHintUse)h.dependency=(h.dependency||0)+1;
  }
  const recent=s.attempts.slice(-2), repeated=recent.filter(a=>!a.correct).length>=2;
  s.friction=(x.abandoned||x.randomGuess)?"red":(repeated||x.helpRequested||((x.responseMs||99999)<4000))?"amber":"green";
  const cause=ciTopCause(h);
  if(x.correct){s.support=0;s.nextAction="explain_reasoning";}
  else if(s.friction==="red"){s.support=Math.max(s.support,3);s.nextAction="teach_then_retry";}
  else {s.support=Math.max(s.support,1);s.nextAction="minimum_help_then_retry_same";}
  s.attempts.push({time:new Date().toISOString(),stage:s.stage,correct:!!x.correct,cause:cause,support:s.support,friction:s.friction});
  ciSaveEngine(s);return {state:s,cause:cause,message:ciHelpFor(cause,s.friction)};
}
function ciHelpFor(cause,friction){
  if(friction==="red")return "I’ll teach the missing piece, then you can try again.";
  return ({
    vocabulary:"Which word is unclear? I’ll explain only that part.",
    question_interpretation:"What is the question really asking you to find?",
    evidence_detection:"Show me one thing the character does that gives you a clue.",
    evidence_connection:"You found the clue. What might that behaviour tell us?",
    reasoning:"What does the evidence suggest?",
    expression:"You have the idea. Finish: ‘I think ___ because ___.’",
    rushing:"Before choosing, find one clue that supports your answer.",
    attention:"Read just the key sentence once more.",
    confidence:"Keep your answer for now. Show me why you chose it.",
    knowledge_gap:"Let me teach this one missing idea first.",
    strategy_gap:"Try this: find one clue before deciding.",
    dependency:"You try first. I’ll stay quiet unless you ask."
  })[cause]||"Show me what made you choose that answer.";
}
function ciAdvance(result){
  let s=ciEngineState();
  if(s.stage==="repair"&&result.correctAfterSupport){s.stage="confirm";s.support=0;s.nextAction="different_question_same_skill";}
  else if(s.stage==="confirm"&&result.correctIndependent){s.stage="transfer";s.independentSuccesses++;s.nextAction="different_context_different_phrasing";}
  else if(s.stage==="transfer"&&result.correctIndependent){s.stage="exam";s.transferSuccesses++;s.nextAction="singapore_exam_style_no_help";}
  else if(s.stage==="exam"&&result.correctIndependent){s.stage="retention";s.independentSuccesses++;s.nextAction="delayed_retest_no_help";}
  else if(s.stage==="retention"&&result.correctIndependent){s.retentionSuccesses++;s.nextAction="consider_challenge_ladder";}
  ciSaveEngine(s);return s;
}
function ciMastery(){
  const s=ciEngineState();
  return {established:s.transferSuccesses>0&&s.retentionSuccesses>0&&s.independentSuccesses>1,
    reason:"Mastery requires independent transfer and later retention; correcting the original item is not enough."};
}
window.ChildIntelligenceEngine={config:CI_ENGINE,state:ciEngineState,observe:ciObserveAttempt,advance:ciAdvance,mastery:ciMastery};

/* Challenge chooser UI wiring: learner can opt in even before automatic readiness. */
function ciOpenChallengeMenu(){
  const host=document.querySelector(".starterGrid"); if(!host)return;
  let panel=document.getElementById("challengeMenu");
  if(!panel){panel=document.createElement("div");panel.id="challengeMenu";panel.className="challengeMenu";
    panel.innerHTML='<b>How do you want to be challenged?</b><button data-ci-challenge="deeper">Go Deeper</button><button data-ci-challenge="higher">Go Higher</button><button data-ci-challenge="advanced">High-Ability Challenge</button><button data-ci-challenge="country">Go Global · Country</button><button data-ci-challenge="global">Global Boss</button><div id="countryChoices" hidden><button data-country="United Kingdom">UK</button><button data-country="United States">US</button><button data-country="Australia">Australia</button></div><p id="challengeMessage"></p>';
    host.after(panel);
    panel.querySelectorAll("[data-ci-challenge]").forEach(b=>b.onclick=()=>{
      if(b.dataset.ciChallenge==="country"){document.getElementById("countryChoices").hidden=false;return}
      const plan=ciChooseChallenge(b.dataset.ciChallenge);document.getElementById("challengeMessage").textContent=plan.challenge+" · "+plan.instruction;
    });
    panel.querySelectorAll("[data-country]").forEach(b=>b.onclick=()=>{const plan=ciChooseChallenge("country",b.dataset.country);document.getElementById("challengeMessage").textContent=plan.country+" challenge · same skill, different curriculum context.";});
  }
  panel.hidden=!panel.hidden;
}
document.querySelectorAll(".starterGrid button").forEach(b=>{if((b.textContent||"").includes("Challenge me"))b.addEventListener("click",ciOpenChallengeMenu)});

/* Fix old redesigned Help handler's removed element safely. */
if(!document.getElementById("supportState")){
  const coach=document.querySelector(".learnBuddyWords");
  if(coach){const s=document.createElement("small");s.id="supportState";s.textContent="Buddy: independent";coach.prepend(s);}
}


/* CHILD INTELLIGENCE COMPLETE PROCESS MODEL V1 */
const CI_PROCESS={
 learner:{name:"Taz",age:14,home:{country:"Singapore",system:"MOE",stage:"Secondary 2"},subject:"English"},
 sources:{
  metaphysics:{kind:"Predicted",purpose:"Generate starting hypotheses; never treated as observed fact."},
  psychometric:{kind:"Reported/Assessed",purpose:"Structured hypotheses about behaviour, confidence and learning."},
  child:{kind:"Reported",purpose:"Learner self-perception and preferences."},
  parent:{kind:"Reported",purpose:"Home observations and changes over time."},
  teacher:{kind:"Reported",purpose:"School observations and classroom performance."},
  behaviour:{kind:"Observed",purpose:"What the learner actually does during learning."}
 },
 domains:["Understanding & Thinking","Knowledge & Skills","Learning Behaviour","Attention & Engagement","Confidence & Emotion","Learning Strategies & Independence"],
 flow:["know_child","map_curriculum","task","observe","diagnose","friction","support","repair","confirm","transfer","exam","retention","independence","challenge","global_challenge","update_intelligence","role_outputs","next_test"],
 curriculum:{anchor:"Singapore MOE",rule:"Personalise how the learner reaches the target, not the target itself.",globalRule:"Other systems are challenge/transfer evidence, not replacement school-level labels."},
 challengeCountries:["United Kingdom","United States","Australia"],
 mastery:{requires:["independent performance","new-context transfer","delayed retention"],notEnough:["correct after hint","corrected same question"]},
 independence:{goal:"Learner can select and use a useful strategy without Buddy.",supportFade:[5,4,3,2,1,0]}
};
function ciStore(k,fallback){try{return JSON.parse(localStorage.getItem(k))||fallback}catch(e){return fallback}}
function ciEvidence(){return ciStore("ciEvidenceV3",[])}
function ciFindings(){return ciStore("ciFindingsV3",[])}
function ciSave(k,v){localStorage.setItem(k,JSON.stringify(v))}
function ciAddEvidence(e){
 const list=ciEvidence();list.push(Object.assign({id:"ev_"+Date.now(),time:new Date().toISOString(),layer:"Observed"},e));ciSave("ciEvidenceV3",list);return list[list.length-1];
}
function ciFindingStatus(r){
 const n=r.tests||0,h=r.helped||0;
 if(!n)return "Predicted"; if(n<3)return "Emerging";
 if(h===0&&(r.didNotHelp||0)>=2)return "Contradicted";
 if(h>=2&&!(r.retention||0))return "Observed";
 if(h>=2&&(r.retention||0)&&(r.transfer||0)&&(r.independent||0))return "Established";
 return "Tested";
}
function ciUpdateFinding(input){
 let rs=ciFindings(),r=rs.find(x=>x.id===input.id);
 if(!r){r={id:input.id,domain:input.domain,finding:input.finding,sources:input.sources||[],tests:0,helped:0,didNotHelp:0,retention:0,transfer:0,independent:0,status:"Predicted"};rs.push(r)}
 if(input.outcome){r.tests++;input.outcome.helped?r.helped++:r.didNotHelp++;if(input.outcome.retained)r.retention++;if(input.outcome.transferred)r.transfer++;if(input.outcome.independent)r.independent++}
 r.status=ciFindingStatus(r);r.updatedAt=new Date().toISOString();ciSave("ciFindingsV3",rs);return r;
}
function ciRoleOutput(role){
 const findings=ciFindings(),established=findings.filter(x=>x.status==="Established"),testing=findings.filter(x=>x.status!=="Established"&&x.status!=="Contradicted");
 if(role==="child")return {title:"What Buddy is learning about me",known:established.map(x=>x.finding),checking:testing.map(x=>x.finding),goal:"Know what to do when I get stuck."};
 if(role==="parent")return {title:"What changed and did it work?",evidence:findings.map(x=>({finding:x.finding,status:x.status,tried:x.tests,helped:x.helped,independent:x.independent})),next:"Buddy will keep testing whether useful strategies last and transfer."};
 if(role==="teacher")return {title:"Recommended Teaching Approach",actions:established.map(x=>x.finding),checking:testing.map(x=>x.finding),rule:"Use the smallest useful support, then return control to the learner."};
 return {title:"Intelligence Lab",sources:CI_PROCESS.sources,findings,evidence:ciEvidence(),flow:CI_PROCESS.flow};
}
function ciNextDecision(){
 const learn=ciEngineState(),challenge=ciChallengeState(),mastery=ciMastery();
 if(learn.friction==="red")return {action:"teach_or_reframe",why:"Struggle is no longer productive."};
 if(learn.friction==="amber")return {action:"minimum_useful_support",why:"Friction is rising."};
 if(mastery.established&&ciReadiness(challenge))return {action:"challenge",why:"Independent transfer and retention support a stretch task."};
 return {action:learn.nextAction||"independent_attempt",why:"Continue gathering evidence."};
}
window.ChildIntelligence={
 process:CI_PROCESS,
 evidence:{all:ciEvidence,add:ciAddEvidence},
 findings:{all:ciFindings,update:ciUpdateFinding},
 roles:ciRoleOutput,
 next:ciNextDecision,
 learning:window.ChildIntelligenceEngine,
 challenge:window.ChildIntelligenceChallenge
};

/* Capture the live inference interaction into the shared evidence layer. */
document.querySelectorAll(".answers button").forEach(btn=>btn.addEventListener("click",()=>{
 ciAddEvidence({task:"English inference",skill:"inferential comprehension",answer:btn.textContent.trim(),correct:btn.dataset.correct==="1",support:ciEngineState().support,stage:ciEngineState().stage,source:"learner behaviour"});
}));


/* Singapore English inference vertical slice */
const ciSgInference={
 curriculum:{country:"Singapore",system:"MOE",stage:"Secondary 2",subject:"English",skill:"Inferential comprehension"},
 tasks:[
  {stage:"repair",text:"Maya says she is fine. She pushes her untouched lunch away and stares at the floor.",question:"What is Maya most likely feeling?",answer:"upset",clue:"stares at the floor"},
  {stage:"confirm",text:"Daniel enters class without speaking, drops his bag and avoids looking at his friends.",question:"What is Daniel most likely feeling?",answer:"upset",clue:"avoids looking at his friends"},
  {stage:"transfer",text:"Sarah says not to worry, forces a smile and folds a rejection letter into her bag.",question:"What does Sarah's behaviour suggest?",answer:"disappointment",clue:"forces a smile"},
  {stage:"exam",text:"Arun reads a message twice, types a reply, deletes it and puts his phone down without sending.",question:"What can you infer about Arun? Use evidence.",answer:"hesitant",clue:"deletes it"},
  {stage:"retention",text:"Mei pauses outside a room, hears applause, breathes slowly and then enters.",question:"What can you infer about Mei before she enters?",answer:"nervous",clue:"breathes slowly"}
 ]};
function ciSlice(){return ciStore("ciSlice",{stage:"repair",support:0,started:Date.now(),history:[]})}
function ciSliceSave(s){ciSave("ciSlice",s);return s}
function ciSliceTask(){let s=ciSlice();return ciSgInference.tasks.find(x=>x.stage===s.stage)||ciSgInference.tasks[0]}
function ciSliceSubmit(answer,evidence){
 let s=ciSlice(),t=ciSliceTask(),a=String(answer||"").toLowerCase(),correct=a.includes(t.answer);
 let diagnosis=ciObserveAttempt({correct:correct,responseMs:Date.now()-s.started,evidenceSelected:!!evidence,evidenceRelevant:String(evidence||"").toLowerCase().includes(t.clue),helpRequested:s.support>0});
 ciAddEvidence({layer:"Observed",skill:"inferential comprehension",stage:s.stage,correct:correct,evidence:evidence||"",diagnosis:diagnosis.cause,support:s.support});
 if(correct){if(s.stage==="repair")ciAdvance({correctAfterSupport:true});else ciAdvance({correctIndependent:s.support===0});s.stage=ciEngineState().stage;s.support=0}
 else{s.support=Math.min(5,s.support+1)}
 s.started=Date.now();s.history.push({stage:t.stage,correct:correct,diagnosis:diagnosis.cause,support:s.support});ciSliceSave(s);
 return {correct:correct,buddy:correct?"Good. Which clue proved it?":diagnosis.message,next:ciSliceTask(),stage:s.stage,support:s.support};
}
window.ChildIntelligenceVerticalSlice={model:ciSgInference,state:ciSlice,task:ciSliceTask,submit:ciSliceSubmit};


/* Question Intelligence V1: curriculum + assessment-pattern aware selection */
const CI_QUESTION_INTELLIGENCE={
 version:"1.0",
 sources:[
  {id:"moe",kind:"official-curriculum",use:"Defines learning outcomes and progression; never copied as practice content."},
  {id:"seab",kind:"official-assessment",use:"Defines assessment demands and formats."},
  {id:"tuitionwithjason",kind:"school-paper-reference",use:"Reference patterns for lower-secondary Maths."},
  {id:"testpapersfree",kind:"school-paper-reference",use:"Reference school/year/subject/assessment variation."},
  {id:"freetestpaper",kind:"school-paper-reference",use:"Reference cross-level and historical assessment variation."},
  {id:"secondaryexampapers",kind:"school-paper-reference",use:"Reference lower-secondary English school-paper patterns."}
 ],
 purposes:["diagnose","repair","confirm","transfer","exam","retention","challenge"],
 dimensions:["skill","subskill","text_or_problem_type","question_form","reasoning_demand","evidence_demand","language_load","steps","novelty","support_allowed"],
 rule:"Use source papers as assessment-pattern evidence. Prefer fresh questions; do not treat a paper's wording as the learner task unless separately licensed/allowed."
};
function ciQuestionSpec(input){
 const s=ciSlice(),e=ciEngineState(),purpose=input&&input.purpose||s.stage||"diagnose";
 const support=purpose==="repair"?Math.max(1,s.support||1):0;
 const novelty=purpose==="repair"?"same-context":purpose==="confirm"?"new-item-same-skill":purpose==="transfer"?"new-context":purpose==="exam"?"school-assessment-style":purpose==="retention"?"delayed-new-item":"adaptive";
 return {
  country:"Singapore",level:(input&&input.level)||"Secondary 2",subject:(input&&input.subject)||"English",
  skill:(input&&input.skill)||"inferential comprehension",purpose:purpose,
  constraints:{supportAllowed:purpose==="repair",supportLevel:support,novelty:novelty,requireEvidence:["confirm","transfer","exam","retention"].includes(purpose)},
  learner:{topCause:e.lastCause||null,friction:e.friction||"green",independence:e.support===0?"independent":"supported"},
  assessmentReference:{curriculum:"MOE",assessment:"SEAB",schoolPaperPatterns:["tuitionwithjason","testpapersfree","freetestpaper","secondaryexampapers"]},
  nextRule:"Choose the smallest change that tests the current hypothesis; do not increase difficulty and change skill at the same time."
 };
}
function ciNextQuestionPlan(){
 const spec=ciQuestionSpec({}); const task=ciSliceTask();
 return {spec:spec,current:task,decision:ciNextDecision(),why:"Selected from curriculum demand + current evidence + assessment pattern + support/challenge state."};
}
window.ChildIntelligenceQuestionIntelligence={model:CI_QUESTION_INTELLIGENCE,spec:ciQuestionSpec,next:ciNextQuestionPlan};


/* Connect the visible Learning tab to the vertical-slice engine. */
(function(){
 const root=document.getElementById("learning"); if(!root)return;
 const title=root.querySelector(".learnTop h1"),meta=root.querySelector(".learnTop small"),progress=root.querySelector(".learnProgress span");
 const quote=root.querySelector(".questionCard blockquote"),question=root.querySelector(".questionCard h2"),num=root.querySelector(".questionNo");
 const answers=root.querySelector(".answers"),reason=root.querySelector("#reason"),reasonText=reason&&reason.querySelector("textarea");
 const coachTitle=root.querySelector("#coachTitle"),coachText=root.querySelector("#coachText"),help=root.querySelector("#helpBtn"),done=root.querySelector("#reasonDone");
 const choices={
  repair:["Happy","Upset","Bored","Not sure"],
  confirm:["Excited","Upset","Amused","Relaxed"],
  transfer:["She is hiding disappointment","She is proud of the letter","She has forgotten about it","She finds it funny"]
 };
 function stageIndex(stage){return ["repair","confirm","transfer","exam","retention"].indexOf(stage)+1}
 function render(){
  const t=ciSliceTask(),s=ciSlice(),i=stageIndex(t.stage);
  meta.textContent="ENGLISH · INFERENCE · "+t.stage.toUpperCase(); title.textContent=t.question; progress.textContent="Step "+i+" of 5"; num.textContent=String(i).padStart(2,"0"); quote.textContent=t.text; question.textContent=t.question;
  reason.classList.add("hidden"); if(reasonText)reasonText.value="";
  answers.innerHTML="";
  (choices[t.stage]||[]).forEach(label=>{const b=document.createElement("button");b.textContent=label;b.addEventListener("click",()=>answer(label));answers.appendChild(b)});
  if(!choices[t.stage]){const input=document.createElement("textarea");input.id="ciOpenAnswer";input.placeholder="Write your answer and include a clue from the text...";input.style.cssText="width:100%;min-height:110px;padding:14px;border:1px solid #dfe5e1;border-radius:10px;font:inherit";answers.appendChild(input);const b=document.createElement("button");b.textContent="Check my answer";b.className="primary";b.addEventListener("click",()=>answer(input.value));answers.appendChild(b)}
  coachTitle.textContent=t.stage==="repair"?"Try it your way first.":t.stage==="confirm"?"Can you do it on a new question?":t.stage==="transfer"?"Now use the skill in a different situation.":t.stage==="exam"?"School-style check. No hints this time.":"One more check to see if it stayed with you.";
  coachText.textContent=t.stage==="repair"?"I won't jump in unless you ask.":"I'm checking what you can do independently.";
  help.style.display=t.stage==="repair"?"inline-block":"none";
 }
 function answer(value){
  const t=ciSliceTask(); let evidence="";
  if(t.stage==="exam"||t.stage==="retention"){evidence=value}
  const out=ciSliceSubmit(value,evidence);
  if(out.correct){coachTitle.textContent="Yes — now prove it.";coachText.textContent=out.buddy;reason.classList.remove("hidden");reason.dataset.next="1"}
  else{coachTitle.textContent="Not yet.";coachText.textContent=out.buddy||"Look for the strongest clue before deciding.";reason.classList.add("hidden")}
 }
 help.addEventListener("click",()=>{const s=ciSlice();s.support=Math.min(5,s.support+1);ciSliceSave(s);const t=ciSliceTask();coachTitle.textContent="One clue only.";coachText.textContent="Look closely at: “"+t.clue+"”. What does that behaviour suggest?"});
 done.addEventListener("click",()=>{const text=reasonText.value.trim();ciAddEvidence({layer:"Observed",skill:"inferential comprehension",stage:ciSlice().stage,type:"reasoning explanation",evidence:text});render()});
 render();
})();
