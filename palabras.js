/* =========================================================
   Kuma - Palabras básicas (6 lecciones + examen)
   Se carga DESPUÉS de alfabeto.js y de saludos.js.
   Reutiliza: azar, barajar, mezclarSinRepetir, kumaImg, corazon,
   mensajeKuma, leerEstado, guardarEstado, rachaActual, sumarRacha,
   sonido, icono, limpiar, VIDAS, INTERVALOS_DIAS, vista, rutas.
   Estilos: saludos.css + palabras.css
   ========================================================= */

/* ---------- 0) CONFIGURACIÓN ---------- */

// Carpeta de las imágenes. Cada imagen se busca como:
// assets/assets/¿CUÁL.jpeg, assets/assets/Bien.jpeg ...
const PAL_RUTA = "assets/assets/";
const PAL_EXT = "jpeg";           // por defecto; una seña puede traer su propia "ext" (¿Como = png)

// Créditos (imágenes y textos)
const PAL_FUENTE = "Diccionario Básico de la Lengua de Señas Colombiana, INSOR e Instituto Caro y Cuervo (2006)";
const PAL_ENLACE = "https://educativo.insor.gov.co/diccionario/";

/* Cada palabra:
   - nombre: texto plano. preg:true -> se muestra como «¿Nombre?»
   - variantes: una o más imágenes/formas de hacer la seña ("archivo" SIN extensión, tal cual)
   - hueco: frase con ___ para el ejercicio de completar */
