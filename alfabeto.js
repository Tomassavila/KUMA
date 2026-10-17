/* =========================================================
   Kuma - Alfabeto (lecciones 1-10) y Flashcards
   Se carga DESPUÉS de app.js (usa sus funciones: icono, limpiar,
   vista, rutas, mostrarAviso). No cambia nada de lo existente.
   ========================================================= */

/* ---------- 0) CONFIGURACIÓN (edita aquí tus archivos) ---------- */

// Carpeta y formato de las imágenes de cada seña.
// Se buscan así: assets/assets/alfabeto/a.png, b.png ... y enie.png para la Ñ
const RUTA_SENAS = "assets/assets/";
const EXT_SENAS = "jpeg";
const ARCHIVO_ESPECIAL = {};

// Imágenes de Kuma según el momento. Cambia cada ruta por tus imágenes.
const KUMA_POSES = {
  normal:   "assets/assets/kumasilueta.png",
  feliz:    "assets/assets/kumaorgulloso.png",
  triste:   "assets/assets/kumatriste.png",
  celebra:  "assets/assets/kumacelebrando.png",
  pensando: "assets/assets/kumapensativo.png"
};

// Pistas opcionales por letra, por ejemplo { A: "..." }.
// Déjalas vacías hasta validarlas con personas sordas o intérpretes.
const PISTAS = {};

const VIDAS = 5;
const CLAVE_GUARDADO = "kuma_alfabeto_v1";
const INTERVALOS_DIAS = [0, 1, 2, 4, 8, 16]; // repetición espaciada (cajas de Leitner)

const LETRAS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const LECCIONES_ALFABETO = [
  { id: 1,  titulo: "Primeras señas",     letras: ["A", "B", "C"] },
  { id: 2,  titulo: "Manos en marcha",    letras: ["D", "E", "F"] },
  { id: 3,  titulo: "Más y más letras",   letras: ["G", "H", "I"] },
  { id: 4,  titulo: "Tomando ritmo",      letras: ["J", "K", "L"] },
  { id: 5,  titulo: "Mitad del camino",   letras: ["M", "N", "Ñ"] },
  { id: 6,  titulo: "Sigue la racha",     letras: ["O", "P", "Q"] },
  { id: 7,  titulo: "Casi en la cima",    letras: ["R", "S", "T"] },
  { id: 8,  titulo: "Recta final",        letras: ["U", "V", "W"] },
  { id: 9,  titulo: "Las últimas tres",   letras: ["X", "Y", "Z"] },
  { id: 10, titulo: "Examen final",       letras: LETRAS, final: true }
];

// Palabras para los ejercicios de "deletrea" (solo salen si ya conoces sus letras)
const PALABRAS = ["CAFE", "BEBE", "HADA", "BIEN", "DADO", "CAJA", "FAJA", "GAFAS", "LUNA", "MESA", "CASA", "PAN", "AGUA", "GATO",
  "KUMA", "UIS", "OSO", "SOL", "SAPO", "NUBE", "FLOR", "MANO", "AMOR", "LOMA", "PATO", "RANA", "VIDA", "YOGA", "ZONA", "TAZA",
  "NIÑO", "SEÑA", "PIÑA", "UÑA", "MOÑO", "LAPIZ"];

const MENSAJES_KUMA = {
  mapa: ["Una letra a la vez y tus manos hablan.", "Elige tu siguiente lección; yo voy a tu lado.", "Cada parada del camino te acerca a dominar el alfabeto.", "Hoy puedes descubrir una seña que nunca olvidarás."],
  inicio: ["¡Empezamos! Tus manos están listas para aprender.", "Una seña a la vez: así se llega muy lejos.", "Estoy aquí para acompañarte en cada intento.", "Mira con calma; tienes todo el tiempo del mundo."],
  ensena: ["Observa la forma de la mano; los detalles cuentan.", "Prueba la seña frente al espejo y siente el movimiento.", "Tómate tu tiempo: aprender también es observar.", "¿Notas cómo se acomodan los dedos? ¡Muy bien!", "Guarda esta forma en tu memoria y vamos a practicar."],
  animo: ["Respira y confía en lo que acabas de aprender.", "Vas construyendo algo increíble, seña por seña.", "Cada intento hace más fuerte tu memoria.", "Tus manos están aprendiendo un idioma nuevo.", "Sigue a tu ritmo; yo celebro cada paso contigo."],
  acierto: ["¡Lo recordaste! Esa seña ya es parte de ti.", "¡Muy bien! Tus manos y tu memoria trabajan en equipo.", "¡Exacto! Un paso más en tu camino.", "¡Qué buena observación! Diste con la respuesta.", "Tu práctica está dando frutos. ¡Sigamos!"],
  combo: ["¡Varias respuestas seguidas! Tu memoria está despierta.", "¡Qué buena racha! Estás conectando las señas.", "¡Imparable! Cada respuesta te da más confianza.", "¡Vas con un ritmo fantástico!"],
  error: ["No pasa nada: equivocarse también enseña.", "Casi la tienes. La volverás a ver para recordarla mejor.", "Una respuesta no define lo que sabes. Vamos paso a paso.", "Observa otra vez y verás nuevos detalles.", "¡Ánimo! Esta seña regresará para que puedas practicarla."],
  mitad: ["¡Llegaste a la mitad! Mira todo lo que ya aprendiste.", "Ya recorriste un buen tramo. Estoy orgulloso de ti.", "Tu constancia está haciendo la diferencia."],
  casi: ["¡Falta muy poco! Has llegado hasta aquí con mucho esfuerzo.", "La meta está cerca; confía en lo que ya sabes.", "Una última vuelta y lo habrás conseguido."],
  fin: ["¡Lección completada! Qué orgullo ver tu progreso.", "Lo lograste: hoy tus manos conocen más señas.", "¡Misión cumplida! Una nueva aventura te espera.", "Tu esfuerzo de hoy se queda contigo."],
  final: ["¡Completaste el alfabeto! Cada letra es una nueva forma de conectar.", "¡Lo hiciste! Ahora conoces las 27 letras del alfabeto manual.", "Todo ese esfuerzo dio fruto: ¡alfabeto completo!", "¡Qué gran logro! Celebra todo lo que aprendiste."],
  perdio: ["Se acabaron las vidas, no tus ganas de aprender.", "Descansa un momento; las señas te estarán esperando.", "Cada error te dio una pista para la próxima vuelta.", "Podemos intentarlo de nuevo cuando estés listo."],
  flash: ["Mira la seña con atención. ¿Qué letra te recuerda?", "Antes de voltear, intenta recordar la letra.", "Un pequeño repaso hoy ayuda a recordarla mañana.", "Toca la tarjeta cuando tengas tu respuesta.", "¿Ya tienes una idea? Compruébala al darle la vuelta."],
  flashRevelar: ["¡Aquí está! Mira de nuevo la forma de la mano.", "La letra aparece: intenta asociarla con la seña.", "¡Buen trabajo! Ahora sabes qué letra era.", "Guarda esa pareja de seña y letra en tu memoria."],
  flashVolver: ["Mira de nuevo la seña e intenta recordarla.", "Una vuelta más para practicar. ¿Cuál será esta?", "Ahora observa la mano: ¿recuerdas su letra?", "¡Seguimos! Cada repaso hace la seña más familiar."],
  flashConocida: ["¡Se nota que ya la reconoces!", "Otra seña que empieza a quedarse en tu memoria.", "¡Bien hecho! Sigue explorando el alfabeto.", "Tu práctica constante está dando resultado."]
};

