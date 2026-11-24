/* Videos del canal oficial de L.A. Cetto en YouTube (@VinosLACettoMx), ordenados por vino.
   Solo se asignan los videos cuyo título dice claramente de qué vino son.
   Tipo: nota = nota de cata oficial · catas = "Catas contigo" con un sommelier de la casa · cata = cata en restaurante o con invitados · mar = maridaje con un platillo */
const YT_CH={name:'Vinos L.A. Cetto',handle:'@VinosLACettoMx',url:'https://www.youtube.com/@VinosLACettoMx',sub:'https://www.youtube.com/@VinosLACettoMx?sub_confirmation=1',
  ig:'https://www.instagram.com/vinoslacetto/',fb:'https://www.facebook.com/VinosGpoCetto/',x:'https://x.com/vinoslacetto'};
const YTK={nota:'Nota de cata oficial',catas:'Catas contigo',cata:'Cata',mar:'Maridaje'};
/* [id de YouTube, título, duración, tipo, con quién] */
const YTV={
 nebrp:[['VCGLLEuSGuo','Nebbiolo Reserva Privada','4:16','cata'],['8e779UQIkrc','Cata vertical de nueve añadas de Nebbiolo Reserva Privada','5:29','cata'],['R8XDE9t94gU','Nebbiolo','1:41','catas','Omar Hernández'],['hMy-OuShVr8','Nebbiolo en Lombardi','3:14','cata'],
   ['99SxQIQlZ3E','Pecho de ternera con Nebbiolo','2:57','mar'],['fdva7SrmPjc','Pato poblano con Nebbiolo','1:57','mar'],['eNqSaSUu3rY','Mole xico con Nebbiolo','1:47','mar'],['lEmIScUIBfI','Manchamanteles con Nebbiolo','2:04','mar'],['SBM5db9wPjs','Medallones de res con Nebbiolo','1:59','mar'],['9PfnKIlHWk4','Salmón con Nebbiolo','2:00','mar'],['HdB6cuXNNHo','Pizza artesanal con Nebbiolo','2:28','mar']],
 psrp:[['KMv_LEiRgVM','Petite Sirah Reserva Privada','2:17','nota']],
 pslac:[['-7vylWb_wQM','Petite Sirah Línea Clásica','1:28','catas','Griselda Márquez']],
 cabrp:[['XdRfoQ0HKaU','Cabernet Sauvignon Reserva Privada','1:43','catas'],['px4tSXn-b78','Cabernet Sauvignon Reserva Privada con Pilar Meré','2:29','cata'],['ikit_IRiU9o','Cabernet Sauvignon Reserva Privada','0:58','catas','Griselda Márquez'],['_LlGl12xx6E','Cabernet Sauvignon Reserva Privada','1:29','catas','Fernando Ruíz de Chávez'],['YFAzVVbbNVw','Georg J. Riedel y nuestro Cabernet Sauvignon Reserva Privada','4:54','cata'],['4f4GN6KRajs','Filete al trapo con Cabernet Sauvignon Reserva Privada','2:25','mar']],
 charp:[['jww_k5Y0PBk','Chardonnay Reserva Privada en Tíos','3:13','cata'],['OedEPb6vh4U','Chardonnay Reserva Privada en Italimo','4:02','cata'],['dQlej94MSz4','Marlín ahumado con Chardonnay Reserva Privada','1:54','mar']],
 chenin:[['Orw-2IanqmM','Chenin Blanc Línea Clásica','2:09','catas','Omar Hernández'],['RbrJHDr8Qpk','Chenin Blanc con Pilar Meré en Italimo','4:31','cata'],['lc-FeCbCdic','Chenin Blanc','1:24','catas','Griselda Márquez'],
   ['sJ7jI3XM2B8','Mole poblano con Chenin Blanc','1:59','mar'],['xlg1qxBqLCo','Chile en nogada con Chenin Blanc','3:33','mar'],['0n_ufQ2OZNY','Ensalada de camarones con aguacate y Chenin Blanc','2:00','mar'],['MWuPUd3nj9k','Huevos motuleños y Chenin Blanc','1:02','mar'],['-xmBJrrIV_4','Tacos de jícama con Chenin Blanc','2:01','mar']],
 viog:[['voiKhcBnQ8A','Viognier Don Luis','2:43','nota'],['9Hjq-6fmbAo','Viognier Don Luis','1:03','catas','Griselda Márquez'],['AkNyxr_5HWk','Don Luis Viognier','3:12','cata']],
 terra:[['Cjby_9BFxJk','Terra Don Luis','0:59','catas','Griselda Márquez'],['QeLyukPJ0RY','Romeritos con Don Luis Terra','4:51','mar'],['Ub9YkrP3WXM','Don Luis Terra y lomo de cerdo','2:09','mar']],
 conc:[['yAgclN6ipqE','Don Luis Concordia','3:35','cata'],['eK6D-zBHDu0','Concordia','1:09','catas','Fernando Ruíz de Chávez'],['z6e2rtt_BQ8','Verde de lechón con Concordia','3:24','mar']],
 prim:[['LQqSGpV0TQY','Primavera Línea Estaciones','2:01','nota'],['RJK7paAUfvY','Estaciones Primavera 2018','1:06','cata'],['6yk3ciIq7z0','Ceviche reposado con Primavera','2:01','mar'],['OgkzWRYT1GE','Tostada de atún con Primavera','1:35','mar']],
 ver:[['hUtuKX4GGns','Verano Línea Estaciones','1:16','nota'],['Mdyy4pqJU6w','Verano Línea Estaciones','1:12','catas','Griselda Márquez'],['vInSYiA73U8','Verano','2:00','catas','Fernando Ruíz de Chávez']],
 oto:[['oLKn2BYEyRc','Otoño Línea Estaciones','0:46','catas','Griselda Márquez']],
 inv:[['KcL1WKFLT0s','Invierno','1:20','catas','Griselda Márquez']],
 champ:[['WB_JzRwBpKo','Champbrulé Brut','1:21','nota']],
 sbsb:[['5ycN0su5KlE','Sauvignon Blanc Sierra Blanca','1:24','nota'],['geS4blKNFiw','Sauvignon Blanc Sierra Blanca','4:41','cata'],['3zSCK_SbIbY','Sauvignon Blanc Sierra Blanca','1:17','catas','Fernando Ruíz de Chávez']],
 cablac:[['RssutwC7MfU','Cabernet Sauvignon Línea Clásica','1:42','catas','Omar Hernández']],
 bdz:[['2XSYdf2rmRM','Blanc de Zinfandel Línea Clásica','1:17','catas','Omar Hernández'],['ZPRMA8OsxRo','Blanc de Zinfandel','2:47','cata'],['AHkKsoCz9EU','Blanc de Zinfandel','1:02','catas','Griselda Márquez']],
 passito:[['6KG4AUgS7tM','Passito','2:15','catas','Omar Hernández']],
 sang:[['mQF5ZonDY4U','Sangiovese Boutique','1:49','nota'],['cmbwPA0MomU','Sangiovese','1:23','catas','Griselda Márquez'],['6OKtKBvb6gE','Sangiovese Boutique en Corazón de Maguey','5:09','cata']],
 dlmer:[['wx3PBjFFQI8','Don Luis Merlot','2:56','nota']],
 bsyr:[['n2GGFMghQLI','Syrah Boutique en ROCA','3:49','cata'],['h0WBVp-AqgI','Mamucas con Syrah','3:41','mar'],['Ert-BrEKzlM','Corte con salsa borracha y Syrah','3:30','mar']],
 bmal:[['GMMqNkXrZ9g','Malbec Boutique','1:21','nota'],['FLHlJLe25jQ','Malbec Boutique','1:09','catas','Griselda Márquez'],['pS6YZgnyc5o','Malbec Boutique en Los Danzantes','4:23','cata'],['udfXVYOQTLc','Filete de res con Malbec','3:05','mar']],
 bpin:[['BJsocho6dx8','Pinot Noir','1:35','catas','Griselda Márquez']],
 bbla:[['79EwFC-Bw1c','Chardonnay, Viognier y Pinot Noir Boutique','1:41','nota']],
 plyra:[['w85cL4GL-fE','Lyra Península con el enólogo Sebastián Suárez','4:42','cata'],['C_T_McM-I-w','Lyra','1:17','catas','Omar Hernández'],['MePsuprmBiQ','Pozole deconstruido con Lyra','4:02','mar']],
 pesp:[['usZ2RpxOf6k','Espaldera Línea Península','2:18','nota'],['xveAHv7CuxM','Espaldera','1:08','catas','Griselda Márquez']],
 sbtemp:[['lmmS1Zro16E','Tempranillo Sierra Blanca','1:13','catas','Fernando Ruíz de Chávez'],['2dHw1hPIV9M','Tempranillo Sierra Blanca con Pilar Meré en Italimo','5:20','cata']],
 sbcab:[['lJJZ-77UNAo','Cabernet Sauvignon Sierra Blanca','1:26','catas','Fernando Ruíz de Chávez'],['tCNGXScXcaw','Cabernet Sauvignon Sierra Blanca','2:57','cata']],
 sbzin:[['yDsFHIUYWvk','Zinfandel Rosé','1:09','catas','Griselda Márquez']],
 latemp:[['TqR9HOpaOVc','Tempranillo Línea Clásica','1:10','catas','Griselda Márquez']],
 lamer:[['9NlHDIJm4Zs','Merlot Línea Clásica','1:33','catas','Fernando Ruíz de Chávez']],
 lafume:[['fjHExsTM0oM','Fumé Blanc en BarTomate','3:02','cata'],['PKDiCt4re7c','Tostada de ceviche negro y Fumé Blanc','1:51','mar']],
 lachar:[['Sj7ugkOXFUw','Chardonnay Línea Clásica','1:16','catas','Fernando Ruíz de Chávez'],['HuHX6NsmSHs','Chardonnay Línea Clásica','0:50','catas','Griselda Márquez'],['FkF1bXHBz7k','Chardonnay Línea Clásica en Tíos','2:18','cata']],
 mospal:[['PWRp3536KN4','Moscatel y Palomino Reserva Privada','1:12','nota'],['wZhg5TQbtgE','Moscatel y Palomino','1:48','catas','Omar Hernández']]
};
/* las otras presentaciones usan los videos del mismo vino */
Object.assign(YTV,{terra375:YTV.terra,cabrp375:YTV.cabrp,fume375:YTV.lafume,cab375:YTV.cablac,cab187:YTV.cablac,bdz187:YTV.bdz,ps187:YTV.pslac});
/* del canal, sin vino específico */
const YT_GEN=[['HJbHTojq8v4','Entrevista con el Ing. Sebastián Suárez, enólogo de L.A. Cetto','4:01'],['sElQxgqEML0','¿Cuáles son los primeros varietales que se vendimian?','1:54'],['57DPdwST9hw','Taller del vino en la Boutique L.A. Cetto','1:20']];
const ytThumb=(id,q)=>'https://i.ytimg.com/vi/'+id+'/'+(q||'hqdefault')+'.jpg';
const ytWatch=id=>'https://www.youtube.com/watch?v='+id;
/* reproductor: se carga solo al dar clic (youtube-nocookie) */
const ytEmbed=(id,o)=>'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0'+(o&&o.mute?'&mute=1':'');

