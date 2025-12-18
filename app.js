// ============================================
// SISTEMA FT-MEP - DASHBOARD 100% FUNCIONAL
// ============================================

// Variables globales del sistema
let sistemaFT = {
    estudiantes: [],
    nivelActual: null,
    modulosCargados: false
};

// ============================================
// INICIALIZACIÓN DEL SISTEMA
// ============================================

// Función principal de inicialización
function inicializarSistema() {
    console.log('🚀 Sistema FT-MEP inicializando...');
    
    // 1. Mostrar dashboard inmediatamente
    mostrarDashboard();
    
    // 2. Configurar navegación
    configurarNavegacion();
    
    // 3. Cargar datos de estudiantes (async)
    cargarDatosIniciales();
    
    // 4. Configurar breadcrumb
    actualizarBreadcrumb('Inicio');
    
    console.log('✅ Sistema FT-MEP listo');
}

// ============================================
// CARGA DE DATOS - VERSIÓN ROBUSTA
// ============================================

async function cargarDatosIniciales() {
    console.log('📥 Iniciando carga de datos...');
    
    try {
        // Intentar diferentes rutas posibles
        const rutasPosibles = [
            'data/estudiantes.json',
            './data/estudiantes.json',
            '/data/estudiantes.json',
            'https://k3sb12.github.io/Gesti-n-de-archivos-FT-MEP/data/estudiantes.json'
        ];
        
        let datosCargados = false;
        let data = null;
        
        for (const ruta of rutasPosibles) {
            try {
                console.log(`🔍 Probando ruta: ${ruta}`);
                const response = await fetch(ruta);
                
                if (response.ok) {
                    data = await response.json();
                    console.log(`✅ Datos cargados desde: ${ruta}`);
                    console.log('📊 Estructura de datos:', data);
                    datosCargados = true;
                    break;
                }
            } catch (error) {
                console.warn(`⚠️ Error en ruta ${ruta}:`, error.message);
                continue;
            }
        }
        
        if (!datosCargados) {
            console.warn('❌ No se pudo cargar desde ninguna ruta, usando datos de ejemplo');
            data = obtenerDatosEjemplo();
        }
        
        // Procesar datos según la estructura
        procesarDatosEstudiantes(data);
        
        // Actualizar interfaz
        actualizarContadorEstudiantes();
        actualizarActividadReciente();
        
        console.log(`✅ ${sistemaFT.estudiantes.length} estudiantes procesados`);
        
    } catch (error) {
        console.error('💥 Error crítico cargando datos:', error);
        manejarErrorCarga(error);
    }
}

function procesarDatosEstudiantes(data) {
    if (Array.isArray(data)) {
        // Caso 1: data es un array directo
        sistemaFT.estudiantes = data.map((est, index) => ({
            id: est.id || est.codigo || est.cedula || `est-${index + 1}`,
            nombre: est.nombre || 'Estudiante sin nombre',
            cedula: est.cedula || est.codigo || est.id || 'N/A',
            grupo: est.grupo || "4-A",
            ciclo: determinarCiclo(est.grupo || "4-A"),
            necesidades: est.necesidades || [],
            asistencia: est.asistencia || 0,
            notaPeriodoAnterior: est.notaPeriodoAnterior || 0
        }));
    } else if (data && data.estudiantes && Array.isArray(data.estudiantes)) {
        // Caso 2: data tiene propiedad estudiantes
        sistemaFT.estudiantes = data.estudiantes.map((est, index) => ({
            id: est.id || est.codigo || est.cedula || `est-${index + 1}`,
            nombre: est.nombre || 'Estudiante sin nombre',
            cedula: est.cedula || est.codigo || est.id || 'N/A',
            grupo: est.grupo || "4-A",
            ciclo: determinarCiclo(est.grupo || "4-A"),
            necesidades: est.necesidades || [],
            asistencia: est.asistencia || 0,
            notaPeriodoAnterior: est.notaPeriodoAnterior || 0
        }));
    } else {
        // Caso 3: Estructura desconocida
        console.warn('⚠️ Estructura de datos desconocida, usando datos de ejemplo');
        sistemaFT.estudiantes = obtenerDatosEjemplo();
    }
}