/* ---------- 1) UTILIDADES ---------- */

let P = null; // progreso guardado
let S = null; // sesión de la lección en curso
const ULTIMOS_MENSAJES_KUMA = {};

const azar = arr => arr[Math.floor(Math.random() * arr.length)];
function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function mensajeKuma(tipo) {
  const opciones = MENSAJES_KUMA[tipo];
  const disponibles = opciones.filter(mensaje => mensaje !== ULTIMOS_MENSAJES_KUMA[tipo]);
  const mensaje = azar(disponibles.length ? disponibles : opciones);
  ULTIMOS_MENSAJES_KUMA[tipo] = mensaje;
  return mensaje;
}
function kumaImg(pose) { return KUMA_POSES[pose] || KUMA_POSES.normal; }

function actualizarMensajeFlash(tipo, pose) {
  const burbuja = vista.querySelector(".alfa-kuma .burbuja-kuma");
  const kuma = vista.querySelector(".alfa-kuma img");
  if (burbuja) {
    burbuja.classList.remove("frase-nueva");
    void burbuja.offsetWidth;
    burbuja.textContent = mensajeKuma(tipo);
    burbuja.classList.add("frase-nueva");
  }
  if (kuma) kuma.src = kumaImg(pose);
}
/* ---------- SONIDOS ---------- */
const SONIDO_ACTIVO = true; // pon false si quieres apagarlos
let ctxAudio = null;

function tono(frecuencia, inicio, duracion, tipo = "sine", volumen = 0.25) {
  const ahora = ctxAudio.currentTime + inicio;
  const osc = ctxAudio.createOscillator();
  const gan = ctxAudio.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(frecuencia, ahora);
  gan.gain.setValueAtTime(0.0001, ahora);
  gan.gain.exponentialRampToValueAtTime(volumen, ahora + 0.02);
  gan.gain.exponentialRampToValueAtTime(0.0001, ahora + duracion);
  osc.connect(gan);
  gan.connect(ctxAudio.destination);
  osc.start(ahora);
  osc.stop(ahora + duracion + 0.05);
}

function sonido(nombre) {
  if (!SONIDO_ACTIVO) return;
  try {
    if (!ctxAudio) ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
    if (ctxAudio.state === "suspended") ctxAudio.resume();
    if (nombre === "acierto") {          // dos notas que suben
      tono(660, 0, 0.15);
      tono(880, 0.12, 0.28);
    } else if (nombre === "combo") {     // cuatro notas que suben
      [523, 659, 784, 1047].forEach((f, i) => tono(f, i * 0.09, 0.2));
    } else if (nombre === "error") {     // dos notas graves que bajan
      tono(220, 0, 0.2, "sawtooth", 0.15);
      tono(165, 0.18, 0.35, "sawtooth", 0.15);
    } else if (nombre === "fin") {       // fanfarria de victoria
      [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tono(f, i * 0.13, 0.3));
    } else if (nombre === "perdio") {    // notas que caen
      [392, 330, 262, 196].forEach((f, i) => tono(f, i * 0.18, 0.3, "triangle", 0.2));
    }
  } catch (_) { /* si el navegador no permite audio, no pasa nada */ }
}

function corazon() {
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 5 6.2 5c2 0 3.4 1.1 5.8 3.4C14.4 6.100 15.800 5 17.800 5c3.300 0 5.300 3.400 3.800 6.800C19.500 16.400 12 21 12 21z" fill="currentColor"/></svg>`;
}

