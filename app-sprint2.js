// ============================================
// SISTEMA FT-MEP - SPRINT 2: EVALUACIÓN COMPLETA
// ============================================

// Variables globales extendidas para Sprint 2
let sistemaFT = {
    estudiantes: [],
    nivelActual: null,
    moduloActual: null,
    areaActual: null,
    periodoActual: 'semana-1',
    
    // Almacenamiento Sprint 1
    calificacionesTC: JSON.parse(localStorage.getItem('ft_calificaciones_tc')) || {},
    
    // Nuevos componentes Sprint 2
    tareas: JSON.parse(localStorage.getItem('ft_tareas')) || {},
    asistencias: JSON.parse(localStorage.getItem('ft_asistencias')) || {},
    pruebasEjecucion: JSON.parse(localStorage.getItem('ft_pruebas_ejecucion')) || {},
    proyectos: JSON.parse(localStorage.getItem('ft_proyectos')) || {},
    comunicaciones: JSON.parse(localStorage.getItem('ft_comunicaciones')) || {},
    
    // Configuración de períodos
    periodos: [
        { id: 'semana-1', nombre: 'Semana 1' },
        { id: 'semana-2', nombre: 'Semana 2' },
        { id: 'semana-3', nombre: 'Semana 3' },
        { id: 'semana-4', nombre: 'Semana 4' },
        { id: 'mes-1', nombre: 'Mes 1' },
        { id: 'mes-2', nombre: 'Mes 2' },
        { id: 'mes-3', nombre: 'Mes 3' },
        { id: 'trimestre-1', nombre: 'I Trimestre' },
        { id: 'trimestre-2', nombre: 'II Trimestre' },
        { id: 'trimestre-3', nombre: 'III Trimestre' }
    ]
};

// ============================================
// 1. INICIALIZACIÓN MEJORADA
// ============================================

async function inicializarSistemaSprint2() {
    console.log('🚀 Sistema FT-MEP Sprint 2 inicializando...');
    await cargarDatosIniciales();
    mostrarDashboardCompleto();
    console.log('✅ Sistema Sprint 2 listo');
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
            asistenciaTotal: est.asistencia || 0,
            notaPeriodoAnterior: est.notaPeriodoAnterior || 0,
            email: est.email || '',
            telefono: est.telefono || '',
            responsable: est.responsable || ''
        }));
        
        console.log(`✅ ${sistemaFT.estudiantes.length} estudiantes cargados`);
        
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        // DATOS DE EMERGENCIA MEJORADOS - CON ESTUDIANTES PARA LOS 3 CICLOS
        sistemaFT.estudiantes = [
            // I CICLO (1°-3°)
            {id: "est-101", nombre: "Sofía Rojas Alfaro", cedula: "701230456", grupo: "1-A", ciclo: "I", email: "sofia@ejemplo.edu.cr"},
            {id: "est-102", nombre: "Diego Vargas Mora", cedula: "702340567", grupo: "2-B", ciclo: "I", email: "diego@ejemplo.edu.cr"},
            {id: "est-103", nombre: "Valeria Castro Solís", cedula: "703450678", grupo: "3-A", ciclo: "I", email: "valeria@ejemplo.edu.cr"},
            
            // II CICLO (4°-6°) - TU GRUPO PRINCIPAL
            {id: "1", nombre: "Aaron Gonzales Mera", cedula: "3068800365", grupo: "4-A", ciclo: "II", email: "aaron@ejemplo.edu.cr"},
            {id: "2", nombre: "María Rodríguez Pérez", cedula: "2087601234", grupo: "4-A", ciclo: "II", email: "maria@ejemplo.edu.cr"},
            {id: "est-201", nombre: "Carlos López García", cedula: "3094506789", grupo: "5-B", ciclo: "II", email: "carlos@ejemplo.edu.cr"},
            {id: "est-202", nombre: "Ana Fernández Jiménez", cedula: "4105607890", grupo: "6-C", ciclo: "II", email: "ana@ejemplo.edu.cr"},
            
            // III CICLO (7°-9°)
            {id: "est-301", nombre: "Pedro Solís Vargas", cedula: "5116708901", grupo: "7-A", ciclo: "III", email: "pedro@ejemplo.edu.cr"},
            {id: "est-302", nombre: "Camila Navarro Ríos", cedula: "6127809012", grupo: "8-B", ciclo: "III", email: "camila@ejemplo.edu.cr"},
            {id: "est-303", nombre: "Javier Méndez Castro", cedula: "7138900123", grupo: "9-C", ciclo: "III", email: "javier@ejemplo.edu.cr"},
            {id: "est-304", nombre: "Gabriela Soto Chaves", cedula: "8149001234", grupo: "7-B", ciclo: "III", email: "gabriela@ejemplo.edu.cr"}
        ];
        console.log('Usando datos de emergencia mejorados:', sistemaFT.estudiantes);
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
// 2. DASHBOARD COMPLETO SPRINT 2
// ============================================