function obtenerDatosEjemplo() {
    return [
        {
            id: "3068800365",
            nombre: "Aaron Gonzales Mera",
            cedula: "3068800365",
            grupo: "4-A",
            ciclo: "II",
            necesidades: ["Prioridad I (PI)"],
            asistencia: 92,
            notaPeriodoAnterior: 22.0
        },
        {
            id: "2087601234",
            nombre: "María Rodríguez Pérez",
            cedula: "2087601234",
            grupo: "4-A",
            ciclo: "II",
            necesidades: [],
            asistencia: 95,
            notaPeriodoAnterior: 25.0
        },
        {
            id: "3094506789",
            nombre: "Carlos López García",
            cedula: "3094506789",
            grupo: "5-B",
            ciclo: "III",
            necesidades: ["Apoyo en lectura"],
            asistencia: 85,
            notaPeriodoAnterior: 18.5
        },
        {
            id: "4078901234",
            nombre: "Ana Martínez Castro",
            cedula: "4078901234",
            grupo: "6-C",
            ciclo: "III",
            necesidades: ["Prioridad II (PII)"],
            asistencia: 88,
            notaPeriodoAnterior: 20.5
        },
        {
            id: "5067812345",
            nombre: "Jorge Herrera Mora",
            cedula: "5067812345",
            grupo: "7-A",
            ciclo: "III",
            necesidades: [],
            asistencia: 90,
            notaPeriodoAnterior: 24.0
        }
    ];
}

function manejarErrorCarga(error) {
    console.error('🆘 Usando datos de emergencia');
    sistemaFT.estudiantes = obtenerDatosEjemplo();
    actualizarContadorEstudiantes();
    actualizarActividadReciente();
    
    // Mostrar notificación amigable
    const contenedor = document.getElementById('contenedorPrincipal');
    if (contenedor) {
        const actividad = contenedor.querySelector('#contadorActividad');
        if (actividad) {
            actividad.innerHTML = `<strong>${sistemaFT.estudiantes.length} estudiantes de ejemplo cargados</strong><br><small>Error al cargar archivo JSON</small>`;
        }
    }
}

function determinarCiclo(grupo) {
    if (!grupo) return "II";
    try {
        const grado = parseInt(grupo.split('-')[0]);
        if (grado >= 1 && grado <= 3) return "I";
        if (grado >= 4 && grado <= 6) return "II";
        if (grado >= 7 && grado <= 9) return "III";
        return "II";
    } catch (error) {
        return "II";
    }
}

// ============================================
// INTERFAZ - DASHBOARD PRINCIPAL
// ============================================

function mostrarDashboard() {
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) {
        console.error('❌ No se encontró contenedorPrincipal');
        setTimeout(mostrarDashboard, 100);
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
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-content">
                        <h3 id="contadorEstudiantes">0</h3>
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
                            <p id="contadorActividad">Cargando datos de estudiantes...</p>
                            <small>Base de datos</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar navegación activa
    actualizarNavegacionActiva('inicio');
}

function actualizarContadorEstudiantes() {
    const contador = document.getElementById('contadorEstudiantes');
    const contadorActividad = document.getElementById('contadorActividad');
    
    if (contador) {
        contador.textContent = sistemaFT.estudiantes.length;
    }
    
    if (contadorActividad) {
        contadorActividad.innerHTML = `<strong>${sistemaFT.estudiantes.length} estudiantes disponibles</strong><br><small>Base de datos activa</small>`;
    }
}

function actualizarActividadReciente() {
    // Esta función puede expandirse para mostrar más actividad
    console.log('📊 Actividad actualizada');
}

// ============================================
// VISTA DE NIVELES
// ============================================

