// ====== CONFIGURACIÓN (completar IDs antes de lanzar los anuncios) ======
const LL_CONFIG = {
  whatsappNumber: "5493442537081",
  metaPixelId: "",   // Ej: "123456789012345" (Meta Events Manager)
  googleTagId: ""    // Ej: "AW-XXXXXXXXX" (opcional, Google Ads)
};

// Contenido por oferta: se elige con ?s=agro | empresas | obras
const PROFILES = {
  agro: {
    chip: "Equipos para Agro y Módulos Desmontables",
    topic: "un módulo rural / gallinero solar desmontable",
    h1: 'Gallineros y módulos rurales solares <span class="highlight">desmontables</span>, enviados a todo el país.',
    lead: 'Módulos <strong>100% desmontables por paneles</strong>, con automatización solar y diseño CAD 3D. Los despachamos a cualquier provincia de la Argentina.',
    cta: "Pedir presupuesto del módulo por WhatsApp"
  },
  empresas: {
    chip: "Estructuras y Producción en Serie para Empresas",
    topic: "producción en serie o estructuras para mi empresa",
    h1: 'Producción en serie para empresas: bandejas, columnas reticuladas y estructuras <span class="highlight">con soldador calificado</span>.',
    lead: 'Fabricamos <strong>lotes completos de bandejas metálicas, columnas reticuladas, racks de depósito y bases estructurales</strong> y los despachamos en camión a todo el país.',
    cta: "Pedir presupuesto para mi empresa"
  },
  obras: {
    chip: "Galpones, Galerías y Obras",
    topic: "un galpón, galería, portón u obra a medida",
    h1: 'Galpones, galerías, portones y obras a medida <span class="highlight">en hierro y acero</span>.',
    lead: 'Trabajos a medida para tu casa, campo o comercio, con <strong>soldador calificado</strong>. Taller en Concepción del Uruguay, Entre Ríos.',
    cta: "Pedir presupuesto de mi obra"
  }
};

const params = new URLSearchParams(location.search);
const clean = (v) => (v || "").replace(/[^\w.\-]/g, "").slice(0, 40);
const profileKey = PROFILES[params.get("s")] ? params.get("s") : "";
const refTag = [profileKey, clean(params.get("utm_campaign")), clean(params.get("utm_content"))].filter(Boolean).join("/");

function buildWhatsAppUrl(message) {
  const full = refTag ? `${message}\n\n[Ref: ${refTag}]` : message;
  return `https://wa.me/${LL_CONFIG.whatsappNumber}?text=${encodeURIComponent(full)}`;
}

// ====== Tracking (Meta Pixel / Google tag), solo si hay IDs ======
function initTracking() {
  if (LL_CONFIG.metaPixelId) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", LL_CONFIG.metaPixelId);
    window.fbq("track", "PageView");
  }
  if (LL_CONFIG.googleTagId) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${LL_CONFIG.googleTagId}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", LL_CONFIG.googleTagId);
  }
}

