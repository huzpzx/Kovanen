const baseServings=4;
const ingredients=[
  ['大米',450,'克','洗净后浸泡 20 分钟'],
  ['粉糯芋头',500,'克','切约 2 厘米方块'],
  ['五花肉',150,'克','切小丁'],
  ['干香菇',5,'朵','泡发后切丁'],
  ['虾米',30,'克','可选，提前泡软'],
  ['蒜头',4,'瓣','切末'],
  ['生抽',2,'汤匙','用于调味'],
  ['鱼露',1,'汤匙','可按咸度调整'],
  ['白胡椒粉',0.5,'茶匙','增香'],
  ['芹菜或蒜苗',1,'把','出锅前加入']
];
const steps=[
  ['处理食材','大米洗净浸泡 20 分钟；芋头、五花肉和香菇切丁，虾米泡软。'],
  ['煎香芋头','锅里放少量油，把芋头煎至四面微黄，盛出备用。'],
  ['煸出肉香','五花肉下锅，小火煸到边缘金黄、油脂析出。'],
  ['炒香配料','加入蒜末、香菇和虾米炒香，再放回芋头，调入生抽、鱼露和胡椒粉。'],
  ['一起焖饭','把炒好的材料与大米放入电饭锅，水量比平时煮饭略少，启动煮饭程序。'],
  ['开盖增香','饭熟后撒入芹菜或蒜苗，轻轻翻拌，盖上再焖 5 分钟。']
];

const $=s=>document.querySelector(s);
const ingredientList=$('#ingredientList');
const servings=$('#servings');
const servingValue=$('#servingValue');
const stepsList=$('#stepsList');
const progressText=$('#progressText');
const progressFill=$('#progressFill');
const toast=$('#toast');
let completed=new Set(JSON.parse(localStorage.getItem('taroRiceSteps')||'[]'));

function fmt(v){return Number.isInteger(v)?v:Math.round(v*10)/10}
function renderIngredients(){
  const count=Number(servings.value); servingValue.textContent=count;
  ingredientList.innerHTML=ingredients.map(([name,amount,unit,note])=>{
    const value=fmt(amount*count/baseServings);
    return `<li><span><b>${name}</b><small>${note}</small></span><strong>${value} ${unit}</strong></li>`;
  }).join('');
  localStorage.setItem('taroRiceServings',count);
}
function renderSteps(){
  stepsList.innerHTML=steps.map(([title,text],i)=>`<article class="step ${completed.has(i)?'done':''}" data-step="${i}" tabindex="0" role="checkbox" aria-checked="${completed.has(i)}"><span class="step-check">${completed.has(i)?'✓':''}</span><div><h4>${i+1}. ${title}</h4><p>${text}</p></div></article>`).join('');
  progressText.textContent=`${completed.size} / ${steps.length}`;
  progressFill.style.width=`${completed.size/steps.length*100}%`;
  localStorage.setItem('taroRiceSteps',JSON.stringify([...completed]));
}
function toggleStep(i){completed.has(i)?completed.delete(i):completed.add(i);renderSteps();}
function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),1800)}

servings.value=localStorage.getItem('taroRiceServings')||4;
servings.addEventListener('input',renderIngredients);
stepsList.addEventListener('click',e=>{const el=e.target.closest('.step');if(el)toggleStep(Number(el.dataset.step))});
stepsList.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.step')){e.preventDefault();toggleStep(Number(e.target.dataset.step))}});
$('#copyList').addEventListener('click',async()=>{
  const count=Number(servings.value);
  const text=`潮汕芋头饭（${count}人份）\n`+ingredients.map(([n,a,u])=>`${n}：${fmt(a*count/baseServings)} ${u}`).join('\n');
  try{await navigator.clipboard.writeText(text);showToast('采购清单已复制')}catch{showToast('复制失败，请手动选择')}
});
$('#resetAll').addEventListener('click',()=>{completed.clear();servings.value=4;renderIngredients();renderSteps();showToast('已全部重置')});
$('#printRecipe').addEventListener('click',()=>window.print());

let seconds=1200,timer=null;
const timerDisplay=$('#timerDisplay');
function drawTimer(){const m=Math.floor(seconds/60).toString().padStart(2,'0');const s=(seconds%60).toString().padStart(2,'0');timerDisplay.textContent=`${m}:${s}`}
function pause(){clearInterval(timer);timer=null}
$('#timerStart').addEventListener('click',()=>{if(timer)return;if(seconds<=0)seconds=1200;timer=setInterval(()=>{seconds--;drawTimer();if(seconds<=0){pause();showToast('时间到，可以开盖看看了')}} ,1000)});
$('#timerPause').addEventListener('click',pause);
$('#timerReset').addEventListener('click',()=>{pause();seconds=1200;drawTimer()});
document.querySelectorAll('[data-minutes]').forEach(btn=>btn.addEventListener('click',()=>{pause();seconds=Number(btn.dataset.minutes)*60;drawTimer()}));

renderIngredients();renderSteps();drawTimer();
