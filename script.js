// Configuración centralizada de contacto (con el número real de Leo Luter: 3442-537081)
const LL_CONFIG = {
  whatsappNumber: "5493442537081",
  instagramUrl: "https://www.instagram.com/ll__herreria",
  founderInstagram: "https://www.instagram.com/leo_luter",
  coverage: "Concepción del Uruguay, Entre Ríos · Trabajos y envíos a toda la Argentina"
};

function buildWhatsAppUrl(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${LL_CONFIG.whatsappNumber}?text=${encoded}`;
}

function trackLeadEvent(sourceLabel) {
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: sourceLabel });
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", { event_label: sourceLabel });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let selectedService = "Estructuras y Trabajos para Empresas / Industria";

  // 1. Botones directos de WhatsApp
  document.querySelectorAll("[data-wa-direct]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const customTopic = btn.getAttribute("data-wa-direct") || "un proyecto industrial o a medida";
      const msg = `¡Hola Leo (LL Herrería)! Vi su página web y quería pedir un presupuesto sin cargo por *${customTopic}*.`;
      trackLeadEvent(`Direct_${customTopic}`);
      window.open(buildWhatsAppUrl(msg), "_blank", "noopener");
    });
  });

  // 2. Filtros interactivos del Portfolio
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workCards = document.querySelectorAll(".work-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");

      workCards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // 3. Lightbox para ver fotos en tamaño completo y cotizar ese trabajo puntual
  const lightbox = document.getElementById("work-lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCat = document.getElementById("lb-cat");
  const lbTitle = document.getElementById("lb-title");
  const lbDesc = document.getElementById("lb-desc");
  const lbQuoteBtn = document.getElementById("lb-quote-btn");
  const lbClose = document.getElementById("lb-close");

  document.querySelectorAll("[data-lightbox]").forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.getAttribute("data-img");
      const title = item.getAttribute("data-title");
      const desc = item.getAttribute("data-desc");
      const cat = item.getAttribute("data-cat");
      const service = item.getAttribute("data-service") || title;

      lbImg.src = img;
      lbImg.alt = title;
      lbCat.textContent = cat;
      lbTitle.textContent = title;
      lbDesc.textContent = desc;
      lbQuoteBtn.setAttribute("data-select-service", service);

      lightbox.classList.add("open");
    });
  });

  if (lbClose && lightbox) {
    lbClose.addEventListener("click", () => lightbox.classList.remove("open"));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.remove("open");
    });
  }

  // 4. Botones "Cotizar este servicio" que bajan al cotizador y pre-seleccionan el chip
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-select-service]");
    if (!btn) return;
    e.preventDefault();

    const targetService = btn.getAttribute("data-select-service");
    selectedService = targetService;

    if (lightbox) lightbox.classList.remove("open");

    document.querySelectorAll(".chip-btn").forEach((chip) => {
      chip.classList.toggle("active", chip.getAttribute("data-service") === targetService);
    });

    const quoteSection = document.getElementById("cotizador");
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  // 5. Selección de chips en el cotizador
  document.querySelectorAll(".chip-btn").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip-btn").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      selectedService = chip.getAttribute("data-service");
    });
  });

  // 6. Envío del formulario cotizador a WhatsApp
  const form = document.getElementById("wa-quote-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const clientType = document.getElementById("clientType").value;
      const zone = document.getElementById("clientZone").value.trim() || "Argentina";
      const details = document.getElementById("workDetails").value.trim();

      let message = `¡Hola Leo (*LL Herrería*)! Quiero pedir un presupuesto sin cargo:\n\n`;
      message += `• *Trabajo:* ${selectedService}\n`;
      message += `• *Destino:* ${clientType}\n`;
      message += `• *Ciudad / Provincia:* ${zone}\n`;
      if (details) {
        message += `• *Medidas / Detalles:* ${details}\n`;
      }
      message += `\n¿Podrías asesorarme? ¡Muchas gracias!`;

      trackLeadEvent(`Form_${selectedService}`);
      window.open(buildWhatsAppUrl(message), "_blank", "noopener");
    });
  }
});
