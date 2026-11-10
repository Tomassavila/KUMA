/* =========================================================
   Kuma - Lecciones del alfabeto con cámara ("Imita la seña")
   Se carga DESPUÉS de camara-core.js, alfabeto.js, saludos.js,
   palabras.js y extras.js (usa exLetras y exImgLetra de extras.js).
   Ruta: #/camara  (mapa)  ·  #/camara/N  (lección)
   ========================================================= */

/* ---------- 0) CONFIGURACIÓN ---------- */

const CAM_DATOS = "data/senas.json";      // archivo opcional; también lee las muestras locales del navegador
const CAM_EXCLUIR = [];                   // letras que no entran (solo las de trayectoria larga, que no es tu caso).
                                          // G y F llevan un giro: se resuelven grabándolas en sus dos posiciones (ver grabar.html)
const CAM_MIN_MUESTRAS = 15;              // una letra solo entra en las lecciones si tiene al menos estas muestras
const CAM_GRUPO = 4;                      // letras por lección
const CAM_HOLD_MS = 800;                  // tiempo que hay que mantener la seña bien hecha
const CAM_TIEMPO_S = 20;                  // tiempo máximo por letra
const CAM_UMBRAL_CONF = 0.6;              // proporción de vecinos que deben coincidir (0-1)
const CAM_DIST_MAX = 0.9;                 // distancia máxima a las muestras (ajústala con "Probar" en grabar.html)
const CAM_DINAMICAS = new Set(["J", "Z", "Ñ"]); // en LSC necesitan trazo, no basta una pose fija
const CAM_VENTANA_TEMPORAL_MS = 650;
const CAM_MOVIMIENTO_MIN = 0.45;          // desplazamiento mínimo en fracciones del tamaño de la mano

/* ---------- 1) UTILIDADES ---------- */

let CAMD = null;   // { muestras, conteo }
let CS = null;     // sesión de la lección en curso

const camEl = id => document.getElementById(id);
function camSonido(n) { if (typeof sonido === "function") sonido(n); }
function camEstado(p) {
  if (!p.camara) p.camara = { completadas: [], estrellas: {} };
  return p.camara;
}
async function camDatos() {
  if (!CAMD) {
    let m = await KumaCam.cargarDatos(CAM_DATOS);
    if (!m.length) {
      const tarjeta = document.querySelector("#vista .tarjeta");
      if (tarjeta) tarjeta.textContent = "Preparando el reconocimiento la primera vez. Esto puede tardar unos minutos…";
      const nuevas = await KumaCam.cargarDatasetLSC70((hechas, total, detectadas) => {
        const estado = document.querySelector("#vista .tarjeta");
        if (estado) estado.textContent = `Preparando reconocimiento: ${hechas}/${total} imágenes · ${detectadas} señas detectadas…`;
      });
      if (!nuevas.length) throw new Error("No se detectaron manos en las imágenes del dataset.");
      if (!KumaCam.guardarLocal(nuevas)) throw new Error("El navegador no pudo guardar el dataset. Libera espacio del navegador e inténtalo de nuevo.");
      m = nuevas;
    }
    CAMD = { muestras: m, conteo: KumaCam.conteos(m) };
  }
  return CAMD;
}

// Las lecciones se arman solas con las letras que tengan suficientes muestras
function camLecciones() {
  const disp = exLetras()
    .filter(x => !CAM_EXCLUIR.includes(x.letra) && (CAMD.conteo[x.letra] || 0) >= CAM_MIN_MUESTRAS)
    .map(x => x.letra);
  const lecs = [];
  for (let i = 0; i < disp.length; i += CAM_GRUPO) lecs.push({ letras: disp.slice(i, i + CAM_GRUPO) });
  if (lecs.length > 1 && lecs[lecs.length - 1].letras.length < 2) {
    const ultima = lecs.pop();
    lecs[lecs.length - 1].letras.push(...ultima.letras);
  }
  lecs.forEach((l, i) => { l.id = i + 1; l.titulo = `Letras ${l.letras[0]}–${l.letras[l.letras.length - 1]}`; });
  if (disp.length >= CAM_GRUPO) lecs.push({ id: lecs.length + 1, titulo: "Reto con cámara", letras: disp, final: true });
  return lecs;
}

