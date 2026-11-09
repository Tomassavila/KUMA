/* =========================================================
   Kuma - Extras: Letra del día, Semana de racha, Confeti y Reto relámpago
   Se carga DESPUÉS de alfabeto.js, saludos.js y palabras.js.
   Reutiliza: azar, barajar, kumaImg, icono, limpiar, leerEstado,
   guardarEstado, rachaActual, sonido, vista, rutas, mostrarAviso.
   Estilos: extras.css
   ========================================================= */

/* ---------- 0) CONFIGURACIÓN (ajusta esto si hace falta) ---------- */

// Hashes que cuentan como "pantalla de inicio" (aquí se añaden los bloques)
const EX_INICIO = ["", "#", "#/", "#/inicio"];
// A dónde lleva el botón "Al inicio"
const EX_INICIO_HREF = "#/";
// true = los bloques se añaden solos al final del inicio.
// false = tú pones ${exHtmlInicio()} dentro de tu pantalla de inicio.
const EX_AUTO_INICIO = true;

// Imágenes de las letras (solo se usan si tu alfabeto.js no trae la ruta en cada letra)
const EX_RUTA_LETRA = "assets/assets/";
const EX_EXT_LETRA = "jpeg";
const EX_ABC = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

const EX_RETO_SEGUNDOS = 30;

/* ---------- 1) LETRAS ---------- */

// Intenta usar la lista de letras de alfabeto.js (LETRAS, ALFABETO o ABECEDARIO).
// Si no la encuentra, usa A–Z con la ruta de arriba.
function exLetras() {
  const fuente = [
    typeof LETRAS !== "undefined" ? LETRAS : null,
    typeof ALFABETO !== "undefined" ? ALFABETO : null,
    typeof ABECEDARIO !== "undefined" ? ABECEDARIO : null
  ].find(Array.isArray);
  const lista = (fuente && fuente.length ? fuente : EX_ABC).map(it => {
    if (typeof it === "string") return { letra: it, img: null };
    return {
      letra: it.letra || it.id || it.nombre || it.l || "?",
      img: it.img || it.imagen || it.src || it.archivo || null
    };
  });
  return lista.map(x => ({ letra: String(x.letra).toUpperCase(), img: x.img }));
}

function exSrcLetra(it) {
  if (it.img && /[\/.]/.test(it.img)) return it.img;
  if (typeof RUTA_SENAS === "string" && typeof EXT_SENAS === "string") {
    return `${RUTA_SENAS}${archivoSena(it.img || it.letra)}.${EXT_SENAS}`;
  }
  return `${EX_RUTA_LETRA}${encodeURIComponent(it.img || it.letra)}.${EX_EXT_LETRA}`;
}
function exImgLetra(it, alt) {
  return `<img class="sena-img" src="${exSrcLetra(it)}" alt="${limpiar(alt)}" draggable="false" loading="lazy" onerror="exFalta(this)">`;
}
function exFalta(img) {
  const d = document.createElement("div");
  d.className = "sena-falta";
  d.innerHTML = `${icono("hand")}<small>Falta imagen</small>`;
  img.replaceWith(d);
}

function exSonido(n) { if (typeof sonido === "function") sonido(n); }

/* ---------- 2) FECHAS Y DÍAS PRACTICADOS ---------- */

const exClave = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
function exDiasAtras(n) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

// Días practicados. Si aún no hay historial pero hay racha, se reconstruye hacia atrás desde ayer.
function exDiasPracticados(p) {
  if (Array.isArray(p.dias)) return new Set(p.dias);
  const s = new Set();
  const n = rachaActual(p) || 0;
  const hoy = exClave(new Date());
  const incluyeHoy = p.ultimaFecha === hoy;
  for (let i = 0; i < n; i++) s.add(exClave(exDiasAtras(i + (incluyeHoy ? 0 : 1))));
  return s;
}

// Guarda hoy como día practicado (se llama al terminar una lección)
function exRegistrarHoy(p = leerEstado()) {
  const hoy = exClave(new Date());
  if (!Array.isArray(p.dias)) {
    p.dias = [...exDiasPracticados(p)];
  }
  if (!p.dias.includes(hoy)) p.dias.push(hoy);
  p.dias = p.dias.slice(-60);
  guardarEstado(p);
  return p;
}

