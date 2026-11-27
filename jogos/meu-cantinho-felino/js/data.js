const $=id=>document.getElementById(id);
const CHAINS={tecido:['Mantinha','Caminha'],comida:['Lata de comida','Pote de ração','Refeição preparada','Kit de alimentação'],brinquedo:['Fio','Novelo','Brinquedo de tecido','Kit de brinquedos'],obra:['Material básico','Ferramentas','Arranhador']};
const ORDERS=[{c:'comida',l:1,q:1,coins:20,stars:1},{c:'tecido',l:1,q:1,coins:30,stars:1},{c:'obra',l:1,q:1,coins:25,stars:1},{c:'brinquedo',l:2,q:1,coins:30,stars:1}];
const REFORMS=[{id:'parede',name:'Consertar a parede',need:1},{id:'caminha',name:'Nova caminha',need:2},{id:'arranhador',name:'Arranhador',need:4}];
const CAPITULO={nome:'Um Cantinho Seguro',texto:'Fúria e Suspiro vivem em um abrigo que precisa de cuidados. Ajude as duas a conseguir comida, tecidos, brinquedos e materiais.'};
const HISTORIAS=['Fúria: Juntar duas peças iguais cria algo melhor!','Suspiro: Uma mantinha quentinha faz toda a diferença.','Fúria: Cada entrega deixa o abrigo mais seguro.'];
const newState=()=>({energy:22,max:30,last:Date.now(),coins:260,stars:2,board:Array(25).fill(null),orders:[],delivered:0,reforms:[],gift:''});
