/* L.A. Cetto · concepto de rediseño · código compartido de ficha e historia
   Datos de producto tomados del catálogo público de lacetto.mx (precios, frases de ocasión, descripción y maridaje). */
const PAGES={home:'lacetto-home-concepto.html',coleccion:'lacetto-coleccion.html',ficha:'lacetto-ficha.html',hist:'lacetto-historia.html',tray:'lacetto-trayectoria.html',tienda:'lacetto-tienda.html',exp:'lacetto-experiencias.html',regalos:'lacetto-regalos.html',club:'lacetto-club.html',pago:'lacetto-pago.html',ayuda:'lacetto-ayuda.html',cuenta:'lacetto-cuenta.html',mapa:'index.html'};
/* Filtros de la tienda por URL: ?tipo=tinto|blanco|rosado|espumoso|ensamble|postre · ?linea=reserva-privada|don-luis|estaciones|boutique|uvas-organicas|sierra-blanca|peninsula|la-cetto · ?f=premiados|botellines|gourmet|estuches · ?precio=300 · ?momento=cena|pareja|tarde|brindis|mesa|regalo|diario · ?maridaje=carne|aves|mar|pasta|queso|mex|postre · ?estilo=1..4 · ?q=texto · #encuentra abre el buscador de vino */
const cur=(opts,k)=>opts.page===k?' aria-current="page"':'';
/* Estado compartido del prototipo (solo en este navegador, nada se envía):
   cettoCart {id:cantidad} · cettoUser {name,email,since,club:null|{n:3|6,since}} · cettoOrders [{no,date,items:{id:q},sub,disc,ship,tot,delivery,pay,gift}] · cettoBookings [{code,exp,name,date,time,guests,total}] */
