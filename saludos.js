/* =========================================================
   Kuma - Saludos (5 lecciones)
   Se carga DESPUÉS de alfabeto.js (reutiliza sus funciones:
   azar, barajar, mezclarSinRepetir, kumaImg, corazon, mensajeKuma,
   leerEstado, guardarEstado, rachaActual, sumarRacha, sonido).
   No cambia nada de lo existente.
   ========================================================= */

/* ---------- 0) CONFIGURACIÓN ---------- */

// Carpeta de las imágenes y formato. Cada imagen se busca como:
// assets/assets/DECIR HOLA.png, assets/assets/DECIR ADIÓS.png ...
const SAL_RUTA = "assets/assets/";
const SAL_EXT = "png";

// Créditos de la fuente (se muestran en las lecciones y en el mapa)
const SAL_FUENTE = "Diccionario Básico de la Lengua de Señas Colombiana, INSOR e Instituto Caro y Cuervo (2006)";
const SAL_ENLACE = "https://educativo.insor.gov.co/diccionario/";

// Cada seña: "archivo" es el nombre de la imagen SIN el .png (tal cual lo escribiste).
const SALUDOS = [
  {
    id: "hola", archivo: "DECIR HOLA", nombre: "Hola", tipo: "loc.",
    definicion: "Expresión familiar de saludo.",
    como: "La mano en ‘5’ se coloca con la palma hacia adentro. Las cejas se elevan y se vocaliza la palabra. La mano siempre se dirige hacia el lugar del interlocutor.",
    ejemplos: [{ glosa: "OFICINA ÍNDEX ENTRAR DECIR-HOLA ÍNDEX EMPEZAR TRABAJAR", texto: "Cuando entró a la oficina nos dijo ‘hola’ y empezó a trabajar." }],
    hueco: "Cuando entró a la oficina nos dijo ‘___’ y empezó a trabajar."
  },
  {
    id: "adios", archivo: "DECIR ADIÓS", nombre: "Adiós", tipo: "loc.",
    definicion: "Expresión de despedida.",
    como: "(Gesto natural) La mano en ‘5’ con la palma hacia adelante y la punta de los dedos hacia arriba se mueve hacia los lados.",
    ejemplos: [{ glosa: "CASA SALIR ANTES ÍNDEX DECIR-ADIÓS", texto: "Antes de salir de la casa dijo adiós." }],
    hueco: "Antes de salir de la casa dijo ‘___’."
  },
  {
    id: "denada", archivo: "DE NADA", nombre: "De nada", tipo: "loc.",
    definicion: "Expresión cortés con la que se responde a quien da las gracias.",
    como: "La mano en ‘5’ con la palma sobre el pecho se mueve hacia adelante hasta quedar con la palma hacia arriba. Se baja un poco la cabeza y se sonríe.",
    ejemplos: [{ glosa: "GRACIAS PLATA DAR PRO1 // DE NADA", texto: "–Gracias por traerme el dinero. –De nada." }],
    hueco: "–Gracias por traerme el dinero. –___."
  },
  {
    id: "buenosdias", archivo: "BUENOS DIAS", nombre: "Buenos días", tipo: "loc.",
    definicion: "Saludo que se da por la mañana.",
    como: "La mano en ‘5’ con los dedos juntos excepto el pulgar, toca el mentón con las yemas de los dedos y enseguida se mueve hacia la palma de la mano contraria, hasta hacer contacto con ella. Enseguida los brazos se cruzan, al tiempo que las manos se cierran, hasta quedar con las palmas hacia adelante, finalmente los brazos se separan y las manos se abren hasta quedar con las palmas hacia adelante.",
    ejemplos: [{ glosa: "AL DÍA-SIGUIENTE BUENOS-DÍAS EXAMEN", texto: "Al día siguiente (me decían) “buenos días, hay examen”." }],
    hueco: "Al día siguiente (me decían) “___, hay examen”."
  },
  {
    id: "buenastardes", archivo: "BUENAS TARDES", nombre: "Buenas tardes", tipo: "loc.",
    definicion: "Saludo que se usa desde el mediodía hasta antes de anochecer.",
    como: "La mano en ‘5’ con los dedos juntos excepto el pulgar, toca el mentón con las yemas de los dedos y enseguida se mueve hacia la palma de la mano contraria, hasta hacer contacto con ella. Luego, las manos en ‘5’ con las palmas hacia abajo se colocan una sobre la otra.",
    ejemplos: [{ glosa: "BUENAS-TARDES // ÍNDEX SILENCIO PODER POR-FAVOR (?)", texto: "Buenas tardes. ¿Puede hacer silencio? Por favor." }],
    hueco: "___. ¿Puede hacer silencio? Por favor."
  },
  {
    id: "buenasnoches", archivo: "BUENAS NOCHES", nombre: "Buenas noches", tipo: "loc.",
    definicion: "Saludo o despedida que se da cuando ha oscurecido.",
    como: "La mano en ‘5’ con los dedos juntos excepto el pulgar, toca el mentón con las yemas de los dedos y enseguida se mueve hacia la palma de la mano contraria, hasta hacer contacto con ella. Luego, las manos con las palmas hacia adentro y las puntas de los dedos hacia arriba se cruzan, al tiempo que se cierran.",
    ejemplos: [{ glosa: "BUENAS-NOCHES AHORA PRO1 HISTORIA CONTAR", texto: "Buenas noches, voy a contarles una historia." }],
    hueco: "___, voy a contarles una historia."
  },
  {
    id: "bienvenido", archivo: "BIENVENIDO", nombre: "Bienvenido", tipo: "adj.",
    definicion: "Expresión utilizada para manifestar el agrado o júbilo ante la llegada de alguien.",
    como: "Las manos en ‘5’ con las palmas hacia arriba, ubicadas una diagonal a la otra, se mueven simultáneamente hacia afuera.",
    ejemplos: [{ glosa: "BIENVENIDO CASA CONTAR PRO1 CÓMO VIAJE", texto: "¡Bienvenido a tu casa, cuéntame de tu viaje!" }],
    hueco: "¡___ a tu casa, cuéntame de tu viaje!"
  },
  {
    id: "comoesta", archivo: "¿CÓMO ESTÁ", nombre: "¿Cómo está?", tipo: "loc.",
    definicion: "1. Expresión que se usa como complemento del saludo. 2. Expresión que se usa para preguntar por el estado de una persona.",
    como: "Las manos en ‘5’, con las palmas hacia atrás y las puntas de los dedos hacia abajo, giran hasta quedar con las palmas hacia arriba y las puntas de los dedos hacia adelante. Los hombros y cejas se elevan.",
    ejemplos: [
      { glosa: "BUENAS-TARDES CÓMO-ESTÁ (?)", texto: "Buenas tardes, ¿cómo estás?" },
      { glosa: "CÓMO-ESTÁ (?) ÍNDEX HIJO ÍNDEX ESPOSO", texto: "¿Cómo están tus hijos y esposa?" }
    ],
    hueco: "Buenas tardes, ___"
  }
];