/* ---------- 2) MAPA ---------- */

function pantallaCamara() {
  camLimpiar();
  camDatos().then(() => { if (location.hash === "#/camara") vista.innerHTML = camMapa(); }).catch(error => {
    console.error("No se pudo preparar el reconocimiento:", error);
    if (location.hash === "#/camara") vista.innerHTML = `<section class="pantalla alfa"><div class="tarjeta"><h2>No pude preparar el reconocimiento</h2><p>${limpiar(error.message || "Comprueba tu conexión e inténtalo de nuevo.")}</p><button class="boton" onclick="location.reload()">REINTENTAR</button></div></section>`;
  });
  return `<section class="pantalla"><div class="tarjeta">Cargando práctica con cámara…</div></section>`;
}

function camMapa() {
  const p = leerEstado();
  const e = camEstado(p);
  const lecs = camLecciones();

  if (!lecs.length) {
    return `<section class="pantalla alfa">
      <div class="banner">${icono("hand")}<div><h1>Práctica con cámara</h1><p>Imita las señas del alfabeto frente a la cámara</p></div><img class="banner-kuma" src="${kumaImg("pensando")}" alt="" aria-hidden="true"></div>
      <div class="tarjeta"><h2>Aún no hay datos</h2>
        <p>Primero graba ejemplos de las señas para que Kuma pueda reconocerlas. Puedes entrenar desde este dispositivo o importar un archivo de muestras.</p>
        <a class="boton" href="grabar.html">GRABAR SEÑAS</a></div>
      <a class="volver" href="#/lecciones">← Volver a lecciones</a></section>`;
  }

  const siguiente = lecs.find(l => !e.completadas.includes(l.id));
  const nodos = lecs.map((l, i) => {
    const comp = e.completadas.includes(l.id);
    const bloq = l.id > 1 && !e.completadas.includes(l.id - 1);
    const actual = siguiente && siguiente.id === l.id;
    const est = e.estrellas[l.id] || 0;
    const nombres = l.final ? `${Math.min(8, l.letras.length)} letras al azar` : l.letras.join(" · ");
    const cuerpo = `<span class="nodo-num">${bloq ? icono("lock") : l.id}</span>
      <span class="nodo-texto"><strong>${l.titulo}</strong><small>${limpiar(nombres)}</small></span>
      <span class="nodo-estrellas" aria-label="${est} de 3 estrellas">${"★".repeat(est)}${"☆".repeat(3 - est)}</span>`;
    const cls = `nodo ${comp ? "completada" : ""} ${actual ? "actual" : ""} ${bloq ? "bloqueada" : ""}`;
    return bloq
      ? `<div class="${cls}" style="--d:${i}" aria-disabled="true">${cuerpo}</div>`
      : `<a class="${cls}" style="--d:${i}" href="#/camara/${l.id}">${cuerpo}</a>`;
  }).join("");

  return `
  <section class="pantalla alfa">
    <div class="banner">${icono("hand")}<div><h1>Práctica con cámara</h1><p>Haz la seña frente a la cámara y Kuma te dice si está bien</p></div><img class="banner-kuma" src="${kumaImg("feliz")}" alt="" aria-hidden="true"></div>
    <div class="alfa-stats">
      <span class="chip-juego chip-racha">${icono("flame")}Racha: ${rachaActual(p)}</span>
      <span class="chip-juego chip-xp">${icono("star")}${p.xp} XP</span>
      <span class="chip-juego">${icono("book")}${e.completadas.length} / ${lecs.length} lecciones</span>
    </div>
    <div class="alfa-kuma"><img src="${kumaImg("normal")}" alt="" aria-hidden="true"><div class="burbuja-kuma">Tu cámara solo se usa en tu dispositivo: el video no se envía a ningún lado.</div></div>
  <div class="camino">${nodos}</div>
    <a class="volver" href="#/lecciones">← Volver a lecciones</a>
  </section>`;
}

