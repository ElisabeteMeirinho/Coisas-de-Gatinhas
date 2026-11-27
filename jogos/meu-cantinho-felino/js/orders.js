const Orders={init(){
 if(Story.done()){S.orders=[];return}
 const spec=Story.cur().orders;
 const valid=Array.isArray(S.orders)&&S.orders.length===spec.length&&S.orders.every((r,i)=>r&&r.c===spec[i][0]&&r.l===spec[i][1]);
 if(!valid)S.orders=spec.map((x,i)=>({c:x[0],l:x[1],q:1,coins:20+i*5,stars:1,t:CHAINS[x[0]][x[1]],mission:x[2]}));
 else S.orders=S.orders.map((r,i)=>({...r,mission:spec[i][2],t:CHAINS[spec[i][0]][spec[i][1]]}));
 Save.write(S)
},deliver(i){const o=S.orders[i];if(!o||Board.count(o.c,o.l)<o.q)return;let n=o.q;S.board=S.board.map(x=>(n>0&&x&&x.c===o.c&&x.l===o.l)?(n--,null):x);S.coins+=o.coins;S.stars+=o.stars;S.orders.splice(i,1);Characters.react('happy');Reforms.check();Board.done();UI.reform();Story.onDelivery()}};