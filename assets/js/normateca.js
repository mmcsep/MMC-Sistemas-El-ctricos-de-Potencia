/**
 * MMC SISTEMAS ELÉCTRICOS DE POTENCIA
 * NORMATECA MODAL — funcionalidad completa
 *
 * INSTRUCCIONES PARA AGREGAR / QUITAR ARCHIVOS:
 * Edita únicamente el arreglo NORMATECA_DOCS que está justo abajo.
 * Los PDFs deben estar en: assets/docs/
 * Ejemplo:
 *   { nombre: "MINOMBRE.pdf", tamano: "1.2 MB" }
 * La ruta se genera automáticamente como "assets/docs/MINOMBRE.pdf"
 */

// ===================================================
// 1. LISTADO DE DOCUMENTOS — edita aquí tus archivos
// ===================================================
const NORMATECA_DOCS = [
    { nombre: "DCPROTER.pdf", tamano: "370 KB" },
    { nombre: "DCPROASO.pdf", tamano: "487 KB" },
    { nombre: "DCMMT600.pdf", tamano: "438 KB" },
    { nombre: "DCMMT500.pdf", tamano: "629 KB" },
    { nombre: "DCSEEEGA.pdf", tamano: "183 KB" },
    { nombre: "DCCSSUBT.pdf", tamano: "15.6 MB" },
    { nombre: "DCMMT400.pdf", tamano: "960 KB" },
    { nombre: "DCMMT100.pdf", tamano: "813 KB" },
    { nombre: "DCMBT300.pdf", tamano: "1.5 MB" },
    { nombre: "DCMBT200.pdf", tamano: "1.2 MB" },
    { nombre: "DCCIAMBT.pdf", tamano: "24.3 MB" },
];

const PDF_BASE_PATH = "assets/docs/";

// ===================================================
// 2. ESTADO INTERNO
// ===================================================
let normatecaSortAZ = false;   // false = orden original, true = A-Z
let normatecaQuery = "";

