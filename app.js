/* =========================================================
   Kuma - Sprint 1
   1) Dibujos (Kuma e íconos)
   2) Pantallas (inicio, lecciones, perfil)
   3) Router: cambia de pantalla según el hash (#/inicio ...)
   ========================================================= */

const RUTA_IMAGEN_KUMA = "assets/assets/kumasilueta.png";

// Mensajes de interfaz: el saludo se elige una vez por carga, no en cada render.
const MENSAJES = {
  bienvenida: [
    "Menos scroll, más señas: ¡bienvenido!",
    "Kuma cree en ti.",
    "Una seña nueva y sube en tu nivel de aprendizaje",
    "Modo UIS: curiosidad activada.",
    "Tu cerebro hoy: edición coleccionista.",
    "Una pausa del scroll para aprender algo que sí suma.",
    "Cada seña conecta mundos.",
  ],
  reaccion: "¡Bien! Un pasito más en tu aventura LSC."
};
const MENSAJE_BIENVENIDA = MENSAJES.bienvenida[Math.floor(Math.random() * MENSAJES.bienvenida.length)];

// Datos de prueba del perfil (no son reales, luego vendrán de la app)
const PERFIL_DEMO = {
  nombre: "Explorador de prueba",
  nivel: 3, xp: 60, xpMeta: 100,
  racha: 4, estrellas: 12, leccionesHechas: 1,
  medallas: [
    { nombre: "Primer paso", ganada: true },
    { nombre: "Racha de 3 días", ganada: true },
    { nombre: "Primera lección", ganada: false },
    { nombre: "10 estrellas", ganada: true },
    { nombre: "Explorador", ganada: false },
    { nombre: "Maestro Kuma", ganada: false }
  ]
};

const vista = document.getElementById("vista");
let leccionesCache = null; // guarda las lecciones para no pedirlas dos veces

/* ---------- 1) DIBUJOS ---------- */

// Ícono SVG tomado de la biblioteca del index.html
function icono(nombre) {
  return `<svg class="ico" aria-hidden="true"><use href="#i-${nombre}"/></svg>`;
}

// Evita que texto raro del JSON se interprete como HTML
function limpiar(texto) {
  const d = document.createElement("div");
  d.textContent = texto;
  return d.innerHTML;
}

// Kuma chibi dibujado con SVG (el brazo tiene la clase "brazo" para animarlo)
function kumaSVG() {
  if (RUTA_IMAGEN_KUMA) return `<img src="${RUTA_IMAGEN_KUMA}" alt="Kuma, el oso de anteojos" decoding="async">`;
  return `
  <svg viewBox="0 0 200 230" role="img" aria-label="Kuma, el oso de anteojos, saludando">
    <ellipse cx="100" cy="222" rx="55" ry="7" fill="#146b4a" opacity=".18"/>
    <ellipse cx="100" cy="170" rx="46" ry="48" fill="#7a553c"/>
    <ellipse cx="100" cy="178" rx="28" ry="32" fill="#e9cfa4"/>
    <ellipse cx="78" cy="214" rx="17" ry="9" fill="#6b4a33"/>
    <ellipse cx="122" cy="214" rx="17" ry="9" fill="#6b4a33"/>
    <path d="M62 138 Q100 168 138 138 L134 156 Q100 182 66 156Z" fill="#1f9d6b"/>
    <path d="M92 154 L108 154 L112 184 L100 176 L88 184Z" fill="#4ccb8d"/>
    <ellipse cx="52" cy="160" rx="13" ry="22" fill="#7a553c" transform="rotate(14 52 160)"/>
    <g class="brazo"><ellipse cx="152" cy="108" rx="13" ry="25" fill="#7a553c" transform="rotate(-12 152 108)"/><circle cx="156" cy="84" r="13" fill="#6b4a33"/></g>
    <circle cx="48" cy="48" r="22" fill="#7a553c"/><circle cx="48" cy="48" r="11" fill="#e9cfa4"/>
    <circle cx="152" cy="48" r="22" fill="#7a553c"/><circle cx="152" cy="48" r="11" fill="#e9cfa4"/>
    <circle cx="100" cy="92" r="62" fill="#8a6246"/>
    <path d="M60 78 Q100 60 140 78" stroke="#e9cfa4" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="76" cy="92" r="23" fill="#fff3d1" stroke="#6b4a33" stroke-width="4"/>
    <circle cx="124" cy="92" r="23" fill="#fff3d1" stroke="#6b4a33" stroke-width="4"/>
    <ellipse cx="76" cy="94" rx="11" ry="13" fill="#2b1d14"/><ellipse cx="124" cy="94" rx="11" ry="13" fill="#2b1d14"/>
    <circle cx="72" cy="88" r="4.5" fill="#fff"/><circle cx="120" cy="88" r="4.5" fill="#fff"/>
    <circle cx="80" cy="99" r="2.2" fill="#fff"/><circle cx="128" cy="99" r="2.2" fill="#fff"/>
    <ellipse cx="100" cy="116" rx="22" ry="16" fill="#e9cfa4"/>
    <ellipse cx="100" cy="109" rx="8" ry="5.500" fill="#3a2618"/>
    <path d="M90 119 Q100 129 110 119" stroke="#3a2618" stroke-width="3.500" fill="none" stroke-linecap="round"/>
    <ellipse cx="52" cy="112" rx="9" ry="6" fill="#ff9aa8" opacity=".6"/><ellipse cx="148" cy="112" rx="9" ry="6" fill="#ff9aa8" opacity=".6"/>
  </svg>`;
}

