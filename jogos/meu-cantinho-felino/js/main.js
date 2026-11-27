let S=Save.load()||newState();
Energy.tick();Orders.init();Characters.init();Ads.init();Reforms.check();
UI.hud();UI.board();UI.orders();UI.reform();
$('box').onclick=Board.spawn;$('gift').onclick=UI.gift;$('cfg').onclick=()=>UI.panel('cfg');$('mclose').onclick=UI.close;
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>UI.panel(b.dataset.p));
setInterval(()=>{Energy.tick();UI.hud()},1000);