// ===================================================
// 3. HELPERS
// ===================================================
function buildDocList(docs) {
    let list = [...docs];
    if (normatecaSortAZ) {
        list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    if (normatecaQuery.trim()) {
        const q = normatecaQuery.trim().toLowerCase();
        list = list.filter(d => d.nombre.toLowerCase().includes(q));
    }
    return list;
}

function calcTotalSize(docs) {
    // Convierte tamaños a KB para sumar (estimado)
    let totalKB = 0;
    docs.forEach(d => {
        const val = parseFloat(d.tamano);
        if (d.tamano.toUpperCase().includes("MB")) totalKB += val * 1024;
        else totalKB += val; // KB
    });
    if (totalKB >= 1024) return (totalKB / 1024).toFixed(1) + " MB";
    return Math.round(totalKB) + " KB";
}

// ===================================================
// 4. RENDERIZADO
// ===================================================
function renderNormatecaList() {
    const wrapper = document.getElementById("normateca-list-wrapper");
    const countEl = document.getElementById("normateca-count");
    if (!wrapper) return;

    const filtered = buildDocList(NORMATECA_DOCS);

    // Actualizar contador
    if (countEl) {
        const total = NORMATECA_DOCS.length;
        const shown = filtered.length;
        if (normatecaQuery.trim()) {
            countEl.innerHTML = `Mostrando <span>${shown}</span> de <span>${total}</span> documentos`;
        } else {
            countEl.innerHTML = `<span>${total}</span> documentos disponibles &nbsp;·&nbsp; Total: <span>${calcTotalSize(NORMATECA_DOCS)}</span>`;
        }
    }

    // Sin resultados
    if (filtered.length === 0) {
        wrapper.innerHTML = `
            <div class="normateca-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <p>Sin resultados para "<strong>${normatecaQuery}</strong>"</p>
                <strong>Intenta con otro término de búsqueda</strong>
            </div>`;
        return;
    }

    // Generar filas
    wrapper.innerHTML = filtered.map((doc, i) => {
        const ruta = PDF_BASE_PATH + doc.nombre;
        const encoded = encodeURIComponent(doc.nombre);
        return `
        <div class="normateca-item" style="animation-delay:${i * 0.04}s" data-nombre="${doc.nombre}">
            <!-- Icono PDF -->
            <div class="normateca-pdf-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
            </div>

            <!-- Nombre y meta -->
            <div class="normateca-file-info">
                <div class="normateca-file-name" title="${doc.nombre}">${doc.nombre}</div>
                <div class="normateca-file-meta">
                    <span class="normateca-file-size">${doc.tamano}</span>
                    <span class="normateca-file-type">PDF</span>
                </div>
            </div>

            <!-- Acciones -->
            <div class="normateca-actions">
                <a href="${ruta}" target="_blank" rel="noopener noreferrer"
                   class="normateca-btn-view"
                   title="Ver ${doc.nombre} en una nueva pestaña">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Ver
                </a>
                <a href="${ruta}" download="${doc.nombre}"
                   class="normateca-btn-download"
                   title="Descargar ${doc.nombre}"
                   onclick="animateDownload(this)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Bajar
                </a>
            </div>
        </div>`;
    }).join("");
}

// Feedback visual al descargar
function animateDownload(btn) {
    const item = btn.closest(".normateca-item");
    if (!item) return;
    item.classList.add("downloading");
    setTimeout(() => item.classList.remove("downloading"), 2000);
}

// ===================================================
// 5. DESCARGAR TODO EN ZIP (JSZip + FileSaver)
// ===================================================
async function descargarTodoZip() {
    const zipBtn = document.getElementById("normateca-zip-btn");
    if (!zipBtn) return;

    // Cargar JSZip dinámicamente si no está
    if (typeof JSZip === "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        document.head.appendChild(script);
        await new Promise(res => { script.onload = res; });
    }
    if (typeof saveAs === "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js";
        document.head.appendChild(script);
        await new Promise(res => { script.onload = res; });
    }

    // Estado de carga en el botón
    const btnOrigHTML = zipBtn.innerHTML;
    zipBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
             style="animation:spin 1s linear infinite">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <span>Descargando…</span>`;
    zipBtn.disabled = true;

    try {
        const zip = new JSZip();
        const folder = zip.folder("Normateca-MMC");

        // Descargar cada PDF y añadirlo al ZIP
        const promises = NORMATECA_DOCS.map(async (doc) => {
            try {
                const res = await fetch(PDF_BASE_PATH + doc.nombre);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const blob = await res.blob();
                folder.file(doc.nombre, blob);
            } catch {
                console.warn(`No se pudo añadir al ZIP: ${doc.nombre}`);
            }
        });

        await Promise.all(promises);
        const content = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        saveAs(content, "Normateca-MMC.zip");

    } catch (err) {
        console.error("Error al generar ZIP:", err);
        alert("Ocurrió un error al generar el ZIP. Intenta descargar los archivos individualmente.");
    } finally {
        zipBtn.innerHTML = btnOrigHTML;
        zipBtn.disabled = false;
    }
}

// Animación de spinner para el botón ZIP
const spinStyle = document.createElement("style");
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

// ===================================================
// 6. MODAL — abrir / cerrar
// ===================================================
function abrirNormateca() {
    const modal = document.getElementById("modal-normateca");
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    // Reset estado
    normatecaQuery = "";
    const search = document.getElementById("normateca-search");
    if (search) search.value = "";
    normatecaSortAZ = false;
    actualizarSortBtn();
    renderNormatecaList();
    // Focus en búsqueda
    setTimeout(() => { if (search) search.focus(); }, 300);
}

function cerrarNormateca() {
    const modal = document.getElementById("modal-normateca");
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
}

function actualizarSortBtn() {
    const btn = document.getElementById("normateca-sort-btn");
    if (!btn) return;
    btn.innerHTML = normatecaSortAZ
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M7 12h10M11 18h2"/></svg><span>Z-A</span>`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M7 12h10M11 18h2"/></svg><span>A-Z</span>`;
}

// ===================================================
// 7. INIT NORMATECA
// ===================================================
function initNormateca() {
    // Reemplazar el HTML del modal con la estructura completa
    const modal = document.getElementById("modal-normateca");
    if (!modal) {
        console.warn("No se encontró #modal-normateca en el HTML");
        return;
    }

    modal.className = "normateca-modal";

    modal.innerHTML = `
        <div class="normateca-content" role="dialog" aria-modal="true" aria-labelledby="normateca-title">

            <!-- HEADER -->
            <div class="normateca-header">
                <div class="normateca-header-top">
                    <div class="normateca-header-title">
                        <div class="normateca-header-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 id="normateca-title">Normateca</h2>
                            <p class="normateca-subtitle">Especificaciones de Construcción CFE</p>
                        </div>
                    </div>
                    <button class="normateca-close" id="normateca-close-btn" aria-label="Cerrar normateca">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="normateca-stats">
                    <div class="normateca-stat">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <strong>${NORMATECA_DOCS.length}</strong> documentos
                    </div>
                    <div class="normateca-stat">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Total: <strong>${calcTotalSize(NORMATECA_DOCS)}</strong>
                    </div>
                </div>
            </div>

            <!-- CONTROLES -->
            <div class="normateca-controls">
                <div class="normateca-search-wrapper">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input type="search" id="normateca-search" class="normateca-search"
                           placeholder="Buscar documento…" autocomplete="off" spellcheck="false">
                </div>
                <button class="normateca-sort-btn" id="normateca-sort-btn" title="Ordenar A-Z / Z-A">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M3 6h18M7 12h10M11 18h2"/>
                    </svg>
                    <span>A-Z</span>
                </button>
                <button class="normateca-zip-btn" id="normateca-zip-btn" title="Descargar toda la normateca en ZIP">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>Descargar ZIP</span>
                </button>
            </div>

            <!-- CONTADOR -->
            <div class="normateca-results-count" id="normateca-count"></div>

            <!-- LISTA -->
            <div class="normateca-list-wrapper" id="normateca-list-wrapper"></div>

        </div>`;

    // Eventos
    document.getElementById("normateca-close-btn")
        .addEventListener("click", cerrarNormateca);

    document.getElementById("normateca-search")
        .addEventListener("input", (e) => {
            normatecaQuery = e.target.value;
            renderNormatecaList();
        });

    document.getElementById("normateca-sort-btn")
        .addEventListener("click", () => {
            normatecaSortAZ = !normatecaSortAZ;
            actualizarSortBtn();
            renderNormatecaList();
        });

    document.getElementById("normateca-zip-btn")
        .addEventListener("click", descargarTodoZip);

    // Cerrar al click en el overlay (fuera del contenido)
    modal.addEventListener("click", (e) => {
        if (e.target === modal) cerrarNormateca();
    });

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            cerrarNormateca();
        }
    });

    // Botón "Ver Normateca" en la página
    const abrirBtn = document.getElementById("abrir-modal-normateca");
    if (abrirBtn) {
        abrirBtn.addEventListener("click", abrirNormateca);
    }

    console.log("✅ Normateca inicializada:", NORMATECA_DOCS.length, "documentos");
}

// ===== Exportar para uso global (el botón puede llamarla directamente) =====
window.abrirNormateca = abrirNormateca;
window.cerrarNormateca = cerrarNormateca;
window.animateDownload = animateDownload;