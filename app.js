// ============================================
// SISTEMA FT-MEP - DASHBOARD Y EVALUACIÓN (SPRINT 1)
// ============================================

// Variables globales del sistema
let sistemaFT = {
    estudiantes: [],
    nivelActual: null,
    moduloActual: null,
    areaActual: null,
    // Almacenamiento de calificaciones: { [periodo]: { [estudianteId]: { [indicadorKey]: nivel } } }
    calificaciones: JSON.parse(localStorage.getItem('ft_calificaciones')) || {},
    periodoActual: 'semana-1' // Se puede cambiar por interfaz después
};

// ============================================
// 1. INICIALIZACIÓN Y CARGA DE DATOS (EXISTENTE - MEJORADA)
// ============================================

async function inicializarSistema() {
    console.log('🚀 Sistema FT-MEP inicializando...');
    mostrarDashboard();
    configurarNavegacion();
    await cargarDatosIniciales();
    console.log('✅ Sistema listo para evaluación');
}

async function cargarDatosIniciales() {
    try {
        const response = await fetch('data/estudiantes.json');
        const data = await response.json();
        
        sistemaFT.estudiantes = data.map(est => ({
            id: est.id || est.codigo || est.cedula || `est-${Date.now()}`,
            nombre: est.nombre || 'Estudiante sin nombre',
            cedula: est.cedula || est.codigo || est.id || 'N/A',
            grupo: est.grupo || "4-A",
            ciclo: determinarCiclo(est.grupo || "4-A"),
            necesidades: est.necesidades || [],
            asistencia: est.asistencia || 0,
            notaPeriodoAnterior: est.notaPeriodoAnterior || 0
        }));
        
        console.log(`✅ ${sistemaFT.estudiantes.length} estudiantes cargados`);
        actualizarContadorEstudiantes();
        
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        // Datos de emergencia
        sistemaFT.estudiantes = [
            {id: "1", nombre: "Aaron Gonzales Mera", cedula: "3068800365", grupo: "4-A", ciclo: "II"},
            {id: "2", nombre: "María Rodríguez Pérez", cedula: "2087601234", grupo: "4-A", ciclo: "II"},
            {id: "3", nombre: "Carlos López García", cedula: "3094506789", grupo: "5-B", ciclo: "III"}
        ];
        actualizarContadorEstudiantes();
    }
}

function determinarCiclo(grupo) {
    const grado = parseInt(grupo.split('-')[0]);
    if (grado >= 1 && grado <= 3) return "I";
    if (grado >= 4 && grado <= 6) return "II";
    if (grado >= 7 && grado <= 9) return "III";
    return "II";
}

// ============================================
// 2. FUNCIÓN PRINCIPAL DEL SPRINT 1: CARGAR MÓDULO DE EVALUACIÓN
// ============================================

async function cargarModuloEvaluacion(areaKey, ciclo, grado) {
    console.log(`📊 Cargando evaluación: ${areaKey} - Ciclo ${ciclo} - Grado ${grado}°`);
    
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    // 1. Cargar datos del módulo/área
    const moduloData = await cargarDatosModulo(areaKey);
    if (!moduloData) {
        contenedor.innerHTML = `<div class="error">❌ No se pudo cargar el módulo: ${areaKey}</div>`;
        return;
    }
    
    // 2. Determinar indicadores para este grado específico
    const indicadores = obtenerIndicadoresParaGrado(moduloData, grado);
    if (indicadores.length === 0) {
        contenedor.innerHTML = `<div class="info">ℹ️ No hay indicadores definidos para ${grado}° en esta área.</div>`;
        return;
    }
    
    // 3. Obtener RdA para este ciclo
    const rdaCiclo = moduloData.resultados_aprendizaje[ciclo] || "Resultado de aprendizaje no definido.";
    
    // 4. Calcular porcentaje de Trabajo Cotidiano según ciclo
    const porcentajeTC = calcularPorcentajeTrabajoCotidiano(ciclo);
    
    // 5. Generar y mostrar la vista de evaluación
    contenedor.innerHTML = generarHTMLVistaEvaluacion(moduloData, ciclo, grado, rdaCiclo, porcentajeTC);
    
    // 6. ESPERAR a que el navegador procese el HTML antes de generar la tabla
    // Esto soluciona el error "Generando tabla de evaluación..."
    setTimeout(() => {
        generarTablaEvaluacion(indicadores, grado);
        // Configurar el valor del selector de período
        const selectPeriodo = document.getElementById('selectPeriodo');
        if (selectPeriodo) {
            selectPeriodo.value = sistemaFT.periodoActual;
        }
    }, 50);
    
    // 7. Actualizar estado del sistema
    sistemaFT.areaActual = areaKey;
    sistemaFT.nivelActual = ciclo;
    actualizarNavegacionActiva(`eval-${areaKey}`);
    actualizarBreadcrumb(`Evaluación: ${moduloData.nombre} - ${grado}°`);
    
    console.log(`✅ Vista de evaluación cargada con ${indicadores.length} indicadores`);
}

