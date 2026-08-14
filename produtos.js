const PRODUTOS_PADRAO = [
  {id:'kit-furia-noite', nome:'Kit Fúria da Noite', categoria:'Kit de brinquedos', imagem:'assets/produto-kit-furia-noite.png', descricao:'Preto + dourado, com bolinha, peixinho e lua em crochê.', preco:null, ativo:true, opcoes:{}},
  {id:'kit-furia-luz', nome:'Kit Fúria da Luz', categoria:'Kit de brinquedos', imagem:'assets/produto-kit-furia-luz.png', descricao:'Branco + lilás, com bolinha, nuvem e coração em crochê.', preco:null, ativo:true, opcoes:{}},
  {id:'kit-coracoes', nome:'Kit Corações', categoria:'Kit de brinquedos', imagem:'assets/produto-kit-coracoes.png', descricao:'Vinho + rosinha suave, feito para os gatinhos mais amorosos.', preco:null, ativo:true, opcoes:{}},
  {id:'kit-cafe-cozy', nome:'Kit Café Cozy', categoria:'Kit de brinquedos', imagem:'assets/produto-kit-cafe.png', descricao:'Caramelo + creme, com bolinha, xícara e coração em crochê.', preco:null, ativo:true, opcoes:{}},
  {id:'capa-furia-noite', nome:'Capa Fúria da Noite', categoria:'Capa com capuz', imagem:'assets/produto-capa-furia-noite.png', descricao:'Modelo preto inspirado no Banguela, quentinho, leve e com patinhas livres.', preco:null, ativo:true, opcoes:{tamanho:['P','M','G']}},
  {id:'capa-furia-luz', nome:'Capa Fúria da Luz', categoria:'Capa com capuz', imagem:'assets/produto-capa-furia-luz.png', descricao:'Modelo creme + lilás, delicado e aconchegante.', preco:null, ativo:true, opcoes:{tamanho:['P','M','G']}},
  {id:'camiseta-paozinho', nome:'Camiseta Pãozinho', categoria:'Camiseta', imagem:'assets/camiseta-paozinho-novo.png', descricao:'Gatinho enroladinho com coração. Uma estampa delicada para quem ama um soninho gostoso.', preco:null, ativo:true, opcoes:{tamanho:['P','M','G','GG'], cor:['Creme','Areia','Rosé','Lilás']}},
  {id:'camiseta-cafe-ronrons', nome:'Camiseta Café e Ronrons', categoria:'Camiseta', imagem:'assets/camiseta-cafe-ronrons-novo.png', descricao:'Café quentinho e muitos ronrons para um dia feliz.', preco:null, ativo:true, opcoes:{tamanho:['P','M','G','GG'], cor:['Creme','Areia','Rosé','Lilás']}},
  {id:'camiseta-bagunceira', nome:'Camiseta Bagunceira Oficial', categoria:'Camiseta', imagem:'assets/camiseta-bagunceira-novo.png', descricao:'Cheia de energia e personalidade: ela faz a bagunça ficar mais fofa.', preco:null, ativo:true, opcoes:{tamanho:['P','M','G','GG'], cor:['Creme','Areia','Rosé','Lilás']}},
  {id:'camiseta-amor-novelo', nome:'Camiseta Amor em Novelo', categoria:'Camiseta', imagem:'assets/camiseta-amor-novelo-novo.png', descricao:'Enrolada em amor e fofura. Perfeita para dias de carinho.', preco:null, ativo:true, opcoes:{tamanho:['P','M','G','GG'], cor:['Creme','Areia','Rosé','Lilás']}},
  {id:'camiseta-olha-lua', nome:'Camiseta Olha a Lua Aí', categoria:'Camiseta', imagem:'assets/camiseta-olha-lua-novo.png', descricao:'Para as gatinhas místicas que brilham à noite.', preco:null, ativo:true, opcoes:{tamanho:['P','M','G','GG'], cor:['Creme','Areia','Rosé','Lilás']}}
];

const CONFIG_PADRAO = {
  nome:'Coisas de Gatinhas', chavePix:'', recebedor:'COISAS DE GATINHAS', cidade:'ITAJAI', moeda:'BRL',
  promo:{ativa:false, titulo:'', texto:''},
  contato:{whatsapp:'', instagram:'', email:'', trocas:'Fale com a gente para combinar troca ou ajuste.', duvidas:'Envie sua dúvida e responderemos com carinho.'},
  frete:{gratisAcima:null, regioes:{
    SC:{valor:null,prazo:'2 a 5 dias úteis'}, Sul:{valor:null,prazo:'3 a 7 dias úteis'}, Sudeste:{valor:null,prazo:'4 a 9 dias úteis'},
    CentroOeste:{valor:null,prazo:'5 a 10 dias úteis'}, Nordeste:{valor:null,prazo:'6 a 12 dias úteis'}, Norte:{valor:null,prazo:'7 a 15 dias úteis'}
  }},
  cupons:[]
};

function clone(v){return JSON.parse(JSON.stringify(v));}
window.getProdutos=function(){
  const salvo=localStorage.getItem('coisasDeGatinhasProdutos');
  return salvo?JSON.parse(salvo):clone(PRODUTOS_PADRAO);
};
window.setProdutos=function(lista){localStorage.setItem('coisasDeGatinhasProdutos',JSON.stringify(lista));window.PRODUTOS=lista;};
window.getLojaConfig=function(){
  const salvo=localStorage.getItem('coisasDeGatinhasConfig');
  if(!salvo)return clone(CONFIG_PADRAO);
  const c=JSON.parse(salvo);
  return {...clone(CONFIG_PADRAO),...c, promo:{...CONFIG_PADRAO.promo,...(c.promo||{})}, contato:{...CONFIG_PADRAO.contato,...(c.contato||{})}, frete:{...CONFIG_PADRAO.frete,...(c.frete||{}),regioes:{...CONFIG_PADRAO.frete.regioes,...((c.frete||{}).regioes||{})}}};
};
window.setLojaConfig=function(c){localStorage.setItem('coisasDeGatinhasConfig',JSON.stringify(c));window.LOJA_CONFIG=c;};
window.PRODUTOS=getProdutos();
window.LOJA_CONFIG=getLojaConfig();
window.formatarPreco=function(v){return typeof v==='number'&&!Number.isNaN(v)?v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}):'Preço a definir';};
window.getCarrinho=function(){return JSON.parse(localStorage.getItem('coisasDeGatinhasCarrinho')||'[]');};
window.setCarrinho=function(c){localStorage.setItem('coisasDeGatinhasCarrinho',JSON.stringify(c));};
window.atualizarContadorGlobal=function(){const el=document.getElementById('carrinhoContador');if(el)el.textContent=getCarrinho().reduce((s,i)=>s+(i.quantidade||1),0);};
window.regiaoPorUf=function(uf){
  if(uf==='SC')return 'SC';
  if(['PR','RS'].includes(uf))return 'Sul';
  if(['SP','RJ','MG','ES'].includes(uf))return 'Sudeste';
  if(['GO','MT','MS','DF'].includes(uf))return 'CentroOeste';
  if(['BA','SE','AL','PE','PB','RN','CE','PI','MA'].includes(uf))return 'Nordeste';
  return 'Norte';
};
