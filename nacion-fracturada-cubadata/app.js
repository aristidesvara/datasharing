const evidences = [
  {
    id: 1,
    tag: "politica",
    speculation: "Si hay tanto malestar, habría más protesta.",
    evidence: "La protesta visible no depende solo del malestar; depende de riesgo, eficacia percibida y costos familiares.",
    stat: "71.4% apoya manifestaciones entre informados; 17.9% ve muy probable participar.",
  },
  {
    id: 2,
    tag: "agencia",
    speculation: "El silencio significa apoyo.",
    evidence: "El silencio puede ser autocontención estratégica, no consentimiento.",
    stat: "44.5% evita hablar de asuntos públicos; 53.5% cree que apoyar a otros aún vale la pena.",
  },
  {
    id: 3,
    tag: "politica",
    speculation: "El Estado todavía organiza la vida.",
    evidence: "El Estado conserva control, pero pierde centralidad como sostén material y horizonte de solución.",
    stat: "70.6% confiaba poco o nada en el sistema en 2021; en 2026 solo 5.6% cree que el Estado sostendrá la vida diaria.",
  },
  {
    id: 4,
    tag: "agencia",
    speculation: "El sector privado democratiza por sí solo.",
    evidence: "El sector privado expresa autonomía económica, pero opera bajo restricción, contactos, escasez y jerarquías.",
    stat: "64.5% vinculado a ANE; 84.4% ve empleo privado o mixto como motor laboral; 63.6% acepta diferencias si crean oportunidades.",
  },
  {
    id: 5,
    tag: "agencia",
    speculation: "Si las campañas no producen protesta inmediata, no sirven.",
    evidence: "En autocracias, preservar agencia, memoria y lenguaje crítico también es un resultado político.",
    stat: "Panel 3: 5 olas, 4 grupos, 1,225 exposiciones y 434 comentarios; sin salto promedio robusto en protesta visible.",
  },
  {
    id: 6,
    tag: "futuro",
    speculation: "Cuba explota o no explota.",
    evidence: "Los datos no fechan el cambio, pero sí muestran capacidades latentes y expectativas de transformación.",
    stat: "50.6% cree que el rumbo terminará cambiando aunque el gobierno no quiera; 43.8% ve posible algo similar a Venezuela.",
  },
];

const timeline = [
  {
    year: "2021",
    title: "Legitimidad erosionada",
    text: "Confianza y satisfacción con el sistema ya aparecen gravemente debilitadas.",
  },
  {
    year: "2023",
    title: "Voto como alienación",
    text: "El canal electoral deja de ser percibido como voz efectiva.",
  },
  {
    year: "2024-25",
    title: "Firewall cívico",
    text: "Las campañas no rompen la inercia de protesta, pero ayudan a preservar agencia.",
  },
  {
    year: "2026",
    title: "La crisis entra al hogar",
    text: "La supervivencia cotidiana absorbe energía pública y reorganiza prioridades.",
  },
  {
    year: "ANE/CIPE",
    title: "Autonomía bajo restricción",
    text: "Crece la mentalidad de resolver fuera del Estado, pero dentro de un entorno controlado.",
  },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const cardTemplate = ({ id, speculation, evidence, stat }) => `
  <article class="evidence-card">
    <span class="card-number">${id}</span>
    <h3 class="speculation">${speculation}</h3>
    <span class="evidence-label">Evidencia CubaData</span>
    <p class="evidence-text">${evidence}</p>
    <p class="stat">${stat}</p>
  </article>
`;

const timelineTemplate = ({ year, title, text }, index) => `
  <article class="timeline-item ${index === 4 ? "active" : ""}">
    <div class="year">${year}</div>
    <strong>${title}</strong>
    <p>${text}</p>
  </article>
`;

function renderEvidence(filter = "all") {
  const visible = filter === "all" ? evidences : evidences.filter((item) => item.tag === filter);
  $("#evidenceGrid").innerHTML = visible.map(cardTemplate).join("");
}

function renderTimeline() {
  $("#timeline").innerHTML = timeline.map(timelineTemplate).join("");
}

function bindFilters() {
  $$(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".filter").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderEvidence(button.dataset.filter);
    });
  });
}

async function sharePage() {
  const shareData = {
    title: "¿Hay un cambio de mentalidad en Cuba?",
    text: "Seis evidencias CubaData contra seis especulaciones.",
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  await navigator.clipboard.writeText(window.location.href);
  const button = $("#shareButton");
  const previous = button.innerHTML;
  button.textContent = "✓";
  window.setTimeout(() => {
    button.innerHTML = previous;
  }, 1200);
}

function bindShare() {
  $("#shareButton").addEventListener("click", () => {
    sharePage().catch(() => {});
  });
}

renderEvidence();
renderTimeline();
bindFilters();
bindShare();
