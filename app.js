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