const store={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const user=()=>store.get('cettoUser',null);
/* Saludo del encabezado: llámalo después de entrar o salir de la cuenta */
function paintUser(){const hu=document.getElementById('hdrUser');if(hu){const u=user(),f=u&&String(u.name||'').trim().split(/\s+/)[0];hu.classList.toggle('in',!!f);hu.setAttribute('aria-label',f?'Mi cuenta, '+f:'Mi cuenta');hu.title=f?'Hola, '+f:'Mi cuenta'}
  const a=document.getElementById('menuUser');if(!a)return;const u=user(),f=u&&String(u.name||'').trim().split(/\s+/)[0];
  a.querySelector('.t').textContent=f?'Hola, '+f:'Mi cuenta';a.querySelector('.s').textContent=f?'Tus pedidos y reservas':'Inicia sesión o regístrate';
  const av=a.querySelector('.m-av');if(f){av.textContent=f[0].toUpperCase();av.classList.add('in')}else if(av.classList.contains('in')){av.innerHTML=IC.user;av.classList.remove('in')}
  if(f)a.setAttribute('aria-label','Mi cuenta, '+f);else a.removeAttribute('aria-label')}
const F=(f,w)=>/^(https?:|media\/|data:)/.test(f)?f:'https://www.lacetto.mx/cdn/shop/files/'+f+(w?'?width='+w:'');
const money=n=>'$'+Math.round(n).toLocaleString('es-MX');
const money2=n=>'$'+n.toLocaleString('es-MX',{minimumFractionDigits:2,maximumFractionDigits:2});
const plus='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const arrow='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const xIcon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

const P={
 nebrp:{line:'Reserva Privada',name:'Nebbiolo',type:'Vino tinto',price:355,img:'NEBBIOLO_01_1d25a504-adbb-44f5-a15d-1707e3b63e1d.png',medals:163,q:'Para abrir una botella con historia, compartirla sin prisa y dejar que la conversación evolucione.',desc:'El primer Nebbiolo mexicano que marcó historia: aromas de grosella, higo, cereza y un delicado toque floral de jamaica. De cuerpo robusto, taninos firmes y gran complejidad. Elegancia y carácter: grosella, higo, cereza y notas de jamaica en un vino robusto y de gran final.',mar:'Cortes de carne, platillos especiados, quesos maduros.'},
 pslac:{line:'L.A. Cetto',name:'Petite Sirah',type:'Vino tinto',price:201,img:'PETITE-SIRAH-O1.png',medals:153,q:'Para reuniones con buena plática, sabores presentes y una copa que se disfruta con calma.',desc:'Rojo ciruela de gran intensidad, limpio, brillante y con ribete violeta. De gran intensidad aromática de frutos rojos y toque herbal. Muy agradable al paladar, intenso, frutal, complejo y equilibrado.',mar:'Cortes de res a la parrilla u horno, grasos y especiados, y acompañamientos a base de hongos o frutos rojos y negros.'},
 cabrp:{line:'Reserva Privada',name:'Cabernet Sauvignon',type:'Vino tinto',price:463,img:'CABERNET_SAUVIGNON_01.png',medals:95,q:'Para cenas con intención, noches pausadas y ocasiones donde buscas un tinto con estructura.',desc:'Un Cabernet con presencia: grosella negra, violetas, notas de cuero y especias, envueltos en sutiles recuerdos de humo y vainilla. De taninos maduros y final prolongado. Profundo y elegante: grosella negra, violetas y un toque de humo. Un vino para momentos memorables.',mar:'Cortes premium, cordero, platos complejos.'},
 charp:{line:'Reserva Privada',name:'Chardonnay',type:'Vino blanco',price:306,img:'CHARDONNAY_01_0ab52e13-7fc2-49a0-9646-9c8478e3d821.png',medals:92,q:'Para cuando quieres abrir un blanco con más elegancia y darle un toque especial al momento.',desc:'Color amarillo verdoso con destellos dorados. Aromas a flores, manzanilla, anís, frutos tropicales maduros y secos; mantequilla, almendra y pan tostado. Cítrico, untuoso, complejo, floral, confirma el fondo tostado y de acidez firme.',mar:'Platillos a base de carnes blancas y mariscos, con salseos cremosos o con mantequilla, pastas blancas y empanizados.'},
 chenin:{line:'L.A. Cetto',name:'Chenin Blanc',type:'Vino blanco',price:193,img:'CHENIN_BLANC_01.png',medals:88,q:'Para tardes cálidas, planes relajados y momentos donde se antoja algo fresco y amable.',desc:'Color amarillo paja, transparente, limpio y brillante. Aromas frescos a piña, plátano, manzana, pera y notas a miel de abeja. Muy amable al paladar, ligeramente abocado en equilibrio con su acidez que lo hacen fresco y agradable.',mar:'Acompaña platillos de pescados, aves, cerdo o mariscos asados a la parrilla con salseos a base de frutas tropicales o cítricas y ligeramente herbáceos.'},
 viog:{line:'Don Luis',name:'Viognier',type:'Vino blanco',price:329,img:'VIOGNIER_01_a26e2e58-0d27-43c1-aaa7-9879297f9e23.png',medals:72,q:'Para una comida especial de día, una celebración íntima o cuando quieres sorprender con un blanco diferente.',desc:'Un Viognier sofisticado: aromas de flores blancas, lima, mandarina y guanábana, con un paladar untuoso y potente. Exótico y envolvente: flores blancas, cítricos y frutas tropicales en un blanco seductor.',mar:'Pescados grasos, mariscos, cocina asiática.'},
 psrp:{line:'Reserva Privada',name:'Petite Sirah',type:'Vino tinto',price:409,img:'PETITE_SIRAH_01.png',medals:68,q:'Para una sobremesa larga, una cena con carácter y momentos que piden una copa con profundidad.',desc:'Una Petite Sirah que impresiona: aromas de grosella, zarzamora y jamaica, envueltos en un cuerpo potente y taninos marcados. Intenso y profundo: grosella, zarzamora y especias en un vino que deja huella.',mar:'Carnes al carbón, guisos especiados, quesos añejos.'},
 terra:{line:'Don Luis',name:'Terra',type:'Ensamble',price:460,img:'TERRA_01.png',medals:56,q:'Para una cena importante, de ritmo pausado, donde cada copa acompaña la conversación.',desc:'Un ensamble elegante que combina Cabernet Sauvignon, Merlot, Petit Verdot y Malbec: aromas de frutos negros, violetas y especias, con sutiles notas de tabaco y cuero. Complejo y profundo: frutos negros, violetas y notas de tabaco en un ensamble sofisticado.',mar:'Carnes asadas, estofados, quesos maduros.'},
 conc:{line:'Don Luis',name:'Concordia',type:'Ensamble',price:378,img:'CONCORDIA_01.png',medals:32,q:'Para sobremesas largas, conversaciones pausadas y momentos que merecen una botella con carácter.',desc:'Un ensamble de Cabernet Sauvignon y Shiraz que conquista: aromas de ciruela, higo y arándano, con toques de tabaco, chocolate y vainilla. De cuerpo robusto y textura envolvente. Armonía perfecta: ciruela, higo y chocolate en un ensamble seductor.',mar:'Platillos especiados, carnes al horno, chocolate amargo.'},
 prim:{line:'Estaciones',name:'Primavera',sub:'Cabernet Sauvignon Rosé',type:'Vino rosado',price:233,img:'PRIMAVERA_01.png',q:'Para tardes frescas, planes al aire libre y momentos que se sienten ligeros desde el primer brindis.',desc:'Primavera en copa: aromas de fresa, frambuesa y jamaica, con un paladar fresco y ligeramente abocado. Alegre y ligero: fresa, frambuesa y jamaica que evocan días soleados.',mar:'Brunch, ensaladas, aperitivos al aire libre.'},
 ver:{line:'Estaciones',name:'Verano',sub:'Ensamble Blanco',type:'Ensamble',price:233,img:'VERANO_01_eaf1c609-5d50-4cb6-8e56-97382dc25151.png',q:'Para días de calor, reuniones espontáneas y copas que piden servirse bien frías.',desc:'El verano hecho vino: flores blancas, guayaba, maracuyá y cítricos en un ensamble vibrante y refrescante. Tropical y refrescante: flores, maracuyá y cítricos para los días de calor.',mar:'Ceviches, mariscos, días de alberca.'},
 oto:{line:'Estaciones',name:'Otoño',sub:'Gamay',type:'Vino tinto',price:236,img:'OTONO_01.png',q:'Para tardes casuales, planes cómodos y momentos donde quieres un tinto ligero sin complicarte.',desc:'Un vino inspirado en el otoño: aromas de jamaica y grosella, con un estilo fresco y alegre. Fresco y frutal: jamaica y grosella con acidez vibrante.',mar:'Charcutería, pizzas, comidas ligeras.'},
 inv:{line:'Estaciones',name:'Invierno',sub:'Petit Verdot',type:'Vino tinto',price:236,img:'INVIERNO_01.png',q:'Para noches frías, conversaciones largas y planes que se disfrutan con calma.',desc:'Un vino que abraza en los días fríos: aromas de cereza negra, moras y especias, con un cuerpo elegante y taninos maduros. Intenso y cálido: cereza negra, moras y especias para acompañar el frío.',mar:'Guisos, carnes rojas, comidas sustanciosas.'},
 champ:{line:'Champbrulé',name:'Brut',type:'Espumoso',price:216,img:'CHAMPBRULE_01.png',q:'Para brindar sin esperar demasiado, celebrar lo cotidiano y empezar cualquier momento con burbujas.',desc:'Un espumoso que convierte cualquier instante en una celebración: burbujas finas y constantes, aromas de manzana verde, frutas tropicales y un toque de pan recién horneado. Explosivo en boca, fresco y de acidez vibrante. Frescura que se celebra: burbujas finas, aromas de manzana verde y frutas tropicales. Perfecto para brindar y encender la alegría del momento.',mar:'Aperitivos, sushi, celebraciones.'},
 sbsb:{line:'Sierra Blanca',name:'Sauvignon Blanc',type:'Vino blanco',price:246,img:'SAUVIGNON_BLANC_01.png',medals:20,q:'Para días activos, tardes soleadas y momentos donde buscas frescura inmediata.',desc:'Un blanco que refresca el día: notas cítricas de lima, flores blancas y un fondo herbal que invitan a seguir bebiendo. Brillante y ligero, con el equilibrio perfecto entre acidez y suavidad. Fresco y vibrante: aromas de lima, flores y un toque herbal. Para disfrutar en cualquier momento.',mar:'Ensaladas, pescados, aperitivo al atardecer.'},
 cablac:{line:'L.A. Cetto',name:'Cabernet Sauvignon',type:'Vino tinto',price:201,img:'CABERNET-SAUVIGNON-01.png',q:'Para cuando quieres abrir un tinto confiable, con carácter, pero sin hacerlo demasiado formal.',desc:'Color rojo rubí con tonos violeta, limpio y brillante. Aromas florales, frutos rojos maduros y fondo de notas especiadas. Sus taninos son maduros y le otorgan suavidad que contrasta con su complejidad.',mar:'Carnes rojas al carbón, a la parrilla o al horno con cocción prolongada, algunos quesos maduros y/o ahumados.'},
 bdz:{line:'L.A. Cetto',name:'Blanc de Zinfandel',type:'Vino rosado',price:193,img:'BLANC_DE_ZINFANDEL_01.png',q:'Para quienes buscan un vino fresco, frutal y confiable, ideal para compartir en cualquier ocasión.',desc:'Color salmón claro, limpio y brillante. Aromas frutales como durazno, frambuesa, fresa y manzana. Sabor agradable, ligeramente dulce y frutal.',mar:'Se recomienda con platillos de cocina oriental (china, vietnamita, japonesa, etc.) con tendencia agridulce o ligeramente picante, cocteles de mariscos y postres a base de frutos rojos y tropicales.'},
 passito:{line:'Reserva Privada',name:'Passito',sub:'Vino de postre',type:'Vino de postre',price:751,img:'PASSITO_01.png',q:'',desc:'Moscatel del Valle de Guadalupe, de viñedos de 30 años, con fermentación lenta a temperatura controlada y ocho años en barrica francesa. Color oro viejo y brillante; aromas a flores, frutos secos, tejocote, acitrón, membrillo, pera y miel. En boca es frutal, untuoso y tostado. 17.5% de alcohol; sírvelo a 10 °C.',mar:'Foie gras, caviar, quesos azules y veteados. Acompaña el postre o puede sustituirlo'},
 sang:{line:'Boutique',name:'Sangiovese',type:'Vino tinto',price:921,img:'SANGIOVESE_01.png',q:'Para cenas con estilo, sobremesas ligeras y momentos donde buscas elegancia con frescura.',desc:'Color cereza tenue y brillante con ribete violeta con destellos ligeramente marrones en el ribete. Aromas a flores como rosas y violetas, frutos negros como grosella, frambuesa en compota, pasto fresco y terroso. De gran intensidad, elegante, muy expresivo, untuoso y complejo que va de lo frutal a lo especiado.',mar:'Acompaña varios platillos de la gastronomía italiana e internacional a base de tomate, quesos medios y pescados a la plancha. Acompaña también carnes magras a la parrilla o con acompañamientos a hongos o trufas.'},
 nebor:{line:'Uvas Orgánicas',name:'Nebbiolo',type:'Vino tinto',price:370,img:'NEBBIOLO-1_eec3d3ac-c3ca-4089-9e9d-46f7dcada2ab.jpg',q:'',desc:'Ingreso amable, amplio y envolvente. Presenta muy buena acidez, integrada a la frutalidad, taninos dulces y maduros, cuerpo amplio. Es un vino largo, de persistencia alta, con un retrogusto eminentemente frutal. Carnes magras, pastas con salsa de tomate, platillos mediterráneos, quesos frescos o de intensidad media y tacos de barbacoa.',mar:''},
 estrp:{line:'Estuche',name:'Reserva Privada',sub:'Nebbiolo y Petite Sirah',type:'Estuche',price:780,cmp:975,img:'RESERVA-PRIVADA-01.png',gift:true,q:'',desc:'Este elegante paquete reúne dos de los vinos más emblemáticos de nuestra línea Reserva Privada: Nebbiolo y Petite Sirah, acompañados de dos copas sin tallo de diseño contemporáneo. Es el regalo perfecto para los amantes del vino que buscan calidad, elegancia y autenticidad mexicana. Incluye una botella de Petite Sirah Reserva Privada de 750 ml, una de Nebbiolo Reserva Privada de 750 ml y dos copas sin tallo.',mar:''},
 estbou:{line:'Estuche',name:'Colección Boutique',type:'Estuche',price:3521,img:'BOUTIQUE_CASE_01.png',gift:true,q:'',desc:'Una colección que celebra nuestra historia. Cinco vinos excepcionales, reunidos en un elegante estuche que refleja siete generaciones de pasión y tradición vitivinícola. Un regalo distinguido para celebrar momentos especiales y compartir el legado de L.A. Cetto. Pinot Noir Boutique | Elegancia sutil y expresión vibrante. Fresco y equilibrado, de taninos finos y aromas a frutos rojos. Para esas conversaciones que comienzan con una copa y terminan convirtiéndose en recuerdos. Blanco Boutique | Elegante, complejo y lleno de carácter. Un ensamble de Chardonnay, Viognier y Pinot Noir, con delicadas notas florales y tropicales. Para sorprender, descubrir nuevos sabores y celebrar lo inesperado. Malbec Boutique | Profundidad y estructura. Un tinto intenso y envolvente, con notas de frutos maduros y especias. Para acompañar las grandes decisiones y brindar por los logros que merecen reconocerse. Sangiovese Boutique | Un homenaje a la Toscana con alma mexicana. Expresivo y elegante, con aromas florales y matices especiados. Para las sobremesas interminables, las risas espontáneas y el placer de compartir. Syrah Boutique | Fuerza y elegancia del Ródano en Baja California. De gran carácter, con aromas de frutos negros y notas especiadas. Para quienes disfrutan de los sabores intensos y las experiencias que dejan huella.',mar:''}
};
/* Catálogo completo (64 productos) generado del products.json público de lacetto.mx */
Object.assign(P,{"dlmer":{"line":"Don Luis","name":"Merlot","type":"Vino tinto","price":335,"img":"MERLOT_01.png","q":"Para una cena elegante, cálida y sin pretensiones, donde todo fluye con naturalidad.","desc":"Un Merlot sofisticado: aromas de zarzamora, cereza y ciruela con un fondo especiado que realza su elegancia. De taninos suaves y gran balance. Sedoso y aromático: zarzamora, cereza y un toque especiado. Un clásico refinado.","mar":"Pastas, carnes al horno, quesos semimaduros.","c":"tinto","ml":750,"u":"Merlot"},"bsyr":{"line":"Boutique","name":"Syrah","type":"Vino tinto","price":751,"img":"SYRAH_01.png","q":"Para una noche con carácter, una mesa especial y momentos que piden un vino memorable.","desc":"Color rojo cereza con ribete de tonalidades violáceas. Aromas a flores y frutos negros maduros como mora, zarzamora y frambuesa y ligeramente compotados. Se perciben notas lácticas y ligeramente ahumadas. En boca se percibe intenso, untuoso, se confirman los frutos maduros, las notas especiadas, destacando la canela y la pimienta, sumamente amable y complejo.","mar":"Ideal para acompañar pastas con quesos ahumados o veteados, carnes de caza grande y pequeña, embutidos condimentados, y comidas con sabores intensos.","c":"tinto","ml":750,"u":"Syrah"},"bmal":{"line":"Boutique","name":"Malbec","type":"Vino tinto","price":617,"img":"MALBEC_01.png","q":"Para una noche especial, una conversación sin prisa y una copa que deja huella.","desc":"Color rojo cereza de gran brillantez y ribete violeta. Aromas a flores y frutas maduras, destacando la ciruela y cereza, con recuerdos a especias y ahumados; se perciben notas a cuero y a arcilla. Notas de fruta en compota, balsámico, tabaco, chocolate, canela y cuero. Se confirma la crianza con delicados recuerdos especiados; de taninos suaves.","mar":"Acompaña bien carnes rojas, quesos maduros, pastas con salsa de tomate, carne y verduras a la parrilla. Este Malbec es un vino tinto complejo y estructurado con una amplia gama de sabores.","c":"tinto","ml":750,"u":"Malbec"},"bpin":{"line":"Boutique","name":"Pinot Noir","type":"Vino tinto","price":751,"img":"PINOT_NOIR_01.png","q":"Para cenas íntimas, momentos delicados y ocasiones donde la elegancia no necesita imponerse.","desc":"Color rubí con tonos violáceos de mediana intensidad, brillante y con presencia atractiva. Aromas elegantes que recuerdan a frutos rojos frescos y maduros, con notas a grosella y ligeras notas a especias. Fresco, balanceado y con taninos finos y pulidos. Amplio en paladar con un retrogusto elegante.","mar":"Ideal para acompañar platillos de salseos medios, algunos rostizados de carnes blancas y rojas. También es perfecto para degustar en compañía de quesos semimaduros. Este Pinot Noir promete una experiencia sensorial refinada y versátil","c":"tinto","ml":750,"u":"Pinot Noir"},"bbla":{"line":"Boutique","name":"Blanco","type":"Ensamble","price":481,"img":"BLANCO_BOUTIQUE_01.png","q":"Para una ocasión especial donde quieres sorprender con un blanco serio, elegante y distinto.","desc":"Transparente, muy brillante y cristalino de un amarillo verdoso con tonalidades doradas. Complejo, con aromas a flores blancas, cítricos, guanábana, lichi, pera y frutos secos: notas a mantequilla, tostados y ligeramente ahumados. Intenso, complejo, untuoso, destaca las flores y fruta tropical, al fondo suaves tostados, de gran final.","mar":"Ideal para acompañar pescados y mariscos especiados, o una tabla de quesos con fruta. Un vino blanco diverso y elegante con una mezcla única de variedades.","c":"blanco","ml":750,"u":"Chardonnay, Pinot Noir, Viognier","sub":"Chardonnay, Pinot Noir y Viognier"},"plyra":{"line":"Península","name":"Lyra","type":"Ensamble","price":307,"img":"LYRA_01.png","q":"Para una copa que conecta la tradición italiana con una expresión fresca, moderna y profundamente mexicana.","desc":"Un vino que combina Montepulciano y Barbera: aromas de frutos rojos maduros, notas especiadas y sutiles recuerdos de humo y tostado. Frutal y especiado: un ensamble italiano con personalidad única.","mar":"Pizzas, pastas con ragú, quesos curados.","c":"tinto","ml":750,"u":"Barbera, Montepulciano","sub":"Montepulciano y Barbera"},"pesp":{"line":"Península","name":"Espaldera","type":"Ensamble","price":307,"img":"ESPALDERA_01.png","q":"Para cuando quieres descubrir algo distinto, con raíces italianas y carácter bajacaliforniano.","desc":"Un ensamble que une lo mejor del Sangiovese y el Aglianico: frutos rojos y negros maduros, frutos secos y un fondo terroso que le da carácter. Complejo y elegante: frutos rojos, frutos secos y un toque terroso.","mar":"Cocina italiana, carnes a la parrilla, platillos especiados.","c":"tinto","ml":750,"u":"Aglianico, Sangiovese","sub":"Aglianico y Sangiovese"},"sbtemp":{"line":"Sierra Blanca","name":"Tempranillo","type":"Vino tinto","price":246,"img":"TEMPRANILLO_01.png","q":"Para planes relajados, pláticas largas y momentos donde se antoja un tinto sin demasiada ceremonia.","desc":"Un vino que invita a relajarse: aromas de cereza, frambuesa y especias, con sutiles recuerdos de dátil y pan tostado. Suave al paladar, de taninos redondos y un cuerpo equilibrado. Un tinto amigable y expresivo: frutos rojos, especias y un toque de pan tostado. Perfecto para cualquier ocasión.","mar":"Tapas, pizzas, carnes blancas.","c":"tinto","ml":750,"u":"Tempranillo"},"sbcab":{"line":"Sierra Blanca","name":"Cabernet Sauvignon","type":"Vino tinto","price":246,"img":"CABERNET_SAUVIGNON_01_65843095-d87e-4277-9d65-93225a51e4b0.png","q":"Para cuando quieres un tinto práctico, expresivo y fácil de llevar a cualquier reunión.","desc":"Un Cabernet pensado para disfrutarse sin complicaciones: aromas de grosella, frambuesa y ligeras notas herbáceas, envueltos en taninos maduros. Fresco y equilibrado. Frutos rojos y grosella con un toque herbal. Fresco y redondo, ideal para compartir.","mar":"Carnes a la parrilla, pastas, quesos.","c":"tinto","ml":750,"u":"Cabernet Sauvignon"},"sbzin":{"line":"Sierra Blanca","name":"Zinfandel Rosé","type":"Vino rosado","price":246,"img":"ZINFANDEL_ROSE_01.png","q":"Para una tarde relajada, una reunión casual y momentos espontáneos entre amigos.","desc":"Un rosado que atrapa: aromas de frutos rojos recién cortados y pétalos de rosa, con un toque mineral que realza su frescura. Ligeramente abocado. Ligero y romántico: fresas, pétalos de rosa y frescura que conquista.","mar":"Ensaladas, pastas ligeras, días soleados.","c":"rosado","ml":750,"u":"Zinfandel"},"lazin":{"line":"L.A. Cetto","name":"Zinfandel","type":"Vino tinto","price":201,"img":"ZINFANDEL_01.png","q":"Para noches relajadas, conversaciones largas y una copa frutal que se disfruta sin prisa.","desc":"Rojo violeta, limpio y brillante. Aromas de frutos rojos y negros, con un recuerdo especiado. En paladar es amable, de taninos suaves, con gran carga frutal, muy agradable en boca.","mar":"Cortes grasos de res a la parrilla o al horno","c":"tinto","ml":750,"u":"Zinfandel"},"latemp":{"line":"L.A. Cetto","name":"Tempranillo","type":"Vino tinto","price":201,"img":"TEMPRANILLO_01_65035f93-3140-4406-9e6a-d8ca180a364e.png","q":"Para reuniones animadas, mesas compartidas y momentos donde se busca un tinto versátil y expresivo.","desc":"Limpio, brillante, rojo cereza intenso con matices púrpura y ribete violáceo, capa aparente media. Marcado carácter frutal a cereza, frutos rojos, notas florales en las que destaca la jamaica con algunas notas compotadas. Cuerpo estructurado, taninos firmes, sensación carnosa en boca, final largo y amable.","mar":"Tacos de carne asada, mixiote, pizza margarita o carnes frías, costillas BBQ.","c":"tinto","ml":750,"u":"Tempranillo"},"lamer":{"line":"L.A. Cetto","name":"Merlot","type":"Vino tinto","price":201,"img":"MERLOT-01.png","q":"Para reuniones relajadas, noches tranquilas y momentos donde buscas un tinto suave y fácil de compartir.","desc":"Color rojo violeta limpio y brillante. Aromas de frutos rojos frescos, destacando frambuesa y grosella. Sensación agradable al paladar, frutal, de taninos firmes pero amables.","mar":"Quesos suaves, pizzas a la leña o al horno y carnes magras asadas, embutidos como chorizo estilo argentino o chorizo asado.","c":"tinto","ml":750,"u":"Merlot"},"lafume":{"line":"L.A. Cetto","name":"Fumé Blanc","type":"Vino blanco","price":193,"img":"FUME_BLANC_01.png","q":"Para abrir una reunión con una copa fresca, viva y fácil de disfrutar.","desc":"Amarillo paja con destellos verdes. Agradables aromas de toronja, maracuyá y recuerdo de notas herbáceas. Firme acidez de gran frescura, floral y frutal con notas cítricas destacando la toronja y lima.","mar":"Muy agradable como aperitivo y acompaña muy bien con carnes blancas a la parrilla, pescados y mariscos con toques herbáceos y cítricos.","c":"blanco","ml":750,"u":"Sauvignon Blanc"},"lachar":{"line":"L.A. Cetto","name":"Chardonnay","type":"Vino blanco","price":193,"img":"CHARDONNAY-01_7df1fd23-343b-4389-9bd5-1b8f986d8e5d.png","q":"Para una comida tranquila, una tarde luminosa o cuando buscas un blanco con un poco más de presencia.","desc":"Color amarillo verdoso, cristalino y brillante. Aromas con recuerdos de manzanilla, cítricos, manzana verde, membrillo y ligero toque de mantequilla. Vino seco y frutal con fina y fresca acidez, confirma la frutalidad con un agradable final en boca.","mar":"Acompaña muy bien con mariscos, ceviches, pescados y aves con salseo a base de cítricos o frutales.","c":"blanco","ml":750,"u":"Chardonnay"},"labdb":{"line":"L.A. Cetto","name":"Blanc de Blancs","type":"Vino blanco","price":193,"img":"BLANC_DE_BLANCS-01_75254b11-a1f4-4ddf-8a38-778daa23604b.png","q":"Para esos días en los que quieres algo fresco, ligero y fácil de disfrutar desde la primera copa.","desc":"Vino blanco de color amarillo paja, limpio y brillante. Frescos aromas a frutos tropicales como piña, lima y cáscara de naranja. Se percibe sutil, de agradable dulzor y fresca acidez.","mar":"Acompaña platillos a base de aves, pescados o mariscos con salsas de frutas tropicales, cítricos y platillos ligeramente picantes.","c":"blanco","ml":750,"u":"Chenin Blanc, Colombard"},"ormal":{"line":"Uvas Orgánicas","name":"Malbec","type":"Vino tinto","price":370,"img":"MALBEC-1_3106b016-8845-4e93-9847-a24d797a5a62.jpg","q":"","desc":"Ataque amplio, fresco y seco. Su acidez es vibrante y mantiene un buen balance con el alcohol y los taninos presentes, secantes y maduros. De cuerpo medio-alto, boca media y persistente, con permanencia de sabores especiados y notas mentoladas.","mar":"Carnes rojas, charcutería, quesos semimaduros, tacos de sirloin, hamburguesas y verduras asadas.","c":"tinto","ml":750,"u":"Malbec"},"orens":{"line":"Uvas Orgánicas","name":"Ensamble","type":"Ensamble","price":370,"img":"ENSAMBLE-1_2ea9eb95-02e4-4183-8565-9e3bdc172911.jpg","q":"","desc":"Ingreso muy amable que crece en el paladar. Su acidez elevada aporta frescura; presenta alcohol medio-alto, taninos amables y progresivos, astringencia media y cuerpo medio. El final conserva el tono especiado y la acidez, con persistencia media.","mar":"Pizzas, baguettes, risotto con trufa, vegetales asados, milanesa de pollo, albóndigas y ensaladas mediterráneas.","c":"tinto","ml":750,"u":"Aglianico, Montepulciano, Sangiovese","sub":"Aglianico, Montepulciano y Sangiovese"},"ormez":{"line":"Uvas Orgánicas","name":"Mezcla Bordelesa","type":"Ensamble","price":370,"img":"MEZCLA-1_258302fe-b47d-4b3b-8b35-739c072d3bd1.jpg","q":"","desc":"Pleno en boca, goloso y de muy buena estructura. Presenta excelente acidez, media y agradable, en sintonía con la estructura; alcohol medio, cálido y bien ensamblado. El tanino está presente y aparece en la evolución de sabores junto con la acidez, la astringencia y la frutalidad. De cuerpo medio-alto y final medio a largo, en el que permanecen la fruta y las especias.","mar":"Carnes de res, cerdo, cordero sin grasa y aves; quesos blandos y semimaduros; frutos secos, tablas de quesos, guisados mexicanos, arrachera y sopa de cebolla o queso.","c":"tinto","ml":750,"u":"Cabernet Sauvignon, Malbec, Merlot","sub":"Cabernet Sauvignon, Malbec y Merlot"},"mospal":{"line":"Reserva Privada","name":"Moscatel y Palomino","type":"Vino de postre","price":314,"img":"MOSCATEL_PALOMINO_01.png","q":"","desc":"Vino tipo oporto de Moscatel y Palomino, de viñedos de más de 40 años en San Antonio de las Minas. Fermentado y encabezado, con 24 meses en tonel francés. Color amarillo intenso con destellos dorados y aromas a frutos secos y escarchados. 16.5% de alcohol; sírvelo a 8 °C.","mar":"Acompaña al postre o lo sustituye","c":"postre","ml":750,"u":"Moscatel y Palomino","sub":"Vino de postre"},"grappa":{"line":"Destilados","name":"Grappa","type":"Destilado","price":616,"img":"GRAPPA_01.png","q":"","desc":"Aguardiente de orujo de Cabernet Sauvignon del Valle de Guadalupe, de viñedos de 30 años, con doble destilación. Transparente, brillante y cristalina; aromas cítricos, a pera y notas florales. En boca es suave y frutal. 38% de alcohol; sírvela a 12 °C.","mar":"Como aperitivo o digestivo","c":"destilado","ml":750,"u":"Cabernet Sauvignon","sub":"Destilado de uva","nb":1},"terra375":{"line":"Don Luis","name":"Terra","type":"Ensamble","price":240,"img":"TERRA-357_07a9b907-5f13-44f9-b427-9fafbfde1a54.jpg","q":"Para una cena importante, de ritmo pausado, donde cada copa acompaña la conversación.","desc":"Un ensamble elegante que combina Cabernet Sauvignon, Merlot, Petit Verdot y Malbec: aromas de frutos negros, violetas y especias, con sutiles notas de tabaco y cuero. Complejo y profundo: frutos negros, violetas y notas de tabaco en un ensamble sofisticado.","mar":"Carnes asadas, estofados, quesos maduros.","c":"tinto","ml":375,"u":"Cabernet Sauvignon, Malbec, Merlot, Petit Verdot","sub":"375 ml","nb":1},"cabrp375":{"line":"Reserva Privada","name":"Cabernet Sauvignon","type":"Vino tinto","price":248,"img":"CABERNET-SAUVIGNON-357_6e8c9b5e-7ad5-43d9-8596-c06edb1cd886.jpg","q":"Para cenas con intención, noches pausadas y ocasiones donde buscas un tinto con estructura.","desc":"Un Cabernet con presencia: grosella negra, violetas, notas de cuero y especias, envueltos en sutiles recuerdos de humo y vainilla. De taninos maduros y final prolongado. Profundo y elegante: grosella negra, violetas y un toque de humo. Un vino para momentos memorables.","mar":"Cortes finos, cordero, platos complejos.","c":"tinto","ml":375,"u":"Cabernet Sauvignon","sub":"375 ml","nb":1},"fume375":{"line":"L.A. Cetto","name":"Fumé Blanc","type":"Vino blanco","price":107,"img":"FUME_BLANC_357_cac0e395-ff61-418b-b4a0-885ba928e87c.png","q":"Para abrir una reunión con una copa fresca, viva y fácil de disfrutar.","desc":"Amarillo paja con destellos verdes. Agradables aromas de toronja, maracuyá y recuerdo de notas herbáceas. Firme acidez de gran frescura, floral y frutal con notas cítricas destacando la toronja y lima.","mar":"Muy agradable como aperitivo y acompaña muy bien con carnes blancas a la parrilla, pescados y mariscos con toques herbáceos y cítricos.","c":"blanco","ml":375,"u":"Sauvignon Blanc","sub":"375 ml","nb":1},"cab375":{"line":"L.A. Cetto","name":"Cabernet Sauvignon","type":"Vino tinto","price":107,"img":"CABERNET-SAUVIGNON-357_de834460-67b5-42aa-a779-ef01af0a60d8.png","q":"Para cuando quieres abrir un tinto confiable, con carácter, pero sin hacerlo demasiado formal.","desc":"Color rojo rubí con tonos violeta, limpio y brillante. Aromas florales, frutos rojos maduros y fondo de notas especiadas. Sus taninos son maduros y le otorgan suavidad que contrasta con su complejidad.","mar":"Carnes rojas al carbón, a la parrilla o al horno con cocción prolongada, algunos quesos maduros y/o ahumados.","c":"tinto","ml":375,"u":"Cabernet Sauvignon","sub":"375 ml","nb":1,"out":1},"bdb187":{"line":"L.A. Cetto","name":"Blanc de Blancs","type":"Vino blanco","price":60,"img":"BLANC-DE-BLANCS-187_27050317-7acc-4769-acba-06f0e5141e07.jpg","q":"Para esos días en los que quieres algo fresco, ligero y fácil de disfrutar desde la primera copa.","desc":"Vino blanco de color amarillo paja, limpio y brillante. Frescos aromas a frutos tropicales como piña, lima y cáscara de naranja. Se percibe sutil, de agradable dulzor y fresca acidez.","mar":"Acompaña platillos a base de aves, pescados o mariscos con salsas de frutas tropicales, cítricos y platillos ligeramente picantes.","c":"blanco","ml":187,"u":"Chenin Blanc, Colombard","sub":"187 ml","nb":1},"bdz187":{"line":"L.A. Cetto","name":"Blanc de Zinfandel","type":"Vino rosado","price":60,"img":"BLANC-DE-ZINFANDEL-187_f469dcc1-3db8-4d52-8d9c-4bd220071749.jpg","q":"Para quienes buscan un vino fresco, frutal y confiable, ideal para compartir en cualquier ocasión.","desc":"Color salmón claro, limpio y brillante. Aromas frutales como durazno, frambuesa, fresa y manzana. Sabor agradable, ligeramente dulce y frutal.","mar":"Se recomienda con platillos de cocina oriental (china, vietnamita, japonesa, etc.) con tendencia agridulce o ligeramente picante, cocteles de mariscos y postres a base de frutos rojos y tropicales","c":"rosado","ml":187,"u":"Zinfandel","sub":"187 ml","nb":1},"ps187":{"line":"L.A. Cetto","name":"Petite Sirah","type":"Vino tinto","price":60,"img":"PETITE-SIRAH-187_8d8d2de2-8ae9-479d-9e50-c04e984e102c.jpg","q":"Para cuando quieres abrir un tinto confiable, con carácter, pero sin hacerlo demasiado formal.","desc":"Rojo ciruela de gran intensidad, limpio, brillante y con ribete violeta. De gran intensidad aromática de frutos rojos y toque herbal. Muy agradable al paladar, intenso, frutal, complejo y equilibrado.","mar":"Cortes de res a la parrilla u horno, grasos y especiados, y acompañamientos a base de hongos o frutos rojos y negros.","c":"tinto","ml":187,"u":"Petite Sirah","sub":"187 ml","nb":1},"cab187":{"line":"L.A. Cetto","name":"Cabernet Sauvignon","type":"Vino tinto","price":60,"img":"CABERNET-SAUVIGNON-187_685c876e-7326-4407-9f4b-bdd876c6486b.jpg","q":"Para cuando quieres abrir un tinto confiable, con carácter, pero sin hacerlo demasiado formal.","desc":"Color rojo rubí con tonos violeta, limpio y brillante. Aromas florales, frutos rojos maduros y fondo de notas especiadas. Sus taninos son maduros y le otorgan suavidad que contrasta con su complejidad.","mar":"Carnes rojas al carbón, a la parrilla o al horno con cocción prolongada, algunos quesos maduros y/o ahumados.","c":"tinto","ml":187,"u":"Cabernet Sauvignon","sub":"187 ml","nb":1},"ac750":{"line":"Gourmet","name":"Aceite de Oliva Extra Virgen","type":"Aceite de oliva","price":285,"img":"Mesadetrabajo31-100.jpg","q":"","desc":"En L.A. Cetto, la experiencia gastronómica va más allá de la copa de vino. Nuestro Aceite de Oliva complementa la mesa con un ingrediente versátil para aderezar ensaladas, acompañar panes, vegetales y pastas, y preparar distintas recetas. Una propuesta para quienes disfrutan nuestros vinos y buscan extender esa misma experiencia de compartir a la cocina cotidiana. Aceite de oliva para distintas preparaciones culinarias.","mar":"","c":"gourmet","ml":750,"u":"","sub":"750 ml","nb":1},"ac15":{"line":"Gourmet","name":"Aceite de Oliva Extra Virgen","type":"Aceite de oliva","price":520,"img":"Mesadetrabajo26-100.jpg","q":"","desc":"En L.A. Cetto, la experiencia gastronómica va más allá de la copa de vino. Nuestro Aceite de Oliva complementa la mesa con un ingrediente versátil para aderezar ensaladas, acompañar panes, vegetales y pastas, y preparar distintas recetas. Una propuesta para quienes disfrutan nuestros vinos y buscan extender esa misma experiencia de compartir a la cocina cotidiana. Aceite de oliva para distintas preparaciones culinarias.","mar":"","c":"gourmet","ml":1500,"u":"","sub":"1.5 L","nb":1},"ac250":{"line":"Gourmet","name":"Aceite de Oliva Extra Virgen","type":"Aceite de oliva","price":105,"img":"Mesadetrabajo36-100.jpg","q":"","desc":"En L.A. Cetto, la experiencia gastronómica va más allá de la copa de vino. Nuestro Aceite de Oliva complementa la mesa con un ingrediente versátil para aderezar ensaladas, acompañar panes, vegetales y pastas, y preparar distintas recetas. Una propuesta para quienes disfrutan nuestros vinos y buscan extender esa misma experiencia de compartir a la cocina cotidiana. Aceite de oliva para distintas preparaciones culinarias.","mar":"","c":"gourmet","ml":250,"u":"","sub":"250 ml","nb":1},"ac4l":{"line":"Gourmet","name":"Aceite de Oliva Extra Virgen","type":"Aceite de oliva","price":1200,"img":"Mesadetrabajo21-100.jpg","q":"","desc":"En L.A. Cetto, la experiencia gastronómica va más allá de la copa de vino. Nuestro Aceite de Oliva complementa la mesa con un ingrediente versátil para aderezar ensaladas, acompañar panes, vegetales y pastas, y preparar distintas recetas. Una propuesta para quienes disfrutan nuestros vinos y buscan extender esa misma experiencia de compartir a la cocina cotidiana.","mar":"","c":"gourmet","ml":4000,"u":"","sub":"4 L","nb":1},"ac5l":{"line":"Gourmet","name":"Aceite de Oliva Extra Virgen","type":"Aceite de oliva","price":1370,"img":"Mesadetrabajo16-100.jpg","q":"","desc":"En L.A. Cetto, la experiencia gastronómica va más allá de la copa de vino. Nuestro Aceite de Oliva complementa la mesa con un ingrediente versátil para aderezar ensaladas, acompañar panes, vegetales y pastas, y preparar distintas recetas. Una propuesta para quienes disfrutan nuestros vinos y buscan extender esa misma experiencia de compartir a la cocina cotidiana.","mar":"","c":"gourmet","ml":5000,"u":"","sub":"5 L","nb":1},"bal750":{"line":"Gourmet","name":"Vinagre Balsámico","type":"Vinagre","price":225,"img":"Mesadetrabajo63-100.jpg","q":"","desc":"La afinidad de L.A. Cetto con la uva y el vino también encuentra un lugar en la cocina. El Vinagre Balsámico L.A. Cetto combina vinagre de vino y mosto de uva concentrado para ofrecer un perfil que equilibra notas dulces y ácidas. Aporta profundidad a ensaladas, vegetales, quesos y carnes, y es ideal para crear aderezos, marinados y reducciones. Elaborado con vinagre de vino y mosto de uva concentrado.","mar":"","c":"gourmet","ml":750,"u":"","sub":"750 ml","nb":1},"bal250":{"line":"Gourmet","name":"Vinagre Balsámico","type":"Vinagre","price":85,"img":"Mesadetrabajo68-100.jpg","q":"","desc":"La afinidad de L.A. Cetto con la uva y el vino también encuentra un lugar en la cocina. El Vinagre Balsámico L.A. Cetto combina vinagre de vino y mosto de uva concentrado para ofrecer un perfil que equilibra notas dulces y ácidas. Aporta profundidad a ensaladas, vegetales, quesos y carnes, y es ideal para crear aderezos, marinados y reducciones. Elaborado con vinagre de vino y mosto de uva concentrado.","mar":"","c":"gourmet","ml":250,"u":"","sub":"250 ml","nb":1},"bal5l":{"line":"Gourmet","name":"Vinagre Balsámico","type":"Vinagre","price":1175,"img":"Mesadetrabajo58-100.jpg","q":"","desc":"La afinidad de L.A. Cetto con la uva y el vino también encuentra un lugar en la cocina. El Vinagre Balsámico L.A. Cetto combina vinagre de vino y mosto de uva concentrado para ofrecer un perfil que equilibra notas dulces y ácidas. Aporta profundidad a ensaladas, vegetales, quesos y carnes, y es ideal para crear aderezos, marinados y reducciones. Elaborado con vinagre de vino y mosto de uva concentrado.","mar":"","c":"gourmet","ml":5000,"u":"","sub":"5 L","nb":1},"vin750":{"line":"Gourmet","name":"Vinagre de Vino Tinto","type":"Vinagre","price":195,"img":"Mesadetrabajo47-100.jpg","q":"","desc":"De la cultura del vino a los ingredientes de la cocina: el Vinagre de Vino Tinto L.A. Cetto es una forma natural de extender nuestra relación con la gastronomía. Su acidez equilibrada y perfil fresco ayudan a realzar los sabores de ensaladas, vegetales y otras preparaciones. Una elección versátil para vinagretas, aderezos y marinados de uso cotidiano. Vinagre de vino tinto para uso culinario.","mar":"","c":"gourmet","ml":750,"u":"","sub":"750 ml","nb":1},"vin250":{"line":"Gourmet","name":"Vinagre de Vino Tinto","type":"Vinagre","price":70,"img":"Mesadetrabajo53-100.jpg","q":"","desc":"De la cultura del vino a los ingredientes de la cocina: el Vinagre de Vino Tinto L.A. Cetto es una forma natural de extender nuestra relación con la gastronomía. Su acidez equilibrada y perfil fresco ayudan a realzar los sabores de ensaladas, vegetales y otras preparaciones. Una elección versátil para vinagretas, aderezos y marinados de uso cotidiano. Vinagre de vino tinto para uso culinario.","mar":"","c":"gourmet","ml":250,"u":"","sub":"250 ml","nb":1},"vin5l":{"line":"Gourmet","name":"Vinagre de Vino Tinto","type":"Vinagre","price":1015,"img":"Mesa_de_trabajo_41-100.jpg","q":"","desc":"De la cultura del vino a los ingredientes de la cocina: el Vinagre de Vino Tinto L.A. Cetto es una forma natural de extender nuestra relación con la gastronomía. Su acidez equilibrada y perfil fresco ayudan a realzar los sabores de ensaladas, vegetales y otras preparaciones. Una elección versátil para vinagretas, aderezos y marinados de uso cotidiano.","mar":"","c":"gourmet","ml":5000,"u":"","sub":"5 L","nb":1},"acsev":{"line":"Gourmet","name":"Aceitunas Sevillanas","type":"Aceitunas","price":95,"img":"Mesadetrabajo11-100.jpg","q":"","desc":"Un buen aperitivo es parte de la experiencia alrededor de la mesa. Las Aceitunas Sevillanas L.A. Cetto se distinguen por su textura firme y sabor equilibrado, ideales para disfrutar antes de una comida o acompañar tablas de quesos, carnes frías y tapas. Una opción clásica para compartir y complementar los momentos gastronómicos que acompañan a nuestros vinos. Aceitunas verdes estilo sevillano, con hueso.","mar":"","c":"gourmet","ml":500,"u":"","sub":"Con hueso, 500 g","nb":1},"acman":{"line":"Gourmet","name":"Aceitunas Manzanilla Misión","type":"Aceitunas","price":80,"img":"Mesadetrabajo6-100.jpg","q":"","desc":"Las Aceitunas Manzanilla Misión L.A. Cetto destacan por su textura carnosa y su versatilidad en la cocina. Pueden disfrutarse directamente como botana o incorporarse a ensaladas, pizzas y recetas de inspiración mediterránea. Una alternativa práctica para llevar a la mesa, todos los días, los sabores que complementan la propuesta gastronómica de L.A. Cetto. Aceitunas verdes encurtidas, con hueso.","mar":"","c":"gourmet","ml":500,"u":"","sub":"Con hueso, 500 g","nb":1}});
Object.entries({"nebrp":{"c":"tinto","ml":750,"u":"Nebbiolo"},"pslac":{"c":"tinto","ml":750,"u":"Petite Sirah"},"cabrp":{"c":"tinto","ml":750,"u":"Cabernet Sauvignon"},"charp":{"c":"blanco","ml":750,"u":"Chardonnay"},"chenin":{"c":"blanco","ml":750,"u":"Chenin Blanc"},"viog":{"c":"blanco","ml":750,"u":"Viognier"},"psrp":{"c":"tinto","ml":750,"u":"Petite Sirah"},"terra":{"c":"tinto","ml":750,"u":"Cabernet Sauvignon, Merlot, Petit Verdot, Malbec"},"conc":{"c":"tinto","ml":750,"u":"Cabernet Sauvignon, Shiraz"},"prim":{"c":"rosado","ml":750,"u":"Cabernet Sauvignon"},"ver":{"c":"blanco","ml":750,"u":"Colombard, Sauvignon Blanc"},"oto":{"c":"tinto","ml":750,"u":"Gamay"},"inv":{"c":"tinto","ml":750,"u":"Petit Verdot"},"champ":{"c":"espumoso","ml":750,"u":"Chenin Blanc, Colombard"},"sbsb":{"c":"blanco","ml":750,"u":"Sauvignon Blanc"},"cablac":{"c":"tinto","ml":750,"u":"Cabernet Sauvignon"},"bdz":{"c":"rosado","ml":750,"u":"Zinfandel"},"passito":{"c":"postre","ml":750,"u":"Moscatel"},"sang":{"c":"tinto","ml":750,"u":"Sangiovese"},"nebor":{"c":"tinto","ml":750,"u":"Nebbiolo"},"estrp":{"c":"estuche","ml":750,"u":""},"estbou":{"c":"estuche","ml":750,"u":""}}).forEach(([k,v])=>Object.assign(P[k],v));
const isWine=id=>!P[id].gift&&!P[id].nb;

/* ---------- Reglas de compra: una sola fuente para carrito, pago, cuenta y ayuda ----------
   Reales (lacetto.mx): envío gratis desde $799 · 10% en caja de 6 botellas de 750 ml · 1 a 2 días hábiles de preparación + 3 a 7 de envío.
   Propuesta: envío de $149 debajo de $799 · recoger en boutique sin costo · precio de socio 5% con sesión iniciada · tarjetas de regalo. */
const SHIP=149,MEMBER=.05,GIFT_MAX=180;
const isMember=()=>!!user();
const memberPrice=n=>Math.round(n*(1-MEMBER));
/* Calificaciones reales de clientes (Judge.me en lacetto.mx, nov 2026): [promedio, reseñas]. Solo se muestran donde la tienda las publica. */
window.RAT={nebrp:[4.7,3],champ:[4.0,4],bdz:[5.0,1]};
/* Tarjetas de regalo: se agregan al carrito como producto (gc500, gc1000…) */
function gcId(v){v=Math.round(+v);const id='gc'+v;if(!P[id])P[id]={line:'Tarjeta de regalo',name:'Tarjeta de regalo '+money(v),type:'Tarjeta de regalo',price:v,img:'media/tarjeta-regalo.svg',gift:true,nb:true,gc:true,c:'tarjeta'};return id}
[500,1000,1500,2000,3000].forEach(gcId);
/* Texto de precio bajo la tarjeta de producto */
function priceNote(id){const p=P[id];if(p.gc)return '';if(isMember())return 'Precio de socio '+money(memberPrice(p.price));return isWine(id)?money(p.price*.9)+' en caja de 6':(p.nb&&p.ml&&p.ml<750&&!p.gift?'No cuenta para la caja de 6':'')}
/* Fechas de entrega en días hábiles */
const DOW=['dom','lun','mar','mié','jue','vie','sáb'],MON=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const fmtD=d=>DOW[d.getDay()]+' '+d.getDate()+' '+MON[d.getMonth()];
function addBiz(d,n){d=new Date(d);while(n>0){d.setDate(d.getDate()+1);const w=d.getDay();if(w>0&&w<6)n--}return d}
function eta(mode,from){from=from?new Date(from):new Date();
  if(mode==='boutique'){const a=addBiz(from,1),b=addBiz(from,2);return {from:a,to:b,txt:'Lista para recoger entre el '+fmtD(a)+' y el '+fmtD(b),short:fmtD(a)+' a '+fmtD(b)}}
  const a=addBiz(from,4),b=addBiz(from,9);return {from:a,to:b,txt:'Llega entre el '+fmtD(a)+' y el '+fmtD(b),short:fmtD(a)+' a '+fmtD(b)}}
/* Regalo (para, de, mensaje): se guarda con el carrito y lo usa el pago */
const giftGet=()=>store.get('cettoGift',null);
function giftSet(g){if(!g||!((g.msg||'').trim()||(g.to||'').trim()))return store.del('cettoGift');store.set('cettoGift',{to:String(g.to||'').slice(0,40),from:String(g.from||'').slice(0,40),msg:String(g.msg||'').slice(0,GIFT_MAX)})}

/* ---------- Búsqueda compartida (encabezado y tienda) ---------- */
const STOPW=new Set('para con de del la el los las un una unos unas y o en al a que mi tu por algo vino vinos'.split(' '));
const SYN={botellin:['botellin','375 ml','187 ml'],botellines:['botellin','375 ml','187 ml'],mini:['187 ml','375 ml'],regalo:['regalo','estuche'],regalar:['regalo','estuche'],estuches:['estuche'],champagne:['espumoso','brut'],champan:['espumoso','brut'],champana:['espumoso','brut'],burbujas:['espumoso'],cava:['espumoso'],mole:['mole','mexican'],tacos:['mexican','taco'],mexicana:['mexican'],mexicano:['mexican'],carne:['carne','cordero','cortes','asado','parrilla','barbacoa','borrego','ribeye'],pescado:['pescado','marisco','mariscos'],mariscos:['marisco','pescado'],queso:['queso','quesos'],postre:['postre','dulce'],dulce:['dulce','postre'],organico:['organic'],organicos:['organic'],tinto:['__c:tinto'],tintos:['__c:tinto'],blanco:['__c:blanco'],blancos:['__c:blanco'],rosado:['__c:rosado'],rosados:['__c:rosado'],espumoso:['__c:espumoso','espumoso'],aceite:['aceite'],barato:['__barato'],economico:['__barato']};
let _hay=null;
function hay(){if(_hay)return _hay;_hay={};Object.keys(P).forEach(id=>{const p=P[id];if(p.gc)return;
  const extra=[p.ml&&p.ml<750?'botellin '+p.ml+' ml':'',p.gift?'regalo estuche':'',p.c==='espumoso'?'espumoso':''].join(' ');
  const name=nrm([p.line,p.name,p.sub].join(' ')),all=nrm([p.line,p.name,p.sub,p.type,p.u,p.c,p.mar,p.desc,p.q,extra].join(' '));
  _hay[id]={name,all,nt:name.split(/[^a-z0-9ñ]+/).filter(Boolean),at:all.split(/[^a-z0-9ñ]+/).filter(Boolean)}});return _hay}
/* Coincidencia por palabra: frases exactas, palabras cortas completas y prefijos en las largas */
const tokHit=(toks,str,a)=>a.includes(' ')?str.includes(a):a.length<=3?toks.includes(a):toks.some(t=>t.startsWith(a));
function lev1(a,b,max){if(Math.abs(a.length-b.length)>max)return false;const m=a.length,n=b.length;let prev=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const cur=[i];let best=i;for(let j=1;j<=n;j++){cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));best=Math.min(best,cur[j])}if(best>max)return false;prev=cur}return prev[n]<=max}
function searchIds(q){
  let words=nrm(q).replace(/[^a-z0-9ñ\s]/g,' ').split(/\s+/).filter(Boolean);
  const kept=words.filter(w=>!STOPW.has(w));if(kept.length)words=kept;if(!words.length)return [];
  const H=hay(),score={};
  for(const id in H){let sc=0,ok=true;
    for(const w of words){const alts=SYN[w]||[w];let hit=0;
      for(const a of alts){if(a==='__barato'){if(P[id].price<=250)hit=Math.max(hit,1);continue}
        if(a.startsWith('__c:')){if(P[id].c===a.slice(4))hit=Math.max(hit,2);continue}
        if(tokHit(H[id].nt,H[id].name,a))hit=Math.max(hit,3);else if(tokHit(H[id].at,H[id].all,a))hit=Math.max(hit,1);
        else if(a.length>=5&&!a.includes(' ')){const max=a.length>=8?2:1;if(H[id].at.some(t=>t.length>=4&&lev1(a,t,max)))hit=Math.max(hit,H[id].nt.some(t=>lev1(a,t,max))?2:.5)}}
      if(!hit){ok=false;break}sc+=hit}
    if(ok)score[id]=sc+(P[id].medals||0)/1000}
  return Object.keys(score).sort((a,b)=>score[b]-score[a]);
}

