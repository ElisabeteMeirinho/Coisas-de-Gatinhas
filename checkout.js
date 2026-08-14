let carrinho=getCarrinho(),freteAtual=null,cupomAtual=null;const config=getLojaConfig(),box=document.getElementById('itensCheckout');
const ufs=['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];document.getElementById('uf').innerHTML+=[...ufs].map(u=>`<option>${u}</option>`).join('');
function subtotal(){return carrinho.every(i=>typeof i.preco==='number')?carrinho.reduce((s,i)=>s+i.preco*i.quantidade,0):null;}
function descontoValor(sub){if(sub===null||!cupomAtual)return 0;if(cupomAtual.tipo==='percentual')return Math.min(sub,sub*(Number(cupomAtual.valor)||0)/100);return Math.min(sub,Number(cupomAtual.valor)||0);}
function atualizarResumo(){const sub=subtotal(),desc=descontoValor(sub),frete=freteAtual===null?null:freteAtual;document.getElementById('subtotal').textContent=sub===null?'A confirmar':formatarPreco(sub);document.getElementById('desconto').textContent=desc?'- '+formatarPreco(desc):'—';document.getElementById('frete').textContent=frete===null?'A calcular':formatarPreco(frete);document.getElementById('total').textContent=(sub===null||frete===null)?'A confirmar':formatarPreco(Math.max(0,sub-desc+frete));}
function render(){if(!carrinho.length){box.innerHTML='<div class="checkout-vazio">Sua sacola está vazia ♡<br><a href="index.html" class="btn btn-menor">Ver produtos</a></div>';document.getElementById('gerarPix').disabled=true;atualizarResumo();return;}box.innerHTML=carrinho.map((i,n)=>`<article class="checkout-item"><img src="${i.imagem}" alt="${i.nome}"><div><strong>${i.nome}</strong><small>${Object.values(i.opcoes||{}).join(' • ')||'Produto artesanal'}</small><span>${formatarPreco(i.preco)}</span></div><div class="checkout-qtd">Qtd. ${i.quantidade}<button data-remover="${n}" type="button">Remover</button></div></article>`).join('');box.querySelectorAll('[data-remover]').forEach(b=>b.addEventListener('click',()=>{carrinho.splice(Number(b.dataset.remover),1);setCarrinho(carrinho);render();}));atualizarResumo();}
const cepInput=document.getElementById('cep');
cepInput.addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,8);e.target.value=v.length>5?v.slice(0,5)+'-'+v.slice(5):v;});
function aplicarFreteUf(uf,local=''){
  const sub=subtotal(),reg=regiaoPorUf(uf),r=config.frete.regioes[reg]||{};
  document.getElementById('uf').value=uf;
  if(config.frete.gratisAcima&&sub!==null&&sub>=Number(config.frete.gratisAcima)){freteAtual=0;document.getElementById('fretePrazo').textContent=`Frete grátis • prazo estimado: ${r.prazo||'a confirmar'}`;}
  else if(typeof r.valor==='number'){freteAtual=r.valor;document.getElementById('fretePrazo').textContent=`Frete estimado para ${local||uf}: ${formatarPreco(r.valor)} • prazo: ${r.prazo||'a confirmar'}`;}
  else{freteAtual=null;document.getElementById('fretePrazo').textContent='Frete ainda não configurado para esta região. Fale com a loja.';}
  atualizarResumo();
}
async function buscarCepECalcular(){
  const cep=cepInput.value.replace(/\D/g,''),msg=document.getElementById('fretePrazo'),end=document.getElementById('enderecoCep');
  if(cep.length!==8){msg.textContent='Digite um CEP com 8 números.';end.textContent='';return;}
  msg.textContent='Consultando CEP...';end.textContent='';
  try{
    const resp=await fetch(`https://viacep.com.br/ws/${cep}/json/`);if(!resp.ok)throw new Error('CEP');const d=await resp.json();if(d.erro||!d.uf)throw new Error('CEP');
    const local=[d.localidade,d.uf].filter(Boolean).join(' / ');end.textContent=[d.logradouro,d.bairro,local].filter(Boolean).join(' • ');aplicarFreteUf(d.uf,local);
  }catch(e){freteAtual=null;atualizarResumo();msg.textContent='Não consegui consultar esse CEP. Selecione o estado manualmente abaixo.';}
}
document.getElementById('calcularFrete').addEventListener('click',buscarCepECalcular);
cepInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();buscarCepECalcular();}});
document.getElementById('uf').addEventListener('change',e=>{if(e.target.value)aplicarFreteUf(e.target.value,e.target.value);});
document.getElementById('aplicarCupom').addEventListener('click',()=>{const codigo=document.getElementById('cupom').value.trim().toUpperCase(),m=document.getElementById('cupomMensagem');const c=(config.cupons||[]).find(x=>x.ativo!==false&&String(x.codigo).toUpperCase()===codigo);if(!c){cupomAtual=null;m.textContent='Cupom não encontrado ou inativo.';}else{cupomAtual=c;m.textContent=`Cupom ${c.codigo} aplicado ♡`;}atualizarResumo();});
function tlv(id,value){const v=String(value);return id+String(v.length).padStart(2,'0')+v;}function crc16(str){let crc=0xFFFF;for(let c=0;c<str.length;c++){crc^=str.charCodeAt(c)<<8;for(let i=0;i<8;i++)crc=(crc&0x8000)?((crc<<1)^0x1021):(crc<<1);crc&=0xFFFF;}return crc.toString(16).toUpperCase().padStart(4,'0');}
function gerarPayloadPix(chave,valor){const gui=tlv('00','br.gov.bcb.pix'),merchant=tlv('26',gui+tlv('01',chave)),nome=(config.recebedor||'COISAS DE GATINHAS').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().slice(0,25),cidade=(config.cidade||'ITAJAI').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().slice(0,15);let p=tlv('00','01')+merchant+tlv('52','0000')+tlv('53','986')+tlv('54',valor.toFixed(2))+tlv('58','BR')+tlv('59',nome)+tlv('60',cidade)+tlv('62',tlv('05','***'))+'6304';return p+crc16(p);}
document.getElementById('gerarPix').addEventListener('click',()=>{const area=document.getElementById('pixArea'),sub=subtotal();if(!config.chavePix||sub===null){area.innerHTML='<div class="pix-aviso"><strong>Pix ainda não configurado.</strong><p>Cadastre a chave Pix e os preços na área Administradora.</p></div>';return;}if(freteAtual===null){area.innerHTML='<div class="pix-aviso"><strong>Calcule a entrega primeiro.</strong><p>Selecione o estado e calcule o frete antes de gerar o Pix.</p></div>';return;}const total=Math.max(0,sub-descontoValor(sub)+freteAtual),payload=gerarPayloadPix(config.chavePix,total);area.innerHTML=`<div class="pix-pronto"><strong>Pix Copia e Cola</strong><textarea id="pixCodigo" readonly>${payload}</textarea><button id="copiarPix" class="btn btn-claro" type="button">Copiar código Pix</button><small>Total: ${formatarPreco(total)}</small></div>`;document.getElementById('copiarPix').onclick=async()=>{await navigator.clipboard.writeText(payload);document.getElementById('copiarPix').textContent='Copiado ♡';};});
render();
