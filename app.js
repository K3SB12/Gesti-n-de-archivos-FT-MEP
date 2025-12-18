// ============================================
// SISTEMA FT-MEP - DASHBOARD FUNCIONAL
// ============================================

let sistemaFT = {
    estudiantes: [],
    nivelActual: null
};

// Inicializar sistema
function inicializarSistema() {
    console.log('🚀 Sistema FT-MEP inicializando...');
    cargarDatosIniciales();
    mostrarDashboard();
    configurarNavegacion();
    console.log('✅ Sistema listo');
}

// Cargar estudiantes
async function cargarDatosIniciales() {
    try {
        const response = await fetch('data/estudiantes.json');
        const data = await response.json();
        
        sistemaFT.estudiantes = data.map(est => ({
            id: est.id,
            nombre: est.nombre,
            cedula: est.codigo || est.id,
            grupo: est.grupo || "4-A",
            ciclo: determinarCiclo(est.grupo),
            necesidades: est.necesidades || [],
            asistencia: est.asistencia || 0,
            notaPeriodoAnterior: est.notaPeriodoAnterior || 0
        }));
        
        console.log(`✅ ${sistemaFT.estudiantes.length} estudiantes cargados`);
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        // Datos de ejemplo si falla
        sistemaFT.estudiantes = [
            {id: "3068800365", nombre: "Aaron Gonzales Mera", cedula: "3068800365", grupo: "4-A", ciclo: "II", necesidades: ["Prioridad I (PI)"], asistencia: 92, notaPeriodoAnterior: 22.0}
        ];
    }
}

function determinarCiclo(grupo) {
    if (!grupo) return "II";
    const grado = parseInt(grupo.split('-')[0]);
    if (grado >= 1 && grado <= 3) return "I";
    if (grado >= 4 && grado <= 6) return "II";
    if (grado >= 7 && grado <= 9) return "III";
    return "II";
}