/* Imágenes de las señas */
function archivoSena(l) { return (ARCHIVO_ESPECIAL[l] || l).toLowerCase(); }
function senaImg(l, revelar) {
  const alt = revelar ? `Seña de la letra ${l}` : "Imagen de una seña";
  return `<img class="sena-img" src="${RUTA_SENAS}${archivoSena(l)}.${EXT_SENAS}" alt="${alt}" draggable="false" loading="lazy" onerror="senaFalta(this,'${l}')">`;
}
// Si falta la imagen, se muestra un recuadro avisando el nombre que debe tener
function senaFalta(img, l) {
  const d = document.createElement("div");
  d.className = "sena-falta";
  d.innerHTML = `${icono("hand")}<small>Falta imagen<br>${archivoSena(l)}.${EXT_SENAS}</small>`;
  img.replaceWith(d);
}

/* ---------- 2) PROGRESO GUARDADO (en el navegador) ---------- */

function estadoBase() { return { completadas: [], estrellas: {}, xp: 0, racha: 0, ultimaFecha: null, cajas: {} }; }
function leerEstado() {
  try { const e = JSON.parse(localStorage.getItem(CLAVE_GUARDADO)); if (e) return { ...estadoBase(), ...e }; } catch (_) { /* sin datos */ }
  return estadoBase();
}
function guardarEstado(e) { try { localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(e)); } catch (_) { /* sin guardado */ } }

function fechaLocal(d = new Date()) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function rachaActual(p) {
  if (!p.ultimaFecha) return 0;
  const ayer = new Date(); ayer.setDate(ayer.getDate() - 1);
  return (p.ultimaFecha === fechaLocal() || p.ultimaFecha === fechaLocal(ayer)) ? p.racha : 0;
}
function sumarRacha(p) {
  const hoy = fechaLocal();
  if (p.ultimaFecha === hoy) return;
  p.racha = rachaActual(p) + 1;
  p.ultimaFecha = hoy;
}

// Repetición espaciada: acertar sube de caja (se repasa más tarde), fallar vuelve a la caja 0 (se repasa ya)
function registrar(p, letra, ok) {
  const c = p.cajas[letra] || { caja: 0, prox: 0 };
  c.caja = ok ? Math.min(c.caja + 1, 5) : 0;
  c.prox = Date.now() + INTERVALOS_DIAS[c.caja] * 86400000;
  p.cajas[letra] = c;
}
function letrasPorRepasar(p) { return Object.keys(p.cajas).filter(l => p.cajas[l].prox <= Date.now()); }
function aprendidas(p) {
  const set = new Set(Object.keys(p.cajas));
  LECCIONES_ALFABETO.filter(l => !l.final && p.completadas.includes(l.id)).forEach(l => l.letras.forEach(x => set.add(x)));
  return LETRAS.filter(l => set.has(l));
}

/* ---------- 3) CREAR LOS EJERCICIOS DE UNA LECCIÓN ---------- */

const TIPOS = ["sena2letra", "letra2sena", "escribe", "vf"];

function paso(tipo, letra, extra) { return { tipo, letra, ...(extra || {}) }; }

function palabrasPosibles(pool) { return PALABRAS.filter(w => [...w].every(c => pool.includes(c))); }

function opcionesLetras(correcta, pool) {
  const n = Math.min(4, pool.length);
  let otros = barajar(pool.filter(l => l !== correcta));
  if (otros.length < n - 1) otros = otros.concat(barajar(LETRAS.filter(l => l !== correcta && !otros.includes(l))));
  return barajar([correcta, ...otros.slice(0, n - 1)]);
}

// Evita que dos ejercicios seguidos sean del mismo tipo
function mezclarSinRepetir(arr) {
  let mejor = barajar(arr);
  for (let k = 0; k < 40; k++) {
    const t = barajar(arr);
    if (!t.some((x, i) => i < t.length - 1 && x.tipo === t[i + 1].tipo)) return t;
    mejor = t;
  }
  return mejor;
}

function pasoParejas(letras) { return paso("parejas", null, { letras: [...letras], fallos: 0, hechas: [] }); }

function pasosLibres(base, pool, nPar, nPal) {
  const pasos = base.map((l, i) => paso(TIPOS[i % TIPOS.length], l));
  for (let k = 0; k < nPar && pool.length >= 3; k++) pasos.push(pasoParejas(barajar(pool).slice(0, Math.min(4, pool.length))));
  const pals = palabrasPosibles(pool);
  for (let k = 0; k < nPal && pals.length; k++) pasos.push(paso("palabra", null, { palabra: azar(pals) }));
  return mezclarSinRepetir(pasos);
}

function crearPasos(L, p) {
  // Examen final: mezcla de todo el alfabeto
  if (L.final) {
    const pool = LETRAS;
    const due = letrasPorRepasar(p);
    const base = [...new Set([...barajar(due).slice(0, 4), ...barajar(LETRAS)])].slice(0, 12);
    return { pasos: pasosLibres(base, pool, 2, 2), pool };
  }
  // Repaso espaciado: letras que toca repasar
  if (L.id === "repaso") {
    const pool = aprendidas(p);
    const base = barajar(L.letras).slice(0, 10);
    return { pasos: pasosLibres(base, pool, 1, 1), pool };
  }
  // Lecciones 1 a 9: enseñar -> recordar -> practicar -> repasar lo anterior
  const nuevas = L.letras;
  const previas = LECCIONES_ALFABETO.filter(x => x.id < L.id && !x.final).flatMap(x => x.letras);
  const pool = [...nuevas, ...previas];

  const inicio = [];
  nuevas.forEach(l => { inicio.push(paso("ensena", l)); inicio.push(paso("sena2letra", l)); });

  const resto = [];
  nuevas.forEach(l => { resto.push(paso("letra2sena", l)); resto.push(paso(azar(["escribe", "vf"]), l)); });
  resto.push(pasoParejas([...nuevas, ...(previas.length ? [azar(previas)] : [])]));

  // Repaso espaciado de letras anteriores: primero las que "toca" repasar
  const due = barajar(previas.filter(l => p.cajas[l] && p.cajas[l].prox <= Date.now()));
  const otras = barajar(previas.filter(l => !due.includes(l)));
  [...due, ...otras].slice(0, 3).forEach((l, i) => resto.push(paso(TIPOS[(i + 1) % TIPOS.length], l)));

  const pals = palabrasPosibles(pool);
  if (pals.length) resto.push(paso("palabra", null, { palabra: azar(pals) }));

  return { pasos: inicio.concat(mezclarSinRepetir(resto)), pool };
}