const PALABRAS = [
  {
    id: "como", nombre: "Cómo", preg: true, tipo: "adv.",
    definicion: "De qué modo o manera ocurre una cosa.",
    variantes: [{ archivo: "¿Como", ext: "png",
      como: "Las manos en ‘5’ con las palmas hacia atrás y las puntas de los dedos hacia abajo, giran hacia afuera hasta quedar con las palmas hacia arriba y las puntas de los dedos hacia adelante. Los hombros y las cejas se elevan." }],
    ejemplos: [{ glosa: "PLATA RECAUDAR NO CÓMO(?)", texto: "No se recaudó nada de dinero. ¿Cómo es eso?" }],
    hueco: "No se recaudó nada de dinero. ¿___ es eso?"
  },
  {
    id: "cual", nombre: "Cuál", preg: true, tipo: "pron.",
    definicion: "Pregunta para indagar por la preferencia entre varias opciones.",
    variantes: [{ archivo: "¿CUÁL",
      como: "Las manos en ‘A’ con el pulgar extendido, se mueven alternadamente hacia arriba y hacia abajo. Los hombros y las cejas se elevan." }],
    ejemplos: [{ glosa: "PRO1 PREGUNTAR MAMÁ CALI BARRANQUILLA CARTAGENA CIUDAD VIAJAR GUSTAR CUAL(?)", texto: "Le pregunté a mi mamá a cuál ciudad quería viajar: Cali, Barranquilla o Cartagena." }],
    hueco: "Le pregunté a mi mamá a ___ ciudad quería viajar: Cali, Barranquilla o Cartagena."
  },
  {
    id: "cuando", nombre: "Cuándo", preg: true, tipo: "adv.",
    definicion: "En qué tiempo o momento sucederá o se hará algo.",
    variantes: [{ archivo: "¿CUÁNDO",
      como: "La mano en ‘5’ con los dedos juntos golpea suavemente la mejilla varias veces con la yema de los dedos." }],
    ejemplos: [{ glosa: "PRO2 VIAJAR CARTAGENA CUÁNDO (?)", texto: "¿Cuándo viajas a Cartagena?" }],
    hueco: "¿___ viajas a Cartagena?"
  },
  {
    id: "cuanto", nombre: "Cuánto", preg: true, tipo: "pron.",
    definicion: "Pregunta por el número, por la cantidad o por la intensidad de algo.",
    variantes: [{ archivo: "¿CUÁNTO",
      como: "La mano cerrada o en ‘Q’ con la palma hacia arriba se abre. Los labios permanecen estirados. Puede realizarse con las dos manos." }],
    ejemplos: [{ glosa: "ZAPATO CUÁNTO PLATA (?)", texto: "¿Cuánto cuestan los zapatos?" }],
    hueco: "¿___ cuestan los zapatos?"
  },
  {
    id: "donde", nombre: "Dónde", preg: true, tipo: "adv.",
    definicion: "En qué lugar o en qué sitio.",
    variantes: [{ archivo: "¿DÓNDE",
      como: "Las manos en ‘5’ con las palmas hacia arriba realizan simultáneamente movimientos cortos de adentro hacia fuera. Los hombros y las cejas se elevan." }],
    ejemplos: [{ glosa: "ÍNDEX MAMÁ // DÓNDE (?) // PRO2 ACOMPAÑAR", texto: "Allá está mamá. ¿Dónde? Acompáñame." }],
    hueco: "Allá está mamá. ¿___? Acompáñame."
  },
  {
    id: "porque", nombre: "Por qué", preg: true, tipo: "pron. interr.",
    definicion: "Causa, razón o motivo de algo.",
    variantes: [{ archivo: "¿POR-QUÉ",
      como: "La mano en ‘5’ toca con el dedo medio la frente y luego se mueve hacia adelante. Se frunce el ceño y se elevan los hombros." }],
    ejemplos: [{ glosa: "POR-QUÉ (?) PRO2 NO IR PASEO ACOMPAÑAR AMIGO(x2) POR-QUÉ (?)", texto: "¿Por qué no vas de paseo y acompañas a tus amigos?" }],
    hueco: "¿___ no vas de paseo y acompañas a tus amigos?"
  },
  {
    id: "que", nombre: "Qué", preg: true, tipo: "pron.",
    definicion: "Pregunta por la naturaleza, la cantidad, la calidad o la intensidad de algo.",
    variantes: [{ archivo: "¿QUÉ",
      como: "La mano en ‘1’ desliza la punta del índice en línea recta, desde el borde interno hacia el externo, sobre la palma de la mano contraria que se encuentra en ‘5’ con la punta de los dedos hacia adelante. Los hombros y las cejas se elevan." }],
    ejemplos: [{ glosa: "ÍNDEX SEÑOR ÍNDEX VENDER QUÉ (?)", texto: "¿Qué le vendiste a ese señor?" }],
    hueco: "¿___ le vendiste a ese señor?"
  },
  {
    id: "quien", nombre: "Quién", preg: true, tipo: "pron.",
    definicion: "Pregunta que indaga por una persona.",
    variantes: [{ archivo: "¿QUIÉN",
      como: "La mano en ‘B’ con el borde externo hacia adelante golpea varias veces el mentón con el borde interno. Los hombros y las cejas se elevan." }],
    ejemplos: [{ glosa: "PODER PRO1 AYUDAR TAREA QUIÉN (?)", texto: "¿Quién me puede ayudar con la tarea?" }],
    hueco: "¿___ me puede ayudar con la tarea?"
  },
  {
    id: "bien", nombre: "Bien", tipo: "adv.",
    definicion: "En buen estado o situación. Correctamente, adecuadamente.",
    variantes: [{ archivo: "Bien",
      como: "(Gesto natural) La mano cerrada con el pulgar extendido se coloca con el borde externo hacia abajo y la yema del pulgar hacia adelante. Puede acompañarse de un movimiento corto de arriba hacia abajo." }],
    ejemplos: [{ glosa: "ÍNDEX DEBER ESFORZAR TRABAJAR BIEN", texto: "Él debe esforzarse por trabajar bien." }],
    hueco: "Él debe esforzarse por trabajar ___."
  },
  {
    id: "importante", nombre: "Importante", tipo: "adj.",
    definicion: "Que tiene valor o interés para algo o alguien.",
    variantes: [{ archivo: "Importante",
      como: "Las manos con las yemas de los dedos índice y pulgar unidas, los demás dedos extendidos, y las palmas hacia abajo, se tocan por las puntas de los dedos unidos. Luego se mueven simultáneamente hacia afuera y hacia arriba hasta quedar nuevamente en la posición inicial." }],
    ejemplos: [{ glosa: "ASAMBLEA TODO-EL-DÍA ASAMBLEA INFORMAR IMPORTANTE INFORMAR", texto: "La asamblea será todo el día y darán información importante." }],
    hueco: "La asamblea será todo el día y darán información ___."
  },
  {
    id: "imposible", nombre: "Imposible", tipo: "adj.",
    definicion: "Que no se puede realizar, lograr, conseguir.",
    variantes: [{ archivo: "Imposible", ext: "png",
      como: "Los brazos cruzados formando una equis, con las manos cerradas y las palmas hacia atrás, se mueven simultáneamente hacia afuera, al tiempo que giran hasta quedar con las palmas hacia adelante." }],
    ejemplos: [{ glosa: "PRO1 PROPAGAR COMENTARIO (x2) IMPOSIBLE", texto: "Es imposible que yo propague comentarios." }],
    hueco: "Es ___ que yo propague comentarios."
  },
  {
    id: "mal", nombre: "Mal", tipo: "adv.",
    definicion: "De modo imperfecto, impreciso, inexacto.",
    variantes: [{ archivo: "Mal",
      como: "(Gesto natural) La mano cerrada con el pulgar extendido y la punta hacia abajo se coloca con la palma hacia adelante. Puede acompañarse de movimientos cortos de arriba hacia abajo." }],
    ejemplos: [{ glosa: "GRUPO FÚTBOL JUGAR MAL", texto: "El equipo de fútbol jugó mal." }],
    hueco: "El equipo de fútbol jugó ___."
  },
  {
    id: "masomenos", nombre: "Más o menos", tipo: "adv.",
    definicion: "De manera aproximada.",
    variantes: [{ archivo: "Mas o menos",
      como: "(Gesto natural) La mano en ‘5’ con el borde externo hacia abajo y los dedos hacia adelante realiza movimientos cortos de adentro hacia afuera varias veces. La cabeza se inclina levemente. (Véase PARECER –Acciones y distracciones–)" }],
    ejemplos: [{ glosa: "PRO1 RECORDAR MÁS-O-MENOS 18 EDAD JOVEN PRO1 NOVIO TENER", texto: "Yo recuerdo que más o menos a la edad de 18 años, muy joven, tuve un novio." }],
    hueco: "Yo recuerdo que ___ a la edad de 18 años, muy joven, tuve un novio."
  },
  {
    id: "no", nombre: "No", tipo: "adv.",
    definicion: "Expresa negación.",
    variantes: [
      { archivo: "No1", como: "La mano en ‘V’, pero con el pulgar enfrentado a los dos dedos y las puntas de estos hacia adelante, une las yemas de los tres dedos." },
      { archivo: "No2", como: "La mano en ‘1’ se mueve repetidamente de un lado a otro." },
      { archivo: "No3", como: "(Gesto natural) La cabeza gira de un lado a otro, repetidas veces." }
    ],
    ejemplos: [{ glosa: "ÍNDEX PERRO AGUA NO-QUERER", texto: "El perro no quiere tomar agua." }],
    hueco: "El perro ___ quiere tomar agua."
  },
  {
    id: "nombre", nombre: "Nombre", tipo: "n.",
    definicion: "1. Palabra o conjunto de palabras con que se designa a una persona para distinguirla de las demás. 2. Palabra con la que se distingue o significa cualquier objeto.",
    variantes: [{ archivo: "Nombre",
      como: "La mano en ‘H’ golpea con el borde externo del dedo medio el borde interno del índice de la otra mano que se encuentra en la misma configuración. El movimiento se repite." }],
    ejemplos: [
      { glosa: "PRO1 NOMBRE J-O-R-G-E", texto: "Mi nombre es Jorge." },
      { glosa: "FRUTA NOMBRE P-E-R-A VERDE(x2)", texto: "Las frutas llamadas peras, están verdes." }
    ],
    hueco: "Mi ___ es Jorge."
  },
  {
    id: "si", nombre: "Sí", tipo: "adv.",
    definicion: "Manifiesta una respuesta afirmativa a una pregunta.",
    variantes: [
      { archivo: "Si1", como: "La mano cerrada con la palma hacia adelante se flexiona hacia abajo varias veces." },
      { archivo: "Si2", como: "(Gesto natural) La cabeza se mueve de arriba hacia abajo, varias veces." }
    ],
    ejemplos: [{ glosa: "PRO2 IR PELUQUERÍA(?) SÍ, PRO1 IR ACOMPAÑAR HERMANO(x2)", texto: "¿Vas a ir a la peluquería? Sí, voy a ir con mis hermanas." }],
    hueco: "¿Vas a ir a la peluquería? ___, voy a ir con mis hermanas."
  }
];