// Dashboard principal
function mostrarDashboard() {
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    contenedor.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h2><i class="fas fa-tachometer-alt"></i> Panel de Control FT-MEP</h2>
                <p>Gestión académica para Formación Tecnológica - MEP Costa Rica</p>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-content">
                        <h3>${sistemaFT.estudiantes.length}</h3>
                        <p>Estudiantes</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-book"></i></div>
                    <div class="stat-content">
                        <h3>12</h3>
                        <p>Módulos FT</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-school"></i></div>
                    <div class="stat-content">
                        <h3>3</h3>
                        <p>Ciclos</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
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
                        <div class="nivel-icon"><i class="fas fa-child"></i></div>
                        <h4>I Ciclo</h4>
                        <p>Primaria 1°-3°</p>
                        <div class="nivel-badge">Primaria</div>
                    </div>
                    
                    <div class="nivel-card" onclick="cargarNivel('primaria-ciclo-II')">
                        <div class="nivel-icon"><i class="fas fa-user-graduate"></i></div>
                        <h4>II Ciclo</h4>
                        <p>Primaria 4°-6°</p>
                        <div class="nivel-badge">Primaria</div>
                    </div>
                    
                    <div class="nivel-card" onclick="cargarNivel('secundaria-ciclo-III')">
                        <div class="nivel-icon"><i class="fas fa-graduation-cap"></i></div>
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
                        <i class="fas fa-user-plus"></i><span>Gestionar Estudiantes</span>
                    </button>
                    <button class="accion-btn" onclick="generarReportes()">
                        <i class="fas fa-file-pdf"></i><span>Generar Reportes</span>
                    </button>
                    <button class="accion-btn" onclick="activarAsistenteIA()">
                        <i class="fas fa-robot"></i><span>Asistente IA</span>
                    </button>
                    <button class="accion-btn" onclick="calcularNotas()">
                        <i class="fas fa-calculator"></i><span>Calcular Notas</span>
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

// Cargar nivel
async function cargarNivel(nivelId) {
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    const nombres = {
        'primaria-ciclo-I': 'I Ciclo (1°-3°)',
        'primaria-ciclo-II': 'II Ciclo (4°-6°)', 
        'secundaria-ciclo-III': 'III Ciclo (7°-9°)'
    };
    
    contenedor.innerHTML = `
        <div class="nivel-vista">
            <div class="nivel-header">
                <button class="btn-volver" onclick="mostrarDashboard()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <h2><i class="fas fa-folder-open"></i> ${nombres[nivelId]}</h2>
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
                        <small>Art. 6.1.1 Lineamientos MEP 2024</small>
                    </div>
                </div>
                
                <div class="modulos-disponibles">
                    <h4><i class="fas fa-tasks"></i> Módulos para evaluación</h4>
                    <div class="modulos-lista" id="modulosLista">
                        <div class="cargando-modulos">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Cargando módulos...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    await cargarModulosNivel(nivelId);
}

// Cargar módulos (VERSIÓN SIMPLE Y FUNCIONAL)
async function cargarModulosNivel(nivelId) {
    // Determinar qué módulos cargar según nivel
    let modulos = [];
    
    if (nivelId === 'primaria-ciclo-I') {
        modulos = ['herramientas-digitales']; // Solo 1er área para I ciclo
    } else if (nivelId === 'primaria-ciclo-II') {
        modulos = ['herramientas-digitales', 'programacion', 'robotica', 'ciencia-datos'];
    } else if (nivelId === 'secundaria-ciclo-III') {
        modulos = ['herramientas-digitales', 'programacion', 'robotica', 'ciencia-datos'];
    }
    
    let html = '';
    
    for (const modulo of modulos) {
        try {
            // Intentar cargar desde diferentes ubicaciones
            let ruta = `modulos-ft/${modulo}.json`;
            const response = await fetch(ruta);
            const data = await response.json();
            
            html += `
                <div class="modulo-item-real" onclick="abrirModulo('${modulo}', '${nivelId}')">
                    <div class="modulo-icon">
                        <i class="fas ${getIcono(modulo)}"></i>
                    </div>
                    <div class="modulo-info">
                        <h5>${data.nombre || modulo}</h5>
                        <p>${data.descripcion || 'Área PNFT'}</p>
                        <div class="modulo-meta">
                            <span><i class="fas fa-graduation-cap"></i> Área PNFT</span>
                        </div>
                    </div>
                    <button class="btn btn-primary">
                        <i class="fas fa-clipboard-list"></i> Evaluar
                    </button>
                </div>
            `;
        } catch (error) {
            // Si no existe el archivo, mostrar placeholder
            html += `
                <div class="modulo-item-real">
                    <div class="modulo-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="modulo-info">
                        <h5>${modulo}</h5>
                        <p>Crear archivo <strong>${modulo}.json</strong> en modulos-ft/</p>
                        <div class="modulo-meta">
                            <span><i class="fas fa-wrench"></i> Por configurar</span>
                        </div>
                    </div>
                    <button class="btn btn-secondary" disabled>
                        Pendiente
                    </button>
                </div>
            `;
        }
    }
    
    document.getElementById('modulosLista').innerHTML = html || '<p>No hay módulos</p>';
}

function getIcono(modulo) {
    const iconos = {
        'herramientas-digitales': 'fa-laptop',
        'programacion': 'fa-code',
        'robotica': 'fa-robot',
        'ciencia-datos': 'fa-chart-line'
    };
    return iconos[modulo] || 'fa-book';
}

function abrirModulo(modulo, nivelId) {
    alert(`Abrir módulo: ${modulo}\nPara nivel: ${nivelId}\n\n(Esta función se implementará con la tabla de evaluación)`);
}

function configurarNavegacion() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Funciones de acción
function gestionarEstudiantes() { alert('Gestión de estudiantes'); }
function generarReportes() { alert('Generar reportes'); }
function activarAsistenteIA() { alert('Asistente IA'); }
function calcularNotas() { alert('Calcular notas'); }

// Hacer funciones globales
window.mostrarDashboard = mostrarDashboard;
window.cargarNivel = cargarNivel;
window.abrirModulo = abrirModulo;
window.gestionarEstudiantes = gestionarEstudiantes;
window.generarReportes = generarReportes;
window.activarAsistenteIA = activarAsistenteIA;
window.calcularNotas = calcularNotas;

// Inicializar
document.addEventListener('DOMContentLoaded', inicializarSistema);
