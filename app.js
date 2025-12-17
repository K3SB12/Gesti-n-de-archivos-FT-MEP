// ============================================
// SISTEMA COMPLETO FT-MEP COSTA RICA
// ============================================

// Variables globales del sistema
let sistemaFT = {
    config: {},
    estudiantes: [],
    modulos: {},
    nivelActual: null,
    areaFiltro: null
};

// ============================================
// INICIALIZACIÓN DEL SISTEMA
// ============================================

function inicializarSistema() {
    console.log('🚀 Iniciando Sistema FT-MEP Costa Rica');
    
    // Inicializar componentes
    inicializarInteracciones();
    cargarDatosIniciales();
    configurarNavegacion();
    
    // Mostrar dashboard principal
    mostrarDashboard();
    
    console.log('✅ Sistema FT-MEP inicializado correctamente');
}

// ============================================
// CARGA DE DATOS
// ============================================

async function cargarDatosIniciales() {
    try {
        // Cargar estudiantes
        const responseEstudiantes = await fetch('data/estudiantes.json');
        sistemaFT.estudiantes = await responseEstudiantes.json();
        console.log(`👥 Estudiantes cargados: ${sistemaFT.estudiantes.estudiantes.length}`);
        
        // Cargar ciclos
        const responseCiclos = await fetch('data/ciclos-config.json');
        sistemaFT.ciclos = await responseCiclos.json();
        console.log(`📚 Ciclos cargados: ${sistemaFT.ciclos.ciclos.length}`);
        
        // Cargar indicadores
        const responseIndicadores = await fetch('data/indicadores.json');
        sistemaFT.indicadores = await responseIndicadores.json();
        console.log('📊 Indicadores cargados');
        
        // Actualizar estadísticas
        actualizarEstadisticas();
        
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        mostrarError('Error al cargar datos del sistema');
    }
}

// ============================================
// INTERFAZ PRINCIPAL - DASHBOARD
// ============================================