const PAL_LECCIONES = [
  { id: 1, titulo: "Cómo, cuál y cuándo",        signos: ["como", "cual", "cuando"] },
  { id: 2, titulo: "Cuánto, dónde y por qué",    signos: ["cuanto", "donde", "porque"] },
  { id: 3, titulo: "Qué, quién y nombre",        signos: ["que", "quien", "nombre"] },
  { id: 4, titulo: "Bien, mal y más o menos",    signos: ["bien", "mal", "masomenos"] },
  { id: 5, titulo: "Importante e imposible",     signos: ["importante", "imposible"] },
  { id: 6, titulo: "Sí y no",                    signos: ["si", "no"] },
  { id: 7, titulo: "Examen de palabras básicas", signos: PALABRAS.map(s => s.id), final: true }
];

const PAL_MENSAJES = {
  mapa: ["Con estas palabras ya puedes preguntar y responder.", "Preguntar, opinar, decir sí o no… ¡manos a la obra!", "Elige una lección, ¡yo te acompaño!"],
  final: ["¡Palabras básicas dominadas! Ya puedes mantener una conversación.", "¡Qué manos tan rápidas! Estás listo para más."]
};

/* ---------- 1) UTILIDADES ---------- */

let PP = null; // progreso guardado
let PS = null; // sesión de la lección en curso

const palPorId = id => PALABRAS.find(s => s.id === id);
const palTitulo = d => d.preg ? `¿${d.nombre}?` : d.nombre;

function palEstado(p) {
  if (!p.palabras) p.palabras = { completadas: [], estrellas: {}, cajas: {} };
  return p.palabras;
}
function palSonido(nombre) { if (typeof sonido === "function") sonido(nombre); }

// Variante (forma de la seña) elegida para este paso; se guarda para que no cambie al redibujar
function palVar(s, id) {
  s.vv = s.vv || {};
  if (s.vv[id] === undefined) s.vv[id] = Math.floor(Math.random() * palPorId(id).variantes.length);
  return s.vv[id];
}

function palImg(id, revelar, k) {
  const d = palPorId(id);
  const idx = k || 0;
  const v = d.variantes[idx];
  const alt = revelar ? `Seña de «${palTitulo(d)}»` : "Imagen de una seña";
  return `<img class="sena-img" src="${PAL_RUTA}${encodeURIComponent(v.archivo)}.${v.ext || PAL_EXT}" alt="${limpiar(alt)}" draggable="false" loading="lazy" onerror="palFalta(this,'${id}',${idx})">`;
}
// Si falta la imagen, avisa qué nombre de archivo espera
function palFalta(img, id, k) {
  const v = palPorId(id).variantes[k || 0];
  const d = document.createElement("div");
  d.className = "sena-falta";
  d.innerHTML = `${icono("hand")}<small>Falta imagen<br>${limpiar(v.archivo)}.${v.ext || PAL_EXT}</small>`;
  img.replaceWith(d);
}

// Repetición espaciada (guardada aparte de alfabeto y saludos)
function palRegistrar(p, id, ok) {
  const cajas = palEstado(p).cajas;
  const c = cajas[id] || { caja: 0, prox: 0 };
  c.caja = ok ? Math.min(c.caja + 1, 5) : 0;
  c.prox = Date.now() + INTERVALOS_DIAS[c.caja] * 86400000;
  cajas[id] = c;
}
function palPendiente(p, id) { const c = palEstado(p).cajas[id]; return !!c && c.prox <= Date.now(); }
function palAprendidos(p) {
  const cajas = palEstado(p).cajas;
  return PALABRAS.map(s => s.id).filter(id => Object.hasOwn(cajas, id));
}

/* ---------- 2) CREAR LOS EJERCICIOS ---------- */

const PAL_TIPOS = ["sena2nombre", "nombre2sena", "definicion", "frase", "movimiento", "vf"];

function palPaso(tipo, id, extra) { return { tipo, id, ...(extra || {}) }; }
function palParejas(ids) { return palPaso("parejas", null, { ids: [...ids], fallos: 0, hechas: [] }); }

function palOpciones(id, pool) {
  const n = Math.max(3, Math.min(4, pool.length));
  let otros = barajar(pool.filter(x => x !== id));
  if (otros.length < n - 1) otros = otros.concat(barajar(PALABRAS.map(s => s.id).filter(x => x !== id && !otros.includes(x))));
  return barajar([id, ...otros.slice(0, n - 1)]);
}

function palCrearPasos(L, p) {
  if (L.id === "repaso") {
    const aprendidos = palAprendidos(p);
    const pendientes = aprendidos.filter(id => palPendiente(p, id));
    const ids = pendientes.length ? pendientes : barajar(aprendidos).slice(0, 8);
    const pasos = ids.map((id, i) => palPaso(PAL_TIPOS[i % PAL_TIPOS.length], id));
    return { pasos: mezclarSinRepetir(pasos), pool: ids };
  }

  if (L.final) {
    const ids = barajar(PALABRAS.map(s => s.id));
    const pasos = ids.map((id, i) => palPaso(PAL_TIPOS[i % PAL_TIPOS.length], id));
    pasos.push(palParejas(barajar(ids).slice(0, 4)));
    pasos.push(palParejas(barajar(ids).slice(0, 4)));
    pasos.push(palPaso("movimiento", azar(ids)));
    pasos.push(palPaso("frase", azar(ids)));
    return { pasos: mezclarSinRepetir(pasos), pool: ids };
  }

  const nuevos = L.signos;
  const previos = PAL_LECCIONES.filter(x => x.id < L.id && !x.final).flatMap(x => x.signos);
  const pool = [...nuevos, ...previos];

  const inicio = [];
  nuevos.forEach(id => { inicio.push(palPaso("ensena", id)); inicio.push(palPaso("sena2nombre", id)); });

  const resto = [];
  nuevos.forEach(id => {
    resto.push(palPaso("nombre2sena", id));
    resto.push(palPaso(azar(["definicion", "frase", "movimiento", "vf"]), id));
  });
  resto.push(palParejas([...nuevos, ...(previos.length ? [azar(previos)] : [])]));

  // Repaso de lo anterior: primero lo que "toca" repasar
  const pend = barajar(previos.filter(id => palPendiente(p, id)));
  const otros = barajar(previos.filter(id => !pend.includes(id)));
  [...pend, ...otros].slice(0, 2).forEach((id, i) => resto.push(palPaso(PAL_TIPOS[(i + 2) % PAL_TIPOS.length], id)));

  return { pasos: inicio.concat(mezclarSinRepetir(resto)), pool };
}