const SAL_LECCIONES = [
  { id: 1, titulo: "Hola y adiós",                 signos: ["hola", "adios"] },
  { id: 2, titulo: "Buenos días y buenas tardes",  signos: ["buenosdias", "buenastardes"] },
  { id: 3, titulo: "Buenas noches y bienvenida",   signos: ["buenasnoches", "bienvenido"] },
  { id: 4, titulo: "Cortesía y ¿cómo está?",       signos: ["denada", "comoesta"] },
  { id: 5, titulo: "Examen de saludos",            signos: SALUDOS.map(s => s.id), final: true }
];

const SAL_MENSAJES = {
  mapa: ["Saludar en LSC es el primer paso para hacer amigos.", "Hoy tus manos van a decir hola.", "Elige una lección, ¡yo te acompaño!"],
  final: ["¡Ya sabes saludar en LSC! Tus manos hacen amigos.", "¡Saludos dominados! Ahora a por las palabras básicas."]
};

/* ---------- 1) UTILIDADES ---------- */

let SP = null; // progreso guardado (el mismo objeto que usa el alfabeto)
let SS = null; // sesión de la lección en curso

const salPorId = id => SALUDOS.find(s => s.id === id);

function salEstado(p) {
  if (!p.saludos) p.saludos = { completadas: [], estrellas: {}, cajas: {} };
  return p.saludos;
}
function salSonido(nombre) { if (typeof sonido === "function") sonido(nombre); }

function salImg(id, revelar) {
  const s = salPorId(id);
  const alt = revelar ? `Seña de «${s.nombre}»` : "Imagen de una seña";
  return `<img class="sena-img" src="${SAL_RUTA}${encodeURIComponent(s.archivo)}.${SAL_EXT}" alt="${alt}" draggable="false" loading="lazy" onerror="salFalta(this,'${id}')">`;
}
// Si falta la imagen, avisa qué nombre de archivo espera
function salFalta(img, id) {
  const s = salPorId(id);
  const d = document.createElement("div");
  d.className = "sena-falta";
  d.innerHTML = `${icono("hand")}<small>Falta imagen<br>${limpiar(s.archivo)}.${SAL_EXT}</small>`;
  img.replaceWith(d);
}

// Repetición espaciada (igual que en el alfabeto, guardada aparte)
function salRegistrar(p, id, ok) {
  const cajas = salEstado(p).cajas;
  const c = cajas[id] || { caja: 0, prox: 0 };
  c.caja = ok ? Math.min(c.caja + 1, 5) : 0;
  c.prox = Date.now() + INTERVALOS_DIAS[c.caja] * 86400000;
  cajas[id] = c;
}
function salPendiente(p, id) { const c = salEstado(p).cajas[id]; return !!c && c.prox <= Date.now(); }

function salAprendidos(p) {
  const cajas = salEstado(p).cajas;
  return SALUDOS.map(s => s.id).filter(id => Object.hasOwn(cajas, id));
}

/* ---------- 2) CREAR LOS EJERCICIOS ---------- */

const SAL_TIPOS = ["sena2nombre", "nombre2sena", "definicion", "frase", "movimiento", "vf"];