/* ---------- 4) PANTALLA: MAPA DEL ALFABETO ---------- */

function pantallaAlfabeto() {
  const p = leerEstado();
  const racha = rachaActual(p);
  const siguiente = LECCIONES_ALFABETO.find(l => !p.completadas.includes(l.id));
  const hechas = p.completadas.length;
  const pendientes = letrasPorRepasar(p).length;
  const sabidas = aprendidas(p);

  const nodos = LECCIONES_ALFABETO.map((l, i) => {
    const comp = p.completadas.includes(l.id);
    const bloq = l.id > 1 && !p.completadas.includes(l.id - 1);
    const actual = siguiente && siguiente.id === l.id;
    const est = p.estrellas[l.id] || 0;
    const letras = l.final ? "A – Z · todas las letras" : l.letras.join(" · ");
    const cuerpo = `<span class="nodo-num">${bloq ? icono("lock") : l.id}</span>
      <span class="nodo-texto"><strong>${l.titulo}</strong><small>${letras}</small></span>
      <span class="nodo-estrellas" aria-label="${est} de 3 estrellas">${"★".repeat(est)}${"☆".repeat(3 - est)}</span>`;
    const cls = `nodo ${comp ? "completada" : ""} ${actual ? "actual" : ""} ${bloq ? "bloqueada" : ""}`;
    return bloq
      ? `<div class="${cls}" style="--d:${i}" aria-disabled="true">${cuerpo}</div>`
      : `<a class="${cls}" style="--d:${i}" href="#/leccion/${l.id}">${cuerpo}</a>`;
  }).join("");

  const msg = hechas === LECCIONES_ALFABETO.length ? mensajeKuma("final") : mensajeKuma("mapa");
  const repaso = sabidas.length
    ? `<a class="boton" href="#/leccion/repaso">${icono("play")} REPASAR${pendientes ? " (" + pendientes + ")" : ""}</a>`
    : `<button class="boton gris" data-aviso="Completa la lección 1 para desbloquear el repaso">${icono("lock")} REPASAR</button>`;

  return `
  <section class="pantalla alfa">
    <div class="banner">${icono("abc")}<div><h1>Alfabeto LSC</h1><p>10 lecciones · aprende, practica y repasa</p></div><img class="banner-kuma" src="${kumaImg("feliz")}" alt="" aria-hidden="true"></div>
    <div class="alfa-stats">
      <span class="chip-juego chip-racha">${icono("flame")}Racha: ${racha}</span>
      <span class="chip-juego chip-xp">${icono("star")}${p.xp} XP</span>
      <span class="chip-juego">${icono("book")}${hechas} / ${LECCIONES_ALFABETO.length} lecciones</span>
    </div>
    <div class="alfa-kuma"><img src="${kumaImg("normal")}" alt="" aria-hidden="true"><div class="burbuja-kuma">${limpiar(msg)}</div></div>
    <div class="camino">${nodos}</div>
    <div class="alfa-acciones">
      <div class="tarjeta accion"><h2>Repaso espaciado</h2><p>${sabidas.length ? (pendientes ? "Hay " + pendientes + " letra(s) esperando su repaso." : "Todo al día. ¡Repasar de más no hace daño!") : "Se activa cuando termines la lección 1."}</p>${repaso}</div>
      <div class="tarjeta accion"><h2>Flashcards del alfabeto</h2><p>Mira la seña, adivina la letra y voltea la tarjeta.</p><a class="boton" href="#/flashcards">${icono("hand")} VER TARJETAS</a></div>
    </div>
    <a class="volver" href="#/lecciones">← Volver a lecciones</a>
  </section>`;
}

/* ---------- 5) PANTALLA: LECCIÓN (tipo Duolingo) ---------- */

function pantallaLeccion() {
  const par = location.hash.replace("#/", "").split("/")[1];
  P = leerEstado();
  let L;
  if (par === "repaso") {
    const sabidas = aprendidas(P);
    if (!sabidas.length) { location.replace("#/alfabeto"); mostrarAviso("Completa la lección 1 para empezar a repasar"); return; }
    const due = letrasPorRepasar(P);
    L = { id: "repaso", titulo: "Repaso espaciado", letras: due.length ? due : barajar(sabidas).slice(0, 8) };
  } else {
    L = LECCIONES_ALFABETO.find(x => String(x.id) === par);
    if (!L) { location.replace("#/alfabeto"); return; }
    if (L.id > 1 && !P.completadas.includes(L.id - 1)) { location.replace("#/alfabeto"); mostrarAviso("Completa la lección anterior para abrir esta"); return; }
  }
  iniciar(L);
}