// Función auxiliar: Cargar JSON del módulo
async function cargarDatosModulo(areaKey) {
    const nombreArchivo = {
        'apropiacion': 'apropiacion-tecnologica',
        'programacion': 'programacion-algoritmos',
        'computacion': 'computacion-robotica',
        'ciencia': 'ciencia-datos-ia'
    }[areaKey] || areaKey;
    
    try {
        const response = await fetch(`modulos-ft/${nombreArchivo}.json`);
        return await response.json();
    } catch (error) {
        console.error(`Error cargando módulo ${areaKey}:`, error);
        return null;
    }
}

// Función auxiliar: Filtrar indicadores para el grado
function obtenerIndicadoresParaGrado(moduloData, grado) {
    const contenidos = moduloData.contenidos;
    const gradoKey = grado.toString();
    
    if (!contenidos[gradoKey]) return [];
    
    let todosIndicadores = [];
    
    // Recorrer todos los módulos de ese grado (Módulo 1, Módulo 2, etc.)
    Object.keys(contenidos[gradoKey]).forEach(modulo => {
        const saberes = contenidos[gradoKey][modulo];
        saberes.forEach(saber => {
            todosIndicadores.push({
                ...saber,
                modulo: modulo,
                key: `${gradoKey}-${modulo}-${saber.saber.replace(/\s+/g, '-')}`
            });
        });
    });
    
    return todosIndicadores;
}

// Función auxiliar: Calcular % según REA
function calcularPorcentajeTrabajoCotidiano(ciclo) {
    const porcentajes = { 'I': 65, 'II': 60, 'III': 50 };
    return porcentajes[ciclo] || 60;
}

// ============================================
// 3. GENERAR HTML DE LA VISTA DE EVALUACIÓN
// ============================================

