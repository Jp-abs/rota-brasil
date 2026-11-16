/* ==========================================================
   Rota Brasil – Scripts
   1. Acessibilidade (tema, contraste, fonte, animações)
   2. Abas de pesquisa + filtro de cartões
   3. Carrossel
   4. Validação do formulário de contato
   5. Login (simulado)
   ========================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Armazenamento seguro (pode falhar em modo privado) */
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function drop(k) { try { localStorage.removeItem(k); } catch (e) {} }

  /* ---------- 1. ACESSIBILIDADE ---------- */
  var FONT_MIN = 80, FONT_MAX = 150, FONT_STEP = 10;
  var fontSize = parseInt(load("rb-font"), 10) || 100;

  function syncButtons() {
    var dark = root.getAttribute("data-theme") === "dark";
    var bt = $("#btn-theme");
    if (bt) {
      bt.setAttribute("aria-pressed", String(dark));
      bt.firstElementChild.textContent = dark ? "☀️" : "🌙";
      bt.lastElementChild.textContent = dark ? "Modo claro" : "Modo escuro";
    }
    var bc = $("#btn-contrast");
    if (bc) bc.setAttribute("aria-pressed", String(root.getAttribute("data-contrast") === "high"));
    var bm = $("#btn-motion");
    if (bm) bm.setAttribute("aria-pressed", String(root.getAttribute("data-motion") === "reduced"));
  }

  function setFont(v) {
    fontSize = Math.max(FONT_MIN, Math.min(FONT_MAX, v));
    root.style.setProperty("--font-size-base", fontSize + "%");
    save("rb-font", String(fontSize));
  }

  var btnTheme = $("#btn-theme");
  if (btnTheme) btnTheme.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    save("rb-theme", next);
    syncButtons();
  });

  var btnContrast = $("#btn-contrast");
  if (btnContrast) btnContrast.addEventListener("click", function () {
    if (root.getAttribute("data-contrast") === "high") {
      root.removeAttribute("data-contrast"); drop("rb-contrast");
    } else {
      root.setAttribute("data-contrast", "high"); save("rb-contrast", "high");
    }
    syncButtons();
  });

  var btnMotion = $("#btn-motion");
  if (btnMotion) btnMotion.addEventListener("click", function () {
    if (root.getAttribute("data-motion") === "reduced") {
      root.removeAttribute("data-motion"); drop("rb-motion");
    } else {
      root.setAttribute("data-motion", "reduced"); save("rb-motion", "reduced");
      pauseCarousel(true);
    }
    syncButtons();
  });

  var fUp = $("#btn-font-up"), fDown = $("#btn-font-down");
  if (fUp) fUp.addEventListener("click", function () { setFont(fontSize + FONT_STEP); });
  if (fDown) fDown.addEventListener("click", function () { setFont(fontSize - FONT_STEP); });

  var btnReset = $("#btn-reset");
  if (btnReset) btnReset.addEventListener("click", function () {
    ["rb-theme", "rb-contrast", "rb-motion", "rb-font"].forEach(drop);
    root.removeAttribute("data-theme");
    root.removeAttribute("data-contrast");
    root.removeAttribute("data-motion");
    fontSize = 100; root.style.removeProperty("--font-size-base");
    syncButtons();
  });

  syncButtons();

  /* ---------- 2. ABAS + FILTRO ---------- */
  var tabs = $$('[role="tab"]');
  function activateTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      $("#" + t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { activateTab(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") n = tabs[0];
      if (e.key === "End") n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); activateTab(n, true); }
    });
  });

  function normalize(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  }

  var cards = $$("#cards .card");
  $$(".search-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = normalize(form.q && form.q.value);
      var regiao = form.regiao ? form.regiao.value : "";
      var exp = form.exp ? form.exp.value : "";
      var orc = form.orc ? form.orc.value : "";
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (!q || normalize(c.dataset.nome).indexOf(q) > -1) &&
                 (!regiao || c.dataset.regiao === regiao) &&
                 (!exp || c.dataset.exp === exp) &&
                 (!orc || c.dataset.orc === orc);
        c.hidden = !ok;
        if (ok) shown++;
      });
      $("#sem-resultados").hidden = shown !== 0;
      $("#status-busca").textContent = shown + (shown === 1 ? " destino encontrado." : " destinos encontrados.");
      $("#destinos").scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- 3. CARROSSEL ---------- */
  var slidesEl = $("#slides");
  var current = 0, timer = null, paused = false;
  var slideCount = slidesEl ? slidesEl.children.length : 0;
  var dotsEl = $("#car-dots");
  var pauseBtn = $("#car-pause");

  function goTo(i) {
    current = (i + slideCount) % slideCount;
    slidesEl.style.transform = "translateX(-" + (current * 100) + "%)";
    $$(".car-dot").forEach(function (d, k) {
      if (k === current) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
  }
  function startTimer() {
    stopTimer();
    if (!paused) timer = setInterval(function () { goTo(current + 1); }, 5000);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function pauseCarousel(p) {
    paused = p;
    if (pauseBtn) {
      pauseBtn.setAttribute("aria-pressed", String(p));
      pauseBtn.textContent = p ? "▶ Reproduzir" : "⏸ Pausar";
    }
    if (slidesEl) slidesEl.setAttribute("aria-live", p ? "polite" : "off");
    if (p) stopTimer(); else startTimer();
  }

  if (slidesEl) {
    for (var i = 0; i < slideCount; i++) {
      (function (k) {
        var d = document.createElement("button");
        d.type = "button"; d.className = "car-dot";
        d.setAttribute("aria-label", "Ir para o slide " + (k + 1));
        d.addEventListener("click", function () { goTo(k); startTimer(); });
        dotsEl.appendChild(d);
      })(i);
    }
    $("#car-prev").addEventListener("click", function () { goTo(current - 1); startTimer(); });
    $("#car-next").addEventListener("click", function () { goTo(current + 1); startTimer(); });
    pauseBtn.addEventListener("click", function () { pauseCarousel(!paused); });
    var car = slidesEl.parentElement;
    car.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { goTo(current - 1); startTimer(); }
      if (e.key === "ArrowRight") { goTo(current + 1); startTimer(); }
    });
    car.addEventListener("mouseenter", stopTimer);
    car.addEventListener("mouseleave", startTimer);
    car.addEventListener("focusin", stopTimer);
    car.addEventListener("focusout", startTimer);
    goTo(0);
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || root.getAttribute("data-motion") === "reduced";
    pauseCarousel(reduce);
  }

  /* ---------- 4. FORMULÁRIO DE CONTATO ---------- */
  function setError(input, msgEl, msg) {
    msgEl.textContent = msg;
    if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
    return !msg;
  }
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var formC = $("#form-contato");
  if (formC) {
    formC.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = formC.elements;
      var results = [
        setError(f.nome, $("#e-nome"), f.nome.value.trim().length < 3 ? "Informe seu nome completo (mínimo 3 letras)." : ""),
        setError(f.email, $("#e-email"), !emailRe.test(f.email.value.trim()) ? "Informe um e-mail válido, como nome@exemplo.com." : ""),
        setError(f.msg, $("#e-msg"), f.msg.value.trim().length < 10 ? "Escreva uma mensagem com pelo menos 10 caracteres." : ""),
        setError(f.aceite, $("#e-aceite"), !f.aceite.checked ? "É necessário concordar para enviar." : "")
      ];
      var st = $("#form-status");
      if (results.every(Boolean)) {
        st.textContent = "Mensagem enviada com sucesso! Responderemos em breve.";
        st.className = "form-status ok";
        formC.reset();
      } else {
        st.className = "form-status"; st.textContent = "";
        var firstBad = formC.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
      }
    });
  }

  /* ---------- 5. LOGIN (SIMULADO) ---------- */
  var formL = $("#form-login");
  if (formL) {
    var pw = $("#l-senha"), toggle = $("#toggle-pw");
    toggle.addEventListener("click", function () {
      var show = pw.type === "password";
      pw.type = show ? "text" : "password";
      toggle.textContent = show ? "Ocultar" : "Mostrar";
      toggle.setAttribute("aria-pressed", String(show));
    });
    formL.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = formL.elements;
      var a = setError(f.email, $("#le-email"), !emailRe.test(f.email.value.trim()) ? "Informe um e-mail válido." : "");
      var b = setError(f.senha, $("#le-senha"), f.senha.value.length < 6 ? "A senha deve ter pelo menos 6 caracteres." : "");
      var st = $("#login-status");
      if (a && b) {
        /* Simulação: em um sistema real a autenticação ocorreria no servidor. */
        st.textContent = "Login realizado! Redirecionando para a página inicial…";
        st.className = "form-status ok";
        setTimeout(function () { window.location.href = "index.html"; }, 1500);
      } else {
        st.className = "form-status"; st.textContent = "";
        var bad = formL.querySelector('[aria-invalid="true"]');
        if (bad) bad.focus();
      }
    });
  }
})();
