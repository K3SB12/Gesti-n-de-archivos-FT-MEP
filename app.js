// ============================================
// SISTEMA FT-MEP - DASHBOARD SIMPLIFICADO
// ============================================

// Variables del sistema
let sistemaFT = {
    estudiantes: [],
    nivelActual: null
};

// Limpiar contenido duplicado al inicio
function limpiarInterfazDuplicada() {
    console.log('🧹 Limpiando interfaz duplicada...');
    
    // Elementos del sistema viejo a ocultar
    const clasesAOcultar = [
        '.header', '.system-status-bar', '.main-layout', 
        '.sidebar', '.toolbar', '.ai-panel', '.view-content'
    ];
    
    clasesAOcultar.forEach(selector => {
        const elementos = document.querySelectorAll(selector);
        elementos.forEach(el => {
            if (el) {
                el.style.display = 'none';
            }
        });
    });
    
    // Asegurar que el body tenga el padding correcto
    document.body.style.paddingTop = '120px';
    document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    
    console.log('✅ Interfaz limpia');
}

// Inicializar sistema
function inicializarSistema() {
    console.log('🚀 Sistema FT-MEP - Dashboard inicializando...');
    
    // 1. Limpiar interfaz duplicada
    limpiarInterfazDuplicada();
    
    // 2. Cargar datos iniciales
    cargarDatosIniciales();
    
    // 3. Mostrar dashboard por defecto
    mostrarDashboard();
    
    // 4. Configurar navegación
    configurarNavegacion();
    
    console.log('✅ Dashboard FT-MEP listo');
}

// Cargar datos iniciales
async function cargarDatosIniciales() {
    try {
        console.log('📥 Cargando datos MEP...');
        
        // Cargar estudiantes.json
        const response = await fetch('./data/estudiantes.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📄 Datos crudos recibidos:', data);
        
        // Tu archivo es un array directo, no un objeto con propiedad "estudiantes"
        if (Array.isArray(data)) {
            // Transformar tus datos a la estructura que espera el sistema
            sistemaFT.estudiantes = data.map(est => ({
                id: est.id,
                nombre: est.nombre,
                cedula: est.codigo || est.id,  // Usar código como cédula
                grupo: est.grupo || "4-A",
                ciclo: determinarCiclo(est.grupo), // Determinar ciclo del grupo
                necesidades: est.necesidades || [],
                asistencia: est.asistencia || 0,
                notaPeriodoAnterior: est.notaPeriodoAnterior || 0
            }));
            console.log(`👥 ${sistemaFT.estudiantes.length} estudiantes transformados`);
        } else {
            console.warn('❌ Estructura desconocida, usando datos de ejemplo');
            sistemaFT.estudiantes = obtenerEstudiantesEjemplo();
        }
        
    } catch (error) {
        console.error('❌ Error cargando estudiantes:', error);
        sistemaFT.estudiantes = obtenerEstudiantesEjemplo();
        console.log(`👥 ${sistemaFT.estudiantes.length} estudiantes de ejemplo cargados`);
    }
}

// Función auxiliar para determinar ciclo
function determinarCiclo(grupo) {
    if (!grupo) return "I";
    const grado = parseInt(grupo.split('-')[0] || grupo.split('°')[0]);
    if (grado >= 1 && grado <= 3) return "I";
    if (grado >= 4 && grado <= 6) return "II";
    if (grado >= 7 && grado <= 9) return "III";
    return "I"; // Por defecto
}

// Función auxiliar para estudiantes de ejemplo
function obtenerEstudiantesEjemplo() {
    return [
        {id: 1, nombre: "Ana Gómez", cedula: "001234567", ciclo: "I", grupo: "7°A"},
        {id: 2, nombre: "Carlos López", cedula: "002345678", ciclo: "I", grupo: "7°A"},
        {id: 3, nombre: "María Rodríguez", cedula: "003456789", ciclo: "II", grupo: "8°B"},
        {id: 4, nombre: "José Pérez", cedula: "004567890", ciclo: "III", grupo: "9°A"},
        {id: 5, nombre: "Laura Martínez", cedula: "005678901", ciclo: "III", grupo: "9°B"}
    ];
}

