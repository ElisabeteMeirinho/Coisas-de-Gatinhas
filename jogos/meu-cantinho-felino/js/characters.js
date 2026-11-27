const Characters={
 init(){
  [['furia','Fúria'],['suspiro','Suspiro']].forEach(([id,n])=>{
   const el=$(id);el.replaceChildren(UI.art('assets/characters/'+id+'.webp',n));
   el.setAttribute('role','button');el.setAttribute('tabindex','0');
   el.setAttribute('aria-label','Interagir com '+n);el.title='Clique para interagir com '+n;
   const act=()=>this.action(id==='furia'?'play':'curious');
   el.addEventListener('click',act);
   el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}});
  });
  $('furia').hidden=S.ch<2;
 },
 animate(id,cls){
  const el=$(id);if(!el||el.hidden)return;
  ['act-curious','act-play','act-happy','act-talk','act-listen','act-walk','act-carry','act-look'].forEach(c=>el.classList.remove(c));
  void el.offsetWidth;el.classList.add(cls);
  const done=()=>el.classList.remove(cls);
  el.addEventListener('animationend',done,{once:true});
 },
 action(kind='merge'){
  const visible=['suspiro','furia'].filter(id=>!$(id).hidden);
  if(kind==='suspiro'){this.animate('suspiro','act-curious')}
  else if(kind==='furia'){this.animate('furia','act-play')}
  else if(kind==='spawn'){visible.forEach(id=>this.animate(id,'act-look'))}
  else if(kind==='carry'){this.animate('suspiro','act-carry');if(!$('furia').hidden)this.animate('furia','act-carry')}
  else {visible.forEach(id=>this.animate(id,'act-happy'))}
  const lines={suspiro:'Suspiro está investigando cada cantinho! 🐾',furia:'Fúria deu um salto e está pronta para a aventura! 🐈‍⬛',merge:'Oba! As gatinhas comemoram a combinação! ✨',spawn:'As gatinhas olharam curiosas para os novos materiais!',carry:'As gatinhas estão levando os materiais para a reforma!'};
  $('say').textContent=lines[kind]||lines.merge;
 },
 scene(speaker){
  const ids=['suspiro','furia'];
  ids.forEach(id=>{const el=$(id);el.classList.remove('story-speaker','story-listener','act-talk','act-listen')});
  const who=speaker==='furia'?'furia':'suspiro';
  const other=who==='furia'?'suspiro':'furia';
  if(!$(who).hidden){$(who).classList.add('story-speaker');this.animate(who,'act-talk')}
  if(!$(other).hidden){$(other).classList.add('story-listener');this.animate(other,'act-listen')}
 },
 react(k){
  const m={happy:'Pedido entregue! As gatinhas comemoram com você! 💜',party:'Mais um cantinho restaurado! Festa de patinhas! 🎉',tired:'Estamos sem energia... vamos descansar um pouquinho.'};
  if(k==='tired')['suspiro','furia'].forEach(id=>{const e=$(id);e.classList.remove('act-happy','act-play');e.classList.add('tired')});
  else this.action('merge');
  $('say').textContent=m[k]||m.happy;
 }
};