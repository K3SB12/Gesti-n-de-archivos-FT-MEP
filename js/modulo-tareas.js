// ==============================================
// MÓDULO DE TAREAS - FT-MEP
// Sistema de gestión de tareas (10% de la nota)
// ==============================================

class ModuloTareas {
    constructor(estudiantes, sistema) {
        this.estudiantes = estudiantes;
        this.sistema = sistema;
        this.tareas = [];
        this.cargarTareasGuardadas();
    }
    
    cargarInterfaz() {
        const container = document.getElementById('tareas-container');
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h4><i class="fas fa-tasks"></i> Sistema de Tareas (10%)</h4>
                    <p>Gestión y calificación de tareas asignadas</p>
                </div>
                
                <div class="card-body">
                    <div class="tareas-actions mb-4">
                        <button class="btn-primary" onclick="moduloTareas.mostrarModalNuevaTarea()">
                            <i class="fas fa-plus"></i> Nueva Tarea
                        </button>
                        <button class="btn-secondary" onclick="moduloTareas.mostrarReporteTareas()">
                            <i class="fas fa-chart-bar"></i> Ver Reporte
                        </button>
                    </div>
                    
                    <div id="lista-tareas" class="mb-4">
                        <div class="loading-state">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Cargando tareas...</p>
                        </div>
                    </div>
                    
                    <div id="calificacion-tareas">
                        <h5><i class="fas fa-graduation-cap"></i> Calificación de Tareas</h5>
                        <p>Seleccione una tarea para calificar a los estudiantes.</p>
                    </div>
                </div>
            </div>
        `;
        
        this.cargarListaTareas();
    }
    
    mostrarModalNuevaTarea() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-plus-circle"></i> Nueva Tarea</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="form-nueva-tarea">
                        <div class="form-group">
                            <label class="form-label">Título de la Tarea *</label>
                            <input type="text" class="form-input" id="tarea-titulo" required 
                                   placeholder="Ej: Investigación sobre algoritmos">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Descripción</label>
                            <textarea class="form-textarea" id="tarea-descripcion" rows="3"
                                      placeholder="Describa los detalles de la tarea..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Área del PNFT</label>
                            <select class="form-select" id="tarea-area">
                                <option value="">Todas las áreas</option>
                                <option value="apropiacion">Apropiación tecnológica</option>
                                <option value="programacion">Programación y Algoritmos</option>
                                <option value="computacion">Computación física</option>
                                <option value="ciencia">Ciencia de datos</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Fecha de Entrega *</label>
                            <input type="date" class="form-input" id="tarea-fecha" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Puntaje Máximo *</label>
                            <input type="number" class="form-input" id="tarea-puntaje" 
                                   min="1" max="100" value="100" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Asignar a:</label>
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="tarea-todos" checked> Todos los estudiantes
                                </label>
                                <div id="lista-estudiantes-tarea" class="mt-2" style="display: none;">
                                    ${this.estudiantes.map(e => `
                                        <label class="checkbox-label">
                                            <input type="checkbox" name="estudiante" value="${e.id || e.nombre}">
                                            ${e.nombre} (${e.grado})
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button class="btn-primary" onclick="moduloTareas.crearTarea()">Crear Tarea</button>
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').appendChild(modal);
        
        // Configurar evento para mostrar/ocultar lista de estudiantes
        document.getElementById('tarea-todos').addEventListener('change', function() {
            const lista = document.getElementById('lista-estudiantes-tarea');
            lista.style.display = this.checked ? 'none' : 'block';
        });
    }
    
    crearTarea() {
        const titulo = document.getElementById('tarea-titulo').value;
        const descripcion = document.getElementById('tarea-descripcion').value;
        const area = document.getElementById('tarea-area').value;
        const fecha = document.getElementById('tarea-fecha').value;
        const puntaje = parseInt(document.getElementById('tarea-puntaje').value);
        
        if (!titulo || !fecha) {
            this.sistema.mostrarNotificacion('Complete los campos obligatorios', 'warning');
            return;
        }
        
        const nuevaTarea = {
            id: 'tarea_' + Date.now(),
            titulo,
            descripcion,
            area,
            fechaEntrega: fecha,
            puntajeMaximo: puntaje,
            fechaCreacion: new Date().toISOString().split('T')[0],
            estado: 'pendiente',
            calificaciones: {}
        };
        
        // Asignar estudiantes
        if (document.getElementById('tarea-todos').checked) {
            this.estudiantes.forEach(est => {
                nuevaTarea.calificaciones[est.id || est.nombre] = {
                    entregada: false,
                    puntaje: 0,
                    comentario: ''
                };
            });
        } else {
            const checkboxes = document.querySelectorAll('input[name="estudiante"]:checked');
            checkboxes.forEach(cb => {
                nuevaTarea.calificaciones[cb.value] = {
                    entregada: false,
                    puntaje: 0,
                    comentario: ''
                };
            });
        }
        
        this.tareas.push(nuevaTarea);
        this.guardarTareas();
        this.cargarListaTareas();
        
        document.querySelector('.modal').remove();
        this.sistema.mostrarNotificacion(`Tarea "${titulo}" creada exitosamente`, 'success');
    }
    