/* ---------- Encabezado, menú, carrito y pie ---------- */
/* ---------- Verificación de edad (una vez cada 30 días; ?edad=1 la muestra para presentarla) ---------- */
/* ?captura=1: capturas del mapa del prototipo, sin verificación de edad ni botón Pantallas */
const CAPTURE=/[?&]captura=1/.test(location.search);
function ageGate(){
  if(CAPTURE)return;
  const force=new URLSearchParams(location.search).get('edad')==='1';
  const ok=+store.get('cettoAge',0);
  if(!force&&(Date.now()-ok<30*864e5||navigator.webdriver))return;
  const g=document.createElement('div');g.className='age';g.id='ageGate';g.setAttribute('role','dialog');g.setAttribute('aria-modal','true');g.setAttribute('aria-labelledby','ageT');
  g.innerHTML='<div class="age-in"><img src="https://www.lacetto.mx/cdn/shop/files/cropped-Recurso-2-2-768x682-1.png?width=200" alt="L.A. Cetto"><h2 id="ageT">Te damos la bienvenida a L.A.&nbsp;Cetto</h2><p id="ageP">Para entrar, confirma que tienes 18 años o más.</p><div class="age-a" id="ageA"><button class="btn btn-ink" type="button" id="ageY">Sí, tengo 18 o más</button><button class="ul" type="button" id="ageN">No</button></div><small>El abuso en el consumo de este producto es nocivo para la salud. Evita el exceso.</small></div>';
  document.body.appendChild(g);
  const others=[...document.body.children].filter(el=>el!==g);others.forEach(el=>el.inert=true);document.documentElement.style.overflow='hidden';
  setTimeout(()=>document.getElementById('ageY').focus(),60);
  g.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const f=[...g.querySelectorAll('button')];const i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus()});
  const accept=()=>{store.set('cettoAge',Date.now());others.forEach(el=>el.inert=false);document.documentElement.style.overflow='';g.classList.add('out');setTimeout(()=>g.remove(),400);if(force)history.replaceState(null,'',location.pathname+location.hash)};
  const ask=()=>{document.getElementById('ageP').textContent='Para entrar, confirma que tienes 18 años o más.';document.getElementById('ageA').innerHTML='<button class="btn btn-ink" type="button" id="ageY">Sí, tengo 18 o más</button><button class="ul" type="button" id="ageN">No</button>';
    document.getElementById('ageY').onclick=accept;
    document.getElementById('ageN').onclick=()=>{document.getElementById('ageP').textContent='Gracias por visitarnos. Te esperamos cuando tengas 18 años.';document.getElementById('ageA').innerHTML='<button class="ul" type="button" id="ageBack">Me equivoqué, tengo 18 o más</button>';document.getElementById('ageBack').onclick=()=>{ask();document.getElementById('ageY').focus()};document.getElementById('ageBack').focus()}};
  ask();
}