/* ---------- 3) BLOQUES DEL INICIO ---------- */

function exHtmlMetaDiaria() {
  const hecha = (leerEstado().metasDiarias || []).includes(exClave(new Date()));
  return `<div class="tarjeta ex-meta">
    <h2>${icono("star")} Meta diaria</h2>
    <p>Completa 1 lección hoy</p>
    <div class="barra" role="progressbar" aria-label="Meta diaria: completar una lección" aria-valuemin="0" aria-valuemax="1" aria-valuenow="${hecha ? 1 : 0}"><span style="width:${hecha ? 100 : 0}%"></span></div>
    <p class="ex-nota">${hecha ? "¡Meta cumplida! Sigue aprendiendo a tu ritmo." : "Completa una lección para llenar la barra."}</p>
  </div>`;
}

function exHtmlSemana() {
  const p = leerEstado();
  const hechos = exDiasPracticados(p);
  const hoyD = new Date();
  const hoy = exClave(hoyD);
  const lunes = new Date(hoyD);
  lunes.setDate(hoyD.getDate() - ((hoyD.getDay() + 6) % 7));
  const letras = ["L", "M", "M", "J", "V", "S", "D"];
  const nombres = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const racha = rachaActual(p) || 0;

  const dias = letras.map((l, i) => {
    const d = new Date(lunes); d.setDate(lunes.getDate() + i);
    const k = exClave(d);
    const hecho = hechos.has(k);
    const cls = `ex-dia ${hecho ? "hecho" : ""} ${k === hoy ? "hoy" : ""} ${k > hoy ? "futuro" : ""}`;
    return `<div class="${cls}" role="img" aria-label="${nombres[i]}: ${hecho ? "practicado" : "sin practicar"}"><span>${hecho ? "✓" : ""}</span><b>${l}</b></div>`;
  }).join("");

  const aviso = hechos.has(hoy)
    ? "¡Hoy ya practicaste! Tu racha está a salvo."
    : racha > 0 ? "Practica hoy para mantener tu racha." : "Practica hoy para empezar una racha.";

  return `<div class="tarjeta ex-semana">
    <h2>${icono("flame")} Tu semana · racha de ${racha} día${racha === 1 ? "" : "s"}</h2>
    <div class="ex-dias">${dias}</div>
    <p class="ex-nota">${aviso}</p>
  </div>`;
}

function exHtmlLetraDelDia() {
  const L = exLetras();
  const h = new Date();
  const dia = Math.floor(Date.UTC(h.getFullYear(), h.getMonth(), h.getDate()) / 86400000);
  const it = L[dia % L.length];
  const fecha = h.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  return `<div class="tarjeta ex-ldd">
    <div class="ex-ldd-card">
      <button class="flashcard" data-exflip aria-pressed="false" aria-label="Letra del día. Toca para ver la letra">
        <span class="fc-inner">
          <span class="fc-cara fc-frente">${exImgLetra(it, "Seña de la letra del día")}<small>Toca para voltear</small></span>
          <span class="fc-cara fc-dorso"><b class="sal-fc-nombre ex-ldd-letra">${limpiar(it.letra)}</b><small>Toca para volver</small></span>
        </span>
      </button>
    </div>
    <div class="ex-ldd-texto">
      <h2>Letra del día</h2>
      <p class="ex-fecha">${limpiar(fecha)}</p>
      <p>Mira la seña, adivina la letra y voltea la tarjeta. ¡Mañana habrá otra!</p>
    </div>
  </div>`;
}

function exHtmlRetoCard() {
  const mejor = (leerEstado().reto || {}).mejor || 0;
  return `<div class="tarjeta ex-reto-card">
    <h2>${icono("flame")} Reto relámpago</h2>
    <p>${EX_RETO_SEGUNDOS} segundos para adivinar cuantas letras puedas.${mejor ? ` Tu récord: <b>${mejor}</b>.` : ""}</p>
    <a class="boton" href="#/reto">${icono("play")} JUGAR</a>
  </div>`;
}

function exHtmlInicio() {
  return `<section id="ex-inicio" class="ex-inicio" aria-label="Extras para aprender">
    ${exHtmlMetaDiaria()}
    ${exHtmlSemana()}
    ${exHtmlRetoCard()}
  </section>`;
}