// Actualizar breadcrumb
function actualizarBreadcrumb(ruta) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <span class="breadcrumb-item active">
                <i class="fas fa-home"></i> ${ruta}
            </span>
        `;
    }
}

// Mostrar dashboard principal
function mostrarDashboard() {
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) {
        console.error('❌ No se encontró contenedorPrincipal');
        return;
    }
    
    // Actualizar breadcrumb
    actualizarBreadcrumb('Inicio');
    
    contenedor.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h2><i class="fas fa-tachometer-alt"></i> Panel de Control FT-MEP</h2>
                <p>Gestión académica para Formación Tecnológica - MEP Costa Rica</p>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${sistemaFT.estudiantes.length}</h3>
                        <p>Estudiantes</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-content">
                        <h3>12</h3>
                        <p>Módulos FT</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-school"></i>
                    </div>
                    <div class="stat-content">
                        <h3>3</h3>
                        <p>Ciclos</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <h3>85%</h3>
                        <p>Promedio</p>
                    </div>
                </div>
            </div>
            
            <div class="seccion-dashboard">
                <h3><i class="fas fa-graduation-cap"></i> Niveles Educativos</h3>
                <div class="niveles-grid">
                    <div class="nivel-card" onclick="cargarNivel('primaria-ciclo-I')">
                        <div class="nivel-icon">
                            <i class="fas fa-child"></i>
                        </div>
                        <h4>I Ciclo</h4>
                        <p>Primaria 1°-3°</p>
                        <div class="nivel-badge">Primaria</div>
                    </div>
                    
                    <div class="nivel-card" onclick="cargarNivel('primaria-ciclo-II')">
                        <div class="nivel-icon">
                            <i class="fas fa-user-graduate"></i>
                        </div>
                        <h4>II Ciclo</h4>
                        <p>Primaria 4°-6°</p>
                        <div class="nivel-badge">Primaria</div>
                    </div>
                    
                    <div class="nivel-card" onclick="cargarNivel('secundaria-ciclo-III')">
                        <div class="nivel-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <h4>III Ciclo</h4>
                        <p>Secundaria 7°-9°</p>
                        <div class="nivel-badge">Secundaria</div>
                    </div>
                </div>
            </div>
            
            <div class="seccion-dashboard">
                <h3><i class="fas fa-bolt"></i> Acciones Rápidas</h3>
                <div class="acciones-grid">
                    <button class="accion-btn" onclick="gestionarEstudiantes()">
                        <i class="fas fa-user-plus"></i>
                        <span>Gestionar Estudiantes</span>
                    </button>
                    
                    <button class="accion-btn" onclick="generarReportes()">
                        <i class="fas fa-file-pdf"></i>
                        <span>Generar Reportes</span>
                    </button>
                    
                    <button class="accion-btn" onclick="activarAsistenteIA()">
                        <i class="fas fa-robot"></i>
                        <span>Asistente IA</span>
                    </button>
                    
                    <button class="accion-btn" onclick="calcularNotas()">
                        <i class="fas fa-calculator"></i>
                        <span>Calcular Notas</span>
                    </button>
                </div>
            </div>
            
            <div class="seccion-dashboard">
                <h3><i class="fas fa-history"></i> Actividad Reciente</h3>
                <div class="actividad-lista">
                    <div class="actividad-item">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <p>Dashboard FT-MEP cargado correctamente</p>
                            <small>${new Date().toLocaleTimeString()}</small>
                        </div>
                    </div>
                    
                    <div class="actividad-item">
                        <i class="fas fa-database"></i>
                        <div>
                            <p>${sistemaFT.estudiantes.length} estudiantes disponibles</p>
                            <small>Base de datos activa</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Cargar un nivel educativo
async function cargarNivel(nivelId) {
    // Actualizar breadcrumb
    const nombres = {
        'primaria-ciclo-I': 'I Ciclo',
        'primaria-ciclo-II': 'II Ciclo', 
        'secundaria-ciclo-III': 'III Ciclo'
    };
    actualizarBreadcrumb(nombres[nivelId] || 'Ciclo');
    
    sistemaFT.nivelActual = nivelId;
    
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    // MOSTRAR MIENTRAS CARGAMOS
    contenedor.innerHTML = `
        <div class="nivel-vista">
            <div class="nivel-header">
                <button class="btn-volver" onclick="volverDashboard()">
                    <i class="fas fa-arrow-left"></i> Volver al Dashboard
                </button>
                <h2><i class="fas fa-folder-open"></i> ${nombres[nivelId] || nivelId}</h2>
                <div class="ciclo-badge">
                    ${nivelId.includes('I') ? '50% Trabajo cotidiano' : 
                     nivelId.includes('II') ? '55% Trabajo cotidiano' : 
                     '60% Trabajo cotidiano'} (Art. 6.1.1 MEP)
                </div>
            </div>
            
            <div class="nivel-contenido">
                <div class="nivel-info">
                    <i class="fas fa-clipboard-check"></i>
                    <div>
                        <p><strong>Registro de trabajo cotidiano</strong></p>
                        <small>Art. 6.1.1 Lineamientos MEP 2024: "Registro continuo del desempeño mediante instrumentos técnicos"</small>
                    </div>
                </div>
                
                <div class="modulos-disponibles">
                    <h4><i class="fas fa-tasks"></i> Módulos para evaluación</h4>
                    <div class="modulos-lista" id="modulosLista">
                        <div class="cargando-modulos">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Cargando módulos MEP...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // CARGAR MÓDULOS REALES (async)
    await cargarYMostrarModulosReales(nivelId);
}