/* ---------- Video ligero en celular y con ahorro de datos: la portada en cuadro 1080×1080 (5 MB) y los clips a 640×360 ---------- */
const LIGHT_VIDEO=matchMedia('(max-width:640px)').matches||!!(navigator.connection&&navigator.connection.saveData);
const LOCAL_V=/media\/(hero-hd|v-[a-z]+)\.mp4/;
const heroSrc=u=>LIGHT_VIDEO?String(u).replace('media/hero-hd.mp4','media/hero-hd-m.mp4').replace(/media\/(v-[a-z]+)\.mp4/,'media/$1-360.mp4'):u;
/* Poster de cada clip: el primer cuadro, exportado junto al video */
const vPoster=u=>/media\/v-[a-z]+/.test(u||'')?String(u).replace(/(-360)?\.mp4.*$/,'.jpg'):'media/hero-hd.jpg';
function lightVideos(){
  if(!LIGHT_VIDEO)return;
  document.querySelectorAll('video[data-src]').forEach(v=>{if(LOCAL_V.test(v.dataset.src))v.dataset.src=heroSrc(v.dataset.src)});
  document.querySelectorAll('video').forEach(v=>{const ss=[...v.querySelectorAll('source')].filter(x=>LOCAL_V.test(x.getAttribute('src')||''));if(!ss.length&&!LOCAL_V.test(v.getAttribute('src')||''))return;
    ss.forEach(x=>x.src=heroSrc(x.getAttribute('src')));if(v.getAttribute('src'))v.src=heroSrc(v.getAttribute('src'));
    v.preload='metadata';v.load();
    if(navigator.connection&&navigator.connection.saveData){v.removeAttribute('autoplay');v.pause()}});
}

/* ---------- Videos de ambiente (<video data-amb data-src="media/v-….mp4">)
   Cargan al acercarse, solo se reproducen en pantalla, traen botón de pausa (WCAG 2.2.2)
   y con "reducir movimiento" se quedan en el primer cuadro hasta que la persona les da play. ---------- */
const PP_PAUSE='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>';
const PP_PLAY='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
let ambIO=null;
function ambPlay(v){if(!v._vis||v._user||!v.dataset.src)return;if(!v.getAttribute('src'))v.src=heroSrc(v.dataset.src);v.play().catch(()=>{})}
function ambPaint(v){const b=v._pp;if(!b)return;const off=!!v._user;b.setAttribute('aria-label',(off?'Reproducir':'Pausar')+' el video'+(v.dataset.amb&&v.dataset.amb.length>2?': '+v.dataset.amb:''));b.innerHTML=off?PP_PLAY:PP_PAUSE}
function ambient(root=document){
  if(!ambIO)ambIO=new IntersectionObserver(es=>es.forEach(en=>{const v=en.target;v._vis=en.isIntersecting;if(v._vis)ambPlay(v);else v.pause()}),{rootMargin:'160px 0px'});
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches||CAPTURE||!!(navigator.connection&&navigator.connection.saveData);
  root.querySelectorAll('video[data-amb]:not([data-amb-on])').forEach(v=>{
    v.dataset.ambOn=1;v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute('playsinline','');v.preload='none';v.removeAttribute('autoplay');
    if(!v.getAttribute('poster'))v.poster=vPoster(v.dataset.src);
    if(still)v._user=true;
    if(!v.hasAttribute('data-noctl')){const b=document.createElement('button');b.type='button';b.className='v-pp'+(v.dataset.ppPos?' '+v.dataset.ppPos:'');v._pp=b;
      b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();v._user=!v._user;ambPaint(v);if(v._user)v.pause();else{v._vis=true;ambPlay(v)}});
      (v.closest('[data-amb-box]')||v.parentElement).appendChild(b);ambPaint(v)}
    ambIO.observe(v);
  });
}
/* Cambia el clip de un video de ambiente ya montado (p. ej. al cambiar de momento) */
function ambSet(v,src){if(v.dataset.src===src)return ambPlay(v);v.dataset.src=src;v.poster=vPoster(src);v.removeAttribute('src');v.load();ambPlay(v)}

/* Íconos del encabezado (trazo fino, toman el color del texto) */
/* banners del panel derecho del menú: solo foto y título encima (dos por sección, como la referencia) */
const mb=(href,img,t,o={})=>'<a class="mb'+(o.bw?' mb-bw':'')+(o.raw?' mb-raw':'')+'" href="'+href+'"'+(o.raw?' aria-label="'+t+'"':'')+'><img src="'+img+'" alt="" loading="lazy"'+(o.pos?' style="object-position:'+o.pos+'"':'')+'>'+(o.raw?'':'<span class="mb-t">'+t+'</span>')+'</a>';
const mpH=(t,a,h)=>'<div class="lines-h"><span class="cap">'+t+'</span><a class="ul" href="'+h+'">'+a+'</a></div>';
const IC={
  search:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3"/><path d="M15.4 15.4l4.6 4.6"/></svg>',
  user:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" aria-hidden="true"><circle cx="12" cy="8.6" r="3.7"/><path d="M4.8 20.2c1.1-3.7 3.9-5.6 7.2-5.6s6.1 1.9 7.2 5.6"/></svg>',
  bag:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" aria-hidden="true"><path d="M5.2 8.6h13.6l-1 11.6H6.2z"/><path d="M9 8.6V7.2a3 3 0 0 1 6 0v1.4"/></svg>'
};
/* ---------- 100 años: el "100" con la greca del "1000" de L.A. Cetto, redibujado en vector y sin los ceros encimados ----------
   c100('mark') solo el número · c100('lock') con "AÑOS" · c100('full') con "AÑOS" y "1928 · 2028".
   Trazos en currentColor (grosor con --so y --sk). Con la clase "draw" se dibuja al agregar "go": contornos, greca y texto. */
