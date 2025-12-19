// ==============================================
// SISTEMA FT-MEP - SPRINT 2
// Núcleo principal de la aplicación
// ==============================================

class SistemaFTMEP {
    constructor() {
        this.currentCycle = 'III';
        this.currentArea = null;
        this.currentPeriod = 'semana1';
        this.estudiantes = [];
        this.moduloData = null;
        this.evaluaciones = {
            trabajoCotidiano: {},
            tareas: [],
            proyecto: {},
            pruebas: {},
            asistencia: {}
        };
        
        this.init();
    }
    
    // ===== INICIALIZACIÓN =====
    async init() {
        console.log('🚀 Iniciando Sistema FT-MEP Sprint 2');
        
        // Cargar datos iniciales
        await this.cargarDatos();
        
        // Configurar event listeners
        this.configurarEventos();
        
        // Cargar evaluaciones guardadas
        this.cargarEvaluacionesGuardadas();
        
        // Actualizar dashboard
        this.actualizarDashboard();
        
        console.log('✅ Sistema inicializado correctamente');
    }
    
    async cargarDatos() {
        try {
            // Cargar estudiantes
            const response = await fetch('data/estudiantes.json');
            this.estudiantes = await response.json();
            console.log(`✅ Cargados ${this.estudiantes.length} estudiantes`);
            
            // Inicializar módulos
            await this.inicializarModulos();
            
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            this.mostrarError('Error al cargar los datos. Verifica la conexión.');
        }
    }
    
    async inicializarModulos() {
        // Inicializar módulos de evaluación
        if (typeof ModuloTareas !== 'undefined') {
            this.moduloTareas = new ModuloTareas(this.estudiantes, this);
        }
        
        if (typeof ModuloProyecto !== 'undefined') {
            this.moduloProyecto = new ModuloProyecto(this.estudiantes, this);
        }
        
        if (typeof ModuloAsistencia !== 'undefined') {
            this.moduloAsistencia = new ModuloAsistencia(this.estudiantes, this);
        }
    }
    