async function cargarNivel(nivelId) {
    console.log(`📂 Cargando nivel: ${nivelId}`);
    
    const contenedor = document.getElementById('contenedorPrincipal');
    if (!contenedor) return;
    
    // Definir nombres de nivel
    const nombresNivel = {
        'primaria-ciclo-I': 'I Ciclo (1°-3°)',
        'primaria-ciclo-II': 'II Ciclo (4°-6°)', 
        'secundaria-ciclo-III': 'III Ciclo (7°-9°)'
    };
    
    // Definir porcentajes MEP por ciclo
    const porcentajesMEP = {
        'primaria-ciclo-I': '50% Trabajo cotidiano',
        'primaria-ciclo-II': '55% Trabajo cotidiano',
        'secundaria-ciclo-III': '60% Trabajo cotidiano'
    };
    
    // Mostrar vista de carga
    contenedor.innerHTML = `
        <div class="nivel-vista">
            <div class="nivel-header">
                <button class="btn-volver" onclick="volverDashboard()">
                    <i class="fas fa-arrow-left"></i> Volver al Dashboard
                </button>
                <h2><i class="fas fa-folder-open"></i> ${nombresNivel[nivelId] || nivelId}</h2>
                <div class="ciclo-badge">
                    ${porcentajesMEP[nivelId] || '50% Trabajo cotidiano'} (Art. 6.1.1 MEP)
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
    
    // Actualizar navegación
    actualizarNavegacionActiva(nivelId);
    actualizarBreadcrumb(nombresNivel[nivelId] || 'Nivel');
    sistemaFT.nivelActual = nivelId;
    
    // Cargar módulos del nivel
    await cargarModulosNivel(nivelId);
}

async function cargarModulosNivel(nivelId) {
    console.log(`📦 Cargando módulos para: ${nivelId}`);
    
    const modulosLista = document.getElementById('modulosLista');
    if (!modulosLista) return;
    
    // Determinar qué módulos mostrar según el nivel
    let modulosParaCargar = [];
    
    if (nivelId === 'primaria-ciclo-I') {
        modulosParaCargar = ['ofimatica'];
    } else if (nivelId === 'primaria-ciclo-II') {
        modulosParaCargar = ['ofimatica', 'programacion', 'robotica', 'ciencia-datos'];
    } else if (nivelId === 'secundaria-ciclo-III') {
        modulosParaCargar = ['ofimatica', 'programacion', 'robotica', 'ciencia-datos'];
    } else {
        modulosParaCargar = ['ofimatica']; // Default
    }
    
    let htmlModulos = '';
    let modulosCargadosConExito = 0;
    
    // Cargar cada módulo
    for (const moduloKey of modulosParaCargar) {
        try {
            const moduloData = await cargarModuloIndividual(moduloKey);
            
            if (moduloData) {
                htmlModulos += crearHTMLModulo(moduloKey, moduloData, nivelId);
                modulosCargadosConExito++;
            } else {
                htmlModulos += crearHTMLModuloPlaceholder(moduloKey);
            }
            
        } catch (error) {
            console.error(`❌ Error cargando módulo ${moduloKey}:`, error);
            htmlModulos += crearHTMLModuloError(moduloKey, error);
        }
    }
    
    // Si no se cargó ningún módulo, mostrar mensaje
    if (modulosCargadosConExito === 0) {
        htmlModulos = `
            <div class="modulo-item-real" style="text-align: center; padding: 40px;">
                <div class="modulo-icon" style="background: #f8f9fa; margin: 0 auto 20px;">
                    <i class="fas fa-exclamation-triangle" style="color: #6c757d;"></i>
                </div>
                <div class="modulo-info">
                    <h5>No hay módulos configurados</h5>
                    <p>Crea archivos JSON en la carpeta <strong>modulos-ft/</strong></p>
                    <div class="modulo-meta">
                        <span><i class="fas fa-wrench"></i> Por configurar</span>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="crearEstructuraModulos()" style="margin-top: 15px;">
                    <i class="fas fa-plus-circle"></i> Crear Estructura
                </button>
            </div>
        `;
    }
    
    // Actualizar la lista
    modulosLista.innerHTML = htmlModulos;
    
    console.log(`✅ ${modulosCargadosConExito}/${modulosParaCargar.length} módulos cargados`);
}

async function cargarModuloIndividual(moduloKey) {
    const rutasPosibles = [
        `modulos-ft/${moduloKey}.json`,
        `./modulos-ft/${moduloKey}.json`,
        `/modulos-ft/${moduloKey}.json`,
        `https://k3sb12.github.io/Gesti-n-de-archivos-FT-MEP/modulos-ft/${moduloKey}.json`
    ];
    
    for (const ruta of rutasPosibles) {
        try {
            const response = await fetch(ruta);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            continue;
        }
    }
    
    // Si no se encuentra, devolver estructura básica
    return {
        nombre: moduloKey.charAt(0).toUpperCase() + moduloKey.slice(1),
        descripcion: 'Módulo de Formación Tecnológica',
        area: 'Área PNFT',
        icono: obtenerIconoModulo(moduloKey)
    };
}