/* ---------- 3) PANTALLA: MAPA DE PALABRAS BÁSICAS ---------- */

function pantallaPalabras() {
  const p = leerEstado();
  const e = palEstado(p);
  const racha = rachaActual(p);
  const siguiente = PAL_LECCIONES.find(l => !e.completadas.includes(l.id));
  const hechas = e.completadas.length;
  const aprendidos = palAprendidos(p);
  const pendientes = aprendidos.filter(id => palPendiente(p, id)).length;

  const nodos = PAL_LECCIONES.map((l, i) => {
    const comp = e.completadas.includes(l.id);
    const bloq = l.id > 1 && !e.completadas.includes(l.id - 1);
    const actual = siguiente && siguiente.id === l.id;
    const est = e.estrellas[l.id] || 0;
    const nombres = l.final ? `Las ${PALABRAS.length} palabras · repaso total` : l.signos.map(id => palTitulo(palPorId(id))).join(" · ");
    const cuerpo = `<span class="nodo-num">${bloq ? icono("lock") : l.id}</span>
      <span class="nodo-texto"><strong>${l.titulo}</strong><small>${limpiar(nombres)}</small></span>
      <span class="nodo-estrellas" aria-label="${est} de 3 estrellas">${"★".repeat(est)}${"☆".repeat(3 - est)}</span>`;
    const cls = `nodo ${comp ? "completada" : ""} ${actual ? "actual" : ""} ${bloq ? "bloqueada" : ""}`;
    return bloq
      ? `<div class="${cls}" style="--d:${i}" aria-disabled="true">${cuerpo}</div>`
      : `<a class="${cls}" style="--d:${i}" href="#/palabra/${l.id}">${cuerpo}</a>`;
  }).join("");

  const msg = hechas === PAL_LECCIONES.length ? azar(PAL_MENSAJES.final) : azar(PAL_MENSAJES.mapa);
  const repaso = aprendidos.length
    ? `<a class="boton" href="#/palabra/repaso">${icono("play")} REPASAR${pendientes ? ` (${pendientes})` : ""}</a>`
    : `<button class="boton gris" data-aviso="Completa una actividad de palabras básicas para desbloquear el repaso">${icono("lock")} REPASAR</button>`;

  return `
  <section class="pantalla alfa">
    <div class="banner">${icono("book")}<div><h1>Palabras básicas</h1><p>${PAL_LECCIONES.length} lecciones · pregunta, opina y responde en LSC</p></div><img class="banner-kuma" src="${kumaImg("feliz")}" alt="" aria-hidden="true"></div>
    <div class="alfa-stats">
      <span class="chip-juego chip-racha">${icono("flame")}Racha: ${racha}</span>
      <span class="chip-juego chip-xp">${icono("star")}${p.xp} XP</span>
      <span class="chip-juego">${icono("book")}${hechas} / ${PAL_LECCIONES.length} lecciones</span>
    </div>
    <div class="alfa-kuma"><img src="${kumaImg("normal")}" alt="" aria-hidden="true"><div class="burbuja-kuma">${limpiar(msg)}</div></div>
    <div class="camino">${nodos}</div>
    <div class="tarjeta sal-creditos">
      <h2>Créditos</h2>
      <p>Imágenes y textos de las señas: <strong>${PAL_FUENTE}</strong>.</p>
      <p>Diccionario virtual: <a href="${PAL_ENLACE}" target="_blank" rel="noopener">${PAL_ENLACE}</a></p>
    </div>
    <div class="alfa-acciones">
      <div class="tarjeta accion"><h2>Repaso espaciado</h2><p>${aprendidos.length ? (pendientes ? `Hay ${pendientes} palabra(s) esperando su repaso.` : "Todo al día. ¡Repasar de más no hace daño!") : "Se activa cuando practiques una palabra básica."}</p>${repaso}</div>
      <div class="tarjeta accion"><h2>Flashcards de palabras básicas</h2><p>Mira la seña, adivina qué significa y voltea la tarjeta.</p><a class="boton" href="#/flashcards" data-mazo="palabras">${icono("hand")} VER TARJETAS</a></div>
    </div>
    <a class="volver" href="#/lecciones">← Volver a lecciones</a>
  </section>`;
}

/* ---------- 4) PANTALLA: LECCIÓN ---------- */

function pantallaPalabra() {
  const par = location.hash.replace("#/", "").split("/")[1];
  PP = leerEstado();
  const e = palEstado(PP);
  let L;
  if (par === "repaso") {
    const aprendidos = palAprendidos(PP);
    if (!aprendidos.length) {
      location.replace("#/palabras");
      mostrarAviso("Practica una palabra básica para empezar a repasar");
      return;
    }
    L = { id: "repaso", titulo: "Repaso espaciado", signos: aprendidos };
  } else {
    L = PAL_LECCIONES.find(x => String(x.id) === par);
  }
  if (!L) { location.replace("#/palabras"); return; }
  if (typeof L.id === "number" && L.id > 1 && !e.completadas.includes(L.id - 1)) { location.replace("#/palabras"); mostrarAviso("Completa la lección anterior para abrir esta"); return; }
  palIniciar(L);
}