function mostrarDashboardCompleto() {
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    contenedor.innerHTML = `
        <div class="dashboard-completo">
            <!-- Header del Dashboard -->
            <div class="dashboard-header">
                <div>
                    <h2><i class="fas fa-tachometer-alt"></i> Panel de Control FT-MEP</h2>
                    <p>Sistema Integral de Evaluación - MEP Costa Rica</p>
                </div>
                <div class="dashboard-actions">
                    <button class="btn btn-primary" onclick="cargarEvaluacionCompleta()">
                        <i class="fas fa-clipboard-check"></i> Evaluación Completa
                    </button>
                    <button class="btn btn-outline" onclick="cargarReportes()">
                        <i class="fas fa-chart-bar"></i> Reportes
                    </button>
                </div>
            </div>
            
            <!-- Estadísticas Principales -->
            <div class="stats-grid">
                <div class="stat-card main-stat">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-content">
                        <h3>${sistemaFT.estudiantes.length}</h3>
                        <p>Estudiantes Activos</p>
                        <small>${sistemaFT.periodoActual}</small>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-percentage"></i></div>
                    <div class="stat-content">
                        <h3 id="estadisticaAsistencia">0%</h3>
                        <p>Asistencia Promedio</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-content">
                        <h3 id="estadisticaTareas">0</h3>
                        <p>Tareas Entregadas</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-project-diagram"></i></div>
                    <div class="stat-content">
                        <h3 id="estadisticaProyectos">0</h3>
                        <p>Proyectos Activos</p>
                    </div>
                </div>
            </div>
            
            <!-- Módulos de Evaluación -->
            <div class="modulos-evaluacion">
                <h3><i class="fas fa-cogs"></i> Módulos de Evaluación</h3>
                <p class="subtitulo">Componentes reglamentarios según REA MEP</p>
                
                <div class="modulos-grid">
                    <!-- Módulo 1: Trabajo Cotidiano -->
                    <div class="modulo-card" onclick="cargarModuloEvaluacion('tc')">
                        <div class="modulo-icon ${sistemaFT.nivelActual === 'III' ? 'ciclo-iii' : 'ciclo-ii'}">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <div class="modulo-content">
                            <h4>Trabajo Cotidiano</h4>
                            <p class="modulo-porcentaje">
                                ${sistemaFT.nivelActual === 'I' ? '65%' : sistemaFT.nivelActual === 'II' ? '60%' : '50%'}
                                <span class="badge-ciclo">${sistemaFT.nivelActual || 'II'} Ciclo</span>
                            </p>
                            <p class="modulo-desc">Evaluación formativa por indicadores</p>
                            <div class="modulo-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${calcularProgresoModulo('tc')}%"></div>
                                </div>
                                <span>${calcularProgresoModulo('tc')}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Módulo 2: Tareas -->
                    <div class="modulo-card" onclick="cargarModuloEvaluacion('tareas')">
                        <div class="modulo-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <div class="modulo-content">
                            <h4>Tareas</h4>
                            <p class="modulo-porcentaje">10% <span class="badge-ciclo">Todos</span></p>
                            <p class="modulo-desc">Actividades fuera del aula</p>
                            <div class="modulo-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${calcularProgresoModulo('tareas')}%"></div>
                                </div>
                                <span>${calcularProgresoModulo('tareas')}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Módulo 3: Asistencia -->
                    <div class="modulo-card" onclick="cargarModuloEvaluacion('asistencia')">
                        <div class="modulo-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="modulo-content">
                            <h4>Asistencia</h4>
                            <p class="modulo-porcentaje">10% <span class="badge-ciclo">Todos</span></p>
                            <p class="modulo-desc">Registro de participación</p>
                            <div class="modulo-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${calcularProgresoModulo('asistencia')}%"></div>
                                </div>
                                <span>${calcularProgresoModulo('asistencia')}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Módulo 4: Prueba/Proyecto -->
                    <div class="modulo-card" onclick="cargarModuloEvaluacion('prueba-proyecto')">
                        <div class="modulo-icon ${sistemaFT.nivelActual === 'III' ? 'proyecto' : 'prueba'}">
                            <i class="${sistemaFT.nivelActual === 'III' ? 'fas fa-project-diagram' : 'fas fa-file-signature'}"></i>
                        </div>
                        <div class="modulo-content">
                            <h4>${sistemaFT.nivelActual === 'III' ? 'Proyecto' : 'Prueba Ejecución'}</h4>
                            <p class="modulo-porcentaje">
                                ${sistemaFT.nivelActual === 'III' ? '30%' : sistemaFT.nivelActual === 'II' ? '20%' : '15%'}
                                <span class="badge-ciclo">${sistemaFT.nivelActual || 'II'} Ciclo</span>
                            </p>
                            <p class="modulo-desc">${sistemaFT.nivelActual === 'III' ? 'Design Thinking' : 'Evaluación práctica'}</p>
                            <div class="modulo-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${calcularProgresoModulo('prueba-proyecto')}%"></div>
                                </div>
                                <span>${calcularProgresoModulo('prueba-proyecto')}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Módulo 5: Comunicaciones -->
                    <div class="modulo-card" onclick="cargarModuloEvaluacion('comunicaciones')">
                        <div class="modulo-icon">
                            <i class="fas fa-comments"></i>
                        </div>
                        <div class="modulo-content">
                            <h4>Comunicaciones</h4>
                            <p class="modulo-porcentaje">Registro</p>
                            <p class="modulo-desc">Bitácora docente y contacto</p>
                            <div class="modulo-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${calcularProgresoModulo('comunicaciones')}%"></div>
                                </div>
                                <span>${calcularProgresoModulo('comunicaciones')}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Módulo 6: Nota Final -->
                    <div class="modulo-card final" onclick="calcularNotaFinal()">
                        <div class="modulo-icon">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <div class="modulo-content">
                            <h4>Nota Final</h4>
                            <p class="modulo-porcentaje">Cálculo</p>
                            <p class="modulo-desc">Integración de componentes</p>
                            <button class="btn btn-primary btn-sm">
                                <i class="fas fa-calculator"></i> Calcular
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Ciclos Educativos -->
            <div class="seccion-ciclos">
                <h3><i class="fas fa-graduation-cap"></i> Seleccionar Ciclo</h3>
                <div class="ciclos-grid">
                    <div class="ciclo-card" onclick="seleccionarCiclo('I')">
                        <div class="ciclo-header ciclo-i">
                            <i class="fas fa-child"></i>
                            <h4>I Ciclo</h4>
                        </div>
                        <div class="ciclo-body">
                            <p>1°-3° Primaria</p>
                            <ul class="ciclo-componentes">
                                <li><strong>65%</strong> Trabajo Cotidiano</li>
                                <li><strong>10%</strong> Tareas</li>
                                <li><strong>15%</strong> Prueba Ejecución</li>
                                <li><strong>10%</strong> Asistencia</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="ciclo-card active" onclick="seleccionarCiclo('II')">
                        <div class="ciclo-header ciclo-ii">
                            <i class="fas fa-user-graduate"></i>
                            <h4>II Ciclo</h4>
                        </div>
                        <div class="ciclo-body">
                            <p>4°-6° Primaria</p>
                            <ul class="ciclo-componentes">
                                <li><strong>60%</strong> Trabajo Cotidiano</li>
                                <li><strong>10%</strong> Tareas</li>
                                <li><strong>20%</strong> Prueba Ejecución</li>
                                <li><strong>10%</strong> Asistencia</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="ciclo-card" onclick="seleccionarCiclo('III')">
                        <div class="ciclo-header ciclo-iii">
                            <i class="fas fa-graduation-cap"></i>
                            <h4>III Ciclo</h4>
                        </div>
                        <div class="ciclo-body">
                            <p>7°-9° Secundaria</p>
                            <ul class="ciclo-componentes">
                                <li><strong>50%</strong> Trabajo Cotidiano</li>
                                <li><strong>10%</strong> Tareas</li>
                                <li><strong>30%</strong> Proyecto</li>
                                <li><strong>10%</strong> Asistencia</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Período Actual -->
            <div class="periodo-actual">
                <div class="periodo-header">
                    <h4><i class="fas fa-calendar-alt"></i> Período de Evaluación</h4>
                    <select id="selectPeriodoGlobal" onchange="cambiarPeriodoGlobal(this.value)">
                        ${sistemaFT.periodos.map(p => 
                            `<option value="${p.id}" ${p.id === sistemaFT.periodoActual ? 'selected' : ''}>${p.nombre}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="periodo-info">
                    <p><i class="fas fa-info-circle"></i> Todos los módulos usarán este período para evaluar</p>
                </div>
            </div>
        </div>
    `;
    
    actualizarEstadisticasDashboard();
}

function calcularProgresoModulo(modulo) {
    // Calcular porcentaje de completitud para cada módulo
    const totalEstudiantes = sistemaFT.estudiantes.length;
    if (totalEstudiantes === 0) return 0;
    
    let calificados = 0;
    
    switch(modulo) {
        case 'tc':
            if (sistemaFT.calificacionesTC[sistemaFT.periodoActual]) {
                Object.values(sistemaFT.calificacionesTC[sistemaFT.periodoActual]).forEach(est => {
                    if (Object.keys(est).length > 0) calificados++;
                });
            }
            break;
            
        case 'tareas':
            if (sistemaFT.tareas[sistemaFT.periodoActual]) {
                Object.values(sistemaFT.tareas[sistemaFT.periodoActual]).forEach(tarea => {
                    if (tarea.entregada) calificados++;
                });
            }
            break;
            
        case 'asistencia':
            if (sistemaFT.asistencias[sistemaFT.periodoActual]) {
                calificados = Object.keys(sistemaFT.asistencias[sistemaFT.periodoActual]).length;
            }
            break;
            
        case 'prueba-proyecto':
            if (sistemaFT.nivelActual === 'III') {
                if (sistemaFT.proyectos[sistemaFT.periodoActual]) {
                    calificados = Object.keys(sistemaFT.proyectos[sistemaFT.periodoActual]).length;
                }
            } else {
                if (sistemaFT.pruebasEjecucion[sistemaFT.periodoActual]) {
                    calificados = Object.keys(sistemaFT.pruebasEjecucion[sistemaFT.periodoActual]).length;
                }
            }
            break;
            
        case 'comunicaciones':
            if (sistemaFT.comunicaciones[sistemaFT.periodoActual]) {
                calificados = Object.keys(sistemaFT.comunicaciones[sistemaFT.periodoActual]).length;
            }
            break;
    }
    
    return Math.round((calificados / totalEstudiantes) * 100);
}

function actualizarEstadisticasDashboard() {
    // Actualizar estadísticas dinámicas
    const asistenciaPromedio = calcularAsistenciaPromedio();
    document.getElementById('estadisticaAsistencia').textContent = `${asistenciaPromedio}%`;
    
    const tareasEntregadas = contarTareasEntregadas();
    document.getElementById('estadisticaTareas').textContent = tareasEntregadas;
    
    const proyectosActivos = contarProyectosActivos();
    document.getElementById('estadisticaProyectos').textContent = proyectosActivos;
}

// ============================================
// 3. SISTEMA DE CARGAR MÓDULOS
// ============================================

function cargarModuloEvaluacion(modulo) {
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    switch(modulo) {
        case 'tc':
            cargarSelectorAreaTrabajoCotidiano();
            break;
        case 'tareas':
            cargarModuloTareas();
            break;
        case 'asistencia':
            cargarModuloAsistencia();
            break;
        case 'prueba-proyecto':
            if (sistemaFT.nivelActual === 'III') {
                cargarModuloProyecto();
            } else {
                cargarModuloPruebaEjecucion();
            }
            break;
        case 'comunicaciones':
            cargarModuloComunicaciones();
            break;
        default:
            contenedor.innerHTML = '<div class="error">Módulo no disponible</div>';
    }
}

function cargarSelectorAreaTrabajoCotidiano() {
    const contenedor = document.getElementById('contenedorPrincipal');
    const gradoDefault = sistemaFT.nivelActual === 'I' ? '1' : sistemaFT.nivelActual === 'II' ? '4' : '7';
    
    contenedor.innerHTML = `
        <div class="selector-modulo">
            <div class="selector-header">
                <button class="btn-volver" onclick="mostrarDashboardCompleto()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <h2><i class="fas fa-clipboard-list"></i> Trabajo Cotidiano</h2>
                <p>${calcularPorcentajeComponente('tc')}% - Evaluación formativa por indicadores</p>
            </div>
            
            <div class="selector-instructions">
                <div class="instruction-card">
                    <i class="fas fa-info-circle"></i>
                    <p><strong>Evaluación por criterios:</strong> Alto(3) - Medio(2) - Bajo(1)</p>
                </div>
            </div>
            
            <div class="areas-grid">
                <div class="area-card" onclick="cargarAreaEvaluacion('apropiacion')">
                    <div class="area-icon"><i class="fas fa-laptop"></i></div>
                    <h3>Apropiación tecnológica</h3>
                    <p>Evaluar indicadores de uso y creatividad digital</p>
                    <div class="area-progress">
                        <span>${calcularProgresoArea('apropiacion')}% evaluado</span>
                    </div>
                </div>
                
                <div class="area-card" onclick="cargarAreaEvaluacion('programacion')">
                    <div class="area-icon"><i class="fas fa-code"></i></div>
                    <h3>Programación</h3>
                    <p>Evaluar pensamiento computacional</p>
                    <div class="area-progress">
                        <span>${calcularProgresoArea('programacion')}% evaluado</span>
                    </div>
                </div>
                
                <div class="area-card" onclick="cargarAreaEvaluacion('computacion')">
                    <div class="area-icon"><i class="fas fa-robot"></i></div>
                    <h3>Computación física</h3>
                    <p>Evaluar robótica y automatización</p>
                    <div class="area-progress">
                        <span>${calcularProgresoArea('computacion')}% evaluado</span>
                    </div>
                </div>
                
                <div class="area-card" onclick="cargarAreaEvaluacion('ciencia')">
                    <div class="area-icon"><i class="fas fa-brain"></i></div>
                    <h3>Ciencia de datos</h3>
                    <p>Evaluar análisis e IA</p>
                    <div class="area-progress">
                        <span>${calcularProgresoArea('ciencia')}% evaluado</span>
                    </div>
                </div>
            </div>
            
            <div class="selector-footer">
                <button class="btn btn-primary" onclick="calcularPromedioTrabajoCotidiano()">
                    <i class="fas fa-calculator"></i> Calcular Promedio TC
                </button>
                <button class="btn btn-outline" onclick="exportarCalificacionesTC()">
                    <i class="fas fa-file-export"></i> Exportar TC
                </button>
            </div>
        </div>
    `;
}

function calcularProgresoArea(area) {
    // Implementar cálculo real basado en datos
    return Math.floor(Math.random() * 100); // Temporal
}

// ============================================
// 4. MÓDULO DE TAREAS (10%)
// ============================================

function cargarModuloTareas() {
    const contenedor = document.getElementById('contenedorPrincipal');
    const periodo = sistemaFT.periodoActual;
    
    contenedor.innerHTML = `
        <div class="modulo-tareas">
            <div class="modulo-header">
                <button class="btn-volver" onclick="mostrarDashboardCompleto()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <div>
                    <h2><i class="fas fa-tasks"></i> Tareas</h2>
                    <p class="modulo-subtitulo">10% de la nota final - Período: ${periodo}</p>
                </div>
                <div class="modulo-actions">
                    <button class="btn btn-primary" onclick="crearNuevaTarea()">
                        <i class="fas fa-plus"></i> Nueva Tarea
                    </button>
                </div>
            </div>
            
            <div class="tareas-container">
                <div class="tareas-sidebar">
                    <h3><i class="fas fa-list"></i> Lista de Tareas</h3>
                    <div class="tareas-lista" id="listaTareas">
                        <!-- Tareas se cargarán aquí -->
                    </div>
                    <button class="btn btn-outline btn-block" onclick="crearNuevaTarea()">
                        <i class="fas fa-plus"></i> Agregar Tarea
                    </button>
                </div>
                
                <div class="tareas-main">
                    <div class="tareas-controls">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="buscarEstudianteTareas" placeholder="Buscar estudiante..." onkeyup="filtrarEstudiantesTareas()">
                        </div>
                        <div class="tareas-stats">
                            <span><i class="fas fa-check-circle"></i> <span id="contadorEntregadas">0</span> entregadas</span>
                            <span><i class="fas fa-clock"></i> <span id="contadorPendientes">0</span> pendientes</span>
                        </div>
                    </div>
                    
                    <div class="tareas-table-container">
                        <table class="tareas-table" id="tablaTareas">
                            <thead>
                                <tr>
                                    <th class="col-estudiante">Estudiante</th>
                                    <th class="col-grupo">Grupo</th>
                                    <th class="col-estado">Estado</th>
                                    <th class="col-calificacion">Calificación</th>
                                    <th class="col-porcentaje">10%</th>
                                    <th class="col-acciones">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="cuerpoTablaTareas">
                                <!-- Filas se generarán dinámicamente -->
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="tareas-summary">
                        <h4><i class="fas fa-chart-pie"></i> Resumen de Tareas</h4>
                        <div class="summary-stats">
                            <div class="stat-item">
                                <span class="stat-label">Promedio Grupo:</span>
                                <span class="stat-value" id="promedioTareasGrupo">0.0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Aporte Nota:</span>
                                <span class="stat-value" id="aporteTareasGrupo">0.0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Entregas a Tiempo:</span>
                                <span class="stat-value" id="entregasTiempo">0%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cargarListaTareas();
    generarTablaTareas();
}

