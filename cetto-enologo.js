/* ============================================================================================
   Enólogo digital de L.A. Cetto
   Responde con los datos reales del sitio: catálogo y precios (cetto-base.js), fichas técnicas y
   medallero oficial (cetto-fichas.js) y catas en video del canal de la bodega (cetto-videos.js).
   Todo corre en el navegador. Si el servidor tiene conexión a un modelo (GET/POST /api/enologo,
   ver .claude/serve.py), le pasa estos mismos datos y usa su respuesta; si no, responde este motor.
   Reglas: los datos de producto salen solo de las fichas; el criterio general (servicio, guarda,
   maridaje) se dice como recomendación general. Nunca inventa premios, precios ni añadas.
   ============================================================================================ */
(()=>{
'use strict';
if(window.ENO)return;
const N=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[¿?¡!.,;:()"“”'’«»]/g,' ').replace(/\s+/g,' ').trim();
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const lc=s=>s?s[0].toLowerCase()+s.slice(1):s;
const list=a=>a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' y '+a[a.length-1];
const rnd=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- datos ---------- */
const hasFX=()=>typeof FX!=='undefined',hasYT=()=>typeof YTV!=='undefined',hasMED=()=>typeof MEDS!=='undefined'&&typeof MEDK!=='undefined';
/* estilo (1 ligero y fresco · 2 frutal y suave · 3 con cuerpo · 4 robusto · 0 dulce o destilado) y momentos: los mismos de la tienda */
const TX={nebrp:[4,'cena regalo pareja'],pslac:[3,'diario mesa'],cabrp:[4,'cena mesa regalo'],charp:[3,'cena brindis'],chenin:[1,'tarde mesa diario'],viog:[3,'brindis tarde'],psrp:[4,'cena'],terra:[4,'cena regalo'],conc:[4,'cena'],prim:[1,'tarde brindis'],ver:[1,'brindis tarde'],oto:[1,'tarde mesa diario'],inv:[3,'cena tarde'],champ:[1,'brindis pareja'],sbsb:[1,'tarde diario'],cablac:[3,'diario'],bdz:[2,'tarde diario'],passito:[0,'mesa regalo pareja'],sang:[3,'cena regalo'],nebor:[3,'mesa'],
 dlmer:[2,'cena pareja'],bsyr:[3,'cena regalo pareja'],bmal:[4,'cena pareja'],bpin:[2,'cena pareja'],bbla:[3,'brindis cena'],plyra:[3,'diario'],pesp:[3,'cena'],sbtemp:[2,'tarde diario'],sbcab:[3,'diario'],sbzin:[1,'tarde'],lazin:[3,'tarde mesa'],latemp:[2,'mesa diario'],lamer:[2,'diario tarde'],lafume:[1,'diario brindis'],lachar:[2,'tarde diario'],labdb:[1,'diario tarde'],ormal:[3,'mesa'],orens:[3,'cena'],ormez:[3,'cena'],mospal:[0,'regalo pareja'],grappa:[0,'regalo'],terra375:[4,'cena'],cabrp375:[4,'cena'],fume375:[1,'diario'],cab375:[3,'diario'],bdb187:[1,'diario'],bdz187:[2,'diario'],ps187:[3,'diario'],cab187:[3,'diario']};
const EST={1:'ligero y fresco',2:'frutal y suave',3:'con cuerpo',4:'robusto'};
const isW=id=>{const p=P[id];return !!p&&!p.gc&&!p.gift&&!/gourmet|estuche/.test(p.c)};
const WINES=Object.keys(P).filter(isW);
const GOUR=Object.keys(P).filter(id=>P[id].c==='gourmet');
const nm=id=>{const p=P[id];if(!p)return '';if(p.line==='Champbrulé')return 'Champbrulé Brut';if(p.line==='Destilados'||p.c==='gourmet')return p.name;return p.name+' '+p.line};
const nmS=id=>nm(id)+(P[id].ml&&P[id].ml!==750&&isW(id)?' ('+P[id].ml+' ml)':'');
const st=id=>(TX[id]||[0])[0];
const fx=id=>hasFX()&&FX[id]||null;
const grapes=id=>{const f=fx(id);return (f&&f.u)||P[id].u||''};
/* crianza: la tarjeta "La barrica / La crianza" de la ficha; si no hay, la fermentación en barrica */
const oak=id=>{const f=fx(id);if(!f)return null;let c=f.o.find(([t])=>/barrica|crianza|tonel/i.test(t)),ferm=false;if(!c){c=f.o.find(([t,d])=>/barrica/i.test(d));ferm=!!c}if(!c)return null;const m=c[1].match(/(\d+)\s*(mes|año)/i);return {t:c[1].replace(/\.$/,''),m:ferm?null:(m?(+m[1])*(/año/i.test(m[2])?12:1):null),ferm}};
const proc=id=>{const f=fx(id);return f?f.o:[]};
const kind=id=>{const p=P[id];return p.c==='espumoso'?'espumoso':p.c==='rosado'?'rosado':p.c==='blanco'?'blanco':p.c==='postre'?'postre':p.c==='destilado'?'destilado':'tinto'};
const temp=id=>{const f=fx(id);if(f&&f.s)return f.s;return {espumoso:'6 a 8 °C',blanco:'8 a 10 °C',rosado:'8 a 10 °C',postre:'8 a 10 °C',destilado:'12 °C',tinto:st(id)>=3?'16 a 18 °C':'14 a 16 °C'}[kind(id)]};
const meds=id=>{if(!hasMED())return [];const k=MEDK[id];return (k&&MEDS[k])||[]};
const medN=id=>meds(id).length||P[id].medals||0;
const vids=id=>hasYT()&&YTV[id]||[];
const price=id=>money(P[id].price);
const url=id=>PAGES.ficha+'?p='+id;
const A=id=>'<a href="'+url(id)+'">'+esc(nmS(id))+'</a>';
const ok=id=>!P[id].out;

/* ---------- reconocer vinos en el texto ---------- */
/* frase del nombre → claves; la línea desempata (Cabernet Sauvignon hay en cuatro líneas) */
const NAMES=[
 ['mezcla bordelesa',['ormez']],['blanc de zinfandel',['bdz','bdz187']],['blanc de blancs',['labdb','bdb187']],['zinfandel rose',['sbzin']],['sauvignon blanc',['sbsb']],['fume blanc',['lafume','fume375']],['fume',['lafume','fume375']],
 ['cabernet sauvignon',['cabrp','cablac','sbcab','cabrp375','cab375','cab187']],['cabernet',['cabrp','cablac','sbcab','cabrp375','cab375','cab187']],['petite sirah',['psrp','pslac','ps187']],['petit sirah',['psrp','pslac','ps187']],['petite syrah',['psrp','pslac','ps187']],
 ['moscatel y palomino',['mospal']],['moscatel',['mospal','passito']],['palomino',['mospal']],['pinot noir',['bpin']],['pinot',['bpin']],['chenin blanc',['chenin']],['chenin',['chenin']],
 ['nebbiolo',['nebrp','nebor']],['chardonnay',['charp','lachar']],['viognier',['viog']],['terra',['terra','terra375']],['concordia',['conc']],['primavera',['prim']],['verano',['ver']],['otono',['oto']],['invierno',['inv']],
 ['champbrule',['champ']],['brut',['champ']],['espumoso',['champ']],['passito',['passito']],['sangiovese',['sang']],['merlot',['dlmer','lamer']],['syrah',['bsyr']],['shiraz',['bsyr']],['malbec',['bmal','ormal']],
 ['blanco boutique',['bbla']],['lyra',['plyra']],['espaldera',['pesp']],['tempranillo',['sbtemp','latemp']],['zinfandel',['lazin','sbzin']],['ensamble organico',['orens']],['grappa',['grappa']]
];
const LINE=[['Reserva Privada',/\b(reserva privada|rp)\b/],['Don Luis',/\bdon luis\b/],['Boutique',/\bboutique\b/],['Estaciones',/\bestaciones\b/],['Sierra Blanca',/\bsierra blanca\b/],['Península',/\bpeninsula\b/],['Uvas Orgánicas',/\borganic[oa]s?\b|uvas organicas/],['L.A. Cetto',/\b(clasic[oa]|linea clasica|la cetto|l a cetto)\b/]];
function findWines(q,ctx){
  let t=' '+q+' ';const out=[],taken=[];
  const small=/\b(375|187|botellin|media botella|chiquit|mini)\b/.test(q);
  const lines=LINE.filter(([,r])=>r.test(q)).map(([l])=>l);
  for(const [ph,ids] of NAMES){
    const re=new RegExp('\\b'+ph+'\\b');
    if(!re.test(t))continue;
    t=t.replace(re,' ');  /* que "sauvignon blanc" no vuelva a contar como "blanc" */
    let c=ids.filter(id=>P[id]);
    if(!small)c=c.filter(id=>P[id].ml===750||ids.every(x=>P[x].ml!==750));
    if(lines.length){const f=c.filter(id=>lines.includes(P[id].line));if(f.length)c=f}
    if(!c.length)continue;
    /* "el Nebbiolo Reserva Privada y el orgánico": el mismo nombre en dos líneas */
    if(lines.length>1&&c.length>1){c.slice(0,2).forEach(id=>{if(!taken.includes(id)){taken.push(id);out.push({id,alt:[]})}});continue}
    let pick=c.length===1?c[0]:(ctx&&c.includes(ctx)?ctx:c.slice().sort((a,b)=>medN(b)-medN(a)||P[b].price-P[a].price)[0]);
    if(!taken.includes(pick)){taken.push(pick);out.push({id:pick,alt:c.filter(x=>x!==pick)})}
  }
  return out;
}

/* ---------- comida, ocasión, presupuesto, estilo ---------- */
const FOOD=[
 ['chocolate',/\b(chocolate|cacao|brownie)\b/,'chocolate'],
 ['queso_azul',/\b(queso azul|roquefort|gorgonzola|cabrales)\b/,'queso azul'],
 ['mole',/\b(mole|pipian|manchamanteles|adobo)\b/,'mole'],
 ['nogada',/\bnogada\b/,'chiles en nogada'],
 ['sushi',/\b(sushi|japones[ae]?|china|chino|thai|tailandes[ae]?|asiatic[oa]|oriental|agridulce|ramen|curry)\b/,'cocina asiática'],
 ['marisco',/\b(mariscos?|camaron(es)?|ostion(es)?|ostras?|almejas?|pulpo|calamar(es)?|langosta|ceviches?|aguachile|coctel|callos?)\b/,'mariscos'],
 ['pescado',/\b(pescados?|salmon|atun|robalo|huachinango|marlin|bacalao|trucha|zarandeado|pescadillas?)\b/,'pescado'],
 ['cordero',/\b(cordero|borrego|chivo|cabrito)\b/,'cordero'],
 ['res',/\b(res|carne roja|carnes rojas|carne|carnes|bistec|arrachera|rib ?eye|new york|sirloin|filete|tomahawk|t ?bone|picana|entrana|cecina|machaca|hamburguesas?|asado|parrillada|parrilla|cortes?|estofado|birria|barbacoa|carne asada)\b/,'carne roja'],
 ['cerdo',/\b(cerdo|puerco|carnitas|cochinita|lechon|lomo|pastor|costillas?|chicharron|tocino)\b/,'cerdo'],
 ['aves',/\b(pollo|pavo|pato|aves?|gallina|codorniz)\b/,'aves'],
 ['picante',/\b(picante|picoso|enchilad[oa]s?|chiles?|habanero|chipotle|jalapeno|salsa macha)\b/,'picante'],
 ['pasta',/\b(pastas?|spaghetti|espagueti|lasana|ravioli|fettuccine|risotto|italian[ao]|bolonesa|ragu|pizzas?)\b/,'pasta y pizza'],
 ['queso_suave',/\b(queso (fresco|panela|oaxaca|crema|de cabra)|brie|camembert|mozzarella|burrata|quesos? suaves?)\b/,'quesos suaves'],
 ['queso_maduro',/\b(queso (maduro|anejo|manchego|parmesano|gouda|cotija|curado)|parmesano|manchego|quesos? (maduros?|curados?|anejos?)|tabla de quesos|quesos?)\b/,'quesos maduros'],
 ['botana',/\b(botanas?|tapas|charcuteria|carnes frias|embutidos?|jamon|salami|aperitivos?|tabla|picada|canapes|aceitunas)\b/,'botanas'],
 ['ensalada',/\b(ensaladas?|verduras?|vegetales|vegetarian[ao]|vegan[ao]|hongos|champinones|portobello|setas|berenjena)\b/,'ensaladas y vegetales'],
 ['mexicana',/\b(tacos?|enchiladas|pozole|tamales?|chilaquiles|quesadillas?|tlayudas?|mexican[ao]s?|antojitos|sopes?|tostadas?|mixiote)\b/,'cocina mexicana'],
 ['postre',/\b(postres?|pastel|tarta|pay|flan|helado|galletas|pan dulce|frutos rojos|fresas|capirotada|nueces|frutos secos)\b/,'postre']
];
/* qué pide cada platillo (criterio de maridaje) y qué vinos de la casa lo cumplen mejor */
const PAIR={
 res:{w:{cabrp:3,psrp:3,nebrp:3,terra:3,bmal:3,ormal:2,pslac:2,cablac:2,sbcab:2,bsyr:2,ormez:2,conc:2,latemp:2,lazin:2,inv:2},why:'La grasa y la proteína de la carne roja suavizan los taninos, así que pide un tinto con cuerpo.'},
 cordero:{w:{bsyr:3,cabrp:3,terra:3,nebrp:2,ormez:2,psrp:2,conc:2},why:'El cordero va con tintos especiados y con estructura, como un Syrah o un Cabernet con crianza.'},
 cerdo:{w:{dlmer:2,sbtemp:2,latemp:2,pesp:2,bpin:2,chenin:2,viog:2,sbzin:1,terra:1},why:'El cerdo admite tintos medios y blancos con cuerpo; si lleva achiote o salsas dulces, un blanco aromático funciona muy bien.'},
 aves:{w:{charp:3,viog:2,lachar:2,bpin:2,bbla:2,dlmer:1,chenin:1,orens:1},why:'Las aves piden blancos con cuerpo, como un Chardonnay con barrica, o tintos de taninos finos como el Pinot Noir.'},
 pescado:{w:{sbsb:3,lafume:3,charp:2,lachar:2,bbla:2,chenin:2,labdb:1,viog:1,bpin:1},why:'El pescado pide acidez y frescura; un salmón o un atún también admiten un tinto ligero.'},
 marisco:{w:{sbsb:3,lafume:3,chenin:2,labdb:2,champ:2,lachar:2,prim:2,sbzin:1},why:'Con mariscos y ceviches, la acidez y las notas cítricas del vino hacen el papel del limón.'},
 sushi:{w:{bdz:3,labdb:2,chenin:2,sbzin:2,champ:2,lafume:1},why:'La cocina asiática, agridulce o picante, va mejor con vinos frescos, frutales y apenas dulces.'},
 mole:{w:{nebrp:3,cabrp:2,chenin:2,psrp:2,pslac:2,conc:2,terra:1},why:'El mole es complejo y especiado: un tinto con fruta madura y especias lo acompaña sin taparlo, y un Chenin Blanc aromático es la alternativa fresca.'},
 nogada:{w:{chenin:3,psrp:2,dlmer:2,viog:2},why:'El chile en nogada combina fruta, crema de nuez y granada: pide un blanco aromático o un tinto suave.'},
 picante:{w:{chenin:3,labdb:3,bdz:2,viog:2,sbzin:2,prim:2,oto:2,lazin:1},why:'Con el picante, mejor vinos frescos y frutales, de poco tanino y alcohol moderado: el tanino y el alcohol acentúan el ardor.'},
 mexicana:{w:{latemp:3,pslac:2,chenin:2,cablac:2,sbtemp:2,lazin:2,oto:2,sbzin:1},why:'Para la cocina mexicana del día a día, tintos frutales y versátiles o un blanco aromático.'},
 pasta:{w:{sang:3,plyra:3,orens:3,pesp:2,lamer:2,sbtemp:2,dlmer:1,latemp:1},why:'Con pasta y pizza con jitomate, las uvas italianas como Sangiovese o Montepulciano tienen la acidez justa para la salsa.'},
 queso_suave:{w:{lachar:2,charp:2,bpin:2,sbsb:2,champ:2,lamer:2,dlmer:1},why:'Los quesos suaves y frescos van mejor con blancos o tintos ligeros, que no los opacan.'},
 queso_maduro:{w:{cabrp:2,nebrp:2,terra:2,bmal:2,pslac:2,ormez:2,bsyr:1,conc:1},why:'Los quesos maduros aguantan tintos con estructura: su grasa suaviza los taninos.'},
 queso_azul:{w:{mospal:3,passito:3},why:'El queso azul es el gran clásico con vinos dulces: el contraste entre la sal y el dulzor es perfecto.'},
 botana:{w:{champ:3,sbzin:2,sbtemp:2,sang:2,prim:2,lafume:2,plyra:1},why:'Para botanas y tablas, un espumoso o un rosado abren el apetito y van con casi todo.'},
 ensalada:{w:{sbsb:3,lafume:2,prim:2,sbzin:2,labdb:2,oto:2,bpin:1},why:'Las ensaladas y los vegetales piden vinos frescos; con hongos, un tinto ligero como el Pinot Noir es ideal.'},
 postre:{w:{mospal:3,passito:3,bdz:1,champ:1},why:'Con el postre, el vino debe ser al menos tan dulce como el platillo; si no, se siente ácido y amargo.'},
 chocolate:{w:{mospal:3,passito:2},why:'El chocolate pide un vino dulce y concentrado, como uno tipo oporto.'}
};
/* el texto "maridaje" de cada ficha también cuenta: si lo menciona, es lo que recomienda la bodega */
const MARX={res:/\b(res|cortes?|cordero|sirloin|hamburguesas?|estofados?|barbacoa|carnes? (rojas|asadas|al carbon|al horno|de res|a la parrilla))\b/,cordero:/cordero|caza/,cerdo:/cerdo|lechon/,aves:/\baves\b|pollo|carnes? blancas/,pescado:/pescados?/,marisco:/mariscos?|ceviches?/,sushi:/oriental|china|japonesa|vietnamita|sushi/,
 mole:/mole/,picante:/picante|especiad/,mexicana:/tacos|mixiote|mexican|guisados mexicanos/,pasta:/pastas?|pizzas?|risotto|ragu/,queso_suave:/quesos? (suaves|blandos|semi ?maduros)/,queso_maduro:/quesos? (maduros|curados|ahumados)|quesos/,queso_azul:/queso azul|veteados/,botana:/tapas|botanas?|charcuteria|carnes frias|embutidos|aperitivo|tablas?/,ensalada:/ensaladas?|verduras|vegetales/,postre:/postre/,chocolate:/chocolate/};
const OCC=[['regalo',/\b(regal(o|ar)|obsequi|detalle|cumpleanos de|para (mi|un|una) (papa|mama|jefe|suegr|amig))/],['pareja',/\b(pareja|romantic|aniversario|cita|san valentin|para dos)\b/],['cena',/\b(cena|cenar|noche especial|ocasion especial)\b/],
 ['tarde',/\b(amigos|reunion|fiesta|carne asada|parrillada|carnita asada|terraza|alberca|calor|playa|verano|picnic)\b/],['brindis',/\b(brindar|brindis|celebra|boda|graduacion|ano nuevo|navidad)\b/],['diario',/\b(diario|todos los dias|entre semana|casual|sencillo)\b/]];
function budget(q){
  const n=s=>+String(s).replace(/[,.]/g,'');
  let m=q.match(/entre \$?\s?(\d[\d,.]*) y \$?\s?(\d[\d,.]*)/);if(m)return {min:n(m[1]),max:n(m[2])};
  m=q.match(/(menos de|hasta|maximo|max|bajo|debajo de|no mas de|menor a|por debajo de|abajo de|que no pase de)\s*\$?\s?(\d[\d,.]*)/);if(m)return {max:n(m[2])};
  m=q.match(/(mas de|arriba de|desde|minimo|mayor a)\s*\$?\s?(\d[\d,.]*)/);if(m)return {min:n(m[2])};
  m=q.match(/\$\s?(\d[\d,.]*)|(\d{3,4})\s*(pesos|mxn)/);if(m)return {max:n(m[1]||m[2])};
  if(/\b(barat[oa]s?|economic[oa]s?|accesible|no muy car[oa])\b/.test(q))return {max:250};
  if(/\b(premium|de lujo|lo mejor|el mejor|top|muy especial|impresionar)\b/.test(q))return {top:1};
  return null;
}
function color(q){
  if(/\b(espumos[oa]s?|burbujas|champagne|champana|champan|brut)\b/.test(q))return 'espumoso';
  if(/\b(rosados?|rose)\b/.test(q))return 'rosado';
  if(/\b(dulces?|de postre|tipo oporto|oporto|licoroso)\b/.test(q))return 'postre';
  if(/\b(destilad[oa]|grappa|digestivo)\b/.test(q))return 'destilado';
  if(/\b(blancos?)\b/.test(q)&&!/\b(sauvignon blanc|chenin blanc|blanc de|fume blanc|blanco boutique)\b/.test(q))return 'blanco';
  if(/\b(tintos?)\b/.test(q))return 'tinto';
  return null;
}
function styleT(q){
  if(/\b(ligeros?|fresc[oa]s?|livian[oa]s?|facil de tomar|facil de beber)\b/.test(q))return 1;
  if(/\b(suaves?|frutal(es)?|afrutad[oa]s?|redond[oa]s?|sin tanto tanino)\b/.test(q))return 2;
  if(/\b(con cuerpo|cuerpo medio|equilibrad[oa])\b/.test(q))return 3;
  if(/\b(robust[oa]s?|intens[oa]s?|potentes?|estructurad[oa]s?|fuertes?|tanic[oa]s?|complej[oa]s?|con mucho cuerpo|de guarda)\b/.test(q))return 4;
  return null;
}

/* ---------- conocimiento general de enología (criterio, no datos de producto) ---------- */
const GLOS=[
 [/\btaninos?\b/,'Taninos','Son compuestos de la piel, las semillas y la barrica. Se sienten como sequedad en encías y lengua, dan estructura al vino tinto y le permiten guardarse más años. Con la grasa y la proteína se suavizan; por eso un tinto tánico brilla con carne.'],
 [/\bcuerpo\b/,'Cuerpo','Es la sensación de peso del vino en la boca. Un vino ligero se siente como agua fresca; uno con cuerpo, más denso y envolvente. Lo dan el alcohol, la concentración de la uva y la crianza.'],
 [/\bacidez\b/,'Acidez','Es lo que hace salivar y da frescura. En los blancos y espumosos es clave, y en la mesa corta la grasa y acompaña el picante y los cítricos.'],
 [/\b(crianza|barrica|roble)\b/,'Crianza en barrica','Es el tiempo que el vino reposa en barricas de roble antes de embotellarse. Aporta notas de vainilla, tostado y especias, suaviza los taninos y da complejidad. En nuestras fichas viene el tiempo exacto de cada vino.'],
 [/\bmalolactica\b/,'Fermentación maloláctica','Es una segunda fermentación natural que convierte el ácido málico, más punzante, en láctico, más suave. Da vinos más redondos y, en blancos como el Chardonnay, notas de mantequilla.'],
 [/\bmaceracion carbonica\b/,'Maceración carbónica','Los racimos enteros fermentan dentro de la uva, en un ambiente con gas carbónico. Da tintos muy frutales, ligeros y de taninos suaves, al estilo de Beaujolais. Es el método de nuestro Otoño, de Gamay.'],
 [/\b(charmat|metodo tradicional|champenoise)\b/,'Método Charmat','La segunda fermentación, la que crea la burbuja, se hace en tanques cerrados y no en cada botella, como en el método tradicional de Champagne. Da espumosos frescos y frutales, de burbuja fina. Así se elabora Champbrulé Brut.'],
 [/\b(encabezad[oa]|fortificad[oa]|tipo oporto)\b/,'Vino encabezado','Durante la fermentación se le agrega alcohol de uva: la fermentación se detiene, el vino conserva parte del azúcar natural y gana cuerpo. Es el estilo de los vinos tipo oporto, como nuestro Moscatel y Palomino.'],
 [/\b(pasificad[oa]|passito)\b/,'Passito','Se elabora con uva que se deja secar para concentrar sus azúcares y aromas. Da vinos dulces, densos y muy aromáticos. Nuestro Passito es de Moscatel pasificado, con una larga crianza.'],
 [/\b(ensamble|mezcla bordelesa|blend|coupage)\b/,'Ensamble','Es un vino hecho con varias uvas para lograr equilibrio: una aporta estructura, otra fruta, otra aroma. La mezcla bordelesa reúne uvas de Burdeos, como Cabernet Sauvignon, Merlot, Petit Verdot y Malbec; es el caso de Terra Don Luis.'],
 [/\bvarietal\b/,'Varietal','Es el vino que se hace principalmente con una sola uva, como un Cabernet Sauvignon o un Chenin Blanc, y expresa el carácter de esa variedad.'],
 [/\b(anada|cosecha|vendimia)\b/,'Añada o cosecha','Es el año en que se cosechó la uva. Cada añada tiene su clima, así que el mismo vino puede variar un poco de un año a otro. La vendimia en Baja California suele ser a finales del verano.'],
 [/\b(decantar|decantador|decantacion)\b/,'Decantar','Es pasar el vino a una jarra antes de servirlo. Sirve para dos cosas: oxigenar un tinto joven y estructurado para que abra sus aromas, y separar los sedimentos de un vino con años en botella.'],
 [/\b(ribete|capa)\b/,'Ribete y capa','Son términos de la vista. La capa es la intensidad del color; el ribete, el borde del vino al inclinar la copa. Un ribete violeta suele indicar juventud; uno teja o ladrillo, evolución.'],
 [/\b(lias|bastoneo)\b/,'Lías y bastoneo','Las lías son las levaduras que quedan tras la fermentación. Dejar el vino sobre sus lías y removerlas (bastoneo) le da volumen, cremosidad y notas de pan, como en nuestro Chardonnay Reserva Privada.'],
 [/\bsulfitos?\b/,'Sulfitos','Se forman de manera natural en la fermentación y se usan en pequeñas dosis para proteger el vino de la oxidación. Casi todos los vinos del mundo los tienen.'],
 [/\b(rosado|rose)\b/,'Cómo se hace un rosado','Con uva tinta que se deja en contacto con la piel solo unas horas, lo justo para tomar color. Así nace nuestro Primavera, de Cabernet Sauvignon con 12 horas de maceración.'],
 [/\b(organic[oa]s?)\b/,'Vino de uvas orgánicas','Se elabora con uva cultivada sin pesticidas ni fertilizantes sintéticos. Nuestra línea Uvas Orgánicas viene de Viña Alegre, con 90 hectáreas certificadas.'],
 [/\b(orujo|grappa)\b/,'Grappa','Es un aguardiente que se destila del orujo: la piel y las semillas que quedan después de prensar la uva. La nuestra es de orujo de Cabernet Sauvignon, con doble destilación.'],
 [/\bvalle de guadalupe\b/,'Valle de Guadalupe','Es la región vinícola más importante de México, en Baja California. Tiene clima mediterráneo, con días cálidos, noches frescas por la influencia del Pacífico y suelos pobres que concentran la uva. Ahí cultiva la familia Cetto desde 1928.'],
 [/\b(sommelier|enologo)\b/,'Enólogo y sommelier','El enólogo elabora el vino, del viñedo a la botella; el sommelier lo sirve y lo marida en la mesa. Yo te ayudo con las dos cosas, con los datos de nuestras fichas técnicas.']
];
const UVA={
 'nebbiolo':'Uva del Piamonte, en Italia, la de Barolo y Barbaresco. Da vinos de color no muy profundo pero de mucha acidez y taninos, con aromas de cereza, rosa, especias y trufa, y gran capacidad de guarda.',
 'cabernet sauvignon':'Uva de Burdeos y la más plantada del mundo. Da tintos de color profundo, taninos firmes y notas de grosella negra, pimiento y cedro; gana mucho con la barrica.',
 'petite sirah':'Uva nacida en el sur de Francia (también llamada Durif). Da tintos muy oscuros, de fruta negra intensa y taninos marcados. En Baja California es una de las uvas emblema.',
 'merlot':'Uva de Burdeos de taninos más suaves y fruta madura, como ciruela y cereza. Da tintos redondos y fáciles de disfrutar.',
 'malbec':'Uva de origen francés, famosa en Argentina. Da tintos de color violeta, fruta negra, violetas y taninos amables.',
 'syrah':'Uva del Ródano, en Francia (Shiraz en Australia). Da tintos especiados, con pimienta, fruta negra y notas ahumadas.',
 'pinot noir':'Uva de Borgoña, delicada y difícil de cultivar. Da tintos de color ligero, fruta roja fresca y taninos finos, muy versátiles en la mesa.',
 'tempranillo':'La gran uva de España, de Rioja y Ribera del Duero. Da tintos de fruta roja, especias y buena estructura.',
 'sangiovese':'La uva de la Toscana, en Italia, la del Chianti. Tiene acidez viva, cereza y notas herbales: ideal con jitomate y pasta.',
 'zinfandel':'Uva emparentada con el Primitivo italiano, muy cultivada en California. Da tintos frutales y especiados, y también rosados ligeros.',
 'gamay':'La uva de Beaujolais, en Francia. Da tintos ligeros, muy frutales y de taninos suaves, que se toman algo frescos.',
 'petit verdot':'Uva de Burdeos que casi siempre se usa en ensambles por su color y su estructura. En nuestro Invierno se luce sola.',
 'chardonnay':'Uva de Borgoña, la blanca más versátil: fresca y cítrica sin barrica, o cremosa, con notas de mantequilla y tostado, cuando se cría en roble.',
 'chenin blanc':'Uva del valle del Loira, en Francia. Aromática, de buena acidez, con notas de manzana, pera y miel. Uno de los vinos más queridos de la casa desde 1983.',
 'sauvignon blanc':'Uva del Loira y de Burdeos. Da blancos frescos y vibrantes, con cítricos, maracuyá y notas herbales.',
 'viognier':'Uva del valle del Ródano, en Francia. Muy aromática: durazno, chabacano y flores blancas, con cuerpo amplio.',
 'colombard':'Uva blanca francesa de buena acidez y fruta fresca. Se usa en ensambles y en espumosos, como nuestro Champbrulé.',
 'moscatel':'Una de las uvas más antiguas y aromáticas: flores, uva fresca y miel. Es la base de nuestros vinos dulces.',
 'palomino':'La uva de Jerez, en España. Neutra y elegante, ideal para vinos encabezados.',
 'montepulciano':'Uva del centro de Italia, de color intenso, fruta madura y taninos suaves.',
 'aglianico':'Uva del sur de Italia, de taninos firmes, acidez alta y gran guarda.',
 'barbera':'Uva del Piamonte, de acidez alta, poca astringencia y fruta roja.'
};
const UVAK=Object.keys(UVA);

/* ---------- respuestas: como un enólogo en la mesa, con los datos de cada ficha ---------- */
const S={wine:null,last:null,shown:[],turns:0};
const p_=t=>'<p>'+t+'</p>';
const lead=t=>'<p class="lead">'+t+'</p>';
const tip=t=>'<p class="tip"><b>Consejo</b>'+t+'</p>';
const dl=rows=>'<dl class="eno-dl">'+rows.filter(r=>r[1]).map(([k,v])=>'<div><dt>'+k+'</dt><dd>'+v+'</dd></div>').join('')+'</dl>';
const R=(h,o={})=>({h,ids:o.ids||[],feat:!!o.feat,ch:o.ch||[],v:o.v||[],txt:o.txt||h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()});
const B=id=>'<b>'+esc(nmS(id))+'</b>';
/* frases que salen de la ficha técnica */
const noDot=t=>String(t||'').trim().replace(/\.$/,'');
const vine=id=>{const f=fx(id);if(!f)return null;const c=f.o.find(([t])=>/vi[ñn]edo/i.test(t));if(!c)return null;
  const age=(c[1].match(/Viñedo de ([^.]+)\./i)||[])[1]||'';
  const place=c[1].split(/\.\s*Viñedo/i)[0].split(',').map(x=>x.trim()).filter(x=>x&&!/^(baja california|méxico|mexico)$/i.test(x)).join(', ').replace(/^Valle/,'el Valle');
  return {age,place}};
const vinePh=id=>{const v=vine(id);if(!v)return '';return 'nace de un viñedo'+(v.age?' de '+v.age:'')+(v.place?' en '+v.place:'')};
const oakPh=id=>{const o=oak(id);if(!o)return '';const t=lc(o.t).replace(/\s*\+\s*/g,' y luego ');return o.ferm?'se fermenta en barrica':/^\d/.test(t)?'pasa '+t:/^crianza/.test(t)?'tiene una '+t:t};
const aromaPh=(id,n=3)=>{const f=fx(id);return f&&f.a&&f.a.length?list(f.a.slice(0,n).map(x=>lc(x))):''};
const mouthPh=id=>{const f=fx(id);return f&&f.c&&f.c[2]?lc(noDot(f.c[2]).replace(/^en (boca|paladar)( se percibe| es| se siente)?[,:]?\s*/i,'')):''};
const colorPh=id=>{const f=fx(id);return f&&f.c&&f.c[0]?lc(noDot(f.c[0])):''};
const tempPh=id=>{const t=temp(id),m=t.match(/(\d+)\s*a\s*(\d+)/);return m?'entre '+m[1]+' y '+m[2]+' °C':'a '+t};
const typeN=id=>({tinto:'tinto',blanco:'blanco',rosado:'rosado',espumoso:'espumoso',postre:'vino de postre',destilado:'destilado'})[kind(id)];
const grapeList=id=>list(grapes(id).split(/,\s*/).filter(Boolean));
const medPh=id=>{const n=medN(id);if(id==='nebrp')return 'el vino mexicano más premiado en el extranjero, con '+n+' reconocimientos internacionales';if(n>=60)return 'uno de los vinos más premiados de la casa, con '+n+' reconocimientos internacionales';if(n>=10)return 'un vino con '+n+' reconocimientos internacionales';return ''};
const marShort=(id,n=2)=>{const m=(P[id].mar||'').replace(/\.$/,'').split(/,\s*|;\s*|\.\s+/).map(x=>x.trim()).filter(Boolean);return m.length?lc(list(m.slice(0,n))):''};
const ens=id=>{const c=proc(id).find(([t])=>/ensamble/i.test(t));return c?noDot(c[1]):''};
const grapeName=id=>(grapes(id).split(/,\s*/)[0]||'').trim();
function tempTip(id){const k=kind(id),s=st(id);return {espumoso:'Enfríalo de 20 a 30 minutos en una cubeta con agua y hielo, o unas tres horas en el refrigerador, y regrésalo al frío entre copas.',
  blanco:'Dos o tres horas en el refrigerador, o 15 minutos en agua con hielo. Si está demasiado frío los aromas se cierran: deja que se temple un par de minutos en la copa.',
  rosado:'Un par de horas en el refrigerador, o 15 minutos en agua con hielo.',postre:'Fresco, no helado: con una hora en el refrigerador basta.',destilado:'Fresca y en copa pequeña, para que se aprecien sus aromas sin que domine el alcohol.',
  tinto:s>=3?'En casi todo México la "temperatura ambiente" está por encima de la ideal: 15 o 20 minutos en el refrigerador antes de servirlo lo dejan en su punto. Caliente, el alcohol tapa la fruta.':'Es un tinto que se disfruta un poco fresco: unos 25 minutos en el refrigerador antes de abrirlo.'}[k]}
function glassTip(id){const k=kind(id),g=N(grapes(id));return k==='espumoso'?'Sírvelo en copa tulipán: conserva la burbuja y concentra los aromas.':k==='postre'||k==='destilado'?'Usa una copa pequeña y sirve porciones cortas.':k==='tinto'?(/nebbiolo|pinot/.test(g)?'Una copa tipo Borgoña, de cáliz amplio, deja que se abran sus aromas delicados.':'Una copa grande, de boca amplia, le da aire y suaviza los taninos.'):'Una copa mediana, de boca un poco cerrada, mantiene el frío y los aromas.'}
function decantTip(id){const k=kind(id),s=st(id),o=oak(id),g=N(grapes(id));
  if(k==='espumoso')return 'Nunca lo decantes: perdería la burbuja.';
  if(k==='postre'||k==='destilado')return 'No necesita decantarse.';
  if(k!=='tinto')return 'No hace falta decantarlo: su frescura se aprecia mejor recién abierto.';
  if(s>=4||(/nebbiolo|petite sirah|cabernet|syrah|shiraz|malbec|petit verdot/.test(g)&&o&&o.m>=12))return 'Ábrelo o decántalo de 30 a 60 minutos antes: con el aire abre sus aromas y se suavizan los taninos.';
  if(s===3)return 'Si lo abres 15 o 20 minutos antes, se expresa mejor.';
  return 'No hace falta decantarlo: es para disfrutarse recién abierto.'}
function chipsFor(id){
  if(!id)return ['¿Qué vino va con mole?','Algo para una carne asada','Un regalo de menos de $500'];
  const k=kind(id),c=['¿Cómo lo sirvo?'];
  c.push(k==='postre'?'¿Con qué postre va?':'¿Con qué platillo va?');
  const sib=sibling(id);if(sib)c.push('Compáralo con '+nm(sib));else c.push('¿Cuánto puedo guardarlo?');
  return c;
}
function sibling(id){
  const u=N(grapes(id).split(',')[0]);const same=WINES.filter(x=>x!==id&&P[x].ml===750&&!(P[x].name===P[id].name&&P[x].line===P[id].line)&&N(grapes(x).split(',')[0])===u&&ok(x));
  if(same.length)return same.sort((a,b)=>medN(b)-medN(a))[0];
  const l=WINES.filter(x=>x!==id&&P[x].ml===750&&P[x].line===P[id].line&&kind(x)===kind(id)&&ok(x));
  return l[0]||null;
}
function aboutWine(id){
  const s=st(id),m=medPh(id),e=ens(id),vp=vinePh(id),op=oakPh(id),ar=aromaPh(id),mo=mouthPh(id),co=colorPh(id),ms=marShort(id);
  let h=lead('El '+B(id)+' es un '+typeN(id)+(e?' de '+e:grapes(id)?' de '+grapeList(id):'')+(s?', '+EST[s]:'')+'.'+(m?' Es '+m+'.':''));
  if(vp||op)h+=p_(cap(vp||'')+(vp&&op?' y ':'')+(vp?op:cap(op))+'.');
  if(co||ar||mo)h+=p_((co?'En la copa, '+co+'. ':'')+(ar?'En nariz vas a encontrar '+ar+'. ':'')+(mo?'En boca, '+mo+'.':''));
  h+=tip((ms?'Me gusta con '+ms+'. ':'')+'Sírvelo '+tempPh(id)+'.');
  return R(h,{ids:[id],feat:true,ch:chipsFor(id)});
}
function tasting(id){
  const f=fx(id);if(!f||!f.c||!f.c.length)return aboutWine(id);
  let h=lead('Así se vive el '+B(id)+' en la copa.');
  h+=p_('Primero, el color: '+lc(noDot(f.c[0]))+'. Al acercarlo, '+lc(noDot(f.c[1]||''))+'.')+(f.c[2]?p_('Y en boca, '+lc(noDot(f.c[2]))+'.'):'');
  const v=vids(id);
  if(v.length)h+=p_('Si quieres verlo catar, hay '+(v.length===1?'un video':v.length+' videos')+' en el canal de la bodega.');
  return R(h,{ids:[id],v:v.slice(0,1),ch:['¿Cómo lo sirvo?','¿Con qué platillo va?']});
}
function process(id){
  const o=proc(id);if(!o.length)return aboutWine(id);
  const vp=vinePh(id),rest=o.filter(([t])=>!/vi[ñn]edo/i.test(t)).map(([t,d])=>{d=noDot(d).replace(/\s*\+\s*/g,' y luego ');return (/ensamble/i.test(t)?'Es un ensamble de '+d:/^las uvas/i.test(t)?'Se elabora con '+lc(d[0])+d.slice(1):/barrica|crianza/i.test(t)&&/^\d/.test(d)?'Después, '+d:d)+'.'});
  let h=lead('Te cuento cómo nace el '+B(id)+'.')+p_((vp?cap(vp)+'. ':'')+rest.join(' '));
  const u=N(grapes(id).split(',')[0]);if(UVA[u])h+=p_('Del '+grapeName(id)+' te diría esto: '+lc(UVA[u]));
  return R(h,{ids:[id],ch:chipsFor(id)});
}
function serve(id){
  const h=lead('Para que el '+B(id)+' llegue a la copa en su mejor momento:')+p_('Sírvelo '+tempPh(id)+'. '+tempTip(id))+p_(glassTip(id)+' '+decantTip(id))+p_('Llena la copa solo hasta un tercio, para poder girarla y que respire.');
  return R(h,{ch:['¿Con qué platillo va?','¿Cuánto dura abierto?']});
}
function serveTemp(id){return R(lead('El '+B(id)+' se disfruta '+tempPh(id)+'.')+p_(tempTip(id)),{ch:['¿Necesita decantarse?','¿Qué copa uso?','¿Con qué platillo va?']})}
function decant(id){
  const k=kind(id),s=st(id),o=oak(id),g=N(grapes(id));let h;
  if(k==='espumoso')h=lead('No, nunca: al '+B(id)+' lo decantarías y perdería la burbuja.')+p_('Ábrelo bien frío, inclinando un poco la botella y girándola a ella, no al corcho, para que suelte el gas con un suspiro y no con un estallido.');
  else if(k==='postre'||k==='destilado')h=lead('No hace falta.')+p_('El '+B(id)+' ya salió listo de su crianza. Sírvelo fresco y en copa pequeña.');
  else if(k!=='tinto')h=lead('No hace falta decantar el '+B(id)+'.')+p_('En los '+(k==='blanco'?'blancos':'rosados')+' lo importante es la temperatura: su frescura y sus aromas se aprecian mejor recién abiertos.');
  else if(s>=4||(/nebbiolo|petite sirah|cabernet|syrah|shiraz|malbec|petit verdot/.test(g)&&o&&o.m>=12))h=lead('Sí, y te lo va a agradecer.')+p_('El '+B(id)+' es un tinto con estructura'+(o&&!o.ferm?', que '+oakPh(id):'')+'. Pásalo a un decantador de 30 a 60 minutos antes de servir: con el aire se abren sus notas'+(aromaPh(id,2)?' de '+aromaPh(id,2):'')+' y los taninos se vuelven más suaves.')+p_('Si es una botella con varios años de guarda, decántalo con cuidado y poco antes de servir, solo para separar el sedimento.');
  else if(s===3)h=lead('No es indispensable.')+p_('Si abres el '+B(id)+' 15 o 20 minutos antes, o lo decantas brevemente, se expresa mejor. También basta con girarlo en la copa.');
  else h=lead('No hace falta.')+p_('El '+B(id)+' es un tinto frutal y ligero: se disfruta recién abierto y un poco fresco.');
  return R(h,{ch:['¿A qué temperatura lo sirvo?','¿Cuánto dura abierto?']});
}
function openLife(id){
  const t={espumoso:'De uno a tres días, con un tapón para espumosos y en el refrigerador; después pierde la burbuja.',blanco:'De tres a cinco días, bien tapado y en el refrigerador.',rosado:'De tres a cinco días, bien tapado y en el refrigerador.',
    tinto:'De tres a cinco días, bien tapado, en un lugar fresco o en el refrigerador; sácalo media hora antes de volver a servirlo. Los tintos con más estructura aguantan mejor.',
    postre:'Varias semanas. Al ser un vino encabezado o muy concentrado, se oxida despacio; guárdalo tapado y en el refrigerador.',destilado:'Meses: es un destilado. Mantén la botella bien cerrada y de pie.'}[kind(id)];
  return R(lead('Abierto, el '+B(id)+' aguanta bien: '+lc(t))+p_('Un truco de bodega: pasa lo que sobró a una botella más pequeña, para que quede menos aire dentro.'),{ch:['¿Cuánto puedo guardarlo cerrado?','¿Con qué platillo va?']});
}
function keep(id){
  const k=kind(id),s=st(id),o=oak(id);let y;
  if(k==='espumoso'||k==='rosado'||(k==='blanco'&&!o)||(k==='tinto'&&s<=2&&!o))y='Es un vino para disfrutarse joven, en uno o dos años, cuando su fruta y su frescura están en su mejor momento.';
  else if(k==='blanco')y='Su paso por barrica le da más vida: en general se disfruta bien de tres a cinco años desde la cosecha.';
  else if(k==='postre')y='Es muy estable: ya salió listo de su crianza y aguanta años en la botella cerrada.';
  else if(k==='destilado')y='Un destilado no evoluciona en la botella: se conserva igual por años.';
  else if(s>=4&&o&&o.m>=12)y='Por su estructura y su crianza puede evolucionar bien de ocho a diez años. Con el tiempo, la fruta se vuelve más madura y aparecen notas de frutos secos, tabaco y cuero.';
  else y='En general se disfruta bien de tres a seis años desde la cosecha.';
  return R(lead('El '+B(id)+'. '+y)+p_('Guárdalo acostado, entre 12 y 15 °C, lejos de la luz, de los cambios de temperatura y de la vibración. Siempre depende un poco de la añada y de cómo se conserve.'),{ch:['¿Necesita decantarse?','¿Con qué platillo va?']});
}
function glass(id){
  if(!id)return R(lead('La copa sí cambia el vino.')+p_('Para tintos con cuerpo, una copa grande de boca amplia; para tintos delicados como el Pinot Noir o el Nebbiolo, una tipo Borgoña, más redonda. Blancos y rosados van mejor en copa mediana, más cerrada, que conserva el frío; los espumosos, en tulipán o flauta; los dulces y destilados, en copa pequeña.'));
  return R(lead(glassTip(id).replace(/^Sírvelo en/,'Para el '+B(id)+', una').replace(/^Una copa/,'Para el '+B(id)+', una copa').replace(/^Usa una copa/,'Para el '+B(id)+', una copa'))+p_('Llénala solo hasta un tercio, para poder girarla y que el vino respire.'),{ch:chipsFor(id)});
}
function awards(id){
  const Am=meds(id),n=medN(id);
  if(!n)return R(lead('El '+B(id)+' no tiene reconocimientos registrados en el medallero oficial.')+p_('Si te interesan los más premiados de la casa, el '+A('nebrp')+' es el vino mexicano más premiado en el extranjero, con '+medN('nebrp')+' reconocimientos.'),{ids:['nebrp'],ch:['¿Cuáles son los más premiados?']});
  const rank=a=>/gran oro|doble oro|trofeo|best|mejor|platin/i.test(a[2])?0:a[5];
  const top=[...Am].sort((a,b)=>rank(a)-rank(b)||b[0]-a[0]).slice(0,3);
  const comps=new Set(Am.map(a=>String(a[3]).toLowerCase())).size;
  let h=lead('El '+B(id)+' suma '+n+' reconocimientos internacionales'+(comps>1?', en '+comps+' concursos distintos':'')+'.');
  if(top.length)h+=p_('Entre los más destacados: '+list(top.map(a=>esc(a[2])+' en '+esc(a[3])+(a[0]?' '+a[0]:'')))+'.');
  return R(h,{ids:[id],ch:['¿A qué sabe?','¿Con qué platillo va?']});
}
function topAwarded(){
  const ids=WINES.filter(x=>P[x].ml===750&&ok(x)).sort((a,b)=>medN(b)-medN(a)).slice(0,3);
  return R(lead('El más premiado de la casa es el '+B(ids[0])+': el vino mexicano más premiado en el extranjero, con '+medN(ids[0])+' reconocimientos internacionales.')+p_('Le siguen el '+A(ids[1])+', con '+medN(ids[1])+', y el '+A(ids[2])+', con '+medN(ids[2])+'. Los tres forman parte de nuestra Colección Premiada.'),{ids:[ids[0]],feat:true,ch:['Cuéntame más del '+nm(ids[0]),'Ver la Colección Premiada']});
}
function videosOf(id){
  const v=id?vids(id):[];
  if(id&&v.length)return R(lead('Sí: hay '+(v.length===1?'una cata':v.length+' videos')+' del '+B(id)+' en el canal de la bodega.')+p_('Dale play aquí mismo.'),{v:v.slice(0,3),ch:chipsFor(id)});
  if(id)return R(lead('Del '+B(id)+' todavía no hay una cata en video.')+p_('En el canal de la bodega hay más de cien: notas de cata, la serie Catas contigo y maridajes con cocina mexicana.'),{ch:['Ver el canal de YouTube']});
  return R(lead('En nuestro canal de YouTube hay más de cien videos.')+p_('Notas de cata oficiales, la serie Catas contigo y maridajes con cocina mexicana. Te dejo tres para empezar.'),{v:[['8e779UQIkrc','Cata vertical de nueve añadas de Nebbiolo Reserva Privada','5:29','cata'],['KMv_LEiRgVM','Petite Sirah Reserva Privada','2:17','nota'],['sJ7jI3XM2B8','Mole poblano con Chenin Blanc','1:59','mar']],ch:['Ver el canal de YouTube']});
}
/* ¿Qué vinos van con este platillo? */
function scoreFood(id,classes){
  let s=0;const mar=N(P[id].mar||'');
  for(const c of classes){const r=PAIR[c];if(r&&r.w[id])s+=r.w[id];if(MARX[c]&&MARX[c].test(mar))s+=1.6}
  return s;
}
function marHit(id,classes){const mar=P[id].mar||'';for(const c of classes){if(MARX[c]&&MARX[c].test(N(mar))){const seg=mar.split(/[,.;]/).find(x=>MARX[c].test(N(x)));return seg?seg.replace(/\(.*$/,'').replace(/^\s*(y|e)\s+/,'').replace(/^(se recomienda con|acompaña (muy )?bien (con)?|ideal para acompañar|ideal para|acompaña)\s*/i,'').trim():null}}return null}
function pick(f){
  let pool=WINES.filter(id=>ok(id)&&(f.small?P[id].ml<750:P[id].ml===750)&&(id!=='grappa'||f.color==='destilado'));
  if(f.color)pool=pool.filter(id=>kind(id)===f.color||(f.color==='tinto'&&P[id].c==='tinto')||(f.color==='blanco'&&P[id].c==='blanco'));
  if(f.org)pool=pool.filter(id=>P[id].line==='Uvas Orgánicas');
  if(f.b&&f.b.max)pool=pool.filter(id=>P[id].price<=f.b.max);
  if(f.b&&f.b.min)pool=pool.filter(id=>P[id].price>=f.b.min);
  if(f.not)pool=pool.filter(id=>!f.not.includes(id));
  const sc=id=>{let s=0;
    if(f.food&&f.food.length)s+=scoreFood(id,f.food)*2;
    if(f.st){const d=st(id)?Math.abs(st(id)-f.st):2;s-=d*2.2}
    if(f.occ){const m=(TX[id]||[0,''])[1];if(m.includes(f.occ))s+=2.5;if(f.occ==='regalo')s+=Math.log(1+medN(id))*.5+(P[id].price>350?1:0)}
    if(f.b&&f.b.top)s+=Math.log(1+medN(id))+(P[id].price>400?2:0);
    if(f.sweet)s+=(/dulz|abocad|dulce/.test(N(P[id].desc))?3:0)+(kind(id)==='postre'?2:0);
    s+=Math.log(1+medN(id))*.45;
    return s};
  return pool.map(id=>[id,sc(id)]).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
}
/* qué hace distinta a una alternativa frente a la principal */
const altWhy=(a,m)=>P[a].price<P[m].price*.8?'algo más accesible':kind(a)!==kind(m)?'un '+typeN(a):st(a)&&st(m)&&st(a)<st(m)?'algo más ligero':st(a)&&st(m)&&st(a)>st(m)?'algo con más cuerpo':'';
function altsLine(alts,main){
  if(!alts.length)return '';
  const w1=altWhy(alts[0],main);let w2=alts[1]?altWhy(alts[1],main):'';if(w2===w1)w2='';
  const it=a=>'el '+A(a)+' ('+price(a)+')';
  let t=w1?'Si buscas '+w1+', '+it(alts[0])+' va muy bien':'También te va a gustar '+it(alts[0]);
  if(alts[1])t+=w2?'; y si prefieres '+w2+', '+it(alts[1]):(w1?'; y también te va a gustar ':', o ')+it(alts[1]);
  return p_(t+'.');
}
function recommend(f,leadTxt){
  const ids=pick(f).slice(0,3);
  if(!ids.length){const alt=pick({...f,b:null}).slice(0,1);
    return R(lead('No encontré un vino que cumpla todo eso'+(f.b&&f.b.max?' por menos de '+money(f.b.max):'')+'.')+(alt[0]?p_('Lo más cercano es el '+A(alt[0])+', de '+price(alt[0])+'.'):''),{ids:alt,feat:true,ch:['Muéstrame otras opciones']})}
  S.last={f,ids};S.shown=(S.shown||[]).concat(ids);S.wine=ids[0];
  const m=ids[0],alts=ids.slice(1,3);
  const fl=f.food&&f.food.length?FOOD.filter(x=>f.food.includes(x[0])).map(x=>x[2]):[];
  const occ={regalo:'Para regalar',pareja:'Para una noche para dos',cena:'Para una cena especial',tarde:'Para una tarde con amigos',brindis:'Para brindar',diario:'Para todos los días'}[f.occ];
  let open=leadTxt;
  if(!open){
    if(fl.length)open=rnd(['Para '+list(fl)+', yo abriría el ','Con '+list(fl)+', mi elección es el ','Para '+list(fl)+', sin dudarlo, el '])+B(m)+'.';
    else if(occ)open=occ+', me iría por el '+B(m)+'.';
    else if(f.b&&f.b.max)open='Por menos de '+money(f.b.max)+', mi favorito es el '+B(m)+'.';
    else if(f.color==='postre'||f.sweet)open='Si se te antoja algo dulce, el '+B(m)+'.';
    else if(f.color)open='En '+({tinto:'tintos',blanco:'blancos',rosado:'rosados',espumoso:'espumosos',destilado:'destilados'}[f.color])+', te recomendaría el '+B(m)+'.';
    else open='Te recomendaría el '+B(m)+'.';
  }else open=open+B(m)+'.';
  let h=lead(open);
  const why=!leadTxt&&f.food&&f.food.length&&PAIR[f.food[0]]?PAIR[f.food[0]].why:'';
  const ar=aromaPh(m),mo=mouthPh(m),hit=f.food&&marHit(m,f.food),mp=medPh(m);
  if(why)h+=p_(why+(ar?' Y este lo tiene: en nariz trae '+ar+(mo?'; en boca, '+mo:'')+'.':''));
  else if(f.food&&f.food.length&&ar)h+=p_('En nariz trae '+ar+(mo?'; en boca, '+mo:'')+'.');
  else{const vp=vinePh(m),op=oakPh(m);if(vp||op)h+=p_(cap(vp||'')+(vp&&op?' y ':'')+(vp?op:cap(op))+'.'+(ar?' En nariz trae '+ar+'.':''))}
  if(hit||mp)h+=p_((hit?'Su propia ficha lo sugiere para '+lc(hit)+'. ':'')+(mp?(hit?'Y es ':'Es ')+mp+'.':''));
  h+=tip('Sírvelo '+tempPh(m)+(kind(m)==='tinto'&&st(m)>=4?' y ábrelo media hora antes':'')+'.');
  h+=altsLine(alts,m);
  /* video de maridaje del canal, si hay uno con ese platillo */
  let v=[];if(f.food&&f.food.length&&hasYT()){const words=f.food.map(c=>({mole:'mole',nogada:'nogada',marisco:'ceviche|camaron|marlin',pescado:'salmon|marlin|atun',res:'res|filete|cecina|corte',cerdo:'cerdo|lechon|carnitas',pasta:'pizza|pasta',mexicana:'tacos|pozole|romeritos|huevos',queso_maduro:'queso'}[c])).filter(Boolean).join('|');
    if(words){const re=new RegExp(words);for(const k in YTV)for(const x of YTV[k])if(x[3]==='mar'&&re.test(N(x[1]))&&!v.find(y=>y[0]===x[0]))v.push(x)}}
  const c=['Cuéntame más del '+nm(m),'¿Cómo lo sirvo?',kind(m)==='tinto'?'¿Y si prefiero blanco?':'¿Algo más económico?'];
  return R(h,{ids:[m],feat:true,v:v.slice(0,1),ch:c});
}
function pairWine(id){
  const k=kind(id),s=st(id),ms=marShort(id,3);
  const mine={tinto:s>=4?'un buen corte a la parrilla, cordero o un mole':s===3?'carnes asadas, pastas con salsa de carne o cocina mexicana con especias':'unos tacos, una pizza o embutidos',
    blanco:'pescados, mariscos y aves; y si la comida pica un poco, mejor todavía',rosado:'ensaladas, mariscos, sushi o una tabla de botanas',espumoso:'casi todo: botanas, mariscos, sushi, frituras y, claro, el brindis',
    postre:'postres de frutos secos o chocolate, o un queso azul; también se disfruta solo, como postre',destilado:'el final de la comida, como digestivo'}[k];
  let h=lead(ms?'Su ficha marida el '+B(id)+' con '+ms+'.':'El '+B(id)+' es versátil en la mesa.')+p_('Yo lo abriría con '+mine+'.'+(aromaPh(id)?' Sus notas de '+aromaPh(id)+' acompañan sin tapar el platillo.':''));
  const v=vids(id).filter(x=>x[3]==='mar');
  const f1=(P[id].mar||'').replace(/\.$/,'').split(/[,;.]| y /)[0].trim().toLowerCase();
  return R(h,{v:v.slice(0,2),ch:['¿Cómo lo sirvo?'].concat(f1&&FOOD.some(([,r])=>r.test(N(f1)))?['Otro vino para '+f1]:[],['¿Cuánto dura abierto?'])});
}
function fit(id,classes,label){
  const s=scoreFood(id,classes);
  const best=pick({food:classes}).filter(x=>x!==id).slice(0,2);
  S.last={f:{food:classes},ids:[id,...best]};S.shown=[id,...best];
  const why=PAIR[classes[0]]&&PAIR[classes[0]].why||'';
  let h;
  if(s>=1.6){h=lead((s>=3?'Sí, y muy buena: ':'Sí, funciona bien: ')+'el '+B(id)+' con '+esc(label)+'.')+p_(why+(aromaPh(id)?' Sus notas de '+aromaPh(id)+' van justo por ahí.':''))+tip('Sírvelo '+tempPh(id)+'.');
    return R(h,{ids:[id],feat:true,ch:['¿Cómo lo sirvo?','¿Y otra opción?']})}
  const b=best[0];
  h=lead('Con '+esc(label)+', el '+B(id)+' puede funcionar, pero no es la pareja ideal.')+p_(why)+(b?p_('Yo me iría por el '+A(b)+' ('+price(b)+')'+(aromaPh(b)?': sus notas de '+aromaPh(b)+' le quedan mucho mejor':'')+'.'):'');
  return R(h,{ids:b?[b]:[],feat:true,ch:b?['Cuéntame más del '+nm(b),'¿Cómo lo sirvo?']:[]});
}
function compare(a,b){
  const sa=st(a),sb=st(b);
  const desc=id=>'El '+B(id)+' es un '+typeN(id)+' de '+grapeList(id)+(st(id)?', '+EST[st(id)]:'')+(oakPh(id)?', que '+oakPh(id):'')+(aromaPh(id)?'; en nariz trae '+aromaPh(id):'')+'.';
  let h=lead(sa&&sb&&sa===sb?'Son de estilo parecido, pero cada uno tiene su carácter.':'Son dos caracteres muy distintos.')+p_(desc(a))+p_(desc(b));
  let v;
  if(sa&&sb&&sa!==sb){const [hi,lo]=sa>sb?[a,b]:[b,a];v='Si buscas estructura y profundidad, me quedo con el '+A(hi)+'; si prefieres algo más fresco y fácil de tomar, el '+A(lo)+'.'}
  else{const xa=aromaPh(a,2),xb=aromaPh(b,2);v=xa&&xb?'Si te van las notas de '+xa+', el '+A(a)+'; si prefieres '+xb+', el '+A(b)+'.':'La diferencia está sobre todo en las uvas y en el precio.'}
  h+=p_(v+' El '+esc(P[a].name)+' cuesta '+price(a)+' y el '+esc(P[b].name)+', '+price(b)+'.');
  return R(h,{ids:[a,b],ch:['¿Cómo sirvo el '+nm(a)+'?','¿Con qué platillo va el '+nm(b)+'?']});
}
function gourmet(q){
  const isOil=/aceite|oliva/.test(q),isVin=/vinagre|balsamico/.test(q);
  const ids=GOUR.filter(id=>(isOil&&P[id].type==='Aceite de oliva')||(isVin&&P[id].type==='Vinagre')||(!isOil&&!isVin&&P[id].type==='Aceitunas'));
  let h;
  if(isOil)h=lead('Nuestro <b>Aceite de Oliva Extra Virgen</b> es de aceitunas seleccionadas, con notas herbales, y ganó Plata en los International Awards Virtus 2026.')+p_('Úsalo en crudo para que luzca: sobre una ensalada, unos vegetales asados o pan recién horneado; también en marinados y cocciones suaves. Lo tenemos de 250 ml a 5 L.');
  else if(isVin)h=lead('Tenemos dos vinagres, y los dos nacen del vino.')+p_('El <b>balsámico</b>, de vinagre de vino y mosto de uva concentrado, equilibra dulzor y acidez: ideal para ensaladas, quesos, carnes y reducciones. El de <b>vino tinto</b>, de acidez limpia, es el básico para vinagretas, aderezos y marinados.');
  else h=lead('Tenemos aceitunas <b>sevillanas</b> y <b>Manzanilla Misión</b>, con hueso, en frasco de 500 g.')+p_('Son el aperitivo perfecto antes de comer, con una copa de espumoso o de un blanco fresco.');
  return R(h,{ids:(ids.length?ids:GOUR).filter(id=>P[id].ml===750||P[id].ml===500).slice(0,1),feat:true,ch:['¿Qué vino va con aceitunas?','Ver todo gourmet']});
}
function priceInfo(id){
  let h='';
  if(id)h+=lead('El '+B(id)+' cuesta '+price(id)+'; para socios del Club Cetto, '+money(memberPrice(P[id].price))+'.');
  else h+=lead('Así funciona la tienda:');
  h+='<ul class="eno-ul"><li>10% de descuento al armar tu caja de 6 botellas de vino de 750 ml.</li><li>Envío gratis desde '+money(FREE)+'.</li><li>Hasta 3 meses sin intereses con tarjetas participantes.</li></ul>';
  return R(h,{ids:id?[id]:[],ch:id?chipsFor(id):['Recomiéndame un vino de menos de $300']});
}
function visit(){
  return R(lead('Nada como catar en el lugar donde nace el vino.')+p_('En nuestra bodega del Valle de Guadalupe hay catas y degustaciones desde <b>$250 por persona</b>: eliges la experiencia, la fecha y cuántas personas, y reservas en línea.')+p_('En la Ciudad de México, la Boutique L.A. Cetto en Lomas de Chapultepec tiene catas, cursos y eventos. <a href="'+PAGES.exp+'">Ver experiencias</a>'),{ch:['¿Qué vino me llevo de regalo?']});
}
function responsible(){return R(lead('Antes que nada, que todo salga bien.')+p_('El vino se disfruta con responsabilidad: no es para menores de edad, para quien está embarazada o en lactancia, ni para quien va a manejar. Si vas a conducir, déjalo para otro día; con gusto te ayudo a elegir la botella para entonces.')+p_('<small>El abuso en el consumo de este producto es nocivo para la salud.</small>'))}
function general(topic,q){
  if(topic==='temp')return R(lead('La temperatura cambia todo.')+p_('Los espumosos, entre 6 y 8 °C; blancos y rosados, entre 8 y 12; tintos ligeros, entre 12 y 16; tintos con cuerpo, entre 16 y 18; y los dulces, entre 8 y 10.')+p_('Dime cuál vas a abrir y te digo la temperatura exacta de su ficha.'),{ch:['Nebbiolo Reserva Privada','Champbrulé Brut','Chenin Blanc']});
  if(topic==='dec')return R(lead('Se decantan sobre todo los tintos jóvenes y con estructura.')+p_('Un Nebbiolo, un Cabernet o un Petite Sirah con crianza agradecen de 30 a 60 minutos en el decantador: se abren y los taninos se suavizan. Los blancos, rosados y tintos ligeros no lo necesitan, y los espumosos nunca.')+p_('¿Cuál vas a servir?'),{ch:['Terra Don Luis','Nebbiolo Reserva Privada','Petite Sirah L.A. Cetto']});
  if(topic==='abierto')return R(lead('Depende del vino.')+p_('Un espumoso aguanta de uno a tres días con un tapón especial; blancos y rosados, de tres a cinco en el refrigerador; los tintos, de tres a cinco bien tapados en un lugar fresco; y los dulces encabezados, varias semanas.'),{ch:['¿Y el Moscatel y Palomino?']});
  if(topic==='guarda')return R(lead('La clave es la calma: oscuridad, frescura y sin movimiento.')+p_('Guarda las botellas acostadas, entre 12 y 15 °C, lejos de la luz y de los cambios bruscos de temperatura. Los blancos, rosados y tintos ligeros se disfrutan jóvenes; los tintos con crianza, como el Nebbiolo o el Cabernet Reserva Privada, pueden evolucionar varios años.'),{ch:['¿Cuánto puedo guardar el Nebbiolo?']});
  if(topic==='copa')return glass(null);
  return null;
}
function greet(ctx){
  if(ctx&&P[ctx]&&isW(ctx)){const vp=vinePh(ctx),mp=medPh(ctx);
    return R(lead('Buena elección: el '+B(ctx)+'.')+p_((mp?'Es '+mp+'. ':'')+(vp?cap(vp)+(oakPh(ctx)?' y '+oakPh(ctx):'')+'. ':'')+'Pregúntame lo que quieras: cómo servirlo, con qué acompañarlo o en qué se diferencia de otros vinos de la casa.'),{ch:chipsFor(ctx)})}
  return R(lead('Te damos la bienvenida a la casa.')+p_('Soy el enólogo digital de L.A. Cetto. Conozco cada una de nuestras fichas, del viñedo a la copa. Cuéntame qué vas a cocinar, qué quieres celebrar o qué vino tienes en mente, y lo elegimos juntos.'),{ch:['¿Qué vino va con mole?','Algo para una carne asada','Un regalo de menos de $500','¿Qué es un vino encabezado?']});
}
function fallback(){
  return R(lead('Perdona, no te entendí del todo.')+p_('Cuéntamelo de otra forma: qué vas a comer, para quién es el vino o cuál estás pensando abrir. También puedo explicarte un término, como taninos o crianza.'),{ch:['¿Qué vino va con pescado?','Compara el Nebbiolo y el Cabernet Reserva Privada','¿Qué son los taninos?']});
}

/* ---------- entender la pregunta ---------- */
const RX={
 hola:/^(hola|buen(os|as) (dias|tardes|noches)|que tal|hey|saludos)\b/,gracias:/^(gracias|muchas gracias|mil gracias|te agradezco|perfecto|excelente|listo)\b/,
 resp:/\b(menor(es)? de edad|tengo 1[0-7] anos|embarazad|lactancia|voy a manejar|manejar despues|conducir)\b/,
 temp:/\b(temperatura|grados|que tan fri|frio|fria|enfri|refriger|hielera|cubeta|servirlo|servirla|lo sirvo|la sirvo|los sirvo|se sirve)\b/,
 dec:/\b(decant|oxigen|airear|respirar|abrir(lo)? antes|dejarlo respirar)\b/,
 abierto:/\b(abiert[oa]|despues de abrir|ya lo abri|una vez abiert|cuantos dias dura|se echa a perder|se oxida|lo que sobr|sobro)\b/,
 guarda:/\b(guardarlo|guardar|guarda|anejar|envejec|cuantos anos|potencial|cava|conservar|almacenar|evoluciona)\b/,
 copa:/\b(copa|copas|cristaleria|que vaso)\b/,
 comp:/\b(diferencia|diferencias|compar|versus|vs|cual es mejor|mejor entre|o el|que tiene de distinto)\b/,
 cata:/\b(como es|a que sabe|sabor|notas? de cata|aromas?|describ|que tal es|como sabe|perfil|como se siente)\b/,
 proc:/\b(barrica|crianza|roble|como se hace|como lo hacen|elabora|fermenta|maceracion|metodo|de que uva|que uvas?|uvas|varietal|vinedo|de donde viene)\b/,
 prem:/\b(premio|premios|medalla|medallas|reconocimiento|reconocimientos|premiad|galardon)\b/,
 video:/\b(video|videos|youtube|ver la cata|canal)\b/,
 precio:/\b(precio|cuesta|cuanto vale|cuanto sale|descuento|promocion|caja de 6|meses sin intereses|msi|socios?|club|envio|envios|entrega)\b/,
 visita:/\b(visitar|visita|tour|recorrido|experiencias?|reservar|cata en el valle|degustacion|boutique|bodega)\b/,
 gour:/\b(aceite|oliva|vinagre|balsamico|aceitunas?)\b/,
 mar:/\b(con que|marida|maridaje|maridar|acompan|va con|va bien|combina|para comer|platillo|comida|que vino para|con el|con la|con unos|con unas)\b/,
 rec:/\b(recomienda|recomiendas|recomendacion|sugiere|sugieres|sugerencia|que vino|cual (me|le|vino)|busco|quiero|necesito|regal|para (una|un|el|la|mi)|algo|opcion|opciones|muestrame|dame)\b/,
 term:/\b(que es|que son|que significa|que quiere decir|significado|define|explica)\b/,
 more:/\b(mas barat|menos car|mas economic|algo mas economic|mas accesible)\b/,
 lighter:/\b(mas ligero|mas suave|menos intenso|menos fuerte)\b/,heavier:/\b(mas cuerpo|mas intenso|mas robusto|mas fuerte|mas potente)\b/,
 other:/^(y )?(otr[oa]s?\b|otra opcion|mas opciones|otras opciones|muestrame otras|alguno mas|otro vino para ese)/,
 serve:/\b(como (lo |la |los |las |se )?sirv|como servir|como lo tomo|como se toma|ritual)/
};
/* las palabras se reconocen por su inicio (decant → decantarse, acompan → acompaña) */
for(const k in RX)RX[k]=new RegExp(RX[k].source.replace(/\\b$/,''),RX[k].flags);
function answer(raw,ctx){
  const q=N(raw);S.turns++;
  if(!q)return greet(ctx);
  if(RX.resp.test(q))return responsible();
  const W=findWines(q,S.wine||ctx);
  const cur=W[0]?W[0].id:(S.wine||ctx||null);
  const food=FOOD.filter(([,r])=>r.test(q));
  const fcls=food.map(x=>x[0]);
  /* palabras sueltas */
  if(q.split(' ').length<=4&&RX.gracias.test(q))return R(lead(rnd(['Con mucho gusto. Que lo disfrutes, ¡salud!','Un placer. Que esa botella se disfrute en buena compañía.','Para eso estoy. Aquí sigo si surge otra duda.'])),{ch:cur?chipsFor(cur):[]});
  if(RX.hola.test(q)&&q.split(' ').length<=4)return greet(ctx);
  /* comparar dos vinos (antes que "qué es", para "¿qué es mejor, el Nebbiolo o el Cabernet?") */
  if(RX.comp.test(q)&&(W.length>=2||(W.length===1&&(ctx||S.wine)&&W[0].id!==(ctx||S.wine)))){
    const a=W.length>=2?W[0].id:(ctx||S.wine),b=W.length>=2?W[1].id:W[0].id;S.wine=a;S.pend=null;return compare(a,b)}
  /* términos y uvas */
  const u=UVAK.find(k=>new RegExp('\\b'+k+'\\b').test(q)),g=GLOS.find(([r])=>r.test(q));
  if(RX.term.test(q)||(q.split(' ').length<=3&&!W.length&&g)){
    if(g)return R(p_('<b>'+g[1]+'</b>. '+esc(g[2])),{ch:['¿Qué son los taninos?','¿Qué es la crianza en barrica?','Recomiéndame un vino']});
    if(u){const ws=WINES.filter(id=>P[id].ml===750&&ok(id)&&N(grapes(id)).includes(u)).sort((a,b)=>medN(b)-medN(a)).slice(0,3);
      return R(p_('<b>'+cap(u)+'</b>. '+esc(UVA[u]))+(ws.length?p_('En la casa la encuentras en '+ws.map(A).join(', ')+'.'):''),{ids:ws,ch:ws[0]?chipsFor(ws[0]):[]})}
  }
  if(RX.gour.test(q)&&!/\b(vino|tinto|blanco)\b/.test(q))return gourmet(q);
  /* respuesta pendiente: "¿a qué temperatura?" → "Nebbiolo Reserva Privada" */
  if(S.pend&&W[0]&&q.split(' ').length<=5){const fn={temp:serveTemp,dec:decant,abierto:openLife,copa:glass,guarda:keep}[S.pend];S.pend=null;S.wine=W[0].id;if(fn)return fn(W[0].id)}
  S.pend=null;
  /* algo parecido a un vino */
  if(W[0]&&/\b(parecid[oa]|similar|como el|como la|alternativa|en lugar del?)\b/.test(q)){const id=W[0].id;
    const f={st:st(id)||null,color:kind(id),not:[id],b:RX.more.test(q)||/\bbarat|economic/.test(q)?{max:P[id].price-1}:null};S.shown=[id];
    return recommend(f,'Algo parecido al '+nm(id)+(f.b?', pero más accesible':'')+': el ')}
  /* "¿y con mole?" sobre el vino del que se está hablando */
  if(cur&&!W.length&&food.length&&/^(y )?(con|va con|combina con|sirve con|queda con|y si es|y para)\b/.test(q)&&!RX.rec.test(q)){S.wine=cur;return fit(cur,fcls,food[0][2])}
  /* "¿con qué platillo / postre va?" sobre el vino de la página */
  if(cur&&!W.length&&/^(y )?(con que|que) (platillo|postre|comida|plato)s?\b/.test(q)){S.wine=cur;return pairWine(cur)}
  /* seguimiento de una recomendación */
  if(S.last&&!W.length&&(RX.more.test(q)||RX.lighter.test(q)||RX.heavier.test(q)||RX.other.test(q)||/^(y )?(si prefiero |prefiero |mejor |en |solo )?(un |una )?(blanco|tinto|rosado|espumoso)s?\b/.test(q))){
    const f={...S.last.f};const ids=S.last.ids;
    if(RX.more.test(q)){f.not=ids.slice();f.b={max:P[ids[0]].price-1};if(!pick(f).length){const pr=ids.map(id=>P[id].price).sort((a,b)=>a-b);f.b={max:Math.max(pr[pr.length-1],P[ids[0]].price)};f.near=1}}
    if(RX.lighter.test(q))f.st=Math.max(1,(f.st||Math.round(ids.reduce((s,id)=>s+(st(id)||2),0)/ids.length))-1);
    if(RX.heavier.test(q))f.st=Math.min(4,(f.st||Math.round(ids.reduce((s,id)=>s+(st(id)||2),0)/ids.length))+1);
    const c=color(q);if(c)f.color=c;
    if(RX.other.test(q)&&!RX.more.test(q))f.not=S.shown.slice();
    const near=f.near;delete f.near;
    return recommend(f,RX.more.test(q)?(near?'Ya estábamos en lo más accesible para ese platillo; por un precio parecido, otra gran opción es el ':'Algo más accesible, con el mismo espíritu: el '):RX.other.test(q)?'Otra opción que me gusta mucho: el ':color(q)?'En '+({tinto:'tinto',blanco:'blanco',rosado:'rosado',espumoso:'espumoso'}[color(q)]||'ese estilo')+', yo abriría el ':'Entonces me iría por el ');
  }
  if(/compara los dos primeros/.test(q)&&S.last&&S.last.ids.length>1)return compare(S.last.ids[0],S.last.ids[1]);
  /* cómo servirlo: temperatura, copa y si se decanta, todo junto */
  if(RX.serve.test(q)){const id=W[0]?W[0].id:cur;if(id){S.wine=id;return serve(id)}return general('temp',q)}
  /* servicio y guarda: del vino mencionado; si solo dice el tipo ("un espumoso"), la guía general; si no, el de la página */
  const T=RX.dec.test(q)?'dec':RX.abierto.test(q)?'abierto':RX.temp.test(q)?'temp':RX.copa.test(q)?'copa':RX.guarda.test(q)&&!RX.rec.test(q)?'guarda':null;
  if(T){const fn={temp:serveTemp,dec:decant,abierto:openLife,copa:glass,guarda:keep}[T];
    if(/\blos\b/.test(q)&&S.last&&!W.length&&T==='temp'){const ids=S.last.ids.slice(0,2);return R(ids.map(id=>p_('<b>'+esc(nm(id))+'</b>: '+esc(temp(id))+'.')).join(''),{ch:['¿Necesitan decantarse?']})}
    if(W[0]){S.wine=W[0].id;return fn(W[0].id)}
    if(color(q)){const id=pick({color:color(q)});if(color(q)==='espumoso'&&id[0]){S.wine=id[0];return fn(id[0])}S.pend=T;return general(T,q)}
    if(cur){S.wine=cur;return fn(cur)}
    S.pend=T;return general(T,q)}
  if(RX.video.test(q))return videosOf(W[0]?W[0].id:(/\bcanal\b/.test(q)?null:cur));
  if(RX.prem.test(q)){if(W[0]){S.wine=W[0].id;return awards(W[0].id)}if(/\b(mas premiad|cuales|que vinos)\b/.test(q)||!cur)return topAwarded();return awards(cur)}
  if(RX.visita.test(q)&&!W.length)return visit();
  if(RX.precio.test(q))return priceInfo(W[0]?W[0].id:(RX.rec.test(q)||/\b(envio|entrega|meses|club|socio|caja)/.test(q)?null:cur));
  /* un vino concreto */
  if(W[0]||(!food.length&&!color(q)&&!budget(q)&&!OCC.some(([,r])=>r.test(q))&&cur&&(RX.cata.test(q)||RX.proc.test(q)||RX.mar.test(q)))){
    const id=W[0]?W[0].id:cur;S.wine=id;
    if(food.length)return fit(id,fcls,food[0][2]);
    if(RX.cata.test(q))return tasting(id);
    if(RX.proc.test(q))return process(id);
    if(RX.mar.test(q)||/\b(postre|platillo)\b/.test(q))return pairWine(id);
    const r=aboutWine(id);if(W[0]&&W[0].alt.length&&!LINE.some(([,re])=>re.test(q)))r.h+=p_('<small>También tenemos '+W[0].alt.filter(x=>P[x].ml===750).map(A).join(', ')+'.</small>');
    return r;
  }
  /* recomendar */
  const f={food:fcls,color:color(q),st:styleT(q),b:budget(q),occ:(OCC.find(([,r])=>r.test(q))||[])[0]||null,org:/\borganic/.test(q),small:/\b(375|187|botellin|media botella|chiquit|mini)\b/.test(q),sweet:/\b(dulce|abocad|semi ?seco)\b/.test(q)};
  if(f.sweet&&!f.color&&!food.length)f.color='postre';
  if(food.length||f.color||f.st||f.b||f.occ||f.org||f.small||RX.rec.test(q)){
    const lead=food.length?'Para '+food.map(x=>x[2]).join(' y ')+', te propongo:':f.occ==='regalo'?'Para regalar'+(f.b&&f.b.max?', por menos de '+money(f.b.max):'')+':':f.occ==='pareja'?'Para una noche para dos:':f.occ==='brindis'?'Para brindar:':f.b&&f.b.max?'Por menos de '+money(f.b.max)+':':null;
    S.shown=[];return recommend(f,null)}
  return fallback();
}

/* ---------- catálogo y datos para el modelo (cuando el servidor tiene uno conectado) ---------- */
let CATALOG=null;
function catalog(){
  if(CATALOG)return CATALOG;
  const L=WINES.map(id=>{const f=fx(id),o=oak(id);return [id,nmS(id),P[id].type,price(id)+(P[id].out?' (agotado)':''),'uvas: '+grapes(id),st(id)?'estilo: '+EST[st(id)]:'',o?'crianza: '+o.t:'sin barrica','servir: '+temp(id),f&&f.a?'aromas: '+f.a.join(', '):'',P[id].mar?'maridaje: '+P[id].mar.replace(/\s+/g,' '):'',medN(id)?'reconocimientos: '+medN(id):'',vids(id).length?'videos de cata: '+vids(id).length:''].filter(Boolean).join(' | ')});
  const G=GOUR.map(id=>[id,nm(id)+' '+(P[id].sub||''),price(id)].join(' | '));
  CATALOG='VINOS\n'+L.join('\n')+'\n\nGOURMET\n'+G.join('\n')+'\n\nTIENDA\n10% de descuento en caja de 6 botellas de 750 ml · envío gratis desde '+money(FREE)+' · hasta 3 meses sin intereses con tarjetas participantes · precio de socio del Club Cetto 5% menos · catas en el Valle de Guadalupe desde $250 por persona · Boutique L.A. Cetto en Lomas de Chapultepec (CDMX).';
  return CATALOG;
}
function factsFor(q,ctx){
  const nq=N(q),W=findWines(nq,S.wine||ctx).map(w=>w.id);
  const ids=[...new Set([ctx,...W,S.wine].filter(Boolean))].slice(0,4);
  const sheet=id=>{const f=fx(id);return '['+id+'] '+nmS(id)+' · '+P[id].line+' · '+price(id)+'\n'+(f?f.o.map(([t,d])=>t+': '+d).join('\n')+'\nVista: '+(f.c[0]||'')+'\nNariz: '+(f.c[1]||'')+'\nBoca: '+(f.c[2]||'')+'\nServir: '+f.s:'')+'\nDescripción: '+P[id].desc+'\nMaridaje: '+(P[id].mar||'')+(meds(id).length?'\nPremios destacados: '+meds(id).slice(0,5).map(a=>a[2]+', '+a[3]+' '+a[0]).join('; '):'')};
  const food=FOOD.filter(([,r])=>r.test(nq)).map(x=>x[0]);
  const cand=food.length?pick({food}).slice(0,5):[];
  return (ctx?'Página actual: ficha de ['+ctx+'] '+nmS(ctx)+'\n\n':'')+ids.map(sheet).join('\n\n')+(cand.length?'\n\nMejores candidatos para ese platillo según las fichas: '+cand.map(id=>'['+id+'] '+nmS(id)).join(', '):'');
}

/* ---------- interfaz ---------- */
const IC='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><path d="M7.6 3h8.8l-.5 5.4a3.9 3.9 0 0 1-7.8 0z"/><path d="M8.1 7.2h7.8"/><path d="M12 12.3V20M8.6 20.5h6.8"/></svg>';
let el,body,input,llm=null,H=[],ctxNow=null,busy=false;
function mount(){
  if(el)return;
  el=document.createElement('aside');el.className='eno';el.id='eno';el.setAttribute('role','dialog');el.setAttribute('aria-label','Enólogo digital');el.setAttribute('aria-hidden','true');el.inert=true;
  el.innerHTML='<header class="eno-h"><span class="eno-av" aria-hidden="true">'+IC+'</span><div class="eno-ht"><b>Enólogo digital</b><small>Responde con las fichas técnicas de L.A. Cetto</small></div><button type="button" class="eno-x" aria-label="Cerrar el enólogo digital"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></header>'+
   '<div class="eno-b" id="enoB" role="log" aria-live="polite"></div>'+
   '<form class="eno-f" id="enoF"><label class="sr" for="enoI">Escribe tu pregunta</label><textarea id="enoI" rows="1" maxlength="400" placeholder="Pregunta por un vino o un platillo" enterkeyhint="send"></textarea><button type="submit" aria-label="Enviar la pregunta"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>'+
   '<p class="eno-fine">Respuestas con base en nuestras fichas técnicas. Evita el exceso.</p>';
  document.body.appendChild(el);
  body=el.querySelector('#enoB');input=el.querySelector('#enoI');
  el.querySelector('.eno-x').onclick=close;
  el.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close()}});
  el.querySelector('#enoF').onsubmit=e=>{e.preventDefault();const v=input.value.trim();if(v&&!busy){input.value='';fitIn();ask(v)}};
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();el.querySelector('#enoF').requestSubmit()}});
  const fitIn=()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,120)+'px'};input.addEventListener('input',fitIn);
  body.addEventListener('click',e=>{
    const c=e.target.closest('[data-q]');if(c&&!busy){ask(c.dataset.q);return}
    const a=e.target.closest('[data-add]');if(a){add(a.dataset.add,1);a.textContent='Agregado';a.disabled=true;return}
    const v=e.target.closest('[data-yt]');if(v){const box=v.closest('.eno-v');box.innerHTML='<iframe src="'+ytEmbed(v.dataset.yt)+'" title="'+esc(v.dataset.t)+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';return}
  });
  /* ¿hay un modelo conectado en el servidor? */
  fetch('/api/enologo',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{llm=!!(j&&j.llm)}).catch(()=>{llm=false});
}
function card(id,feat){
  const p=P[id];
  return '<div class="eno-pc'+(feat?' feat':'')+'"><a href="'+url(id)+'" class="eno-pi" tabindex="-1" aria-hidden="true"><img src="media/bot/'+id+'.png" alt="" loading="lazy" onerror="this.onerror=null;this.src=\''+F(p.img,200)+'\'"></a><a href="'+url(id)+'" class="eno-pt"><small>'+esc(p.line)+'</small><b>'+esc(p.c==='gourmet'?p.name:p.name)+'</b><span>'+price(id)+(p.ml&&p.ml!==750?' · '+(p.type==='Aceitunas'?p.ml+' g':p.ml>=1000?p.ml/1000+' L':p.ml+' ml'):'')+(st(id)&&isW(id)?' · '+cap(EST[st(id)]):'')+'</span></a>'+(p.out?'<span class="eno-out">Agotado</span>':'<button type="button" class="eno-add" data-add="'+id+'" aria-label="Agregar '+esc(nm(id))+' al carrito">Agregar</button>')+'</div>';
}
function vcard(v){return '<div class="eno-v"><button type="button" data-yt="'+v[0]+'" data-t="'+esc(v[1])+'" aria-label="Reproducir el video: '+esc(v[1])+'"><img src="'+ytThumb(v[0],'mqdefault')+'" alt="" loading="lazy"><span class="eno-vp" aria-hidden="true"></span></button><span class="eno-vt"><b>'+esc(v[1])+'</b><small>'+esc((YTK[v[3]]||'Video')+(v[4]?' · con '+v[4]:'')+' · '+v[2])+'</small></span></div>'}
function chipBtns(ch){
  if(!ch||!ch.length)return '';
  return '<div class="eno-chips">'+ch.map(c=>c==='Ver el canal de YouTube'?'<a class="eno-chip" href="'+YT_CH.url+'" target="_blank" rel="noopener">'+c+'</a>':c==='Ver la Colección Premiada'?'<a class="eno-chip" href="'+PAGES.coleccion+'">'+c+'</a>':c==='Ver todo gourmet'?'<a class="eno-chip" href="'+PAGES.tienda+'?tipo=gourmet">'+c+'</a>':c==='Ver la cata en video'?'<button type="button" class="eno-chip" data-q="¿Hay video de la cata?">'+c+'</button>':'<button type="button" class="eno-chip" data-q="'+esc(c)+'">'+esc(c)+'</button>').join('')+'</div>';
}
function push(role,html){const d=document.createElement('div');d.className='eno-m '+(role==='u'?'u':'a');d.innerHTML=html;body.appendChild(d);requestAnimationFrame(()=>{body.scrollTop=body.scrollHeight});return d}
function render(r){
  body.querySelectorAll('.eno-chips').forEach(x=>x.remove());
  let h=r.h;
  if(r.ids&&r.ids.length)h+='<div class="eno-cards">'+[...new Set(r.ids)].filter(id=>P[id]).slice(0,3).map((id,i)=>card(id,r.feat&&i===0)).join('')+'</div>';
  if(r.v&&r.v.length&&hasYT())h+='<div class="eno-vids"><p class="eno-vl">En video, del canal de la bodega</p>'+r.v.map(vcard).join('')+'</div>';
  h+=chipBtns(r.ch);
  const m=push('a',h);[...m.children].forEach((c,i)=>c.style.setProperty('--k',i));m.classList.add('in');
}
/* texto del modelo → HTML sencillo; [[clave]] se vuelve tarjeta */
function fromLLM(t){
  const ids=[];t=t.replace(/\[\[([a-z0-9]+)\]\]/g,(m,id)=>{if(P[id]&&!ids.includes(id))ids.push(id);return ''});
  const lines=esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').split(/\n+/);let h='',ul=false;
  for(const l of lines){const x=l.trim();if(!x)continue;if(/^[-•]\s+/.test(x)){if(!ul){h+='<ul class="eno-ul">';ul=true}h+='<li>'+x.replace(/^[-•]\s+/,'')+'</li>'}else{if(ul){h+='</ul>';ul=false}h+='<p>'+x+'</p>'}}
  if(ul)h+='</ul>';
  return {h,ids};
}
async function ask(q){
  busy=true;push('u','<p>'+esc(q)+'</p>');
  const t=push('a','<span class="eno-typing" role="status" aria-label="Escribiendo"><i></i><i></i><i></i></span>');
  const local=answer(q,ctxNow);
  let r=local;
  if(llm){
    try{
      const ctl=new AbortController();const to=setTimeout(()=>ctl.abort(),25000);
      const res=await fetch('/api/enologo',{method:'POST',headers:{'Content-Type':'application/json'},signal:ctl.signal,body:JSON.stringify({catalog:catalog(),facts:factsFor(q,ctxNow),messages:H.concat([{role:'user',content:q}]).slice(-10)})});
      clearTimeout(to);
      const j=res.ok?await res.json():null;
      if(j&&j.text){const x=fromLLM(j.text);r=R(x.h,{ids:x.ids.length?x.ids:[],v:local.v,ch:local.ch,txt:j.text})}
    }catch(e){/* sin modelo: responde el motor local */}
  }else await new Promise(s=>setTimeout(s,700+Math.min(900,q.length*10)));
  t.remove();render(r);
  H.push({role:'user',content:q},{role:'assistant',content:r.txt||''});H=H.slice(-12);
  busy=false;
}
function open(q,ctx){
  mount();
  if(ctx!==undefined)ctxNow=ctx;else if(window.ENO_CTX&&window.ENO_CTX.wine)ctxNow=window.ENO_CTX.wine;
  const first=!body.children.length;
  el.inert=false;el.setAttribute('aria-hidden','false');el.classList.add('on');document.documentElement.classList.add('eno-open');
  if(first){const g=greet(ctxNow);if(q)g.ch=[];render(g)}
  if(q)ask(q);
  setTimeout(()=>{if(matchMedia('(hover:hover)').matches)input.focus()},260);
}
function close(){if(!el)return;el.classList.remove('on');el.setAttribute('aria-hidden','true');el.inert=true;document.documentElement.classList.remove('eno-open');const l=document.getElementById('enoL');if(l)l.focus({preventScroll:true})}
window.ENO={open,close,ask:q=>open(q),answer,chipsFor,_S:S};
})();