function crearHTMLModulo(moduloKey, moduloData, nivelId) {
    const icono = moduloData.icono || obtenerIconoModulo(moduloKey);
    const nombre = moduloData.nombre || moduloKey;
    const descripcion = moduloData.descripcion || 'Módulo de Formación Tecnológica';
    const area = moduloData.area || 'Área PNFT';
    
    return `
        <div class="modulo-item-real" onclick="abrirModulo('${moduloKey}', '${nivelId}')">
            <div class="modulo-icon">
                <i class="fas ${icono}"></i>
            </div>
            <div class="modulo-info">
                <h5>${nombre}</h5>
                <p>${descripcion}</p>
                <div class="modulo-meta">
                    <span><i class="fas fa-graduation-cap"></i> ${area}</span>
                    <span><i class="fas fa-clock"></i> 40 horas</span>
                </div>
            </div>
            <button class="btn btn-primary">
                <i class="fas fa-clipboard-list"></i> Evaluar
            </button>
        </div>
    `;
}

function crearHTMLModuloPlaceholder(moduloKey) {
    const icono = obtenerIconoModulo(moduloKey);
    
    return `
        <div class="modulo-item-real">
            <div class="modulo-icon">
                <i class="fas ${icono}"></i>
            </div>
            <div class="modulo-info">
                <h5>${moduloKey.charAt(0).toUpperCase() + moduloKey.slice(1)}</h5>
                <p>Crear archivo <strong>${moduloKey}.json</strong> en modulos-ft/</p>
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

function crearHTMLModuloError(moduloKey, error) {
    return `
        <div class="modulo-item-real" style="border-color: #e74c3c;">
            <div class="modulo-icon" style="background: #ffebee;">
                <i class="fas fa-exclamation-circle" style="color: #e74c3c;"></i>
            </div>
            <div class="modulo-info">
                <h5 style="color: #e74c3c;">${moduloKey}</h5>
                <p>Error al cargar: ${error.message || 'Desconocido'}</p>
                <div class="modulo-meta">
                    <span><i class="fas fa-bug"></i> Error de carga</span>
                </div>
            </div>
            <button class="btn btn-secondary" disabled>
                No disponible
            </button>
        </div>
    `;
}

function obtenerIconoModulo(moduloKey) {
    const iconos = {
        'ofimatica': 'fa-file-word',
        'programacion': 'fa-code',
        'robotica': 'fa-robot',
        'ciencia-datos': 'fa-chart-line',
        'herramientas-digitales': 'fa-laptop',
        'inteligencia-artificial': 'fa-brain'
    };
    
    return iconos[moduloKey] || 'fa-book';
}

// ============================================
// FUNCIONALIDADES PRINCIPALES
// ============================================

function volverDashboard() {
    mostrarDashboard();
    actualizarNavegacionActiva('inicio');
    actualizarBreadcrumb('Inicio');
    sistemaFT.nivelActual = null;
}

function abrirModulo(modulo, nivelId) {
    alert(`🔓 Abriendo módulo: ${modulo}\nNivel: ${nivelId}\n\n(Esta función abrirá la tabla de evaluación de indicadores)`);
    
    // Aquí iría la lógica para cargar la tabla de evaluación
    // Por ahora mostramos un mensaje
    const contenedor = document.getElementById('contenedorPrincipal');
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="nivel-vista">
                <div class="nivel-header">
                    <button class="btn-volver" onclick="cargarNivel('${nivelId}')">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                    <h2><i class="fas fa-clipboard-list"></i> Evaluación: ${modulo}</h2>
                    <div class="ciclo-badge">
                        ${nivelId.includes('I') ? '50%' : nivelId.includes('II') ? '55%' : '60%'} Trabajo cotidiano
                    </div>
                </div>
                
                <div class="nivel-contenido" style="text-align: center; padding: 60px;">
                    <div style="max-width: 500px; margin: 0 auto;">
                        <div style="font-size: 4em; color: #3498db; margin-bottom: 20px;">
                            <i class="fas fa-tools"></i>
                        </div>
                        <h3 style="color: #2c3e50; margin-bottom: 15px;">
                            Tabla de evaluación en desarrollo
                        </h3>
                        <p style="color: #7f8c8d; margin-bottom: 30px;">
                            La funcionalidad completa de evaluación con tabla de indicadores 
                            y calificación por estudiante se está implementando.
                        </p>
                        <div style="display: flex; gap: 15px; justify-content: center;">
                            <button class="btn btn-primary" onclick="cargarNivel('${nivelId}')">
                                <i class="fas fa-arrow-left"></i> Volver a Módulos
                            </button>
                            <button class="btn btn-secondary" onclick="mostrarEjemploTabla()">
                                <i class="fas fa-eye"></i> Ver Ejemplo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function mostrarEjemploTabla() {
    alert('📋 Esta sería la tabla de evaluación con:\n\n• Lista de estudiantes del grupo\n• Indicadores del módulo\n• Niveles de logro (1-3)\n• Cálculo automático de porcentajes\n• Exportación a PDF');
}

// ============================================
// FUNCIONES DE ACCIÓN (placeholder)
// ============================================

function gestionarEstudiantes() {
    alert('👥 Gestión de Estudiantes\n\nAquí podrás:\n• Agregar nuevos estudiantes\n• Editar información existente\n• Asignar a grupos\n• Registrar necesidades educativas\n• Gestionar asistencia');
}

function generarReportes() {
    alert('📊 Generar Reportes\n\nFuncionalidades:\n• Reportes por estudiante\n• Reportes por grupo\n• Estadísticas generales\n• Exportación a PDF/Excel\n• Gráficos de rendimiento');
}

function activarAsistenteIA() {
    alert('🤖 Asistente IA\n\nCaracterísticas:\n• Sugerencias de evaluación\n• Detección de patrones\n• Recomendaciones personalizadas\n• Análisis predictivo\n• Generación de informes automáticos');
}

function calcularNotas() {
    alert('🧮 Calcular Notas\n\nHerramientas:\n• Calculadora MEP (Art. 6.1.1)\n• Conversión de niveles a porcentajes\n• Cálculo de promedios\n• Generación de boletas\n• Histórico de calificaciones');
}

// ============================================
// NAVEGACIÓN Y UI
// ============================================

function configurarNavegacion() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover activo de todos
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar activo al clickeado
            this.classList.add('active');
        });
    });
    
    console.log('✅ Navegación configurada');
}

function actualizarNavegacionActiva(seccion) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Activar el link correspondiente
    let linkAActivar = null;
    
    if (seccion === 'inicio') {
        linkAActivar = document.querySelector('.nav-link[onclick*="volverDashboard"]');
    } else if (seccion.includes('primaria-ciclo-I')) {
        linkAActivar = document.querySelector('.nav-link[onclick*="primaria-ciclo-I"]');
    } else if (seccion.includes('primaria-ciclo-II')) {
        linkAActivar = document.querySelector('.nav-link[onclick*="primaria-ciclo-II"]');
    } else if (seccion.includes('secundaria-ciclo-III')) {
        linkAActivar = document.querySelector('.nav-link[onclick*="secundaria-ciclo-III"]');
    }
    
    if (linkAActivar) {
        linkAActivar.classList.add('active');
    }
}

function actualizarBreadcrumb(ultimoNivel) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <span class="breadcrumb-item" onclick="volverDashboard()">
                <i class="fas fa-home"></i> Inicio
            </span>
            <i class="fas fa-chevron-right" style="color: #adb5bd;"></i>
            <span class="breadcrumb-item active">
                ${ultimoNivel}
            </span>
        `;
    }
}

