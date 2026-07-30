const ingredients=[['大米',450,'克'],['芋头',500,'克'],['五花肉',150,'克'],['干香菇',5,'朵'],['虾米',30,'克'],['蒜头',4,'瓣'],['生抽',2,'汤匙'],['鱼露',1,'汤匙'],['白胡椒粉',0.5,'茶匙'],['芹菜或蒜苗',1,'把']];
const steps=[
['处理食材','大米洗净浸泡 20 分钟；芋头切约 2 厘米块；五花肉、香菇切丁，虾米泡软。'],
['煎香芋头','锅中放少量油，把芋头煎到四面微黄，盛出备用。'],
['煸出肉香','五花肉下锅煸出油脂，再加入蒜末、香菇和虾米炒香。'],
['合炒调味','放回芋头，加入生抽、鱼露与白胡椒粉，轻轻翻炒约 2 分钟。'],
['入锅焖饭','全部倒入电饭锅，加入大米；水量比平时煮饭略少，按正常煮饭程序。'],
['拌青增香','饭熟后撒入芹菜粒或蒜苗，翻拌均匀，盖盖再焖 5 分钟。']
];
const $=s=>document.querySelector(s);
const list=$('#ingredientList'),range=$('#servings'),servingValue=$('#servingValue'),stepsList=$('#stepsList');
let done=JSON.parse(localStorage.getItem('taroDone')||'[]');
function fmt(n){return Number.isInteger(n)?n:Number(n.toFixed(1))}
function renderIngredients(){const people=+range.value;servingValue.textContent=people;list.innerHTML=ingredients.map(([n,q,u])=>`<li><span>${n}</span><strong>${fmt(q*people/4)} ${u}</strong></li>`).join('');localStorage.setItem('taroServings',people)}
function updateProgress(){const count=done.filter(Boolean).length;$('#progressText').textContent=`${count} / ${steps.length}`;$('#progressFill').style.width=`${count/steps.length*100}%`;localStorage.setItem('taroDone',JSON.stringify(done))}
function renderSteps(){stepsList.innerHTML=steps.map(([t,d],i)=>`<article class="step ${done[i]?'done':''}" data-i="${i}"><div class="step-check">${done[i]?'✓':''}</div><div><h4>${i+1}. ${t}</h4><p>${d}</p></div></article>`).join('');document.querySelectorAll('.step').forEach(el=>el.onclick=()=>{const i=+el.dataset.i;done[i]=!done[i];renderSteps();updateProgress()})}
range.value=localStorage.getItem('taroServings')||4;range.oninput=renderIngredients;renderIngredients();renderSteps();updateProgress();
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
$('#copyList').onclick=async()=>{const people=+range.value;const text=`潮汕芋头饭（${people}人份）\n`+ingredients.map(([n,q,u])=>`${n}：${fmt(q*people/4)} ${u}`).join('\n');try{await navigator.clipboard.writeText(text);toast('采购清单已复制')}catch{toast('复制失败，请手动选择')}};
$('#resetAll').onclick=()=>{done=[];range.value=4;renderIngredients();renderSteps();updateProgress();toast('已全部重置')};
$('#printRecipe').onclick=()=>window.print();
let seconds=1200,timer=null;function showTime(){const m=String(Math.floor(seconds/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');$('#timerDisplay').textContent=`${m}:${s}`}
function pause(){clearInterval(timer);timer=null}
$('#timerStart').onclick=()=>{if(timer)return;timer=setInterval(()=>{if(seconds>0){seconds--;showTime()}else{pause();toast('时间到了，可以开盖看看了')}} ,1000)};
$('#timerPause').onclick=pause;$('#timerReset').onclick=()=>{pause();seconds=1200;showTime()};
document.querySelectorAll('[data-minutes]').forEach(b=>b.onclick=()=>{pause();seconds=+b.dataset.minutes*60;showTime()});showTime();