// "Contact" = clic directo a WhatsApp · "Lead" = envío del cotizador
function track(metaEvent, label) {
  if (typeof window.fbq === "function") window.fbq("track", metaEvent, { content_name: label, ref: refTag });
  if (typeof window.gtag === "function") {
    window.gtag("event", metaEvent === "Lead" ? "generate_lead" : "click_whatsapp", { event_label: label });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTracking();
  const chips = document.querySelectorAll(".chip-btn");
  const profile = PROFILES[profileKey];

  // 0. Contenido según la oferta (?s=...)
  if (profile) {
    const h1 = document.getElementById("hero-title");
    const lead = document.getElementById("hero-lead");
    const cta = document.getElementById("hero-cta-text");
    if (h1) h1.innerHTML = profile.h1;
    if (lead) lead.innerHTML = profile.lead;
    if (cta) cta.textContent = profile.cta;
    chips.forEach((c) => c.classList.toggle("active", c.dataset.service === profile.chip));
    if (profileKey === "agro") { const ag = document.getElementById("agro"), vs = document.getElementById("videos"); if (ag && vs) vs.parentNode.insertBefore(ag, vs); }
    document.querySelectorAll("[data-wa-direct]").forEach((a) => a.setAttribute("data-wa-direct", profile.topic));
  }
  const activeChip = document.querySelector(".chip-btn.active");
  let selectedService = activeChip ? activeChip.dataset.service : "";
  chips.forEach((c) => c.setAttribute("aria-pressed", c.classList.contains("active")));

  // 1. Botones directos: links reales a wa.me (funcionan en el navegador de Instagram/Facebook)
  document.querySelectorAll("[data-wa-direct]").forEach((a) => {
    const topic = a.getAttribute("data-wa-direct") || "un proyecto industrial o a medida";
    a.href = buildWhatsAppUrl(`¡Hola Leo (LL Herrería)! Vi su página web y quería pedir un presupuesto sin cargo por *${topic}*.`);
    a.addEventListener("click", () => track("Contact", `Direct_${topic}`));
  });

  // 2. Filtros del catálogo
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workCards = document.querySelectorAll(".work-card");
  filterBtns.forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.classList.contains("active"));
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      const filter = btn.getAttribute("data-filter");
      workCards.forEach((card) => {
        card.classList.toggle("hidden", !(filter === "all" || card.getAttribute("data-category") === filter));
      });
    });
  });

  // 3. Lightbox (cierra con X, clic afuera o Esc; bloquea el scroll de fondo)
  const lightbox = document.getElementById("work-lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCat = document.getElementById("lb-cat");
  const lbTitle = document.getElementById("lb-title");
  const lbDesc = document.getElementById("lb-desc");
  const lbQuoteBtn = document.getElementById("lb-quote-btn");
  const lbClose = document.getElementById("lb-close");
  const closeLightbox = () => { lightbox.classList.remove("open"); document.body.style.overflow = ""; };

  document.querySelectorAll("[data-lightbox]").forEach((item) => {
    item.addEventListener("click", () => {
      const title = item.getAttribute("data-title");
      lbImg.src = item.getAttribute("data-img");
      lbImg.alt = title;
      lbCat.textContent = item.getAttribute("data-cat");
      lbTitle.textContent = title;
      lbDesc.textContent = item.getAttribute("data-desc");
      lbQuoteBtn.setAttribute("data-select-service", item.getAttribute("data-service") || title);
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });
  if (lbClose && lightbox) {
    lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
  }

  // 4. "Cotizar este servicio": baja al cotizador y preselecciona el chip
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-select-service]");
    if (!btn) return;
    e.preventDefault();
    selectedService = btn.getAttribute("data-select-service");
    if (lightbox) closeLightbox();
    chips.forEach((c) => {
      const on = c.dataset.service === selectedService;
      c.classList.toggle("active", on);
      c.setAttribute("aria-pressed", on);
    });
    const q = document.getElementById("cotizador");
    if (q) q.scrollIntoView({ behavior: "smooth" });
  });

  // 5. Chips del cotizador
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");
      selectedService = chip.dataset.service;
    });
  });

  // 6. Envío del cotizador a WhatsApp
  const form = document.getElementById("wa-quote-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const zone = document.getElementById("clientZone").value.trim() || "Argentina";
      const details = document.getElementById("workDetails").value.trim();
      let msg = `¡Hola Leo (*LL Herrería*)! Quiero pedir un presupuesto sin cargo:\n\n`;
      msg += `• *Trabajo:* ${selectedService}\n• *Ciudad / Provincia:* ${zone}\n`;
      if (details) msg += `• *Medidas / Detalles:* ${details}\n`;
      msg += `\nSi hace falta, te paso fotos o planos por acá. ¡Muchas gracias!`;
      track("Lead", `Form_${selectedService}`);
      window.location.href = buildWhatsAppUrl(msg);
    });
  }

  // 7. Videos: solo se reproducen cuando están a la vista (ahorra datos en celular)
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { en.isIntersecting ? en.target.play().catch(() => {}) : en.target.pause(); });
    }, { threshold: 0.5 });
    document.querySelectorAll("video").forEach((v) => io.observe(v));
  }
});
