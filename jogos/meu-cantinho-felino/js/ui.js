const UI={
art(src,label){const i=new Image();i.src=(window.ART&&ART[src])||src;i.alt=label;i.onerror=()=>{const s=document.createElement('span');s.className='ph';s.textContent=label;i.replaceWith(s)};return i},
toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(UI.t);UI.t=setTimeout(()=>e.classList.remove('on'),2200)},
hud(){const l=Energy.left();$('energy').textContent='Energia '+S.energy+'/'+S.max+(l?' · '+l:'');$('coins').textContent='Moedas '+S.coins;$('stars').textContent='Estrelas '+S.stars},
shake(i){const c=$('board').children[i];c.classList.add('shake');setTimeout(()=>c.classList.remove('shake'),300);UI.toast('Essas peças não combinam.')},
board(fx){UI.sel=null;const b=$('board');b.innerHTML='';S.board.forEach((p,i)=>{const c=document.createElement('div');c.className='cell';c.dataset.i=i;
 if(p){c.append(UI.art(`assets/items/${p.c}-${p.l}.webp`,CHAINS[p.c][p.l]));if(i===fx)c.classList.add('pop');c.onpointerdown=e=>UI.drag(e,i)}else c.onclick=()=>{if(UI.sel!=null)UI.tap(i)};b.append(c)})},
drag(e,i){e.preventDefault();const p=S.board[i],cells=[...document.querySelectorAll('#board .cell')];
 cells.forEach((c,k)=>{const q=S.board[k];if(k!==i&&q&&q.c===p.c&&q.l===p.l&&p.l<CHAINS[p.c].length-1)c.classList.add('match')});
 const g=e.currentTarget.cloneNode(true);g.className='ghost';g.style.display='none';document.body.append(g);let moved=false;const sx=e.clientX,sy=e.clientY;
 const mv=ev=>{if(Math.abs(ev.clientX-sx)+Math.abs(ev.clientY-sy)>8){moved=true;g.style.display='block'}g.style.left=ev.clientX+'px';g.style.top=ev.clientY+'px'};
 const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);g.remove();cells.forEach(c=>c.classList.remove('match'));
  const t=document.elementFromPoint(ev.clientX,ev.clientY),c=t&&t.closest('.cell');
  if(!moved||(c&&+c.dataset.i===i)){UI.tap(i);return}if(c)Board.drop(i,+c.dataset.i)};
 addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up)},
tap(i){if(UI.sel==null||UI.sel===i){UI.sel=UI.sel===i?null:i}else{const a=UI.sel;UI.sel=null;Board.drop(a,i);return}
 document.querySelectorAll('#board .cell').forEach((c,k)=>c.classList.toggle('sel',k===UI.sel))},
float(t){const f=document.createElement('div');f.className='float';f.textContent=t;$('scene').append(f);setTimeout(()=>f.remove(),1500)},
orders(){const o=$('orders');o.innerHTML='';S.orders.forEach((r,i)=>{const n=Math.min(Board.count(r.c,r.l),r.q),d=document.createElement('article');d.className='order';
 const a=document.createElement('div');a.className='art';a.append(UI.art(`assets/items/${r.c}-${r.l}.webp`,CHAINS[r.c][r.l]));
 const t=document.createElement('div');t.className='order-meta';
 const name=document.createElement('strong');name.textContent=CHAINS[r.c][r.l];
 const qty=document.createElement('span');qty.textContent=`${n}/${r.q} necessários`;
 const reward=document.createElement('small');reward.textContent=`+${r.coins} moedas · +${r.stars} estrela`;
 t.append(name,qty,reward);
 const b=document.createElement('button');b.textContent=n>=r.q?'Entregar pedido':'Entregar';b.disabled=n<r.q;b.onclick=()=>Orders.deliver(i);d.append(a,t,b);o.append(d)})},
reform(){const n=S.reforms.length,pct=Math.round(100*n/REFORMS.length),nx=REFORMS.find(x=>!S.reforms.includes(x.id));
 let h=`<h2>Reforma do abrigo</h2><div class="thumb" style="--r:${n/REFORMS.length}"></div><div class="bar"><i style="width:${pct}%"></i></div><p>${n} de ${REFORMS.length} melhorias</p>`;
 REFORMS.forEach(x=>{const ok=S.reforms.includes(x.id),cur=nx&&nx.id===x.id;h+=`<div class="rf ${ok?'ok':cur?'cur':'lock'}"><b>${x.name}</b><span>${ok?'Concluída':'Entregas '+Math.min(S.delivered,x.need)+'/'+x.need}</span></div>`});
 $('reform').innerHTML=h},
open(h){$('mbody').innerHTML=h;$('modal').hidden=false},close(){$('modal').hidden=true},
panel(p){if(p==='his'){Story.library();return}const P={
 cap:`<h2>Capítulo 1: ${CAPITULO.nome}</h2><p>${CAPITULO.texto}</p><p>Entregas feitas: ${S.delivered}</p>`,
 his:'<h2>Histórias</h2>'+HISTORIAS.map(t=>`<p>${t}</p>`).join(''),
 eve:'<h2>Eventos</h2><p>Nenhum evento ativo agora. Novidades em breve.</p>',
 loj:`<h2>Loja</h2><p>Moedas: ${S.coins}</p><button id="buyE" ${S.coins<50?'disabled':''}>Comprar 5 de energia por 50 moedas</button>`,
 cfg:`<h2>Ajustes</h2><button id="rst">Reiniciar progresso</button><h3>Transparência</h3><p>Instituição beneficiada: a definir.<br>Receita publicitária: sem anúncios ativos, nada registrado.<br>Custos e repasses: nenhum até o momento.</p>`};
 if(p==='abr'){UI.close();$('scene').scrollIntoView({behavior:'smooth'});return}UI.open(P[p]);
 const b=$('buyE');if(b)b.onclick=()=>{if(S.coins>=50){S.coins-=50;Energy.add(5);Board.done();UI.panel('loj')}};
 const r=$('rst');if(r)r.onclick=()=>{if(confirm('Apagar todo o progresso?')){Save.reset();location.reload()}}},
gift(){const d=new Date().toDateString();if(S.gift===d){UI.toast('Presente de hoje já coletado.');return}S.gift=d;S.coins+=20;Energy.add(3);UI.toast('Presente: +20 moedas e +3 de energia!');Board.done()}};