function salPaso(tipo, id, extra) { return { tipo, id, ...(extra || {}) }; }
function salParejas(ids) { return salPaso("parejas", null, { ids: [...ids], fallos: 0, hechas: [] }); }

function salOpciones(id, pool) {
  const n = Math.max(3, Math.min(4, pool.length));
  let otros = barajar(pool.filter(x => x !== id));
  if (otros.length < n - 1) otros = otros.concat(barajar(SALUDOS.map(s => s.id).filter(x => x !== id && !otros.includes(x))));
  return barajar([id, ...otros.slice(0, n - 1)]);
}

function salCrearPasos(L, p) {
  if (L.id === "repaso") {
    const aprendidos = salAprendidos(p);
    const pendientes = aprendidos.filter(id => salPendiente(p, id));
    const ids = pendientes.length ? pendientes : barajar(aprendidos).slice(0, 8);
    const pasos = ids.map((id, i) => salPaso(SAL_TIPOS[i % SAL_TIPOS.length], id));
    return { pasos: mezclarSinRepetir(pasos), pool: ids };
  }

  if (L.final) {
    const ids = barajar(SALUDOS.map(s => s.id));
    const pasos = ids.map((id, i) => salPaso(SAL_TIPOS[i % SAL_TIPOS.length], id));
    pasos.push(salParejas(barajar(ids).slice(0, 4)));
    pasos.push(salParejas(barajar(ids).slice(0, 4)));
    pasos.push(salPaso("movimiento", azar(ids)));
    pasos.push(salPaso("frase", azar(ids)));
    return { pasos: mezclarSinRepetir(pasos), pool: ids };
  }
  const nuevos = L.signos;
  const previos = SAL_LECCIONES.filter(x => x.id < L.id && !x.final).flatMap(x => x.signos);
  const pool = [...nuevos, ...previos];

  const inicio = [];
  nuevos.forEach(id => { inicio.push(salPaso("ensena", id)); inicio.push(salPaso("sena2nombre", id)); });

  const resto = [];
  nuevos.forEach(id => {
    resto.push(salPaso("nombre2sena", id));
    resto.push(salPaso(azar(["definicion", "frase", "movimiento", "vf"]), id));
  });
  resto.push(salParejas([...nuevos, ...(previos.length ? [azar(previos)] : [])]));

  // Repaso de lo anterior: primero lo que "toca" repasar
  const pend = barajar(previos.filter(id => salPendiente(p, id)));
  const otros = barajar(previos.filter(id => !pend.includes(id)));
  [...pend, ...otros].slice(0, 2).forEach((id, i) => resto.push(salPaso(SAL_TIPOS[(i + 2) % SAL_TIPOS.length], id)));

  return { pasos: inicio.concat(mezclarSinRepetir(resto)), pool };
}

/* ---------- 3) PANTALLA: MAPA DE SALUDOS ---------- */

function pantallaSaludos() {
  const p = leerEstado();
  const e = salEstado(p);
  const racha = rachaActual(p);
  const siguiente = SAL_LECCIONES.find(l => !e.completadas.includes(l.id));
  const hechas = e.completadas.length;
  const aprendidos = salAprendidos(p);
  const pendientes = aprendidos.filter(id => salPendiente(p, id)).length;

  const nodos = SAL_LECCIONES.map((l, i) => {
    const comp = e.completadas.includes(l.id);
    const bloq = l.id > 1 && !e.completadas.includes(l.id - 1);
    const actual = siguiente && siguiente.id === l.id;
    const est = e.estrellas[l.id] || 0;
    const nombres = l.final ? "Las 8 señas · repaso total" : l.signos.map(id => salPorId(id).nombre).join(" · ");
    const cuerpo = `<span class="nodo-num">${bloq ? icono("lock") : l.id}</span>
      <span class="nodo-texto"><strong>${l.titulo}</strong><small>${limpiar(nombres)}</small></span>
      <span class="nodo-estrellas" aria-label="${est} de 3 estrellas">${"★".repeat(est)}${"☆".repeat(3 - est)}</span>`;
    const cls = `nodo ${comp ? "completada" : ""} ${actual ? "actual" : ""} ${bloq ? "bloqueada" : ""}`;
    return bloq
      ? `<div class="${cls}" style="--d:${i}" aria-disabled="true">${cuerpo}</div>`
      : `<a class="${cls}" style="--d:${i}" href="#/saludo/${l.id}">${cuerpo}</a>`;
  }).join("");

  const msg = hechas === SAL_LECCIONES.length ? azar(SAL_MENSAJES.final) : azar(SAL_MENSAJES.mapa);
  const repaso = aprendidos.length
    ? `<a class="boton" href="#/saludo/repaso">${icono("play")} REPASAR${pendientes ? ` (${pendientes})` : ""}</a>`
    : `<button class="boton gris" data-aviso="Completa una actividad de saludos para desbloquear el repaso">${icono("lock")} REPASAR</button>`;

  return `
  <section class="pantalla alfa">
    <div class="banner">${icono("chat")}<div><h1>Saludos en LSC</h1><p>5 lecciones · saluda, despídete y sé cortés</p></div><img class="banner-kuma" src="${kumaImg("feliz")}" alt="" aria-hidden="true"></div>
    <div class="alfa-stats">
      <span class="chip-juego chip-racha">${icono("flame")}Racha: ${racha}</span>
      <span class="chip-juego chip-xp">${icono("star")}${p.xp} XP</span>
      <span class="chip-juego">${icono("book")}${hechas} / ${SAL_LECCIONES.length} lecciones</span>
    </div>
    <div class="alfa-kuma"><img src="${kumaImg("normal")}" alt="" aria-hidden="true"><div class="burbuja-kuma">${limpiar(msg)}</div></div>
    <div class="camino">${nodos}</div>
    <div class="tarjeta sal-creditos">
      <h2>Créditos</h2>
      <p>Imágenes y textos de las señas: <strong>${SAL_FUENTE}</strong>.</p>
      <p>Diccionario virtual: <a href="${SAL_ENLACE}" target="_blank" rel="noopener">${SAL_ENLACE}</a></p>
    </div>
    <div class="alfa-acciones">
      <div class="tarjeta accion"><h2>Repaso espaciado</h2><p>${aprendidos.length ? (pendientes ? `Hay ${pendientes} saludo(s) esperando su repaso.` : "Todo al día. ¡Repasar de más no hace daño!") : "Se activa cuando practiques una seña de saludos."}</p>${repaso}</div>
      <div class="tarjeta accion"><h2>Flashcards de saludos</h2><p>Mira la seña, adivina qué significa y voltea la tarjeta.</p><a class="boton" href="#/flashcards" data-mazo="saludos">${icono("hand")} VER TARJETAS</a></div>
    </div>
    <a class="volver" href="#/lecciones">← Volver a lecciones</a>
  </section>`;
}

