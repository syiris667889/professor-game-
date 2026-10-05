const rounds=[
 {name:"Раунд 1",tag:"Ответ за 5 секунд",time:5,kind:"speed",items:[
 "Назовите три причины любить пятницу.",
 "Назовите три фразы учителя перед контрольной.",
 "Назовите три приятных занятия после уроков.",
 "Покажите жестами: до звонка осталась одна минута.",
 "Покажите жестами: «Кто хочет на доске?»"
 ]},
 {name:"Раунд 2",tag:"Реклама за 5 секунд",time:5,kind:"ad",items:[
 "«Сегодня домашнего задания не будет!» — как на Евровидении.",
 "Реклама красной ручки.",
 "«Завтра контрольная!» — как прекрасная новость.",
 "Ученик не выучил урок.",
 "«Открываем дневники!» — церемония награждения."
 ]},
 {name:"Раунд 3",tag:"Запрещённое слово",time:null,kind:"forbidden",items:[
 "Вы любите свою работу?",
 "Вы когда-нибудь ставили двойку?",
 "Хотели отменить урок?",
 "Проверяете тетради вечером?",
 "Радуетесь каникулам больше учеников?"
 ]},
 {name:"Финальный раунд",tag:"Ответ за 10 секунд",time:10,kind:"final",items:[
 "Назовите три вещи, которые делают идеальный урок.",
 "Придумайте девиз учителя на понедельник.",
 "Назовите три слова, которые ученик хочет услышать после контрольной.",
 "За 10 секунд придумайте название для школьного телешоу.",
 "Одним предложением объясните, почему учителя — супергерои."
 ]}
];

let r=0,q=-1,state="intro",timer=null,endAt=0,muted=false;
const screen=document.getElementById("screen"), progress=document.getElementById("progress");

function total(){return rounds.reduce((n,x)=>n+x.items.length,0)}
function globalIndex(){let n=0;for(let i=0;i<r;i++)n+=rounds[i].items.length;return n+(q<0?0:q)+1}
function render(){
 clearInterval(timer);
 const round=rounds[r];
 progress.textContent=`${Math.min(globalIndex(),total())} / ${total()}`;
 if(state==="intro"){
   screen.innerHTML=`<section class="slide"><div class="round-num">${String(r+1).padStart(2,"0")}</div><div class="eyebrow">${round.name} · ${round.tag}</div><h1 class="title">${round.name}</h1><div class="subtitle">${round.time?`НА ОТВЕТ — ${round.time} СЕКУНД`:"ОТВЕЧАЙТЕ, НЕ ПРОИЗНОСЯ «ДА» И «НЕТ»"}</div></section>`;
 } else if(state==="question"){
   screen.innerHTML=`<section class="slide"><div class="question-no">${round.name.toUpperCase()} · ${q+1} / ${round.items.length}</div><h1 class="question">${round.items[q]}</h1>${round.kind==="forbidden"?'<div class="forbidden">● ЗАПРЕЩЕНО: «ДА» И «НЕТ»</div>':'<div class="hint">ПРОБЕЛ — ЗАПУСТИТЬ ТАЙМЕР</div>'}</section>`;
 } else if(state==="timer"){
   screen.innerHTML=`<section class="slide"><div class="question-no">${round.name.toUpperCase()} · ${q+1} / ${round.items.length}</div><h1 class="question">${round.items[q]}</h1><div class="timer-wrap"><div class="timer-line"><div class="timer-fill" id="fill"></div></div><div class="timer-number" id="num">${round.time}</div></div></section>`;
   startTimer();
 } else if(state==="done"){
   screen.innerHTML=`<section class="slide timeup"><div class="eyebrow">Время</div><div class="timer-number">0</div><h1 class="title" style="font-size:clamp(40px,5vw,80px)">СТОП.</h1><div class="subtitle">Ответ засчитан</div></section>`;
 }
}
function startTimer(){
 if(!rounds[r].time)return;
 const duration=rounds[r].time*1000; endAt=performance.now()+duration;
 const fill=document.getElementById("fill"), num=document.getElementById("num");
 timer=setInterval(()=>{
   const left=Math.max(0,endAt-performance.now());
   fill.style.width=(left/duration*100)+"%";
   num.textContent=Math.ceil(left/1000);
   if(left<=0){clearInterval(timer);state="done";beep();render();}
 },30);
}
function next(){
 const round=rounds[r];
 if(state==="intro"){q=0;state="question";}
 else if(state==="question"){
   if(round.time){state="timer"} else {state="question"}
 }
 else if(state==="timer"){clearInterval(timer);state="done"}
 else if(state==="done"){
   if(q<round.items.length-1){q++;state="question"}
   else if(r<rounds.length-1){r++;q=-1;state="intro"}
   else{showFinish();return}
 }
 render();
}
function prev(){
 clearInterval(timer);
 if(state!=="intro"&&q>0){q--;state="question"}
 else if(state==="intro"&&r>0){r--;q=rounds[r].items.length-1;state="question"}
 else{state="intro"}
 render();
}
function resetRound(){clearInterval(timer);q=-1;state="intro";render()}
function showFinish(){screen.innerHTML=`<section class="slide"><div class="eyebrow">Педагогическая дуэль</div><h1 class="title">ИГРА<br>ОКОНЧЕНА</h1><div class="score-card"><div class="score"><b>27</b><span>ЗАДАНИЙ</span></div><div class="score"><b>★</b><span>ПОБЕДИТЕЛЬ</span></div></div><div class="subtitle">Нажмите R, чтобы начать заново</div></section>`;progress.textContent=`${total()} / ${total()}`}
function beep(){if(muted)return;try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=880;o.type="sine";g.gain.setValueAtTime(.0001,a.currentTime);g.gain.exponentialRampToValueAtTime(.08,a.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.22);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.23)}catch(e){}}
document.getElementById("startBtn").onclick=next;
document.getElementById("menuBtn").onclick=()=>document.getElementById("panel").classList.remove("hidden");
document.getElementById("closePanel").onclick=()=>document.getElementById("panel").classList.add("hidden");
document.addEventListener("keydown",e=>{
 if(e.code==="Space"||e.code==="ArrowRight"){e.preventDefault();next()}
 if(e.code==="ArrowLeft"){e.preventDefault();prev()}
 if(e.key.toLowerCase()==="r"){resetRound()}
 if(e.key.toLowerCase()==="m"){muted=!muted}
 if(e.key.toLowerCase()==="f"){document.documentElement.requestFullscreen?.()}
});
render();