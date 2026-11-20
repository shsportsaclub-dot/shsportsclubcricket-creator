"use strict";
const KEY="sh-cricket-creator-innings-v1";
const $=id=>document.getElementById(id);
const blank=()=>({team:"Team A",limit:20,events:[]});
let state;
try{const saved=JSON.parse(localStorage.getItem(KEY));state=saved&&Array.isArray(saved.events)?saved:blank()}catch{state=blank()}
const legal=e=>e.type==="run"||e.type==="wicket";
function summary(){
 let runs=0,wickets=0,balls=0;
 for(const e of state.events){if(e.type==="run"){runs+=e.runs;balls++}else if(e.type==="wicket"){wickets++;balls++}else if(e.type==="wide"||e.type==="noball"){runs++}}
 return {runs,wickets,balls,ended:wickets>=10||balls>=state.limit*6};
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{$("status").textContent="Browser storage unavailable"}}
function render(){
 const s=summary();$("score").textContent=s.runs+"/"+s.wickets;$("overs").textContent=Math.floor(s.balls/6)+"."+(s.balls%6);
 $("rr").textContent=s.balls?(s.runs*6/s.balls).toFixed(2):"0.00";
 $("team").value=state.team;$("limit").value=state.limit;
 $("status").textContent=state.team||"Batting team";
 $("innings").textContent=s.ended?"Innings complete":"Legal deliveries: "+s.balls+" / "+state.limit*6;
 document.querySelectorAll("#runs button,#wide,#noball,#wicket").forEach(b=>b.disabled=s.ended);
 $("undo").disabled=state.events.length===0;
 const log=$("log");log.replaceChildren();
 state.events.slice().reverse().forEach(e=>{const li=document.createElement("li");li.textContent=e.type==="run"?e.runs+" run(s)":e.type==="wicket"?"WICKET":e.type==="wide"?"WIDE +1":"NO-BALL +1";log.appendChild(li)});
}
function add(event){if(summary().ended)return;state.events.push(event);save();render()}
document.querySelectorAll("#runs button").forEach(b=>b.addEventListener("click",()=>add({type:"run",runs:Number(b.dataset.runs)})));
$("wide").addEventListener("click",()=>add({type:"wide"}));
$("noball").addEventListener("click",()=>add({type:"noball"}));
$("wicket").addEventListener("click",()=>add({type:"wicket"}));
$("undo").addEventListener("click",()=>{state.events.pop();save();render()});
$("reset").addEventListener("click",()=>{if(confirm("Reset all scoring events for this innings?")){state.events=[];save();render()}});
$("team").addEventListener("change",e=>{state.team=e.target.value.trim().slice(0,40)||"Team A";save();render()});
$("limit").addEventListener("change",e=>{const v=Number(e.target.value);state.limit=Number.isInteger(v)?Math.min(50,Math.max(1,v)):20;save();render()});
render();