const C100D={"w":"671","h":"274","o1":"M0 0H85V274H52V33H0Z","k1":"M6.6 8.8L76.2 8.8 76.2 36.5M6.6 16.5L68.5 16.5 68.5 36.5M6.6 24.2L60.8 24.2 60.8 36.5M58.9 44L78.1 44 78.1 57M58.9 49.8L71.4 49.8 71.4 57M78.1 61.7L58.9 68.2 78.1 74.7M78.1 65.6L70.6 68.2 78.1 70.8M58.9 79.4L78.1 85.9 58.9 92.4M58.9 83.3L66.4 85.9 58.9 88.5M58.9 108.7L58.9 97.1 78.1 97.1 78.1 108.7M68.5 97.1L68.5 105.6M58.9 126.4L58.9 113.4 78.1 113.4 78.1 126.4 67.3 126.4 67.3 118.9 72.5 118.9M58.9 133.3L78.1 133.3M78.1 140.2L58.9 146.7 78.1 153.2M78.1 144.1L70.6 146.7 78.1 149.3M58.9 157.9L78.1 164.4 58.9 170.9M58.9 161.8L66.4 164.4 58.9 167M58.9 188.5L78.1 188.5 78.1 175.5M58.9 182.8L71.4 182.8 71.4 175.5M60.8 193.2L60.8 212M68.5 193.2L68.5 212M76.2 193.2L76.2 212M58.9 216.7L78.1 216.7 78.1 229.7M58.9 222.4L71.4 222.4 71.4 229.7M78.1 234.4L58.9 240.9 78.1 247.4M78.1 238.3L70.6 240.9 78.1 243.5M58.9 252.1L78.1 258.6 58.9 265.1M58.9 256L66.4 258.6 58.9 261.2","kr":"M-11 -127.7L-7.8 -127.9 -4.7 -128.1 -1.6 -128.2 1.6 -128.2 4.7 -128.1 7.8 -127.9 11 -127.7M-10.3 -120.1L-7.4 -120.3 -4.4 -120.4 -1.5 -120.5 1.5 -120.5 4.4 -120.4 7.4 -120.3 10.3 -120.1M-9.7 -112.4L-6.9 -112.6 -4.1 -112.7 -1.4 -112.8 1.4 -112.8 4.1 -112.7 6.9 -112.6 9.7 -112.4M16.6 -129L14.2 -110 16.8 -109.6 19.4 -109.2 21.9 -108.7 24.5 -108.2 27.1 -107.5M23.3 -128L21.1 -115.7 23.6 -115.2 26.2 -114.7 28.7 -114.1M31.6 -106.3L35.6 -111.8 39.9 -117.1 44.4 -122.3 44.5 -115.4 44.3 -108.6 43.9 -101.8M35.4 -105.1L40.4 -111.3 40.3 -103.3M56.6 -117.2L56 -110.3 55.1 -103.5 54 -96.9 59.1 -101.3 64.5 -105.6 70 -109.7M60.7 -115.1L59.7 -107.1 66 -112.1M85.5 -98.1L83.4 -99.9 81.2 -101.6 79 -103.3 76.8 -105 74.6 -106.6 63.6 -90.9 65.5 -89.5 67.4 -88.1 69.2 -86.6 71.1 -85.1 72.9 -83.6M69.1 -98.7L71.6 -96.9 74.1 -95 76.6 -93.1M100.1 -83.1L98.1 -85.5 96 -87.8 93.9 -90 91.8 -92.2 89.6 -94.4 76.4 -80.4 78.2 -78.6 80.1 -76.7 81.9 -74.8 83.6 -72.9 85.3 -70.9 93.6 -77.7 91.8 -79.9 89.9 -81.9 88 -84 84.3 -80.4M105.1 -76.7L89.6 -65.4M93.5 -59.7L100.1 -61.1 106.8 -62.4 113.6 -63.4 109.2 -58.1 104.6 -53.1 99.9 -48.2M95.5 -56.3L103.4 -57.7 98.1 -51.7M119.5 -51.5L114.5 -46.7 109.5 -42.2 104.2 -37.8 111 -37.8 117.9 -37.6 124.7 -37.1M121.2 -47.3L115.3 -41.8 123.3 -41.5M129 -16.6L110 -14.2 109.6 -16.8 109.2 -19.4 108.7 -21.9 108.2 -24.5 107.5 -27.1M128 -23.3L115.7 -21.1 115.2 -23.6 114.7 -26.2 114.1 -28.7M127.7 -11L127.9 -7.8 128.1 -4.7 128.2 -1.6 128.2 1.6 128.1 4.7 127.9 7.8 127.7 11M120.1 -10.3L120.3 -7.4 120.4 -4.4 120.5 -1.5 120.5 1.5 120.4 4.4 120.3 7.4 120.1 10.3M112.4 -9.7L112.6 -6.9 112.7 -4.1 112.8 -1.4 112.8 1.4 112.7 4.1 112.6 6.9 112.4 9.7M129 16.6L110 14.2 109.6 16.8 109.2 19.4 108.7 21.9 108.2 24.5 107.5 27.1M128 23.3L115.7 21.1 115.2 23.6 114.7 26.2 114.1 28.7M106.3 31.6L111.8 35.6 117.1 39.9 122.3 44.4 115.4 44.5 108.6 44.3 101.8 43.9M105.1 35.4L111.3 40.4 103.3 40.3M117.2 56.6L110.3 56 103.5 55.1 96.9 54 101.3 59.1 105.6 64.5 109.7 70M115.1 60.7L107.1 59.7 112.1 66M98.1 85.5L99.9 83.4 101.6 81.2 103.3 79 105 76.8 106.6 74.6 90.9 63.6 89.5 65.5 88.1 67.4 86.6 69.2 85.1 71.1 83.6 72.9M98.7 69.1L96.9 71.6 95 74.1 93.1 76.6M83.1 100.1L85.5 98.1 87.8 96 90 93.9 92.2 91.8 94.4 89.6 80.4 76.4 78.6 78.2 76.7 80.1 74.8 81.9 72.9 83.6 70.9 85.3 77.7 93.6 79.9 91.8 81.9 89.9 84 88 80.4 84.3M76.7 105.1L65.4 89.6M59.7 93.5L61.1 100.1 62.4 106.8 63.4 113.6 58.1 109.2 53.1 104.6 48.2 99.9M56.3 95.5L57.7 103.4 51.7 98.1M51.5 119.5L46.7 114.5 42.2 109.5 37.8 104.2 37.8 111 37.6 117.9 37.1 124.7M47.3 121.2L41.8 115.3 41.5 123.3M16.6 129L14.2 110 16.8 109.6 19.4 109.2 21.9 108.7 24.5 108.2 27.1 107.5M23.3 128L21.1 115.7 23.6 115.2 26.2 114.7 28.7 114.1M11 127.7L7.8 127.9 4.7 128.1 1.6 128.2 -1.6 128.2 -4.7 128.1 -7.8 127.9 -11 127.7M10.3 120.1L7.4 120.3 4.4 120.4 1.5 120.5 -1.5 120.5 -4.4 120.4 -7.4 120.3 -10.3 120.1M9.7 112.4L6.9 112.6 4.1 112.7 1.4 112.8 -1.4 112.8 -4.1 112.7 -6.9 112.6 -9.7 112.4M-16.6 129L-14.2 110 -16.8 109.6 -19.4 109.2 -21.9 108.7 -24.5 108.2 -27.1 107.5M-23.3 128L-21.1 115.7 -23.6 115.2 -26.2 114.7 -28.7 114.1M-31.6 106.3L-35.6 111.8 -39.9 117.1 -44.4 122.3 -44.5 115.4 -44.3 108.6 -43.9 101.8M-35.4 105.1L-40.4 111.3 -40.3 103.3M-56.6 117.2L-56 110.3 -55.1 103.5 -54 96.9 -59.1 101.3 -64.5 105.6 -70 109.7M-60.7 115.1L-59.7 107.1 -66 112.1M-85.5 98.1L-83.4 99.9 -81.2 101.6 -79 103.3 -76.8 105 -74.6 106.6 -63.6 90.9 -65.5 89.5 -67.4 88.1 -69.2 86.6 -71.1 85.1 -72.9 83.6M-69.1 98.7L-71.6 96.9 -74.1 95 -76.6 93.1M-100.1 83.1L-98.1 85.5 -96 87.8 -93.9 90 -91.8 92.2 -89.6 94.4 -76.4 80.4 -78.2 78.6 -80.1 76.7 -81.9 74.8 -83.6 72.9 -85.3 70.9 -93.6 77.7 -91.8 79.9 -89.9 81.9 -88 84 -84.3 80.4M-105.1 76.7L-89.6 65.4M-93.5 59.7L-100.1 61.1 -106.8 62.4 -113.6 63.4 -109.2 58.1 -104.6 53.1 -99.9 48.2M-95.5 56.3L-103.4 57.7 -98.1 51.7M-119.5 51.5L-114.5 46.7 -109.5 42.2 -104.2 37.8 -111 37.8 -117.9 37.6 -124.7 37.1M-121.2 47.3L-115.3 41.8 -123.3 41.5M-129 16.6L-110 14.2 -109.6 16.8 -109.2 19.4 -108.7 21.9 -108.2 24.5 -107.5 27.1M-128 23.3L-115.7 21.1 -115.2 23.6 -114.7 26.2 -114.1 28.7M-127.7 11L-127.9 7.8 -128.1 4.7 -128.2 1.6 -128.2 -1.6 -128.1 -4.7 -127.9 -7.8 -127.7 -11M-120.1 10.3L-120.3 7.4 -120.4 4.4 -120.5 1.5 -120.5 -1.5 -120.4 -4.4 -120.3 -7.4 -120.1 -10.3M-112.4 9.7L-112.6 6.9 -112.7 4.1 -112.8 1.4 -112.8 -1.4 -112.7 -4.1 -112.6 -6.9 -112.4 -9.7M-129 -16.6L-110 -14.2 -109.6 -16.8 -109.2 -19.4 -108.7 -21.9 -108.2 -24.5 -107.5 -27.1M-128 -23.3L-115.7 -21.1 -115.2 -23.6 -114.7 -26.2 -114.1 -28.7M-106.3 -31.6L-111.8 -35.6 -117.1 -39.9 -122.3 -44.4 -115.4 -44.5 -108.6 -44.3 -101.8 -43.9M-105.1 -35.4L-111.3 -40.4 -103.3 -40.3M-117.2 -56.6L-110.3 -56 -103.5 -55.1 -96.9 -54 -101.3 -59.1 -105.6 -64.5 -109.7 -70M-115.1 -60.7L-107.1 -59.7 -112.1 -66M-98.1 -85.5L-99.9 -83.4 -101.6 -81.2 -103.3 -79 -105 -76.8 -106.6 -74.6 -90.9 -63.6 -89.5 -65.5 -88.1 -67.4 -86.6 -69.2 -85.1 -71.1 -83.6 -72.9M-98.7 -69.1L-96.9 -71.6 -95 -74.1 -93.1 -76.6M-83.1 -100.1L-85.5 -98.1 -87.8 -96 -90 -93.9 -92.2 -91.8 -94.4 -89.6 -80.4 -76.4 -78.6 -78.2 -76.7 -80.1 -74.8 -81.9 -72.9 -83.6 -70.9 -85.3 -77.7 -93.6 -79.9 -91.8 -81.9 -89.9 -84 -88 -80.4 -84.3M-76.7 -105.1L-65.4 -89.6M-59.7 -93.5L-61.1 -100.1 -62.4 -106.8 -63.4 -113.6 -58.1 -109.2 -53.1 -104.6 -48.2 -99.9M-56.3 -95.5L-57.7 -103.4 -51.7 -98.1M-51.5 -119.5L-46.7 -114.5 -42.2 -109.5 -37.8 -104.2 -37.8 -111 -37.6 -117.9 -37.1 -124.7M-47.3 -121.2L-41.8 -115.3 -41.5 -123.3M-16.6 -129L-14.2 -110 -16.8 -109.6 -19.4 -109.2 -21.9 -108.7 -24.5 -108.2 -27.1 -107.5M-23.3 -128L-21.1 -115.7 -23.6 -115.2 -26.2 -114.7 -28.7 -114.1","c":["M241 0a137 137 0 1 1 0 274 a137 137 0 1 1 0 -274","M241 33a104 104 0 1 1 0 208 a104 104 0 1 1 0 -208","M534 0a137 137 0 1 1 0 274 a137 137 0 1 1 0 -274","M534 33a104 104 0 1 1 0 208 a104 104 0 1 1 0 -208"],"c1":"241","c2":"534","cy":"137"};
function c100(v,o){v=v||'mark';o=o||{};const D=C100D,w=+D.w,h=+D.h,H=v==='mark'?h:v==='lock'?h+92:h+142;
  const tx=v==='mark'?'':'<text class="c100-a" x="0" y="'+(h+80)+'" textLength="'+w+'" lengthAdjust="spacing">AÑOS</text>'+(v==='full'?'<text class="c100-y" x="'+(w/2)+'" y="'+(h+134)+'" text-anchor="middle">1928 · 2028</text>':'');
  const open='<svg class="c100 c100-'+v+(o.solid?' c100-solid':'')+(o.cls?' '+o.cls:'')+'" viewBox="-4 -4 '+(w+8)+' '+(H+8)+'"'+(o.label?' role="img" aria-label="'+o.label+'"':' aria-hidden="true"')+' focusable="false">';
  /* sólida: el 1 y los ceros como bandas rellenas, para tamaños chicos o fondos con poco contraste */
  if(o.solid)return open+'<path fill="currentColor" fill-rule="evenodd" d="'+D.o1+D.c.join('')+'"/>'+tx+'</svg>';
  return open+
    '<g fill="none" stroke="currentColor" stroke-miterlimit="8"><path class="o" pathLength="1" style="--d:0s" d="'+D.o1+'"/>'+
    D.c.map((d,i)=>'<path class="o" pathLength="1" style="--d:'+(.14+i*.1).toFixed(2)+'s" d="'+d+'"/>').join('')+
    '<path class="k" pathLength="1" style="--d:.45s" d="'+D.k1+'"/>'+
    '<path class="k" pathLength="1" style="--d:.6s" transform="translate('+D.c1+' '+D.cy+')" d="'+D.kr+'"/>'+
    '<path class="k" pathLength="1" style="--d:.75s" transform="translate('+D.c2+' '+D.cy+')" d="'+D.kr+'"/></g>'+tx+'</svg>'}
/* ---------- Enólogo digital: el botón vive en todas las páginas; el motor y sus datos se cargan la primera vez que se abre ---------- */
let enoP=null;
function loadEno(){if(window.ENO)return Promise.resolve();if(enoP)return enoP;
  const js=src=>new Promise((ok,ko)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=ko;document.head.appendChild(s)});
  enoP=(typeof FX==='undefined'?js('cetto-fichas.js'):Promise.resolve()).then(()=>typeof YTV==='undefined'?js('cetto-videos.js'):null).then(()=>js('cetto-enologo.js')).catch(e=>{enoP=null;throw e});
  return enoP}
function openEno(q,ctx){return loadEno().then(()=>ENO.open(q,ctx))}
const ENO_IC='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><path d="M7.6 3h8.8l-.5 5.4a3.9 3.9 0 0 1-7.8 0z"/><path d="M8.1 7.2h7.8"/><path d="M12 12.3V20M8.6 20.5h6.8"/></svg>';
/* vuelve a dibujar un 100 con la clase "draw" */
const c100go=el=>{const s=el&&(el.matches&&el.matches('svg.c100')?el:el.querySelector('svg.c100'));if(!s)return;s.classList.remove('go');void s.getBoundingClientRect();s.classList.add('go')};

/* Avisos de compra: franja limpia debajo de la portada (o al inicio del contenido), un aviso a la vez.
   La leyenda legal completa vive en el pie de página y "Evita el exceso" en los banners. */
