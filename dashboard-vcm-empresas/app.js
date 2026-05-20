
// Sistema de Cuentas de Historias Ejecutivas
const STORIES=[
  {id:"costos",tab:"Costo",title:"No medir no evita pagar",body:"La evidencia de costos es la más consistente: ausentismo, presentismo, rotación, conflicto de equipo y descuento reputacional aparecen en múltiples métodos.",claim:"La VCM es un riesgo operacional imponible.",proof:["US$0.8-2.0B de pérdida anualizada por firma propensa al acoso.","-1.5% de valor de mercado ante escándalos públicos.","Días perdidos por ausentismo y presentismo en finanzas LATAM."]},
  {id:"politicas",tab:"Políticas",title:"La política escrita no es la intervención",body:"Los protocolos tradicionales pueden ser inertes si no se altera el clima de seguridad psicológica y no se reduce la resistencia implícita de los gerentes.",claim:"Regular importa; implementar y auditar la transferencia importa más.",proof:["Capacitaciones interactivas mejoran conocimiento y autoeficacia.","Tener política nominal no correlaciona con caída de prevalencia.","Canales formalistas tradicionales pueden activar represalias u opacidad."]},
  {id:"capital",tab:"Talento",title:"La violencia rompe trayectorias laborales",body:"Los mejores registros longitudinales administrativos muestran daños severos y permanentes en empleo e ingresos, superando los choques de despidos estándar.",claim:"Proteger a sobrevivientes preserva el capital humano estratégico.",proof:["-9 pp en probabilidad de empleo a cinco años tras violencia entre colegas.","81.9% reportó peor desempeño por violencia de pareja.","El perpetrador en rol de gerente agrava críticamente el retiro laboral."]},
  {id:"gobernanza",tab:"Gobernanza",title:"El riesgo escala ante la neutralización corporativa del problema",body:"La resistencia cognitiva directiva y el rechazo a los marcos técnicos de equidad boicotean el retorno de las inversiones preventivas.",claim:"La prevención real es una prueba ácida de gobierno corporativo.",proof:["48.6% de gerentes con resistencia implícita intensa en Perú.","75% directivos rechaza el encuadre explícito 'VCM'.","La implicación ejecutiva del CEO dispara las penalizaciones en bolsa."]}
];

// Matriz ampliada visible: estudios, revisiones, reportes y casos con coordenadas numericas discretas.
const EVIDENCE=Object.freeze((window.DASHBOARD_EVIDENCE_PARTS||[]).flat());