function cargarListaTareas() {
    const container = document.getElementById('listaTareas');
    if (!container) return;
    
    // Tareas de ejemplo
    const tareasEjemplo = [
        { id: 'tarea-1', nombre: 'Investigación sobre IA', fecha: '2024-03-15', tipo: 'Investigación' },
        { id: 'tarea-2', nombre: 'Programa en Scratch', fecha: '2024-03-20', tipo: 'Práctica' },
        { id: 'tarea-3', nombre: 'Presentación digital', fecha: '2024-03-25', tipo: 'Proyecto' },
        { id: 'tarea-4', nombre: 'Análisis de datos', fecha: '2024-03-30', tipo: 'Análisis' }
    ];
    
    container.innerHTML = tareasEjemplo.map(tarea => `
        <div class="tarea-item ${tarea.id === 'tarea-1' ? 'active' : ''}" onclick="seleccionarTarea('${tarea.id}')">
            <div class="tarea-icon">
                <i class="fas fa-${tarea.tipo === 'Investigación' ? 'search' : tarea.tipo === 'Práctica' ? 'code' : 'file-alt'}"></i>
            </div>
            <div class="tarea-info">
                <h4>${tarea.nombre}</h4>
                <small>${tarea.fecha} • ${tarea.tipo}</small>
            </div>
            <div class="tarea-badge">78%</div>
        </div>
    `).join('');
}