// Función para cargar y mostrar módulos reales
async function cargarYMostrarModulosReales(nivelId) {
    try {
        // 1. Cargar configuración de ciclos para saber qué módulos tocan
        const response = await fetch('./data/ciclos-config.json');
        const ciclosConfig = await response.json();
        
        console.log('📊 Configuración de ciclos cargada:', ciclosConfig);
        
        // 2. Mapear nivelId a los IDs de tu JSON
        const nivelMap = {
            'primaria-ciclo-I': 'ciclo-I',
            'primaria-ciclo-II': 'ciclo-II',
            'secundaria-ciclo-III': 'ciclo-III'
        };
        
        const cicloId = nivelMap[nivelId];
        const cicloActual = ciclosConfig.ciclos.find(c => c.id === cicloId);
        
        if (!cicloActual) {
            throw new Error(`Ciclo no encontrado: ${cicloId}`);
        }
        
        console.log(`🎯 Ciclo encontrado: ${cicloActual.nombre}`);
        
        // 3. Determinar qué módulos mostrar basado en las áreas del ciclo
        // Mapear áreas a módulos
        const areaToModulo = {
            "Apropiación tecnológica y Digital": "ofimatica",
            "Programación y Algoritmos": "programacion",
            "Computación física y Robótica": "robotica",
            "Ciencia de datos e Inteligencia artificial": "inteligencia-artificial",
            "Redes y Comunicación": "redes"
        };
        
        // Obtener módulos únicos para este ciclo
        const modulosParaEsteCiclo = [...new Set(
            cicloActual.areas.map(area => areaToModulo[area]).filter(m => m)
        )];
        
        // Si no hay módulos específicos, usar uno por defecto
        if (modulosParaEsteCiclo.length === 0) {
            modulosParaEsteCiclo.push('ofimatica');
        }
        
        console.log(`📚 Módulos para ${cicloActual.nombre}:`, modulosParaEsteCiclo);
        
        // 4. Generar HTML para cada módulo
        let htmlModulos = '';
        
        for (const moduloKey of modulosParaEsteCiclo) {
            try {
                const modResponse = await fetch(`./modulos-ft/${moduloKey}.json`);
                const moduloData = await modResponse.json();
                
                htmlModulos += `
                    <div class="modulo-item-real" onclick="abrirRegistroModulo('${moduloKey}', '${nivelId}')">
                        <div class="modulo-icon">
                            <i class="fas ${getModuloIcon(moduloKey)}"></i>
                        </div>
                        <div class="modulo-info">
                            <h5>${moduloData.nombre || moduloKey}</h5>
                            <p>${moduloData.descripcion || 'Módulo de Formación Tecnológica'}</p>
                            <div class="modulo-meta">
                                <span><i class="fas fa-clock"></i> ${cicloActual.horas_semanales}h/semana</span>
                                <span><i class="fas fa-book"></i> ${cicloActual.total_horas}h totales</span>
                                <span><i class="fas fa-graduation-cap"></i> ${getPorcentajeNota(nivelId)}% nota</span>
                            </div>
                            <div class="modulo-areas">
                                ${moduloData.areas ? moduloData.areas.map(area => 
                                    `<span class="badge-area">${area}</span>`
                                ).join('') : ''}
                            </div>
                        </div>
                        <button class="btn btn-primary">
                            <i class="fas fa-clipboard-list"></i> Registrar
                        </button>
                    </div>
                `;
            } catch (error) {
                console.warn(`No se pudo cargar ${moduloKey}.json:`, error);
                // Módulo de ejemplo si no existe
                htmlModulos += crearModuloEjemploHTML(moduloKey, nivelId, cicloActual);
            }
        }
        
        // 5. Mostrar en la página
        const modulosLista = document.getElementById('modulosLista');
        if (modulosLista) {
            modulosLista.innerHTML = htmlModulos || 
                `<p class="texto-vacio">No hay módulos configurados para ${cicloActual.nombre}.</p>`;
        }
            
    } catch (error) {
        console.error('Error cargando módulos:', error);
        const modulosLista = document.getElementById('modulosLista');
        if (modulosLista) {
            modulosLista.innerHTML = `
                <div class="error-modulos">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error cargando módulos: ${error.message}</p>
                    <p>Usando módulo de ejemplo.</p>
                    ${crearModuloEjemploHTML('ofimatica', nivelId)}
                </div>
            `;
        }
    }
}

