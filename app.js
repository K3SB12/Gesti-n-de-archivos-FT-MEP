// ============================================
// SISTEMA FT-MEP - DASHBOARD SIMPLIFICADO
// ============================================

// Variables del sistema
let sistemaFT = {
    estudiantes: [],
    nivelActual: null
};

// Inicializar sistema
function inicializarSistema() {
    console.log('🚀 Sistema FT-MEP - Dashboard inicializando...');
    
    // Cargar datos iniciales
    cargarDatosIniciales();
    
    // Mostrar dashboard por defecto
    mostrarDashboard();
    
    // Configurar navegación
    configurarNavegacion();
    
    console.log('✅ Dashboard FT-MEP listo');
}

// Cargar datos iniciales
// REEMPLAZA la función cargarDatosIniciales() completa:
async function cargarDatosIniciales() {
    try {
        console.log('📥 Cargando datos MEP...');
        
        // Opción 1: Si la ruta necesita ./
        const response = await fetch('./data/estudiantes.json');
        // Opción 2: Si la ruta es correcta
        // const response = await fetch('data/estudiantes.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📄 Datos crudos recibidos:', data);
        
        // Dependiendo de la estructura REAL de tu archivo:
        if (data.estudiantes && Array.isArray(data.estudiantes)) {
            sistemaFT.estudiantes = data.estudiantes;
            console.log(`👥 ${sistemaFT.estudiantes.length} estudiantes cargados (estructura: data.estudiantes)`);
        } 
        else if (Array.isArray(data)) {
            sistemaFT.estudiantes = data;
            console.log(`👥 ${sistemaFT.estudiantes.length} estudiantes cargados (estructura: array directo)`);
        }
        else {
            console.warn('❌ Estructura desconocida, usando datos de ejemplo');
            sistemaFT.estudiantes = obtenerEstudiantesEjemplo();
        }
        
    } catch (error) {
        console.error('❌ Error cargando estudiantes:', error);
        sistemaFT.estudiantes = obtenerEstudiantesEjemplo();
        console.log(`👥 ${sistemaFT.estudiantes.length} estudiantes de ejemplo cargados`);
    }
}

// Añade esta función auxiliar AL FINAL de app.js (antes del DOMContentLoaded):
function obtenerEstudiantesEjemplo() {
    return [
        {id: 1, nombre: "Ana Gómez", cedula: "001234567", ciclo: "I", grupo: "7°A"},
        {id: 2, nombre: "Carlos López", cedula: "002345678", ciclo: "I", grupo: "7°A"},
        {id: 3, nombre: "María Rodríguez", cedula: "003456789", ciclo: "II", grupo: "8°B"},
        {id: 4, nombre: "José Pérez", cedula: "004567890", ciclo: "III", grupo: "9°A"},
        {id: 5, nombre: "Laura Martínez", cedula: "005678901", ciclo: "III", grupo: "9°B"}
    ];
}

