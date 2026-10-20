(()=>{
const root=document.querySelector('.institution-content');
if(!root)return;
const shots=[{"src": "images/institutions-university.jpg", "alt": "CoursedUp Institution Panel, Activity Analytics at university level", "cap": "<b>Start wide.</b> 376 active courses and 13,500 teaching activities across the whole university — school, department and program are all open."}, {"src": "images/institutions-school.jpg", "alt": "CoursedUp Institution Panel filtered to school level", "cap": "<b>Choose a school.</b> The same dashboard recalculates for Science and Engineering."}, {"src": "images/institutions-department.jpg", "alt": "CoursedUp Institution Panel filtered to department and program level", "cap": "<b>Drill down further.</b> Department and program filters reveal the next level — here, a single program and its week-by-week activity."}];
const image=root.querySelector('#viewer-img');
const caption=root.querySelector('#viewer-cap');
function tabs(selector,activate){
 const buttons=[...root.querySelectorAll(selector)];
 function select(index,focus=false){
  buttons.forEach((button,i)=>{button.classList.toggle('on',i===index);button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
  activate(index);
  if(focus)buttons[index].focus();
 }
 buttons.forEach((button,index)=>{
  button.addEventListener('click',()=>select(index));
  button.addEventListener('keydown',event=>{
   let next=index;
   if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%buttons.length;
   else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+buttons.length-1)%buttons.length;
   else if(event.key==='Home')next=0;
   else if(event.key==='End')next=buttons.length-1;
   else return;
   event.preventDefault();select(next,true);
  });
 });
}
tabs('.viewer-tabs button',index=>{
 image.src=shots[index].src;image.alt=shots[index].alt;caption.innerHTML=shots[index].cap;
 root.querySelector('#scope-panel').setAttribute('aria-labelledby','scope-tab-'+index);
});
})();