function mostrarDashboard() {
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    contenedor.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h1><i class="fas fa-laptop-code"></i> Sistema FT-MEP</h1>
                <p class="subtitulo">Gestión Académica para Formación Tecnológica - MEP Costa Rica</p>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-school"></i>
                    </div>
                    <div class="stat-info">
                        <h3>4</h3>
                        <p>Niveles Educativos</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-shapes"></i>
                    </div>
                    <div class="stat-info">
                        <h3>4</h3>
                        <p>Áreas de Conocimiento</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="totalEstudiantes">${sistemaFT.estudiantes?.estudiantes?.length || 0}</h3>
                        <p>Estudiantes</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="totalModulos">0</h3>
                        <p>Módulos</p>
                    </div>
                </div>
            </div>
            
            <div class="niveles-educativos">
                <h2><i class="fas fa-graduation-cap"></i> Niveles Educativos</h2>
                
                <div class="niveles-grid">
                    <div class="nivel-card" onclick="cargarNivel('materno-infantil')">
                        <div class="nivel-icon" style="background: linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%);">
                            <i class="fas fa-baby"></i>
                        </div>
                        <h3>Materno Infantil</h3>
                        <p>Transición y Grupo Interactivo II</p>
                        <div class="nivel-badge">PNFT</div>
                    </div>
                    
                    <div class="nivel-card" onclick="cargarNivel('primaria-ciclo-I')">
                        <div class="nivel-icon" style="background: linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%);">
                            <i class="fas fa-child"></i>
                        </div>
                        <h3>I Ciclo</h3>
                        <p>Primaria 1°-3° grado</p>
                        <div class="nivel-badge">Primaria</div>
                    </div>
                    
                    <div class="nivel-card" onclick="cargarNivel('primaria-ciclo-II')">
                        <div class="nivel-icon" style="background: linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%);">
                            <i class="fas fa-user-graduate"></i>
                        </div>
                        <h3>II Ciclo</h3>
                        <p>Primaria 4°-6° grado</p>
                        <div class="nivel-badge">Primaria</div>
                    </div>
                    
                    <div class="nivel-card" onclick="cargarNivel('secundaria-ciclo-III')">
                        <div class="nivel-icon" style="background: linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%);">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <h3>III Ciclo</h3>
                        <p>Secundaria 7°-9° año</p>
                        <div class="nivel-badge">Secundaria</div>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-actions">
                <h2><i class="fas fa-bolt"></i> Acciones Rápidas</h2>
                
                <div class="actions-grid">
                    <button class="action-btn" onclick="abrirModal('modalNuevoEstudiante')">
                        <i class="fas fa-user-plus"></i>
                        <span>Nuevo Estudiante</span>
                    </button>
                    
                    <button class="action-btn" onclick="generarReporte()">
                        <i class="fas fa-file-pdf"></i>
                        <span>Generar Reporte</span>
                    </button>
                    
                    <button class="action-btn" onclick="activarAsistenteIA()">
                        <i class="fas fa-robot"></i>
                        <span>Asistente IA</span>
                    </button>
                    
                    <button class="action-btn" onclick="crearRespaldo()">
                        <i class="fas fa-save"></i>
                        <span>Crear Respaldo</span>
                    </button>
                    
                    <button class="action-btn" onclick="calcularPromedios()">
                        <i class="fas fa-calculator"></i>
                        <span>Calcular Promedios</span>
                    </button>
                    
                    <button class="action-btn" onclick="importarDatos()">
                        <i class="fas fa-upload"></i>
                        <span>Importar Datos</span>
                    </button>
                </div>
            </div>
            
            <div class="reciente-actividad">
                <h2><i class="fas fa-history"></i> Actividad Reciente</h2>
                
                <div class="actividad-lista">
                    <div class="actividad-item">
                        <i class="fas fa-user-check actividad-icon"></i>
                        <div class="actividad-info">
                            <p>Sistema FT-MEP inicializado correctamente</p>
                            <small>Ahora mismo</small>
                        </div>
                    </div>
                    
                    <div class="actividad-item">
                        <i class="fas fa-database actividad-icon"></i>
                        <div class="actividad-info">
                            <p>${sistemaFT.estudiantes?.estudiantes?.length || 0} estudiantes cargados</p>
                            <small>Hace unos segundos</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// NAVEGACIÓN POR NIVELES
// ============================================

function cargarNivel(nivelId) {
    sistemaFT.nivelActual = nivelId;
    
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    // Mapear IDs a nombres
    const nombresNiveles = {
        'materno-infantil': 'Materno Infantil / Transición',
        'primaria-ciclo-I': 'Primaria - I Ciclo (1°-3°)',
        'primaria-ciclo-II': 'Primaria - II Ciclo (4°-6°)',
        'secundaria-ciclo-III': 'Secundaria - III Ciclo (7°-9°)'
    };
    
    contenedor.innerHTML = `
        <div class="nivel-vista">
            <div class="nivel-header">
                <button class="btn-volver" onclick="volverDashboard()">
                    <i class="fas fa-arrow-left"></i> Volver al Dashboard
                </button>
                <h2><i class="fas fa-folder-open"></i> ${nombresNiveles[nivelId] || nivelId}</h2>
                <div class="nivel-tags">
                    <span class="tag tag-mep">PNFT</span>
                    <span class="tag tag-info">MEP Costa Rica</span>
                </div>
            </div>
            
            <div class="nivel-filtros">
                <div class="filtro-grupo">
                    <label for="filtroArea"><i class="fas fa-filter"></i> Filtrar por área:</label>
                    <select id="filtroArea" onchange="filtrarPorArea(this.value)">
                        <option value="">Todas las áreas</option>
                        <option value="apropiacion">Apropiación tecnológica</option>
                        <option value="programacion">Programación y Algoritmos</option>
                        <option value="computacion">Computación física y Robótica</option>
                        <option value="ciencia">Ciencia de datos e IA</option>
                    </select>
                </div>
                
                <div class="filtro-grupo">
                    <label for="buscarModulo"><i class="fas fa-search"></i> Buscar módulo:</label>
                    <input type="text" id="buscarModulo" placeholder="Escribe para buscar..." 
                           onkeyup="buscarModulos(this.value)">
                </div>
                
                <button class="btn btn-primary" onclick="crearNuevoModulo()">
                    <i class="fas fa-plus"></i> Nuevo Módulo
                </button>
            </div>
            
            <div id="contenedorModulos" class="modulos-contenedor">
                <div class="cargando-modulos">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Cargando módulos de ${nombresNiveles[nivelId]}...</p>
                </div>
            </div>
            
            <div class="nivel-estadisticas">
                <div class="estadistica">
                    <i class="fas fa-book-open"></i>
                    <div>
                        <h4>Módulos Disponibles</h4>
                        <p id="contadorModulos">0</p>
                    </div>
                </div>
                
                <div class="estadistica">
                    <i class="fas fa-list-check"></i>
                    <div>
                        <h4>Indicadores</h4>
                        <p id="contadorIndicadores">0</p>
                    </div>
                </div>
                
                <div class="estadistica">
                    <i class="fas fa-clock"></i>
                    <div>
                        <h4>Horas Totales</h4>
                        <p id="contadorHoras">0</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Cargar módulos del nivel
    cargarModulosNivel(nivelId);
}

async function cargarModulosNivel(nivelId) {
    const contenedor = document.getElementById('contenedorModulos');
    if (!contenedor) return;
    
    try {
        // Mapear nivel a carpeta
        const rutas = {
            'materno-infantil': 'materno-infantil',
            'primaria-ciclo-I': 'primaria/ciclo-I',
            'primaria-ciclo-II': 'primaria/ciclo-II',
            'secundaria-ciclo-III': 'secundaria/ciclo-III'
        };
        
        const rutaBase = rutas[nivelId];
        
        // En un sistema real, aquí cargarías múltiples archivos JSON
        // Por ahora mostramos un ejemplo con módulos predefinidos
        let modulos = [];
        
        // Cargar módulos existentes en la carpeta
        try {
            // Intenta cargar el primer módulo de ejemplo
            if (nivelId === 'primaria-ciclo-I') {
                const response = await fetch(`modulos-ft/${rutaBase}/primer-grado-modulo-1.json`);
                if (response.ok) {
                    const modulo = await response.json();
                    modulos.push(modulo);
                }
            }
        } catch (error) {
            console.log('No se encontraron módulos, usando datos de ejemplo');
        }
        
        // Si no hay módulos, mostrar datos de ejemplo
        if (modulos.length === 0) {
            modulos = obtenerModulosEjemplo(nivelId);
        }
        
        // Mostrar módulos
        mostrarModulos(modulos);
        
        // Actualizar estadísticas
        actualizarEstadisticasNivel(modulos);
        
    } catch (error) {
        console.error('Error cargando módulos:', error);
        contenedor.innerHTML = `
            <div class="error-modulos">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error cargando módulos</h3>
                <p>${error.message}</p>
                <button class="btn btn-secondary" onclick="cargarModulosNivel('${nivelId}')">
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            </div>
        `;
    }
}

function mostrarModulos(modulos) {
    const contenedor = document.getElementById('contenedorModulos');
    if (!contenedor) return;
    
    if (modulos.length === 0) {
        contenedor.innerHTML = `
            <div class="modulos-vacios">
                <i class="fas fa-inbox"></i>
                <h3>No hay módulos disponibles</h3>
                <p>Este nivel aún no tiene módulos cargados.</p>
                <button class="btn btn-primary" onclick="crearNuevoModulo()">
                    <i class="fas fa-plus"></i> Crear Primer Módulo
                </button>
            </div>
        `;
        return;
    }
    
    let html = '<div class="modulos-grid">';
    
    modulos.forEach((modulo, index) => {
        const areas = modulo.areas_conocimiento ? 
            modulo.areas_conocimiento.map(a => a.area).join(', ') : 
            'Sin áreas definidas';
        
        html += `
            <div class="modulo-card" onclick="verDetalleModulo('${modulo.id || index}')">
                <div class="modulo-header">
                    <h3>${modulo.modulo || 'Módulo sin nombre'}</h3>
                    <span class="modulo-grado">${modulo.grado || 'N/A'}</span>
                </div>
                
                <div class="modulo-info">
                    <p><i class="fas fa-calendar"></i> ${modulo.periodo || 'Periodo no definido'}</p>
                    <p><i class="fas fa-clock"></i> ${modulo.horas_semanales || '?'} hrs/semana</p>
                    <p><i class="fas fa-shapes"></i> ${areas}</p>
                </div>
                
                <div class="modulo-desc">
                    <p>${modulo.descripcion || 'Sin descripción disponible'}</p>
                </div>
                
                <div class="modulo-acciones">
                    <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); editarModulo('${modulo.id || index}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); exportarModulo('${modulo.id || index}')">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    contenedor.innerHTML = html;
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function volverDashboard() {
    sistemaFT.nivelActual = null;
    mostrarDashboard();
}

function filtrarPorArea(area) {
    sistemaFT.areaFiltro = area;
    console.log('Filtrando por área:', area);
    // Implementar filtrado real
}

function buscarModulos(termino) {
    console.log('Buscando módulos con término:', termino);
    // Implementar búsqueda real
}

function crearNuevoModulo() {
    const nivel = sistemaFT.nivelActual;
    alert(`Crear nuevo módulo para: ${nivel}\n\nEsta funcionalidad abriría un formulario para crear un nuevo módulo.`);
}

function verDetalleModulo(moduloId) {
    alert(`Ver detalles del módulo: ${moduloId}\n\nEsta funcionalidad mostraría todos los detalles del módulo seleccionado.`);
}

function editarModulo(moduloId) {
    alert(`Editar módulo: ${moduloId}`);
}

function exportarModulo(moduloId) {
    alert(`Exportar módulo: ${moduloId}\n\nEl módulo se descargaría en formato JSON.`);
}

function obtenerModulosEjemplo(nivelId) {
    // Datos de ejemplo para demostración
    const ejemplos = {
        'primaria-ciclo-I': [
            {
                id: 'ejemplo-1',
                modulo: 'Módulo 1 - Introducción a la Tecnología',
                grado: 'Primero',
                periodo: 'I Período',
                descripcion: 'Introducción a conceptos básicos de tecnología y programación inicial.',
                horas_semanales: 3,
                areas_conocimiento: [
                    {
                        area: 'Apropiación tecnológica y Digital',
                        saberes_conceptuales: ['Computadora', 'Hardware', 'Software']
                    }
                ]
            },
            {
                id: 'ejemplo-2',
                modulo: 'Módulo 2 - Creación Digital',
                grado: 'Primero',
                periodo: 'II Período',
                descripcion: 'Creación de contenido multimedia básico y uso de herramientas digitales.',
                horas_semanales: 3,
                areas_conocimiento: [
                    {
                        area: 'Apropiación tecnológica y Digital',
                        saberes_conceptuales: ['Herramientas multimedia', 'Internet básico']
                    },
                    {
                        area: 'Programación y Algoritmos',
                        saberes_conceptuales: ['Algoritmos simples', 'Patrones']
                    }
                ]
            }
        ],
        'primaria-ciclo-II': [
            {
                id: 'ejemplo-3',
                modulo: 'Módulo 1 - Programación por Bloques',
                grado: 'Cuarto',
                periodo: 'I Período',
                descripcion: 'Introducción a la programación por bloques y pensamiento computacional.',
                horas_semanales: 4,
                areas_conocimiento: [
                    {
                        area: 'Programación y Algoritmos',
                        saberes_conceptuales: ['Bloques de programación', 'Variables', 'Eventos']
                    }
                ]
            }
        ],
        'secundaria-ciclo-III': [
            {
                id: 'ejemplo-4',
                modulo: 'Módulo 1 - Ofimática Avanzada',
                grado: 'Séptimo',
                periodo: 'I Período',
                descripcion: 'Uso avanzado de herramientas de ofimática para proyectos escolares.',
                horas_semanales: 5,
                areas_conocimiento: [
                    {
                        area: 'Apropiación tecnológica y Digital',
                        saberes_conceptuales: ['Procesador de texto', 'Hojas de cálculo', 'Presentaciones']
                    }
                ]
            }
        ]
    };
    
    return ejemplos[nivelId] || [];
}

function actualizarEstadisticasNivel(modulos) {
    // Contar módulos
    document.getElementById('contadorModulos').textContent = modulos.length;
    
    // Contar indicadores (aproximado)
    let totalIndicadores = 0;
    let totalHoras = 0;
    
    modulos.forEach(modulo => {
        if (modulo.indicadores_logro) {
            totalIndicadores += modulo.indicadores_logro.length;
        }
        if (modulo.horas_semanales) {
            totalHoras += modulo.horas_semanales * 10; // Aproximación: 10 semanas por período
        }
    });
    
    document.getElementById('contadorIndicadores').textContent = totalIndicadores;
    document.getElementById('contadorHoras').textContent = totalHoras;
}

function actualizarEstadisticas() {
    // Actualizar contador de estudiantes
    const totalEstudiantes = document.getElementById('totalEstudiantes');
    if (totalEstudiantes && sistemaFT.estudiantes?.estudiantes) {
        totalEstudiantes.textContent = sistemaFT.estudiantes.estudiantes.length;
    }
}

// ============================================
// FUNCIONALIDADES DE BOTONES
// ============================================

function inicializarInteracciones() {
    console.log('Inicializando interacciones del sistema');
    
    // Configurar botones globales
    document.addEventListener('click', function(e) {
        // Botones con clase 'btn'
        if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
            const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
            const texto = btn.textContent.trim();
            console.log(`Botón clickeado: "${texto}"`);
            
            // Feedback visual
            btn.style.transform = 'scale(0.98)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        }
    });
}

function configurarNavegacion() {
    // Navegación por hash (para futuras implementaciones)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            console.log('Navegando a:', hash);
        }
    });
}