function palIniciar(L) {
  PP = leerEstado();
  const { pasos, pool } = palCrearPasos(L, PP);
  PS = {
    L, pasos, pool, i: 0, vidas: VIDAS, aciertos: 0, errores: 0, combo: 0, hechos: 0,
    fase: "pregunta", sel: null, ok: null, parSel: null, perdioAhora: false,
    racha: rachaActual(PP), msg: "", pose: "normal", tituloFb: ""
  };
  const primero = pasos[0];
  PS.msg = mensajeKuma(primero.tipo === "ensena" ? "ensena" : "inicio");
  PS.pose = primero.tipo === "ensena" ? "pensando" : "normal";
  palRender();
}

function palRender() {
  const s = PS.pasos[PS.i];
  const pct = Math.round((PS.hechos / PS.pasos.length) * 100);
  vista.innerHTML = `
  <section class="pantalla juego">
    <header class="juego-top">
      <button class="juego-cerrar" data-pacc="salir" aria-label="Salir de la lección">✕</button>
      <div class="barra" role="progressbar" aria-label="Progreso de la lección" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
      <span class="chip-juego chip-vidas ${PS.perdioAhora ? "pierde" : ""}" aria-label="${PS.vidas} vidas">${corazon()}${PS.vidas}</span>
      <span class="chip-juego chip-racha" aria-label="Racha de ${PS.racha} días">${icono("flame")}${PS.racha}</span>
    </header>
    <div class="juego-cuerpo">
      <div class="juego-tarjeta tarjeta">${palCuerpo(s)}</div>
      <aside class="juego-kuma"><div class="burbuja-kuma" aria-live="polite">${limpiar(PS.msg)}</div><img src="${kumaImg(PS.pose)}" alt="" aria-hidden="true"></aside>
    </div>
    ${palPie(s)}
  </section>`;
  PS.perdioAhora = false;
  const foco = vista.querySelector("[data-foco]");
  if (foco) foco.focus({ preventScroll: true });
}

function palClase(valor, correcto) {
  if (PS.fase === "feedback") {
    if (valor === correcto) return "correcta";
    if (valor === PS.sel && !PS.ok) return "incorrecta";
    return "";
  }
  return PS.sel === valor ? "sel" : "";
}

function palCuerpo(s) {
  const bloq = PS.fase === "feedback" ? "disabled" : "";
  const d = s.id ? palPorId(s.id) : null;
  // Opciones de texto. "plano" = sin signos de interrogación (para completar frases)
  const textos = (ids, plano) => {
    const ini = d ? /(^|[¿¡.?!] ?)___/.test(d.hueco) : true;
    return ids.map(x => {
      const dx = palPorId(x);
      const t = plano ? (ini ? dx.nombre : dx.nombre.toLowerCase()) : palTitulo(dx);
      return `<button class="opcion ${palClase(x, s.id)}" data-pop="${x}" ${bloq}>${limpiar(t)}</button>`;
    }).join("");
  };
  const imagenes = ids => ids.map((x, i) => `<button class="opcion opcion-sena ${palClase(x, s.id)}" data-pop="${x}" aria-label="Opción ${i + 1}" ${bloq}>${palImg(x, false, palVar(s, x))}</button>`).join("");

  if (s.tipo === "ensena") {
    const ej = d.ejemplos.map(e => `<li><span class="sal-glosa">${limpiar(e.glosa)}</span><span>${limpiar(e.texto)}</span></li>`).join("");
    const multi = d.variantes.length > 1;
    const grafico = multi
      ? `<div class="pal-variantes">${d.variantes.map((v, k) => `
          <div class="pal-variante">
            <span class="pal-forma">Forma ${k + 1} de ${d.variantes.length}</span>
            <div class="sena-grande">${palImg(s.id, true, k)}</div>
            <p>${limpiar(v.como)}</p>
          </div>`).join("")}</div>`
      : `<div class="sena-grande">${palImg(s.id, true, 0)}</div>`;
    return `<p class="juego-consigna">Nueva seña</p>
      ${grafico}
      <div class="sal-nombre">${limpiar(palTitulo(d))}</div>
      <div class="sal-info">
        <p><b>${d.tipo}</b> ${limpiar(d.definicion)}</p>
        ${multi ? `<p>Esta palabra se puede hacer de ${d.variantes.length} formas distintas.</p>` : `<p><b>Cómo se hace:</b> ${limpiar(d.variantes[0].como)}</p>`}
        <ul class="sal-ejemplos">${ej}</ul>
      </div>
      <p class="sal-credito">Fuente de imágenes y textos: ${PAL_FUENTE}.</p>`;
  }

  if (s.tipo === "sena2nombre") {
    s.opc = s.opc || palOpciones(s.id, PS.pool);
    return `<p class="juego-consigna">¿Qué significa esta seña?</p>
      <div class="sena-grande">${palImg(s.id, false, palVar(s, s.id))}</div>
      <div class="opciones opciones-textos">${textos(s.opc, false)}</div>`;
  }

  if (s.tipo === "nombre2sena") {
    s.opc = s.opc || palOpciones(s.id, PS.pool);
    return `<p class="juego-consigna">Encuentra la seña de</p>
      <div class="sal-nombre">${limpiar(palTitulo(d))}</div>
      <div class="opciones opciones-senas">${imagenes(s.opc)}</div>`;
  }

  if (s.tipo === "definicion") {
    s.opc = s.opc || palOpciones(s.id, PS.pool);
    return `<p class="juego-consigna">¿A qué seña corresponde esta definición?</p>
      <p class="sal-def">${limpiar(d.definicion)}</p>
      <div class="opciones opciones-textos">${textos(s.opc, false)}</div>`;
  }

  if (s.tipo === "frase") {
    s.opc = s.opc || palOpciones(s.id, PS.pool);
    const frase = limpiar(d.hueco).replace("___", '<span class="hueco">&nbsp;</span>');
    return `<p class="juego-consigna">Completa la frase con la seña correcta</p>
      <p class="sal-def sal-frase">${frase}</p>
      <div class="opciones opciones-textos">${textos(s.opc, true)}</div>`;
  }

  if (s.tipo === "movimiento") {
    s.opc = s.opc || palOpciones(s.id, PS.pool);
    const como = d.variantes[palVar(s, s.id)].como;
    return `<p class="juego-consigna">¿Cuál seña se hace así?</p>
      <p class="sal-def">${limpiar(como)}</p>
      <div class="opciones opciones-senas">${imagenes(s.opc)}</div>`;
  }

  if (s.tipo === "vf") {
    if (!s.vfId) {
      const otros = PS.pool.filter(x => x !== s.id);
      s.vfId = (Math.random() < 0.5 || !otros.length) ? s.id : azar(otros);
      s.vfEs = s.vfId === s.id;
    }
    const correcto = s.vfEs ? "v" : "f";
    const c = v => palClase(v, correcto);
    return `<p class="juego-consigna">¿Verdadero o falso?</p>
      <div class="sena-grande">${palImg(s.id, false, palVar(s, s.id))}</div>
      <p class="juego-consigna">Esta seña significa <span class="sal-nombre" style="font-size:1.6rem">«${limpiar(palTitulo(palPorId(s.vfId)))}»</span></p>
      <div class="opciones opciones-vf">
        <button class="opcion ${c("v")}" data-pop="v" ${bloq}>Verdadero</button>
        <button class="opcion ${c("f")}" data-pop="f" ${bloq}>Falso</button>
      </div>`;
  }

  if (s.tipo === "parejas") {
    s.izq = s.izq || barajar(s.ids);
    s.der = s.der || barajar(s.ids);
    const hecha = id => s.hechas.includes(id) ? "hecha" : "";
    const dis = id => s.hechas.includes(id) ? "disabled" : "";
    return `<p class="juego-consigna">Une cada palabra con su seña</p>
      <div class="parejas">
        <div class="par-col">${s.izq.map(id => `<button class="par-item par-texto ${hecha(id)}" data-ppar="l:${id}" ${dis(id)}>${limpiar(palTitulo(palPorId(id)))}</button>`).join("")}</div>
        <div class="par-col">${s.der.map((id, i) => `<button class="par-item ${hecha(id)}" data-ppar="s:${id}" aria-label="Seña ${i + 1}" ${dis(id)}>${palImg(id, false, palVar(s, id))}</button>`).join("")}</div>
      </div>`;
  }
  return "";
}