/* ---------- 4) PANTALLA: LECCIÓN ---------- */

function pantallaSaludo() {
  const par = location.hash.replace("#/", "").split("/")[1];
  SP = leerEstado();
  const e = salEstado(SP);
  let L;
  if (par === "repaso") {
    const aprendidos = salAprendidos(SP);
    if (!aprendidos.length) {
      location.replace("#/saludos");
      mostrarAviso("Practica una seña de saludos para empezar a repasar");
      return;
    }
    L = { id: "repaso", titulo: "Repaso espaciado", signos: aprendidos };
  } else {
    L = SAL_LECCIONES.find(x => String(x.id) === par);
  }
  if (!L) { location.replace("#/saludos"); return; }
  if (typeof L.id === "number" && L.id > 1 && !e.completadas.includes(L.id - 1)) { location.replace("#/saludos"); mostrarAviso("Completa la lección anterior para abrir esta"); return; }
  salIniciar(L);
}

function salIniciar(L) {
  SP = leerEstado();
  const { pasos, pool } = salCrearPasos(L, SP);
  SS = {
    L, pasos, pool, i: 0, vidas: VIDAS, aciertos: 0, errores: 0, combo: 0, hechos: 0,
    fase: "pregunta", sel: null, ok: null, parSel: null, perdioAhora: false,
    racha: rachaActual(SP), msg: "", pose: "normal", tituloFb: ""
  };
  const primero = pasos[0];
  SS.msg = mensajeKuma(primero.tipo === "ensena" ? "ensena" : "inicio");
  SS.pose = primero.tipo === "ensena" ? "pensando" : "normal";
  salRender();
}

function salRender() {
  const s = SS.pasos[SS.i];
  const pct = Math.round((SS.hechos / SS.pasos.length) * 100);
  vista.innerHTML = `
  <section class="pantalla juego">
    <header class="juego-top">
      <button class="juego-cerrar" data-sacc="salir" aria-label="Salir de la lección">✕</button>
      <div class="barra" role="progressbar" aria-label="Progreso de la lección" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
      <span class="chip-juego chip-vidas ${SS.perdioAhora ? "pierde" : ""}" aria-label="${SS.vidas} vidas">${corazon()}${SS.vidas}</span>
      <span class="chip-juego chip-racha" aria-label="Racha de ${SS.racha} días">${icono("flame")}${SS.racha}</span>
    </header>
    <div class="juego-cuerpo">
      <div class="juego-tarjeta tarjeta">${salCuerpo(s)}</div>
      <aside class="juego-kuma"><div class="burbuja-kuma" aria-live="polite">${limpiar(SS.msg)}</div><img src="${kumaImg(SS.pose)}" alt="" aria-hidden="true"></aside>
    </div>
    ${salPie(s)}
  </section>`;
  SS.perdioAhora = false;
  const foco = vista.querySelector("[data-foco]");
  if (foco) foco.focus({ preventScroll: true });
}

function salClase(valor, correcto) {
  if (SS.fase === "feedback") {
    if (valor === correcto) return "correcta";
    if (valor === SS.sel && !SS.ok) return "incorrecta";
    return "";
  }
  return SS.sel === valor ? "sel" : "";
}