// Función auxiliar para obtener icono de módulo
function getModuloIcon(moduloKey) {
    const iconos = {
        'ofimatica': 'fa-file-word',
        'programacion': 'fa-code',
        'robotica': 'fa-robot',
        'redes': 'fa-network-wired',
        'inteligencia-artificial': 'fa-brain',
        'ciencia-datos': 'fa-chart-bar'
    };
    return iconos[moduloKey] || 'fa-book';
}

// Función auxiliar para obtener porcentaje de nota
function getPorcentajeNota(nivelId) {
    // Según Art. 6.1.1 MEP
    if (nivelId.includes('I')) return 50;
    if (nivelId.includes('II')) return 55;
    if (nivelId.includes('III')) return 60;
    return 50;
}

// Función para crear HTML de módulo de ejemplo
function crearModuloEjemploHTML(moduloKey, nivelId, cicloActual = null) {
    const nombresModulos = {
        'ofimatica': 'Ofimática y Herramientas Digitales',
        'programacion': 'Programación y Algoritmos',
        'robotica': 'Computación Física y Robótica',
        'redes': 'Redes y Comunicación Digital',
        'inteligencia-artificial': 'Inteligencia Artificial'
    };
    
    const nombresCiclos = {
        'primaria-ciclo-I': 'I Ciclo (1°-3°)',
        'primaria-ciclo-II': 'II Ciclo (4°-6°)', 
        'secundaria-ciclo-III': 'III Ciclo (7°-9°)'
    };
    
    const moduloNombre = nombresModulos[moduloKey] || 
                        moduloKey.charAt(0).toUpperCase() + moduloKey.slice(1);
    
    return `
        <div class="modulo-item-real" onclick="abrirRegistroModulo('${moduloKey}', '${nivelId}')">
            <div class="modulo-icon">
                <i class="fas ${getModuloIcon(moduloKey)}"></i>
            </div>
            <div class="modulo-info">
                <h5>${moduloNombre} (Ejemplo)</h5>
                <p>Módulo de ${nombresCiclos[nivelId] || 'Formación Tecnológica'}</p>
                <div class="modulo-meta">
                    ${cicloActual ? `
                        <span><i class="fas fa-clock"></i> ${cicloActual.horas_semanales}h/semana</span>
                        <span><i class="fas fa-book"></i> ${cicloActual.total_horas}h totales</span>
                    ` : ''}
                    <span><i class="fas fa-graduation-cap"></i> ${getPorcentajeNota(nivelId)}% de la nota</span>
                </div>
                <div class="modulo-areas">
                    <span class="badge-area">${moduloNombre.split(' ')[0]}</span>
                </div>
            </div>
            <button class="btn btn-primary">
                <i class="fas fa-play-circle"></i> Comenzar
            </button>
        </div>
    `;
}