function palTextoFeedback(s) {
  let detalle;
  const n = s.id ? limpiar(palTitulo(palPorId(s.id))) : "";
  if (PS.ok) detalle = s.tipo === "parejas" ? "¡Todas las parejas unidas!" : `Esa es la seña de <b>${n}</b>`;
  else if (s.tipo === "parejas") detalle = "Te confundiste varias veces. ¡Vuelve a mirar las señas!";
  else if (s.tipo === "nombre2sena" || s.tipo === "movimiento") detalle = `Esta es la seña de <b>${n}</b>: <span class="sena-mini en-pie">${palImg(s.id, true, palVar(s, s.id))}</span>`;
  else detalle = `La respuesta era <b>${n}</b>`;
  return { titulo: PS.tituloFb, detalle };
}

function palPie(s) {
  if (PS.fase === "feedback") {
    const { titulo, detalle } = palTextoFeedback(s);
    return `<footer class="juego-pie ${PS.ok ? "ok" : "mal"}" role="status"><div class="juego-pie-in">
      <div class="pie-mensaje"><strong>${titulo}</strong><span>${detalle}</span></div>
      <button class="boton" data-pacc="siguiente" data-foco>CONTINUAR</button></div></footer>`;
  }
  if (s.tipo === "ensena") return `<footer class="juego-pie"><div class="juego-pie-in"><button class="boton" data-pacc="siguiente" data-foco>CONTINUAR</button></div></footer>`;
  if (s.tipo === "parejas") return `<footer class="juego-pie"><div class="juego-pie-in"><span class="pie-mensaje">Toca una palabra y luego su seña para unirlas.</span></div></footer>`;
  return `<footer class="juego-pie"><div class="juego-pie-in"><button class="boton" id="btn-palcomprobar" data-pacc="comprobar" ${PS.sel ? "" : "disabled"}>COMPROBAR</button></div></footer>`;
}

/* ---------- 5) LÓGICA DEL JUEGO ---------- */

function palEsCorrecta(s) {
  if (s.tipo === "vf") return PS.sel === (s.vfEs ? "v" : "f");
  return PS.sel === s.id;
}

function palComprobar() {
  if (PS.fase !== "pregunta" || !PS.sel) return;
  palResolver(palEsCorrecta(PS.pasos[PS.i]));
}

function palResolver(ok) {
  const s = PS.pasos[PS.i];
  PS.fase = "feedback";
  PS.ok = ok;
  let evento;
  if (ok) {
    PS.aciertos++; PS.combo++; PS.hechos++;
    evento = (PS.combo >= 3 && PS.combo % 3 === 0) ? "combo" : "acierto";
    PS.tituloFb = azar(["¡Correcto!", "¡Perfecto!", "¡Muy bien!", "¡Excelente!"]);
    PS.pose = "feliz";
    palSonido(evento);
  } else {
    PS.errores++; PS.combo = 0; PS.vidas--; PS.perdioAhora = true;
    evento = "error";
    PS.tituloFb = azar(["Casi…", "¡Ups!", "Aún no"]);
    PS.pose = "triste";
    palSonido("error");
    if (s.tipo === "parejas") PS.pasos.push(palParejas(s.ids));
    else PS.pasos.push(palPaso(azar(PAL_TIPOS.filter(t => t !== s.tipo)), s.id));
  }
  (s.tipo === "parejas" ? s.ids : [s.id]).forEach(id => palRegistrar(PP, id, ok));
  guardarEstado(PP);
  PS.msg = mensajeKuma(evento);
  palRender();
}