// DATASET MAESTRO DE CASOS REGIONALES APLICADOS LATAM
const CASES=Object.freeze([
  {type:"Empresa / Perú",title:"Konecta Perú 2023",sourceUrl:"https://doi.org/10.13140/RG.2.2.14358.36169/1",sourceLabel:"DOI",text:"Rentabilidad neta de la prevención del hostigamiento sexual laboral en grandes firmas de servicios.",trace:"Publicación Académica 2024."},
  {type:"Empresa / Bolivia",title:"Droguería INTI S.A.",sourceUrl:"#fuente-drogueria-inti",sourceLabel:"Nota",text:"Efectos del programa corporativo 'Cero Tolerancia': diseño, monitoreo y mitigación de mermas operativas.",trace:"Serie Temporal Interna 2015-2018."},
  {type:"Empresas / Ecuador",title:"Banco ProCredit y El Ordeño",sourceUrl:"#fuente-procredit-ordeno",sourceLabel:"Nota",text:"Despliegue operativo de la caja de herramientas PreViMujer de la GIZ; auditoría de procesos de línea.",trace:"Evaluación GIZ Ecuador 2024."},
  {type:"Telecom / Bolivia",title:"NuevaTel / Viva Bolivia",sourceUrl:"https://www.giz.de/en/downloads/ComVoMujer_Executive_Summary_ViolenceagainstwomenanditsfinancialconsequencesforbusinessesinBolivia_BO_2015.pdf",sourceLabel:"Informe",text:"Cálculo de la línea base pionera de costos empresariales derivados del derrame de la VPI.",trace:"GIZ ComVoMujer 2014."},
  {type:"Finanzas / LATAM",title:"Bolivia y Paraguay",sourceUrl:"https://doi.org/10.1177/10778012231189479",sourceLabel:"DOI",text:"Estudio multicéntrico en 9 instituciones bancarias; modelación paramétrica de ausentismo.",trace:"Violence Against Women (2024)."},
  {type:"Sector privado / Perú",title:"Empresas Privadas CCL",sourceUrl:"#fuente-hsl-peru",sourceLabel:"Nota",text:"Auditoría contable y psicométrica aplicada de los costos invisibles del hostigamiento sexual laboral.",trace:"CCL-USMP Reporte 2024."},
  {type:"Empresas / Colombia-México",title:"Proyecto IDRC 2019-2021",sourceUrl:"#fuente-idrc",sourceLabel:"Nota",text:"Modelación del impacto de la violencia contra las mujeres sobre la flexibilidad de las cadenas de suministro globales.",trace:"Contrato IDRC de Investigación Aplicada."},
  {type:"Microempresa / Sector Exportador",title:"Ecuador-Perú MSEs",sourceUrl:"https://doi.org/10.3390/ijerph191912163",sourceLabel:"DOI",text:"Encuesta analítica sobre descapitalización, quiebre de la capacidad gerencial y pérdida de contratos internacionales.",trace:"Ponce-Gómez & Vara-Horna (2022)."}
]);