/* ---------- 3) LECCIÓN ---------- */

function pantallaCamLeccion() {
  camLimpiar();
  const par = location.hash.replace("#/", "").split("/")[1];
  vista.innerHTML = `<section class="pantalla"><div class="tarjeta">Cargando…</div></section>`;
  camDatos().then(() => {
    if (!location.hash.startsWith("#/camara/")) return;
    const e = camEstado(leerEstado());
    const L = camLecciones().find(x => String(x.id) === par);
    if (!L) { location.replace("#/camara"); return; }
    if (L.id > 1 && !e.completadas.includes(L.id - 1)) { location.replace("#/camara"); mostrarAviso("Completa la lección anterior para abrir esta"); return; }
    camIniciar(L);
  });
}

function camIniciar(L) {
  camLimpiar();
  const letras = L.final ? barajar(L.letras).slice(0, 8) : barajar(L.letras);
  CS = { L, pasos: [...letras], i: 0, aciertos: 0, fallos: 0, reint: new Set(), fase: "permiso",
         raf: 0, desde: 0, ultOk: 0, t0: 0, aviso: "", predicciones: [], trayectoria: [] };
  camShell();
  camMensaje(mensajeKuma("inicio"), "normal");
  camAviso("Se usará tu cámara para ver tu mano. El video se procesa en tu dispositivo y no se guarda ni se envía.");
  camEl("cam-consigna").textContent = "Imita la seña frente a la cámara";
  camEl("cam-modelo").innerHTML = "";
  camPie(`<footer class="juego-pie"><div class="juego-pie-in"><button class="boton" data-cacc="activar" data-foco>ACTIVAR CÁMARA</button></div></footer>`);
}

function camShell() {
  vista.innerHTML = `
  <section class="pantalla juego cam-juego">
    <header class="juego-top">
      <button class="juego-cerrar" data-cacc="salir" aria-label="Salir de la lección">✕</button>
      <div class="barra" role="progressbar" aria-label="Progreso de la lección" aria-valuemin="0" aria-valuemax="100"><span id="cam-barra" style="width:0%"></span></div>
      <span class="chip-juego" id="cam-chip">0/${CS.pasos.length}</span>
    </header>
    <div class="juego-cuerpo">
      <div class="juego-tarjeta tarjeta cam-tarjeta">
        <p class="juego-consigna" id="cam-consigna"></p>
        <div class="cam-fila">
          <div class="cam-modelo" id="cam-modelo"></div>
          <div class="cam-caja">
            <video id="cam-video" playsinline muted></video>
            <canvas id="cam-canvas"></canvas>
            <div class="cam-estado" id="cam-estado"></div>
          </div>
        </div>
        <div class="cam-retencion" aria-hidden="true"><span id="cam-ret" style="width:0%"></span></div>
        <p class="cam-aviso" id="cam-aviso" aria-live="polite"></p>
      </div>
      <aside class="juego-kuma"><div class="burbuja-kuma" id="cam-msg" aria-live="polite"></div><img id="cam-kuma" src="${kumaImg("normal")}" alt="" aria-hidden="true"></aside>
    </div>
    <div id="cam-pie"></div>
  </section>`;
}

function camPie(html) {
  const p = camEl("cam-pie"); if (!p) return;
  p.innerHTML = html;
  const f = p.querySelector("[data-foco]"); if (f) f.focus({ preventScroll: true });
}
function camAviso(t) {
  const a = camEl("cam-aviso");
  if (a && CS && CS.aviso !== t) { a.textContent = t; CS.aviso = t; }
}
function camMensaje(t, pose) {
  const m = camEl("cam-msg"); if (m) m.textContent = t;
  const k = camEl("cam-kuma"); if (k && pose) k.src = kumaImg(pose);
}