/* ---------- 2) PANTALLAS ---------- */

function pantallaInicio() {
  return `
  <section class="pantalla inicio">
    <div class="hero-bosque">
      <div class="hero-copy">
        <p class="sobrelinea"><span class="punto-vivo"></span> Campus UIS · misión LSC</p>
        <h1 class="logo">¡Ey!<br><span>Soy Kuma</span></h1>
        <p class="hero-texto">Aprende Lengua de Señas Colombiana a tu ritmo. Cada seña desbloquea una nueva forma de conectar.</p>
        <a class="boton grande" href="#/lecciones">${icono("play")} ¡APRENDER CON KUMA!</a>
        <p class="hero-nota">Aprendemos mejor cuando nos entendemos.</p>
      </div>
      <div class="hero-visual">
        <span class="montana montana-lejana" aria-hidden="true"></span><span class="montana montana-cercana" aria-hidden="true"></span>
        <span class="campus-edificio" aria-hidden="true"><i></i><i></i><i></i><b></b></span>
        <span class="nube-hero nube-hero-a" aria-hidden="true"></span><span class="nube-hero nube-hero-b" aria-hidden="true"></span>
        <span class="decor flor flor-hero-a" aria-hidden="true"></span><span class="decor flor flor-hero-b" aria-hidden="true"></span>
        <span class="decor flor flor-hero-c" aria-hidden="true"></span><span class="decor flor flor-hero-d" aria-hidden="true"></span>
        <span class="decor hoja hoja-hero-a" aria-hidden="true"></span><span class="decor hoja hoja-hero-b" aria-hidden="true"></span>
        <span class="decor hoja hoja-hero-c" aria-hidden="true"></span><span class="decor hoja hoja-hero-d" aria-hidden="true"></span>
        <span class="destello destello-a" aria-hidden="true">✦</span><span class="destello destello-b" aria-hidden="true">✧</span>
        <div class="burbuja" aria-live="polite">${MENSAJE_BIENVENIDA}</div>
        <div class="kuma">${kumaSVG()}</div>
        <span class="hongo-hero" aria-hidden="true"></span>
        <span class="arbusto arbusto-a" aria-hidden="true"></span><span class="arbusto arbusto-b" aria-hidden="true"></span>
      </div>
    </div>

    <section class="accesos" aria-labelledby="accesos-titulo">
      <div class="encabezado-seccion"><div><p class="sobrelinea">Tu aventura empieza aquí</p><h2 id="accesos-titulo">¿Qué exploramos hoy?</h2></div><span class="ramita" aria-hidden="true">❧</span></div>
      <div class="accesos-grid">
        <a class="acceso-card acceso-alfabeto" href="#/lecciones"><span class="acceso-ilustra">${icono("abc")}<i class="mini-flor" aria-hidden="true"></i></span><span><strong>El alfabeto</strong><small>Descubre las letras con tus manos</small></span><span class="flecha-acceso" aria-hidden="true">↗</span></a>
        <a class="acceso-card acceso-saludos" href="#/lecciones"><span class="acceso-ilustra">${icono("chat")}<i class="mini-hoja" aria-hidden="true"></i></span><span><strong>Saludos</strong><small>¡Di hola de una nueva manera!</small></span><span class="flecha-acceso" aria-hidden="true">↗</span></a>
        <a class="acceso-card acceso-vocabulario" href="#/lecciones"><span class="acceso-ilustra">${icono("hand")}<i class="mini-estrella" aria-hidden="true">✦</i></span><span><strong>Palabras básicas</strong><small>Pequeñas señas, grandes conexiones</small></span><span class="flecha-acceso" aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section class="inicio-inferior">
      <div class="panel-progreso tarjeta">
        <div class="panel-titulo"><span class="icono-panel">${icono("star")}</span><div><p class="sobrelinea">Tu caminito</p><h2>Progreso de exploración</h2></div></div>
        <p class="nota-demo">Datos de prueba de esta versión</p>
        <div class="progreso-resumen"><strong>Nivel ${PERFIL_DEMO.nivel}</strong><span>${PERFIL_DEMO.xp} de ${PERFIL_DEMO.xpMeta} XP</span></div>
        <div class="barra" role="progressbar" aria-label="Experiencia de prueba" aria-valuenow="${PERFIL_DEMO.xp}" aria-valuemin="0" aria-valuemax="${PERFIL_DEMO.xpMeta}"><span style="width:${(PERFIL_DEMO.xp / PERFIL_DEMO.xpMeta) * 100}%"></span></div>
        <div class="fichas"><div class="ficha"><span class="burbuja-ico b-amarillo">${icono("flame")}</span>Racha: ${PERFIL_DEMO.racha}</div><div class="ficha"><span class="burbuja-ico b-verde">${icono("star")}</span>${PERFIL_DEMO.estrellas} estrellas</div></div>
      </div>
      <aside class="bienvenida tarjeta">
        <span class="bienvenida-flor flor" aria-hidden="true"></span><p class="sobrelinea">Un jardín donde cabemos todos</p><h2>Aprender también es incluir</h2>
        <p>Kuma te acompaña a conocer la LSC y a celebrar distintas maneras de comunicarnos. ¡Gracias por crecer este mundo con nosotros!</p>
        <a href="#/lecciones" class="enlace-hoja">Conoce las lecciones <span aria-hidden="true">→</span></a>
      </aside>
    </section>
  </section>`;
}