function palSiguiente() {
  if (!PS) return;
  const s = PS.pasos[PS.i];
  if (PS.fase === "pregunta" && s.tipo === "ensena") PS.hechos++;
  else if (PS.fase === "feedback" && PS.vidas <= 0) return palPerder();
  PS.i++; PS.sel = null; PS.parSel = null; PS.fase = "pregunta"; PS.ok = null;
  if (PS.i >= PS.pasos.length) return palTerminar();
  const n = PS.pasos[PS.i], len = PS.pasos.length;
  const ev = n.tipo === "ensena" ? "ensena" : PS.i === Math.floor(len / 2) ? "mitad" : PS.i === len - 1 ? "casi" : "animo";
  PS.msg = mensajeKuma(ev);
  PS.pose = ev === "ensena" ? "pensando" : "normal";
  palRender();
}

function palClickPareja(el) {
  const s = PS.pasos[PS.i];
  const [lado, id] = el.dataset.ppar.split(":");
  if (el.classList.contains("hecha")) return;
  const prev = PS.parSel;
  if (!prev || prev.lado === lado) {
    if (prev) prev.el.classList.remove("sel");
    PS.parSel = { lado, id, el };
    el.classList.add("sel");
    return;
  }
  if (prev.id === id) {
    [prev.el, el].forEach(x => { x.classList.remove("sel"); x.classList.add("hecha"); x.disabled = true; });
    s.hechas.push(id);
    PS.parSel = null;
    if (s.hechas.length === s.ids.length) setTimeout(() => { if (PS && PS.pasos[PS.i] === s && PS.fase === "pregunta") palResolver(s.fallos <= 2); }, 450);
  } else {
    s.fallos++;
    const a = prev.el, b = el;
    a.classList.remove("sel");
    [a, b].forEach(x => x.classList.add("sacude"));
    setTimeout(() => [a, b].forEach(x => x.classList.remove("sacude")), 450);
    PS.parSel = null;
  }
}

/* ---------- 6) FINAL ---------- */

function palTerminar() {
  palSonido("fin");
  const total = PS.aciertos + PS.errores;
  const prec = total ? PS.aciertos / total : 1;
  const est = prec >= 0.9 ? 3 : prec >= 0.7 ? 2 : 1;
  const xp = 10 + PS.aciertos * 2 + (est === 3 ? 10 : 0);
  const e = palEstado(PP);
  const esNumerica = typeof PS.L.id === "number";
  const eraNueva = esNumerica && !e.completadas.includes(PS.L.id);
  if (esNumerica) {
    if (eraNueva) e.completadas.push(PS.L.id);
    e.estrellas[PS.L.id] = Math.max(e.estrellas[PS.L.id] || 0, est);
  }
  PP.xp += xp;
  sumarRacha(PP);
  guardarEstado(PP);
  PS.fase = "fin";

  const siguienteL = PAL_LECCIONES.find(l => l.id === PS.L.id + 1);
  const msg = PS.L.final ? azar(PAL_MENSAJES.final) : mensajeKuma("fin");
  vista.innerHTML = `
  <section class="pantalla juego">
    <div class="tarjeta resultado">
      <img src="${kumaImg("celebra")}" alt="" aria-hidden="true">
      <h1>${PS.L.final ? "¡Palabras básicas completadas!" : PS.L.id === "repaso" ? "¡Repaso terminado!" : "¡Lección " + PS.L.id + " completada!"}</h1>
      <div class="estrellas-res" aria-label="${est} de 3 estrellas">${[1, 2, 3].map(n => `<span class="${n <= est ? "on" : ""}">★</span>`).join("")}</div>
      <div class="burbuja-kuma">${limpiar(msg)}</div>
      <div class="res-stats">
        <div><strong>+${xp}</strong><small>XP</small></div>
        <div><strong>${Math.round(prec * 100)}%</strong><small>Precisión</small></div>
        <div><strong>${rachaActual(PP)}</strong><small>Racha</small></div>
      </div>
      <div class="res-botones">
        ${siguienteL && eraNueva ? `<a class="boton grande" href="#/palabra/${siguienteL.id}">SIGUIENTE</a>` : ""}
        <button class="boton sec" data-pacc="reiniciar">REPETIR</button>
        <a class="boton sec" href="#/palabras">AL MAPA</a>
      </div>
    </div>
  </section>`;
}

function palPerder() {
  palSonido("perdio");
  PS.fase = "perdio";
  vista.innerHTML = `
  <section class="pantalla juego">
    <div class="tarjeta resultado">
      <img src="${kumaImg("triste")}" alt="" aria-hidden="true">
      <h1>Te quedaste sin vidas</h1>
      <div class="burbuja-kuma">${limpiar(mensajeKuma("perdio"))}</div>
      <p class="pista">Las palabras que fallaste quedaron anotadas para repasarlas pronto.</p>
      <div class="res-botones">
        <button class="boton" data-pacc="reiniciar" data-foco>INTENTAR DE NUEVO</button>
        <a class="boton sec" href="#/palabras">AL MAPA</a>
      </div>
    </div>
  </section>`;
  const f = vista.querySelector("[data-foco]"); if (f) f.focus({ preventScroll: true });
}

/* ---------- 7) EVENTOS, RUTAS Y MODO LECCIÓN ---------- */

vista.addEventListener("click", e => {
  if (!PS || !location.hash.startsWith("#/palabra/")) return;
  const el = e.target.closest("[data-pacc],[data-pop],[data-ppar]");
  if (!el) return;
  const acc = el.dataset.pacc;
  if (acc === "salir") {
    if (PS.fase === "fin" || PS.fase === "perdio" || confirm("¿Salir de la lección? Perderás el avance de esta sesión.")) location.hash = "#/palabras";
  } else if (acc === "siguiente") palSiguiente();
  else if (acc === "comprobar") palComprobar();
  else if (acc === "reiniciar") palIniciar(PS.L);
  else if (el.dataset.pop !== undefined && PS.fase === "pregunta") {
    PS.sel = el.dataset.pop;
    vista.querySelectorAll("[data-pop]").forEach(b => b.classList.toggle("sel", b === el));
    const b = document.getElementById("btn-palcomprobar"); if (b) b.removeAttribute("disabled");
  } else if (el.dataset.ppar !== undefined && PS.fase === "pregunta") palClickPareja(el);
});

rutas.palabras = pantallaPalabras;
rutas.palabra = pantallaPalabra;