/* Activar cámara y modelo (hace falta un clic del usuario para el permiso) */
async function camActivar() {
  const ses = CS;
  ses.fase = "cargando";
  camAviso("Preparando la cámara y el modelo… la primera vez puede tardar un poco.");
  camPie("");
  const video = camEl("cam-video");
  try {
    await KumaCam.abrirCamara(video);
  } catch (e) {
    console.error("Error de cámara:", e);
    if (CS !== ses) { KumaCam.cerrarCamara(); return; }
    return camError(e);
  }
  if (CS !== ses) { KumaCam.cerrarCamara(); return; }
  camAviso("Cámara lista. Cargando el modelo de reconocimiento…");
  try {
    await KumaCam.cargarModelo();
  } catch (e) {
    console.error("Error del modelo:", e);
    KumaCam.cerrarCamara(video);
    if (CS !== ses) return;
    const er = new Error(e && e.message); er.name = "ModeloError";
    return camError(er);
  }
  if (CS !== ses) { KumaCam.cerrarCamara(); return; }
  const cv = camEl("cam-canvas");
  cv.width = video.videoWidth || 640; cv.height = video.videoHeight || 480;
  camPaso();
}

function camError(e) {
  const n = (e && (e.name || e.message)) || "";
  let t;
  if (n === "NotAllowedError" || n === "SecurityError") t = "No diste permiso para usar la cámara. Actívalo en el navegador e inténtalo de nuevo.";
  else if (n === "NotFoundError" || n === "OverconstrainedError") t = "No encontré ninguna cámara en este dispositivo.";
  else if (n === "sin-camara") t = "Este navegador no permite usar la cámara aquí (la página debe abrirse con HTTPS o localhost).";
  else if (n === "NotReadableError" || n === "AbortError") t = "Brave no pudo iniciar la transmisión de la cámara. Cierra otras pestañas o aplicaciones que puedan estar usándola y vuelve a intentar.";
  else if (n === "ModeloError") t = "La cámara abrió, pero no se pudo descargar el modelo de reconocimiento. Revisa tu conexión o desactiva Brave Shields para esta página.";
  else t = "No se pudo activar la cámara (" + n + "). Inténtalo de nuevo.";
  CS.fase = "permiso";
  camAviso(t);
  camPie(`<footer class="juego-pie mal"><div class="juego-pie-in"><div class="pie-mensaje"><strong>Sin cámara</strong><span>Puedes seguir con las demás lecciones.</span></div>
    <button class="boton" data-cacc="activar">REINTENTAR</button><a class="boton sec" href="#/camara">VOLVER</a></div></footer>`);
}

/* Un paso = una letra */
function camPaso() {
  const letra = CS.pasos[CS.i];
  const obj = exLetras().find(x => x.letra === letra);
  CS.fase = "jugando"; CS.desde = 0; CS.ultOk = 0; CS.t0 = performance.now(); CS.aviso = "";
  camEl("cam-consigna").textContent = CAM_DINAMICAS.has(letra)
    ? "Imita la seña y dibuja su movimiento en el aire"
    : "Imita esta seña frente a la cámara";
  camEl("cam-modelo").innerHTML = `<div class="sena-grande">${exImgLetra(obj, "Seña de la letra " + letra)}</div><div class="sal-nombre">${limpiar(letra)}</div>`;
  camEl("cam-chip").textContent = `${Math.min(CS.i + 1, CS.pasos.length)}/${CS.pasos.length}`;
  camEl("cam-barra").style.width = Math.round(CS.i / CS.pasos.length * 100) + "%";
  camEl("cam-ret").style.width = "0%";
  camAviso(CAM_DINAMICAS.has(letra)
    ? "J, Z y Ñ necesitan movimiento: haz el trazo con la mano visible y completa."
    : "Pon la mano a la vista de la cámara, completa y con buena luz.");
  CS.predicciones = [];
  CS.trayectoria = [];
  camPie(`<footer class="juego-pie"><div class="juego-pie-in"><button class="boton sec" data-cacc="saltar">NO ME SALE</button></div></footer>`);
  cancelAnimationFrame(CS.raf);
  CS.raf = requestAnimationFrame(camBucle);
}