// Tarjeta de una lección (los datos vienen del JSON)
function tarjetaLeccion(l, indice) {
    if (l.id === 1) l = { ...l, progreso: leerEstado().completadas.length, totalActividades: 10 };
  const bloqueada = l.estado === "bloqueada";
  const porcentaje = Math.round((l.progreso / l.totalActividades) * 100);
  const boton = bloqueada
    ? `<button class="boton gris" data-aviso="Esta lección se desbloquea más adelante">${icono("lock")} Bloqueada</button>`
    : l.id === 1
      ? `<a class="boton" href="#/alfabeto">${icono("play")} JUGAR</a>`
      : `<button class="boton" data-aviso="Las actividades llegan en el Sprint 2">${icono("play")} JUGAR</button>`;
  return `
  <article class="tarjeta leccion tono-${indice % 4} ${bloqueada ? "bloqueada" : ""}" style="animation-delay:${indice * 0.08}s">
    <span class="esquina-hojas" aria-hidden="true"></span>
    <div class="cabeza">
      <div class="medallon">${icono(l.icono)}</div>
      <div><h2>${limpiar(l.titulo)}</h2>${l.esDemo ? '<span class="etiqueta-demo">DATO DE PRUEBA</span>' : ""}</div>
    </div>
    <p>${limpiar(l.descripcion)}</p>
    <div class="barra" role="progressbar" aria-valuenow="${porcentaje}" aria-valuemin="0" aria-valuemax="100"><span style="width:${porcentaje}%"></span></div>
<div class="pie"><span>${l.progreso} / ${l.totalActividades} ${l.id === 1 ? "lecciones" : "actividades"}</span>${boton}</div>
  </article>`;
}

