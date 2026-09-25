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
