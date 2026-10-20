(()=>{
const dialog=document.getElementById('analytics-image-dialog');
if(!dialog)return;
const image=dialog.querySelector('.v88-dialog-image');
const title=document.getElementById('analytics-image-title');
const close=dialog.querySelector('.v88-image-close');
let opener=null;
let previousOverflow='';
document.querySelectorAll('.v88-image-trigger').forEach(button=>{
button.addEventListener('click',()=>{
const source=button.querySelector('img');
if(!source)return;
if(typeof dialog.showModal!=='function'){window.open(source.src,'_blank','noopener');return;}
opener=button;
image.src=source.src;
image.alt=source.alt;
title.textContent=button.dataset.analyticsTitle;
previousOverflow=document.body.style.overflow;
dialog.showModal();
document.body.style.overflow='hidden';
close.focus();
});
});
close.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
if(event.target!==dialog)return;
const rect=dialog.getBoundingClientRect();
if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
});
dialog.addEventListener('close',()=>{
document.body.style.overflow=previousOverflow;
opener?.focus();
image.removeAttribute('src');
});
})();