function salCuerpo(s) {
  const bloq = SS.fase === "feedback" ? "disabled" : "";
  const d = s.id ? salPorId(s.id) : null;
  const textos = ids => ids.map(x => `<button class="opcion ${salClase(x, s.id)}" data-sop="${x}" ${bloq}>${limpiar(salPorId(x).nombre)}</button>`).join("");
  const imagenes = ids => ids.map((x, i) => `<button class="opcion opcion-sena ${salClase(x, s.id)}" data-sop="${x}" aria-label="Opción ${i + 1}" ${bloq}>${salImg(x, false)}</button>`).join("");

  if (s.tipo === "ensena") {
    const ej = d.ejemplos.map(e => `<li><span class="sal-glosa">${limpiar(e.glosa)}</span><span>${limpiar(e.texto)}</span></li>`).join("");
    return `<p class="juego-consigna">Nueva seña</p>
      <div class="sena-grande">${salImg(s.id, true)}</div>
      <div class="sal-nombre">${limpiar(d.nombre)}</div>
      <div class="sal-info">
        <p><b>${d.tipo}</b> ${limpiar(d.definicion)}</p>
        <p><b>Cómo se hace:</b> ${limpiar(d.como)}</p>
        <ul class="sal-ejemplos">${ej}</ul>
      </div>
      <p class="sal-credito">Fuente: ${SAL_FUENTE}.</p>`;
  }

  if (s.tipo === "sena2nombre") {
    s.opc = s.opc || salOpciones(s.id, SS.pool);
    return `<p class="juego-consigna">¿Qué significa esta seña?</p>
      <div class="sena-grande">${salImg(s.id, false)}</div>
      <div class="opciones opciones-textos">${textos(s.opc)}</div>`;
  }

  if (s.tipo === "nombre2sena") {
    s.opc = s.opc || salOpciones(s.id, SS.pool);
    return `<p class="juego-consigna">Encuentra la seña de</p>
      <div class="sal-nombre">${limpiar(d.nombre)}</div>
      <div class="opciones opciones-senas">${imagenes(s.opc)}</div>`;
  }

  if (s.tipo === "definicion") {
    s.opc = s.opc || salOpciones(s.id, SS.pool);
    return `<p class="juego-consigna">¿A qué seña corresponde esta definición?</p>
      <p class="sal-def">${limpiar(d.definicion)}</p>
      <div class="opciones opciones-textos">${textos(s.opc)}</div>`;
  }

  if (s.tipo === "frase") {
    s.opc = s.opc || salOpciones(s.id, SS.pool);
    const frase = limpiar(d.hueco).replace("___", '<span class="hueco">&nbsp;</span>');
    return `<p class="juego-consigna">Completa la frase con la seña correcta</p>
      <p class="sal-def sal-frase">${frase}</p>
      <div class="opciones opciones-textos">${textos(s.opc)}</div>`;
  }

  if (s.tipo === "movimiento") {
    s.opc = s.opc || salOpciones(s.id, SS.pool);
    return `<p class="juego-consigna">¿Cuál seña se hace así?</p>
      <p class="sal-def">${limpiar(d.como)}</p>
      <div class="opciones opciones-senas">${imagenes(s.opc)}</div>`;
  }

  if (s.tipo === "vf") {
    if (!s.vfId) {
      const otros = SS.pool.filter(x => x !== s.id);
      s.vfId = (Math.random() < 0.5 || !otros.length) ? s.id : azar(otros);
      s.vfEs = s.vfId === s.id;
    }
    const correcto = s.vfEs ? "v" : "f";
    const c = v => salClase(v, correcto);
    return `<p class="juego-consigna">¿Verdadero o falso?</p>
      <div class="sena-grande">${salImg(s.id, false)}</div>
      <p class="juego-consigna">Esta seña significa <span class="sal-nombre" style="font-size:1.6rem">«${limpiar(salPorId(s.vfId).nombre)}»</span></p>
      <div class="opciones opciones-vf">
        <button class="opcion ${c("v")}" data-sop="v" ${bloq}>Verdadero</button>
        <button class="opcion ${c("f")}" data-sop="f" ${bloq}>Falso</button>
      </div>`;
  }

  if (s.tipo === "parejas") {
    s.izq = s.izq || barajar(s.ids);
    s.der = s.der || barajar(s.ids);
    const hecha = id => s.hechas.includes(id) ? "hecha" : "";
    const dis = id => s.hechas.includes(id) ? "disabled" : "";
    return `<p class="juego-consigna">Une cada saludo con su seña</p>
      <div class="parejas">
        <div class="par-col">${s.izq.map(id => `<button class="par-item par-texto ${hecha(id)}" data-spar="l:${id}" ${dis(id)}>${limpiar(salPorId(id).nombre)}</button>`).join("")}</div>
        <div class="par-col">${s.der.map((id, i) => `<button class="par-item ${hecha(id)}" data-spar="s:${id}" aria-label="Seña ${i + 1}" ${dis(id)}>${salImg(id, false)}</button>`).join("")}</div>
      </div>`;
  }
  return "";
}