function camBucle() {
  if (!CS || CS.fase !== "jugando") return;
  const video = camEl("cam-video");
  if (!video) return;
  const ahora = performance.now();
  const resta = CAM_TIEMPO_S - (ahora - CS.t0) / 1000;
  const est = camEl("cam-estado"); if (est) est.textContent = Math.max(0, Math.ceil(resta)) + " s";
  if (resta <= 0) return camResolver(false);

  const r = KumaCam.detectar(video);
  if (r !== undefined) camProcesar(r, ahora);
  CS.raf = requestAnimationFrame(camBucle);
}

function camProcesar(r, ahora) {
  const cv = camEl("cam-canvas");
  const ctx = cv.getContext("2d");
  ctx.clearRect(0, 0, cv.width, cv.height);
  if (!r) {
    CS.desde = 0; CS.predicciones = []; CS.trayectoria = [];
    camEl("cam-ret").style.width = "0%";
    camAviso("No veo tu mano. Acércala y que se vea completa."); return;
  }

  const objetivo = CS.pasos[CS.i];
  const f = KumaCam.caracteristicas(r.puntos, r.etiqueta, r.aspecto);
  const pred = KumaCam.clasificar(f, CAMD.muestras, 5);
  const temporal = camSuavizarPrediccion(pred, ahora);
  const requiereMovimiento = CAM_DINAMICAS.has(objetivo);
  const movimiento = camRegistrarMovimiento(r, ahora);
  const seguro = temporal && temporal.estable && temporal.conf >= CAM_UMBRAL_CONF && temporal.dist <= CAM_DIST_MAX;
  const ok = !!seguro && temporal.letra === objetivo && (!requiereMovimiento || movimiento);

  KumaCam.dibujar(ctx, r.puntos, cv.width, cv.height, ok ? "#2ecc71" : "#f6c945");

  if (ok) { CS.ultOk = ahora; if (!CS.desde) CS.desde = ahora; }
  else if (CS.desde && ahora - CS.ultOk > 250) CS.desde = 0;

  const prog = CS.desde ? Math.min(1, (ahora - CS.desde) / CAM_HOLD_MS) : 0;
  camEl("cam-ret").style.width = Math.round(prog * 100) + "%";

  if (prog >= 1) return camResolver(true);
  if (ok) camAviso("¡Así! Mantén la seña…");
  else if (!seguro) camAviso("No estoy segura de la seña todavía. Mantén la mano visible y ajusta los dedos con calma.");
  else if (requiereMovimiento && temporal.letra === objetivo && !movimiento) camAviso(`La forma se parece a «${objetivo}», pero falta hacer su trazo en el aire.`);
  else if (temporal.letra !== objetivo) camAviso(`Veo algo parecido a «${temporal.letra}», pero no estoy segura de que sea «${objetivo}». Revisa la imagen.`);
  else camAviso("Ajusta los dedos como en la imagen.");
}