// Añade los bloques al final del inicio cada vez que se pinta esa pantalla
function exInyectar() {
  if (!EX_AUTO_INICIO || !EX_INICIO.includes(location.hash)) return;
  if (vista.querySelector("#ex-inicio")) return;
  const cont = vista.querySelector(".pantalla") || vista;
  cont.insertAdjacentHTML("beforeend", exHtmlInicio());
}

// Voltear la letra del día
vista.addEventListener("click", e => {
  const el = e.target.closest("[data-exflip]");
  if (!el) return;
  const v = el.classList.toggle("volteada");
  el.setAttribute("aria-pressed", v);
});

/* ---------- 4) CONFETI ---------- */

function exConfeti(grande) {
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas");
  c.className = "ex-confeti";
  c.setAttribute("aria-hidden", "true");
  document.body.appendChild(c);
  const ctx = c.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth, H = window.innerHeight;
  c.width = W * dpr; c.height = H * dpr;
  ctx.scale(dpr, dpr);
  const colores = ["#2ecc71", "#27ae60", "#a8e6a1", "#f6c945", "#ff8fab", "#6ec6ff", "#ffffff"];
  const n = grande ? 240 : 120;
  const DUR = 3200;
  const ps = Array.from({ length: n }, (_, i) => {
    const izq = grande && i % 2 === 0;
    const der = grande && i % 2 === 1;
    return {
      x: izq ? 0 : der ? W : W / 2 + (Math.random() - 0.5) * W * 0.3,
      y: grande ? H * 0.75 : H * 0.6,
      vx: (izq ? 1 : der ? -1 : 0) * (4 + Math.random() * 8) + (Math.random() - 0.5) * 10,
      vy: -(Math.random() * 14 + 8),
      g: 0.35 + Math.random() * 0.15,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 6, h: 4 + Math.random() * 5,
      col: colores[Math.floor(Math.random() * colores.length)]
    };
  });
  const t0 = performance.now();
  (function frame(t) {
    const dt = t - t0;
    ctx.clearRect(0, 0, W, H);
    ps.forEach(q => {
      q.vy += q.g; q.vx *= 0.99; q.x += q.vx; q.y += q.vy; q.r += q.vr;
      ctx.save();
      ctx.translate(q.x, q.y); ctx.rotate(q.r);
      ctx.globalAlpha = Math.max(0, 1 - dt / DUR);
      ctx.fillStyle = q.col;
      ctx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h);
      ctx.restore();
    });
    if (dt < DUR) requestAnimationFrame(frame); else c.remove();
  })(t0);
}

const EX_LOGROS = [
  { id: "primer-paso", nombre: "Primer paso", detalle: "Practica por primera vez.", icono: "hand", cumple: p => (p.dias || []).length > 0 },
  { id: "racha-3", nombre: "Racha de 3 días", detalle: "Practica durante 3 días seguidos.", icono: "flame", cumple: p => rachaActual(p) >= 3 },
  { id: "primera-leccion", nombre: "Primera lección", detalle: "Completa tu primera lección.", icono: "book", cumple: p => exCantidadLecciones(p) >= 1 },
  { id: "10-estrellas", nombre: "10 estrellas", detalle: "Consigue 10 estrellas.", icono: "star", cumple: p => exContarEstrellas(p) >= 10 },
  { id: "explorador", nombre: "Explorador", detalle: "Completa 3 lecciones.", icono: "people", cumple: p => exCantidadLecciones(p) >= 3 },
  { id: "alfabeto-completo", nombre: "Alfabeto completo", detalle: "Completa las 10 lecciones del alfabeto.", icono: "abc", cumple: p => Array.from({ length: 10 }, (_, i) => i + 1).every(id => (p.completadas || []).includes(id)) },
  { id: "maestro-kuma", nombre: "Maestro Kuma", detalle: "Completa todas las lecciones de Kuma.", icono: "medal", cumple: p => (p.completadas || []).length >= 10 && (p.saludos?.completadas || []).length >= 5 && (p.palabras?.completadas || []).length >= 7 }
];

function exCantidadLecciones(p) {
  return (p.completadas || []).length + (p.saludos?.completadas || []).length + (p.palabras?.completadas || []).length;
}