function salTextoFeedback(s) {
  let detalle;
  const n = s.id ? limpiar(salPorId(s.id).nombre) : "";
  if (SS.ok) detalle = s.tipo === "parejas" ? "¡Todas las parejas unidas!" : `Esa es la seña de <b>${n}</b>`;
  else if (s.tipo === "parejas") detalle = "Te confundiste varias veces. ¡Vuelve a mirar las señas!";
  else if (s.tipo === "nombre2sena" || s.tipo === "movimiento") detalle = `Esta es la seña de <b>${n}</b>: <span class="sena-mini en-pie">${salImg(s.id, true)}</span>`;
  else detalle = `La respuesta era <b>${n}</b>`;
  return { titulo: SS.tituloFb, detalle };
}

function salPie(s) {
  if (SS.fase === "feedback") {
    const { titulo, detalle } = salTextoFeedback(s);
    return `<footer class="juego-pie ${SS.ok ? "ok" : "mal"}" role="status"><div class="juego-pie-in">
      <div class="pie-mensaje"><strong>${titulo}</strong><span>${detalle}</span></div>
      <button class="boton" data-sacc="siguiente" data-foco>CONTINUAR</button></div></footer>`;
  }
  if (s.tipo === "ensena") return `<footer class="juego-pie"><div class="juego-pie-in"><button class="boton" data-sacc="siguiente" data-foco>CONTINUAR</button></div></footer>`;
  if (s.tipo === "parejas") return `<footer class="juego-pie"><div class="juego-pie-in"><span class="pie-mensaje">Toca un saludo y luego su seña para unirlos.</span></div></footer>`;
  return `<footer class="juego-pie"><div class="juego-pie-in"><button class="boton" id="btn-salcomprobar" data-sacc="comprobar" ${SS.sel ? "" : "disabled"}>COMPROBAR</button></div></footer>`;
}

/* ---------- 5) LÓGICA DEL JUEGO ---------- */

function salEsCorrecta(s) {
  if (s.tipo === "vf") return SS.sel === (s.vfEs ? "v" : "f");
  return SS.sel === s.id;
}

function salComprobar() {
  if (SS.fase !== "pregunta" || !SS.sel) return;
  salResolver(salEsCorrecta(SS.pasos[SS.i]));
}

function salResolver(ok) {
  const s = SS.pasos[SS.i];
  SS.fase = "feedback";
  SS.ok = ok;
  let evento;
  if (ok) {
    SS.aciertos++; SS.combo++; SS.hechos++;
    evento = (SS.combo >= 3 && SS.combo % 3 === 0) ? "combo" : "acierto";
    SS.tituloFb = azar(["¡Correcto!", "¡Perfecto!", "¡Muy bien!", "¡Excelente!"]);
    SS.pose = "feliz";
    salSonido(evento);
  } else {
    SS.errores++; SS.combo = 0; SS.vidas--; SS.perdioAhora = true;
    evento = "error";
    SS.tituloFb = azar(["Casi…", "¡Ups!", "Aún no"]);
    SS.pose = "triste";
    salSonido("error");
    if (s.tipo === "parejas") SS.pasos.push(salParejas(s.ids));
    else SS.pasos.push(salPaso(azar(SAL_TIPOS.filter(t => t !== s.tipo)), s.id));
  }
  (s.tipo === "parejas" ? s.ids : [s.id]).forEach(id => salRegistrar(SP, id, ok));
  guardarEstado(SP);
  SS.msg = mensajeKuma(evento);
  salRender();
}

function salSiguiente() {
  if (!SS) return;
  const s = SS.pasos[SS.i];
  if (SS.fase === "pregunta" && s.tipo === "ensena") SS.hechos++;
  else if (SS.fase === "feedback" && SS.vidas <= 0) return salPerder();
  SS.i++; SS.sel = null; SS.parSel = null; SS.fase = "pregunta"; SS.ok = null;
  if (SS.i >= SS.pasos.length) return salTerminar();
  const n = SS.pasos[SS.i], len = SS.pasos.length;
  const ev = n.tipo === "ensena" ? "ensena" : SS.i === Math.floor(len / 2) ? "mitad" : SS.i === len - 1 ? "casi" : "animo";
  SS.msg = mensajeKuma(ev);
  SS.pose = ev === "ensena" ? "pensando" : "normal";
  salRender();
}

function salClickPareja(el) {
  const s = SS.pasos[SS.i];
  const [lado, id] = el.dataset.spar.split(":");
  if (el.classList.contains("hecha")) return;
  const prev = SS.parSel;
  if (!prev || prev.lado === lado) {
    if (prev) prev.el.classList.remove("sel");
    SS.parSel = { lado, id, el };
    el.classList.add("sel");
    return;
  }
  if (prev.id === id) {
    [prev.el, el].forEach(x => { x.classList.remove("sel"); x.classList.add("hecha"); x.disabled = true; });
    s.hechas.push(id);
    SS.parSel = null;
    if (s.hechas.length === s.ids.length) setTimeout(() => { if (SS && SS.pasos[SS.i] === s && SS.fase === "pregunta") salResolver(s.fallos <= 2); }, 450);
  } else {
    s.fallos++;
    const a = prev.el, b = el;
    a.classList.remove("sel");
    [a, b].forEach(x => x.classList.add("sacude"));
    setTimeout(() => [a, b].forEach(x => x.classList.remove("sacude")), 450);
    SS.parSel = null;
  }
}

/* ---------- 6) FINAL ---------- */