function notesStrip(){
  const N=[
    ['Envío gratis desde $799','<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>'],
    ['10% de descuento en tu caja de 6','<path d="M4 8.5 12 4l8 4.5v8L12 21l-8-4.5z"/><path d="M4 8.5 12 13l8-4.5M12 13v8"/>'],
    ['Hasta 3 meses sin intereses','<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3 10h18M7 15h4"/>']];
  const el=document.createElement('div');el.className='notes';el.setAttribute('role','region');el.setAttribute('aria-label','Avisos de compra');
  el.innerHTML='<div class="notes-in">'+N.map(([t,ic],i)=>'<span'+(i?'':' class="on"')+'><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">'+ic+'</svg>'+t+'</span>').join('')+'</div>';
  const hero=document.querySelector('[data-hero]'),main=document.querySelector('main');
  if(hero)hero.after(el);else if(main)main.prepend(el);else return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||CAPTURE)return;
  const it=[...el.querySelectorAll('.notes-in>span')];let i=0,hold=false;
  el.addEventListener('mouseenter',()=>hold=true);el.addEventListener('mouseleave',()=>hold=false);el.addEventListener('focusin',()=>hold=true);el.addEventListener('focusout',()=>hold=false);
  /* da tres vueltas y se queda quieto en el primer aviso */
  let turns=0;const tm=setInterval(()=>{if(hold||document.hidden)return;if(i===it.length-1&&++turns>=3)clearInterval(tm);const a=it[i];i=(i+1)%it.length;const b=it[i];a.classList.remove('on');a.classList.add('out');b.classList.remove('out');b.classList.add('on');setTimeout(()=>a.classList.remove('out'),650)},4200);
}
function renderChrome(opts={}){
  /* ícono de la pestaña (el escudo, en el dorado de la marca) */
  if(!document.querySelector('link[rel~="icon"]')){const l=document.createElement('link');l.rel='icon';l.type='image/svg+xml';l.href='media/favicon.svg';document.head.appendChild(l)}
  const top=document.getElementById('chromeTop'),bot=document.getElementById('chromeBottom');
  const H=PAGES.home;
  top.outerHTML=`
<a class="skip" href="#contenido">Saltar al contenido</a>
<header class="hdr${opts.solid?' solid always':''}" id="hdr">
  <div class="l">
    <button class="nt burger" id="openMenu" type="button" aria-expanded="false" aria-controls="menu"${opts.minimal?' hidden':''}><i aria-hidden="true"></i><span class="lb">Menú</span></button>${opts.minimal?`
    <a class="nt" href="${PAGES.tienda}">← Seguir comprando</a>`:''}
  </div>
  <a class="logo" href="${H}" aria-label="L.A. Cetto, inicio"><img src="https://www.lacetto.mx/cdn/shop/files/cropped-Recurso-2-2-768x682-1.png?width=200" alt="L.A. Cetto"><span class="logo-100" aria-hidden="true">${c100('lock',{solid:true})}</span></a>
  <div class="r">
    <button class="nt ic" id="openSearch" type="button" aria-label="Buscar" aria-controls="search" aria-expanded="false"${opts.minimal?' hidden':''}>${IC.search}</button>
    <a class="nt ic acct" id="hdrUser" href="${PAGES.cuenta}" aria-label="Mi cuenta" title="Mi cuenta"${opts.minimal?' hidden':''}>${IC.user}</a>${opts.minimal?`
    <span class="nt secure"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>Pago seguro</span>`:''}
    <button class="nt ic cartb" id="openCart" type="button" aria-label="Carrito, sin productos" aria-expanded="false" aria-controls="cart"${opts.minimal?' hidden':''}>${IC.bag}<span class="badge" id="count" aria-hidden="true">0</span></button>
  </div>
</header>`;
  bot.outerHTML=(opts.minimal?`
<footer class="f-min">
  <div class="wrap">
    <nav aria-label="Ayuda"><a href="${PAGES.ayuda}#envios">Envíos</a><a href="${PAGES.ayuda}#devoluciones">Devoluciones</a><a href="${PAGES.ayuda}#faq">Preguntas frecuentes</a><a href="${PAGES.ayuda}#contacto">Contacto</a></nav>
    <span class="warn">El abuso en el consumo de este producto es nocivo para la salud. Evita el exceso.</span>
    <span class="f-by">Powered by <b>Nuclea Studio</b></span>
  </div>
</footer>`:`
<footer class="ft">
  <div class="wrap">
    <div class="ft-top">
      <div class="ft-about">
        <span class="ft-k">Vinos de familia desde 1928</span>
        <p class="ft-p">Hechos en el Valle de Guadalupe, Baja California, por la familia Cetto. Siete generaciones después, seguimos haciendo vino.</p>
        <form class="ft-news" onsubmit="event.preventDefault();this.classList.add('ok');this.querySelector('input').disabled=true;this.querySelector('button').disabled=true;this.nextElementSibling.textContent='Listo, te escribiremos con la próxima preventa.'">
          <label class="sr" for="nmail">Tu correo para recibir preventas y nuevas añadas</label>
          <input id="nmail" type="email" placeholder="Tu correo para preventas y nuevas añadas" autocomplete="email" required>
          <button type="submit" aria-label="Suscribirme"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
        </form>
        <p class="ft-fine" aria-live="polite">Te das de baja cuando quieras.</p>
      </div>
      <nav class="ft-col" aria-label="Tienda"><span class="ft-k">Tienda</span><ul><li><a href="${PAGES.tienda}?tipo=tinto">Tintos</a></li><li><a href="${PAGES.tienda}?tipo=blanco">Blancos</a></li><li><a href="${PAGES.tienda}?tipo=rosado">Rosados</a></li><li><a href="${PAGES.tienda}?tipo=espumoso">Espumosos</a></li><li><a href="${PAGES.coleccion}">Colección Premiada</a></li><li><a href="${PAGES.tienda}?tipo=gourmet">Aceite de oliva y gourmet</a></li></ul></nav>
      <nav class="ft-col" aria-label="Visítanos"><span class="ft-k">Visítanos</span><ul><li><a href="${PAGES.exp}">Catas en el Valle</a></li><li><a href="${PAGES.exp}#eventos">Eventos y bodas</a></li><li><a href="${PAGES.exp}#visita">Cómo llegar</a></li><li><a href="${PAGES.exp}#cdmx">Boutique CDMX</a></li></ul></nav>
      <nav class="ft-col" aria-label="Cetto"><span class="ft-k">Cetto</span><ul><li><a href="${PAGES.hist}">Nuestra historia</a></li><li><a href="${PAGES.tray}">Trayectoria</a></li><li><a href="${PAGES.club}">Club Cetto</a></li><li><a href="${PAGES.regalos}">Regalos</a></li><li><a href="${H}#valle">Valle de Guadalupe</a></li></ul></nav>
      <nav class="ft-col" aria-label="Ayuda"><span class="ft-k">Ayuda</span><ul><li><a href="${PAGES.ayuda}#envios">Envíos</a></li><li><a href="${PAGES.ayuda}#devoluciones">Devoluciones</a></li><li><a href="${PAGES.ayuda}#faq">Preguntas frecuentes</a></li><li><a href="${PAGES.ayuda}#contacto">Contacto</a></li></ul></nav>
    </div>
    <div class="ft-cert"><span class="ft-k">Certificaciones</span><ul>
      <li><span class="cert" role="img" aria-label="Wine in Moderation: elegir, compartir, cuidar" style="--m:url(media/cert/wim.png);--r:438/134"></span></li>
      <li><span class="cert" role="img" aria-label="Certificado orgánico CCOF" style="--m:url(media/cert/ccof.png);--r:113/145;--h:44px"></span></li>
      <li><span class="cert" role="img" aria-label="Agricert México" style="--m:url(media/cert/agricert.png);--r:293/112"></span></li>
    </ul></div>
    <div class="ft-legal">
      <span class="warn">El abuso en el consumo de este producto es nocivo para la salud. Evita el exceso.</span>
      <span>Concepto de rediseño · imágenes y datos del sitio actual como referencia temporal</span>
      <span class="f-by">Powered by <b>Nuclea Studio</b></span>
    </div>
  </div>
  <a class="ft-word ft-seq" href="${H}" aria-label="L.A. Cetto, inicio"><span></span><div class="ft-c" aria-hidden="true">${c100('full',{cls:'draw'})}</div></a>
</footer>`)+`
<div class="scrim" id="scrim"></div>
<aside class="drawer menu" id="menu" role="dialog" aria-modal="true" aria-label="Menú" aria-hidden="true" inert>
  <div class="l">
    <div class="m-top"><button class="close" data-close>${xIcon}Cerrar</button><a class="m-100" href="${PAGES.tray}" aria-label="100 años de la familia Cetto, ver la trayectoria">${c100('lock',{solid:true})}</a></div>
    <ul class="mprim">
      <li><a href="${H}"${cur(opts,'home')}>Inicio</a></li>
      <li class="has-sub"><a href="${PAGES.tienda}" data-p="vinos">Vinos</a><ul class="msub" id="msub-vinos">
        <li><a href="${PAGES.tienda}">Todos los vinos</a></li><li><a href="${PAGES.tienda}?tipo=tinto">Tintos</a></li><li><a href="${PAGES.tienda}?tipo=blanco">Blancos</a></li>
        <li><a href="${PAGES.tienda}?tipo=rosado">Rosados</a></li><li><a href="${PAGES.tienda}?tipo=espumoso">Espumosos</a></li><li><a href="${PAGES.coleccion}">Colección Premiada</a></li>
        <li><a href="${PAGES.tienda}?f=botellines">Botellines</a></li><li><a href="${PAGES.tienda}#encuentra">Encuentra tu vino</a></li></ul></li>
      <li class="m-desk"><a href="${PAGES.coleccion}" data-p="prem">Colección Premiada</a></li>
      <li><a href="${PAGES.tienda}?tipo=gourmet" data-p="gour">Gourmet</a></li>
      <li><a href="${PAGES.tienda}" data-search data-p="buscar">Buscar</a></li>
      <li class="has-sub"><a href="${PAGES.exp}" data-p="exp">Experiencias</a><ul class="msub" id="msub-exp">
        <li><a href="${PAGES.exp}">Todas las experiencias</a></li><li><a href="${PAGES.exp}#reservar">Reservar una cata</a></li><li><a href="${PAGES.exp}#eventos">Eventos y bodas</a></li>
        <li><a href="${PAGES.exp}#cdmx">Boutique CDMX</a></li><li><a href="${PAGES.exp}#visita">Cómo llegar</a></li></ul></li>
      <li class="has-sub"><a href="${PAGES.regalos}" data-p="regalos">Regalos</a><ul class="msub" id="msub-regalos">
        <li><a href="${PAGES.regalos}">Todos los regalos</a></li><li><a href="${PAGES.regalos}#estuches">Estuches</a></li><li><a href="${PAGES.regalos}#tarjeta">Tarjeta de regalo</a></li>
        <li><a href="${PAGES.regalos}#experiencia">Regala una experiencia</a></li><li><a href="${PAGES.regalos}#empresas">Regalos corporativos</a></li></ul></li>
      <li class="has-sub"><a href="${PAGES.hist}" data-p="hist">Nuestra historia</a><ul class="msub" id="msub-hist">
        <li><a href="${PAGES.hist}">Nuestra historia</a></li><li><a href="${PAGES.tray}">Trayectoria</a></li><li><a href="${H}#valle">Valle de Guadalupe</a></li></ul></li>
      <li><a href="${PAGES.club}" data-p="club">Club Cetto</a></li>
    </ul>
    <a class="btn btn-ink m-cta" href="${PAGES.exp}#reservar">Reservar una cata</a>
    <ul class="msec">
      <li class="m-dup"><a href="${PAGES.tienda}#encuentra">Encuentra tu vino</a></li><li class="m-dup"><a href="${PAGES.tienda}?f=premiados">Premios</a></li>
      <li class="m-dup"><a href="${PAGES.tienda}?f=botellines">Botellines</a></li><li class="m-dup"><a href="${H}#valle">Valle de Guadalupe</a></li>
      <li class="m-dup"><a href="${PAGES.regalos}#empresas">Regalos corporativos</a></li><li class="m-dup"><a href="${PAGES.exp}#visita">Boutiques</a></li>
      <li><a href="${PAGES.ayuda}">Ayuda y envíos</a></li><li><a href="${PAGES.ayuda}#rastreo">Rastrea tu pedido</a></li>
    </ul>
  </div>
  <div class="r">
    <div class="mp on" data-pane="vinos">${mpH('Nuestras líneas','Ver todas',PAGES.tienda)}<div class="lgrid" id="lgrid"></div></div>
    <div class="mp mp-duo" data-pane="prem">${mb(PAGES.coleccion,'media/rg-reserva.jpg','Los más premiados',{pos:'50% 50%'})}${mb(PAGES.tienda+'?linea=don-luis','media/cp-vina.jpg','Don Luis',{pos:'42% 62%'})}</div>
    <div class="mp mp-duo" data-pane="gour">${mb(PAGES.ficha+'?p=ac750',F('Mesa_de_trabajo_38-100.jpg',1000),'Aceite de oliva extra virgen',{pos:'50% 50%'})}${mb(PAGES.tienda+'?tipo=gourmet',F('Mesa_de_trabajo_70-100.jpg',1000),'Vinagres y aceitunas',{pos:'40% 50%'})}</div>
    <div class="mp mp-duo" data-pane="buscar">${mb(PAGES.ficha+'?p=sbsb','media/b-sierrablanca-1000.jpg','El héroe del verano',{pos:'34% 50%'})}${mb(PAGES.tienda+'?linea=uvas-organicas','media/m-organicos-vina.jpg','Orgánicos de raíz',{pos:'50% 50%'})}</div>
    <div class="mp mp-duo" data-pane="exp">${mb(PAGES.exp+'#reservar',F('DSC0259.jpg',1000),'Reserva una cata',{pos:'50% 60%'})}${mb(PAGES.exp,F('tijun.jpg',1000),'Todas las experiencias')}</div>
    <div class="mp mp-duo" data-pane="regalos">${mb(PAGES.regalos,'media/m-regalo.jpg','Para regalar',{pos:'52% 42%'})}${mb(PAGES.regalos+'#experiencia','media/x-cetto-vina.jpg','Regala una experiencia',{pos:'42% 40%'})}</div>
    <div class="mp mp-duo" data-pane="hist">${mb(PAGES.hist,'media/hist-vinedo-1200.jpg','Nuestra historia',{bw:1,pos:'50% 45%'})}${mb(PAGES.tray,'media/f-brindis-mar.jpg','Trayectoria',{pos:'50% 50%'})}</div>
    <div class="mp mp-duo" data-pane="club">${mb(PAGES.club,'media/club-copas.jpg','Únete al club',{pos:'54% 55%'})}${mb(PAGES.club+'#estaciones','media/l-estaciones.jpg','Club Estaciones',{pos:'50% 62%'})}</div>
  </div>
</aside>
<aside class="drawer cart" id="cart" role="dialog" aria-modal="true" aria-label="Carrito" aria-hidden="true" inert>
  <div class="cart-h"><h2>Tu carrito</h2><button class="close" data-close>${xIcon}Cerrar</button></div>
  <div class="goals" id="goals"></div>
  <div class="citems" id="citems"></div>
  <div class="cart-f" id="cartF"></div>
</aside>
<div class="toast" id="toast" role="status" aria-live="polite"></div>${opts.minimal?'':'<button class="eno-l'+(document.querySelector('[data-hero]')?' wait':'')+'" id="enoL" type="button" aria-label="Abrir el enólogo digital" aria-controls="eno"><span class="eno-l-ic" aria-hidden="true">'+ENO_IC+'</span><span class="eno-l-t">Enólogo digital</span></button>'}
<p class="sr" id="cartLive" aria-live="polite"></p>
<div class="srch" id="search" role="dialog" aria-modal="true" aria-label="Buscar" aria-hidden="true" inert>
  <div class="srch-in">
    <div class="srch-top"><label class="sr" for="sInput">Buscar vinos</label><input id="sInput" type="search" placeholder="Nebbiolo, rosado, para carne…" autocomplete="off"><button class="close" data-close>${xIcon}Cerrar</button></div>
    <div class="srch-sug" id="sSug"><span>Sugerencias</span><a href="${PAGES.tienda}?tipo=tinto">Tintos</a><a href="${PAGES.tienda}?momento=regalo">Para regalar</a><a href="${PAGES.tienda}?precio=300">Menos de $300</a><a href="${PAGES.tienda}?linea=estaciones">Estaciones</a><a href="${PAGES.tienda}?tipo=gourmet">Aceite de oliva</a><a href="${PAGES.tienda}#encuentra">Encuentra tu vino</a></div>
    <div class="srch-res" id="sRes"></div>
    <a class="ul srch-all" id="sAll" href="${PAGES.tienda}" hidden></a>
  </div>
</div>`;
  const lineInfo=name=>{const ids=Object.keys(P).filter(id=>P[id].line===name&&!P[id].gift&&!P[id].nb);const min=Math.min(...ids.map(id=>P[id].price));return ids.length+(ids.length===1?' vino':' vinos')+' · desde '+money(min)};
  const LN=[['Reserva Privada','nebrp','reserva-privada'],['Don Luis','terra','don-luis'],['Boutique','sang','boutique'],['Estaciones','oto','estaciones'],['L.A. Cetto','pslac','la-cetto'],['Uvas Orgánicas','nebor','uvas-organicas']].map(([n,id,sl])=>[n,id,lineInfo(n),sl]);
  /* cada foto trae la botella a distinta altura: con su medida (tapa y alto, en una foto de 500 px) todas quedan del mismo alto
     y con la tapa a la misma altura. HB = alto de la botella y TOP = dónde empieza, en % del alto de la tarjeta */
  const BX={nebrp:[58,426],terra:[31,453],sang:[33,451],oto:[57,411],pslac:[57,427],nebor:[41,443]},HB=118,TOP=12;
  const fit=id=>{const [y,h]=BX[id]||[46,436];return '--s:'+(HB*500/h).toFixed(1)+';--t:'+(TOP-y*HB/h).toFixed(2)};
  document.getElementById('lgrid').innerHTML=LN.map(([n,id,s,sl])=>'<a class="lc" href="'+PAGES.tienda+'?linea='+sl+'"><span class="fld"><img src="'+F(P[id].img,500)+'" alt="" loading="lazy" style="'+fit(id)+'"></span><b>'+n+'</b><span>'+s+'</span></a>').join('');
  wireChrome(opts);
}