function generarHTMLVistaEvaluacion(moduloData, ciclo, grado, rdaCiclo, porcentajeTC) {
    return `
        <div class="evaluacion-vista">
            <div class="evaluacion-header">
                <button class="btn-volver" onclick="volverDashboard()">
                    <i class="fas fa-arrow-left"></i> Volver al Dashboard
                </button>
                <div>
                    <h2><i class="fas ${moduloData.icono}"></i> ${moduloData.nombre}</h2>
                    <p class="evaluacion-subtitulo">
                        <span class="badge-ciclo">${ciclo} Ciclo</span>
                        <span class="badge-grado">${grado}° Grado</span>
                        <span class="badge-porcentaje">Trabajo Cotidiano: ${porcentajeTC}%</span>
                    </p>
                </div>
                <div class="periodo-selector">
                    <label for="selectPeriodo"><i class="fas fa-calendar-alt"></i> Período:</label>
                    <select id="selectPeriodo" onchange="cambiarPeriodoEvaluacion(this.value)">
                        <option value="semana-1">Semana 1</option>
                        <option value="semana-2">Semana 2</option>
                        <option value="semana-3">Semana 3</option>
                        <option value="semana-4">Semana 4</option>
                        <option value="mes-1">Mes 1</option>
                        <option value="mes-2">Mes 2</option>
                    </select>
                </div>
            </div>
            
            <div class="rda-container">
                <h3><i class="fas fa-bullseye"></i> Resultado de Aprendizaje del Ciclo</h3>
                <div class="rda-texto">${rdaCiclo}</div>
            </div>
            
            <div class="evaluacion-contenido">
                <div class="herramientas-evaluacion">
                    <h3><i class="fas fa-clipboard-check"></i> Evaluación del Trabajo Cotidiano</h3>
                    <p class="instruccion">
                        Califique cada indicador para cada estudiante según los criterios:
                        <span class="nivel-badge nivel-alto">Alto (3)</span>
                        <span class="nivel-badge nivel-medio">Medio (2)</span>
                        <span class="nivel-badge nivel-bajo">Bajo (1)</span>
                    </p>
                    <div class="herramientas-acciones">
                        <button class="btn btn-outline" onclick="exportarCalificaciones()">
                            <i class="fas fa-download"></i> Exportar
                        </button>
                        <button class="btn btn-primary" onclick="guardarCalificaciones()">
                            <i class="fas fa-save"></i> Guardar Todo
                        </button>
                    </div>
                </div>
                
                <!-- TABLA DINÁMICA SE INSERTARÁ AQUÍ -->
                <div id="tablaEvaluacionContainer" class="tabla-container">
                    <div class="cargando-tabla">
                        <i class="fas fa-spinner fa-spin"></i> Generando tabla de evaluación...
                    </div>
                </div>
                
                <div class="resumen-evaluacion">
                    <h4><i class="fas fa-chart-line"></i> Resumen del Período</h4>
                    <div id="resumenPromedios" class="resumen-stats">
                        <!-- Los promedios se calcularán dinámicamente -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// 4. GENERAR TABLA INTERACTIVA DE EVALUACIÓN (CORAZÓN DEL SPRINT 1)
// ============================================

function generarTablaEvaluacion(indicadores, grado) {
    const container = document.getElementById('tablaEvaluacionContainer');
    if (!container || sistemaFT.estudiantes.length === 0) return;
    
    // Crear estructura de la tabla
    let html = `
        <div class="tabla-evaluacion-scroll">
            <table class="tabla-evaluacion">
                <thead>
                    <tr>
                        <th class="col-estudiante sticky">Estudiante</th>
    `;
    
    // Columnas de indicadores
    indicadores.forEach((ind, idx) => {
        html += `
            <th class="col-indicador" title="${ind.indicador}">
                <div class="indicador-header">
                    <span class="indicador-num">${idx + 1}</span>
                    <span class="indicador-text">${ind.saber}</span>
                </div>
                <button class="btn-info-indicador" onclick="mostrarDetalleIndicador('${ind.key}')">
                    <i class="fas fa-info-circle"></i>
                </button>
            </th>
        `;
    });
    
    // Columnas de resultados
    html += `
                        <th class="col-promedio sticky">Promedio TC</th>
                        <th class="col-porcentaje sticky">${calcularPorcentajeTrabajoCotidiano(sistemaFT.nivelActual)}% TC</th>
                        <th class="col-nivel sticky">Nivel</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Filas de estudiantes
    sistemaFT.estudiantes
        .filter(est => determinarCiclo(est.grupo) === sistemaFT.nivelActual || est.grupo.startsWith(grado))
        .forEach(estudiante => {
            html += `<tr data-estudiante-id="${estudiante.id}">`;
            html += `<td class="col-estudiante sticky">
                        <div class="estudiante-info">
                            <strong>${estudiante.nombre}</strong>
                            <small>${estudiante.cedula} | ${estudiante.grupo}</small>
                        </div>
                    </td>`;
            
            // Celdas de calificación por indicador
            indicadores.forEach(ind => {
                const calificacion = obtenerCalificacion(estudiante.id, ind.key);
                const nivelClass = calificacion ? `nivel-${calificacion}` : '';
                html += `
                    <td class="celda-calificacion ${nivelClass}" 
                        data-estudiante="${estudiante.id}" 
                        data-indicador="${ind.key}"
                        onclick="abrirSelectorCalificacion(this, '${estudiante.id}', '${ind.key}')">
                        ${calificacion ? `<span class="valor-calificacion">${calificacion}</span>` : '–'}
                    </td>
                `;
            });
            
            // Celdas de resultados (se calcularán después)
            html += `
                <td class="col-promedio sticky" id="promedio-${estudiante.id}">0.0</td>
                <td class="col-porcentaje sticky" id="porcentaje-${estudiante.id}">0.0</td>
                <td class="col-nivel sticky" id="nivel-${estudiante.id}">–</td>
            `;
            
            html += `</tr>`;
        });
    
    html += `</tbody></table></div>`;
    
    container.innerHTML = html;
    
    // Inicializar tooltips y calcular promedios iniciales
    inicializarTooltipsIndicadores(indicadores);
    calcularYMostrarPromedios();
    configurarEventosTabla();
}