// Abrir registro de módulo
async function abrirRegistroModulo(moduloKey, nivelId) {
    console.log(`📝 Abriendo registro para: ${moduloKey} en ${nivelId}`);
    
    // Actualizar breadcrumb
    const nombres = {
        'primaria-ciclo-I': 'I Ciclo',
        'primaria-ciclo-II': 'II Ciclo', 
        'secundaria-ciclo-III': 'III Ciclo'
    };
    actualizarBreadcrumb(`${nombres[nivelId] || 'Ciclo'} > ${moduloKey}`);
    
    // 1. Cargar datos del módulo
    let moduloData;
    try {
        const response = await fetch(`./modulos-ft/${moduloKey}.json`);
        moduloData = await response.json();
    } catch (error) {
        moduloData = {
            nombre: moduloKey.charAt(0).toUpperCase() + moduloKey.slice(1),
            descripcion: "Módulo de Formación Tecnológica",
            indicadores: ["Opera herramientas básicas", "Aplica conocimientos prácticos"]
        };
    }
    
    // 2. Mostrar vista de registro
    const contenedor = document.getElementById('contenedorPrincipal');
    contenedor.innerHTML = `
        <div class="registro-modulo">
            <div class="registro-header">
                <button class="btn-volver" onclick="cargarNivel('${nivelId}')">
                    <i class="fas fa-arrow-left"></i> Volver a ${nivelId.includes('I') ? 'I Ciclo' : 
                                                                 nivelId.includes('II') ? 'II Ciclo' : 
                                                                 'III Ciclo'}
                </button>
                <div>
                    <h2><i class="fas fa-clipboard-check"></i> ${moduloData.nombre}</h2>
                    <p>${moduloData.descripcion}</p>
                    <div class="registro-subtitle">
                        <span class="badge badge-mep">Art. 6.1.1 MEP</span>
                        <span class="badge badge-ciclo">${nivelId.includes('I') ? '50% Nota' : 
                                                        nivelId.includes('II') ? '55% Nota' : 
                                                        '60% Nota'}</span>
                    </div>
                </div>
            </div>
            
            <div class="registro-body">
                <div class="registro-info">
                    <i class="fas fa-info-circle"></i>
                    <p>Registro de trabajo cotidiano. Seleccione nivel de logro para cada estudiante.</p>
                </div>
                
                <div class="tabla-registro">
                    <div class="tabla-header">
                        <div class="col-estudiante">Estudiante</div>
                        ${moduloData.indicadores ? moduloData.indicadores.map((ind, idx) => `
                            <div class="col-indicador">
                                <span>${ind}</span>
                                <small>Indicador ${idx + 1}</small>
                            </div>
                        `).join('') : '<div class="col-indicador">Indicadores no definidos</div>'}
                        <div class="col-total">Parcial</div>
                    </div>
                    
                    <div class="tabla-body" id="cuerpoTablaRegistro">
                        ${generarFilasRegistro(moduloData.indicadores || [])}
                    </div>
                </div>
                
                <div class="registro-acciones">
                    <button class="btn btn-secondary" onclick="cargarNivel('${nivelId}')">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button class="btn btn-primary" onclick="guardarRegistroCotidiano('${moduloKey}', '${nivelId}')">
                        <i class="fas fa-save"></i> Guardar Registro MEP
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generar filas de registro
function generarFilasRegistro(indicadores) {
    if (sistemaFT.estudiantes.length === 0) {
        return '<div class="fila-vacia">No hay estudiantes cargados</div>';
    }
    
    return sistemaFT.estudiantes.map(est => {
        // Verificar necesidades especiales
        const tieneNecesidades = est.necesidades && est.necesidades.length > 0;
        const necesidadTexto = tieneNecesidades ? est.necesidades[0] : '';
        
        // Verificar asistencia (color según porcentaje)
        const asistenciaColor = est.asistencia >= 90 ? 'alta' : 
                               est.asistencia >= 75 ? 'media' : 'baja';
        
        // Verificar nota anterior
        const notaAnterior = est.notaPeriodoAnterior || 0;
        const notaColor = notaAnterior >= 70 ? 'alta' : 
                         notaAnterior >= 50 ? 'media' : 'baja';
        
        return `
        <div class="fila-estudiante" data-id="${est.id}">
            <div class="col-estudiante">
                <div class="estudiante-nombre">
                    ${est.nombre || 'Estudiante ' + est.id}
                    ${tieneNecesidades ? '<span class="badge-necesidad">' + necesidadTexto + '</span>' : ''}
                </div>
                <div class="estudiante-info">
                    <div class="estudiante-meta">
                        <span class="meta-item" title="Cédula/ID">
                            <i class="fas fa-id-card"></i> ${est.cedula || est.id}
                        </span>
                        <span class="meta-item" title="Grupo">
                            <i class="fas fa-users"></i> ${est.grupo || 'Sin grupo'}
                        </span>
                    </div>
                    <div class="estudiante-estadisticas">
                        <span class="estadistica-item asistencia-${asistenciaColor}" title="Asistencia">
                            <i class="fas fa-calendar-check"></i> ${est.asistencia || 0}%
                        </span>
                        <span class="estadistica-item nota-${notaColor}" title="Nota periodo anterior">
                            <i class="fas fa-chart-line"></i> ${notaAnterior}
                        </span>
                    </div>
                </div>
            </div>
            
            ${indicadores.map((ind, idx) => `
                <div class="col-indicador">
                    <div class="niveles-logro">
                        <button class="btn-nivel" data-nivel="3" onclick="seleccionarNivel(this, '${est.id}', ${idx})">
                            <i class="fas fa-star"></i> Alto
                        </button>
                        <button class="btn-nivel" data-nivel="2" onclick="seleccionarNivel(this, '${est.id}', ${idx})">
                            <i class="fas fa-star-half-alt"></i> Medio
                        </button>
                        <button class="btn-nivel" data-nivel="1" onclick="seleccionarNivel(this, '${est.id}', ${idx})">
                            <i class="far fa-star"></i> Bajo
                        </button>
                    </div>
                    <div class="indicador-descripcion">
                        <small>${ind}</small>
                    </div>
                </div>
            `).join('')}
            
            <div class="col-total">
                <span class="total-parcial">0%</span>
                <div class="total-etiqueta">
                    <small>Parcial</small>
                </div>
            </div>
        </div>
        `;
    }).join('');
}
    
// Volver al dashboard
function volverDashboard() {
    sistemaFT.nivelActual = null;
    mostrarDashboard();
}

// Configurar navegación
function configurarNavegacion() {
    console.log('🔧 Configurando navegación...');
    
    // Limpiar cualquier contenido duplicado
    const elementosDuplicados = document.querySelectorAll('.header, .system-status-bar, .sidebar, .main-layout, .toolbar');
    elementosDuplicados.forEach(el => {
        if (el && el.parentNode) {
            el.style.display = 'none';
        }
    });
    
    // Asegurar que los elementos nuevos sean visibles
    const elementosNecesarios = document.querySelectorAll('.header-sistema, .breadcrumb-container, .footer-sistema');
    elementosNecesarios.forEach(el => {
        if (el) {
            el.style.display = 'block';
        }
    });
    
    // Actualizar enlaces activos
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Función para seleccionar nivel en el registro
function seleccionarNivel(boton, estudianteId, indicadorIdx) {
    // Remover activo de todos los botones en esta celda
    const contenedor = boton.parentElement;
    contenedor.querySelectorAll('.btn-nivel').forEach(btn => {
        btn.classList.remove('activo');
    });
    
    // Activar el botón clickeado
    boton.classList.add('activo');
    
    // Calcular nuevo parcial
    calcularParcialEstudiante(estudianteId);
    
    console.log(`Registro: Est ${estudianteId}, Indicador ${indicadorIdx}, Nivel ${boton.dataset.nivel}`);
}

// Calcular parcial para un estudiante
function calcularParcialEstudiante(estudianteId) {
    const fila = document.querySelector(`.fila-estudiante[data-id="${estudianteId}"]`);
    if (!fila) return;
    
    // Calcular puntaje total
    let puntajeTotal = 0;
    const botonesNivel = fila.querySelectorAll('.btn-nivel.activo');
    
    botonesNivel.forEach(boton => {
        puntajeTotal += parseInt(boton.dataset.nivel) || 0;
    });
    
    // Máximo posible: 3 puntos por indicador
    const totalIndicadores = fila.querySelectorAll('.col-indicador').length;
    const maximoPosible = totalIndicadores * 3;
    
    const porcentaje = maximoPosible > 0 ? 
        Math.round((puntajeTotal / maximoPosible) * 100) : 0;
    
    // Actualizar visualización
    const totalSpan = fila.querySelector('.total-parcial');
    if (totalSpan) {
        totalSpan.textContent = `${porcentaje}%`;
        totalSpan.className = `total-parcial ${porcentaje >= 70 ? 'alto' : 
                                                porcentaje >= 40 ? 'medio' : 
                                                'bajo'}`;
    }
}

// Guardar registro completo
function guardarRegistroCotidiano(moduloKey, nivelId) {
    const registro = {
        fecha: new Date().toISOString(),
        modulo: moduloKey,
        ciclo: nivelId,
        estudiantes: [],
        articuloMEP: "6.1.1"
    };
    
    // Recolectar datos de cada estudiante
    document.querySelectorAll('.fila-estudiante').forEach(fila => {
        const estudianteId = fila.dataset.id;
        const niveles = [];
        
        fila.querySelectorAll('.col-indicador').forEach((col, idx) => {
            const btnActivo = col.querySelector('.btn-nivel.activo');
            niveles.push({
                indicador: idx + 1,
                nivel: btnActivo ? btnActivo.dataset.nivel : '0',
                texto: btnActivo ? btnActivo.textContent : 'No evaluado'
            });
        });
        
        registro.estudiantes.push({
            id: estudianteId,
            niveles: niveles,
            parcial: fila.querySelector('.total-parcial').textContent
        });
    });
    
    // Guardar en sistema (aquí integrarías con backup-manager.js)
    console.log('📋 Registro MEP guardado:', registro);
    
    // Mostrar confirmación
    alert(`✅ Registro MEP Art. 6.1.1 guardado\n\n• Módulo: ${moduloKey}\n• Ciclo: ${nivelId}\n• Estudiantes: ${registro.estudiantes.length}\n• Fecha: ${new Date().toLocaleString()}`);
    
    // Volver al nivel
    cargarNivel(nivelId);
}

// Funciones de acción
function gestionarEstudiantes() {
    alert('📋 Gestión de Estudiantes\n\n• Agregar nuevos estudiantes\n• Editar información\n• Asignar a grupos');
}

function generarReportes() {
    alert('📄 Generar Reportes\n\n• Boletas de calificaciones\n• Certificados\n• Estadísticas del grupo');
}

function activarAsistenteIA() {
    alert('🤖 Asistente IA activado\n\nPuede ayudar a:\n• Generar rúbricas de evaluación\n• Sugerir actividades de aprendizaje\n• Analizar riesgo de deserción');
}

function calcularNotas() {
    alert('🧮 Calcular Notas\n\nUsando distribución MEP:\n• 40% Trabajos prácticos\n• 30% Proyecto final\n• 20% Evaluaciones escritas\n• 10% Participación');
}

function crearModulo(nivelId) {
    alert(`📝 Crear módulo para: ${nivelId}`);
}

function importarModulos(nivelId) {
    alert(`📁 Importar módulos para: ${nivelId}`);
}

// Hacer funciones disponibles globalmente
window.inicializarSistema = inicializarSistema;
window.mostrarDashboard = mostrarDashboard;
window.volverDashboard = volverDashboard;
window.cargarNivel = cargarNivel;
window.activarAsistenteIA = activarAsistenteIA;
window.gestionarEstudiantes = gestionarEstudiantes;
window.generarReportes = generarReportes;
window.calcularNotas = calcularNotas;
window.abrirRegistroModulo = abrirRegistroModulo;
window.seleccionarNivel = seleccionarNivel;
window.guardarRegistroCotidiano = guardarRegistroCotidiano;
window.crearModuloEjemploHTML = crearModuloEjemploHTML;
window.cargarYMostrarModulosReales = cargarYMostrarModulosReales;
window.determinarCiclo = determinarCiclo;
window.obtenerEstudiantesEjemplo = obtenerEstudiantesEjemplo;
window.actualizarBreadcrumb = actualizarBreadcrumb;
window.limpiarInterfazDuplicada = limpiarInterfazDuplicada;
window.getModuloIcon = getModuloIcon;
window.getPorcentajeNota = getPorcentajeNota;
window.generarFilasRegistro = generarFilasRegistro;
window.calcularParcialEstudiante = calcularParcialEstudiante;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarSistema);

console.log('🔧 Sistema FT-MEP - Dashboard cargado');
