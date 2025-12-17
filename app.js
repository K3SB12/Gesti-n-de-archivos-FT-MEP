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
async function cargarDatosIniciales() {
    try {
        // Cargar estudiantes
        const response = await fetch('data/estudiantes.json');
        if (response.ok) {
            const data = await response.json();
            sistemaFT.estudiantes = data.estudiantes || [];
            console.log(`👥 ${sistemaFT.estudiantes.length} estudiantes cargados`);
        }
    } catch (error) {
        console.warn('⚠️ No se pudieron cargar datos iniciales:', error);
    }
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
function cargarNivel(nivelId) {
    sistemaFT.nivelActual = nivelId;
    
    const nombres = {
        'primaria-ciclo-I': 'I Ciclo (1°-3°)',
        'primaria-ciclo-II': 'II Ciclo (4°-6°)',
        'secundaria-ciclo-III': 'III Ciclo (7°-9°)'
    };
    
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    contenedor.innerHTML = `
        <div class="nivel-vista">
            <div class="nivel-header">
                <button class="btn-volver" onclick="volverDashboard()">
                    <i class="fas fa-arrow-left"></i> Volver al Dashboard
                </button>
                <h2><i class="fas fa-folder-open"></i> ${nombres[nivelId] || nivelId}</h2>
            </div>
            
            <div class="nivel-contenido">
                <div class="nivel-info">
                    <i class="fas fa-info-circle"></i>
                    <p>Vista del nivel educativo: <strong>${nombres[nivelId]}</strong></p>
                </div>
                
                <div class="modulos-disponibles">
                    <h4><i class="fas fa-book-open"></i> Módulos Disponibles</h4>
                    <div class="modulos-lista">
                        <div class="modulo-item">
                            <i class="fas fa-file-word"></i>
                            <div>
                                <h5>Ofimática</h5>
                                <p>Herramientas de productividad</p>
                            </div>
                            <button class="btn btn-sm">Explorar</button>
                        </div>
                        
                        <div class="modulo-item">
                            <i class="fas fa-code"></i>
                            <div>
                                <h5>Programación</h5>
                                <p>Algoritmos y lógica</p>
                            </div>
                            <button class="btn btn-sm">Explorar</button>
                        </div>
                    </div>
                </div>
                
                <div class="nivel-acciones">
                    <button class="btn btn-primary" onclick="crearModulo('${nivelId}')">
                        <i class="fas fa-plus"></i> Crear Nuevo Módulo
                    </button>
                    <button class="btn btn-secondary" onclick="importarModulos('${nivelId}')">
                        <i class="fas fa-upload"></i> Importar Módulos
                    </button>
                </div>
            </div>
        </div>
    `;
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarSistema);

console.log('🔧 Sistema FT-MEP - Dashboard cargado');