async function pantallaLecciones() {
  const cabecera = `
    <div class="banner">${icono("book")}<div><h1>Lecciones</h1><p>Elige una aventura con Kuma · XP de conocimiento en camino</p></div><img class="banner-kuma" src="${RUTA_IMAGEN_KUMA}" alt="" aria-hidden="true"></div>`;
  vista.innerHTML = `<section class="pantalla">${cabecera}<p class="cargando">Cargando lecciones...</p></section>`;

  try {
    if (!leccionesCache) {
      const respuesta = await fetch("data/lecciones.json");
      if (!respuesta.ok) throw new Error("No se pudo leer el archivo");
      leccionesCache = await respuesta.json();
    }
    // Si el usuario cambió de pantalla mientras cargaba, no dibujamos nada
    if (ruta() !== "lecciones") return;
    const tarjetas = leccionesCache.lecciones.map(tarjetaLeccion).join("");
    vista.innerHTML = `<section class="pantalla">${cabecera}<div class="lista">${tarjetas}</div></section>`;
  } catch (e) {
    console.error(e);
    vista.innerHTML = `<section class="pantalla">${cabecera}
      <div class="tarjeta error">No pude cargar las lecciones. Abre el proyecto con Live Server (no con doble clic en el archivo).</div></section>`;
  }
}

function pantallaPerfil() {
  const p = PERFIL_DEMO;
  const medallas = p.medallas.map(m =>
    `<div class="tarjeta medalla ${m.ganada ? "" : "apagada"}">${icono("medal")}${limpiar(m.nombre)}</div>`).join("");
  return `
  <section class="pantalla">
    <div class="banner perfil-banner">${icono("user")}<div><h1>Mi rincón</h1><p>Todo lo que has explorado con Kuma</p></div><span class="banner-destello" aria-hidden="true">✦</span></div>
    <div class="perfil-cab">
      <div class="avatar-wrap"><span class="decor flor perfil-flor" aria-hidden="true"></span><span class="decor hoja perfil-hoja" aria-hidden="true"></span><div class="avatar">${kumaSVG()}</div></div>
      <h1>${limpiar(p.nombre)}</h1>
      <p class="nota-demo">Perfil y estadísticas de demostración</p>
      <div class="nivel">
        <small><span>Nivel ${p.nivel}</span><span>${p.xp} / ${p.xpMeta} XP</span></small>
        <div class="barra"><span style="width:${(p.xp / p.xpMeta) * 100}%"></span></div>
      </div>
    </div>
    <div class="estadisticas">
      <div class="tarjeta c1">${icono("flame")}<strong>${p.racha}</strong><small>Racha</small></div>
      <div class="tarjeta c2">${icono("star")}<strong>${p.estrellas}</strong><small>Estrellas</small></div>
      <div class="tarjeta c3">${icono("book")}<strong>${p.leccionesHechas}</strong><small>Lecciones</small></div>
    </div>
    <div class="encabezado-seccion encabezado-medallas"><div><p class="sobrelinea">Pequeños grandes logros</p><h2 class="titulo-seccion">Mis medallas</h2></div><span class="ramita" aria-hidden="true">❧</span></div>
    <div class="medallas">${medallas}</div>
  </section>`;
}

/* ---------- 3) ROUTER ---------- */

const rutas = { inicio: pantallaInicio, lecciones: pantallaLecciones, perfil: pantallaPerfil };

// Lee la ruta del hash: "#/lecciones" -> "lecciones"
function ruta() {
  const nombre = location.hash.replace("#/", "").split("/")[0];
  return rutas[nombre] ? nombre : "inicio";
}

function navegar() {
  const nombre = ruta();
  if (!location.hash) history.replaceState(null, "", "#/inicio");
  // Marca el botón activo del menú
  document.querySelectorAll(".menu a").forEach(a => {
        const activa = a.dataset.ruta === nombre || (a.dataset.ruta === "lecciones" && ["alfabeto", "leccion"].includes(nombre));
    a.classList.toggle("activo", activa);
    if (activa) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  const resultado = rutas[nombre]();
  if (typeof resultado === "string") vista.innerHTML = resultado; // lecciones se dibuja sola
  window.scrollTo({ top: 0 });
}

// Aviso emergente
let temporizador;
function mostrarAviso(texto) {
  const aviso = document.getElementById("aviso");
  aviso.querySelector(".aviso-mensaje").textContent = texto;
  aviso.querySelector(".aviso-reaccion").textContent = MENSAJES.reaccion;
  aviso.classList.add("visible");
  aviso.classList.remove("reaccion");
  void aviso.offsetWidth;
  aviso.classList.add("reaccion");
  clearTimeout(temporizador);
  temporizador = setTimeout(() => aviso.classList.remove("visible"), 2200);
}

// Un solo "oyente" para todos los botones con data-aviso
document.addEventListener("click", e => {
  const boton = e.target.closest("[data-aviso]");
  if (boton) mostrarAviso(boton.dataset.aviso);
});

window.addEventListener("hashchange", navegar);
window.addEventListener("DOMContentLoaded", navegar);