function exContarEstrellas(p) {
  return [p.estrellas || {}, p.saludos?.estrellas || {}, p.palabras?.estrellas || {}]
    .reduce((total, items) => total + Object.values(items).reduce((suma, valor) => suma + Number(valor || 0), 0), 0);
}

function exActualizarLogros(p) {
  const desbloqueadas = p.medallasDesbloqueadas || [];
  const nuevas = EX_LOGROS.filter(logro => logro.cumple(p) && !desbloqueadas.includes(logro.id));
  p.medallasDesbloqueadas = [...new Set([...desbloqueadas, ...nuevas.map(logro => logro.id)])];
  p.medallasNuevas = [...new Set([...(p.medallasNuevas || []), ...nuevas.map(logro => logro.id)])];
  return nuevas;
}

function exDatosPerfil(p) {
  exActualizarLogros(p);
  const nuevas = new Set(p.medallasNuevas || []);
  const medallas = EX_LOGROS.map(logro => {
    const ganada = p.medallasDesbloqueadas.includes(logro.id);
    return `<div class="tarjeta medalla ${ganada ? "" : "apagada"} ${nuevas.has(logro.id) ? "nueva" : ""}">${icono(logro.icono)}<strong>${limpiar(logro.nombre)}</strong><small>${limpiar(logro.detalle)}</small>${nuevas.has(logro.id) ? '<span class="medalla-etiqueta">¡NUEVA!</span>' : ""}</div>`;
  }).join("");
  p.medallasNuevas = [];
  guardarEstado(p);
  return {
    nombre: (KumaAuth.current() || {}).username || "Explorador Kuma",
    nivel: Math.floor((p.xp || 0) / 100) + 1,
    xp: (p.xp || 0) % 100,
    racha: rachaActual(p),
    estrellas: exContarEstrellas(p),
    lecciones: exCantidadLecciones(p),
    medallas
  };
}

/* Detecta el final de una lección, registra el día y actualiza sus logros. */
let exRachaPrev = rachaActual(leerEstado()) || 0;