    cargarListaTareas() {
        const container = document.getElementById('lista-tareas');
        if (!container) return;
        
        if (this.tareas.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <p>No hay tareas creadas</p>
                    <button class="btn-secondary" onclick="moduloTareas.mostrarModalNuevaTarea()">
                        Crear primera tarea
                    </button>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Fecha Entrega</th>
                            <th>Puntaje</th>
                            <th>Estado</th>
                            <th>Entregadas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        this.tareas.forEach(tarea => {
            const entregadas = Object.values(tarea.calificaciones).filter(c => c.entregada).length;
            const total = Object.keys(tarea.calificaciones).length;
            const porcentaje = total > 0 ? Math.round((entregadas / total) * 100) : 0;
            
            html += `
                <tr>
                    <td>
                        <strong>${tarea.titulo}</strong>
                        ${tarea.descripcion ? `<br><small>${tarea.descripcion.substring(0, 50)}...</small>` : ''}
                    </td>
                    <td>${tarea.fechaEntrega}</td>
                    <td>${tarea.puntajeMaximo} pts</td>
                    <td>
                        <span class="badge ${tarea.estado === 'completada' ? 'badge-success' : 'badge-warning'}">
                            ${tarea.estado}
                        </span>
                    </td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${porcentaje}%"></div>
                        </div>
                        <small>${entregadas}/${total} (${porcentaje}%)</small>
                    </td>
                    <td>
                        <button class="btn-sm btn-primary" onclick="moduloTareas.calificarTarea('${tarea.id}')">
                            <i class="fas fa-edit"></i> Calificar
                        </button>
                        <button class="btn-sm btn-secondary" onclick="moduloTareas.verDetallesTarea('${tarea.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    calificarTarea(tareaId) {
        const tarea = this.tareas.find(t => t.id === tareaId);
        if (!tarea) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3><i class="fas fa-graduation-cap"></i> Calificar: ${tarea.titulo}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="calificacion-info mb-4">
                        <p><strong>Puntaje máximo:</strong> ${tarea.puntajeMaximo} puntos</p>
                        <p><strong>Fecha de entrega:</strong> ${tarea.fechaEntrega}</p>
                    </div>
                    
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    <th>Entregada</th>
                                    <th>Puntaje (0-${tarea.puntajeMaximo})</th>
                                    <th>%</th>
                                    <th>Comentario</th>
                                </tr>
                            </thead>
                            <tbody id="lista-calificaciones-tarea">
                                <!-- Se llena dinámicamente -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button class="btn-primary" onclick="moduloTareas.guardarCalificacionesTarea('${tareaId}')">
                        <i class="fas fa-save"></i> Guardar Calificaciones
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').appendChild(modal);
        
        // Llenar tabla de calificaciones
        this.cargarListaCalificaciones(tarea);
    }
    
    cargarListaCalificaciones(tarea) {
        const container = document.getElementById('lista-calificaciones-tarea');
        if (!container) return;
        
        let html = '';
        
        Object.entries(tarea.calificaciones).forEach(([estudianteId, calificacion]) => {
            const estudiante = this.estudiantes.find(e => 
                (e.id || e.nombre) === estudianteId
            ) || { nombre: estudianteId, grado: '' };
            
            const porcentaje = tarea.puntajeMaximo > 0 
                ? Math.round((calificacion.puntaje / tarea.puntajeMaximo) * 100) 
                : 0;
            
            html += `
                <tr>
                    <td>
                        <strong>${estudiante.nombre}</strong>
                        <br><small>${estudiante.grado}</small>
                    </td>
                    <td>
                        <label class="checkbox-label">
                            <input type="checkbox" 
                                   data-estudiante="${estudianteId}"
                                   ${calificacion.entregada ? 'checked' : ''}
                                   onchange="moduloTareas.actualizarEntregaTarea('${tarea.id}', '${estudianteId}', this.checked)">
                            Entregada
                        </label>
                    </td>
                    <td>
                        <input type="number" 
                               class="form-input" 
                               style="width: 80px;"
                               min="0" 
                               max="${tarea.puntajeMaximo}"
                               value="${calificacion.puntaje}"
                               data-estudiante="${estudianteId}"
                               onchange="moduloTareas.actualizarPuntajeTarea('${tarea.id}', '${estudianteId}', this.value)">
                    </td>
                    <td>
                        <span class="badge ${porcentaje >= 70 ? 'badge-success' : porcentaje >= 60 ? 'badge-warning' : 'badge-danger'}">
                            ${porcentaje}%
                        </span>
                    </td>
                    <td>
                        <input type="text" 
                               class="form-input" 
                               placeholder="Comentario..."
                               value="${calificacion.comentario || ''}"
                               data-estudiante="${estudianteId}"
                               onchange="moduloTareas.actualizarComentarioTarea('${tarea.id}', '${estudianteId}', this.value)">
                    </td>
                </tr>
            `;
        });
        
        container.innerHTML = html;
    }
    
    actualizarEntregaTarea(tareaId, estudianteId, entregada) {
        const tarea = this.tareas.find(t => t.id === tareaId);
        if (tarea && tarea.calificaciones[estudianteId]) {
            tarea.calificaciones[estudianteId].entregada = entregada;
        }
    }
    
    actualizarPuntajeTarea(tareaId, estudianteId, puntaje) {
        const tarea = this.tareas.find(t => t.id === tareaId);
        if (tarea && tarea.calificaciones[estudianteId]) {
            tarea.calificaciones[estudianteId].puntaje = parseInt(puntaje) || 0;
        }
    }
    
    actualizarComentarioTarea(tareaId, estudianteId, comentario) {
        const tarea = this.tareas.find(t => t.id === tareaId);
        if (tarea && tarea.calificaciones[estudianteId]) {
            tarea.calificaciones[estudianteId].comentario = comentario;
        }
    }
    
    guardarCalificacionesTarea(tareaId) {
        this.guardarTareas();
        this.sistema.mostrarNotificacion('Calificaciones guardadas exitosamente', 'success');
        document.querySelector('.modal').remove();
        
        // Actualizar lista de tareas
        this.cargarListaTareas();
    }
    
    verDetallesTarea(tareaId) {
        const tarea = this.tareas.find(t => t.id === tareaId);
        if (!tarea) return;
        
        alert(`Detalles de tarea: ${tarea.titulo}\n\nDescripción: ${tarea.descripcion || 'Sin descripción'}`);
    }
    
    mostrarReporteTareas() {
        if (this.tareas.length === 0) {
            this.sistema.mostrarNotificacion('No hay tareas para generar reporte', 'warning');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h3><i class="fas fa-chart-bar"></i> Reporte de Tareas</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="contenido-reporte-tareas">
                        <div class="loading-state">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Generando reporte...</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cerrar</button>
                    <button class="btn-primary" onclick="moduloTareas.exportarReporteTareas()">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').appendChild(modal);
        
        // Generar reporte
        this.generarContenidoReporte();
    }
    
    generarContenidoReporte() {
        const container = document.getElementById('contenido-reporte-tareas');
        if (!container) return;
        
        // Calcular estadísticas
        let totalTareas = this.tareas.length;
        let totalPuntos = this.tareas.reduce((sum, t) => sum + t.puntajeMaximo, 0);
        let promedioPuntos = totalTareas > 0 ? totalPuntos / totalTareas : 0;
        
        // Calcular por estudiante
        const estadisticasEstudiantes = {};
        
        this.estudiantes.forEach(est => {
            const estudianteId = est.id || est.nombre;
            let tareasAsignadas = 0;
            let tareasEntregadas = 0;
            let puntosObtenidos = 0;
            let puntosPosibles = 0;
            
            this.tareas.forEach(tarea => {
                if (tarea.calificaciones[estudianteId]) {
                    tareasAsignadas++;
                    puntosPosibles += tarea.puntajeMaximo;
                    
                    if (tarea.calificaciones[estudianteId].entregada) {
                        tareasEntregadas++;
                        puntosObtenidos += tarea.calificaciones[estudianteId].puntaje;
                    }
                }
            });
            
            const porcentajeEntrega = tareasAsignadas > 0 ? (tareasEntregadas / tareasAsignadas) * 100 : 0;
            const porcentajePuntos = puntosPosibles > 0 ? (puntosObtenidos / puntosPosibles) * 100 : 0;
            
            estadisticasEstudiantes[estudianteId] = {
                nombre: est.nombre,
                tareasAsignadas,
                tareasEntregadas,
                porcentajeEntrega,
                puntosObtenidos,
                puntosPosibles,
                porcentajePuntos
            };
        });
        
        let html = `
            <h4>Resumen General</h4>
            <div class="stats-grid mb-4">
                <div class="stat-item">
                    <span class="stat-value">${totalTareas}</span>
                    <span class="stat-label">Tareas Totales</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${promedioPuntos.toFixed(0)}</span>
                    <span class="stat-label">Promedio puntos</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${totalPuntos}</span>
                    <span class="stat-label">Puntos totales</span>
                </div>
            </div>
            
            <h4>Estadísticas por Estudiante</h4>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Estudiante</th>
                            <th>Tareas Asignadas</th>
                            <th>Tareas Entregadas</th>
                            <th>% Entrega</th>
                            <th>Puntos Obtenidos</th>
                            <th>% Puntos</th>
                            <th>Nota Tareas</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        Object.values(estadisticasEstudiantes).forEach(est => {
            const notaTareas = est.porcentajePuntos; // El porcentaje es la nota
            
            html += `
                <tr>
                    <td><strong>${est.nombre}</strong></td>
                    <td>${est.tareasAsignadas}</td>
                    <td>${est.tareasEntregadas}</td>
                    <td>
                        <span class="badge ${est.porcentajeEntrega >= 80 ? 'badge-success' : est.porcentajeEntrega >= 60 ? 'badge-warning' : 'badge-danger'}">
                            ${est.porcentajeEntrega.toFixed(1)}%
                        </span>
                    </td>
                    <td>${est.puntosObtenidos}/${est.puntosPosibles}</td>
                    <td>
                        <span class="badge ${est.porcentajePuntos >= 70 ? 'badge-success' : est.porcentajePuntos >= 60 ? 'badge-warning' : 'badge-danger'}">
                            ${est.porcentajePuntos.toFixed(1)}%
                        </span>
                    </td>
                    <td><strong>${notaTareas.toFixed(1)}</strong></td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            
            <div class="mt-4">
                <p><strong>Nota:</strong> La nota de tareas es el 10% de la calificación final.</p>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    exportarReporteTareas() {
        // En una implementación real, aquí se generaría un archivo CSV o Excel
        alert('Exportando reporte de tareas...');
        this.sistema.mostrarNotificacion('Reporte exportado exitosamente', 'success');
    }
    
    // ===== PERSISTENCIA =====
    guardarTareas() {
        try {
            localStorage.setItem('ftmep_tareas', JSON.stringify(this.tareas));
        } catch (error) {
            console.error('Error guardando tareas:', error);
        }
    }
    
    cargarTareasGuardadas() {
        try {
            const saved = localStorage.getItem('ftmep_tareas');
            if (saved) {
                this.tareas = JSON.parse(saved);
                console.log(`✅ ${this.tareas.length} tareas cargadas`);
            }
        } catch (error) {
            console.error('Error cargando tareas:', error);
        }
    }
    
    // ===== CÁLCULO DE NOTA TAREAS =====
    calcularNotaTareasEstudiante(estudianteId) {
        let totalPuntosObtenidos = 0;
        let totalPuntosPosibles = 0;
        let tareasConPuntaje = 0;
        
        this.tareas.forEach(tarea => {
            const calificacion = tarea.calificaciones[estudianteId];
            if (calificacion && calificacion.entregada) {
                totalPuntosObtenidos += calificacion.puntaje;
                totalPuntosPosibles += tarea.puntajeMaximo;
                tareasConPuntaje++;
            }
        });
        
        if (totalPuntosPosibles === 0) return null;
        
        const porcentaje = (totalPuntosObtenidos / totalPuntosPosibles) * 100;
        return porcentaje;
    }
}

// Hacer disponible globalmente
let moduloTareas;