// Mostrar dashboard principal
function mostrarDashboard() {
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) {
        console.error('❌ No se encontró contenedorPrincipal');
        return;
    }
    
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
// REEMPLAZA la función cargarNivel COMPLETA:
async function cargarNivel(nivelId) {
    sistemaFT.nivelActual = nivelId;
    
    const nombres = {
        'primaria-ciclo-I': 'I Ciclo (1°-3°)',
        'primaria-ciclo-II': 'II Ciclo (4°-6°)', 
        'secundaria-ciclo-III': 'III Ciclo (7°-9°)'
    };
    
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

// AÑADE esta NUEVA función:
async function cargarYMostrarModulosReales(nivelId) {
    try {
        // 1. Cargar configuración de ciclos para saber qué módulos tocan
        const response = await fetch('./data/ciclos-config.json');
        const ciclosConfig = await response.json();
        
        // 2. Determinar módulos para este ciclo
        const moduloKeys = {
            'primaria-ciclo-I': ['ofimatica'],
            'primaria-ciclo-II': ['ofimatica', 'programacion'],
            'secundaria-ciclo-III': ['ofimatica', 'programacion', 'redes']
        };
        
        const modulosParaEsteCiclo = moduloKeys[nivelId] || ['ofimatica'];
        
        // 3. Generar HTML para cada módulo
        let htmlModulos = '';
        
        for (const moduloKey of modulosParaEsteCiclo) {
            try {
                const modResponse = await fetch(`./modulos-ft/${moduloKey}.json`);
                const moduloData = await modResponse.json();
                
                htmlModulos += `
                    <div class="modulo-item-real" onclick="abrirRegistroModulo('${moduloKey}', '${nivelId}')">
                        <div class="modulo-icon">
                            <i class="fas ${moduloKey === 'ofimatica' ? 'fa-file-word' : 
                                          moduloKey === 'programacion' ? 'fa-code' : 
                                          'fa-network-wired'}"></i>
                        </div>
                        <div class="modulo-info">
                            <h5>${moduloData.nombre || moduloKey}</h5>
                            <p>${moduloData.descripcion || 'Módulo de Formación Tecnológica'}</p>
                            <div class="modulo-meta">
                                <span><i class="fas fa-graduation-cap"></i> ${modulosParaEsteCiclo.length > 1 ? 'Obligatorio' : 'Principal'}</span>
                                <span><i class="fas fa-percentage"></i> ${nivelId.includes('I') ? '50%' : 
                                                                        nivelId.includes('II') ? '55%' : 
                                                                        '60%'} de la nota</span>
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
                htmlModulos += crearModuloEjemploHTML(moduloKey, nivelId);
            }
        }
        
        // 4. Mostrar en la página
        document.getElementById('modulosLista').innerHTML = htmlModulos || 
            '<p class="texto-vacio">No hay módulos configurados para este ciclo.</p>';
            
    } catch (error) {
        console.error('Error cargando módulos:', error);
        document.getElementById('modulosLista').innerHTML = `
            <div class="error-modulos">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error cargando módulos. Usando datos de ejemplo.</p>
                ${crearModuloEjemploHTML('ofimatica', nivelId)}
            </div>
        `;
    }
}

// AÑADE esta función auxiliar:
function crearModuloEjemploHTML(moduloKey, nivelId) {
    const nombres = {
        'ofimatica': 'Ofimática',
        'programacion': 'Programación',
        'redes': 'Redes y Comunicación'
    };
    
    return `
        <div class="modulo-item-real" onclick="abrirRegistroModulo('${moduloKey}', '${nivelId}')">
            <div class="modulo-icon">
                <i class="fas ${moduloKey === 'ofimatica' ? 'fa-file-word' : 
                              moduloKey === 'programacion' ? 'fa-code' : 
                              'fa-network-wired'}"></i>
            </div>
            <div class="modulo-info">
                <h5>${nombres[moduloKey] || moduloKey} (Ejemplo)</h5>
                <p>Módulo de Formación Tecnológica - ${nivelId.includes('I') ? 'I Ciclo' : 
                                                    nivelId.includes('II') ? 'II Ciclo' : 
                                                    'III Ciclo'}</p>
                <div class="modulo-meta">
                    <span><i class="fas fa-clock"></i> Carga pendiente</span>
                </div>
            </div>
            <button class="btn btn-primary">
                <i class="fas fa-play-circle"></i> Comenzar
            </button>
        </div>
    `;
}

// AÑADE esta NUEVA función (después de cargarNivel):
async function abrirRegistroModulo(moduloKey, nivelId) {
    console.log(`📝 Abriendo registro para: ${moduloKey} en ${nivelId}`);
    
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

// AÑADE esta función auxiliar:
function generarFilasRegistro(indicadores) {
    if (sistemaFT.estudiantes.length === 0) {
        return '<div class="fila-vacia">No hay estudiantes cargados</div>';
    }
    
    return sistemaFT.estudiantes.map(est => `
        <div class="fila-estudiante" data-id="${est.id}">
            <div class="col-estudiante">
                <div class="estudiante-nombre">${est.nombre || 'Estudiante ' + est.id}</div>
                <div class="estudiante-info">${est.cedula || ''} ${est.grupo || ''}</div>
            </div>
            
            ${indicadores.map((ind, idx) => `
                <div class="col-indicador">
                    <div class="niveles-logro">
                        <button class="btn-nivel ${idx === 0 ? 'activo' : ''}" data-nivel="3" onclick="seleccionarNivel(this, ${est.id}, ${idx})">
                            Alto
                        </button>
                        <button class="btn-nivel ${idx === 1 ? 'activo' : ''}" data-nivel="2" onclick="seleccionarNivel(this, ${est.id}, ${idx})">
                            Medio
                        </button>
                        <button class="btn-nivel ${idx === 2 ? 'activo' : ''}" data-nivel="1" onclick="seleccionarNivel(this, ${est.id}, ${idx})">
                            Bajo
                        </button>
                    </div>
                </div>
            `).join('')}
            
            <div class="col-total">
                <span class="total-parcial">0%</span>
            </div>
        </div>
    `).join('');
}
    
// Volver al dashboard
function volverDashboard() {
    sistemaFT.nivelActual = null;
    mostrarDashboard();
}

// Configurar navegación
function configurarNavegacion() {
    console.log('🔧 Configurando navegación...');
    
    // Actualizar enlaces activos
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// AÑADE al final de app.js (antes de las exportaciones):

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
    // Esta función calcularía el % basado en niveles seleccionados
    const fila = document.querySelector(`.fila-estudiante[data-id="${estudianteId}"]`);
    if (!fila) return;
    
    // Ejemplo simple: contar niveles seleccionados
    const nivelesSeleccionados = fila.querySelectorAll('.btn-nivel.activo').length;
    const totalIndicadores = fila.querySelectorAll('.col-indicador').length;
    
    const porcentaje = totalIndicadores > 0 ? 
        Math.round((nivelesSeleccionados / totalIndicadores) * 100) : 0;
    
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarSistema);

console.log('🔧 Sistema FT-MEP - Dashboard cargado');