function exRevisarResultado() {
  const res = vista.querySelector(".resultado .estrellas-res");
  if (!res) { exRachaPrev = rachaActual(leerEstado()) || 0; return; }
  const tarjeta = res.closest(".resultado");
  if (tarjeta.dataset.exListo) return;
  tarjeta.dataset.exListo = "1";

  if (!/^#\/(leccion|saludo|palabra)\/\d+$/.test(location.hash)) return;

  const p = leerEstado();
  const rachaAntes = exRachaPrev;
  exRegistrarHoy(p);
  const hoy = exClave(new Date());
  p.metasDiarias = [...new Set([...(p.metasDiarias || []), hoy])].slice(-60);
  const nuevas = exActualizarLogros(p);
  guardarEstado(p);

  const ahora = rachaActual(leerEstado()) || 0;
  const subio = ahora > rachaAntes;
  exRachaPrev = ahora;

  setTimeout(() => {
    exConfeti(subio);
    if (subio || nuevas.length) {
      exSonido("fin");
      if (nuevas.length && typeof mostrarAviso === "function") mostrarAviso(`¡Nueva medalla: ${nuevas[0].nombre}!`);
      else if (subio && typeof mostrarAviso === "function") mostrarAviso(`¡Racha de ${ahora} día${ahora === 1 ? "" : "s"}!`);
      setTimeout(() => exConfeti(false), 350);
    }
  }, 120);
}

new MutationObserver(() => { exInyectar(); exRevisarResultado(); }).observe(vista, { childList: true });
window.addEventListener("hashchange", () => setTimeout(exInyectar, 0));
exInyectar();

/* ---------- 5) RETO RELÁMPAGO ---------- */

let RT = null; // estado del reto en curso

function pantallaReto() {
  retoDetener();
  const p = leerEstado();
  const r = p.reto || { mejor: 0, jugadas: 0 };
  return `
  <section class="pantalla alfa">
    <div class="banner">${icono("flame")}<div><h1>Reto relámpago</h1><p>${EX_RETO_SEGUNDOS} segundos · adivina cuantas letras puedas</p></div><img class="banner-kuma" src="${kumaImg("feliz")}" alt="" aria-hidden="true"></div>
    <div class="alfa-stats">
      <span class="chip-juego chip-xp">${icono("star")}Récord: ${r.mejor}</span>
      <span class="chip-juego">${icono("book")}${r.jugadas} partida${r.jugadas === 1 ? "" : "s"}</span>
    </div>
    <div class="alfa-kuma"><img src="${kumaImg("normal")}" alt="" aria-hidden="true"><div class="burbuja-kuma">Te muestro una seña y tú eliges la letra. ¡Rápido, que el tiempo corre!</div></div>
    <div class="tarjeta ex-reto-reglas">
      <h2>Cómo se juega</h2>
      <p>Cada letra acertada suma 1 punto. Si fallas no pierdes vidas, pero tampoco sumas. Ganas 2 XP por punto.</p>
      <button class="boton grande" data-racc="jugar">¡EMPEZAR!</button>
    </div>
    <a class="volver" href="${EX_INICIO_HREF}">← Volver al inicio</a>
  </section>`;
}

function retoDetener() {
  if (RT && RT.timer) clearInterval(RT.timer);
  RT = null;
  document.body.classList.remove("en-leccion");
}

function retoJugar() {
  if (RT && RT.timer) clearInterval(RT.timer);
  RT = {
    fase: "jugando", fin: Date.now() + EX_RETO_SEGUNDOS * 1000,
    aciertos: 0, fallos: 0, combo: 0, mejorCombo: 0,
    actual: null, previa: null, bloq: false, timer: null
  };
  document.body.classList.add("en-leccion");
  vista.innerHTML = `
  <section class="pantalla juego ex-reto">
    <header class="juego-top">
      <button class="juego-cerrar" data-racc="salir" aria-label="Salir del reto">✕</button>
      <div class="barra" role="progressbar" aria-label="Tiempo restante" aria-valuemin="0" aria-valuemax="${EX_RETO_SEGUNDOS}"><span id="rt-barra" style="width:100%"></span></div>
      <span class="chip-juego chip-racha" id="rt-tiempo" aria-label="Segundos restantes">${EX_RETO_SEGUNDOS}</span>
      <span class="chip-juego chip-xp" id="rt-puntos" aria-label="Puntos">0</span>
    </header>
    <div class="juego-cuerpo">
      <div class="juego-tarjeta tarjeta" id="rt-cuerpo"></div>
    </div>
  </section>`;
  retoPregunta();
  RT.timer = setInterval(retoTick, 100);
}

function retoPregunta() {
  const L = exLetras();
  let t;
  do { t = azar(L); } while (L.length > 1 && RT.previa === t.letra);
  RT.previa = t.letra;
  const otros = barajar(L.filter(x => x.letra !== t.letra)).slice(0, 3);
  RT.actual = { t, opc: barajar([t, ...otros].map(x => x.letra)) };
  RT.bloq = false;
  const cuerpo = document.getElementById("rt-cuerpo");
  if (!cuerpo) return;
  cuerpo.innerHTML = `<p class="juego-consigna">¿Qué letra es?</p>
    <div class="sena-grande">${exImgLetra(t, "Seña de una letra")}</div>
    <div class="opciones opciones-textos ex-reto-opc">${RT.actual.opc.map(l => `<button class="opcion" data-rop="${limpiar(l)}">${limpiar(l)}</button>`).join("")}</div>`;
}

function retoTick() {
  if (!RT || RT.fase !== "jugando") return;
  const resta = Math.max(0, RT.fin - Date.now());
  const barra = document.getElementById("rt-barra");
  const tiempo = document.getElementById("rt-tiempo");
  if (barra) barra.style.width = (resta / (EX_RETO_SEGUNDOS * 1000) * 100) + "%";
  if (tiempo) tiempo.textContent = Math.ceil(resta / 1000);
  if (resta <= 0) retoTerminar();
}

function retoResponder(letra, el) {
  if (!RT || RT.fase !== "jugando" || RT.bloq) return;
  RT.bloq = true;
  const ok = letra === RT.actual.t.letra;
  const cuerpo = document.getElementById("rt-cuerpo");
  if (ok) {
    RT.aciertos++; RT.combo++; RT.mejorCombo = Math.max(RT.mejorCombo, RT.combo);
    exSonido("acierto");
    const pts = document.getElementById("rt-puntos"); if (pts) pts.textContent = RT.aciertos;
  } else {
    RT.fallos++; RT.combo = 0;
    exSonido("error");
  }
  if (cuerpo) cuerpo.querySelectorAll("[data-rop]").forEach(b => {
    b.disabled = true;
    if (b.dataset.rop === RT.actual.t.letra) b.classList.add("correcta");
    else if (b === el && !ok) b.classList.add("incorrecta");
  });
  setTimeout(() => { if (RT && RT.fase === "jugando") retoPregunta(); }, ok ? 300 : 650);
}

function retoTerminar() {
  if (!RT || RT.fase !== "jugando") return;
  clearInterval(RT.timer);
  RT.fase = "fin";
  document.body.classList.remove("en-leccion");
  exSonido("fin");

  const p = leerEstado();
  const r = p.reto || { mejor: 0, jugadas: 0 };
  const rachaAntes = rachaActual(p);
  const record = RT.aciertos > r.mejor;
  const xp = RT.aciertos * 2;
  p.reto = { mejor: Math.max(r.mejor, RT.aciertos), jugadas: r.jugadas + 1 };
  p.xp = (p.xp || 0) + xp;
  sumarRacha(p);
  exRegistrarHoy(p);
  const nuevas = exActualizarLogros(p);
  guardarEstado(p);

  const total = RT.aciertos + RT.fallos;
  const prec = total ? Math.round(RT.aciertos / total * 100) : 0;
  const msg = record && RT.aciertos > 0 ? "¡Nuevo récord! Tus manos van volando." : RT.aciertos >= 8 ? "¡Qué velocidad! Casi un récord." : "Buen intento. ¡Otra ronda y mejoras!";
  vista.innerHTML = `
  <section class="pantalla juego">
    <div class="tarjeta resultado">
      <img src="${kumaImg(record && RT.aciertos > 0 ? "celebra" : "feliz")}" alt="" aria-hidden="true">
      <h1>${RT.aciertos} letra${RT.aciertos === 1 ? "" : "s"} en ${EX_RETO_SEGUNDOS} s</h1>
      <div class="burbuja-kuma">${limpiar(msg)}</div>
      <div class="res-stats">
        <div><strong>+${xp}</strong><small>XP</small></div>
        <div><strong>${prec}%</strong><small>Precisión</small></div>
        <div><strong>${p.reto.mejor}</strong><small>Récord</small></div>
      </div>
      <div class="res-botones">
        <button class="boton grande" data-racc="jugar" data-foco>JUGAR OTRA VEZ</button>
        <a class="boton sec" href="${EX_INICIO_HREF}">AL INICIO</a>
      </div>
    </div>
  </section>`;
  if ((record && RT.aciertos > 0) || rachaActual(p) > rachaAntes || nuevas.length) {
    setTimeout(() => exConfeti(true), 150);
    if (rachaActual(p) > rachaAntes || nuevas.length) exSonido("fin");
    if (nuevas.length) mostrarAviso(`¡Nueva medalla: ${nuevas[0].nombre}!`);
    else if (rachaActual(p) > rachaAntes) mostrarAviso(`¡Racha de ${rachaActual(p)} día${rachaActual(p) === 1 ? "" : "s"}!`);
  }
  const f = vista.querySelector("[data-foco]"); if (f) f.focus({ preventScroll: true });
}

vista.addEventListener("click", e => {
  if (location.hash !== "#/reto") return;
  const el = e.target.closest("[data-racc],[data-rop]");
  if (!el) return;
  const acc = el.dataset.racc;
  if (acc === "jugar") retoJugar();
  else if (acc === "salir") { retoDetener(); vista.innerHTML = pantallaReto(); }
  else if (el.dataset.rop !== undefined) retoResponder(el.dataset.rop, el);
});

// En ordenador: se puede responder pulsando la letra en el teclado
document.addEventListener("keydown", e => {
  if (!RT || RT.fase !== "jugando" || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toUpperCase();
  const b = [...document.querySelectorAll("[data-rop]")].find(x => x.dataset.rop === k);
  if (b) retoResponder(k, b);
});

// Si el usuario se va a otra pantalla en mitad del reto, se detiene el reloj
window.addEventListener("hashchange", () => { if (location.hash !== "#/reto") retoDetener(); });

rutas.reto = pantallaReto;