// Esconde el menú también dentro de las lecciones de palabras (se registra después, así que manda sobre salModo)
function palModo() { document.body.classList.toggle("en-leccion", /^#\/(leccion|saludo|palabra)\//.test(location.hash)); }
window.addEventListener("hashchange", palModo);
palModo();

/* ---------- 8) FLASHCARDS DE PALABRAS BÁSICAS ---------- */
// Usa salMazo (definido en saludos.js) para saber qué mazo está activo.

// Una tarjeta por cada forma de la seña (No tiene 3, Sí tiene 2)
const PAL_TARJETAS = PALABRAS.flatMap(d => d.variantes.map((_, k) => `${d.id}:${k}`));
let palFiltro = "todas";
let palOrden = [...PAL_TARJETAS];

function palIdsFiltrados() {
  if (palFiltro === "todas") return palOrden;
  if (palFiltro === "aprendidas") {
    const hechas = palEstado(leerEstado()).completadas;
    const ok = PAL_LECCIONES.filter(l => !l.final && hechas.includes(l.id)).flatMap(l => l.signos);
    return palOrden.filter(k => ok.includes(k.split(":")[0]));
  }
  const L = PAL_LECCIONES.find(l => String(l.id) === palFiltro);
  return L ? palOrden.filter(k => L.signos.includes(k.split(":")[0])) : palOrden;
}

// Barra de mazos con los 3 mazos (sustituye la de saludos.js, que decía "pronto")
salBarraMazos = function () {
  const m = salMazo;
  const b = (id, nombre) => `<button class="fc-deck ${m === id ? "activo" : ""}" data-mazo="${id}" aria-pressed="${m === id}">${nombre}</button>`;
  return `<div class="fc-decks" role="group" aria-label="Mazos de tarjetas">${b("alfabeto", "Alfabeto")}${b("saludos", "Saludos")}${b("palabras", "Palabras básicas")}</div>`;
};

function palPantallaFlashcards() {
  const filtros = [["todas", "Todas"], ["aprendidas", "Mis aprendidas"], ...PAL_LECCIONES.filter(l => !l.final).map(l => [String(l.id), "Lección " + l.id])];
  const claves = palIdsFiltrados();
  const tarjetas = claves.length
    ? claves.map(k => {
        const [id, n] = k.split(":");
        const idx = Number(n);
        const d = palPorId(id);
        const forma = d.variantes.length > 1 ? `<small>Forma ${idx + 1} de ${d.variantes.length}</small>` : "";
        return `
      <button class="flashcard" data-pflip data-nombre="${limpiar(palTitulo(d))}" aria-pressed="false" aria-label="Tarjeta de seña. Toca para ver su significado">
        <span class="fc-inner">
          <span class="fc-cara fc-frente">${palImg(id, false, idx)}<small>Toca para voltear</small></span>
          <span class="fc-cara fc-dorso"><b class="sal-fc-nombre">${limpiar(palTitulo(d))}</b>${forma}<small>Toca para volver</small></span>
        </span>
      </button>`;
      }).join("")
    : `<div class="tarjeta fc-vacio">Aún no hay palabras aprendidas. ¡Completa la lección 1 de Palabras básicas y vuelve!</div>`;

  return `
  <section class="pantalla">
    <div class="banner">${icono("hand")}<div><h1>Flashcards</h1><p>Voltea la tarjeta y comprueba el significado</p></div><img class="banner-kuma" src="${kumaImg("pensando")}" alt="" aria-hidden="true"></div>
    ${salBarraMazos()}
    <div class="alfa-kuma"><img src="${kumaImg("normal")}" alt="" aria-hidden="true"><div class="burbuja-kuma">${limpiar(mensajeKuma("flash"))}</div></div>
    <div class="fc-filtros" role="group" aria-label="Filtrar señas">
      ${filtros.map(([id, nombre]) => `<button class="chip-filtro ${palFiltro === id ? "activo" : ""}" data-pfiltro="${id}" aria-pressed="${palFiltro === id}">${nombre}</button>`).join("")}
    </div>
    <div class="fc-barra">
      <span class="chip-juego">${claves.length} tarjeta(s)</span>
      <span><button class="boton" data-pfc="mezclar">Mezclar</button> <button class="boton gris" data-pfc="orden" style="cursor:pointer">Orden original</button></span>
    </div>
    <div class="fc-grid fc-grid-pal">${tarjetas}</div>
    <p class="sal-credito" style="margin:14px 4px 0">Fuente de imágenes y textos: ${PAL_FUENTE}.</p>
    <a class="volver" href="#/palabras">← Ir a las lecciones de palabras básicas</a>
  </section>`;
}

// Encadena con el wrapper de saludos.js: si el mazo es "palabras" usa el nuestro
const pantallaFlashcardsSaludos = pantallaFlashcards;
pantallaFlashcards = function () {
  if (salMazo === "palabras") return palPantallaFlashcards();
  return pantallaFlashcardsSaludos();
};
rutas.flashcards = pantallaFlashcards;

vista.addEventListener("click", e => {
  const el = e.target.closest("[data-mazo],[data-pflip],[data-pfiltro],[data-pfc]");
  if (!el) return;
  // Botón "Ver tarjetas" del mapa de palabras: deja elegido el mazo antes de navegar
  if (el.dataset.mazo === "palabras" && location.hash !== "#/flashcards") {
    salMazo = "palabras";
    return;
  }
  if (location.hash !== "#/flashcards" || salMazo !== "palabras") return;
  if (el.dataset.pflip !== undefined) {
    const vuelta = el.classList.toggle("volteada");
    el.setAttribute("aria-pressed", vuelta);
    el.setAttribute("aria-label", vuelta ? `Significado: ${el.dataset.nombre}. Toca para volver a la seña` : "Tarjeta de seña. Toca para ver su significado");
  } else if (el.dataset.pfiltro) { palFiltro = el.dataset.pfiltro; vista.innerHTML = pantallaFlashcards(); }
  else if (el.dataset.pfc === "mezclar") { palOrden = barajar(palOrden); vista.innerHTML = pantallaFlashcards(); }
  else if (el.dataset.pfc === "orden") { palOrden = [...PAL_TARJETAS]; vista.innerHTML = pantallaFlashcards(); }
});
