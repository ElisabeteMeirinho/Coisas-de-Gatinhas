window.addEventListener('DOMContentLoaded',()=>{
  if(typeof atualizarContadorGlobal==='function') atualizarContadorGlobal();

  const tabs=[...document.querySelectorAll('.game-tab')];
  const modes={furia:document.getElementById('modeFuria'),suspiro:document.getElementById('modeSuspiro')};
  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.toggle('ativo',t===tab));
    Object.entries(modes).forEach(([k,v])=>v&&v.classList.toggle('ativo',k===tab.dataset.mode));
  }));

  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const targetPosition=(board,avatar,clientX,clientY)=>{
    const r=board.getBoundingClientRect(),w=avatar.offsetWidth,h=avatar.offsetHeight;
    return {x:clamp(clientX-r.left-w/2,8,r.width-w-8),y:clamp(clientY-r.top-h/2,8,r.height-h-8)};
  };
  const moveTo=(avatar,pos)=>{avatar.style.left=pos.x+'px';avatar.style.top=pos.y+'px'};

  /* FÚRIA — mesmo visual de pontos e níveis do mockup aprovado */
  const fBoard=document.getElementById('furiaBoard'),furia=document.getElementById('furiaAvatar');
  const fScore=document.getElementById('furiaScore'),fLevel=document.getElementById('furiaLevel'),fProgress=document.getElementById('furiaProgress'),fPercent=document.getElementById('furiaPercent');
  let points=540;
  const sparkles=[...document.querySelectorAll('#furiaBoard .spark')];
  const refreshLevel=()=>{
    const level=Math.max(1,Math.floor(points/200));
    const pct=Math.min(100,Math.round(((points-(level*200-60))/200)*100));
    fScore.textContent=points; fLevel.textContent=level; fProgress.style.width=pct+'%'; if(fPercent) fPercent.textContent=pct+'%';
  };
  refreshLevel();
  if(fBoard&&furia){
    fBoard.addEventListener('mousemove',e=>{
      const old=parseFloat(furia.style.left)||furia.offsetLeft;
      const pos=targetPosition(fBoard,furia,e.clientX,e.clientY); moveTo(furia,pos);
      furia.style.transform=pos.x<old?'scaleX(-1)':'scaleX(1)';
      sparkles.forEach(spark=>{
        if(spark.dataset.busy==='1') return;
        const a={left:pos.x,top:pos.y,right:pos.x+furia.offsetWidth,bottom:pos.y+furia.offsetHeight};
        const sx=spark.offsetLeft,sy=spark.offsetTop,sw=spark.offsetWidth,sh=spark.offsetHeight;
        if(!(a.right<sx||a.left>sx+sw||a.bottom<sy||a.top>sy+sh)){
          spark.dataset.busy='1'; spark.style.opacity='0'; spark.style.transform='scale(2.1)'; points+=25; refreshLevel();
          setTimeout(()=>{spark.style.left=(10+Math.random()*78)+'%';spark.style.top=(12+Math.random()*68)+'%';spark.style.opacity='1';spark.style.transform='scale(1)';spark.dataset.busy='0'},650);
        }
      });
    });
  }

  /* SUSPIRO — estilo VS Code Pets: mouse guia; clique joga a bolinha */
  const sBoard=document.getElementById('suspiroBoard'),suspiro=document.getElementById('suspiroAvatar'),ball=document.getElementById('suspiroBall');
  const sScore=document.getElementById('suspiroScore'),sBalls=document.getElementById('suspiroBalls');
  let suspiroPoints=0,balls=0,ballActive=false,lastX=0,ballTimer;
  const runSuspiro=(clientX,clientY)=>{
    if(ballActive) return;
    const pos=targetPosition(sBoard,suspiro,clientX,clientY);
    suspiro.classList.toggle('virada',pos.x<lastX); lastX=pos.x; suspiro.classList.add('correndo'); moveTo(suspiro,pos);
    clearTimeout(suspiro._idle); suspiro._idle=setTimeout(()=>suspiro.classList.remove('correndo'),260);
  };
  if(sBoard&&suspiro&&ball){
    sBoard.addEventListener('mousemove',e=>runSuspiro(e.clientX,e.clientY));
    sBoard.addEventListener('click',e=>{
      const r=sBoard.getBoundingClientRect(),bw=42,bh=42;
      const bx=clamp(e.clientX-r.left-bw/2,10,r.width-bw-10),by=clamp(e.clientY-r.top-bh/2,12,r.height-bh-20);
      ballActive=true; clearTimeout(ballTimer); ball.style.display='block'; ball.style.left=bx+'px'; ball.style.top=by+'px'; ball.classList.remove('pulando'); void ball.offsetWidth; ball.classList.add('pulando');
      balls++; sBalls.textContent=balls;
      const targetX=clamp(bx-suspiro.offsetWidth*.35,8,r.width-suspiro.offsetWidth-8),targetY=clamp(by-suspiro.offsetHeight*.35,8,r.height-suspiro.offsetHeight-8);
      suspiro.classList.toggle('virada',targetX<lastX); lastX=targetX; suspiro.classList.add('correndo'); moveTo(suspiro,{x:targetX,y:targetY});
      ballTimer=setTimeout(()=>{
        suspiro.classList.remove('correndo'); ball.style.display='none'; ballActive=false; suspiroPoints+=20; sScore.textContent=suspiroPoints;
      },520);
    });
  }
});
