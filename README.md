# LL Herrería — Landing Page de Conversión (Meta Ads / Google Ads)

## Contexto del Proyecto
- **Empresa**: LL Herrería (@ll__herreria), fundada por **Leo Luter** (@leo_luter), **Soldador Calificado** (probetas aprobadas).
- **Ubicación y Cobertura**: Taller central de 60 m² en Concepción del Uruguay, Entre Ríos, Argentina, con **producción industrial en serie y envíos a toda la Argentina**.
- **Objetivo de la Landing Page**: Convertir tráfico de campañas publicitarias (Facebook/Instagram Ads y Google Ads) en consultas calificadas por WhatsApp (+54 9 3442 53-7081), priorizando tickets altos (**Empresas, Producción en Serie, Estructuras Reticuladas, Innovación Agro y Acero Inoxidable**) además de obras residenciales (galpones, galerías, portones) y equipamiento vehicular 4x4/utilitarios.
- **URL publicada**: https://lutertomas4.github.io/ll-herreria/

## Estructura de Archivos
- index.html: Estructura semántica con Hero industrial, sección de 3 videos reales de producción, catálogo interactivo filtrable de 18 obras reales con Lightbox HD, sección de 6 divisiones de servicios, historia/autoridad de Soldador Calificado y Cotizador Rápido en 3 pasos conectado a WhatsApp (con eventos Lead para Meta Pixel y Google Ads).
- styles.css: Diseño industrial oscuro (acero/carbón + ámbar de soldadura + verde WhatsApp) con optimización Mobile-First (barra rápida móvil, carrusel de videos tipo Reels con scroll-snap, filtros táctiles en 1 fila y prevención de auto-zoom en iOS).
- script.js: Lógica de filtros del catálogo, Lightbox modal, pre-selección de servicios, armado de mensaje de WhatsApp y tracking de conversiones.
- ssets/: Fotografías reales de obras y producción en serie de LL Herrería.
## Uso en campañas (v2)
- Links para anuncios: `?s=agro`, `?s=empresas`, `?s=obras` (+ `&utm_campaign=...&utm_content=...`). Cambian titular, bajada y servicio preseleccionado, y agregan `[Ref: ...]` al mensaje de WhatsApp.
- Pixel: completar `metaPixelId` (y `googleTagId` si corresponde) en `script.js`. Eventos: `Contact` (clic directo) y `Lead` (cotizador).
- Pendiente: confirmar con Leo plazos y forma de pago del FAQ; sumar testimonios reales.