// Reduce saltos entre fotogramas: pide que la misma letra gane en varias lecturas cercanas.
function camSuavizarPrediccion(pred, ahora) {
  const lista = CS.predicciones;
  lista.push({ letra: pred?.letra || null, conf: pred?.conf || 0, dist: pred?.dist ?? Infinity, t: ahora });
  while (lista.length && ahora - lista[0].t > CAM_VENTANA_TEMPORAL_MS) lista.shift();
  if (lista.length > 9) lista.splice(0, lista.length - 9);

  const validas = lista.filter(p => p && p.conf >= CAM_UMBRAL_CONF && p.dist <= CAM_DIST_MAX);
  if (validas.length < 3) return null;
  const votos = {};
  validas.forEach(p => { votos[p.letra] = (votos[p.letra] || 0) + 1; });
  const letra = Object.keys(votos).sort((a, b) => votos[b] - votos[a])[0];
  const propias = validas.filter(p => p.letra === letra);
  return {
    letra,
    conf: propias.reduce((s, p) => s + p.conf, 0) / propias.length,
    dist: propias.reduce((s, p) => s + p.dist, 0) / propias.length,
    estable: propias.length >= 3 && propias.length / Math.min(lista.length, 5) >= 0.6
  };
}

// Mide trazos recientes en la muñeca y en las puntas de los dedos, compensando el tamaño de la mano.
function camRegistrarMovimiento(r, ahora) {
  const p = r.puntos, aspecto = r.aspecto || 1, muneca = p[0];
  const palma = Math.hypot((p[9].x - muneca.x) * aspecto, p[9].y - muneca.y) || 0.001;
  const puntas = [4, 8, 12, 16, 20].map(i => [
    ((p[i].x - muneca.x) * aspecto) / palma,
    (p[i].y - muneca.y) / palma
  ]);
  CS.trayectoria.push({ t: ahora, m: [muneca.x * aspecto, muneca.y], palma, puntas });
  while (CS.trayectoria.length && ahora - CS.trayectoria[0].t > 1200) CS.trayectoria.shift();
  if (CS.trayectoria.length < 7) return false;

  let mayor = 0;
  for (let dedo = 0; dedo < 5; dedo++) {
    const xs = CS.trayectoria.map(x => x.puntas[dedo][0]);
    const ys = CS.trayectoria.map(x => x.puntas[dedo][1]);
    mayor = Math.max(mayor, Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)));
  }
  const wx = CS.trayectoria.map(x => x.m[0]);
  const wy = CS.trayectoria.map(x => x.m[1]);
  const tamPalma = CS.trayectoria.reduce((s, x) => s + x.palma, 0) / CS.trayectoria.length;
  const trazoMuneca = Math.hypot(Math.max(...wx) - Math.min(...wx), Math.max(...wy) - Math.min(...wy)) / tamPalma;
  return Math.max(mayor, trazoMuneca) >= CAM_MOVIMIENTO_MIN;
}

function camResolver(ok) {
  const letra = CS.pasos[CS.i];
  cancelAnimationFrame(CS.raf);
  CS.fase = ok ? "ok" : "fallo";
  const cv = camEl("cam-canvas"); if (cv) cv.getContext("2d").clearRect(0, 0, cv.width, cv.height);
  if (ok) {
    CS.aciertos++;
    camSonido("acierto");
    camMensaje(mensajeKuma("acierto"), "feliz");
    camAviso("");
    camPie(`<footer class="juego-pie ok" role="status"><div class="juego-pie-in">
      <div class="pie-mensaje"><strong>${azar(["¡Correcto!", "¡Perfecto!", "¡Muy bien!"])}</strong><span>Reconocí tu seña de la <b>${limpiar(letra)}</b></span></div>
      <button class="boton" data-cacc="siguiente" data-foco>CONTINUAR</button></div></footer>`);
  } else {
    CS.fallos++;
    if (!CS.reint.has(letra)) { CS.reint.add(letra); CS.pasos.push(letra); }   // se repite una vez al final
    camSonido("error");
    camMensaje(mensajeKuma("error"), "triste");
    camAviso("");
    camPie(`<footer class="juego-pie mal" role="status"><div class="juego-pie-in">
      <div class="pie-mensaje"><strong>${azar(["Casi…", "¡Ups!", "Aún no"])}</strong><span>Mira bien la seña de la <b>${limpiar(letra)}</b> y la repetimos al final.</span></div>
      <button class="boton" data-cacc="siguiente" data-foco>CONTINUAR</button></div></footer>`);
  }
}