// Variables Globales de Control y Configuración Visual
const COLORS=Object.freeze({"Costos financieros":"#8f1731","Riesgo reputacional":"#1e5b91","Productividad":"#137060","Capital humano":"#b98612","Equipos y clima":"#6b4bb0","Políticas":"#c4495b","Gerencia":"#30373f","Hostigamiento sexual":"#8f1731","Caso aplicado":"#76612f","Casos aplicados":"#76612f"});
const normalize=value=>(value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const unique=values=>[...new Set(values)].filter(Boolean).sort();
const strengthClass=value=>{const v=normalize(value);if(v.includes("fuerte"))return"strong";if(v.includes("moderada"))return"moderate";if(v.includes("debil"))return"weak";return"neutral"};
const inferenceClass=value=>normalize(value).includes("causal")?"causal":"";
const evidenceYear=row=>{
  const text=[row.study,row.trace,row.design].filter(Boolean).join(" ");
  const years=[...text.matchAll(/\b(19|20)\d{2}\b/g)].map(match=>Number(match[0]));
  return years.length?years[0]:null;
};
const PERIODS=Object.freeze([
  {label:"1995-2011",min:1995,max:2011},
  {label:"2012-2020",min:2012,max:2020},
  {label:"2021-Actualidad",min:2021,max:Infinity}
]);
const evidencePeriod=year=>PERIODS.find(period=>year>=period.min&&year<=period.max);

const sourceTitle=item=>{
  if(!item.sourceUrl)return `${item.study||item.title}<span class="source-tag">Fuente pendiente</span>`;
  const external=!item.sourceUrl.startsWith("#");
  return `<a href="${item.sourceUrl}" ${external?'target="_blank" rel="noopener noreferrer"':""}>${item.study||item.title}<span class="source-tag">${item.sourceLabel||"Fuente"}</span></a>`;
};

// Variable Mutante Global controlada de Estado (Encapsulada)
let state={domain:"",inference:"",strength:"",query:"",view:"cards"};

// LOGIC REFACTOR: INTERRUPTOR CONMUTABLE AVANZADO (TOGGLE FILTER)
const setDomain=domain=>{
  state={...state,domain:state.domain===domain?"":domain};
  drawExplorer();
  document.getElementById("explorador").scrollIntoView({block:"start",behavior:"smooth"});
};

function renderStories(){
  const tabs=document.getElementById("tabs");
  const story=document.getElementById("story");
  const draw=id=>{
    const item=STORIES.find(row=>row.id===id)||STORIES[0];
    story.innerHTML=`<div><h3>${item.title}</h3><p>${item.body}</p><div class="claim">${item.claim}</div></div><div class="proofs">${item.proof.map(text=>`<div>${text}</div>`).join("")}</div>`;
    [...tabs.querySelectorAll("button")].forEach(btn=>{const active=btn.dataset.id===item.id;btn.classList.toggle("active",active);btn.setAttribute("aria-selected",String(active))});
  };
  tabs.setAttribute("role","tablist");
  tabs.innerHTML=STORIES.map((item,index)=>`<button class="tab ${index===0?"active":""}" role="tab" aria-selected="${index===0}" data-id="${item.id}">${item.tab}</button>`).join("");
  tabs.addEventListener("click",event=>{const btn=event.target.closest("button");if(btn)draw(btn.dataset.id)});
  draw(STORIES[0].id);
}

// LOGIC REFACTOR: RENDERIZADO BURSÁTIL POR COORDENADAS NUMÉRICAS DIRECTAS SIN PARSEO DE CADENAS DE TEXTO
function renderAxisPlot(rows){
  const axis=document.getElementById("axis");
  const grouped=rows.reduce((acc,row)=>({...acc,[row.domain]:[...(acc[row.domain]||[]),row]}),{});
  
  const points=Object.entries(grouped).map(([domain,items])=>{
    const avgX=items.reduce((sum,r)=>sum+r.im_num,0)/items.length;
    const avgY=items.reduce((sum,r)=>sum+r.st_num,0)/items.length;
    const label=domain.replace("Costos financieros","Costos").replace("Riesgo reputacional","Mercado").replace("Caso aplicado","Casos");
    const active=state.domain===domain;
    return `<button class="bubble ${active?'active':''}" data-domain="${domain}" style="left:${avgX}%;top:${100-avgY}%;width:${Math.min(98,54+items.length*2.2)}px;height:${Math.min(98,54+items.length*2.2)}px;background:${COLORS[domain]||"#8f1731"}" title="Filtrar/Alternar: ${domain}">${label}<small>n=${items.length}</small></button>`;
  }).join("");

  axis.innerHTML=`<span class="axis-label y">Más fuerza</span><span class="axis-label x">Más impacto empresarial</span>${points}`;
  axis.querySelectorAll(".bubble").forEach(btn=>btn.addEventListener("click",()=>setDomain(btn.dataset.domain)));
}

function renderBarsChart(rows){
  const chart=document.getElementById("domainChart");
  const grouped=rows.reduce((acc,row)=>{const key=row.domain==="Caso aplicado"?"Casos aplicados":row.domain;acc[key]=[...(acc[key]||[]),row];return acc},{});
  const sorted=Object.entries(grouped).sort((a,b)=>b[1].length-a[1].length);
  const maxVal=Math.max(...sorted.map(([,v])=>v.length),1);

  chart.innerHTML=sorted.map(([key,items])=>{
    const domainKey=key==="Casos aplicados"?"Caso aplicado":key;
    const active=state.domain===domainKey;
    return `<button class="bar-row ${active?'active':''}" data-domain="${domainKey}" title="Filtrar/Alternar: ${key}"><span class="bar-label">${key}</span><span class="bar-bg"><span class="bar" style="width:${items.length/maxVal*100}%;background:${COLORS[key]||"#8f1731"}"></span></span><span class="bar-val">${items.length}</span></button>`;
  }).join("");

  chart.querySelectorAll(".bar-row").forEach(btn=>btn.addEventListener("click",()=>setDomain(btn.dataset.domain)));
}

function renderTimelineChart(rows){
  const chart=document.getElementById("timelineChart");
  if(!chart)return;

  const counts=rows.reduce((acc,row)=>{
    const year=evidenceYear(row);
    const period=year?evidencePeriod(year):null;
    return period?{...acc,[period.label]:(acc[period.label]||0)+1}:acc;
  },{});
  const maxVal=Math.max(...PERIODS.map(period=>counts[period.label]||0),1);

  chart.innerHTML=PERIODS.map(period=>{
    const count=counts[period.label]||0;
    const height=24+(count/maxVal)*150;
    return `<div class="year-bar" title="${period.label}: ${count} registro${count===1?"":"s"}"><div class="year-fill" style="height:${height}px"></div><div class="year-count">${count}</div><div class="year-label">${period.label}</div></div>`;
  }).join("");
}

function renderCasesGrid(){
  document.getElementById("caseGrid").innerHTML=CASES.map(item=>`<article class="case-card"><div class="role">${item.type}</div><h3>${sourceTitle(item)}</h3><p>${item.text}</p><div class="trace">${item.trace}</div></article>`).join("");
}

// UI REFACTOR: INTERRUPTOR CONMUTABLE DE LAYOUT (VISTA CARDS VS TABLA COMPACTA)
function buildExplorerView(rows){
  if(state.view==="table"){
    return `<div class="table-view-wrap">
              <table class="dense-table">
                <thead>
                  <tr>
                    <th>Estudio / Autor</th>
                    <th>Dominio</th>
                    <th>Metodología / Diseño</th>
                    <th>Inferencia</th>
                    <th>Fuerza</th>
                    <th>Hallazgo Clave</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(row=>`
                    <tr>
                      <td class="font-bold text-slate-900">${sourceTitle(row)}</td>
                      <td><span class="px-2 py-0.5 rounded text-[11px] font-bold text-white" style="background:${COLORS[row.domain]||'#3c434c'}">${row.domain}</span></td>
                      <td class="text-xs font-semibold text-indigo-600">${row.design}</td>
                      <td class="text-xs font-semibold">${row.inference}</td>
                      <td><span class="px-2 py-0.5 rounded text-[11px] font-bold block text-center ${row.strength==='Fuerte'?'bg-emerald-100 text-green-800':row.strength==='Moderada'?'bg-amber-100 text-amber-800':'bg-slate-100 text-slate-800'}">${row.strength}</span></td>
                      <td class="text-sm text-slate-700">${row.result} <br><small class="text-red-700 block mt-1 font-bold">Cautela: ${row.caution}</small></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>`;
  }

  // Vista de Tarjetas Estándar
  return `<div class="cards">
            ${rows.map(row=>`
              <article class="evidence-card">
                <div>
                  <h3>${sourceTitle(row)}</h3>
                  <p class="text-slate-800 font-medium">${row.result}</p>
                  <div class="meta">
                    <span class="pill" style="color:${COLORS[row.domain]||"#30373f"}; font-weight:900;">${row.domain}</span>
                    <span class="pill ${inferenceClass(row.inference)}">${row.inference}</span>
                    <span class="pill ${strengthClass(row.strength)}">${row.strength}</span>
                    ${row.latam?`<span class="pill bg-indigo-100 text-indigo-900">LATAM</span>`:""}
                  </div>
                  <p class="mt-2 text-xs"><strong>Diseño:</strong> ${row.design}</p>
                  <p class="text-xs text-red-900"><strong>Cautela técnica:</strong> ${row.caution}</p>
                </div>
                <div class="evidence-trace">${row.trace}</div>
              </article>
            `).join("")}
          </div>`;
}

function drawExplorer(){
  const container=document.getElementById("explorerContainer");
  const searchInput=document.getElementById("search");
  const domainSelect=document.getElementById("domain");
  const inferenceSelect=document.getElementById("inference");
  const strengthSelect=document.getElementById("strength");

  // Sincronización del estado de los inputs
  domainSelect.value=state.domain;
  inferenceSelect.value=state.inference;
  strengthSelect.value=state.strength;
  searchInput.value=state.query;

  // Filtrado Funcional Puro Combinado
  const queryNorm=normalize(state.query);
  const rows=EVIDENCE.filter(row=>{
    const mDomain=!state.domain||row.domain===state.domain;
    const mInference=!state.inference||row.inference===state.inference;
    const mStrength=!state.strength||row.strength===state.strength;
    const mQuery=!queryNorm||normalize(Object.values(row).join(" ")).includes(queryNorm);
    return mDomain && mInference && mStrength && mQuery;
  });

  // Actualización de contadores de metadata en vivo
  document.getElementById("visibleCount").textContent=rows.length;
  document.getElementById("causalCount").textContent=rows.filter(r=>normalize(r.inference).includes("causal")).length;
  document.getElementById("strongOnlyCount").textContent=rows.filter(r=>r.strength==="Fuerte").length;
  document.getElementById("moderateCount").textContent=rows.filter(r=>r.strength==="Moderada").length;
  document.getElementById("latamCount").textContent=rows.filter(r=>r.latam).length;

  container.innerHTML=buildExplorerView(rows);
  
  // Refrescar componentes de gráficos vinculados (Cross-Filtering)
  renderBarsChart(EVIDENCE);
  renderAxisPlot(EVIDENCE);
  renderTimelineChart(EVIDENCE);
}

function setupExplorerControls(){
  const domainSelect=document.getElementById("domain");
  const inferenceSelect=document.getElementById("inference");
  const strengthSelect=document.getElementById("strength");
  const searchInput=document.getElementById("search");
  const viewBtn=document.getElementById("toggleView");

  const optionHtml=values=>values.map(v=>`<option value="${v}">${v}</option>`).join("");
  domainSelect.innerHTML=`<option value="">Todos los Dominios</option>${optionHtml(unique(EVIDENCE.map(r=>r.domain)))}`;
  inferenceSelect.innerHTML=`<option value="">Todas las Inferencias</option>${optionHtml(unique(EVIDENCE.map(r=>r.inference)))}`;
  strengthSelect.innerHTML=`<option value="">Todas las Robusteces</option>${optionHtml(unique(EVIDENCE.map(r=>r.strength)))}`;

  domainSelect.addEventListener("change",e=>{state={...state,domain:e.target.value};drawExplorer()});
  inferenceSelect.addEventListener("change",e=>{state={...state,inference:e.target.value};drawExplorer()});
  strengthSelect.addEventListener("change",e=>{state={...state,strength:e.target.value};drawExplorer()});
  searchInput.addEventListener("input",e=>{state={...state,query:e.target.value};drawExplorer()});
  
  document.getElementById("reset").addEventListener("click",()=>{
    state={domain:"",inference:"",strength:"",query:"",view:state.view};
    drawExplorer();
  });

  viewBtn.addEventListener("click",()=>{
    state.view=state.view==="cards"?"table":"cards";
    viewBtn.textContent=state.view==="table"?"Vista: Tabla Compacta":"Vista: Tarjetas";
    viewBtn.classList.toggle("toggle-active",state.view==="table");
    drawExplorer();
  });

  // Exportación Declarativa Completa a Formato CSV
  document.getElementById("downloadCsv").addEventListener("click",()=>{
    const fields=["domain","study","inference","strength","latam","result","design","caution","trace"];
    const queryNorm=normalize(state.query);
    const targetRows=EVIDENCE.filter(row=>{
      return (!state.domain||row.domain===state.domain)&&(!state.inference||row.inference===state.inference)&&(!state.strength||row.strength===state.strength)&&(!queryNorm||normalize(Object.values(row).join(" ")).includes(queryNorm));
    });
    
    const csvContent=[
      fields.join(","),
      ...targetRows.map(row=>fields.map(f=>`"${String(row[f]??"").replaceAll('"','""')}"`).join(","))
    ].join("\n");

    const blob=new Blob([csvContent],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.setAttribute("download","matriz_evidencia_vcm_completa.csv");
    link.click();
    URL.revokeObjectURL(url);
  });
}

// Inicialización de Aplicación
renderStories();
renderCasesGrid();
setupExplorerControls();
drawExplorer();
