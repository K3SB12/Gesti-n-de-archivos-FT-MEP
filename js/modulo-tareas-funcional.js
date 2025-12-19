// ============================================
// MÓDULO DE TAREAS FUNCIONAL
// Sistema completamente operativo
// ============================================

// Sistema de tareas integrado con el principal
if (typeof sistemaFT === 'undefined') {
    console.error('Error: sistemaFT no está definido');
} else {
    // Inicializar tareas si no existen
    if (!sistemaFT.tareas) {
        sistemaFT.tareas = JSON.parse(localStorage.getItem('ft_tareas')) || {};
    }
}

// Lista de tareas predefinidas
const TAREAS_PREDEFINIDAS = [
    {
        id: 'tarea-001',
        nombre: 'Investigación sobre Inteligencia Artificial',
        descripcion: 'Investigar y presentar sobre aplicaciones de IA en la vida cotidiana',
        tipo: 'investigacion',
        fechaEntrega: '2024-04-15',
        puntajeMaximo: 100,
        criterios: [
            { nombre: 'Contenido', peso: 40 },
            { nombre: 'Presentación', peso: 30 },
            { nombre: 'Creatividad', peso: 30 }
        ]
    },
    {
        id: 'tarea-002',
        nombre: 'Programa básico en Scratch',
        descripcion: 'Crear un programa interactivo en Scratch que resuelva un problema simple',
        tipo: 'practica',
        fechaEntrega: '2024-04-20',
        puntajeMaximo: 100,
        criterios: [
            { nombre: 'Funcionalidad', peso: 50 },
            { nombre: 'Lógica', peso: 30 },
            { nombre: 'Diseño', peso: 20 }
        ]
    },
    {
        id: 'tarea-003',
        nombre: 'Análisis de datos con hoja de cálculo',
        descripcion: 'Analizar conjunto de datos y crear gráficos estadísticos',
        tipo: 'analisis',
        fechaEntrega: '2024-04-25',
        puntajeMaximo: 100,
        criterios: [
            { nombre: 'Análisis', peso: 40 },
            { nombre: 'Gráficos', peso: 30 },
            { nombre: 'Conclusiones', peso: 30 }
        ]
    }
];

