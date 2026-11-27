const Board={
free(){return S.board.findIndex(c=>!c)},
spawn(){if(Board.free()<0){UI.toast('Tabuleiro cheio! Combine ou entregue peças.');return}
 if(!Energy.spend(1)){UI.toast('Sem energia! Aguarde ou visite a Loja.');Characters.react('tired');return}
 const k=Object.keys(CHAINS);S.board[Board.free()]={c:k[Math.random()*k.length|0],l:0};Board.done()},
drop(a,b){if(a===b)return;const p=S.board[a],q=S.board[b];if(!p)return;
 if(!q){S.board[b]=p;S.board[a]=null;return Board.done()}
 if(p.c===q.c&&p.l===q.l&&p.l<CHAINS[p.c].length-1){S.board[b]={c:p.c,l:p.l+1};S.board[a]=null;return Board.done(b)}
 UI.shake(b)},
count(c,l){return S.board.filter(x=>x&&x.c===c&&x.l===l).length},
done(fx){Save.write(S);UI.hud();UI.board(fx);UI.orders()}};