function salTerminar() {
  salSonido("fin");
  const total = SS.aciertos + SS.errores;
  const prec = total ? SS.aciertos / total : 1;
  const est = prec >= 0.9 ? 3 : prec >= 0.7 ? 2 : 1;
  const xp = 10 + SS.aciertos * 2 + (est === 3 ? 10 : 0);
  const e = salEstado(SP);
  const esLeccionNumerica = typeof SS.L.id === "number";
  const eraNueva = esLeccionNumerica && !e.completadas.includes(SS.L.id);
  if (esLeccionNumerica) {
    if (eraNueva) e.completadas.push(SS.L.id);
    e.estrellas[SS.L.id] = Math.max(e.estrellas[SS.L.id] || 0, est);
  }
  SP.xp += xp;
  sumarRacha(SP);
  guardarEstado(SP);
  SS.fase = "fin";

  const siguienteL = SAL_LECCIONES.find(l => l.id === SS.L.id + 1);
  const msg = SS.L.final ? azar(SAL_MENSAJES.final) : mensajeKuma("fin");
  vista.innerHTML = `
  <section class="pantalla juego">
    <div class="tarjeta resultado">
      <img src="${kumaImg("celebra")}" alt="" aria-hidden="true">
      <h1>${SS.L.final ? "¡Saludos completados!" : SS.L.id === "repaso" ? "¡Repaso terminado!" : "¡Lección " + SS.L.id + " completada!"}</h1>
      <div class="estrellas-res" aria-label="${est} de 3 estrellas">${[1, 2, 3].map(n => `<span class="${n <= est ? "on" : ""}">★</span>`).join("")}</div>
      <div class="burbuja-kuma">${limpiar(msg)}</div>
      <div class="res-stats">
        <div><strong>+${xp}</strong><small>XP</small></div>
        <div><strong>${Math.round(prec * 100)}%</strong><small>Precisión</small></div>
        <div><strong>${rachaActual(SP)}</strong><small>Racha</small></div>
      </div>
      <div class="res-botones">
        ${siguienteL && eraNueva ? `<a class="boton grande" href="#/saludo/${siguienteL.id}">SIGUIENTE</a>` : ""}
        <button class="boton sec" data-sacc="reiniciar">REPETIR</button>
        <a class="boton sec" href="#/saludos">AL MAPA</a>
      </div>
    </div>
  </section>`;
}

function salPerder() {
  salSonido("perdio");
  SS.fase = "perdio";
  vista.innerHTML = `
  <section class="pantalla juego">
    <div class="tarjeta resultado">
      <img src="${kumaImg("triste")}" alt="" aria-hidden="true">
      <h1>Te quedaste sin vidas</h1>
      <div class="burbuja-kuma">${limpiar(mensajeKuma("perdio"))}</div>
      <p class="pista">Las señas que fallaste quedaron anotadas para repasarlas pronto.</p>
      <div class="res-botones">
        <button class="boton" data-sacc="reiniciar" data-foco>INTENTAR DE NUEVO</button>
        <a class="boton sec" href="#/saludos">AL MAPA</a>
      </div>
    </div>
  </section>`;
  const f = vista.querySelector("[data-foco]"); if (f) f.focus({ preventScroll: true });
}

/* ---------- 7) EVENTOS, RUTAS Y MODO LECCIÓN ---------- */

vista.addEventListener("click", e => {
  if (!SS || !location.hash.startsWith("#/saludo/")) return;
  const el = e.target.closest("[data-sacc],[data-sop],[data-spar]");
  if (!el) return;
  const acc = el.dataset.sacc;
  if (acc === "salir") {
    if (SS.fase === "fin" || SS.fase === "perdio" || confirm("¿Salir de la lección? Perderás el avance de esta sesión.")) location.hash = "#/saludos";
  } else if (acc === "siguiente") salSiguiente();
  else if (acc === "comprobar") salComprobar();
  else if (acc === "reiniciar") salIniciar(SS.L);
  else if (el.dataset.sop !== undefined && SS.fase === "pregunta") {
    SS.sel = el.dataset.sop;
    vista.querySelectorAll("[data-sop]").forEach(b => b.classList.toggle("sel", b === el));
    const b = document.getElementById("btn-salcomprobar"); if (b) b.removeAttribute("disabled");
  } else if (el.dataset.spar !== undefined && SS.fase === "pregunta") salClickPareja(el);
});

rutas.saludos = pantallaSaludos;
rutas.saludo = pantallaSaludo;

