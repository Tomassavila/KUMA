/* Cuentas locales para el prototipo Kuma. El avance se separa por usuario en este navegador. */
(() => {
  "use strict";

  const CUENTAS = "kuma_usuarios_v1";
  const SESION = "kuma_sesion_v1";
  const LEGACY_PROGRESS = "kuma_alfabeto_v1";
  const ITERACIONES = 210000;
  const enc = new TextEncoder();

  function leerCuentas() {
    try {
      const lista = JSON.parse(localStorage.getItem(CUENTAS) || "[]");
      return Array.isArray(lista) ? lista : [];
    } catch (_) { return []; }
  }

  function usuarioActual() {
    const id = localStorage.getItem(SESION);
    return id ? leerCuentas().find(u => u.id === id) || null : null;
  }

  function clave(base) {
    const u = usuarioActual();
    return u ? `${base}::${u.id}` : base;
  }

  function aBase64(bytes) {
    let bin = "";
    new Uint8Array(bytes).forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin);
  }

  async function derivar(password, salt) {
    const material = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({
      name: "PBKDF2", salt: Uint8Array.from(atob(salt), c => c.charCodeAt(0)),
      iterations: ITERACIONES, hash: "SHA-256"
    }, material, 256);
    return aBase64(bits);
  }

  function migrarAvanceInicial(id) {
    const original = localStorage.getItem(LEGACY_PROGRESS);
    const destino = `${LEGACY_PROGRESS}::${id}`;
    if (original && !localStorage.getItem(destino)) localStorage.setItem(destino, original);
  }

  function escapar(texto) {
    const d = document.createElement("span");
    d.textContent = texto;
    return d.innerHTML;
  }

  function mostrarPantalla(modo = "entrar", mensaje = "") {
    document.body.classList.add("auth-mode");
    let root = document.getElementById("auth-screen");
    if (!root) {
      root = document.createElement("section");
      root.id = "auth-screen";
      root.className = "auth-shell";
      root.setAttribute("aria-labelledby", "auth-title");
      document.body.prepend(root);
    }
    const crear = modo === "crear";
    root.innerHTML = `
      <div class="auth-card">
        <img class="auth-mascota" src="assets/assets/logokuma.png" alt="Kuma">
        <p class="auth-kicker">Kuma · Lengua de Señas Colombiana</p>
        <h1 id="auth-title">${crear ? "Crea tu cuenta" : "Inicia sesión"}</h1>
        <p class="auth-desc">${crear ? "Guarda tu racha, puntos y lecciones en tu perfil." : "Continúa aprendiendo donde lo dejaste."}</p>
        <form id="auth-form" novalidate>
          <label for="auth-user">Usuario</label>
          <input id="auth-user" name="username" autocomplete="username" minlength="3" maxlength="20" required placeholder="Tu nombre de usuario">
          <label for="auth-pass">Contraseña</label>
          <input id="auth-pass" name="password" type="password" autocomplete="${crear ? "new-password" : "current-password"}" minlength="8" required placeholder="${crear ? "Mínimo 8 caracteres" : "Tu contraseña"}">
          ${crear ? `<label for="auth-pass2">Confirma la contraseña</label><input id="auth-pass2" name="password2" type="password" autocomplete="new-password" minlength="8" required placeholder="Escríbela otra vez">` : ""}
          <p class="auth-error" id="auth-error" role="alert">${escapar(mensaje)}</p>
          <button class="auth-submit" type="submit">${crear ? "Crear usuario" : "Entrar a Kuma"}</button>
        </form>
        <p class="auth-switch">${crear ? "¿Ya tienes cuenta?" : "¿Primera vez en Kuma?"}
          <button type="button" data-auth-mode="${crear ? "entrar" : "crear"}">${crear ? "Inicia sesión" : "Crea una cuenta"}</button>
        </p>
        <small class="auth-local">Las cuentas actuales solo se guardan en este navegador; todavía no se comparten entre dispositivos o navegadores.</small>
      </div>`;
  }

  function ponerMensaje(texto) {
    const e = document.getElementById("auth-error");
    if (e) e.textContent = texto;
  }

  async function enviar(form) {
    const datos = new FormData(form);
    const username = String(datos.get("username") || "").trim();
    const norm = username.toLocaleLowerCase("es");
    const password = String(datos.get("password") || "");
    const creando = document.getElementById("auth-pass2") !== null;
    const lista = leerCuentas();
    const btn = form.querySelector("button[type=submit]");

    if (!/^[\p{L}\p{N}_-]{3,20}$/u.test(username)) {
      ponerMensaje("Usa de 3 a 20 letras, números, guion o guion bajo."); return;
    }
    if (password.length < 8) { ponerMensaje("La contraseña debe tener al menos 8 caracteres."); return; }
    if (creando && password !== String(datos.get("password2") || "")) {
      ponerMensaje("Las contraseñas no coinciden."); return;
    }

    btn.disabled = true;
    ponerMensaje(creando ? "Creando tu cuenta…" : "Comprobando…");
    try {
      if (creando) {
        if (lista.some(u => u.norm === norm)) { ponerMensaje("Ese usuario ya existe. Prueba con otro."); return; }
        const salt = aBase64(crypto.getRandomValues(new Uint8Array(16)));
        const user = { id: crypto.randomUUID(), username, norm, salt, hash: await derivar(password, salt) };
        lista.push(user);
        localStorage.setItem(CUENTAS, JSON.stringify(lista));
        if (lista.length === 1) migrarAvanceInicial(user.id);
        localStorage.setItem(SESION, user.id);
      } else {
        const user = lista.find(u => u.norm === norm);
        if (!user) {
          ponerMensaje("No encuentro esa cuenta en este navegador. Las cuentas actuales no se comparten entre dispositivos ni navegadores."); return;
        }
        if (await derivar(password, user.salt) !== user.hash) {
          ponerMensaje("Usuario o contraseña incorrectos."); return;
        }
        localStorage.setItem(SESION, user.id);
      }
      location.hash = "#/inicio";
      location.reload();
    } catch (e) {
      console.error("No se pudo guardar la cuenta local:", e);
      ponerMensaje("No pude guardar la cuenta en este navegador. Revisa su espacio disponible.");
    } finally {
      if (btn.isConnected) btn.disabled = false;
    }
  }

  function dibujarBarraCuenta() {
    const root = document.getElementById("account-bar");
    const user = usuarioActual();
    if (!root || !user) return;
    root.innerHTML = `<span class="account-name">${escapar(user.username)}</span><button type="button" id="btn-salir">Cerrar sesión</button>`;
    document.getElementById("btn-salir").addEventListener("click", () => {
      localStorage.removeItem(SESION);
      location.hash = "#/inicio";
      location.reload();
    });
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-auth-mode]");
    if (b) mostrarPantalla(b.dataset.authMode);
  });
  document.addEventListener("submit", e => {
    if (e.target.id !== "auth-form") return;
    e.preventDefault();
    enviar(e.target);
  });

  window.KumaAuth = { key: clave, current: usuarioActual };
  const user = usuarioActual();
  if (!user) mostrarPantalla("entrar");
  else dibujarBarraCuenta();
})();