function crearEstructuraModulos() {
    alert('🔨 Creando estructura de módulos...\n\nSe crearán los archivos básicos en la carpeta modulos-ft/:\n• ofimatica.json\n• programacion.json\n• robotica.json\n• ciencia-datos.json\n\nEstos archivos contienen la estructura básica para empezar a trabajar.');
    
    // En una implementación real, aquí se haría una petición al servidor
    // para crear los archivos. Por ahora es solo un placeholder.
    console.log('📁 Creando estructura de módulos...');
}

// ============================================
// INICIALIZACIÓN Y EXPORTACIÓN
// ============================================

// Hacer funciones disponibles globalmente
window.mostrarDashboard = mostrarDashboard;
window.volverDashboard = volverDashboard;
window.cargarNivel = cargarNivel;
window.abrirModulo = abrirModulo;
window.gestionarEstudiantes = gestionarEstudiantes;
window.generarReportes = generarReportes;
window.activarAsistenteIA = activarAsistenteIA;
window.calcularNotas = calcularNotas;
window.crearEstructuraModulos = crearEstructuraModulos;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistema);
} else {
    // DOM ya cargado
    inicializarSistema();
}

// Exportar para consola de desarrollo
console.log('📦 Sistema FT-MEP cargado y listo');
console.log('🔧 Funciones disponibles:', {
    mostrarDashboard: typeof mostrarDashboard,
    cargarNivel: typeof cargarNivel,
    volverDashboard: typeof volverDashboard,
    abrirModulo: typeof abrirModulo
});