// ============================================
// 5. FUNCIONES DE GESTIÓN DE CALIFICACIONES
// ============================================

function obtenerCalificacion(estudianteId, indicadorKey) {
    const periodo = sistemaFT.periodoActual;
    if (sistemaFT.calificaciones[periodo] && 
        sistemaFT.calificaciones[periodo][estudianteId]) {
        return sistemaFT.calificaciones[periodo][estudianteId][indicadorKey];
    }
    return null;
}

function guardarCalificacion(estudianteId, indicadorKey, nivel) {
    const periodo = sistemaFT.periodoActual;
    
    // Inicializar estructuras si no existen
    if (!sistemaFT.calificaciones[periodo]) {
        sistemaFT.calificaciones[periodo] = {};
    }
    if (!sistemaFT.calificaciones[periodo][estudianteId]) {
        sistemaFT.calificaciones[periodo][estudianteId] = {};
    }
    
    // Guardar calificación
    sistemaFT.calificaciones[periodo][estudianteId][indicadorKey] = nivel;
    
    // Actualizar localStorage
    localStorage.setItem('ft_calificaciones', JSON.stringify(sistemaFT.calificaciones));
    
    // Actualizar interfaz
    actualizarCeldaCalificacion(estudianteId, indicadorKey, nivel);
    calcularYMostrarPromedios();
}

function abrirSelectorCalificacion(celda, estudianteId, indicadorKey) {
    // Cerrar selector anterior si existe
    const selectorAnterior = document.querySelector('.selector-calificacion');
    if (selectorAnterior) selectorAnterior.remove();
    
    // Crear selector
    const selector = document.createElement('div');
    selector.className = 'selector-calificacion';
    selector.innerHTML = `
        <div class="selector-header">
            <span>Seleccionar nivel</span>
            <button class="btn-cerrar-selector" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
        <div class="selector-opciones">
            <button class="opcion-nivel nivel-alto" onclick="seleccionarNivel('${estudianteId}', '${indicadorKey}', 3)">Alto (3)</button>
            <button class="opcion-nivel nivel-medio" onclick="seleccionarNivel('${estudianteId}', '${indicadorKey}', 2)">Medio (2)</button>
            <button class="opcion-nivel nivel-bajo" onclick="seleccionarNivel('${estudianteId}', '${indicadorKey}', 1)">Bajo (1)</button>
            <button class="opcion-nivel nivel-vacio" onclick="seleccionarNivel('${estudianteId}', '${indicadorKey}', null)">Eliminar</button>
        </div>
    `;
    
    // Posicionar selector
    const rect = celda.getBoundingClientRect();
    selector.style.position = 'absolute';
    selector.style.top = `${rect.bottom + window.scrollY}px`;
    selector.style.left = `${rect.left + window.scrollX}px`;
    
    document.body.appendChild(selector);
}

function seleccionarNivel(estudianteId, indicadorKey, nivel) {
    guardarCalificacion(estudianteId, indicadorKey, nivel);
    
    // Cerrar selector
    const selector = document.querySelector('.selector-calificacion');
    if (selector) selector.remove();
}

function actualizarCeldaCalificacion(estudianteId, indicadorKey, nivel) {
    const celda = document.querySelector(`[data-estudiante="${estudianteId}"][data-indicador="${indicadorKey}"]`);
    if (!celda) return;
    
    // Actualizar contenido y clases
    celda.className = `celda-calificacion ${nivel ? `nivel-${nivel}` : ''}`;
    celda.innerHTML = nivel ? `<span class="valor-calificacion">${nivel}</span>` : '–';
}