function iniciar(L) {
  P = leerEstado();
  const { pasos, pool } = crearPasos(L, P);
  S = {
    L, pasos, pool, i: 0, vidas: VIDAS, aciertos: 0, errores: 0, combo: 0, hechos: 0,
    fase: "pregunta", sel: null, ok: null, parSel: null, perdioAhora: false,
    racha: rachaActual(P), msg: "", pose: "normal", tituloFb: ""
  };
  const primero = pasos[0];
  S.msg = mensajeKuma(primero.tipo === "ensena" ? "ensena" : "inicio");
  S.pose = primero.tipo === "ensena" ? "pensando" : "normal";
  render();
}

function render() {
  const s = S.pasos[S.i];
  const pct = Math.round((S.hechos / S.pasos.length) * 100);
  vista.innerHTML = `
  <section class="pantalla juego">
    <header class="juego-top">
      <button class="juego-cerrar" data-acc="salir" aria-label="Salir de la lección">✕</button>
      <div class="barra" role="progressbar" aria-label="Progreso de la lección" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
      <span class="chip-juego chip-vidas ${S.perdioAhora ? "pierde" : ""}" aria-label="${S.vidas} vidas">${corazon()}${S.vidas}</span>
      <span class="chip-juego chip-racha" aria-label="Racha de ${S.racha} días">${icono("flame")}${S.racha}</span>
    </header>
    <div class="juego-cuerpo">
      <div class="juego-tarjeta tarjeta">${cuerpoPaso(s)}</div>
      <aside class="juego-kuma"><div class="burbuja-kuma" aria-live="polite">${limpiar(S.msg)}</div><img src="${kumaImg(S.pose)}" alt="" aria-hidden="true"></aside>
    </div>
    ${pieJuego(s)}
  </section>`;
  S.perdioAhora = false;
  const foco = vista.querySelector("[data-foco]");
  if (foco) foco.focus({ preventScroll: true });
}

function claseOpcion(s, valor, correcto) {
  if (S.fase === "feedback") {
    if (valor === correcto) return "correcta";
    if (valor === S.sel && !S.ok) return "incorrecta";
    return "";
  }
  return S.sel === valor ? "sel" : "";
}

function cuerpoPaso(s) {
  const bloq = S.fase === "feedback" ? "disabled" : "";

  if (s.tipo === "ensena") {
    const pista = PISTAS[s.letra] || "Practica la seña con tu mano frente a la pantalla.";
    return `<p class="juego-consigna">Nueva seña</p>
      <div class="sena-grande">${senaImg(s.letra, true)}</div>
      <div class="letra-gigante" aria-label="Letra ${s.letra}">${s.letra}</div>
      <p class="pista">${limpiar(pista)}</p>`;
  }

  if (s.tipo === "sena2letra") {
    s.opc = s.opc || opcionesLetras(s.letra, S.pool);
    return `<p class="juego-consigna">¿Qué letra es esta seña?</p>
      <div class="sena-grande">${senaImg(s.letra, false)}</div>
      <div class="opciones opciones-letras">${s.opc.map(l => `<button class="opcion ${claseOpcion(s, l, s.letra)}" data-op="${l}" ${bloq}>${l}</button>`).join("")}</div>`;
  }

  if (s.tipo === "letra2sena") {
    s.opc = s.opc || opcionesLetras(s.letra, S.pool);
    return `<p class="juego-consigna">Encuentra la seña de la letra</p>
      <div class="letra-gigante">${s.letra}</div>
      <div class="opciones opciones-senas">${s.opc.map((l, i) => `<button class="opcion opcion-sena ${claseOpcion(s, l, s.letra)}" data-op="${l}" aria-label="Opción ${i + 1}" ${bloq}>${senaImg(l, false)}</button>`).join("")}</div>`;
  }

  if (s.tipo === "vf") {
    if (!s.vfLetra) {
      const otros = S.pool.filter(l => l !== s.letra);
      s.vfLetra = (Math.random() < 0.5 || !otros.length) ? s.letra : azar(otros);
      s.vfEs = s.vfLetra === s.letra;
    }
    const correcto = s.vfEs ? "v" : "f";
    return `<p class="juego-consigna">¿Verdadero o falso?</p>
      <div class="sena-grande">${senaImg(s.letra, false)}</div>
      <p class="juego-consigna">Esta seña es la letra <span class="letra-gigante" style="font-size:2.4rem">${s.vfLetra}</span></p>
      <div class="opciones opciones-vf">
        <button class="opcion ${claseOpcion(s, "v", correcto)}" data-op="v" ${bloq}>Verdadero</button>
        <button class="opcion ${claseOpcion(s, "f", correcto)}" data-op="f" ${bloq}>Falso</button>
      </div>`;
  }

  if (s.tipo === "escribe") {
    const estado = S.fase === "feedback" ? (S.ok ? "correcta" : "incorrecta") : "";
    return `<p class="juego-consigna">Escribe la letra de esta seña</p>
      <div class="sena-grande">${senaImg(s.letra, false)}</div>
      <input id="entrada-letra" class="entrada-letra ${estado}" type="text" maxlength="1" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Letra" value="${S.sel || ""}" ${bloq} ${S.fase === "pregunta" ? "data-foco" : ""}>
      <p class="pista">Para la Ñ usa el teclado en español.</p>`;
  }

  if (s.tipo === "parejas") {
    s.izq = s.izq || barajar(s.letras);
    s.der = s.der || barajar(s.letras);
    const hecha = l => s.hechas.includes(l) ? "hecha" : "";
    return `<p class="juego-consigna">Une cada letra con su seña</p>
      <div class="parejas">
        <div class="par-col">${s.izq.map(l => `<button class="par-item ${hecha(l)}" data-par="l:${l}" ${s.hechas.includes(l) ? "disabled" : ""}>${l}</button>`).join("")}</div>
        <div class="par-col">${s.der.map(l => `<button class="par-item ${hecha(l)}" data-par="s:${l}" aria-label="Seña ${s.der.indexOf(l) + 1}" ${s.hechas.includes(l) ? "disabled" : ""}>${senaImg(l, false)}</button>`).join("")}</div>
      </div>`;
  }

  if (s.tipo === "palabra") {
    if (!s.opc) {
      const mismas = barajar(PALABRAS.filter(w => w !== s.palabra && Math.abs(w.length - s.palabra.length) <= 1));
      const extra = barajar(PALABRAS.filter(w => w !== s.palabra && !mismas.includes(w)));
      s.opc = barajar([s.palabra, ...mismas.concat(extra).slice(0, 3)]);
    }
    return `<p class="juego-consigna">¿Qué palabra deletrean estas señas?</p>
      <div class="palabra-fila">${[...s.palabra].map(l => `<div class="sena-mini">${senaImg(l, false)}</div>`).join("")}</div>
      <div class="opciones opciones-palabras">${s.opc.map(w => `<button class="opcion ${claseOpcion(s, w, s.palabra)}" data-op="${w}" ${bloq}>${w}</button>`).join("")}</div>`;
  }
  return "";
}