function cargarModuloTareasFuncional() {
    const contenedor = document.getElementById('contenedorPrincipal');
    const periodo = sistemaFT.periodoActual;
    const ciclo = sistemaFT.nivelActual;
    
    // Filtrar estudiantes del ciclo actual
    const estudiantesCiclo = sistemaFT.estudiantes.filter(e => e.ciclo === ciclo);
    
    contenedor.innerHTML = `
        <div class="modulo-tareas-funcional">
            <div class="modulo-header">
                <button class="btn-volver" onclick="mostrarDashboardCompleto()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <div>
                    <h2><i class="fas fa-tasks"></i> Tareas - Funcional</h2>
                    <p class="modulo-subtitulo">10% de la nota final | Ciclo ${ciclo} | ${estudiantesCiclo.length} estudiantes</p>
                </div>
                <div class="modulo-actions">
                    <button class="btn btn-primary" onclick="crearNuevaTareaFuncional()">
                        <i class="fas fa-plus"></i> Nueva Tarea
                    </button>
                    <button class="btn btn-outline" onclick="asignarTareaATodos()">
                        <i class="fas fa-users"></i> Asignar a Todos
                    </button>
                </div>
            </div>
            
            <div class="tareas-alertas">
                <div class="alerta alerta-success">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>Sistema completamente funcional</strong>
                        <p>Las calificaciones se guardan automáticamente. Use el botón "Asignar a Todos" para comenzar rápido.</p>
                    </div>
                </div>
            </div>
            
            <div class="tareas-container">
                <!-- Panel izquierdo: Lista de tareas -->
                <div class="tareas-lista-panel">
                    <div class="panel-header">
                        <h3><i class="fas fa-list"></i> Tareas Activas</h3>
                        <button class="btn btn-sm btn-outline" onclick="crearNuevaTareaFuncional()">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    
                    <div class="tareas-lista-contenido" id="listaTareasActivas">
                        <!-- Tareas se cargarán aquí -->
                        ${generarListaTareasHTML()}
                    </div>
                </div>
                
                <!-- Panel principal: Evaluación -->
                <div class="tareas-evaluacion-panel">
                    <div class="evaluacion-header">
                        <h3 id="nombreTareaSeleccionada">Seleccione una tarea</h3>
                        <div class="tareas-stats">
                            <div class="stat-mini">
                                <i class="fas fa-user-check"></i>
                                <span id="contadorEntregadasTarea">0</span> entregadas
                            </div>
                            <div class="stat-mini">
                                <i class="fas fa-clock"></i>
                                <span id="contadorPendientesTarea">0</span> pendientes
                            </div>
                            <div class="stat-mini">
                                <i class="fas fa-percentage"></i>
                                <span id="promedioTarea">0.0</span> promedio
                            </div>
                        </div>
                    </div>
                    
                    <div class="tareas-table-container">
                        <table class="tareas-table-funcional" id="tablaTareasEvaluacion">
                            <thead>
                                <tr>
                                    <th class="col-estudiante">Estudiante</th>
                                    <th class="col-grupo">Grupo</th>
                                    <th class="col-estado">Estado</th>
                                    <th class="col-calificacion">Calificación</th>
                                    <th class="col-aporte">10% Aporte</th>
                                    <th class="col-acciones">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="cuerpoTablaTareas">
                                <!-- Estudiantes se cargarán aquí -->
                                ${generarFilasEstudiantesTareas(estudiantesCiclo)}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="tareas-resumen">
                        <div class="resumen-card">
                            <h4><i class="fas fa-chart-pie"></i> Resumen de Tareas</h4>
                            <div class="resumen-grid">
                                <div class="resumen-item">
                                    <span class="resumen-label">Promedio General:</span>
                                    <span class="resumen-value" id="promedioGeneralTareas">0.0</span>
                                </div>
                                <div class="resumen-item">
                                    <span class="resumen-label">Aporte Nota Final:</span>
                                    <span class="resumen-value" id="aporteNotaTareas">0.0</span>
                                </div>
                                <div class="resumen-item">
                                    <span class="resumen-label">Porcentaje Entregas:</span>
                                    <span class="resumen-value" id="porcentajeEntregas">0%</span>
                                </div>
                                <div class="resumen-item">
                                    <span class="resumen-label">Tareas Activas:</span>
                                    <span class="resumen-value">${TAREAS_PREDEFINIDAS.length}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tareas-acciones">
                            <button class="btn btn-primary" onclick="guardarTodasLasTareas()">
                                <i class="fas fa-save"></i> Guardar Todo
                            </button>
                            <button class="btn btn-success" onclick="calcularPromedioTareas()">
                                <i class="fas fa-calculator"></i> Calcular
                            </button>
                            <button class="btn btn-outline" onclick="exportarTareasCSV()">
                                <i class="fas fa-file-export"></i> Exportar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Configurar eventos
    configurarEventosTareas();
    
    // Seleccionar primera tarea por defecto
    if (TAREAS_PREDEFINIDAS.length > 0) {
        seleccionarTarea(TAREAS_PREDEFINIDAS[0].id);
    }
}

function generarListaTareasHTML() {
    return TAREAS_PREDEFINIDAS.map(tarea => `
        <div class="tarea-item-lista ${TAREAS_PREDEFINIDAS[0].id === tarea.id ? 'activa' : ''}" 
             data-tarea-id="${tarea.id}"
             onclick="seleccionarTarea('${tarea.id}')">
            <div class="tarea-icon-lista">
                <i class="fas fa-${obtenerIconoTarea(tarea.tipo)}"></i>
            </div>
            <div class="tarea-info-lista">
                <h4>${tarea.nombre}</h4>
                <div class="tarea-meta">
                    <span class="tarea-fecha"><i class="far fa-calendar"></i> ${tarea.fechaEntrega}</span>
                    <span class="tarea-tipo">${tarea.tipo}</span>
                </div>
                <div class="tarea-progreso">
                    <div class="progress-bar pequeño">
                        <div class="progress-fill" style="width: ${calcularProgresoTarea(tarea.id)}%"></div>
                    </div>
                    <span>${calcularProgresoTarea(tarea.id)}% evaluado</span>
                </div>
            </div>
            <div class="tarea-badge-lista">
                <span class="badge-puntaje">${tarea.puntajeMaximo} pts</span>
            </div>
        </div>
    `).join('');
}

function generarFilasEstudiantesTareas(estudiantes) {
    if (estudiantes.length === 0) {
        return `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="sin-estudiantes">
                        <i class="fas fa-user-slash"></i>
                        <p>No hay estudiantes en este ciclo</p>
                    </div>
                </td>
            </tr>
        `;
    }
    
    return estudiantes.map(est => {
        // Datos por defecto para la primera tarea
        const tareaId = TAREAS_PREDEFINIDAS[0]?.id;
        const tareaData = obtenerTareaEstudiante(est.id, tareaId);
        
        return `
            <tr data-estudiante-id="${est.id}" data-tarea-id="${tareaId}">
                <td class="col-estudiante">
                    <div class="estudiante-cell">
                        <strong>${est.nombre}</strong>
                        <small>${est.cedula}</small>
                    </div>
                </td>
                <td class="col-grupo">${est.grupo}</td>
                <td class="col-estado">
                    <span class="estado-tarea ${tareaData.entregada ? 'entregada' : 'pendiente'}">
                        <i class="fas fa-${tareaData.entregada ? 'check-circle' : 'clock'}"></i>
                        ${tareaData.entregada ? 'Entregada' : 'Pendiente'}
                    </span>
                </td>
                <td class="col-calificacion">
                    <div class="calificacion-input-container">
                        <input type="number" 
                               class="calificacion-tarea-input"
                               min="0" 
                               max="${TAREAS_PREDEFINIDAS[0]?.puntajeMaximo || 100}"
                               value="${tareaData.calificacion || 0}"
                               onchange="actualizarCalificacionTarea('${est.id}', '${tareaId}', this.value)"
                               ${!tareaData.entregada ? 'disabled' : ''}>
                        <span class="calificacion-max">/${TAREAS_PREDEFINIDAS[0]?.puntajeMaximo || 100}</span>
                    </div>
                </td>
                <td class="col-aporte">
                    <span class="aporte-tarea">${calcularAporteTarea(tareaData.calificacion || 0)}</span>
                </td>
                <td class="col-acciones">
                    <button class="btn-icon ${tareaData.entregada ? 'btn-success' : 'btn-outline'}" 
                            onclick="cambiarEstadoTarea('${est.id}', '${tareaId}', ${!tareaData.entregada})"
                            title="${tareaData.entregada ? 'Marcar como pendiente' : 'Marcar como entregada'}">
                        <i class="fas fa-${tareaData.entregada ? 'check' : 'times'}"></i>
                    </button>
                    <button class="btn-icon" onclick="verDetalleTareaEstudiante('${est.id}', '${tareaId}')" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Funciones principales
function seleccionarTarea(tareaId) {
    // Actualizar lista visual
    document.querySelectorAll('.tarea-item-lista').forEach(item => {
        item.classList.remove('activa');
        if (item.dataset.tareaId === tareaId) {
            item.classList.add('activa');
        }
    });
    
    // Obtener datos de la tarea
    const tarea = TAREAS_PREDEFINIDAS.find(t => t.id === tareaId);
    if (!tarea) return;
    
    // Actualizar header
    document.getElementById('nombreTareaSeleccionada').innerHTML = `
        <i class="fas fa-${obtenerIconoTarea(tarea.tipo)}"></i> ${tarea.nombre}
        <small>${tarea.descripcion}</small>
    `;
    
    // Actualizar filas de estudiantes
    const estudiantesCiclo = sistemaFT.estudiantes.filter(e => e.ciclo === sistemaFT.nivelActual);
    const tbody = document.getElementById('cuerpoTablaTareas');
    
    if (tbody) {
        tbody.innerHTML = estudiantesCiclo.map(est => {
            const tareaData = obtenerTareaEstudiante(est.id, tareaId);
            
            return `
                <tr data-estudiante-id="${est.id}" data-tarea-id="${tareaId}">
                    <td class="col-estudiante">
                        <div class="estudiante-cell">
                            <strong>${est.nombre}</strong>
                            <small>${est.cedula}</small>
                        </div>
                    </td>
                    <td class="col-grupo">${est.grupo}</td>
                    <td class="col-estado">
                        <span class="estado-tarea ${tareaData.entregada ? 'entregada' : 'pendiente'}">
                            <i class="fas fa-${tareaData.entregada ? 'check-circle' : 'clock'}"></i>
                            ${tareaData.entregada ? 'Entregada' : 'Pendiente'}
                        </span>
                    </td>
                    <td class="col-calificacion">
                        <div class="calificacion-input-container">
                            <input type="number" 
                                   class="calificacion-tarea-input"
                                   min="0" 
                                   max="${tarea.puntajeMaximo}"
                                   value="${tareaData.calificacion || 0}"
                                   onchange="actualizarCalificacionTarea('${est.id}', '${tareaId}', this.value)"
                                   ${!tareaData.entregada ? 'disabled' : ''}>
                            <span class="calificacion-max">/${tarea.puntajeMaximo}</span>
                        </div>
                    </td>
                    <td class="col-aporte">
                        <span class="aporte-tarea">${calcularAporteTarea(tareaData.calificacion || 0, tarea.puntajeMaximo)}</span>
                    </td>
                    <td class="col-acciones">
                        <button class="btn-icon ${tareaData.entregada ? 'btn-success' : 'btn-outline'}" 
                                onclick="cambiarEstadoTarea('${est.id}', '${tareaId}', ${!tareaData.entregada})"
                                title="${tareaData.entregada ? 'Marcar como pendiente' : 'Marcar como entregada'}">
                            <i class="fas fa-${tareaData.entregada ? 'check' : 'times'}"></i>
                        </button>
                        <button class="btn-icon" onclick="verDetalleTareaEstudiante('${est.id}', '${tareaId}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    // Calcular estadísticas
    calcularEstadisticasTarea(tareaId);
}

function obtenerTareaEstudiante(estudianteId, tareaId) {
    const periodo = sistemaFT.periodoActual;
    
    if (sistemaFT.tareas[periodo] && 
        sistemaFT.tareas[periodo][estudianteId] && 
        sistemaFT.tareas[periodo][estudianteId][tareaId]) {
        
        return sistemaFT.tareas[periodo][estudianteId][tareaId];
    }
    
    // Datos por defecto
    return {
        entregada: false,
        calificacion: 0,
        fechaEntrega: null,
        observaciones: ''
    };
}

function actualizarCalificacionTarea(estudianteId, tareaId, calificacion) {
    const periodo = sistemaFT.periodoActual;
    const valor = parseInt(calificacion) || 0;
    const tarea = TAREAS_PREDEFINIDAS.find(t => t.id === tareaId);
    const valorFinal = Math.min(valor, tarea?.puntajeMaximo || 100);
    
    // Inicializar estructuras
    if (!sistemaFT.tareas[periodo]) sistemaFT.tareas[periodo] = {};
    if (!sistemaFT.tareas[periodo][estudianteId]) sistemaFT.tareas[periodo][estudianteId] = {};
    
    // Actualizar tarea
    sistemaFT.tareas[periodo][estudianteId][tareaId] = {
        ...sistemaFT.tareas[periodo][estudianteId][tareaId],
        calificacion: valorFinal,
        entregada: true,
        fechaCalificacion: new Date().toISOString()
    };
    
    // Guardar en localStorage
    localStorage.setItem('ft_tareas', JSON.stringify(sistemaFT.tareas));
    
    // Actualizar interfaz
    const aporteCell = document.querySelector(`[data-estudiante-id="${estudianteId}"][data-tarea-id="${tareaId}"] .aporte-tarea`);
    if (aporteCell) {
        aporteCell.textContent = calcularAporteTarea(valorFinal, tarea?.puntajeMaximo);
    }
    
    // Recalcular estadísticas
    calcularEstadisticasTarea(tareaId);
    
    mostrarNotificacion('✅ Calificación actualizada', 'success');
}

function cambiarEstadoTarea(estudianteId, tareaId, entregada) {
    const periodo = sistemaFT.periodoActual;
    const tarea = TAREAS_PREDEFINIDAS.find(t => t.id === tareaId);
    
    // Inicializar estructuras
    if (!sistemaFT.tareas[periodo]) sistemaFT.tareas[periodo] = {};
    if (!sistemaFT.tareas[periodo][estudianteId]) sistemaFT.tareas[periodo][estudianteId] = {};
    
    // Actualizar estado
    sistemaFT.tareas[periodo][estudianteId][tareaId] = {
        ...sistemaFT.tareas[periodo][estudianteId][tareaId],
        entregada: entregada,
        fechaEntrega: entregada ? new Date().toISOString() : null,
        calificacion: entregada ? (sistemaFT.tareas[periodo][estudianteId][tareaId]?.calificacion || 0) : 0
    };
    
    // Guardar en localStorage
    localStorage.setItem('ft_tareas', JSON.stringify(sistemaFT.tareas));
    
    // Actualizar interfaz
    const estadoCell = document.querySelector(`[data-estudiante-id="${estudianteId}"][data-tarea-id="${tareaId}"] .estado-tarea`);
    const inputCell = document.querySelector(`[data-estudiante-id="${estudianteId}"][data-tarea-id="${tareaId}"] .calificacion-tarea-input`);
    const botonCell = document.querySelector(`[data-estudiante-id="${estudianteId}"][data-tarea-id="${tareaId}"] .btn-icon`);
    
    if (estadoCell) {
        estadoCell.className = `estado-tarea ${entregada ? 'entregada' : 'pendiente'}`;
        estadoCell.innerHTML = `<i class="fas fa-${entregada ? 'check-circle' : 'clock'}"></i> ${entregada ? 'Entregada' : 'Pendiente'}`;
    }
    
    if (inputCell) {
        inputCell.disabled = !entregada;
        if (!entregada) inputCell.value = 0;
    }
    
    if (botonCell) {
        botonCell.className = `btn-icon ${entregada ? 'btn-success' : 'btn-outline'}`;
        botonCell.innerHTML = `<i class="fas fa-${entregada ? 'check' : 'times'}"></i>`;
        botonCell.onclick = () => cambiarEstadoTarea(estudianteId, tareaId, !entregada);
    }
    
    // Recalcular estadísticas
    calcularEstadisticasTarea(tareaId);
    
    mostrarNotificacion(`✅ Tarea ${entregada ? 'entregada' : 'pendiente'}`, 'success');
}

// Funciones auxiliares
function calcularAporteTarea(calificacion, maximo = 100) {
    // 10% de la nota final = (calificación / maximo) * 10
    const aporte = (calificacion / maximo) * 10;
    return aporte.toFixed(1);
}

function calcularProgresoTarea(tareaId) {
    const periodo = sistemaFT.periodoActual;
    const estudiantesCiclo = sistemaFT.estudiantes.filter(e => e.ciclo === sistemaFT.nivelActual);
    
    if (estudiantesCiclo.length === 0) return 0;
    
    let estudiantesEvaluados = 0;
    
    estudiantesCiclo.forEach(est => {
        if (sistemaFT.tareas[periodo] && 
            sistemaFT.tareas[periodo][est.id] && 
            sistemaFT.tareas[periodo][est.id][tareaId] &&
            sistemaFT.tareas[periodo][est.id][tareaId].calificacion > 0) {
            estudiantesEvaluados++;
        }
    });
    
    return Math.round((estudiantesEvaluados / estudiantesCiclo.length) * 100);
}

function calcularEstadisticasTarea(tareaId) {
    const periodo = sistemaFT.periodoActual;
    const estudiantesCiclo = sistemaFT.estudiantes.filter(e => e.ciclo === sistemaFT.nivelActual);
    const tarea = TAREAS_PREDEFINIDAS.find(t => t.id === tareaId);
    
    if (estudiantesCiclo.length === 0 || !tarea) return;
    
    let totalCalificaciones = 0;
    let totalEntregadas = 0;
    let estudiantesConCalificacion = 0;
    
    estudiantesCiclo.forEach(est => {
        const tareaData = obtenerTareaEstudiante(est.id, tareaId);
        
        if (tareaData.entregada) {
            totalEntregadas++;
            if (tareaData.calificacion > 0) {
                totalCalificaciones += tareaData.calificacion;
                estudiantesConCalificacion++;
            }
        }
    });
    
    const promedio = estudiantesConCalificacion > 0 ? 
        (totalCalificaciones / estudiantesConCalificacion).toFixed(1) : 0;
    
    const porcentajeEntregas = Math.round((totalEntregadas / estudiantesCiclo.length) * 100);
    const aportePromedio = ((promedio / tarea.puntajeMaximo) * 10).toFixed(1);
    
    // Actualizar estadísticas
    const contadorEntregadas = document.getElementById('contadorEntregadasTarea');
    const contadorPendientes = document.getElementById('contadorPendientesTarea');
    const promedioElement = document.getElementById('promedioTarea');
    const promedioGeneral = document.getElementById('promedioGeneralTareas');
    const aporteNota = document.getElementById('aporteNotaTareas');
    const porcentajeEntregasElem = document.getElementById('porcentajeEntregas');
    
    if (contadorEntregadas) contadorEntregadas.textContent = totalEntregadas;
    if (contadorPendientes) contadorPendientes.textContent = estudiantesCiclo.length - totalEntregadas;
    if (promedioElement) promedioElement.textContent = promedio;
    if (promedioGeneral) promedioGeneral.textContent = promedio;
    if (aporteNota) aporteNota.textContent = aportePromedio;
    if (porcentajeEntregasElem) porcentajeEntregasElem.textContent = `${porcentajeEntregas}%`;
}

function obtenerIconoTarea(tipo) {
    const iconos = {
        'investigacion': 'search',
        'practica': 'code',
        'analisis': 'chart-bar',
        'proyecto': 'project-diagram',
        'ejercicio': 'pen',
        'default': 'tasks'
    };
    return iconos[tipo] || iconos.default;
}

function configurarEventosTareas() {
    // Eventos para inputs de calificación
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('calificacion-tarea-input')) {
            const input = e.target;
            const max = parseInt(input.getAttribute('max')) || 100;
            const value = parseInt(input.value) || 0;
            
            if (value > max) {
                input.value = max;
                mostrarNotificacion(`La calificación máxima es ${max}`, 'warning');
            }
        }
    });
}

// Funciones de gestión
function crearNuevaTareaFuncional() {
    const nombre = prompt('Nombre de la nueva tarea:', 'Nueva tarea');
    if (!nombre) return;
    
    const fecha = prompt('Fecha de entrega (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!fecha) return;
    
    const nuevaTarea = {
        id: `tarea-${Date.now()}`,
        nombre: nombre,
        descripcion: 'Descripción de la tarea',
        tipo: 'default',
        fechaEntrega: fecha,
        puntajeMaximo: 100,
        criterios: [
            { nombre: 'Calidad', peso: 100 }
        ]
    };
    
    TAREAS_PREDEFINIDAS.push(nuevaTarea);
    
    // Actualizar interfaz
    const lista = document.getElementById('listaTareasActivas');
    if (lista) {
        lista.innerHTML = generarListaTareasHTML();
    }
    
    mostrarNotificacion('✅ Nueva tarea creada', 'success');
}

function asignarTareaATodos() {
    const tareaId = TAREAS_PREDEFINIDAS[0]?.id;
    if (!tareaId) return;
    
    const confirmar = confirm('¿Asignar esta tarea a todos los estudiantes del ciclo?');
    if (!confirmar) return;
    
    const estudiantesCiclo = sistemaFT.estudiantes.filter(e => e.ciclo === sistemaFT.nivelActual);
    const periodo = sistemaFT.periodoActual;
    
    estudiantesCiclo.forEach(est => {
        if (!sistemaFT.tareas[periodo]) sistemaFT.tareas[periodo] = {};
        if (!sistemaFT.tareas[periodo][est.id]) sistemaFT.tareas[periodo][est.id] = {};
        
        sistemaFT.tareas[periodo][est.id][tareaId] = {
            entregada: false,
            calificacion: 0,
            fechaAsignacion: new Date().toISOString(),
            observaciones: 'Asignada automáticamente'
        };
    });
    
    localStorage.setItem('ft_tareas', JSON.stringify(sistemaFT.tareas));
    
    // Actualizar tabla
    seleccionarTarea(tareaId);
    
    mostrarNotificacion(`✅ Tarea asignada a ${estudiantesCiclo.length} estudiantes`, 'success');
}

function guardarTodasLasTareas() {
    localStorage.setItem('ft_tareas', JSON.stringify(sistemaFT.tareas));
    mostrarNotificacion('✅ Todas las tareas guardadas', 'success');
}

function calcularPromedioTareas() {
    // Recalcular todas las estadísticas
    TAREAS_PREDEFINIDAS.forEach(tarea => {
        calcularEstadisticasTarea(tarea.id);
    });
    
    mostrarNotificacion('✅ Promedios calculados', 'success');
}

// Función global para ser llamada desde app-sprint2-corregido.js
window.cargarModuloTareasFuncional = cargarModuloTareasFuncional;
