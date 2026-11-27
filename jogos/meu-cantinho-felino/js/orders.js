const Orders={init(){
 if(Story.done()){S.orders=[];return}
 const spec=Story.cur().orders[S.chapterProgress];
 if(!spec){S.orders=[];Save.write(S);return}
 const valid=Array.isArray(S.orders)&&S.orders.length===1&&S.orders[0].c===spec[0]&&S.orders[0].l===spec[1];
 if(!valid)S.orders=[{c:spec[0],l:spec[1],q:1,coins:20+S.chapterProgress*5,stars:1,t:CHAINS[spec[0]][spec[1]],mission:spec[2]}];
 else S.orders[0]={...S.orders[0],mission:spec[2],t:CHAINS[spec[0]][spec[1]]};
 Save.write(S)
},deliver(i){const o=S.orders[i];if(!o||Board.count(o.c,o.l)<o.q)return;let n=o.q;S.board=S.board.map(x=>(n>0&&x&&x.c===o.c&&x.l===o.l)?(n--,null):x);S.coins+=o.coins;S.stars+=o.stars;S.orders=[];Characters.react('happy');Reforms.check();Board.done();UI.reform();Story.onDelivery()}};