function textoFeedback(s) {
  const ok = S.ok;
  let detalle = "";
  if (ok) {
    if (s.tipo === "palabra") detalle = `Deletreaste <b>${s.palabra}</b>`;
    else if (s.tipo === "parejas") detalle = "¡Todas las parejas unidas!";
    else detalle = `Es la letra <b>${s.letra}</b>`;
  } else {
    if (s.tipo === "palabra") detalle = `Se deletreaba <b>${s.palabra}</b>`;
    else if (s.tipo === "parejas") detalle = "Te confundiste varias veces. ¡Repásalas en las flashcards!";
    else if (s.tipo === "letra2sena") detalle = `Esta es la seña de la <b>${s.letra}</b>: <span class="sena-mini en-pie">${senaImg(s.letra, true)}</span>`;
    else if (s.tipo === "vf") detalle = `Esta seña es la letra <b>${s.letra}</b>`;
    else detalle = `La respuesta era <b>${s.letra}</b>`;
  }
  return { titulo: S.tituloFb, detalle };
}

function pieJuego(s) {
  if (S.fase === "feedback") {
    const { titulo, detalle } = textoFeedback(s);
    return `<footer class="juego-pie ${S.ok ? "ok" : "mal"}" role="status"><div class="juego-pie-in">
      <div class="pie-mensaje"><strong>${titulo}</strong><span>${detalle}</span></div>
      <button class="boton" data-acc="siguiente" data-foco>CONTINUAR</button></div></footer>`;
  }
  if (s.tipo === "ensena") {
    return `<footer class="juego-pie"><div class="juego-pie-in"><button class="boton" data-acc="siguiente" data-foco>CONTINUAR</button></div></footer>`;
  }
  if (s.tipo === "parejas") {
    return `<footer class="juego-pie"><div class="juego-pie-in"><span class="pie-mensaje">Toca una letra y luego su seña para unirlas.</span></div></footer>`;
  }
  return `<footer class="juego-pie"><div class="juego-pie-in"><button class="boton" id="btn-comprobar" data-acc="comprobar" ${S.sel ? "" : "disabled"}>COMPROBAR</button></div></footer>`;
}

/* ---------- 6) LÓGICA DEL JUEGO ---------- */

function norm(t) { return String(t || "").trim().toLocaleUpperCase("es"); }

function esCorrecta(s) {
  switch (s.tipo) {
    case "sena2letra":
    case "letra2sena": return S.sel === s.letra;
    case "vf": return S.sel === (s.vfEs ? "v" : "f");
    case "escribe": return norm(S.sel) === s.letra;
    case "palabra": return S.sel === s.palabra;
    default: return false;
  }
}

function comprobar() {
  if (S.fase !== "pregunta" || !S.sel) return;
  resolver(esCorrecta(S.pasos[S.i]));
}

function resolver(ok) {
  const s = S.pasos[S.i];
  S.fase = "feedback";
  S.ok = ok;
  let evento;
  if (ok) {
    S.aciertos++; S.combo++; S.hechos++;
    evento = (S.combo >= 3 && S.combo % 3 === 0) ? "combo" : "acierto";
    sonido(evento);
    S.tituloFb = azar(["¡Correcto!", "¡Perfecto!", "¡Muy bien!", "¡Excelente!"]);
    S.pose = "feliz";
  } else {
    S.errores++; S.combo = 0; S.vidas--; S.perdioAhora = true;
    sonido("error");
    evento = "error";
    S.tituloFb = azar(["Casi…", "¡Ups!", "Aún no"]);
    S.pose = "triste";
    // Repetición dentro de la lección: la letra fallada vuelve al final con otro tipo de ejercicio
    if (s.tipo === "palabra") S.pasos.push(paso("palabra", null, { palabra: s.palabra }));
    else if (s.tipo === "parejas") S.pasos.push(pasoParejas(s.letras));
    else S.pasos.push(paso(azar(TIPOS.filter(t => t !== s.tipo)), s.letra));
  }
  // Repetición espaciada: se anota cómo le fue con cada letra
  const afectadas = s.tipo === "palabra" ? [...new Set([...s.palabra])] : (s.tipo === "parejas" ? s.letras : [s.letra]);
  afectadas.forEach(l => registrar(P, l, ok));
  guardarEstado(P);
  S.msg = mensajeKuma(evento);
  render();
}