/* ---------- Carrito (persistente entre páginas) ---------- */
const FREE=799;
const cart=(()=>{try{const c=JSON.parse(localStorage.getItem('cettoCart')||'{}');return c&&typeof c==='object'?c:{}}catch(e){return {}}})();
const saveCart=()=>{try{localStorage.setItem('cettoCart',JSON.stringify(cart))}catch(e){}};
const bottles=()=>Object.entries(cart).reduce((a,[id,q])=>a+(isWine(id)?q:0),0);
const subtotal=()=>Object.entries(cart).reduce((a,[id,q])=>a+P[id].price*q,0);
const winesSub=()=>Object.entries(cart).reduce((a,[id,q])=>a+(isWine(id)?P[id].price*q:0),0);
function add(id,q=1,silent){if(!P[id])return;cart[id]=(cart[id]||0)+q;saveCart();renderCart();if(!silent)toast(id,q)}
function setQ(id,q){if(q<=0)delete cart[id];else cart[id]=q;saveCart();renderCart()}
/* Totales: mode 'envio' (por defecto) o 'boutique' */
function totals(mode){
  const items=Object.entries(cart),sub=subtotal(),b=bottles(),box=b>=6?Math.round(winesSub()*.1):0;
  const gcSub=items.reduce((a,[id,q])=>a+(P[id]&&P[id].gc?P[id].price*q:0),0);
  const mem=isMember()?Math.round((sub-gcSub-box)*MEMBER):0,net=sub-box-mem;
  const ship=!items.length||mode==='boutique'||net>=FREE?0:SHIP;
  return {sub,box,mem,net,ship,tot:net+ship,bottles:b,n:items.reduce((a,[,q])=>a+q,0)};
}
function renderCart(){
  Object.keys(cart).forEach(k=>{const m=/^gc(\d+)$/.exec(k);if(m)gcId(+m[1]);if(!P[k]||!(cart[k]>0))delete cart[k]});
  const T=totals(),n=T.n;
  const cEl=document.getElementById('count');cEl.textContent=n;cEl.classList.toggle('on',n>0);
  document.getElementById('openCart').setAttribute('aria-label',n?'Carrito, '+n+(n===1?' producto':' productos'):'Carrito, sin productos');
  const cm=document.getElementById('countM');if(cm)cm.textContent=n;
  const leftShip=Math.max(0,FREE-T.net),leftBox=Math.max(0,6-T.bottles);
  document.getElementById('goals').innerHTML=
   '<div><div style="display:flex;justify-content:space-between;gap:12px"><span>'+(leftShip?'Te faltan <b>'+money(leftShip)+'</b> para el envío gratis':'<span class="ok">Tu envío es gratis</span>')+'</span><span style="color:var(--ink3)">'+money(FREE)+'</span></div><div class="bar"><i style="width:'+Math.min(100,T.net/FREE*100)+'%"></i></div></div>'+
   '<div><div style="display:flex;justify-content:space-between;gap:12px"><span>'+(leftBox?'Agrega <b>'+leftBox+'</b> botella'+(leftBox>1?'s':'')+' de 750 ml y ahorra 10%':'<span class="ok">Caja de 6: 10% aplicado</span>')+'</span><span style="color:var(--ink3)">'+Math.min(T.bottles,6)+'/6</span></div><div class="bar"><i style="width:'+Math.min(100,T.bottles/6*100)+'%"></i></div></div>';
  const items=Object.entries(cart);
  document.getElementById('citems').innerHTML=items.length?items.map(([id,q])=>{const p=P[id];return '<div class="ci"><span class="fld"><img src="'+F(p.img,200)+'" alt=""></span><div><small>'+p.line+'</small><b>'+(p.gc?((giftGet()||{}).to?'Para '+String(giftGet().to).replace(/</g,'&lt;'):money(p.price)):p.name)+(p.sub?' <span class="ci-sub">'+p.sub+'</span>':'')+'</b><div class="qty"><button aria-label="Quitar una '+p.name+'" data-q="'+id+'" data-d="-1">−</button><span aria-live="polite">'+q+'</span><button aria-label="Agregar una '+p.name+'" data-q="'+id+'" data-d="1">+</button></div></div><span class="price">'+money(p.price*q)+'</span></div>'}).join(''):'<div class="empty"><b>Tu carrito está vacío</b>Empieza por un momento o arma tu caja de 6.</div>';
  const e=eta('envio');
  document.getElementById('cartF').innerHTML='<div class="ln"><span>Subtotal</span><span class="price">'+money(T.sub)+'</span></div>'+
   (T.box?'<div class="ln"><span>Caja de 6 (10%)</span><span class="price">−'+money(T.box)+'</span></div>':'')+
   (T.mem?'<div class="ln"><span>Precio de socio (5%)</span><span class="price">−'+money(T.mem)+'</span></div>':'')+
   '<div class="ln"><span>Envío</span><span class="price">'+(items.length?(T.ship?money(T.ship):'Gratis'):'—')+'</span></div>'+
   (items.length?'<p class="eta">'+e.txt+'.'+(T.ship?' Gratis desde '+money(FREE)+' o al recoger en boutique.':'')+'</p>':'')+
   '<div class="ln tot"><span>Total</span><span class="price">'+money(T.tot)+'</span></div>'+
   (items.length?'<a class="btn btn-ink" href="'+PAGES.pago+'">Pagar '+money(T.tot)+'</a>':'<a class="btn btn-ink" href="'+PAGES.tienda+'">Ir a la tienda</a>')+
   '<p>Pago seguro con Mercado Pago. Hasta 3 meses sin intereses con tarjeta.</p>';
}
let tt;
function toast(id,q=1){
  const p=P[id],t=document.getElementById('toast');const left=Math.max(0,6-bottles());
  t.innerHTML='<span class="fld"><img src="'+F(p.img,120)+'" alt=""></span><span>'+(q>1?q+' × ':'')+p.name+' en tu carrito'+(isWine(id)&&left?'. '+left+' más para el 10%':'')+'</span><button id="tView">Ver carrito</button>';
  t.classList.add('on');clearTimeout(tt);const hide=()=>{tt=setTimeout(()=>{if(!t.matches(':hover,:focus-within'))t.classList.remove('on');else hide()},6000)};hide();
  document.getElementById('tView').onclick=()=>{t.classList.remove('on');openDrawer('cart')};
}

/* ---------- Paneles y encabezado ---------- */
let lastFocus;
function openDrawer(which){document.getElementById('toast').classList.remove('on');lastFocus=document.activeElement;const d=document.getElementById(which);d.inert=false;d.classList.add('on');d.setAttribute('aria-hidden','false');document.getElementById('scrim').classList.add('on');document.getElementById(which==='menu'?'openMenu':'openCart').setAttribute('aria-expanded','true');document.body.style.overflow='hidden';setTimeout(()=>d.querySelector('[data-close]').focus(),50)}
function closeAll(){const wasOpen=document.querySelector('.drawer.on,#pnav.on,#search.on');closePN(true);closeSearch(true);['menu','cart'].forEach(w=>{const d=document.getElementById(w);d.classList.remove('on');d.setAttribute('aria-hidden','true');d.inert=true});document.getElementById('openMenu').setAttribute('aria-expanded','false');document.getElementById('openCart').setAttribute('aria-expanded','false');document.getElementById('scrim').classList.remove('on');document.body.style.overflow='';if(wasOpen&&lastFocus&&!lastFocus.closest('[inert]'))lastFocus.focus();if(wasOpen)lastFocus=null}
/* ---------- Buscador ---------- */
const nrm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const opener=()=>{const o=document.activeElement,prev=lastFocus;return o&&o.closest&&o.closest('.drawer,#pnav')?(prev||document.getElementById('openMenu')):o};
function openSearch(){const o=opener();closeAll();lastFocus=o;const d=document.getElementById('search');d.inert=false;d.classList.add('on');d.setAttribute('aria-hidden','false');document.getElementById('scrim').classList.add('on');document.body.style.overflow='hidden';['openSearch','openSearchM'].forEach(k=>{const b=document.getElementById(k);if(b)b.setAttribute('aria-expanded','true')});/* el foco va en el mismo toque: así iOS abre el teclado de inmediato */const si=document.getElementById('sInput');si.focus({preventScroll:true});setTimeout(()=>{if(document.activeElement!==si)si.focus({preventScroll:true})},80)}
function closeSearch(quiet){const d=document.getElementById('search');if(!d||!d.classList.contains('on'))return;d.classList.remove('on');d.inert=true;d.setAttribute('aria-hidden','true');['openSearch','openSearchM'].forEach(k=>{const b=document.getElementById(k);if(b)b.setAttribute('aria-expanded','false')});if(!quiet){document.getElementById('scrim').classList.remove('on');document.body.style.overflow='';if(lastFocus&&!lastFocus.closest('[inert]'))lastFocus.focus();lastFocus=null}}
function runSearch(q){
  const words=nrm(q).split(/\s+/).filter(Boolean),res=document.getElementById('sRes'),all=document.getElementById('sAll');
  if(!words.length){res.innerHTML='';all.hidden=true;return}
  const hits=searchIds(q);
  res.innerHTML=hits.length?hits.slice(0,6).map(id=>{const p=P[id];return '<a class="sr-it" href="'+PAGES.ficha+'?p='+id+'"><span class="fld"><img src="'+F(p.img,300)+'" alt=""></span><small class="cap">'+p.line+'</small><b>'+p.name+(p.sub?' <span>'+p.sub+'</span>':'')+'</b><small class="price">'+money(p.price)+'</small></a>'}).join(''):'<p class="srch-none">Nada con “'+q.replace(/</g,'&lt;')+'”. Prueba con una uva, un tipo de vino o un platillo.</p>';
  all.hidden=!hits.length;all.href=PAGES.tienda+'?q='+encodeURIComponent(q.trim());all.textContent='Ver '+(hits.length>6?'los '+hits.length+' resultados':'en la tienda');
}
function wireChrome(opts){
  ['openSearch','openSearchM'].forEach(k=>{const b=document.getElementById(k);if(b)b.onclick=openSearch});
  document.querySelectorAll('[data-search]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();openSearch()}));
  document.getElementById('sInput').addEventListener('input',e=>runSearch(e.target.value));
  document.getElementById('sInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim())location.href=PAGES.tienda+'?q='+encodeURIComponent(e.target.value.trim())});
  if(location.hash==='#buscar')setTimeout(openSearch,200);
  document.getElementById('openMenu').onclick=()=>openDrawer('menu');
  document.getElementById('openCart').onclick=()=>openDrawer('cart');
  /* Enólogo digital: en páginas con portada aparece al bajar un poco, para no encimarse con las flechas del banner */
  {const b=document.getElementById('enoL');if(b){b.onclick=()=>{b.classList.add('load');openEno().finally(()=>b.classList.remove('load'))};
    /* en celular, la primera vez que aparece se presenta con su nombre unos segundos y luego queda solo el ícono */
    const peek=()=>{if(b._pk||!matchMedia('(max-width:640px)').matches)return;b._pk=1;let seen=null;try{seen=sessionStorage.getItem('enoPeek');sessionStorage.setItem('enoPeek','1')}catch(_){}
      if(seen)return;setTimeout(()=>{b.classList.add('peek');setTimeout(()=>b.classList.remove('peek'),4200)},700)};
    if(document.querySelector('[data-hero]')){const t=()=>{b.classList.toggle('wait',scrollY<innerHeight*.45);if(!b.classList.contains('wait'))peek()};t();addEventListener('scroll',t,{passive:true})}else setTimeout(peek,1600)}}
  /* 100 años: en la barra el logo se alterna con el 100 (que se dibuja cada vez que entra); en el menú y en el pie se dibuja al verse */
  {const lg=document.querySelector('.hdr .logo'),still=matchMedia('(prefers-reduced-motion: reduce)').matches||CAPTURE;
   if(lg&&!still){let alt=false;setInterval(()=>{if(document.hidden)return;if(document.querySelector('.hero.end100,.ld100')){if(alt){alt=false;lg.classList.remove('alt')}return}alt=!alt;lg.classList.toggle('alt',alt)},5200)}
   const fw=document.querySelector('.ft-seq');if(fw){if(still||!('IntersectionObserver' in window))fw.classList.add('done');else{const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();c100go(fw);setTimeout(()=>fw.classList.add('done'),3300)}},{rootMargin:'0px 0px -10% 0px'});io.observe(fw)}}}
  document.getElementById('scrim').onclick=()=>{closeAll();closeSearch()};
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeAll);
  document.querySelectorAll('#menu a').forEach(a=>a.addEventListener('click',closeAll));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAll();closeSearch()}});
  document.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const o=document.querySelector('.drawer.on,#search.on,#pnav.on');if(!o)return;
    const f=[...o.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el=>el.offsetParent!==null);if(!f.length)return;
    const i=f.indexOf(document.activeElement);if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&(i===-1||i===f.length-1)){e.preventDefault();f[0].focus()}});
  const mn=document.querySelector('main');if(mn&&!mn.id)mn.id='contenido';else if(mn&&mn.id!=='contenido'){const sk=document.querySelector('.skip');if(sk)sk.href='#'+mn.id}
  document.getElementById('citems').addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(!b)return;const id=b.dataset.q,d=b.dataset.d,q=(cart[id]||0)+ +d;setQ(id,q);
    const nb=document.querySelector('#citems [data-q="'+id+'"][data-d="'+d+'"]')||document.querySelector('#citems [data-q="'+id+'"]')||document.querySelector('#cart [data-close]');if(nb)nb.focus();
    document.getElementById('cartLive').textContent=q>0?(P[id].gc?'Tarjeta de regalo':P[id].name)+': '+q+' en tu carrito':(P[id].gc?'Tarjeta de regalo':P[id].name)+' quitado del carrito'});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;e.preventDefault();add(b.dataset.add,+(b.dataset.qty||1))});
  if(!opts.solid){
    const hdr=document.getElementById('hdr'),hero=document.querySelector('[data-hero]');
    const on=()=>hdr.classList.toggle('solid',window.scrollY>(hero?hero.offsetHeight-80:10));
    addEventListener('scroll',on,{passive:true});on();
  }
  /* Pie de página en celular: cada columna se abre y se cierra (en escritorio quedan abiertas) */
  {const mq=matchMedia('(max-width:640px)');
   document.querySelectorAll('footer .ft-col').forEach(col=>{const k=col.querySelector('.ft-k'),ul=col.querySelector('ul');if(!k||!ul)return;
     const id='ftc-'+(col.getAttribute('aria-label')||'').toLowerCase().normalize('NFD').replace(/[^a-z]/g,'');ul.id=id;
     const sync=()=>{if(mq.matches){k.setAttribute('role','button');k.tabIndex=0;k.setAttribute('aria-controls',id);k.setAttribute('aria-expanded',col.classList.contains('open'))}else{k.removeAttribute('role');k.removeAttribute('tabindex');k.removeAttribute('aria-controls');k.removeAttribute('aria-expanded')}};
     const tog=()=>{if(!mq.matches)return;col.classList.toggle('open');sync()};
     k.addEventListener('click',tog);k.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tog()}});
     mq.addEventListener('change',sync);sync()})}
  /* La barra se esconde al bajar y regresa al subir; arriba del todo, con un panel abierto o con el foco en ella siempre se ve.
     --hh (alto visible de la barra) deja que las barras fijas de cada página suban con ella */
  if(!opts.minimal){
    const hdr=document.getElementById('hdr'),de=document.documentElement;let lastY=scrollY,acc=0,hold=0;
    const set=up=>{if(hdr.classList.contains('hide')===up)return;hdr.classList.toggle('hide',up);de.classList.toggle('hdr-up',up)};
    window.hdrShow=(ms=900)=>{set(false);acc=0;hold=performance.now()+ms};
    window.hdrHide=(ms=900)=>{set(true);acc=0;hold=performance.now()+ms};
    /* celular: el botón de menú y los íconos toman el tono de lo que tienen debajo (vidrio oscuro sobre fondos oscuros y fotos) */
    {const mq=matchMedia('(max-width:900px)');let raf=0;
     const lum=c=>{const m=String(c).match(/[\d.]+/g);if(!m||m.length<3)return null;const a=m.length>3?+m[3]:1;if(a<.5)return null;return .299*m[0]+.587*m[1]+.114*m[2]};
     const probe=()=>{raf=0;if(!mq.matches||!hdr.classList.contains('solid')){hdr.classList.remove('on-dark');return}
       let L=null;for(const el of document.elementsFromPoint(32,32)){if(hdr.contains(el)||el.closest('.drawer,#search,#scrim,.eno,.toast'))continue;
         for(let e=el;e&&e!==document.documentElement;e=e.parentElement){if(e.tagName==='IMG'||e.tagName==='VIDEO'||e.tagName==='CANVAS'){L=70;break}const v=lum(getComputedStyle(e).backgroundColor);if(v!=null){L=v;break}}
         if(L!=null)break}
       if(L==null)L=lum(getComputedStyle(document.body).backgroundColor);hdr.classList.toggle('on-dark',L!=null&&L<120)};
     addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(probe)},{passive:true});addEventListener('resize',probe);setTimeout(probe,300)}
    addEventListener('scroll',()=>{const y=scrollY,dy=y-lastY;lastY=y;hdr.classList.toggle('scr',y>=140);
      if(y<140||document.querySelector('.drawer.on,#search.on,#pnav.on')||hdr.querySelector(':focus-visible')){set(false);acc=0;return}
      if(performance.now()<hold)return;
      acc=(Math.sign(dy)===Math.sign(acc)?acc:0)+dy;
      if(acc>14)set(true);else if(acc<-24)set(false)},{passive:true});
    hdr.addEventListener('focusin',()=>{if(hdr.querySelector(':focus-visible'))set(false)});
  }
  paintUser();
  addEventListener('storage',e=>{if(e.key==='cettoUser')paintUser()});
  menuPanes();
  ageGate();
  lightVideos();
  ambient();
  if(!opts.minimal)notesStrip();
  /* Modo captura: ?captura=1&ver=<id> abre la página ya posicionada en esa sección (para miniaturas) */
  if(CAPTURE){const ver=new URLSearchParams(location.search).get('ver');if(ver){const go=()=>{const el=document.getElementById(ver);if(el)scrollTo(0,el.getBoundingClientRect().top+scrollY-72)};go();setTimeout(go,300)}}
  if(CAPTURE){document.documentElement.classList.add('capture');const fin=()=>document.querySelectorAll('.lines,.fade').forEach(el=>el.classList.add('in'));fin();setTimeout(fin,300);setTimeout(fin,1500)}
  document.querySelectorAll('.ln>span').forEach(sp=>{if(!/\s$/.test(sp.textContent))sp.append(' ')});
  renderCart();
}