/* Reproductor en el mismo lugar: al pasar el mouse se ve un avance sin sonido; al dar clic se reproduce ahí mismo, con sonido.
   box: el contenedor de la portada (un botón con data-v adentro) */
function ytInline(box){
  if(box._play)return box._play;
  box.classList.add('yti');
  const hov=matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t=0,pv=null;
  /* sin subtítulos: cc_load_policy=0 y, ya cargado, se le pide al reproductor que quite el módulo de subtítulos */
  const src=(vid,prev)=>'https://www.youtube-nocookie.com/embed/'+vid+'?autoplay=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&enablejsapi=1&origin='+encodeURIComponent(location.origin)+(prev?'&mute=1&controls=0&disablekb=1&loop=1&playlist='+vid+'&start=6':'');
  const noCC=f=>{const send=()=>{try{f.contentWindow.postMessage(JSON.stringify({event:'command',func:'unloadModule',args:['captions']}),'*');f.contentWindow.postMessage(JSON.stringify({event:'command',func:'unloadModule',args:['cc']}),'*')}catch(e){}};
    f.addEventListener('load',()=>{try{f.contentWindow.postMessage(JSON.stringify({event:'listening'}),'*')}catch(e){}[300,1200,2500,4500,8000].forEach(t=>setTimeout(send,t))})};
  const mk=(vid,cls,title,prev)=>{const f=document.createElement('iframe');f.className=cls;f.src=src(vid,prev);f.title=title;f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';if(prev){f.tabIndex=-1;f.setAttribute('aria-hidden','true')}noCC(f);return f};
  const clearPv=()=>{clearTimeout(t);if(pv){pv.remove();pv=null}box.classList.remove('pv')};
  if(hov){
    box.addEventListener('pointerenter',()=>{if(box.classList.contains('playing'))return;const b=box.querySelector('[data-v]');if(!b)return;clearTimeout(t);
      t=setTimeout(()=>{pv=mk(b.dataset.v,'yti-pv','',true);const me=pv;pv.onload=()=>setTimeout(()=>{if(pv===me)box.classList.add('pv')},450);box.prepend(pv)},260)});
    box.addEventListener('pointerleave',clearPv)}
  function play(vid,title){clearPv();box.querySelectorAll('.yti-pl').forEach(x=>x.remove());
    const f=mk(vid,'yti-pl',String(title||'Video').replace(/^Reproducir el video: /,''),false);box.append(f);box.classList.add('playing');try{f.focus()}catch(e){}}
  box.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b||!box.contains(b))return;e.preventDefault();play(b.dataset.v,b.getAttribute('aria-label'))});
  /* para cambiar de video desde fuera (lista de catas) */
  box._play=(vid,title,faceHTML)=>{if(faceHTML){clearPv();box.classList.remove('playing');box.innerHTML=faceHTML}play(vid,title)};
  return box._play;
}
