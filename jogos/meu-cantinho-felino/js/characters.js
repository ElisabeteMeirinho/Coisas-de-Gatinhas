const Characters={
 init(){
  [['furia','Fúria'],['suspiro','Suspiro']].forEach(([id,n])=>$(id).append(UI.art('assets/characters/'+id+'.webp',n)));
  $('furia').hidden=S.ch<2;
  [['suspiro','Suspiro'],['furia','Fúria']].forEach(([id,n])=>{$(id).setAttribute('role','button');$(id).setAttribute('tabindex','0');$(id).setAttribute('aria-label','Interagir com '+n);$(id).title='Clique para interagir com '+n;$(id).addEventListener('click',()=>this.action(id==='furia'?'furia':'suspiro'));$(id).addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();this.action(id==='furia'?'furia':'suspiro')}})});
 },
 action(kind='merge'){
  const visible=['suspiro','furia'].filter(id=>!$(id).hidden);
  visible.forEach(id=>{const el=$(id);el.classList.remove('act-curious','act-happy','act-play','act-talk');void el.offsetWidth;el.classList.add(kind==='furia'?'act-play':kind==='suspiro'?'act-curious':'act-happy')});
  const lines={suspiro:'Suspiro está investigando cada cantinho! 🐾',furia:'Fúria deu um salto e está pronta para a aventura! 🐈‍⬛',merge:'Oba! As gatinhas comemoram a combinação! ✨',spawn:'Suspiro e Fúria ficaram curiosas com os novos materiais!'};
  $('say').textContent=lines[kind]||lines.merge;
 },
 react(k){
  const m={happy:'Pedido entregue! As gatinhas comemoram com você! 💜',party:'Mais um cantinho restaurado! Festa de patinhas! 🎉',tired:'Estamos sem energia... vamos descansar um pouquinho.'};
  ['furia','suspiro'].forEach(id=>{const e=$(id);e.classList.remove('happy','tired','act-happy','act-play');void e.offsetWidth;e.classList.add(k==='tired'?'tired':'act-happy')});
  $('say').textContent=m[k]||m.happy;
 }
};