// ============================================
// 6. CÁLCULO DE PROMEDIOS Y PORCENTAJES
// ============================================

function calcularYMostrarPromedios() {
    const estudiantes = document.querySelectorAll('[data-estudiante-id]');
    const porcentajeTC = calcularPorcentajeTrabajoCotidiano(sistemaFT.nivelActual);
    
    estudiantes.forEach(row => {
        const estudianteId = row.getAttribute('data-estudiante-id');
        const celdas = row.querySelectorAll('.celda-calificacion');
        
        let suma = 0;
        let count = 0;
        
        celdas.forEach(celda => {
            const nivel = celda.querySelector('.valor-calificacion');
            if (nivel) {
                suma += parseInt(nivel.textContent);
                count++;
            }
        });
        
        const promedio = count > 0 ? (suma / count).toFixed(1) : 0;
        const aporteTC = count > 0 ? ((suma / count) * porcentajeTC / 3).toFixed(1) : 0;
        const nivelFinal = obtenerNivelAproximado(promedio);
        
        // Actualizar celdas de resultados
        document.getElementById(`promedio-${estudianteId}`).textContent = promedio;
        document.getElementById(`porcentaje-${estudianteId}`).textContent = aporteTC;
        document.getElementById(`nivel-${estudianteId}`).innerHTML = `<span class="badge-nivel ${nivelFinal}">${nivelFinal.toUpperCase()}</span>`;
    });
    
    // Actualizar resumen
    actualizarResumenPromedios();
}

function obtenerNivelAproximado(promedio) {
    if (promedio >= 2.5) return 'alto';
    if (promedio >= 1.5) return 'medio';
    return 'bajo';
}

