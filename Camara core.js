/* =========================================================
   Kuma - Reconocimiento de manos (núcleo)
   No depende del resto de la app: lo usan grabar.html y camara.js.
   - MediaPipe Hand Landmarker: 21 puntos de la mano, en el navegador.
   - k-NN: compara con las señas que grabaste (datos/senas.json).
   El video NUNCA sale del dispositivo.
   ========================================================= */

const KumaCam = (() => {
  // Versión fija de MediaPipe. Para que funcione sin conexión, copia estos 3 recursos a tu
  // sitio (por ejemplo a /mediapipe/) y cambia las rutas de abajo (ver instrucciones).
  const V = "0.10.14";
  const RUTAS = {
    modulo: `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${V}/vision_bundle.mjs`,
    wasm:   `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${V}/wasm`,
    modelo: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
  };
  const LS_CLAVE = "kuma_muestras_v1";

  const CONEXIONES = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],
    [9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];

  let landmarker = null, promesa = null, landmarkerImagen = null, promesaImagen = null;
  let ultimoT = -1, streamActual = null, videoActual = null;

  /* ----- Modelo ----- */
  function cargarModelo() {
    if (promesa) return promesa;
    promesa = (async () => {
      const mod = await import(RUTAS.modulo);
      const fileset = await mod.FilesetResolver.forVisionTasks(RUTAS.wasm);
      const crear = delegate => mod.HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: RUTAS.modelo, delegate },
        runningMode: "VIDEO", numHands: 1,
        minHandDetectionConfidence: 0.5, minHandPresenceConfidence: 0.5, minTrackingConfidence: 0.5
      });
      try { landmarker = await crear("GPU"); } catch (e) { landmarker = await crear("CPU"); }
      return landmarker;
    })().catch(e => { promesa = null; throw e; });
    return promesa;
  }

  /* Modelo separado para procesar fotos estáticas del dataset. */
  function cargarModeloImagen() {
    if (promesaImagen) return promesaImagen;
    promesaImagen = (async () => {
      const mod = await import(RUTAS.modulo);
      const fileset = await mod.FilesetResolver.forVisionTasks(RUTAS.wasm);
      const crear = delegate => mod.HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: RUTAS.modelo, delegate },
        runningMode: "IMAGE", numHands: 1,
        minHandDetectionConfidence: 0.5, minHandPresenceConfidence: 0.5, minTrackingConfidence: 0.5
      });
      try { landmarkerImagen = await crear("GPU"); } catch (e) { landmarkerImagen = await crear("CPU"); }
      return landmarkerImagen;
    })().catch(e => { promesaImagen = null; throw e; });
    return promesaImagen;
  }

  /* ----- Cámara ----- */
  async function abrirCamara(video) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const error = new Error("La cámara requiere HTTPS o localhost.");
      error.name = "sin-camara";
      throw error;
    }
    cerrarCamara(video);
    let etapa = "acceso al dispositivo";
    try {
      try {
        streamActual = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "user" }, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false
        });
      } catch (e) {
        if (e.name !== "OverconstrainedError" && e.name !== "ConstraintNotSatisfiedError") throw e;
        streamActual = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      videoActual = video;
      video.srcObject = streamActual;
      video.muted = true; video.playsInline = true; video.autoplay = true;
      etapa = "inicio del video";
      await video.play();
      ultimoT = -1;
      return streamActual;
    } catch (e) {
      cerrarCamara(video);
      const error = new Error(e && e.message ? e.message : "No se pudo iniciar la cámara.");
      error.name = e && e.name ? e.name : "Error";
      error.etapa = etapa;
      throw error;
    }
  }
  function cerrarCamara(video) {
    if (streamActual) { streamActual.getTracks().forEach(t => t.stop()); streamActual = null; }
    const elemento = video || videoActual;
    if (elemento) elemento.srcObject = null;
    videoActual = null;
    ultimoT = -1;
  }

  /* ----- Detección -----
     undefined = no hay fotograma nuevo · null = no hay mano · objeto = mano detectada */
  function detectar(video) {
    if (!landmarker || video.readyState < 2) return undefined;
    if (video.currentTime === ultimoT) return undefined;
    ultimoT = video.currentTime;
    const r = landmarker.detectForVideo(video, performance.now());
    if (!r.landmarks || !r.landmarks.length) return null;
    const lista = r.handedness || r.handednesses;
    const h = lista && lista[0] && lista[0][0];
    return { puntos: r.landmarks[0], etiqueta: h ? h.categoryName : "Right", aspecto: video.videoWidth / video.videoHeight };
  }

  function detectarImagen(imagen) {
    if (!landmarkerImagen) throw new Error("Primero carga el modelo para imágenes.");
    const r = landmarkerImagen.detect(imagen);
    if (!r.landmarks || !r.landmarks.length) return null;
    const lista = r.handedness || r.handednesses;
    const h = lista && lista[0] && lista[0][0];
    const ancho = imagen.width || imagen.naturalWidth;
    const alto = imagen.height || imagen.naturalHeight;
    return { puntos: r.landmarks[0], etiqueta: h ? h.categoryName : "Right", aspecto: ancho / alto };
  }

  /* ----- Características -----
     63 números: los 21 puntos centrados en la muñeca y escalados al tamaño de la mano.
     Si es mano izquierda se refleja, así una sola grabación sirve para ambas manos. */
  function caracteristicas(p, etiqueta, aspecto) {
    const asp = aspecto || 1;
    const espejo = etiqueta === "Left";
    const o = p[0];
    const v = p.map(q => [(espejo ? -1 : 1) * (q.x - o.x) * asp, q.y - o.y, (q.z - o.z) * asp]);
    let esc = 0;
    v.forEach(a => { esc = Math.max(esc, Math.hypot(a[0], a[1], a[2])); });
    esc = esc || 1;
    const f = [];
    v.forEach(a => a.forEach(n => f.push(Math.round((n / esc) * 1000) / 1000)));
    return f;
  }

  /* ----- Clasificador k-NN -----
     Devuelve { letra, conf (0-1: proporción de vecinos que coinciden), dist (distancia media) } */
  function distancia(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; }
    return Math.sqrt(s);
  }
  function clasificar(f, muestras, k) {
    if (!muestras || !muestras.length) return null;
    k = k || 5;
    const d = muestras.map(m => ({ l: m.l, d: distancia(f, m.f) })).sort((a, b) => a.d - b.d).slice(0, k);
    const votos = {};
    d.forEach(v => { votos[v.l] = (votos[v.l] || 0) + 1; });
    const letra = Object.keys(votos).sort((a, b) => votos[b] - votos[a])[0];
    const propios = d.filter(v => v.l === letra);
    return { letra, conf: votos[letra] / d.length, dist: propios.reduce((s, v) => s + v.d, 0) / propios.length };
  }

  /* ----- Dibujo del esqueleto de la mano ----- */
  function dibujar(ctx, p, w, h, color) {
    ctx.lineWidth = Math.max(2, w / 160);
    ctx.strokeStyle = color || "#2ecc71";
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    CONEXIONES.forEach(([a, b]) => { ctx.moveTo(p[a].x * w, p[a].y * h); ctx.lineTo(p[b].x * w, p[b].y * h); });
    ctx.stroke();
    p.forEach(q => { ctx.beginPath(); ctx.arc(q.x * w, q.y * h, Math.max(2.5, w / 200), 0, Math.PI * 2); ctx.fill(); });
  }

  /* ----- Datos (muestras) ----- */
  function leerLocal() {
    try { const j = JSON.parse(localStorage.getItem(LS_CLAVE) || "null"); return (j && j.muestras) || []; } catch (e) { return []; }
  }
  function guardarLocal(muestras) {
    try { localStorage.setItem(LS_CLAVE, JSON.stringify({ version: 1, muestras })); return true; }
    catch (e) { return false; }
  }
  // Combina el dataset del proyecto con las muestras importadas o grabadas en este navegador.
  async function cargarDatos(url) {
    let archivo = [];
    try {
      const r = await fetch(url, { cache: "no-cache" });
      if (r.ok) { const j = await r.json(); if (j && Array.isArray(j.muestras)) archivo = j.muestras; }
    } catch (e) { /* sin archivo */ }
    return archivo.concat(leerLocal());
  }
  function conteos(muestras) {
    const c = {};
    muestras.forEach(m => { c[m.l] = (c[m.l] || 0) + 1; });
    return c;
  }

  return { RUTAS, cargarModelo, cargarModeloImagen, abrirCamara, cerrarCamara, detectar, detectarImagen, caracteristicas, clasificar,
           dibujar, leerLocal, guardarLocal, cargarDatos, conteos };
})();