// Esconde el menú dentro de las lecciones (también las del alfabeto)
function salModo() { document.body.classList.toggle("en-leccion", /^#\/(leccion|saludo)\//.test(location.hash)); }
window.addEventListener("hashchange", salModo);
salModo();

/* ---------- 8) FLASHCARDS DE SALUDOS ---------- */

let salMazo = "alfabeto";
let salFiltro = "todas";
let salOrden = SALUDOS.map(s => s.id);

function salIdsFiltrados() {
  if (salFiltro === "todas") return salOrden;
  if (salFiltro === "aprendidas") {
    const hechas = salEstado(leerEstado()).completadas;
    const ok = SAL_LECCIONES.filter(l => !l.final && hechas.includes(l.id)).flatMap(l => l.signos);
    return salOrden.filter(id => ok.includes(id));
  }
  const L = SAL_LECCIONES.find(l => String(l.id) === salFiltro);
  return L ? salOrden.filter(id => L.signos.includes(id)) : salOrden;
}

function salBarraMazos() {
  const a = salMazo === "alfabeto", s = salMazo === "saludos";
  return `<div class="fc-decks" role="group" aria-label="Mazos de tarjetas">
      <button class="fc-deck ${a ? "activo" : ""}" data-mazo="alfabeto" aria-pressed="${a}">Alfabeto</button>
      <button class="fc-deck ${s ? "activo" : ""}" data-mazo="saludos" aria-pressed="${s}">Saludos</button>
      <button class="fc-deck pronto" data-aviso="Este mazo llega pronto">Palabras básicas · pronto</button>
    </div>`;
}

function salPantallaFlashcards() {
  const filtros = [["todas", "Todas"], ["aprendidas", "Mis aprendidas"], ...SAL_LECCIONES.filter(l => !l.final).map(l => [String(l.id), "Lección " + l.id])];
  const ids = salIdsFiltrados();
  const tarjetas = ids.length
    ? ids.map(id => {
        const d = salPorId(id);
        return `
      <button class="flashcard" data-sflip data-nombre="${limpiar(d.nombre)}" aria-pressed="false" aria-label="Tarjeta de seña. Toca para ver su significado">
        <span class="fc-inner">
          <span class="fc-cara fc-frente">${salImg(id, false)}<small>Toca para voltear</small></span>
          <span class="fc-cara fc-dorso"><b class="sal-fc-nombre">${limpiar(d.nombre)}</b><small>Toca para volver</small></span>
        </span>
      </button>`;
      }).join("")
    : `<div class="tarjeta fc-vacio">Aún no hay señas aprendidas. ¡Completa la lección 1 de Saludos y vuelve!</div>`;

  return `
  <section class="pantalla">
    <div class="banner">${icono("hand")}<div><h1>Flashcards</h1><p>Voltea la tarjeta y comprueba el significado</p></div><img class="banner-kuma" src="${kumaImg("pensando")}" alt="" aria-hidden="true"></div>
    ${salBarraMazos()}
    <div class="alfa-kuma"><img src="${kumaImg("normal")}" alt="" aria-hidden="true"><div class="burbuja-kuma">${limpiar(mensajeKuma("flash"))}</div></div>
    <div class="fc-filtros" role="group" aria-label="Filtrar señas">
      ${filtros.map(([id, nombre]) => `<button class="chip-filtro ${salFiltro === id ? "activo" : ""}" data-sfiltro="${id}" aria-pressed="${salFiltro === id}">${nombre}</button>`).join("")}
    </div>
    <div class="fc-barra">
      <span class="chip-juego">${ids.length} tarjeta(s)</span>
      <span><button class="boton" data-sfc="mezclar">Mezclar</button> <button class="boton gris" data-sfc="orden" style="cursor:pointer">Orden original</button></span>
    </div>
    <div class="fc-grid fc-grid-sal">${tarjetas}</div>
    <p class="sal-credito" style="margin:14px 4px 0">Fuente de imágenes y textos: ${SAL_FUENTE}.</p>
    <a class="volver" href="#/saludos">← Ir a las lecciones de saludos</a>
  </section>`;
}

// Reemplaza la pantalla de flashcards por una versión con 2 mazos (Alfabeto y Saludos)
const pantallaFlashcardsAlfabeto = pantallaFlashcards;
pantallaFlashcards = function () {
  if (salMazo === "saludos") return salPantallaFlashcards();
  return pantallaFlashcardsAlfabeto().replace(/<div class="fc-decks">[\s\S]*?<\/div>/, salBarraMazos());
};
rutas.flashcards = pantallaFlashcards;

vista.addEventListener("click", e => {
  const el = e.target.closest("[data-mazo],[data-sflip],[data-sfiltro],[data-sfc]");
  if (!el) return;
  if (el.dataset.mazo === "saludos" && location.hash !== "#/flashcards") {
    salMazo = "saludos";
    return;
  }
  if (location.hash !== "#/flashcards") return;
  if (el.dataset.mazo) { salMazo = el.dataset.mazo; vista.innerHTML = pantallaFlashcards(); }
  else if (el.dataset.sflip !== undefined) {
    const vuelta = el.classList.toggle("volteada");
    el.setAttribute("aria-pressed", vuelta);
    el.setAttribute("aria-label", vuelta ? `Significado: ${el.dataset.nombre}. Toca para volver a la seña` : "Tarjeta de seña. Toca para ver su significado");
  } else if (el.dataset.sfiltro) { salFiltro = el.dataset.sfiltro; vista.innerHTML = pantallaFlashcards(); }
  else if (el.dataset.sfc === "mezclar") { salOrden = barajar(salOrden); vista.innerHTML = pantallaFlashcards(); }
  else if (el.dataset.sfc === "orden") { salOrden = SALUDOS.map(s => s.id); vista.innerHTML = pantallaFlashcards(); }
});