function siguiente() {
  if (!S) return;
  const s = S.pasos[S.i];
  if (S.fase === "pregunta" && s.tipo === "ensena") S.hechos++;
  else if (S.fase === "feedback" && S.vidas <= 0) return perder();
  S.i++; S.sel = null; S.parSel = null; S.fase = "pregunta"; S.ok = null;
  if (S.i >= S.pasos.length) return terminar();
  const n = S.pasos[S.i], len = S.pasos.length;
  const ev = n.tipo === "ensena" ? "ensena" : S.i === Math.floor(len / 2) ? "mitad" : S.i === len - 1 ? "casi" : "animo";
  S.msg = mensajeKuma(ev);
  S.pose = ev === "ensena" ? "pensando" : "normal";
  render();
}

function clickPareja(el) {
  const s = S.pasos[S.i];
  const [lado, letra] = el.dataset.par.split(":");
  if (el.classList.contains("hecha")) return;
  const prev = S.parSel;
  if (!prev || prev.lado === lado) {
    if (prev) prev.el.classList.remove("sel");
    S.parSel = { lado, letra, el };
    el.classList.add("sel");
    return;
  }
  if (prev.letra === letra) {
    [prev.el, el].forEach(x => { x.classList.remove("sel"); x.classList.add("hecha"); x.disabled = true; });
    s.hechas.push(letra);
    S.parSel = null;
    if (s.hechas.length === s.letras.length) setTimeout(() => { if (S && S.pasos[S.i] === s && S.fase === "pregunta") resolver(s.fallos <= 2); }, 450);
  } else {
    s.fallos++;
    const a = prev.el, b = el;
    a.classList.remove("sel");
    [a, b].forEach(x => x.classList.add("sacude"));
    setTimeout(() => [a, b].forEach(x => x.classList.remove("sacude")), 450);
    S.parSel = null;
  }
}

/* ---------- 7) FINAL: RESULTADO O SIN VIDAS ---------- */

function terminar() {
    sonido("fin");
  const total = S.aciertos + S.errores;
  const prec = total ? S.aciertos / total : 1;
  const est = prec >= 0.9 ? 3 : prec >= 0.7 ? 2 : 1;
  const xp = 10 + S.aciertos * 2 + (est === 3 ? 10 : 0);
  const numerica = typeof S.L.id === "number";
  const eraNueva = numerica && !P.completadas.includes(S.L.id);
  if (numerica) {
    if (eraNueva) P.completadas.push(S.L.id);
    P.estrellas[S.L.id] = Math.max(P.estrellas[S.L.id] || 0, est);
  }
  P.xp += xp;
  sumarRacha(P);
  guardarEstado(P);
  S.fase = "fin";

  const terminoTodo = numerica && S.L.final;
  const siguienteL = numerica ? LECCIONES_ALFABETO.find(l => l.id === S.L.id + 1) : null;
  const msg = mensajeKuma(terminoTodo ? "final" : "fin");
  vista.innerHTML = `
  <section class="pantalla juego">
    <div class="tarjeta resultado">
      <img src="${kumaImg("celebra")}" alt="" aria-hidden="true">
      <h1>${terminoTodo ? "¡Alfabeto completado!" : (numerica ? "¡Lección " + S.L.id + " completada!" : "¡Repaso terminado!")}</h1>
      <div class="estrellas-res" aria-label="${est} de 3 estrellas">${[1, 2, 3].map(n => `<span class="${n <= est ? "on" : ""}">★</span>`).join("")}</div>
      <div class="burbuja-kuma">${limpiar(msg)}</div>
      <div class="res-stats">
        <div><strong>+${xp}</strong><small>XP</small></div>
        <div><strong>${Math.round(prec * 100)}%</strong><small>Precisión</small></div>
        <div><strong>${rachaActual(P)}</strong><small>Racha</small></div>
      </div>
      <div class="res-botones">
        ${siguienteL && eraNueva ? `<a class="boton grande" href="#/leccion/${siguienteL.id}">SIGUIENTE</a>` : ""}
        <button class="boton sec" data-acc="reiniciar">REPETIR</button>
        <a class="boton sec" href="#/alfabeto">AL MAPA</a>
      </div>
    </div>
  </section>`;
}

function perder() {
    sonido("perdio");
  S.fase = "perdio";
  vista.innerHTML = `
  <section class="pantalla juego">
    <div class="tarjeta resultado">
      <img src="${kumaImg("triste")}" alt="" aria-hidden="true">
      <h1>Te quedaste sin vidas</h1>
      <div class="burbuja-kuma">${limpiar(mensajeKuma("perdio"))}</div>
      <p class="pista">Las letras que fallaste quedaron anotadas para tu próximo repaso.</p>
      <div class="res-botones">
        <button class="boton" data-acc="reiniciar" data-foco>INTENTAR DE NUEVO</button>
        <a class="boton sec" href="#/alfabeto">AL MAPA</a>
      </div>
    </div>
  </section>`;
  const f = vista.querySelector("[data-foco]"); if (f) f.focus({ preventScroll: true });
}

/* ---------- 8) PANTALLA: FLASHCARDS ---------- */

let fcFiltro = "todas";
let fcOrden = [...LETRAS];

function letrasFiltradas() {
  if (fcFiltro === "todas") return fcOrden;
  if (fcFiltro === "aprendidas") { const ap = aprendidas(leerEstado()); return fcOrden.filter(l => ap.includes(l)); }
  const L = LECCIONES_ALFABETO.find(x => String(x.id) === fcFiltro);
  return L ? fcOrden.filter(l => L.letras.includes(l)) : fcOrden;
}