    // ===== CONFIGURACIÓN DE EVENTOS =====
    configurarEventos() {
        // Navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.cambiarSeccion(e.target.dataset.section));
        });
        
        // Selector de ciclo
        document.querySelectorAll('.cycle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.cambiarCiclo(e.target.dataset.cycle));
        });
        
        // Selector de área
        const areaSelect = document.getElementById('area-select');
        if (areaSelect) {
            areaSelect.addEventListener('change', (e) => this.cargarAreaEvaluacion(e.target.value));
        }
        
        // Guardar trabajo cotidiano
        const saveBtn = document.getElementById('save-tc');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.guardarTrabajoCotidiano());
        }
        
        // Cambiar período
        const periodBtn = document.getElementById('change-period');
        if (periodBtn) {
            periodBtn.addEventListener('click', () => this.cambiarPeriodo());
        }
        
        // Botones de acciones rápidas
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.ejecutarAccionRapida(e.target.dataset.action));
        });
    }
    
    // ===== GESTIÓN DE CICLOS =====
    cambiarCiclo(ciclo) {
        if (this.currentCycle === ciclo) return;
        
        // Actualizar botones activos
        document.querySelectorAll('.cycle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cycle === ciclo);
        });
        
        this.currentCycle = ciclo;
        console.log(`🔄 Cambiando a ${ciclo} Ciclo`);
        
        // Actualizar componentes según ciclo
        this.actualizarComponentesCiclo();
        
        // Actualizar dashboard
        this.actualizarDashboard();
        
        this.mostrarNotificacion(`Cambiado a ${ciclo} Ciclo`, 'success');
    }
    
    actualizarComponentesCiclo() {
        const componentsList = document.getElementById('components-list');
        if (!componentsList) return;
        
        const componentes = this.obtenerComponentesCiclo();
        componentsList.innerHTML = '';
        
        componentes.forEach(componente => {
            const div = document.createElement('div');
            div.className = 'component-item';
            div.innerHTML = `
                <div class="component-info">
                    <h4>${componente.nombre}</h4>
                    <p>${componente.descripcion}</p>
                </div>
                <div class="component-value ${componente.estado}">
                    ${componente.valor}
                </div>
            `;
            componentsList.appendChild(div);
        });
    }
    
    obtenerComponentesCiclo() {
        const baseComponents = [
            {
                nombre: 'Trabajo Cotidiano',
                descripcion: 'Evaluación formativa diaria',
                valor: this.getPorcentajeTC() + '%',
                estado: 'excellent'
            },
            {
                nombre: 'Tareas',
                descripcion: 'Actividades asignadas',
                valor: '10%',
                estado: 'good'
            },
            {
                nombre: 'Asistencia',
                descripcion: 'Registro de presencia',
                valor: '10%',
                estado: 'good'
            }
        ];
        
        if (this.currentCycle === 'III') {
            baseComponents.push({
                nombre: 'Proyecto',
                descripcion: 'Design Thinking - III Ciclo',
                valor: '30%',
                estado: 'info'
            });
        } else {
            baseComponents.push({
                nombre: 'Prueba de Ejecución',
                descripcion: this.currentCycle === 'I' ? '15% - I Ciclo' : '20% - II Ciclo',
                valor: this.currentCycle === 'I' ? '15%' : '20%',
                estado: 'warning'
            });
        }
        
        return baseComponents;
    }
    
    getPorcentajeTC() {
        switch(this.currentCycle) {
            case 'I': return 65;
            case 'II': return 60;
            case 'III': return 50;
            default: return 0;
        }
    }
    
    // ===== GESTIÓN DE SECCIONES =====
    cambiarSeccion(seccionId) {
        // Actualizar navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === seccionId);
        });
        
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar sección seleccionada
        const seccion = document.getElementById(seccionId);
        if (seccion) {
            seccion.classList.add('active');
            
            // Cargar contenido específico de la sección
            this.cargarContenidoSeccion(seccionId);
        }
        
        console.log(`📁 Cambiando a sección: ${seccionId}`);
    }
    
    cargarContenidoSeccion(seccionId) {
        switch(seccionId) {
            case 'trabajo-cotidiano':
                this.inicializarTrabajoCotidiano();
                break;
                
            case 'tareas':
                if (this.moduloTareas) {
                    this.moduloTareas.cargarInterfaz();
                }
                break;
                
            case 'proyecto-prueba':
                this.cargarProyectoPrueba();
                break;
                
            case 'asistencia':
                if (this.moduloAsistencia) {
                    this.moduloAsistencia.cargarInterfaz();
                }
                break;
                
            case 'nota-final':
                this.cargarNotaFinal();
                break;
                
            case 'comunicacion':
                this.cargarComunicacion();
                break;
        }
    }
    
    // ===== TRABAJO COTIDIANO =====
    async inicializarTrabajoCotidiano() {
        const container = document.getElementById('tc-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-clipboard-check"></i>
                <p>Seleccione un área del PNFT para evaluar</p>
                <small class="text-muted">Áreas: Apropiación tecnológica, Programación, Computación física, Ciencia de datos</small>
            </div>
        `;
        
        // Configurar selector de área
        this.configurarSelectorArea();
    }
    
    configurarSelectorArea() {
        const areaSelect = document.getElementById('area-select');
        if (!areaSelect) return;
        
        // Limpiar opciones existentes
        areaSelect.innerHTML = `
            <option value="">Seleccionar área...</option>
            <option value="apropiacion">Apropiación tecnológica y digital</option>
            <option value="programacion">Programación y Algoritmos</option>
            <option value="computacion">Computación física y Robótica</option>
            <option value="ciencia">Ciencia de datos e Inteligencia artificial</option>
        `;
        
        // Restaurar selección anterior si existe
        if (this.currentArea) {
            areaSelect.value = this.currentArea;
            this.cargarAreaEvaluacion(this.currentArea);
        }
    }
    
    async cargarAreaEvaluacion(area) {
        if (!area) return;
        
        this.currentArea = area;
        const container = document.getElementById('tc-container');
        
        container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando indicadores del área...</p>
            </div>
        `;
        
        try {
            // Cargar módulo correspondiente
            const moduleFile = this.getModuleFile(area);
            const response = await fetch(`modulos-ft/${moduleFile}`);
            this.moduloData = await response.json();
            
            // Generar tabla de evaluación
            this.generarTablaEvaluacion();
            
            console.log(`✅ Módulo ${area} cargado correctamente`);
            
        } catch (error) {
            console.error('❌ Error cargando módulo:', error);
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar los indicadores del área. Verifica que el archivo exista.</p>
                    <button class="btn-secondary mt-3" onclick="sistema.cargarAreaEvaluacion('${area}')">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
    
    getModuleFile(area) {
        const files = {
            'apropiacion': 'apropiacion-tecnologica.json',
            'programacion': 'programacion-algoritmos.json',
            'computacion': 'computacion-fisica.json',
            'ciencia': 'ciencia-datos.json'
        };
        return files[area] || 'apropiacion-tecnologica.json';
    }
    
    generarTablaEvaluacion() {
        const container = document.getElementById('tc-container');
        if (!this.moduloData || !this.estudiantes.length) return;
        
        // Obtener indicadores para el ciclo actual
        const cicloData = this.moduloData[this.currentCycle];
        if (!cicloData) {
            container.innerHTML = `<div class="warning-message">No hay datos para ${this.currentCycle} Ciclo</div>`;
            return;
        }
        
        // Generar tabla
        let html = `
            <div class="table-info mb-4">
                <h4><i class="fas fa-info-circle"></i> ${cicloData.nombre}</h4>
                <p>${cicloData.descripcion}</p>
                <div class="badge badge-primary">${this.getPorcentajeTC()}% de la nota final</div>
            </div>
            
            <div class="tc-table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Estudiante</th>
        `;
        
        // Columnas de indicadores
        if (cicloData.indicadores && cicloData.indicadores.length > 0) {
            cicloData.indicadores.forEach(ind => {
                html += `<th title="${ind.descripcion}">${ind.codigo}</th>`;
            });
        }
        
        html += `
                            <th>Promedio TC</th>
                            <th>% TC (${this.getPorcentajeTC()}%)</th>
                            <th>Nivel</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Filas de estudiantes
        this.estudiantes.forEach(estudiante => {
            const estudianteId = estudiante.id || estudiante.nombre.toLowerCase().replace(/\s+/g, '-');
            html += `<tr data-estudiante="${estudianteId}">`;
            html += `<td><strong>${estudiante.nombre}</strong><br><small>${estudiante.grado}</small></td>`;
            
            // Celdas de indicadores
            if (cicloData.indicadores) {
                cicloData.indicadores.forEach(ind => {
                    const calificacion = this.obtenerCalificacionTC(estudianteId, ind.id);
                    html += this.generarCeldaCalificacion(estudianteId, ind.id, calificacion);
                });
            }
            
            // Promedio
            const promedio = this.calcularPromedioTC(estudianteId);
            html += `
                <td class="text-center"><strong>${promedio.toFixed(2)}</strong></td>
                <td class="text-center">${(promedio * this.getPorcentajeTC() / 3).toFixed(2)}%</td>
                <td class="text-center">${this.obtenerNivel(promedio)}</td>
            `;
            
            html += `</tr>`;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            
            <div class="mt-4">
                <h5><i class="fas fa-info-circle"></i> Instrucciones:</h5>
                <p>Haz clic en cualquier celda para calificar: <span class="badge grade-3">Alto (3)</span> 
                <span class="badge grade-2">Medio (2)</span> <span class="badge grade-1">Bajo (1)</span></p>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Configurar eventos de las celdas
        this.configurarEventosCalificacion();
    }
    
    generarCeldaCalificacion(estudianteId, indicadorId, calificacion) {
        let clase = 'indicator-cell';
        let texto = '';
        
        if (calificacion === 3) {
            clase += ' grade-3';
            texto = 'Alto';
        } else if (calificacion === 2) {
            clase += ' grade-2';
            texto = 'Medio';
        } else if (calificacion === 1) {
            clase += ' grade-1';
            texto = 'Bajo';
        }
        
        return `
            <td class="${clase}" 
                data-estudiante="${estudianteId}"
                data-indicador="${indicadorId}"
                onclick="sistema.mostrarSelectorCalificacion(this)">
                ${texto || '—'}
            </td>
        `;
    }
    
    configurarEventosCalificacion() {
        // Los eventos se configuran mediante onclick en las celdas
    }
    
    mostrarSelectorCalificacion(celda) {
        const estudianteId = celda.dataset.estudiante;
        const indicadorId = celda.dataset.indicador;
        
        // Crear modal de calificación
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Calificar Indicador</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Estudiante: <strong>${this.obtenerNombreEstudiante(estudianteId)}</strong></p>
                    <p>Indicador: <strong>${this.obtenerNombreIndicador(indicadorId)}</strong></p>
                    
                    <div class="grade-options mt-4">
                        <button class="grade-option grade-3" onclick="sistema.asignarCalificacion('${estudianteId}', '${indicadorId}', 3)">
                            <strong>Alto (3)</strong><br>
                            <small>Realiza la tarea de forma autónoma y precisa</small>
                        </button>
                        <button class="grade-option grade-2" onclick="sistema.asignarCalificacion('${estudianteId}', '${indicadorId}', 2)">
                            <strong>Medio (2)</strong><br>
                            <small>Realiza la tarea con algo de ayuda</small>
                        </button>
                        <button class="grade-option grade-1" onclick="sistema.asignarCalificacion('${estudianteId}', '${indicadorId}', 1)">
                            <strong>Bajo (1)</strong><br>
                            <small>Requiere ayuda constante</small>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').appendChild(modal);
    }
    
    asignarCalificacion(estudianteId, indicadorId, calificacion) {
        // Guardar en memoria
        if (!this.evaluaciones.trabajoCotidiano[this.currentPeriod]) {
            this.evaluaciones.trabajoCotidiano[this.currentPeriod] = {};
        }
        
        if (!this.evaluaciones.trabajoCotidiano[this.currentPeriod][estudianteId]) {
            this.evaluaciones.trabajoCotidiano[this.currentPeriod][estudianteId] = {};
        }
        
        this.evaluaciones.trabajoCotidiano[this.currentPeriod][estudianteId][indicadorId] = calificacion;
        
        // Actualizar celda
        const celda = document.querySelector(`[data-estudiante="${estudianteId}"][data-indicador="${indicadorId}"]`);
        if (celda) {
            celda.className = `indicator-cell grade-${calificacion}`;
            celda.innerHTML = calificacion === 3 ? 'Alto' : calificacion === 2 ? 'Medio' : 'Bajo';
        }
        
        // Actualizar promedios
        this.actualizarPromediosEstudiante(estudianteId);
        
        // Cerrar modal
        document.querySelector('.modal')?.remove();
        
        this.mostrarNotificacion('Calificación guardada', 'success');
    }
    
    actualizarPromediosEstudiante(estudianteId) {
        const fila = document.querySelector(`[data-estudiante="${estudianteId}"]`);
        if (!fila) return;
        
        const promedio = this.calcularPromedioTC(estudianteId);
        const celdas = fila.querySelectorAll('td');
        
        // Actualizar promedio
        if (celdas[celdas.length - 3]) {
            celdas[celdas.length - 3].innerHTML = `<strong>${promedio.toFixed(2)}</strong>`;
        }
        
        // Actualizar porcentaje
        if (celdas[celdas.length - 2]) {
            celdas[celdas.length - 2].innerHTML = `${(promedio * this.getPorcentajeTC() / 3).toFixed(2)}%`;
        }
        
        // Actualizar nivel
        if (celdas[celdas.length - 1]) {
            celdas[celdas.length - 1].innerHTML = this.obtenerNivel(promedio);
        }
    }
    
    calcularPromedioTC(estudianteId) {
        const periodoData = this.evaluaciones.trabajoCotidiano[this.currentPeriod];
        if (!periodoData || !periodoData[estudianteId]) return 0;
        
        const calificaciones = Object.values(periodoData[estudianteId]);
        if (calificaciones.length === 0) return 0;
        
        const suma = calificaciones.reduce((a, b) => a + b, 0);
        return suma / calificaciones.length;
    }
    
    obtenerCalificacionTC(estudianteId, indicadorId) {
        const periodoData = this.evaluaciones.trabajoCotidiano[this.currentPeriod];
        if (!periodoData || !periodoData[estudianteId]) return 0;
        
        return periodoData[estudianteId][indicadorId] || 0;
    }
    
    obtenerNombreEstudiante(estudianteId) {
        const estudiante = this.estudiantes.find(e => 
            (e.id || e.nombre.toLowerCase().replace(/\s+/g, '-')) === estudianteId
        );
        return estudiante ? estudiante.nombre : estudianteId;
    }
    
    obtenerNombreIndicador(indicadorId) {
        if (!this.moduloData || !this.moduloData[this.currentCycle]) return indicadorId;
        
        const indicador = this.moduloData[this.currentCycle].indicadores?.find(i => i.id === indicadorId);
        return indicador ? `${indicador.codigo}: ${indicador.nombre}` : indicadorId;
    }
    
    obtenerNivel(promedio) {
        if (promedio >= 2.5) return '<span class="badge badge-success">Excelente</span>';
        if (promedio >= 2.0) return '<span class="badge badge-info">Bueno</span>';
        if (promedio >= 1.5) return '<span class="badge badge-warning">Aceptable</span>';
        return '<span class="badge badge-danger">Bajo</span>';
    }
    
    // ===== GESTIÓN DE PROYECTO/PRUEBA =====
    cargarProyectoPrueba() {
        const container = document.getElementById('proyecto-container');
        const title = document.getElementById('proyecto-title');
        const actions = document.getElementById('proyecto-actions');
        
        if (this.currentCycle === 'III') {
            title.innerHTML = '<i class="fas fa-project-diagram"></i> Proyecto III Ciclo (30%)';
            
            if (this.moduloProyecto) {
                this.moduloProyecto.cargarInterfaz();
            } else {
                container.innerHTML = `
                    <div class="warning-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Módulo de proyecto no cargado. Recarga la página.</p>
                    </div>
                `;
            }
        } else {
            const porcentaje = this.currentCycle === 'I' ? '15%' : '20%';
            title.innerHTML = `<i class="fas fa-clipboard-list"></i> Prueba de Ejecución ${this.currentCycle} Ciclo (${porcentaje})`;
            
            container.innerHTML = `
                <div class="card">
                    <h4>Prueba de Ejecución - ${this.currentCycle} Ciclo</h4>
                    <p>Este módulo evalúa la aplicación práctica de los conocimientos.</p>
                    
                    <div class="mt-4">
                        <button class="btn-primary" onclick="sistema.crearNuevaPrueba()">
                            <i class="fas fa-plus"></i> Crear Nueva Prueba
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    crearNuevaPrueba() {
        alert('Funcionalidad de Pruebas en desarrollo');
    }
    
    // ===== NOTA FINAL =====
    cargarNotaFinal() {
        const container = document.getElementById('nota-final-container');
        
        container.innerHTML = `
            <div class="card">
                <h4><i class="fas fa-calculator"></i> Cálculo de Nota Final</h4>
                <p>Integración de todos los componentes según el REA AC-CSE-259-28-2023</p>
                
                <div class="form-group mt-4">
                    <button class="btn-primary" onclick="sistema.calcularNotaFinal()">
                        <i class="fas fa-calculator"></i> Calcular Nota Final para Todos
                    </button>
                    <button class="btn-secondary" onclick="sistema.generarReporte()">
                        <i class="fas fa-file-export"></i> Generar Reporte
                    </button>
                </div>
                
                <div id="resultados-nota-final" class="mt-4"></div>
            </div>
        `;
    }
    
    calcularNotaFinal() {
        const resultadosDiv = document.getElementById('resultados-nota-final');
        
        // Calcular para cada estudiante
        const resultados = this.estudiantes.map(estudiante => {
            const estudianteId = estudiante.id || estudiante.nombre.toLowerCase().replace(/\s+/g, '-');
            const notaFinal = this.calcularNotaEstudiante(estudianteId);
            
            return {
                estudiante: estudiante.nombre,
                nota: notaFinal.toFixed(2),
                estado: notaFinal >= 70 ? 'Aprobado' : 'Reprobado'
            };
        });
        
        // Mostrar resultados
        let html = `
            <h5>Resultados del Cálculo</h5>
            <div class="table-container mt-3">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Estudiante</th>
                            <th>Nota Final</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        resultados.forEach(resultado => {
            html += `
                <tr>
                    <td>${resultado.estudiante}</td>
                    <td><strong>${resultado.nota}</strong></td>
                    <td>
                        ${resultado.estado === 'Aprobado' 
                            ? '<span class="badge badge-success">Aprobado</span>' 
                            : '<span class="badge badge-danger">Reprobado</span>'}
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            
            <div class="mt-3">
                <p><strong>Promedio del grupo:</strong> ${this.calcularPromedioGrupo(resultados).toFixed(2)}</p>
                <p><strong>Aprobados:</strong> ${resultados.filter(r => r.estado === 'Aprobado').length} de ${resultados.length}</p>
            </div>
        `;
        
        resultadosDiv.innerHTML = html;
        this.mostrarNotificacion('Nota final calculada para todos los estudiantes', 'success');
    }
    
    calcularNotaEstudiante(estudianteId) {
        let nota = 0;
        
        // Trabajo Cotidiano
        const promedioTC = this.calcularPromedioTC(estudianteId);
        const porcentajeTC = this.getPorcentajeTC();
        nota += (promedioTC / 3) * porcentajeTC;
        
        // Tareas (asumir 80% si no hay datos)
        const notaTareas = this.obtenerNotaTareas(estudianteId) || 80;
        nota += notaTareas * 0.10;
        
        // Asistencia (asumir 100% si no hay datos)
        const notaAsistencia = this.obtenerNotaAsistencia(estudianteId) || 100;
        nota += notaAsistencia * 0.10;
        
        // Proyecto o Prueba
        if (this.currentCycle === 'III') {
            const notaProyecto = this.obtenerNotaProyecto(estudianteId) || 70;
            nota += notaProyecto * 0.30;
        } else {
            const porcentajePrueba = this.currentCycle === 'I' ? 0.15 : 0.20;
            const notaPrueba = 70; // Valor por defecto
            nota += notaPrueba * porcentajePrueba;
        }
        
        return Math.min(100, Math.max(0, nota));
    }
    
    obtenerNotaTareas(estudianteId) {
        // Implementar lógica real
        return 80;
    }
    
    obtenerNotaAsistencia(estudianteId) {
        // Implementar lógica real
        return 100;
    }
    
    obtenerNotaProyecto(estudianteId) {
        // Implementar lógica real
        return 70;
    }
    
    calcularPromedioGrupo(resultados) {
        const suma = resultados.reduce((total, r) => total + parseFloat(r.nota), 0);
        return suma / resultados.length;
    }
    
    generarReporte() {
        alert('Generando reporte...');
        // Implementar generación de reporte
    }
    
    // ===== COMUNICACIÓN =====
    cargarComunicacion() {
        const container = document.getElementById('comunicacion-container');
        
        container.innerHTML = `
            <div class="card">
                <h4><i class="fas fa-comments"></i> Comunicación al Hogar</h4>
                <p>Sistema de comunicación con padres y encargados.</p>
                
                <div class="mt-4">
                    <div class="form-group">
                        <label class="form-label">Seleccionar Estudiante</label>
                        <select class="form-select" id="com-estudiante">
                            <option value="">Seleccionar estudiante...</option>
                            ${this.estudiantes.map(e => `<option value="${e.id || e.nombre}">${e.nombre}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Tipo de Comunicación</label>
                        <select class="form-select" id="com-tipo">
                            <option value="mensaje">Mensaje general</option>
                            <option value="felicitacion">Felicitación</option>
                            <option value="llamado">Llamado de atención</option>
                            <option value="reunion">Solicitud de reunión</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Mensaje</label>
                        <textarea class="form-textarea" id="com-mensaje" rows="4" placeholder="Escriba el mensaje aquí..."></textarea>
                    </div>
                    
                    <button class="btn-primary" onclick="sistema.enviarComunicacion()">
                        <i class="fas fa-paper-plane"></i> Enviar Comunicación
                    </button>
                </div>
            </div>
        `;
    }
    
    enviarComunicacion() {
        const estudiante = document.getElementById('com-estudiante').value;
        const tipo = document.getElementById('com-tipo').value;
        const mensaje = document.getElementById('com-mensaje').value;
        
        if (!estudiante || !mensaje) {
            this.mostrarNotificacion('Complete todos los campos', 'warning');
            return;
        }
        
        console.log('Enviando comunicación:', { estudiante, tipo, mensaje });
        this.mostrarNotificacion('Comunicación enviada exitosamente', 'success');
        
        // Limpiar formulario
        document.getElementById('com-mensaje').value = '';
    }
    
    // ===== DASHBOARD =====
    actualizarDashboard() {
        this.actualizarEstadisticas();
        this.actualizarNotificaciones();
    }
    
    actualizarEstadisticas() {
        // Total estudiantes
        const totalStudents = document.getElementById('total-students');
        if (totalStudents) totalStudents.textContent = this.estudiantes.length;
        
        // Promedio general
        const avgGrade = document.getElementById('avg-grade');
        if (avgGrade) avgGrade.textContent = '85.50'; // Valor de ejemplo
        
        // Tasa de asistencia
        const attendanceRate = document.getElementById('attendance-rate');
        if (attendanceRate) attendanceRate.textContent = '95%';
        
        // Tareas completadas
        const tasksCompleted = document.getElementById('tasks-completed');
        if (tasksCompleted) tasksCompleted.textContent = '78%';
    }
    
    actualizarNotificaciones() {
        const notifications = document.getElementById('notifications');
        if (!notifications) return;
        
        // Limpiar notificaciones viejas
        notifications.innerHTML = '';
        
        // Agregar notificaciones del sistema
        const notifs = [
            { icon: 'info-circle', type: 'info', text: 'Sistema FT-MEP Sprint 2 activo' },
            { icon: 'calendar-check', type: 'success', text: 'Período actual: Semana 1' },
            { icon: 'users', type: 'info', text: `${this.estudiantes.length} estudiantes cargados` }
        ];
        
        notifs.forEach(notif => {
            const div = document.createElement('div');
            div.className = 'notification-item';
            div.innerHTML = `
                <i class="fas fa-${notif.icon} ${notif.type}"></i>
                <span>${notif.text}</span>
            `;
            notifications.appendChild(div);
        });
    }
    
    // ===== ACCIONES RÁPIDAS =====
    ejecutarAccionRapida(accion) {
        switch(accion) {
            case 'new-task':
                if (this.moduloTareas) {
                    this.moduloTareas.mostrarModalNuevaTarea();
                }
                break;
                
            case 'mark-attendance':
                if (this.moduloAsistencia) {
                    this.moduloAsistencia.mostrarRegistroAsistencia();
                }
                break;
                
            case 'evaluate-tc':
                this.cambiarSeccion('trabajo-cotidiano');
                break;
                
            case 'view-reports':
                this.cambiarSeccion('nota-final');
                break;
        }
    }
    
    // ===== GESTIÓN DE PERÍODOS =====
    cambiarPeriodo() {
        const periodos = ['semana1', 'semana2', 'semana3', 'semana4', 'mes1', 'mes2', 'mes3'];
        const currentIndex = periodos.indexOf(this.currentPeriod);
        const nextIndex = (currentIndex + 1) % periodos.length;
        
        this.currentPeriod = periodos[nextIndex];
        document.getElementById('current-period').textContent = `Período: ${this.currentPeriod.replace('semana', 'Semana ').replace('mes', 'Mes ')}`;
        
        this.mostrarNotificacion(`Cambiado a ${this.currentPeriod}`, 'info');
        this.cargarEvaluacionesGuardadas();
        
        // Si estamos en trabajo cotidiano, regenerar tabla
        if (document.getElementById('trabajo-cotidiano').classList.contains('active')) {
            this.generarTablaEvaluacion();
        }
    }
    
    // ===== PERSISTENCIA =====
    guardarTrabajoCotidiano() {
        try {
            const key = `ftmep_tc_${this.currentCycle}_${this.currentArea}_${this.currentPeriod}`;
            localStorage.setItem(key, JSON.stringify(this.evaluaciones.trabajoCotidiano[this.currentPeriod]));
            this.mostrarNotificacion('Evaluación guardada exitosamente', 'success');
        } catch (error) {
            console.error('Error guardando evaluación:', error);
            this.mostrarNotificacion('Error al guardar la evaluación', 'danger');
        }
    }
    
    cargarEvaluacionesGuardadas() {
        try {
            const key = `ftmep_tc_${this.currentCycle}_${this.currentArea}_${this.currentPeriod}`;
            const saved = localStorage.getItem(key);
            
            if (saved) {
                this.evaluaciones.trabajoCotidiano[this.currentPeriod] = JSON.parse(saved);
                console.log('✅ Evaluaciones cargadas desde localStorage');
            }
        } catch (error) {
            console.error('Error cargando evaluaciones:', error);
        }
    }
    
    // ===== UTILIDADES =====
    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification-item`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(tipo)} ${tipo}"></i>
            <span>${mensaje}</span>
        `;
        
        // Agregar a la lista
        const notifications = document.getElementById('notifications');
        if (notifications) {
            notifications.insertBefore(notification, notifications.firstChild);
            
            // Remover después de 5 segundos
            setTimeout(() => {
                notification.remove();
            }, 5000);
        }
        
        // También mostrar en consola
        console.log(`📢 ${mensaje}`);
    }
    
    getNotificationIcon(tipo) {
        switch(tipo) {
            case 'success': return 'check-circle';
            case 'warning': return 'exclamation-triangle';
            case 'danger': return 'times-circle';
            default: return 'info-circle';
        }
    }
    
    mostrarError(mensaje) {
        this.mostrarNotificacion(mensaje, 'danger');
        
        // También mostrar en un modal si es crítico
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-exclamation-triangle text-danger"></i> Error</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${mensaje}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">Aceptar</button>
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').appendChild(modal);
    }
}

// ===== INICIALIZACIÓN GLOBAL =====
let sistema;

document.addEventListener('DOMContentLoaded', () => {
    sistema = new SistemaFTMEP();
    
    // Hacer disponible globalmente para los onclick
    window.sistema = sistema;
    
    console.log('🎉 Sistema FT-MEP Sprint 2 listo para usar');
});