function generarTablaTareas() {
    const tbody = document.getElementById('cuerpoTablaTareas');
    if (!tbody) return;
    
    const tareaId = 'tarea-1'; // Tarea seleccionada por defecto
    const periodo = sistemaFT.periodoActual;
    
    let html = '';
    let totalCalificacion = 0;
    let totalEntregadas = 0;
    let totalEstudiantes = 0;
    
    sistemaFT.estudiantes.forEach(estudiante => {
        // Obtener calificación existente o generar una aleatoria para demo
        let calificacion = 0;
        let entregada = false;
        let estado = 'Pendiente';
        let estadoClass = 'pendiente';
        
        if (sistemaFT.tareas[periodo] && sistemaFT.tareas[periodo][estudiante.id]) {
            const tareaEst = sistemaFT.tareas[periodo][estudiante.id][tareaId];
            if (tareaEst) {
                calificacion = tareaEst.calificacion || 0;
                entregada = tareaEst.entregada || false;
                estado = entregada ? 'Entregada' : 'Pendiente';
                estadoClass = entregada ? 'entregada' : 'pendiente';
            }
        } else {
            // Datos de demostración
            const rand = Math.random();
            entregada = rand > 0.3;
            calificacion = entregada ? Math.floor(rand * 100) : 0;
            estado = entregada ? 'Entregada' : 'Pendiente';
            estadoClass = entregada ? 'entregada' : 'pendiente';
        }
        
        if (entregada) {
            totalCalificacion += calificacion;
            totalEntregadas++;
        }
        totalEstudiantes++;
        
        const aporte = (calificacion * 10 / 100).toFixed(1);
        
        html += `
            <tr data-estudiante="${estudiante.id}" data-tarea="${tareaId}">
                <td class="col-estudiante">
                    <div class="estudiante-info">
                        <strong>${estudiante.nombre}</strong>
                        <small>${estudiante.cedula}</small>
                    </div>
                </td>
                <td class="col-grupo">${estudiante.grupo}</td>
                <td class="col-estado">
                    <span class="badge-estado ${estadoClass}">${estado}</span>
                </td>
                <td class="col-calificacion">
                    <input type="number" 
                           min="0" 
                           max="100" 
                           value="${calificacion}"
                           onchange="actualizarCalificacionTarea('${estudiante.id}', '${tareaId}', this.value)"
                           ${!entregada ? 'disabled' : ''}>
                    <small>/100</small>
                </td>
                <td class="col-porcentaje">${aporte}</td>
                <td class="col-acciones">
                    <button class="btn-icon ${entregada ? 'btn-success' : 'btn-outline'}" 
                            onclick="cambiarEstadoTarea('${estudiante.id}', '${tareaId}', ${!entregada})">
                        <i class="fas fa-${entregada ? 'check' : 'times'}"></i>
                    </button>
                    <button class="btn-icon" onclick="verDetalleTarea('${estudiante.id}', '${tareaId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Actualizar estadísticas
    const promedio = totalEntregadas > 0 ? (totalCalificacion / totalEntregadas).toFixed(1) : 0;
    const aporteGrupo = (promedio * 10 / 100).toFixed(1);
    const entregasTiempo = totalEstudiantes > 0 ? Math.round((totalEntregadas / totalEstudiantes) * 100) : 0;
    
    document.getElementById('contadorEntregadas').textContent = totalEntregadas;
    document.getElementById('contadorPendientes').textContent = totalEstudiantes - totalEntregadas;
    document.getElementById('promedioTareasGrupo').textContent = promedio;
    document.getElementById('aporteTareasGrupo').textContent = aporteGrupo;
    document.getElementById('entregasTiempo').textContent = `${entregasTiempo}%`;
}

function actualizarCalificacionTarea(estudianteId, tareaId, calificacion) {
    const periodo = sistemaFT.periodoActual;
    const valor = parseInt(calificacion) || 0;
    
    if (!sistemaFT.tareas[periodo]) sistemaFT.tareas[periodo] = {};
    if (!sistemaFT.tareas[periodo][estudianteId]) sistemaFT.tareas[periodo][estudianteId] = {};
    
    sistemaFT.tareas[periodo][estudianteId][tareaId] = {
        ...sistemaFT.tareas[periodo][estudianteId][tareaId],
        calificacion: valor,
        entregada: true,
        fechaCalificacion: new Date().toISOString()
    };
    
    localStorage.setItem('ft_tareas', JSON.stringify(sistemaFT.tareas));
    mostrarNotificacion('✅ Calificación de tarea actualizada', 'success');
    recalcularEstadisticasTareas();
}

function cambiarEstadoTarea(estudianteId, tareaId, entregada) {
    const periodo = sistemaFT.periodoActual;
    
    if (!sistemaFT.tareas[periodo]) sistemaFT.tareas[periodo] = {};
    if (!sistemaFT.tareas[periodo][estudianteId]) sistemaFT.tareas[periodo][estudianteId] = {};
    
    sistemaFT.tareas[periodo][estudianteId][tareaId] = {
        ...sistemaFT.tareas[periodo][estudianteId][tareaId],
        entregada: entregada,
        fechaEntrega: entregada ? new Date().toISOString() : null,
        calificacion: entregada ? (sistemaFT.tareas[periodo][estudianteId][tareaId]?.calificacion || 0) : 0
    };
    
    localStorage.setItem('ft_tareas', JSON.stringify(sistemaFT.tareas));
    
    const estado = entregada ? 'entregada' : 'pendiente';
    mostrarNotificacion(`✅ Tarea marcada como ${estado}`, 'success');
    
    // Regenerar la tabla
    setTimeout(() => generarTablaTareas(), 100);
}

function recalcularEstadisticasTareas() {
    // Implementar recálculo
    console.log('Recalculando estadísticas de tareas...');
}

// ============================================
// 5. MÓDULO DE ASISTENCIA (10%)
// ============================================

function cargarModuloAsistencia() {
    const contenedor = document.getElementById('contenedorPrincipal');
    const periodo = sistemaFT.periodoActual;
    
    contenedor.innerHTML = `
        <div class="modulo-asistencia">
            <div class="modulo-header">
                <button class="btn-volver" onclick="mostrarDashboardCompleto()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <div>
                    <h2><i class="fas fa-calendar-check"></i> Asistencia</h2>
                    <p class="modulo-subtitulo">10% de la nota final - Período: ${periodo}</p>
                </div>
                <div class="modulo-actions">
                    <button class="btn btn-primary" onclick="tomarAsistenciaRapida()">
                        <i class="fas fa-user-check"></i> Tomar Asistencia
                    </button>
                    <button class="btn btn-outline" onclick="generarReporteAsistencia()">
                        <i class="fas fa-file-pdf"></i> Reporte
                    </button>
                </div>
            </div>
            
            <div class="asistencia-controls">
                <div class="control-group">
                    <label for="fechaAsistencia"><i class="fas fa-calendar-day"></i> Fecha:</label>
                    <input type="date" id="fechaAsistencia" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="control-group">
                    <label for="tipoClase"><i class="fas fa-chalkboard-teacher"></i> Tipo:</label>
                    <select id="tipoClase">
                        <option value="presencial">Presencial</option>
                        <option value="virtual">Virtual</option>
                        <option value="hibrida">Híbrida</option>
                    </select>
                </div>
                <button class="btn btn-success" onclick="guardarAsistencia()">
                    <i class="fas fa-save"></i> Guardar
                </button>
            </div>
            
            <div class="asistencia-table-container">
                <table class="asistencia-table">
                    <thead>
                        <tr>
                            <th class="col-estudiante">Estudiante</th>
                            <th class="col-grupo">Grupo</th>
                            <th class="col-asistencia">Asistencia</th>
                            <th class="col-justificacion">Justificación</th>
                            <th class="col-porcentaje">% Asistencia</th>
                            <th class="col-aporte">10% Aporte</th>
                        </tr>
                    </thead>
                    <tbody id="cuerpoAsistencia">
                        <!-- Filas generadas dinámicamente -->
                    </tbody>
                </table>
            </div>
            
            <div class="asistencia-summary">
                <div class="summary-card">
                    <h4><i class="fas fa-chart-line"></i> Estadísticas</h4>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span class="summary-label">Asistencia Total:</span>
                            <span class="summary-value" id="asistenciaTotal">0%</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Ausencias:</span>
                            <span class="summary-value" id="totalAusencias">0</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Justificadas:</span>
                            <span class="summary-value" id="totalJustificadas">0</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Aporte Nota:</span>
                            <span class="summary-value" id="aporteAsistencia">0.0</span>
                        </div>
                    </div>
                </div>
                
                <div class="summary-card">
                    <h4><i class="fas fa-user-friends"></i> Por Grupo</h4>
                    <div class="grupo-stats" id="estadisticasGrupo">
                        <!-- Estadísticas por grupo -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    generarTablaAsistencia();
}

function generarTablaAsistencia() {
    const tbody = document.getElementById('cuerpoAsistencia');
    if (!tbody) return;
    
    const fecha = document.getElementById('fechaAsistencia')?.value || new Date().toISOString().split('T')[0];
    const periodo = sistemaFT.periodoActual;
    
    let html = '';
    let totalAsistencias = 0;
    let totalEstudiantes = 0;
    let totalAusencias = 0;
    let totalJustificadas = 0;
    
    // Agrupar estudiantes por grupo
    const estudiantesPorGrupo = {};
    sistemaFT.estudiantes.forEach(est => {
        if (!estudiantesPorGrupo[est.grupo]) {
            estudiantesPorGrupo[est.grupo] = [];
        }
        estudiantesPorGrupo[est.grupo].push(est);
    });
    
    // Generar filas por grupo
    Object.keys(estudiantesPorGrupo).forEach(grupo => {
        // Header del grupo
        html += `
            <tr class="grupo-header">
                <td colspan="6">
                    <strong><i class="fas fa-users"></i> Grupo ${grupo}</strong>
                    <span class="grupo-count">${estudiantesPorGrupo[grupo].length} estudiantes</span>
                </td>
            </tr>
        `;
        
        // Estudiantes del grupo
        estudiantesPorGrupo[grupo].forEach(estudiante => {
            totalEstudiantes++;
            
            // Obtener asistencia existente para esta fecha específica
            let asistio = true;
            let justificacion = '';
            
            if (sistemaFT.asistencias[periodo] && 
                sistemaFT.asistencias[periodo][estudiante.id] &&
                sistemaFT.asistencias[periodo][estudiante.id][fecha]) {
                
                const asistenciaDia = sistemaFT.asistencias[periodo][estudiante.id][fecha];
                asistio = asistenciaDia.asistio !== false;
                justificacion = asistenciaDia.justificacion || '';
                
                if (!asistio) {
                    totalAusencias++;
                    if (justificacion) totalJustificadas++;
                } else {
                    totalAsistencias++;
                }
            } else {
                // Si no hay registro, considerar presente por defecto
                totalAsistencias++;
            }
            
            // Calcular porcentaje de asistencia histórico
            let porcentajeAsistencia = calcularPorcentajeAsistenciaHistorico(estudiante.id);
            let aporteAsistencia = (porcentajeAsistencia * 10 / 100).toFixed(1);
            
            html += `
                <tr data-estudiante="${estudiante.id}" data-grupo="${grupo}" data-fecha="${fecha}">
                    <td class="col-estudiante">
                        <div class="estudiante-info">
                            <strong>${estudiante.nombre}</strong>
                            <small>${estudiante.cedula}</small>
                        </div>
                    </td>
                    <td class="col-grupo">${grupo}</td>
                    <td class="col-asistencia">
                        <div class="asistencia-toggle">
                            <button class="btn-toggle ${asistio ? 'active' : ''}" 
                                    onclick="cambiarAsistencia('${estudiante.id}', '${fecha}', ${!asistio})">
                                <i class="fas fa-${asistio ? 'check' : 'times'}"></i>
                                ${asistio ? 'Presente' : 'Ausente'}
                            </button>
                        </div>
                    </td>
                    <td class="col-justificacion">
                        <div class="justificacion-container">
                            <input type="text" 
                                   class="justificacion-input"
                                   value="${justificacion}"
                                   placeholder="${asistio ? 'No aplica' : 'Motivo ausencia...'}"
                                   onchange="actualizarJustificacion('${estudiante.id}', '${fecha}', this.value)"
                                   ${asistio ? 'disabled' : ''}>
                            <button class="btn-justificacion" onclick="mostrarOpcionesJustificacion('${estudiante.id}', '${fecha}')" ${asistio ? 'disabled' : ''}>
                                <i class="fas fa-ellipsis-h"></i>
                            </button>
                        </div>
                    </td>
                    <td class="col-porcentaje">
                        <span class="porcentaje-badge ${porcentajeAsistencia >= 90 ? 'alto' : porcentajeAsistencia >= 70 ? 'medio' : 'bajo'}" 
                              title="Asistencia histórica en el período">
                            ${porcentajeAsistencia}%
                        </span>
                    </td>
                    <td class="col-aporte">${aporteAsistencia}</td>
                </tr>
            `;
        });
    });
    
    tbody.innerHTML = html;
    
    // Calcular estadísticas
    const porcentajeAsistenciaTotal = totalEstudiantes > 0 ? Math.round((totalAsistencias / totalEstudiantes) * 100) : 0;
    const aportePromedio = (porcentajeAsistenciaTotal * 10 / 100).toFixed(1);
    
    document.getElementById('asistenciaTotal').textContent = `${porcentajeAsistenciaTotal}%`;
    document.getElementById('totalAusencias').textContent = totalAusencias;
    document.getElementById('totalJustificadas').textContent = totalJustificadas;
    document.getElementById('aporteAsistencia').textContent = aportePromedio;
    
    // Generar estadísticas por grupo
    const grupoStats = document.getElementById('estadisticasGrupo');
    if (grupoStats) {
        let gruposHTML = '';
        Object.keys(estudiantesPorGrupo).forEach(grupo => {
            const estudiantesGrupo = estudiantesPorGrupo[grupo];
            const asistenciasGrupo = estudiantesGrupo.filter(est => {
                if (sistemaFT.asistencias[periodo] && 
                    sistemaFT.asistencias[periodo][est.id] &&
                    sistemaFT.asistencias[periodo][est.id][fecha]) {
                    return sistemaFT.asistencias[periodo][est.id][fecha].asistio !== false;
                }
                return true; // Por defecto presente
            }).length;
            
            const porcentajeGrupo = estudiantesGrupo.length > 0 ? 
                Math.round((asistenciasGrupo / estudiantesGrupo.length) * 100) : 0;
            
            gruposHTML += `
                <div class="grupo-stat-item">
                    <span class="grupo-name">${grupo}</span>
                    <div class="grupo-details">
                        <span class="grupo-asistencia">${asistenciasGrupo}/${estudiantesGrupo.length}</span>
                        <span class="grupo-porcentaje ${porcentajeGrupo >= 90 ? 'alto' : porcentajeGrupo >= 70 ? 'medio' : 'bajo'}">
                            ${porcentajeGrupo}%
                        </span>
                    </div>
                </div>
            `;
        });
        grupoStats.innerHTML = gruposHTML;
    }
    
    // Actualizar fecha en el título
    const fechaObj = new Date(fecha);
    const fechaFormateada = fechaObj.toLocaleDateString('es-CR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.querySelector('.modulo-subtitulo').innerHTML = 
        `10% de la nota final - <strong>${fechaFormateada}</strong>`;
}

// Nueva función para calcular porcentaje histórico
function calcularPorcentajeAsistenciaHistorico(estudianteId) {
    const periodo = sistemaFT.periodoActual;
    if (!sistemaFT.asistencias[periodo] || !sistemaFT.asistencias[periodo][estudianteId]) {
        return 100; // Si no hay registros, 100% por defecto
    }
    
    const registros = sistemaFT.asistencias[periodo][estudianteId];
    const dias = Object.keys(registros);
    
    if (dias.length === 0) return 100;
    
    const presentes = dias.filter(dia => registros[dia].asistio !== false).length;
    return Math.round((presentes / dias.length) * 100);
}

// Función mejorada para cambiar asistencia
function cambiarAsistencia(estudianteId, fecha, asistio) {
    const periodo = sistemaFT.periodoActual;
    
    if (!sistemaFT.asistencias[periodo]) sistemaFT.asistencias[periodo] = {};
    if (!sistemaFT.asistencias[periodo][estudianteId]) sistemaFT.asistencias[periodo][estudianteId] = {};
    
    sistemaFT.asistencias[periodo][estudianteId][fecha] = {
        asistio: asistio,
        fecha: fecha,
        horaRegistro: new Date().toLocaleTimeString('es-CR'),
        justificacion: asistio ? '' : (sistemaFT.asistencias[periodo][estudianteId][fecha]?.justificacion || '')
    };
    
    localStorage.setItem('ft_asistencias', JSON.stringify(sistemaFT.asistencias));
    
    mostrarNotificacion(
        `✅ ${asistio ? 'Asistencia registrada' : 'Ausencia registrada'} para ${obtenerNombreEstudiante(estudianteId)}`,
        asistio ? 'success' : 'warning'
    );
    
    // Regenerar tabla
    setTimeout(() => generarTablaAsistencia(), 100);
}

// Función para actualizar justificación
function actualizarJustificacion(estudianteId, fecha, justificacion) {
    const periodo = sistemaFT.periodoActual;
    
    if (sistemaFT.asistencias[periodo] && 
        sistemaFT.asistencias[periodo][estudianteId] &&
        sistemaFT.asistencias[periodo][estudianteId][fecha]) {
        
        sistemaFT.asistencias[periodo][estudianteId][fecha].justificacion = justificacion;
        localStorage.setItem('ft_asistencias', JSON.stringify(sistemaFT.asistencias));
        
        if (justificacion.trim()) {
            mostrarNotificacion('✅ Justificación guardada', 'success');
        }
    }
}

// Función para mostrar opciones de justificación común
function mostrarOpcionesJustificacion(estudianteId, fecha) {
    const opciones = [
        'Enfermedad',
        'Cita médica',
        'Problemas familiares',
        'Transporte',
        'Otras actividades escolares',
        'Permiso especial'
    ];
    
    const selector = document.createElement('div');
    selector.className = 'selector-justificacion';
    selector.innerHTML = `
        <div class="selector-header">
            <span>Seleccionar justificación común</span>
            <button class="btn-cerrar" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
        <div class="opciones-justificacion">
            ${opciones.map(op => `
                <button class="opcion" onclick="seleccionarJustificacion('${estudianteId}', '${fecha}', '${op}')">
                    ${op}
                </button>
            `).join('')}
        </div>
    `;
    
    // Posicionar cerca del campo de justificación
    const input = document.querySelector(`[data-estudiante="${estudianteId}"][data-fecha="${fecha}"] .justificacion-input`);
    if (input) {
        const rect = input.getBoundingClientRect();
        selector.style.position = 'fixed';
        selector.style.top = `${rect.bottom + 5}px`;
        selector.style.left = `${rect.left}px`;
        selector.style.zIndex = '1000';
    }
    
    document.body.appendChild(selector);
}

function seleccionarJustificacion(estudianteId, fecha, justificacion) {
    const input = document.querySelector(`[data-estudiante="${estudianteId}"][data-fecha="${fecha}"] .justificacion-input`);
    if (input) {
        input.value = justificacion;
        input.dispatchEvent(new Event('change'));
    }
    
    const selector = document.querySelector('.selector-justificacion');
    if (selector) selector.remove();
}

// Función auxiliar para obtener nombre
function obtenerNombreEstudiante(estudianteId) {
    const estudiante = sistemaFT.estudiantes.find(e => e.id === estudianteId);
    return estudiante ? estudiante.nombre : 'Estudiante';
}

// ============================================
// 6. MÓDULO DE PRUEBA DE EJECUCIÓN (15-20%)
// ============================================

function cargarModuloPruebaEjecucion() {
    const contenedor = document.getElementById('contenedorPrincipal');
    const porcentaje = sistemaFT.nivelActual === 'I' ? 15 : 20;
    
    contenedor.innerHTML = `
        <div class="modulo-prueba">
            <div class="modulo-header">
                <button class="btn-volver" onclick="mostrarDashboardCompleto()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <div>
                    <h2><i class="fas fa-file-signature"></i> Prueba de Ejecución</h2>
                    <p class="modulo-subtitulo">${porcentaje}% de la nota final - Evaluación práctica</p>
                </div>
                <div class="modulo-actions">
                    <button class="btn btn-primary" onclick="crearNuevaPrueba()">
                        <i class="fas fa-plus"></i> Nueva Prueba
                    </button>
                </div>
            </div>
            
            <div class="prueba-container">
                <div class="prueba-config">
                    <h3><i class="fas fa-cog"></i> Configurar Prueba</h3>
                    <div class="config-grid">
                        <div class="config-item">
                            <label for="nombrePrueba">Nombre de la prueba:</label>
                            <input type="text" id="nombrePrueba" placeholder="Ej: Evaluación Scratch 4°" value="Evaluación de Programación">
                        </div>
                        <div class="config-item">
                            <label for="fechaPrueba">Fecha:</label>
                            <input type="date" id="fechaPrueba" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="config-item">
                            <label for="tipoPrueba">Tipo:</label>
                            <select id="tipoPrueba">
                                <option value="practica">Práctica</option>
                                <option value="proyecto">Proyecto</option>
                                <option value="ejecucion">Ejecución</option>
                                <option value="oral">Oral</option>
                            </select>
                        </div>
                        <div class="config-item">
                            <label for="puntajeMaximo">Puntaje máximo:</label>
                            <input type="number" id="puntajeMaximo" value="100" min="1" max="1000">
                        </div>
                    </div>
                    
                    <div class="criterios-prueba">
                        <h4><i class="fas fa-list-check"></i> Criterios de Evaluación</h4>
                        <div id="listaCriterios">
                            <div class="criterio-item">
                                <input type="text" placeholder="Criterio (ej: Funcionalidad)" value="Funcionalidad">
                                <input type="number" placeholder="Puntos" value="40" min="0" max="100">
                                <button class="btn-icon btn-danger" onclick="eliminarCriterio(this)"><i class="fas fa-trash"></i></button>
                            </div>
                            <div class="criterio-item">
                                <input type="text" placeholder="Criterio (ej: Creatividad)" value="Creatividad">
                                <input type="number" placeholder="Puntos" value="30" min="0" max="100">
                                <button class="btn-icon btn-danger" onclick="eliminarCriterio(this)"><i class="fas fa-trash"></i></button>
                            </div>
                            <div class="criterio-item">
                                <input type="text" placeholder="Criterio (ej: Presentación)" value="Presentación">
                                <input type="number" placeholder="Puntos" value="30" min="0" max="100">
                                <button class="btn-icon btn-danger" onclick="eliminarCriterio(this)"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                        <button class="btn btn-outline btn-sm" onclick="agregarCriterio()">
                            <i class="fas fa-plus"></i> Agregar Criterio
                        </button>
                    </div>
                </div>
                
                <div class="prueba-evaluacion">
                    <h3><i class="fas fa-clipboard-check"></i> Evaluar Estudiantes</h3>
                    <div class="prueba-table-container">
                        <table class="prueba-table">
                            <thead>
                                <tr>
                                    <th class="col-estudiante">Estudiante</th>
                                    <th class="col-grupo">Grupo</th>
                                    <th class="col-funcionalidad">Funcionalidad (40)</th>
                                    <th class="col-creatividad">Creatividad (30)</th>
                                    <th class="col-presentacion">Presentación (30)</th>
                                    <th class="col-total">Total /100</th>
                                    <th class="col-porcentaje">${porcentaje}%</th>
                                </tr>
                            </thead>
                            <tbody id="cuerpoPrueba">
                                <!-- Filas generadas dinámicamente -->
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="prueba-summary">
                        <div class="summary-card">
                            <h4><i class="fas fa-chart-bar"></i> Estadísticas</h4>
                            <div class="summary-grid">
                                <div class="summary-item">
                                    <span class="summary-label">Promedio Grupo:</span>
                                    <span class="summary-value" id="promedioPrueba">0.0</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">Más Alto:</span>
                                    <span class="summary-value" id="maximoPrueba">0.0</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">Más Bajo:</span>
                                    <span class="summary-value" id="minimoPrueba">0.0</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">Aporte Nota:</span>
                                    <span class="summary-value" id="aportePrueba">0.0</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="prueba-actions">
                            <button class="btn btn-primary" onclick="guardarPruebaEjecucion()">
                                <i class="fas fa-save"></i> Guardar Evaluación
                            </button>
                            <button class="btn btn-outline" onclick="exportarPrueba()">
                                <i class="fas fa-file-export"></i> Exportar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    generarTablaPruebaEjecucion();
}

function generarTablaPruebaEjecucion() {
    const tbody = document.getElementById('cuerpoPrueba');
    if (!tbody) return;
    
    const porcentaje = sistemaFT.nivelActual === 'I' ? 15 : 20;
    const periodo = sistemaFT.periodoActual;
    
    let html = '';
    let totalPuntajes = [];
    
    sistemaFT.estudiantes.forEach(estudiante => {
        // Obtener calificación existente o generar aleatoria para demo
        let funcionalidad = 0;
        let creatividad = 0;
        let presentacion = 0;
        let total = 0;
        
        if (sistemaFT.pruebasEjecucion[periodo] && sistemaFT.pruebasEjecucion[periodo][estudiante.id]) {
            const prueba = sistemaFT.pruebasEjecucion[periodo][estudiante.id];
            funcionalidad = prueba.funcionalidad || 0;
            creatividad = prueba.creatividad || 0;
            presentacion = prueba.presentacion || 0;
            total = prueba.total || 0;
        } else {
            // Datos de demostración
            funcionalidad = Math.floor(Math.random() * 41); // 0-40
            creatividad = Math.floor(Math.random() * 31); // 0-30
            presentacion = Math.floor(Math.random() * 31); // 0-30
            total = funcionalidad + creatividad + presentacion;
        }
        
        totalPuntajes.push(total);
        const aporte = (total * porcentaje / 100).toFixed(1);
        
        html += `
            <tr data-estudiante="${estudiante.id}">
                <td class="col-estudiante">
                    <div class="estudiante-info">
                        <strong>${estudiante.nombre}</strong>
                        <small>${estudiante.cedula}</small>
                    </div>
                </td>
                <td class="col-grupo">${estudiante.grupo}</td>
                <td class="col-funcionalidad">
                    <input type="number" 
                           min="0" 
                           max="40" 
                           value="${funcionalidad}"
                           onchange="actualizarCriterioPrueba('${estudiante.id}', 'funcionalidad', this.value)">
                </td>
                <td class="col-creatividad">
                    <input type="number" 
                           min="0" 
                           max="30" 
                           value="${creatividad}"
                           onchange="actualizarCriterioPrueba('${estudiante.id}', 'creatividad', this.value)">
                </td>
                <td class="col-presentacion">
                    <input type="number" 
                           min="0" 
                           max="30" 
                           value="${presentacion}"
                           onchange="actualizarCriterioPrueba('${estudiante.id}', 'presentacion', this.value)">
                </td>
                <td class="col-total">
                    <span class="total-prueba">${total}</span>/100
                </td>
                <td class="col-porcentaje">${aporte}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Calcular estadísticas
    if (totalPuntajes.length > 0) {
        const promedio = (totalPuntajes.reduce((a, b) => a + b, 0) / totalPuntajes.length).toFixed(1);
        const maximo = Math.max(...totalPuntajes);
        const minimo = Math.min(...totalPuntajes);
        const aportePromedio = (promedio * porcentaje / 100).toFixed(1);
        
        document.getElementById('promedioPrueba').textContent = promedio;
        document.getElementById('maximoPrueba').textContent = maximo;
        document.getElementById('minimoPrueba').textContent = minimo;
        document.getElementById('aportePrueba').textContent = aportePromedio;
    }
}

function actualizarCriterioPrueba(estudianteId, criterio, valor) {
    const periodo = sistemaFT.periodoActual;
    const valorNum = parseInt(valor) || 0;
    
    if (!sistemaFT.pruebasEjecucion[periodo]) sistemaFT.pruebasEjecucion[periodo] = {};
    
    // Actualizar criterio específico
    sistemaFT.pruebasEjecucion[periodo][estudianteId] = {
        ...sistemaFT.pruebasEjecucion[periodo][estudianteId],
        [criterio]: valorNum
    };
    
    // Calcular total
    const prueba = sistemaFT.pruebasEjecucion[periodo][estudianteId];
    const total = (prueba.funcionalidad || 0) + (prueba.creatividad || 0) + (prueba.presentacion || 0);
    sistemaFT.pruebasEjecucion[periodo][estudianteId].total = total;
    
    localStorage.setItem('ft_pruebas_ejecucion', JSON.stringify(sistemaFT.pruebasEjecucion));
    
    // Actualizar total en la interfaz
    const fila = document.querySelector(`[data-estudiante="${estudianteId}"]`);
    if (fila) {
        const totalCell = fila.querySelector('.total-prueba');
        if (totalCell) {
            totalCell.textContent = total;
        }
        
        // Recalcular aporte
        const porcentaje = sistemaFT.nivelActual === 'I' ? 15 : 20;
        const aporte = (total * porcentaje / 100).toFixed(1);
        const aporteCell = fila.querySelector('.col-porcentaje');
        if (aporteCell) {
            aporteCell.textContent = aporte;
        }
    }
    
    recalcularEstadisticasPrueba();
}

// ============================================
// 7. MÓDULO DE PROYECTO CON DESIGN THINKING (30%)
// ============================================

async function cargarModuloProyecto() {
    const contenedor = document.getElementById('contenedorPrincipal');
    
    // Cargar estructura del proyecto
    const proyectoData = await cargarDatosProyecto();
    
    contenedor.innerHTML = `
        <div class="modulo-proyecto">
            <div class="modulo-header">
                <button class="btn-volver" onclick="mostrarDashboardCompleto()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <div>
                    <h2><i class="fas fa-project-diagram"></i> Proyecto - Design Thinking</h2>
                    <p class="modulo-subtitulo">30% de la nota final - Metodología por etapas</p>
                </div>
                <div class="modulo-actions">
                    <button class="btn btn-primary" onclick="crearNuevoProyecto()">
                        <i class="fas fa-plus"></i> Nuevo Proyecto
                    </button>
                </div>
            </div>
            
            <div class="proyecto-container">
                <!-- Navegación por etapas -->
                <div class="etapas-proyecto">
                    <div class="etapas-nav">
                        <button class="etapa-btn active" data-etapa="inicial" onclick="cambiarEtapaProyecto('inicial')">
                            <i class="fas fa-play-circle"></i>
                            <span>Etapa Inicial</span>
                        </button>
                        <button class="etapa-btn" data-etapa="desarrollo" onclick="cambiarEtapaProyecto('desarrollo')">
                            <i class="fas fa-cogs"></i>
                            <span>Etapa Desarrollo</span>
                        </button>
                        <button class="etapa-btn" data-etapa="final" onclick="cambiarEtapaProyecto('final')">
                            <i class="fas fa-flag-checkered"></i>
                            <span>Etapa Final</span>
                        </button>
                    </div>
                    
                    <div class="etapa-content" id="etapaInicial">
                        <h3><i class="fas fa-play-circle"></i> Etapa Inicial - Empatizar y Definir</h3>
                        ${generarFasesDesignThinking(['empatizar', 'definir'])}
                    </div>
                    
                    <div class="etapa-content" id="etapaDesarrollo" style="display: none;">
                        <h3><i class="fas fa-cogs"></i> Etapa Desarrollo - Idear y Prototipar</h3>
                        ${generarFasesDesignThinking(['idear', 'prototipar'])}
                    </div>
                    
                    <div class="etapa-content" id="etapaFinal" style="display: none;">
                        <h3><i class="fas fa-flag-checkered"></i> Etapa Final - Evaluar</h3>
                        ${generarFasesDesignThinking(['evaluar'])}
                        <div class="evaluacion-final">
                            <h4><i class="fas fa-clipboard-check"></i> Evaluación Final del Proyecto</h4>
                            <div class="evaluacion-grid" id="evaluacionFinalProyecto">
                                <!-- Evaluación por criterios -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Panel de evaluación -->
                <div class="proyecto-evaluacion">
                    <h3><i class="fas fa-users"></i> Evaluación por Equipo</h3>
                    <div class="equipos-container" id="equiposProyecto">
                        <!-- Equipos de trabajo -->
                    </div>
                    
                    <div class="proyecto-summary">
                        <h4><i class="fas fa-chart-pie"></i> Resumen del Proyecto</h4>
                        <div class="summary-grid">
                            <div class="summary-item">
                                <span class="summary-label">Progreso General:</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" id="progresoProyecto" style="width: 30%"></div>
                                </div>
                                <span class="summary-value" id="porcentajeProgreso">30%</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Equipos Activos:</span>
                                <span class="summary-value" id="equiposActivos">3</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Promedio Actual:</span>
                                <span class="summary-value" id="promedioProyecto">0.0</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">30% Aporte:</span>
                                <span class="summary-value" id="aporteProyecto">0.0</span>
                            </div>
                        </div>
                        
                        <div class="proyecto-actions">
                            <button class="btn btn-primary" onclick="guardarProyecto()">
                                <i class="fas fa-save"></i> Guardar Proyecto
                            </button>
                            <button class="btn btn-success" onclick="calcularNotaProyecto()">
                                <i class="fas fa-calculator"></i> Calcular Nota
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    inicializarProyectoDesignThinking();
}

function generarFasesDesignThinking(fases) {
    const fasesData = {
        'empatizar': {
            icon: 'fas fa-heart',
            title: 'Empatizar',
            desc: 'Comprender las necesidades del usuario',
            indicadores: [
                'Investiga y recopila información',
                'Identifica necesidades reales',
                'Crea perfil de usuario'
            ]
        },
        'definir': {
            icon: 'fas fa-bullseye',
            title: 'Definir',
            desc: 'Establecer el problema central',
            indicadores: [
                'Sintetiza la información',
                'Define el problema claramente',
                'Establece objetivos del proyecto'
            ]
        },
        'idear': {
            icon: 'fas fa-lightbulb',
            title: 'Idear',
            desc: 'Generar soluciones creativas',
            indicadores: [
                'Genera múltiples ideas',
                'Usa técnicas de creatividad',
                'Selecciona la mejor solución'
            ]
        },
        'prototipar': {
            icon: 'fas fa-cube',
            title: 'Prototipar',
            desc: 'Crear representaciones tangibles',
            indicadores: [
                'Desarrolla prototipo físico/digital',
                'Itera basado en feedback',
                'Documenta el proceso'
            ]
        },
        'evaluar': {
            icon: 'fas fa-check-double',
            title: 'Evaluar',
            desc: 'Probar y mejorar la solución',
            indicadores: [
                'Prueba con usuarios reales',
                'Recopila y analiza feedback',
                'Propone mejoras'
            ]
        }
    };
    
    return fases.map(fase => `
        <div class="fase-card" data-fase="${fase}">
            <div class="fase-header">
                <div class="fase-icon">
                    <i class="${fasesData[fase].icon}"></i>
                </div>
                <div>
                    <h4>${fasesData[fase].title}</h4>
                    <p>${fasesData[fase].desc}</p>
                </div>
                <div class="fase-status">
                    <span class="status-badge completado">50%</span>
                </div>
            </div>
            <div class="fase-indicadores">
                <h5>Indicadores de evaluación:</h5>
                <ul>
                    ${fasesData[fase].indicadores.map(ind => `<li>${ind}</li>`).join('')}
                </ul>
            </div>
            <div class="fase-actions">
                <button class="btn btn-sm btn-outline" onclick="evaluarFase('${fase}')">
                    <i class="fas fa-edit"></i> Evaluar
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// 8. CÁLCULO DE NOTA FINAL
// ============================================

function calcularNotaFinal() {
    const contenedor = document.getElementById('contenedorPrincipal');
    const periodo = sistemaFT.periodoActual;
    const ciclo = sistemaFT.nivelActual || 'II';
    
    // Calcular promedios de cada componente
    const promedioTC = calcularPromedioTrabajoCotidiano();
    const promedioTareas = calcularPromedioTareas();
    const promedioAsistencia = calcularPromedioAsistencia();
    const promedioPruebaProyecto = calcularPromedioPruebaProyecto();
    
    // Aplicar porcentajes según ciclo
    const porcentajes = obtenerPorcentajesCiclo(ciclo);
    
    const notaFinal = (
        (promedioTC * porcentajes.tc / 100) +
        (promedioTareas * porcentajes.tareas / 100) +
        (promedioAsistencia * porcentajes.asistencia / 100) +
        (promedioPruebaProyecto * (ciclo === 'III' ? porcentajes.proyecto : porcentajes.prueba) / 100)
    ).toFixed(1);
    
    contenedor.innerHTML = `
        <div class="nota-final-container">
            <div class="nota-final-header">
                <button class="btn-volver" onclick="mostrarDashboardCompleto()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <h2><i class="fas fa-calculator"></i> Cálculo de Nota Final</h2>
                <p>Ciclo ${ciclo} - Período: ${periodo}</p>
            </div>
            
            <div class="componentes-nota">
                <h3><i class="fas fa-puzzle-piece"></i> Componentes de Evaluación</h3>
                
                <div class="componente-card">
                    <div class="componente-header">
                        <h4>Trabajo Cotidiano</h4>
                        <span class="componente-porcentaje">${porcentajes.tc}%</span>
                    </div>
                    <div class="componente-body">
                        <div class="componente-stats">
                            <span>Promedio: ${promedioTC}</span>
                            <span>Aporte: ${(promedioTC * porcentajes.tc / 100).toFixed(1)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${promedioTC}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="componente-card">
                    <div class="componente-header">
                        <h4>Tareas</h4>
                        <span class="componente-porcentaje">${porcentajes.tareas}%</span>
                    </div>
                    <div class="componente-body">
                        <div class="componente-stats">
                            <span>Promedio: ${promedioTareas}</span>
                            <span>Aporte: ${(promedioTareas * porcentajes.tareas / 100).toFixed(1)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${promedioTareas}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="componente-card">
                    <div class="componente-header">
                        <h4>Asistencia</h4>
                        <span class="componente-porcentaje">${porcentajes.asistencia}%</span>
                    </div>
                    <div class="componente-body">
                        <div class="componente-stats">
                            <span>Promedio: ${promedioAsistencia}%</span>
                            <span>Aporte: ${(promedioAsistencia * porcentajes.asistencia / 100).toFixed(1)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${promedioAsistencia}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="componente-card">
                    <div class="componente-header">
                        <h4>${ciclo === 'III' ? 'Proyecto' : 'Prueba de Ejecución'}</h4>
                        <span class="componente-porcentaje">${ciclo === 'III' ? porcentajes.proyecto : porcentajes.prueba}%</span>
                    </div>
                    <div class="componente-body">
                        <div class="componente-stats">
                            <span>Promedio: ${promedioPruebaProyecto}</span>
                            <span>Aporte: ${(promedioPruebaProyecto * (ciclo === 'III' ? porcentajes.proyecto : porcentajes.prueba) / 100).toFixed(1)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${promedioPruebaProyecto}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="resultado-final">
                <div class="resultado-card ${parseFloat(notaFinal) >= 70 ? 'aprobado' : 'reprobado'}">
                    <div class="resultado-icon">
                        <i class="fas fa-${parseFloat(notaFinal) >= 70 ? 'trophy' : 'exclamation-triangle'}"></i>
                    </div>
                    <div class="resultado-content">
                        <h3>Nota Final: ${notaFinal}</h3>
                        <p>${parseFloat(notaFinal) >= 70 ? 'APROBADO' : 'REPROBADO'}</p>
                        <small>Promedio del grupo - Ciclo ${ciclo}</small>
                    </div>
                    <div class="resultado-acciones">
                        <button class="btn btn-primary" onclick="generarBoletas()">
                            <i class="fas fa-print"></i> Generar Boletas
                        </button>
                        <button class="btn btn-outline" onclick="exportarNotasFinales()">
                            <i class="fas fa-file-excel"></i> Exportar
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="nota-final-footer">
                <p><i class="fas fa-info-circle"></i> Nota: Esta es la nota promedio del grupo. Para ver notas individuales, exporte el reporte completo.</p>
            </div>
        </div>
    `;
}

function obtenerPorcentajesCiclo(ciclo) {
    const porcentajes = {
        'I': { tc: 65, tareas: 10, prueba: 15, asistencia: 10, proyecto: 0 },
        'II': { tc: 60, tareas: 10, prueba: 20, asistencia: 10, proyecto: 0 },
        'III': { tc: 50, tareas: 10, prueba: 0, asistencia: 10, proyecto: 30 }
    };
    return porcentajes[ciclo] || porcentajes['II'];
}

// ============================================
// 9. FUNCIONES AUXILIARES Y UTILIDADES
// ============================================

function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 
                          tipo === 'error' ? 'exclamation-circle' : 
                          tipo === 'warning' ? 'exclamation-triangle' : 
                          'info-circle'}"></i>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => notificacion.classList.add('mostrar'), 10);
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

function cambiarPeriodoGlobal(periodo) {
    sistemaFT.periodoActual = periodo;
    mostrarNotificacion(`Período cambiado a: ${periodo}`, 'info');
    mostrarDashboardCompleto();
}

function seleccionarCiclo(ciclo) {
    sistemaFT.nivelActual = ciclo;
    mostrarNotificacion(`Ciclo ${ciclo} seleccionado`, 'success');
    mostrarDashboardCompleto();
}

// ============================================
// 10. INICIALIZACIÓN Y EXPORTACIÓN
// ============================================

// Hacer funciones globales
window.mostrarDashboardCompleto = mostrarDashboardCompleto;
window.cargarModuloEvaluacion = cargarModuloEvaluacion;
window.seleccionarCiclo = seleccionarCiclo;
window.cambiarPeriodoGlobal = cambiarPeriodoGlobal;
window.calcularNotaFinal = calcularNotaFinal;
window.cargarModuloTareas = cargarModuloTareas;
window.cargarModuloAsistencia = cargarModuloAsistencia;
window.cargarModuloPruebaEjecucion = cargarModuloPruebaEjecucion;
window.cargarModuloProyecto = cargarModuloProyecto;

// Funciónes para módulos específicos (placeholder)
window.cambiarAsistencia = cambiarAsistencia;
window.actualizarCalificacionTarea = actualizarCalificacionTarea;
window.cambiarEstadoTarea = cambiarEstadoTarea;
window.actualizarCriterioPrueba = actualizarCriterioPrueba;

// Inicializar sistema
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistemaSprint2);
} else {
    inicializarSistemaSprint2();
}

console.log('✅ Sistema FT-MEP Sprint 2 cargado');