function actualizarResumenPromedios() {
    const container = document.getElementById('resumenPromedios');
    if (!container) return;
    
    const promedios = Array.from(document.querySelectorAll('.col-promedio.sticky'))
        .map(celda => parseFloat(celda.textContent) || 0)
        .filter(val => val > 0);
    
    if (promedios.length === 0) {
        container.innerHTML = '<p>No hay calificaciones registradas aún.</p>';
        return;
    }
    
    const promedioGeneral = (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(1);
    const porcentajeTC = calcularPorcentajeTrabajoCotidiano(sistemaFT.nivelActual);
    const aporteGeneral = (promedioGeneral * porcentajeTC / 3).toFixed(1);
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-users"></i></div>
            <div class="stat-content">
                <h3>${promedios.length}/${sistemaFT.estudiantes.length}</h3>
                <p>Estudiantes calificados</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-calculator"></i></div>
            <div class="stat-content">
                <h3>${promedioGeneral}</h3>
                <p>Promedio general</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-percentage"></i></div>
            <div class="stat-content">
                <h3>${aporteGeneral}</h3>
                <p>Aporte a nota final</p>
            </div>
        </div>
    `;
}

// ============================================
// 7. FUNCIONES AUXILIARES Y DE INTERFAZ
// ============================================

function mostrarDetalleIndicador(indicadorKey) {
    // Esta función se implementará completamente cuando tengamos
    // los datos cargados de los descriptores
    alert('Función en desarrollo: Aquí se mostrarán los descriptores Alto/Medio/Bajo del indicador seleccionado.');
}

function cambiarPeriodoEvaluacion(periodo) {
    sistemaFT.periodoActual = periodo;
    mostrarNotificacion(`🔄 Período cambiado a: ${periodo}`, 'info');
    
    // Recargar la vista de evaluación con los datos del nuevo período
    if (sistemaFT.areaActual && sistemaFT.nivelActual) {
        const grado = sistemaFT.estudiantes[0]?.grupo?.split('-')[0] || '4';
        
        // Mostrar mensaje de recarga
        const container = document.getElementById('tablaEvaluacionContainer');
        if (container) {
            container.innerHTML = '<div class="cargando-tabla"><i class="fas fa-sync-alt fa-spin"></i> Cargando datos del nuevo período...</div>';
        }
        
        // Recargar después de un breve delay
        setTimeout(() => {
            cargarModuloEvaluacion(sistemaFT.areaActual, sistemaFT.nivelActual, grado);
        }, 300);
    }
}

function guardarCalificaciones() {
    // Ya se guardan automáticamente, esto es para confirmación
    localStorage.setItem('ft_calificaciones', JSON.stringify(sistemaFT.calificaciones));
    mostrarNotificacion('✅ Calificaciones guardadas correctamente', 'success');
}

function exportarCalificaciones() {
    const dataStr = JSON.stringify(sistemaFT.calificaciones, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `calificaciones-ft-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    mostrarNotificacion('📥 Calificaciones exportadas como JSON', 'info');
}

function mostrarNotificacion(mensaje, tipo) {
    // Crear notificación temporal
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `<i class="fas fa-${tipo === 'success' ? 'check-circle' : 'info-circle'}"></i> ${mensaje}`;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

function configurarEventosTabla() {
    // Configurar eventos de hover para las celdas
    document.querySelectorAll('.celda-calificacion').forEach(celda => {
        celda.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        celda.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}

function inicializarTooltipsIndicadores(indicadores) {
    // Esta función se implementará para mostrar tooltips con la descripción
    // completa del indicador al pasar el mouse sobre el header
    console.log('Tooltips inicializados para', indicadores.length, 'indicadores');
}

// ============================================
// 8. FUNCIONES DE NAVEGACIÓN (EXISTENTES - ACTUALIZADAS)
// ============================================

function mostrarDashboard() {
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    contenedor.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h2><i class="fas fa-tachometer-alt"></i> Panel de Control FT-MEP</h2>
                <p>Gestión académica para Formación Tecnológica - MEP Costa Rica</p>
                <div class="dashboard-subheader">
                    <button class="btn btn-primary" onclick="irAEvaluacionRapida()">
                        <i class="fas fa-bolt"></i> Ir a Evaluación Rápida
                    </button>
                </div>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-content">
                        <h3 id="contadorEstudiantes">0</h3>
                        <p>Estudiantes</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-book"></i></div>
                    <div class="stat-content">
                        <h3>4</h3>
                        <p>Áreas FT</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-chart-bar"></i></div>
                    <div class="stat-content">
                        <h3 id="contadorCalificadas">0</h3>
                        <p>Calificaciones</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                    <div class="stat-content">
                        <h3>${sistemaFT.periodoActual}</h3>
                        <p>Período actual</p>
                    </div>
                </div>
            </div>
            
            <div class="seccion-dashboard">
                <h3><i class="fas fa-graduation-cap"></i> Niveles Educativos</h3>
                <div class="niveles-grid">
                    <div class="nivel-card" onclick="cargarSelectorEvaluacion('I')">
                        <div class="nivel-icon"><i class="fas fa-child"></i></div>
                        <h4>I Ciclo</h4>
                        <p>Primaria 1°-3°</p>
                        <div class="nivel-badge">65% TC</div>
                    </div>
                    
                    <div class="nivel-card" onclick="cargarSelectorEvaluacion('II')">
                        <div class="nivel-icon"><i class="fas fa-user-graduate"></i></div>
                        <h4>II Ciclo</h4>
                        <p>Primaria 4°-6°</p>
                        <div class="nivel-badge">60% TC</div>
                    </div>
                    
                    <div class="nivel-card" onclick="cargarSelectorEvaluacion('III')">
                        <div class="nivel-icon"><i class="fas fa-graduation-cap"></i></div>
                        <h4>III Ciclo</h4>
                        <p>Secundaria 7°-9°</p>
                        <div class="nivel-badge">50% TC</div>
                    </div>
                </div>
            </div>
            
            <div class="seccion-dashboard">
                <h3><i class="fas fa-bolt"></i> Acciones Rápidas</h3>
                <div class="acciones-grid">
                    <button class="accion-btn" onclick="cargarSelectorEvaluacion('II')">
                        <i class="fas fa-clipboard-check"></i><span>Evaluar 4°</span>
                    </button>
                    <button class="accion-btn" onclick="cargarSelectorEvaluacion('III')">
                        <i class="fas fa-clipboard-check"></i><span>Evaluar 7°</span>
                    </button>
                    <button class="accion-btn" onclick="exportarCalificaciones()">
                        <i class="fas fa-file-export"></i><span>Exportar Datos</span>
                    </button>
                    <button class="accion-btn" onclick="location.reload()">
                        <i class="fas fa-sync-alt"></i><span>Actualizar</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    actualizarContadorEstudiantes();
    actualizarContadorCalificaciones();
}

function cargarSelectorEvaluacion(ciclo) {
    const contenedor = document.getElementById('contenedorPrincipal');
    
    // Determinar el grado por defecto según el ciclo (CORRECCIÓN APLICADA AQUÍ)
    let gradoDefault = '4'; // Valor por defecto
    if (ciclo === 'I') gradoDefault = '1';
    if (ciclo === 'II') gradoDefault = '4';
    if (ciclo === 'III') gradoDefault = '7';
    
    contenedor.innerHTML = `
        <div class="selector-evaluacion">
            <div class="selector-header">
                <button class="btn-volver" onclick="mostrarDashboard()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <h2><i class="fas fa-clipboard-list"></i> Seleccionar Área para Evaluar</h2>
                <p>Ciclo ${ciclo} - Trabajo Cotidiano (${calcularPorcentajeTrabajoCotidiano(ciclo)}%)</p>
            </div>
            
            <div class="areas-grid">
                <div class="area-card" onclick="cargarModuloEvaluacion('apropiacion', '${ciclo}', '${gradoDefault}')">
                    <div class="area-icon"><i class="fas fa-laptop"></i></div>
                    <h3>Apropiación tecnológica</h3>
                    <p>Uso efectivo y creativo de tecnologías digitales</p>
                </div>
                
                <div class="area-card" onclick="cargarModuloEvaluacion('programacion', '${ciclo}', '${gradoDefault}')">
                    <div class="area-icon"><i class="fas fa-code"></i></div>
                    <h3>Programación</h3>
                    <p>Pensamiento computacional y algoritmos</p>
                </div>
                
                <div class="area-card" onclick="cargarModuloEvaluacion('computacion', '${ciclo}', '${gradoDefault}')">
                    <div class="area-icon"><i class="fas fa-robot"></i></div>
                    <h3>Computación física</h3>
                    <p>Robótica y sistemas automatizados</p>
                </div>
                
                <div class="area-card" onclick="cargarModuloEvaluacion('ciencia', '${ciclo}', '${gradoDefault}')">
                    <div class="area-icon"><i class="fas fa-brain"></i></div>
                    <h3>Ciencia de datos</h3>
                    <p>Análisis de datos e inteligencia artificial</p>
                </div>
            </div>
            
            <div class="selector-nota">
                <p><i class="fas fa-info-circle"></i> <strong>Nota:</strong> Actualmente se muestran indicadores para <strong>${gradoDefault}° grado</strong> como ejemplo. En el Sprint 2 se agregará un selector para elegir cualquier grado.</p>
            </div>
        </div>
    `;
}

function actualizarContadorEstudiantes() {
    const contador = document.getElementById('contadorEstudiantes');
    if (contador) contador.textContent = sistemaFT.estudiantes.length;
}

function actualizarContadorCalificaciones() {
    const contador = document.getElementById('contadorCalificadas');
    if (!contador) return;
    
    let total = 0;
    Object.values(sistemaFT.calificaciones).forEach(periodo => {
        Object.values(periodo).forEach(estudiante => {
            total += Object.keys(estudiante).length;
        });
    });
    
    contador.textContent = total;
}

// ============================================
// 9. INICIALIZACIÓN Y EXPORTACIÓN
// ============================================

// Hacer funciones globales
window.mostrarDashboard = mostrarDashboard;
window.cargarModuloEvaluacion = cargarModuloEvaluacion;
window.cargarSelectorEvaluacion = cargarSelectorEvaluacion;
window.volverDashboard = mostrarDashboard;
window.seleccionarNivel = seleccionarNivel;
window.guardarCalificaciones = guardarCalificaciones;
window.exportarCalificaciones = exportarCalificaciones;
window.cambiarPeriodoEvaluacion = cambiarPeriodoEvaluacion;

// Inicializar sistema
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistema);
} else {
    inicializarSistema();
}

console.log('✅ Sistema FT-MEP - Sprint 1 cargado');