/* ---------- Menú: el panel derecho cambia según la sección (mouse o teclado); al abrir vuelve a "Vinos" ---------- */
function menuPanes(){
  const m=document.getElementById('menu');if(!m)return;const pr=m.querySelector('.mprim'),r=m.querySelector('.r'),panes=[...m.querySelectorAll('.mp')];let t=null,ct=null,pre=false;
  const wide=matchMedia('(min-width:901px)');
  const show=(k,sel)=>{const p=panes.find(x=>x.dataset.pane===k);if(!p)return;if(!p.classList.contains('on')){panes.forEach(x=>x.classList.toggle('on',x===p));r.scrollTop=0}
    pr.querySelectorAll('a[data-p]').forEach(a=>a.classList.toggle('cur',a.dataset.p===k));pr.classList.toggle('sel',!!sel)};
  /* sin hover el menú queda limpio (solo los links); el panel se abre al pasar por una sección y se cierra al salir del menú */
  const open=k=>{show(k,true);if(wide.matches)m.classList.add('xp')};
  const close=()=>{m.classList.remove('xp');pr.classList.remove('sel');pr.querySelectorAll('a.cur').forEach(a=>a.classList.remove('cur'))};
  /* celular: Vinos, Experiencias, Regalos y Nuestra historia se despliegan en lugar de navegar (su primera opción lleva a la página) */
  {const mob=matchMedia('(max-width:900px)');pr.querySelectorAll('li.has-sub').forEach(li=>{const a=li.querySelector(':scope>a'),sub=li.querySelector('.msub');a.setAttribute('aria-controls',sub.id);
     const sync=()=>{if(mob.matches)a.setAttribute('aria-expanded',li.classList.contains('open'));else a.removeAttribute('aria-expanded')};sync();mob.addEventListener('change',sync)});
   pr.addEventListener('click',e=>{if(!mob.matches)return;const a=e.target.closest('li.has-sub>a');if(!a||!pr.contains(a))return;e.preventDefault();e.stopPropagation();
     const li=a.parentElement,op=!li.classList.contains('open');pr.querySelectorAll('li.has-sub.open').forEach(x=>{if(x!==li){x.classList.remove('open');x.querySelector(':scope>a').setAttribute('aria-expanded','false')}});
     li.classList.toggle('open',op);a.setAttribute('aria-expanded',op)},true)}
  /* Inicio no tiene panel: al pasar por él se cierra el que esté abierto */
  pr.querySelectorAll('a:not([data-p])').forEach(a=>a.addEventListener('mouseenter',()=>{clearTimeout(t);clearTimeout(ct);t=setTimeout(close,60)}));
  pr.querySelectorAll('a[data-p]').forEach(a=>{
    a.addEventListener('mouseenter',()=>{clearTimeout(t);clearTimeout(ct);t=setTimeout(()=>open(a.dataset.p),60)});
    a.addEventListener('mouseleave',()=>clearTimeout(t));
    a.addEventListener('focus',()=>open(a.dataset.p))});
  m.addEventListener('mouseenter',()=>clearTimeout(ct));
  m.addEventListener('mouseleave',()=>{clearTimeout(t);ct=setTimeout(close,280)});
  m.addEventListener('focusout',e=>{if(!m.contains(e.relatedTarget))close()});
  /* al abrir: limpio, con Vinos listo; precarga las fotos de los paneles */
  document.getElementById('openMenu').addEventListener('click',()=>{close();show('vinos',false);if(!pre){pre=true;setTimeout(()=>m.querySelectorAll('.mp img[loading="lazy"]').forEach(i=>i.loading='eager'),700)}});
}

/* ---------- Navegador del prototipo (herramienta de presentación, no es parte del diseño) ---------- */
const PROTO=[
 ['Comprar',[['Portada',PAGES.home,'home'],['Tienda y filtros',PAGES.tienda,'tienda'],['Ficha de vino',PAGES.ficha+'?p=nebrp','ficha'],['Pago',PAGES.pago,'pago']]],
 ['Vivir el Valle',[['Experiencias',PAGES.exp,'exp'],['Reservar una cata',PAGES.exp+'#reservar']]],
 ['Regalar y pertenecer',[['Regalos',PAGES.regalos,'regalos'],['Club Cetto',PAGES.club,'club'],['Mi cuenta',PAGES.cuenta,'cuenta']]],
 ['Conocer y resolver',[['Historia',PAGES.hist,'hist'],['Ayuda',PAGES.ayuda,'ayuda']]]
];
const DEMO_KEYS=['cettoCart','cettoUser','cettoOrders','cettoBookings','cettoGift'];
function protoNav(opts){
  let hide=CAPTURE;try{hide=hide||sessionStorage.getItem('cettoProtoHide')==='1'}catch(e){}
  const w=document.createElement('div');
  w.innerHTML='<button class="pn-tab" id="pnTab" type="button" aria-controls="pnav" aria-expanded="false"'+(hide?' hidden':'')+'>Pantallas</button>'+
   '<aside class="pnav" id="pnav" role="dialog" aria-modal="true" aria-label="Pantallas del prototipo" aria-hidden="true" inert><div class="pn-h"><span class="cap">Prototipo · L.A. Cetto</span><button class="close" type="button" data-pn-close>'+xIcon+'Cerrar</button></div><div class="pn-b" id="pnBody"></div></aside>';
  document.body.append(...w.children);
  document.getElementById('pnTab').onclick=()=>openPN(opts);
  document.querySelectorAll('[data-proto]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();closeAll();setTimeout(()=>openPN(opts),60)}));
  document.querySelector('[data-pn-close]').onclick=()=>closePN();
}
function openPN(opts){
  const d=document.getElementById('pnav'),u=user(),n=Object.values(cart).reduce((a,b)=>a+b,0),o=store.get('cettoOrders',[]).length,b=store.get('cettoBookings',[]).length;
  const here=location.pathname.split('/').pop()+location.search+location.hash;
  document.getElementById('pnBody').innerHTML=PROTO.map(([g,items])=>'<div class="pn-g"><h3>'+g+'</h3><ul>'+items.map(([t,h,k])=>'<li><a href="'+h+'"'+(k&&opts.page===k&&!/#/.test(h)?' aria-current="page"':'')+'>'+t+'</a></li>').join('')+'</ul></div>').join('')+
   '<div class="pn-st"><h3>Estado de la demo</h3><dl><div><dt>Carrito</dt><dd>'+n+(n===1?' producto':' productos')+'</dd></div><div><dt>Cuenta</dt><dd>'+(u?String(u.name).replace(/</g,'&lt;'):'Sin sesión')+'</dd></div><div><dt>Pedidos</dt><dd>'+o+'</dd></div><div><dt>Reservas</dt><dd>'+b+'</dd></div></dl>'+
   '<p>Todo se guarda solo en este navegador. Nada se envía.</p><div class="pn-acts"><a class="btn btn-ink" href="'+PAGES.mapa+'">Mapa del prototipo</a><button class="ul" type="button" id="pnReset">Reiniciar demo</button><button class="ul" type="button" id="pnHide">Ocultar botón</button></div></div>';
  document.getElementById('pnReset').onclick=()=>{DEMO_KEYS.forEach(k=>store.del(k));location.reload()};
  document.getElementById('pnHide').onclick=()=>{try{sessionStorage.setItem('cettoProtoHide','1')}catch(e){}document.getElementById('pnTab').hidden=true;closePN()};
  lastFocus=opener();d.inert=false;d.classList.add('on');d.setAttribute('aria-hidden','false');document.getElementById('pnTab').setAttribute('aria-expanded','true');
  document.getElementById('scrim').classList.add('on');document.body.style.overflow='hidden';setTimeout(()=>d.querySelector('[data-pn-close]').focus(),50);
}
function closePN(quiet){const d=document.getElementById('pnav');if(!d||!d.classList.contains('on'))return;d.classList.remove('on');d.inert=true;d.setAttribute('aria-hidden','true');document.getElementById('pnTab').setAttribute('aria-expanded','false');
  if(!quiet){document.getElementById('scrim').classList.remove('on');document.body.style.overflow='';if(lastFocus)lastFocus.focus()}}

/* ---------- Medallas: disco dorado con laurel (y trofeo en los de 80 o más), como en el carrusel de la portada ---------- */
const AW_LAUREL=(()=>{let l='';const R=13.2;
  for(const side of [-1,1])for(let k=0;k<7;k++){const ang=side<0?112+k*20:68-k*20,rad=ang*Math.PI/180,cx=24+R*Math.cos(rad),cy=24+R*Math.sin(rad),rot=ang+(side<0?-62:62);
    l+='<ellipse cx="'+cx.toFixed(2)+'" cy="'+cy.toFixed(2)+'" rx="3.1" ry="1.3" transform="rotate('+rot.toFixed(0)+' '+cx.toFixed(2)+' '+cy.toFixed(2)+')"/>'}
  const st=[...Array(10)].map((_,i)=>{const a=(-90+i*36)*Math.PI/180,r=i%2?2.4:5.6;return (24+r*Math.cos(a)).toFixed(2)+','+(24.6+r*Math.sin(a)).toFixed(2)}).join(' ');
  return '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="currentColor">'+l+'<polygon points="'+st+'"/></g><path d="M18.5 36.6c2 1.4 3.7 2 5.5 2s3.5-.6 5.5-2" fill="none" stroke="currentColor" stroke-width=".9" stroke-linecap="round"/></svg>'})();
const AW_TROPHY='<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M17 14h14v3.2c0 4.6-2.9 8.1-7 8.6-4.1-.5-7-4-7-8.6zM23 26.2h2v5h-2zM19 31.6h10v2.6H19z"/><path fill="none" stroke="currentColor" stroke-width="1.4" d="M17 16h-3.2c0 3.4 1.6 5.4 4.2 5.8M31 16h3.2c0 3.4-1.6 5.4-4.2 5.8"/></svg>';
const awDiscs=m=>m?'<span class="aw" role="img" aria-label="'+m+' reconocimientos" title="'+m+' reconocimientos">'+(m>=80?'<i class="md">'+AW_TROPHY+'</i>':'')+'<i class="md">'+AW_LAUREL+'</i></span>':'';

/* ---------- Tarjeta de producto ---------- */
function card(id){const p=P[id];
 return '<article class="pc"><div class="fld"><a class="cover" href="'+PAGES.ficha+'?p='+id+'" aria-label="Ver '+p.line+' '+p.name+'"></a><img src="'+F(p.img,600)+'" alt="'+p.line+' '+p.name+'" loading="lazy">'+
  awDiscs(p.medals)+(p.cmp?'<span class="badge sale">Precio de temporada</span>':'')+
  '<button class="qa" data-add="'+id+'" aria-label="Agregar '+p.line+' '+p.name+' al carrito"><span class="t">Agregar</span>'+plus+'</button></div>'+
  '<div class="info"><span class="ln">'+p.line+'</span><h3 class="nm">'+p.name+(p.sub?' <small>'+p.sub+'</small>':'')+'</h3><span class="pr price">'+(p.cmp?'<s>'+money(p.cmp)+'</s>':'')+money(p.price)+'</span>'+(p.medals?'<span class="rec">'+p.medals+' reconocimientos</span>':'')+
  (priceNote(id)?'<span class="bx">'+priceNote(id)+'</span>':'')+'</div></article>'}

/* ---------- Revelados ---------- */
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function observeReveals(){
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{rootMargin:'0px 0px -12% 0px'});
  document.documentElement.classList.add('rv-on');document.querySelectorAll('.lines:not([data-now]),.fade:not([data-now]),.rise:not([data-now])').forEach(el=>io.observe(el));
  setTimeout(()=>document.querySelectorAll('[data-now]').forEach(el=>el.classList.add('in')),120);
}

/* "L.A. Cetto" nunca se parte en dos renglones: cambia el espacio por uno que no se rompe, también en lo que se pinta después */
(function(){const K='L.A. Cetto',RX=/L\.A\. Cetto/g,NB='L.A. Cetto',SKIP='script,style,textarea,[contenteditable]';
  const txt=t=>{if(t.nodeValue.indexOf(K)>-1&&!(t.parentElement&&t.parentElement.closest(SKIP)))t.nodeValue=t.nodeValue.replace(RX,NB)};
  const fix=n=>{if(n.nodeType===3){txt(n);return}if(n.nodeType!==1||n.closest(SKIP))return;const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT);let t;while((t=w.nextNode()))txt(t)};
  const go=()=>{fix(document.body);new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')fix(m.target);else m.addedNodes.forEach(fix)}}).observe(document.body,{childList:true,subtree:true,characterData:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go()})();

/* Carrusel en bucle: si los elementos no caben, se triplican y el carrusel arranca en la copia del centro;
   al acercarse a una orilla salta una copia completa (no se nota) y nunca se acaba. Si caben, solo se centran.
   o.center: función que devuelve el elemento que debe quedar al centro · o.auto: px por segundo de avance solo */
function loopRail(el,o){
  o=o||{};let L=el._loop;
  const pos=x=>x.getBoundingClientRect().left-el.getBoundingClientRect().left+el.scrollLeft;
  const orig=()=>[...el.children].filter(c=>!c.dataset.clone);
  const center=x=>{if(!x||!el.clientWidth)return;const sb=el.style.scrollBehavior;el.style.scrollBehavior='auto';
    el.scrollLeft+=x.getBoundingClientRect().left+x.offsetWidth/2-(el.getBoundingClientRect().left+el.clientWidth/2);el.style.scrollBehavior=sb};
  const pick=()=>{const it=orig();return (L.o.center&&L.o.center())||it[Math.floor((it.length-1)/2)]};
  function build(fresh){
    const it=orig(),cw=el.clientWidth;if(!cw||it.length<2){L.on=false;return}
    const had=!!el.querySelector('[data-clone]');
    if(fresh&&had)el.querySelectorAll('[data-clone]').forEach(c=>c.remove());
    const last=it[it.length-1],gap=parseFloat(getComputedStyle(el).columnGap)||0,wide=pos(last)+last.offsetWidth-pos(it[0])+gap;
    const want=wide>cw*.92;
    if(want&&!el.querySelector('[data-clone]')){
      const mk=side=>it.map(n=>{const c=n.cloneNode(true);c.dataset.clone=side;c.setAttribute('aria-hidden','true');c.removeAttribute('id');
        c.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));if(c.matches('a,button'))c.tabIndex=-1;c.querySelectorAll('a,button,input,[tabindex]').forEach(x=>x.tabIndex=-1);return c});
      el.prepend(...mk('a'));el.append(...mk('b'));L.on=true;el.classList.remove('lr-static');el.classList.add('lr-on')}
    else if(!want){el.querySelectorAll('[data-clone]').forEach(c=>c.remove());L.on=false;el.classList.add('lr-static');el.classList.remove('lr-on')}
    if(L.on){const b=el.querySelector('[data-clone="b"]');L.s=pos(it[0]);L.w=pos(b)-L.s}
    if(fresh||!had)center(pick())}
  if(!L){L=el._loop={o,on:false,w:0,s:0};
    el.addEventListener('scroll',()=>{if(!L.on||!L.w)return;const c=el.scrollLeft+el.clientWidth/2;let d=0;if(c<L.s)d=L.w;else if(c>L.s+L.w)d=-L.w;
      if(d){const sb=el.style.scrollBehavior;el.style.scrollBehavior='auto';el.scrollLeft+=d;el.style.scrollBehavior=sb;el.dispatchEvent(new CustomEvent('loopjump',{detail:d}))}},{passive:true});
    let cw0=0;new ResizeObserver(()=>{const cw=el.clientWidth;if(cw===cw0)return;const first=!cw0;cw0=cw;build(first)}).observe(el);
    if(o.auto&&!matchMedia('(prefers-reduced-motion: reduce)').matches){let hold=0,vis=false,acc=0,t0=0;
      const stop=()=>hold++,go=()=>{hold=Math.max(0,hold-1)};el.addEventListener('pointerenter',stop);el.addEventListener('pointerleave',go);
      el.addEventListener('focusin',stop);el.addEventListener('focusout',go);el.addEventListener('touchstart',()=>{hold++;setTimeout(go,3500)},{passive:true});
      new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){t0=0;requestAnimationFrame(tick)}}).observe(el);
      function tick(t){if(!vis)return;if(t0&&!hold&&L.on){acc+=o.auto*Math.min(.05,(t-t0)/1000);const n=Math.trunc(acc);if(n){el.scrollLeft+=n;acc-=n}}t0=t;requestAnimationFrame(tick)}}
  }else L.o=o;
  build(true);
  return L;
}