function pantallaFlashcards() {
  const filtros = [["todas", "Todas"], ["aprendidas", "Mis aprendidas"], ...LECCIONES_ALFABETO.filter(x => !x.final).map(x => [String(x.id), "Lección " + x.id])];
  const letras = letrasFiltradas();
  const tarjetas = letras.length
    ? letras.map(l => `
      <button class="flashcard" data-flip data-letra="${l}" aria-pressed="false" aria-label="Tarjeta de seña. Toca para ver la letra">
        <span class="fc-inner">
          <span class="fc-cara fc-frente">${senaImg(l, false)}<small>Toca para voltear</small></span>
          <span class="fc-cara fc-dorso"><b>${l}</b><small>Toca para volver</small></span>
        </span>
      </button>`).join("")
    : `<div class="tarjeta fc-vacio">Aún no hay letras aprendidas. ¡Completa la lección 1 y vuelve!</div>`;

  return `
  <section class="pantalla">
    <div class="banner">${icono("hand")}<div><h1>Flashcards</h1><p>Voltea la tarjeta y comprueba la letra</p></div><img class="banner-kuma" src="${kumaImg("pensando")}" alt="" aria-hidden="true"></div>
    <div class="fc-decks">
      <button class="fc-deck activo" aria-pressed="true">Alfabeto</button>
      <button class="fc-deck pronto" data-aviso="Este mazo llega pronto">Saludos · pronto</button>
      <button class="fc-deck pronto" data-aviso="Este mazo llega pronto">Palabras básicas · pronto</button>
    </div>
    <div class="alfa-kuma"><img src="${kumaImg("normal")}" alt="" aria-hidden="true"><div class="burbuja-kuma" aria-live="polite">${limpiar(mensajeKuma("flash"))}</div></div>
    <div class="fc-filtros" role="group" aria-label="Filtrar letras">
      ${filtros.map(([id, nombre]) => `<button class="chip-filtro ${fcFiltro === id ? "activo" : ""}" data-filtro="${id}" aria-pressed="${fcFiltro === id}">${nombre}</button>`).join("")}
    </div>
    <div class="fc-barra">
      <span class="chip-juego">${letras.length} tarjeta(s)</span>
      <span><button class="boton" data-fc="mezclar">Mezclar</button> <button class="boton gris" data-fc="orden" style="cursor:pointer">A – Z</button></span>
    </div>
    <div class="fc-grid">${tarjetas}</div>
    <a class="volver" href="#/alfabeto">← Ir a las lecciones del alfabeto</a>
  </section>`;
}

function repintarFlash() { vista.innerHTML = pantallaFlashcards(); }

/* ---------- 9) EVENTOS (uno solo para toda la vista) ---------- */

vista.addEventListener("click", e => {
  const el = e.target.closest("[data-acc],[data-op],[data-par],[data-flip],[data-filtro],[data-fc]");
  if (!el) return;
  const enLeccion = location.hash.startsWith("#/leccion/") && S;

  if (location.hash === "#/flashcards") {
    if (el.dataset.flip !== undefined) {
      const vuelta = el.classList.toggle("volteada");
      el.setAttribute("aria-pressed", vuelta);
      el.setAttribute("aria-label", vuelta ? `Letra ${el.dataset.letra}. Toca para volver a la seña` : "Tarjeta de seña. Toca para ver la letra");
      actualizarMensajeFlash(vuelta ? "flashRevelar" : "flashVolver", vuelta ? "feliz" : "pensando");
    } else if (el.dataset.filtro) { fcFiltro = el.dataset.filtro; repintarFlash(); }
    else if (el.dataset.fc === "mezclar") { fcOrden = barajar(fcOrden); repintarFlash(); actualizarMensajeFlash("flashConocida", "feliz"); }
    else if (el.dataset.fc === "orden") { fcOrden = [...LETRAS]; repintarFlash(); actualizarMensajeFlash("flashConocida", "feliz"); }
    return;
  }

  if (!enLeccion) return;
  const acc = el.dataset.acc;
  if (acc === "salir") {
    if (S.fase === "fin" || S.fase === "perdio" || confirm("¿Salir de la lección? Perderás el avance de esta sesión.")) location.hash = "#/alfabeto";
  } else if (acc === "siguiente") siguiente();
  else if (acc === "comprobar") comprobar();
  else if (acc === "reiniciar") iniciar(S.L);
  else if (el.dataset.op !== undefined && S.fase === "pregunta") {
    S.sel = el.dataset.op;
    vista.querySelectorAll("[data-op]").forEach(b => b.classList.toggle("sel", b === el));
    const b = document.getElementById("btn-comprobar"); if (b) b.removeAttribute("disabled");
  } else if (el.dataset.par !== undefined && S.fase === "pregunta") clickPareja(el);
});

vista.addEventListener("input", e => {
  if (!S || e.target.id !== "entrada-letra") return;
  const v = e.target.value.trim().toLocaleUpperCase("es").slice(0, 1);
  e.target.value = v;
  S.sel = v || null;
  const b = document.getElementById("btn-comprobar");
  if (b) { if (v) b.removeAttribute("disabled"); else b.setAttribute("disabled", ""); }
});

vista.addEventListener("keydown", e => {
  if (e.key === "Enter" && S && e.target.id === "entrada-letra" && S.sel) comprobar();
});

/* ---------- 10) RUTAS NUEVAS Y MODO LECCIÓN ---------- */

rutas.alfabeto = pantallaAlfabeto;
rutas.leccion = pantallaLeccion;
rutas.flashcards = pantallaFlashcards;

function marcarModoLeccion() { document.body.classList.toggle("en-leccion", location.hash.startsWith("#/leccion/")); }
window.addEventListener("hashchange", marcarModoLeccion);
marcarModoLeccion();