function camSiguiente() {
  CS.i++;
  if (CS.i >= CS.pasos.length) return camTerminar();
  camMensaje(mensajeKuma("animo"), "normal");
  camPaso();
}

/* ---------- 4) FINAL ---------- */

function camTerminar() {
  cancelAnimationFrame(CS.raf);
  KumaCam.cerrarCamara();
  CS.fase = "fin";
  camSonido("fin");

  const total = CS.aciertos + CS.fallos;
  const prec = total ? CS.aciertos / total : 1;
  const est = prec >= 0.9 ? 3 : prec >= 0.7 ? 2 : 1;
  const xp = 10 + CS.aciertos * 3 + (est === 3 ? 10 : 0);

  const p = leerEstado();
  const e = camEstado(p);
  const eraNueva = !e.completadas.includes(CS.L.id);
  if (eraNueva) e.completadas.push(CS.L.id);
  e.estrellas[CS.L.id] = Math.max(e.estrellas[CS.L.id] || 0, est);
  p.xp += xp;
  sumarRacha(p);
  guardarEstado(p);

  const sig = camLecciones().find(l => l.id === CS.L.id + 1);
  vista.innerHTML = `
  <section class="pantalla juego">
    <div class="tarjeta resultado">
      <img src="${kumaImg("celebra")}" alt="" aria-hidden="true">
      <h1>${CS.L.final ? "¡Reto con cámara completado!" : "¡Lección " + CS.L.id + " completada!"}</h1>
      <div class="estrellas-res" aria-label="${est} de 3 estrellas">${[1, 2, 3].map(n => `<span class="${n <= est ? "on" : ""}">★</span>`).join("")}</div>
      <div class="burbuja-kuma">${limpiar(mensajeKuma("fin"))}</div>
      <div class="res-stats">
        <div><strong>+${xp}</strong><small>XP</small></div>
        <div><strong>${Math.round(prec * 100)}%</strong><small>Precisión</small></div>
        <div><strong>${rachaActual(p)}</strong><small>Racha</small></div>
      </div>
      <div class="res-botones">
        ${sig && eraNueva ? `<a class="boton grande" href="#/camara/${sig.id}">SIGUIENTE</a>` : ""}
        <button class="boton sec" data-cacc="reiniciar">REPETIR</button>
        <a class="boton sec" href="#/camara">AL MAPA</a>
      </div>
    </div>
  </section>`;
}

/* ---------- 5) LIMPIEZA, EVENTOS Y RUTAS ---------- */

function camLimpiar() {
  if (CS) cancelAnimationFrame(CS.raf);
  KumaCam.cerrarCamara();
  CS = null;
}

vista.addEventListener("click", e => {
  if (!CS || !location.hash.startsWith("#/camara/")) return;
  const el = e.target.closest("[data-cacc]");
  if (!el) return;
  const acc = el.dataset.cacc;
  if (acc === "activar") camActivar();
  else if (acc === "saltar") { if (CS.fase === "jugando") camResolver(false); }
  else if (acc === "siguiente") camSiguiente();
  else if (acc === "reiniciar") camIniciar(CS.L);
  else if (acc === "salir") location.hash = "#/camara";
});

// Al salir de una lección (o de la sección) se apaga la cámara
window.addEventListener("hashchange", () => {
  if (!location.hash.startsWith("#/camara/")) camLimpiar();
  document.body.classList.toggle("en-leccion", /^#\/(leccion|saludo|palabra|camara)\//.test(location.hash));
});
document.body.classList.toggle("en-leccion", /^#\/(leccion|saludo|palabra|camara)\//.test(location.hash));
window.addEventListener("pagehide", () => KumaCam.cerrarCamara());

rutas.camara = function () {
  const par = location.hash.replace("#/", "").split("/")[1];
  return par ? pantallaCamLeccion() : pantallaCamara();
};