function generarReporte() {
    alert('Generando reporte del sistema...\n\nEsta funcionalidad generaría un PDF con todos los datos.');
}

function activarAsistenteIA() {
    alert('Activando Asistente IA...\n\nEl asistente puede ayudar a:\n• Generar rúbricas de evaluación\n• Sugerir actividades de aprendizaje\n• Analizar riesgo de deserción\n• Crear instrumentos de evaluación');
}

function crearRespaldo() {
    alert('Creando respaldo del sistema...\n\nLos datos se guardarán en IndexedDB y se podrán exportar.');
}

function calcularPromedios() {
    alert('Calculando promedios...\n\nUsando distribución MEP:\n• 40% Trabajos prácticos\n• 30% Proyecto final\n• 20% Evaluaciones escritas\n• 10% Participación');
}

function importarDatos() {
    alert('Importar datos...\n\nFormatos aceptados:\n• JSON\n• CSV\n• Excel (.xlsx)\n\nLos datos se validarán automáticamente.');
}

function abrirModal(modalId) {
    alert(`Abriendo modal: ${modalId}\n\nEsta funcionalidad mostraría un formulario modal.`);
}

function mostrarError(mensaje) {
    // Crear notificación de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notificacion';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// ============================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema
    inicializarSistema();
    
    // Configurar tooltips básicos
    const botones = document.querySelectorAll('[title]');
    botones.forEach(boton => {
        boton.addEventListener('mouseenter', function() {
            console.log('Tooltip:', this.title);
        });
    });
    
    // Asegurar que las funciones estén disponibles globalmente
    window.sistemaFT = sistemaFT;
    window.cargarNivel = cargarNivel;
    window.volverDashboard = volverDashboard;
    window.filtrarPorArea = filtrarPorArea;
    window.buscarModulos = buscarModulos;
    window.crearNuevoModulo = crearNuevoModulo;
    window.verDetalleModulo = verDetalleModulo;
    window.editarModulo = editarModulo;
    window.exportarModulo = exportarModulo;
    window.generarReporte = generarReporte;
    window.activarAsistenteIA = activarAsistenteIA;
    window.crearRespaldo = crearRespaldo;
    window.calcularPromedios = calcularPromedios;
    window.importarDatos = importarDatos;
    window.abrirModal = abrirModal;
    
    console.log('🌍 Sistema FT-MEP listo para usar');
});
