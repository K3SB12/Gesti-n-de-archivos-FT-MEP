// ==============================================
// SISTEMA DE GESTIÓN ACADÉMICA - FORMACIÓN TECNOLÓGICA
// MEP Costa Rica - Versión 2.0
// ==============================================

class SistemaFormacionTecnologica {
    constructor() {
        this.estado = {
            cicloActual: 'III',
            moduloActual: 'ofimatica',
            mesActual: '',
            estudianteActual: null,
            indicadores: [],
            calificaciones: {},
            estudiantes: [],
            configCiclo: null,
            modulos: {}
        };
        
        this.calculadora = null;
        this.asistenteIA = null;
        this.backupManager = null;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Inicializando Sistema FT-MEP v2.0');
        
        try {
            // 1. Cargar dependencias
            await this.cargarDependencias();
            
            // 2. Cargar datos iniciales
            await this.cargarDatosIniciales();
            
            // 3. Configurar event listeners
            this.configurarEventListeners();
            
            // 4. Actualizar interfaz
            this.actualizarInterfaz();
            
            // 5. Inicializar sistema de respaldo
            await this.inicializarRespaldo();
            
            // 6. Cargar última sesión si existe
            await this.cargarUltimaSesion();
            
            console.log('✅ Sistema inicializado correctamente');
            this.mostrarNotificacion('Sistema FT-MEP listo', 'Sistema especializado en Formación Tecnológica inicializado.', 'success');
            
        } catch (error) {
            console.error('❌ Error inicializando sistema:', error);
            this.mostrarNotificacion('Error de inicialización', 'Verifique la conexión y recargue la página.', 'danger');
        }
    }
    
    async cargarDependencias() {
        try {
            // Verificar si las dependencias existen
            if (typeof CalculadoraMEP_FT !== 'undefined') {
                this.calculadora = new CalculadoraMEP_FT();
            }
            
            if (window.iaAssistant) {
                this.asistenteIA = window.iaAssistant;
            }
            
            if (window.backupManager) {
                this.backupManager = window.backupManager;
            }
            
        } catch (error) {
            console.warn('⚠️ Algunas dependencias no están disponibles:', error);
        }
    }
    
    async cargarDatosIniciales() {
        try {
            // Cargar estudiantes
            let estudiantesCargados = false;
            try {
                const respuestaEstudiantes = await fetch('data/estudiantes.json');
                if (respuestaEstudiantes.ok) {
                    this.estado.estudiantes = await respuestaEstudiantes.json();
                    estudiantesCargados = true;
                }
            } catch (e) {
                console.warn('⚠️ No se pudo cargar estudiantes.json:', e);
            }
            
            if (!estudiantesCargados) {
                this.estado.estudiantes = this.getEstudiantesEjemplo();
            }
            
            // Cargar configuración de ciclos
            try {
                const respuestaCiclos = await fetch('data/ciclos-config.json');
                if (respuestaCiclos.ok) {
                    const ciclosData = await respuestaCiclos.json();
                    this.estado.configCiclo = ciclosData[this.estado.cicloActual];
                }
            } catch (e) {
                console.warn('⚠️ No se pudo cargar ciclos-config.json:', e);
                this.estado.configCiclo = this.getConfigCicloEjemplo(this.estado.cicloActual);
            }
            
            // Cargar módulo actual
            await this.cargarModuloActual();
            
            // Actualizar UI
            this.actualizarDropdownEstudiantes();
            this.actualizarDistribucionPorcentual();
            
        } catch (error) {
            console.error('❌ Error cargando datos iniciales:', error);
            this.usarDatosDeRespaldo();
        }
    }
    
    getEstudiantesEjemplo() {
        return [
            {
                id: '1',
                nombre: 'Juan Pérez Rodríguez',
                codigo: '2025001',
                necesidades: []
            },
            {
                id: '2', 
                nombre: 'María González López',
                codigo: '2025002',
                necesidades: ['Prioridad I']
            },
            {
                id: '3',
                nombre: 'Carlos Martínez Fernández',
                codigo: '2025003',
                necesidades: []
            },
            {
                id: '4',
                nombre: 'Ana Rodríguez Vargas',
                codigo: '2025004',
                necesidades: ['Adecuación']
            }
        ];
    }
    
    getConfigCicloEjemplo(ciclo) {
        const configs = {
            'I': { trabajo_cotidiano: 65, tareas: 10, prueba_ejecucion: 15, asistencia: 10 },
            'II': { trabajo_cotidiano: 60, tareas: 10, prueba_ejecucion: 20, asistencia: 10 },
            'III': { trabajo_cotidiano: 50, tareas: 10, proyecto: 30, asistencia: 10 }
        };
        
        return configs[ciclo] || configs['III'];
    }
    
    async cargarModuloActual() {
        try {
            const rutaModulo = `data/modulos-ft/${this.estado.moduloActual}.json`;
            const respuesta = await fetch(rutaModulo);
            
            if (respuesta.ok) {
                this.estado.modulos[this.estado.moduloActual] = await respuesta.json();
                console.log(`✅ Módulo ${this.estado.moduloActual} cargado`);
            } else {
                console.warn(`⚠️ Módulo ${this.estado.moduloActual} no encontrado, usando datos de ejemplo`);
                this.crearDatosEjemploModulo();
            }
            
            // Cargar indicadores del módulo
            await this.cargarIndicadoresModulo();
            
        } catch (error) {
            console.error('❌ Error cargando módulo:', error);
            this.crearDatosEjemploModulo();
        }
    }
    
    crearDatosEjemploModulo() {
        this.estado.modulos[this.estado.moduloActual] = {
            nombre: this.estado.moduloActual.replace('_', ' ').toUpperCase(),
            descripcion: 'Módulo de Formación Tecnológica',
            indicadores: [
                {
                    id: 'ind-1',
                    texto: 'Aplica herramientas ofimáticas para la creación de documentos digitales',
                    nivel: 'III',
                    criterios: {
                        alto: { puntuacion: 3, descripcion: 'Crea documentos complejos con formato avanzado y funcionalidades integradas' },
                        medio: { puntuacion: 2, descripcion: 'Crea documentos básicos con formato adecuado' },
                        bajo: { puntuacion: 1, descripcion: 'Crea documentos simples con formato básico' }
                    }
                },
                {
                    id: 'ind-2',
                    texto: 'Utiliza hojas de cálculo para organizar y analizar información',
                    nivel: 'III',
                    criterios: {
                        alto: { puntuacion: 3, descripcion: 'Crea fórmulas complejas, gráficos y análisis de datos' },
                        medio: { puntuacion: 2, descripcion: 'Usa fórmulas básicas y crea gráficos simples' },
                        bajo: { puntuacion: 1, descripcion: 'Ingresa datos en celdas sin formato especial' }
                    }
                }
            ]
        };
    }
    
    async cargarIndicadoresModulo() {
        const modulo = this.estado.modulos[this.estado.moduloActual];
        if (modulo && modulo.indicadores) {
            this.estado.indicadores = modulo.indicadores;
            console.log(`📊 ${this.estado.indicadores.length} indicadores cargados`);
        } else {
            console.warn('⚠️ No hay indicadores definidos para este módulo');
            this.estado.indicadores = [];
        }
    }
    
    configurarEventListeners() {
        // Selectores de ciclo
        document.querySelectorAll('.cycle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.cambiarCiclo(e.target.dataset.cycle));
        });
        
        // Módulos FT
        document.querySelectorAll('.module-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.cambiarModulo(item.dataset.module);
            });
        });
        
        // Selector de mes
        const monthSelect = document.getElementById('monthSelect');
        if (monthSelect) {
            monthSelect.addEventListener('change', (e) => {
                this.estado.mesActual = e.target.value;
                this.cargarCalificacionesMes();
            });
        }
        
        // Selector de estudiante
        const studentSelect = document.getElementById('studentSelect');
        if (studentSelect) {
            studentSelect.addEventListener('change', (e) => {
                const estudianteId = e.target.value;
                this.seleccionarEstudiante(estudianteId);
            });
        }
        
        // Botones de calificación rápida
        document.querySelectorAll('.grade-badge').forEach(badge => {
            badge.addEventListener('click', (e) => {
                const nivel = e.target.dataset.level;
                this.mostrarModalAplicarTodo(nivel);
            });
        });
        
        // Botones de acción
        this.configurarBoton('btnGuardarCalificacion', () => this.guardarCalificacion());
        this.configurarBoton('btnLimpiarMes', () => this.limpiarMesActual());
        this.configurarBoton('btnCalcularNota', () => this.calcularNotaFinal());
        this.configurarBoton('btnCargarIndicadores', () => this.cargarIndicadoresModulo());
        
        // Botones de IA
        this.configurarBoton('btnGenerarRubricas', () => this.generarRubricasIA());
        this.configurarBoton('btnAnalizarRiesgo', () => this.analizarRiesgoEstudiantes());
        this.configurarBoton('btnSugerirActividades', () => this.sugerirActividadesIA());
        
        // Modal
        this.configurarBoton('modalConfirmBtn', () => this.aplicarATodoElGrupo());
        this.configurarBoton('modalThisStudentBtn', () => this.aplicarAEstudianteActual());
        this.configurarBoton('modalCancelBtn', () => this.cerrarModal());
        
        const closeModalBtn = document.querySelector('.close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.cerrarModal());
        }
        
        // Respaldo
        this.configurarBoton('quickBackup', () => this.generarRespaldo());
        this.configurarBoton('backupBtn', () => this.mostrarOpcionesRespaldo());
        
        // Búsqueda
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') this.buscar(e.target.value);
            });
        }
        
        // Atajos de teclado
        document.addEventListener('keydown', (e) => this.manejarAtajosTeclado(e));
    }
    
    configurarBoton(id, callback) {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener('click', callback);
        }
    }
    
    cambiarCiclo(ciclo) {
        this.estado.cicloActual = ciclo;
        
        // Actualizar UI de botones
        document.querySelectorAll('.cycle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cycle === ciclo);
        });
        
        // Actualizar configuración del ciclo
        this.actualizarConfiguracionCiclo();
        
        // Actualizar distribución porcentual
        this.actualizarDistribucionPorcentual();
        
        // Recargar indicadores para el nuevo ciclo
        this.cargarIndicadoresModulo();
        
        this.mostrarNotificacion(`Ciclo cambiado`, `Ahora trabajando en ${ciclo} Ciclo`, 'info');
    }
    
    cambiarModulo(modulo) {
        this.estado.moduloActual = modulo;
        
        // Actualizar UI de módulos
        document.querySelectorAll('.module-item').forEach(item => {
            item.classList.toggle('active', item.dataset.module === modulo);
        });
        
        // Actualizar breadcrumb
        const currentModule = document.getElementById('currentModule');
        if (currentModule) {
            currentModule.textContent = modulo.replace('_', ' ').toUpperCase();
        }
        
        // Cargar nuevo módulo
        this.cargarModuloActual();
        
        this.mostrarNotificacion(`Módulo cambiado`, `Trabajando en ${modulo}`, 'info');
    }
    
    actualizarConfiguracionCiclo() {
        this.estado.configCiclo = this.getConfigCicloEjemplo(this.estado.cicloActual);
    }
    
    actualizarDistribucionPorcentual() {
        const config = this.estado.configCiclo;
        if (!config) return;
        
        let distribucion = '';
        if (config.proyecto) {
            distribucion = `TC:${config.trabajo_cotidiano}% T:${config.tareas}% P:${config.proyecto}% A:${config.asistencia}%`;
        } else {
            distribucion = `TC:${config.trabajo_cotidiano}% T:${config.tareas}% PE:${config.prueba_ejecucion}% A:${config.asistencia}%`;
        }
        
        const currentDistribution = document.getElementById('currentDistribution');
        if (currentDistribution) {
            currentDistribution.textContent = distribucion;
        }
        
        const currentGroup = document.getElementById('currentGroup');
        if (currentGroup) {
            currentGroup.textContent = `Grupo - ${this.estado.cicloActual} Ciclo`;
        }
    }
    
    actualizarDropdownEstudiantes() {
        const select = document.getElementById('studentSelect');
        if (!select) return;
        
        select.innerHTML = '<option value="">Seleccionar estudiante...</option>';
        
        this.estado.estudiantes.forEach(estudiante => {
            const option = document.createElement('option');
            option.value = estudiante.id;
            const necesidades = estudiante.necesidades && estudiante.necesidades.length > 0 
                ? ` (${estudiante.necesidades[0]})` 
                : '';
            option.textContent = `${estudiante.nombre}${necesidades}`;
            select.appendChild(option);
        });
    }
    
    seleccionarEstudiante(estudianteId) {
        if (!estudianteId) {
            this.estado.estudianteActual = null;
            this.mostrarInformacionEstudiante(null);
            return;
        }
        
        this.estado.estudianteActual = this.estado.estudiantes.find(e => e.id === estudianteId);
        this.mostrarInformacionEstudiante(this.estado.estudianteActual);
        
        if (this.estado.mesActual) {
            this.cargarCalificacionesMes();
        }
    }
    
    mostrarInformacionEstudiante(estudiante) {
        const container = document.querySelector('.student-info-card');
        if (!container) return;
        
        if (!estudiante) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-graduate fa-3x"></i>
                    <h3>Seleccione un estudiante</h3>
                    <p>Elija un estudiante de la lista para ver su información y calificaciones</p>
                </div>
            `;
            return;
        }
        
        const stats = this.calcularEstadisticasEstudiante(estudiante.id);
        
        container.innerHTML = `
            <div class="student-header">
                <div class="student-avatar">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div class="student-details">
                    <h3>${estudiante.nombre}</h3>
                    <div class="student-meta">
                        <span class="meta-item" id="studentCode">Código: ${estudiante.codigo}</span>
                        <span class="meta-item" id="studentAverage">Promedio: ${stats.promedio || '--.--'}</span>
                        <span class="meta-item" id="studentRisk">Riesgo: ${stats.riesgo || '--'}</span>
                    </div>
                </div>
                <div class="student-stats">
                    <div class="stat-box">
                        <small>Trabajo Cotidiano</small>
                        <strong id="statTC">${stats.tc || '0%'}</strong>
                    </div>
                    <div class="stat-box">
                        <small>${this.estado.cicloActual === 'III' ? 'Proyecto' : 'Prueba Ejecución'}</small>
                        <strong id="statProyecto">${stats.proyecto || '0%'}</strong>
                    </div>
                    <div class="stat-box">
                        <small>Asistencia</small>
                        <strong id="statAsistencia">${stats.asistencia || '0%'}</strong>
                    </div>
                </div>
            </div>
        `;
    }
    
    calcularEstadisticasEstudiante(estudianteId) {
        // En implementación real, calcularía de datos guardados
        return {
            promedio: '85.5',
            riesgo: 'Bajo',
            tc: '92%',
            proyecto: '88%',
            asistencia: '95%'
        };
    }
    
    async cargarCalificacionesMes() {
        if (!this.estado.mesActual || !this.estado.estudianteActual) return;
        
        const clave = `calificaciones_${this.estado.estudianteActual.id}_${this.estado.mesActual}`;
        const calificacionesGuardadas = localStorage.getItem(clave);
        
        if (calificacionesGuardadas) {
            try {
                this.estado.calificaciones = JSON.parse(calificacionesGuardadas);
                console.log(`📝 Calificaciones cargadas para ${this.estado.mesActual}`);
            } catch (error) {
                console.error('❌ Error parseando calificaciones:', error);
                this.estado.calificaciones = {};
            }
        } else {
            this.estado.calificaciones = {};
        }
        
        this.mostrarIndicadoresConCalificaciones();
    }
    
    mostrarIndicadoresConCalificaciones() {
        const container = document.getElementById('indicatorsContainer');
        if (!container) return;
        
        if (!this.estado.indicadores || this.estado.indicadores.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list fa-3x"></i>
                    <h3>No hay indicadores definidos</h3>
                    <p>El módulo no tiene indicadores cargados. Sube el archivo JSON correspondiente.</p>
                    <button class="btn-primary" id="btnCargarEjemplo">
                        <i class="fas fa-magic"></i> Cargar Ejemplo
                    </button>
                </div>
            `;
            
            setTimeout(() => {
                const btnEjemplo = document.getElementById('btnCargarEjemplo');
                if (btnEjemplo) {
                    btnEjemplo.addEventListener('click', () => {
                        this.crearDatosEjemploModulo();
                        this.cargarIndicadoresModulo();
                        this.mostrarIndicadoresConCalificaciones();
                    });
                }
            }, 100);
            
            return;
        }
        
        let html = '';
        let calificados = 0;
        
        this.estado.indicadores.forEach((indicador, index) => {
            const calificacion = this.estado.calificaciones[indicador.id];
            if (calificacion) calificados++;
            
            html += this.generarHTMLIndicador(indicador, index + 1, calificacion);
        });
        
        container.innerHTML = html;
        
        // Añadir event listeners a los niveles
        container.querySelectorAll('.criteria-level').forEach(nivel => {
            nivel.addEventListener('click', (e) => {
                const indicadorElement = e.target.closest('.indicator-card');
                if (!indicadorElement) return;
                
                const indicadorId = indicadorElement.dataset.id;
                const nivelElement = e.target.closest('.criteria-level');
                if (!nivelElement) return;
                
                const nivelSeleccionado = nivelElement.dataset.level;
                this.seleccionarNivelIndicador(indicadorId, nivelSeleccionado);
            });
        });
        
        // Actualizar progreso
        this.actualizarProgresoCalificacion(calificados, this.estado.indicadores.length);
    }
    
    generarHTMLIndicador(indicador, numero, calificacion) {
        const nivelSeleccionado = calificacion || null;
        const criterios = indicador.criterios || {
            alto: { descripcion: 'Desempeño superior' },
            medio: { descripcion: 'Desempeño adecuado' },
            bajo: { descripcion: 'Desempeño básico' }
        };
        
        return `
            <div class="indicator-card" data-id="${indicador.id}">
                <div class="indicator-header">
                    <div class="indicator-number">${numero}</div>
                    <div class="indicator-title">${indicador.texto}</div>
                </div>
                
                <div class="criteria-levels">
                    <div class="criteria-level ${nivelSeleccionado === '3' ? 'selected' : ''}" data-level="3">
                        <div class="level-badge high">3</div>
                        <div class="level-title">Alto</div>
                        <div class="level-description">${criterios.alto.descripcion}</div>
                    </div>
                    
                    <div class="criteria-level ${nivelSeleccionado === '2' ? 'selected' : ''}" data-level="2">
                        <div class="level-badge medium">2</div>
                        <div class="level-title">Medio</div>
                        <div class="level-description">${criterios.medio.descripcion}</div>
                    </div>
                    
                    <div class="criteria-level ${nivelSeleccionado === '1' ? 'selected' : ''}" data-level="1">
                        <div class="level-badge low">1</div>
                        <div class="level-title">Bajo</div>
                        <div class="level-description">${criterios.bajo.descripcion}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    seleccionarNivelIndicador(indicadorId, nivel) {
        this.estado.calificaciones[indicadorId] = nivel;
        
        // Actualizar UI
        const indicadorElement = document.querySelector(`.indicator-card[data-id="${indicadorId}"]`);
        if (indicadorElement) {
            indicadorElement.querySelectorAll('.criteria-level').forEach(el => {
                el.classList.toggle('selected', el.dataset.level === nivel);
            });
        }
        
        // Actualizar contador
        this.actualizarContadorCalificados();
    }
    
    actualizarContadorCalificados() {
        const total = this.estado.indicadores.length;
        const calificados = Object.keys(this.estado.calificaciones).length;
        
        const gradedCount = document.getElementById('gradedCount');
        if (gradedCount) {
            gradedCount.textContent = `${calificados} de ${total} indicadores calificados`;
        }
        
        const porcentaje = total > 0 ? (calificados / total) * 100 : 0;
        const gradingProgress = document.getElementById('gradingProgress');
        if (gradingProgress) {
            gradingProgress.style.width = `${porcentaje}%`;
        }
    }
    
    actualizarProgresoCalificacion(calificados, total) {
        const gradedCount = document.getElementById('gradedCount');
        if (gradedCount) {
            gradedCount.textContent = `${calificados} de ${total} indicadores calificados`;
        }
        
        const porcentaje = total > 0 ? (calificados / total) * 100 : 0;
        const gradingProgress = document.getElementById('gradingProgress');
        if (gradingProgress) {
            gradingProgress.style.width = `${porcentaje}%`;
        }
    }
    
    mostrarModalAplicarTodo(nivel) {
        if (!this.estado.mesActual || !this.estado.estudianteActual) {
            this.mostrarNotificacion('Primero seleccione mes y estudiante', '', 'warning');
            return;
        }
        
        if (!this.estado.indicadores || this.estado.indicadores.length === 0) {
            this.mostrarNotificacion('No hay indicadores para calificar', 'Cargue indicadores primero', 'warning');
            return;
        }
        
        const modal = document.getElementById('applyAllModal');
        if (!modal) return;
        
        const nivelTexto = { '3': 'Alto (3)', '2': 'Medio (2)', '1': 'Bajo (1)' }[nivel] || `Nivel ${nivel}`;
        
        const modalLevel = document.getElementById('modalLevel');
        const modalCount = document.getElementById('modalCount');
        
        if (modalLevel) modalLevel.textContent = nivelTexto;
        if (modalCount) modalCount.textContent = this.estado.indicadores.length;
        
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }
    
    aplicarATodoElGrupo() {
        const modalLevel = document.getElementById('modalLevel');
        if (!modalLevel) return;
        
        const nivel = modalLevel.textContent.includes('Alto') ? '3' : 
                     modalLevel.textContent.includes('Medio') ? '2' : '1';
        
        const onlyUnassignedCheck = document.getElementById('modalOnlyUnassigned');
        const soloSinCalificar = onlyUnassignedCheck ? onlyUnassignedCheck.checked : false;
        
        // Aplicar a todos los estudiantes
        this.estado.estudiantes.forEach(estudiante => {
            const clave = `calificaciones_${estudiante.id}_${this.estado.mesActual}`;
            let calificaciones = {};
            
            try {
                const guardadas = localStorage.getItem(clave);
                calificaciones = guardadas ? JSON.parse(guardadas) : {};
            } catch (error) {
                calificaciones = {};
            }
            
            this.estado.indicadores.forEach(indicador => {
                if (!soloSinCalificar || !calificaciones[indicador.id]) {
                    calificaciones[indicador.id] = nivel;
                }
            });
            
            try {
                localStorage.setItem(clave, JSON.stringify(calificaciones));
            } catch (error) {
                console.error('❌ Error guardando calificaciones:', error);
            }
        });
        
        // Aplicar al estudiante actual
        this.estado.indicadores.forEach(indicador => {
            if (!soloSinCalificar || !this.estado.calificaciones[indicador.id]) {
                this.estado.calificaciones[indicador.id] = nivel;
            }
        });
        
        // Actualizar UI
        this.mostrarIndicadoresConCalificaciones();
        this.cerrarModal();
        
        this.mostrarNotificacion('Calificaciones aplicadas', `Nivel ${nivel} aplicado a todo el grupo`, 'success');
    }
    
    aplicarAEstudianteActual() {
        const modalLevel = document.getElementById('modalLevel');
        if (!modalLevel) return;
        
        const nivel = modalLevel.textContent.includes('Alto') ? '3' : 
                     modalLevel.textContent.includes('Medio') ? '2' : '1';
        
        const onlyUnassignedCheck = document.getElementById('modalOnlyUnassigned');
        const soloSinCalificar = onlyUnassignedCheck ? onlyUnassignedCheck.checked : false;
        
        this.estado.indicadores.forEach(indicador => {
            if (!soloSinCalificar || !this.estado.calificaciones[indicador.id]) {
                this.estado.calificaciones[indicador.id] = nivel;
            }
        });
        
        this.mostrarIndicadoresConCalificaciones();
        this.cerrarModal();
        
        this.mostrarNotificacion('Calificaciones aplicadas', `Nivel ${nivel} aplicado al estudiante`, 'success');
    }
    
    cerrarModal() {
        const modal = document.getElementById('applyAllModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }
    
    async guardarCalificacion() {
        if (!this.estado.mesActual || !this.estado.estudianteActual) {
            this.mostrarNotificacion('Seleccione mes y estudiante', '', 'warning');
            return;
        }
        
        const clave = `calificaciones_${this.estado.estudianteActual.id}_${this.estado.mesActual}`;
        
        try {
            // Guardar en localStorage
            localStorage.setItem(clave, JSON.stringify(this.estado.calificaciones));
            
            // Guardar en sistema de respaldo si existe
            if (this.backupManager && typeof this.backupManager.guardarDatos === 'function') {
                await this.backupManager.guardarDatos('calificaciones', {
                    estudiante: this.estado.estudianteActual.id,
                    mes: this.estado.mesActual,
                    calificaciones: this.estado.calificaciones,
                    timestamp: new Date().toISOString()
                });
            }
            
            this.mostrarNotificacion('Calificaciones guardadas', 
                `Se guardaron ${Object.keys(this.estado.calificaciones).length} calificaciones para ${this.estado.estudianteActual.nombre}`,
                'success');
                
            // Actualizar indicador de respaldo
            const backupIndicator = document.getElementById('backupIndicator');
            if (backupIndicator) {
                backupIndicator.textContent = '✓';
                setTimeout(() => {
                    backupIndicator.textContent = '';
                }, 3000);
            }
            
        } catch (error) {
            console.error('❌ Error guardando calificaciones:', error);
            this.mostrarNotificacion('Error al guardar', 'Intente nuevamente', 'danger');
        }
    }
    
    limpiarMesActual() {
        if (!this.estado.mesActual || !this.estado.estudianteActual) return;
        
        const confirmacion = confirm(`¿Está seguro de limpiar TODAS las calificaciones de ${this.estado.estudianteActual.nombre} para ${this.estado.mesActual}?`);
        if (!confirmacion) return;
        
        this.estado.calificaciones = {};
        this.mostrarIndicadoresConCalificaciones();
        
        const clave = `calificaciones_${this.estado.estudianteActual.id}_${this.estado.mesActual}`;
        localStorage.removeItem(clave);
        
        this.mostrarNotificacion('Mes limpiado', 'Todas las calificaciones fueron eliminadas', 'info');
    }
    
    calcularNotaFinal() {
        if (!this.estado.estudianteActual || !this.estado.configCiclo) {
            this.mostrarNotificacion('Datos incompletos', 'Seleccione ciclo y estudiante', 'warning');
            return;
        }
        
        if (Object.keys(this.estado.calificaciones).length === 0) {
            this.mostrarNotificacion('No hay calificaciones', 'Califique algunos indicadores primero', 'warning');
            return;
        }
        
        // Calcular promedio del trabajo cotidiano (convertir 1-2-3 a 0-100)
        let sumaTC = 0;
        let indicadoresCalificados = 0;
        
        Object.values(this.estado.calificaciones).forEach(nivel => {
            const conversion = { '1': 60, '2': 80, '3': 100 };
            sumaTC += conversion[nivel] || 0;
            indicadoresCalificados++;
        });
        
        const promedioTC = indicadoresCalificados > 0 ? sumaTC / indicadoresCalificados : 0;
        
        // Simular otros componentes (en implementación real, se cargarían de datos)
        const tareas = 85;
        const proyecto = this.estado.cicloActual === 'III' ? 90 : 0;
        const pruebaEjecucion = this.estado.cicloActual !== 'III' ? 88 : 0;
        const asistencia = 95;
        
        // Calcular nota
        let notaFinal = 0;
        let desglose = {};
        
        if (this.calculadora && typeof this.calculadora.calcularNotaFinal === 'function') {
            const resultado = this.calculadora.calcularNotaFinal(
                this.estado.estudianteActual.id,
                this.estado.cicloActual === 'I' ? 'I_Ciclo' : 
                this.estado.cicloActual === 'II' ? 'II_Ciclo' : 'III_Ciclo',
                {
                    trabajo_cotidiano: promedioTC,
                    tareas: tareas,
                    proyecto: proyecto,
                    prueba_ejecucion: pruebaEjecucion,
                    asistencia: asistencia
                }
            );
            
            notaFinal = resultado.nota || 0;
            desglose = resultado.desglose || {};
        } else {
            // Cálculo manual si no hay calculadora
            const config = this.estado.configCiclo;
            notaFinal = (
                (promedioTC * config.trabajo_cotidiano / 100) +
                (tareas * config.tareas / 100) +
                ((proyecto || pruebaEjecucion) * (config.proyecto || config.prueba_ejecucion) / 100) +
                (asistencia * config.asistencia / 100)
            );
            
            desglose = {
                trabajo_cotidiano: promedioTC * config.trabajo_cotidiano / 100,
                tareas: tareas * config.tareas / 100,
                proyecto: proyecto * (config.proyecto || 0) / 100,
                prueba_ejecucion: pruebaEjecucion * (config.prueba_ejecucion || 0) / 100,
                asistencia: asistencia * config.asistencia / 100
            };
        }
        
        // Mostrar resultado
        this.mostrarResultadoCalculo(notaFinal, desglose);
    }
    
    mostrarResultadoCalculo(notaFinal, desglose) {
        const estado = notaFinal >= 70 ? 'Aprobado' : 'Reprobado';
        const estadoClass = estado === 'Aprobado' ? 'text-success' : 'text-danger';
        
        const html = `
            <div class="alert alert-info">
                <i class="fas fa-calculator fa-lg"></i>
                <div>
                    <h4>Resultado del Cálculo MEP - ${this.estado.cicloActual} Ciclo</h4>
                    <p><strong>Nota Final:</strong> ${notaFinal.toFixed(2)}</p>
                    <p><strong>Estado:</strong> <span class="${estadoClass}">${estado}</span></p>
                    <p><strong>Desglose:</strong></p>
                    <ul>
                        <li>Trabajo Cotidiano: ${desglose.trabajo_cotidiano?.toFixed(2) || '0.00'}</li>
                        <li>Tareas: ${desglose.tareas?.toFixed(2) || '0.00'}</li>
                        ${this.estado.cicloActual === 'III' 
                            ? `<li>Proyecto: ${desglose.proyecto?.toFixed(2) || '0.00'}</li>`
                            : `<li>Prueba Ejecución: ${desglose.prueba_ejecucion?.toFixed(2) || '0.00'}</li>`
                        }
                        <li>Asistencia: ${desglose.asistencia?.toFixed(2) || '0.00'}</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Insertar al inicio del contenedor de calificación
        const container = document.querySelector('.grading-container');
        if (!container) return;
        
        const existingAlert = container.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        container.insertAdjacentHTML('afterbegin', html);
    }
    
    // ===== FUNCIONALIDADES DE IA =====
    
    async generarRubricasIA() {
        if (!this.asistenteIA || typeof this.asistenteIA.generarCriteriosDesdeIndicador !== 'function') {
            this.mostrarNotificacion('Asistente IA no disponible', '', 'warning');
            return;
        }
        
        if (this.estado.indicadores.length === 0) {
            this.mostrarNotificacion('No hay indicadores', 'Cargue indicadores primero', 'warning');
            return;
        }
        
        this.mostrarNotificacion('Generando rúbricas...', 'El asistente IA está trabajando', 'info');
        
        let rubricasGeneradas = 0;
        
        // Generar rúbricas para cada indicador
        for (const indicador of this.estado.indicadores) {
            if (!indicador.criterios || Object.keys(indicador.criterios).length === 0) {
                try {
                    const criteriosGenerados = this.asistenteIA.generarCriteriosDesdeIndicador(
                        indicador.texto, 
                        this.estado.cicloActual
                    );
                    
                    if (criteriosGenerados) {
                        indicador.criterios = criteriosGenerados;
                        rubricasGeneradas++;
                        console.log(`✅ Rúbrica generada para: ${indicador.texto.substring(0, 50)}...`);
                    }
                } catch (error) {
                    console.error('❌ Error generando rúbrica:', error);
                }
            }
        }
        
        // Actualizar UI
        this.mostrarIndicadoresConCalificaciones();
        
        this.mostrarNotificacion('Rúbricas generadas', 
            `Se generaron criterios para ${rubricasGeneradas} indicadores`, 
            rubricasGeneradas > 0 ? 'success' : 'warning');
    }
    
    async analizarRiesgoEstudiantes() {
        if (!this.asistenteIA || typeof this.asistenteIA.analizarRiesgoEstudiante !== 'function') {
            this.mostrarNotificacion('Asistente IA no disponible', '', 'warning');
            return;
        }
        
        if (this.estado.estudiantes.length === 0) {
            this.mostrarNotificacion('No hay estudiantes', 'Cargue estudiantes primero', 'warning');
            return;
        }
        
        this.mostrarNotificacion('Analizando riesgo...', 'Evaluando desempeño de estudiantes', 'info');
        
        const analisis = [];
        
        for (const estudiante of this.estado.estudiantes) {
            try {
                // Obtener datos de calificación del estudiante
                const calificaciones = await this.obtenerCalificacionesEstudiante(estudiante.id);
                
                const analisisEstudiante = this.asistenteIA.analizarRiesgoEstudiante(
                    { promedio: calificaciones.promedio || 70 },
                    calificaciones.asistencia || 85,
                    'II Periodo',
                    estudiante.necesidades || []
                );
                
                analisis.push({
                    estudiante: estudiante.nombre,
                    ...analisisEstudiante
                });
                
            } catch (error) {
                console.error(`❌ Error analizando estudiante ${estudiante.nombre}:`, error);
            }
        }
        
        // Mostrar resultados
        this.mostrarPanelAnalisisRiesgo(analisis);
    }
    
    async obtenerCalificacionesEstudiante(estudianteId) {
        // En implementación real, buscaría calificaciones guardadas
        return {
            promedio: Math.random() * 40 + 60, // 60-100
            asistencia: Math.random() * 30 + 70 // 70-100
        };
    }
    
    mostrarPanelAnalisisRiesgo(analisis) {
        const altoRiesgo = analisis.filter(a => a.riesgo === 'alto' || a.riesgo === 'Alto').length;
        const medioRiesgo = analisis.filter(a => a.riesgo === 'medio' || a.riesgo === 'Medio').length;
        const bajoRiesgo = analisis.filter(a => a.riesgo === 'bajo' || a.riesgo === 'Bajo').length;
        
        const html = `
            <div class="alert alert-warning">
                <i class="fas fa-chart-line fa-lg"></i>
                <div>
                    <h4>Análisis de Riesgo - Estudiantes</h4>
                    <p><strong>Total estudiantes:</strong> ${analisis.length}</p>
                    <p><strong class="text-danger">Alto Riesgo:</strong> ${altoRiesgo} estudiantes</p>
                    <p><strong class="text-warning">Medio Riesgo:</strong> ${medioRiesgo} estudiantes</p>
                    <p><strong class="text-success">Bajo Riesgo:</strong> ${bajoRiesgo} estudiantes</p>
                    ${altoRiesgo > 0 
                        ? `<p class="text-sm mt-2 text-danger"><i class="fas fa-exclamation-triangle"></i> Recomendación: Implementar plan de apoyo inmediato</p>`
                        : `<p class="text-sm mt-2 text-success"><i class="fas fa-check-circle"></i> Seguimiento regular suficiente</p>`
                    }
                </div>
            </div>
        `;
        
        const container = document.querySelector('.grading-container');
        if (!container) return;
        
        const existingAlert = container.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        container.insertAdjacentHTML('afterbegin', html);
    }
    
    sugerirActividadesIA() {
        if (!this.asistenteIA || typeof this.asistenteIA.sugerirActividadesDiferenciadas !== 'function') {
            this.mostrarNotificacion('Asistente IA no disponible', '', 'warning');
            return;
        }
        
        if (!this.estado.moduloActual) {
            this.mostrarNotificacion('No hay módulo seleccionado', '', 'warning');
            return;
        }
        
        const actividades = this.asistenteIA.sugerirActividadesDiferenciadas(
            this.estado.moduloActual,
            'intermedio'
        );
        
        const html = `
            <div class="alert alert-success">
                <i class="fas fa-lightbulb fa-lg"></i>
                <div>
                    <h4>Sugerencias de Actividades - ${this.estado.moduloActual.toUpperCase()}</h4>
                    <p><strong>Actividad recomendada:</strong> ${actividades || 'Actividad práctica de aplicación'}</p>
                    <p class="text-sm mt-2"><strong>Materiales necesarios:</strong> Computadoras, software específico, guías de trabajo</p>
                    <p class="text-sm"><strong>Tiempo estimado:</strong> 2-3 sesiones de 40 minutos</p>
                    <p class="text-sm"><strong>Evaluación:</strong> Rúbrica de desempeño, autoevaluación</p>
                </div>
            </div>
        `;
        
        const container = document.querySelector('.grading-container');
        if (!container) return;
        
        const existingAlert = container.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        container.insertAdjacentHTML('afterbegin', html);
    }
    
    // ===== SISTEMA DE RESPALDO =====
    
    async inicializarRespaldo() {
        if (!this.backupManager) return;
        
        // Configurar respaldo automático cada 30 minutos
        setInterval(() => {
            this.generarRespaldoAutomatico();
        }, 30 * 60 * 1000);
        
        // Respaldar al cerrar la página
        window.addEventListener('beforeunload', () => {
            this.generarRespaldoUltimoMomento();
        });
        
        console.log('✅ Sistema de respaldo inicializado');
    }
    
    async generarRespaldo() {
        if (!this.backupManager || typeof this.backupManager.generarRespaldoCompleto !== 'function') {
            this.mostrarNotificacion('Sistema de respaldo no disponible', '', 'warning');
            return;
        }
        
        try {
            await this.backupManager.generarRespaldoCompleto();
            this.mostrarNotificacion('Respaldo generado', 'Todos los datos fueron respaldados', 'success');
            
            // Actualizar contador
            const contadorElement = document.getElementById('backupCount');
            if (contadorElement) {
                const contador = parseInt(contadorElement.textContent) || 0;
                contadorElement.textContent = `${contador + 1} respaldos`;
            }
            
            // Actualizar última sincronización
            const lastSync = document.getElementById('lastSync');
            if (lastSync) {
                lastSync.textContent = 'Ahora mismo';
            }
            
        } catch (error) {
            console.error('❌ Error generando respaldo:', error);
            this.mostrarNotificacion('Error al respaldar', 'Intente nuevamente', 'danger');
        }
    }
    
    async generarRespaldoAutomatico() {
        if (!this.backupManager || typeof this.backupManager.generarRespaldoAutomatico !== 'function') {
            return;
        }
        
        try {
            await this.backupManager.generarRespaldoAutomatico();
            const lastSync = document.getElementById('lastSync');
            if (lastSync) {
                lastSync.textContent = 'Hace unos minutos';
            }
            
            console.log('✅ Respaldo automático generado');
        } catch (error) {
            console.warn('⚠️ Error en respaldo automático:', error);
        }
    }
    
    generarRespaldoUltimoMomento() {
        // Guardar datos actuales rápidamente
        const datos = {
            estado: {
                cicloActual: this.estado.cicloActual,
                moduloActual: this.estado.moduloActual,
                mesActual: this.estado.mesActual,
                estudianteActualId: this.estado.estudianteActual?.id
            },
            timestamp: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('ultimo_respaldo_ft', JSON.stringify(datos));
        } catch (error) {
            console.error('❌ Error en respaldo último momento:', error);
        }
    }
    
    mostrarOpcionesRespaldo() {
        // Mostrar menú de opciones de respaldo
        const html = `
            <div class="modal" id="backupOptionsModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Opciones de Respaldo</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="option-list">
                            <button class="option-item" id="backupNow">
                                <i class="fas fa-save"></i>
                                <div>
                                    <strong>Respaldo Ahora</strong>
                                    <small>Crea una copia completa del sistema</small>
                                </div>
                            </button>
                            <button class="option-item" id="exportBackup">
                                <i class="fas fa-download"></i>
                                <div>
                                    <strong>Exportar Respaldo</strong>
                                    <small>Descarga un archivo JSON con los datos</small>
                                </div>
                            </button>
                            <button class="option-item" id="restoreBackup">
                                <i class="fas fa-upload"></i>
                                <div>
                                    <strong>Restaurar Respaldo</strong>
                                    <small>Carga datos desde un respaldo anterior</small>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary modal-close">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar modal
        document.body.insertAdjacentHTML('beforeend', html);
        const modal = document.getElementById('backupOptionsModal');
        modal.style.display = 'flex';
        
        // Configurar eventos
        document.getElementById('backupNow')?.addEventListener('click', () => {
            this.generarRespaldo();
            modal.remove();
        });
        
        document.getElementById('exportBackup')?.addEventListener('click', () => {
            this.exportarRespaldo();
            modal.remove();
        });
        
        document.getElementById('restoreBackup')?.addEventListener('click', () => {
            this.restaurarRespaldo();
            modal.remove();
        });
        
        // Cerrar modal
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
    }
    
    exportarRespaldo() {
        try {
            const datos = {
                sistema: 'FT-MEP Costa Rica',
                version: '2.0',
                fecha: new Date().toISOString(),
                datos: {
                    estudiantes: this.estado.estudiantes,
                    configCiclo: this.estado.configCiclo,
                    modulos: this.estado.modulos,
                    calificaciones: this.obtenerTodasCalificaciones()
                }
            };
            
            const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `respaldo_ft_mep_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.mostrarNotificacion('Respaldo exportado', 'Los datos se descargaron como JSON', 'success');
            
        } catch (error) {
            console.error('❌ Error exportando respaldo:', error);
            this.mostrarNotificacion('Error al exportar', 'Intente nuevamente', 'danger');
        }
    }
    
    obtenerTodasCalificaciones() {
        const calificaciones = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave.startsWith('calificaciones_')) {
                try {
                    calificaciones[clave] = JSON.parse(localStorage.getItem(clave));
                } catch (error) {
                    console.warn(`⚠️ Error parseando ${clave}:`, error);
                }
            }
        }
        
        return calificaciones;
    }
    
    restaurarRespaldo() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const datos = JSON.parse(event.target.result);
                    
                    if (confirm('¿Restaurar este respaldo? Se sobrescribirán los datos actuales.')) {
                        this.procesarRespaldoRestaurado(datos);
                    }
                } catch (error) {
                    console.error('❌ Error leyendo respaldo:', error);
                    this.mostrarNotificacion('Archivo inválido', 'El respaldo no es válido', 'danger');
                }
            };
            
            reader.readAsText(file);
        });
        
        input.click();
    }
    
    procesarRespaldoRestaurado(datos) {
        try {
            // Restaurar estudiantes
            if (datos.datos?.estudiantes) {
                this.estado.estudiantes = datos.datos.estudiantes;
                this.actualizarDropdownEstudiantes();
            }
            
            // Restaurar configuración
            if (datos.datos?.configCiclo) {
                this.estado.configCiclo = datos.datos.configCiclo;
                this.actualizarDistribucionPorcentual();
            }
            
            // Restaurar calificaciones
            if (datos.datos?.calificaciones) {
                for (const [clave, valor] of Object.entries(datos.datos.calificaciones)) {
                    localStorage.setItem(clave, JSON.stringify(valor));
                }
            }
            
            this.mostrarNotificacion('Respaldo restaurado', 'Los datos se restauraron correctamente', 'success');
            
        } catch (error) {
            console.error('❌ Error restaurando respaldo:', error);
            this.mostrarNotificacion('Error al restaurar', 'Los datos pueden estar incompletos', 'danger');
        }
    }
    
    // ===== UTILIDADES =====
    
    mostrarNotificacion(titulo, mensaje, tipo = 'info') {
        console.log(`📢 ${tipo.toUpperCase()}: ${titulo} - ${mensaje}`);
        
        const tiposClase = {
            'success': 'alert-success',
            'warning': 'alert-warning',
            'danger': 'alert-danger',
            'info': 'alert-info'
        };
        
        const iconos = {
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'danger': 'times-circle',
            'info': 'info-circle'
        };
        
        const notificacionHTML = `
            <div class="alert ${tiposClase[tipo] || 'alert-info'} slide-in-right">
                <i class="fas fa-${iconos[tipo] || 'info-circle'}"></i>
                <div>
                    <strong>${titulo}</strong>
                    <p class="text-sm">${mensaje}</p>
                </div>
                <button class="alert-close">&times;</button>
            </div>
        `;
        
        // Insertar en el área de trabajo
        const workArea = document.querySelector('.work-area');
        if (!workArea) return;
        
        const existingAlert = workArea.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        workArea.insertAdjacentHTML('afterbegin', notificacionHTML);
        
        // Configurar cierre
        const alertElement = workArea.querySelector('.alert');
        if (alertElement) {
            const closeBtn = alertElement.querySelector('.alert-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => alertElement.remove());
            }
            
            // Auto-eliminar después de 5 segundos
            setTimeout(() => {
                if (alertElement && alertElement.parentNode) {
                    alertElement.remove();
                }
            }, 5000);
        }
    }
    
    buscar(termino) {
        if (!termino.trim()) return;
        
        console.log(`🔍 Búsqueda: ${termino}`);
        
        // Buscar en estudiantes
        const resultadosEstudiantes = this.estado.estudiantes.filter(estudiante => 
            estudiante.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            estudiante.codigo.includes(termino)
        );
        
        // Buscar en indicadores
        const resultadosIndicadores = this.estado.indicadores.filter(indicador => 
            indicador.texto.toLowerCase().includes(termino.toLowerCase())
        );
        
        if (resultadosEstudiantes.length > 0 || resultadosIndicadores.length > 0) {
            this.mostrarResultadosBusqueda(resultadosEstudiantes, resultadosIndicadores);
        } else {
            this.mostrarNotificacion('Sin resultados', `No se encontró "${termino}"`, 'warning');
        }
    }
    
    mostrarResultadosBusqueda(estudiantes, indicadores) {
        let html = '<div class="search-results">';
        
        if (estudiantes.length > 0) {
            html += '<h4>Estudiantes encontrados:</h4><ul>';
            estudiantes.forEach(estudiante => {
                html += `<li><button class="btn-link" onclick="sistemaFT.seleccionarEstudiante('${estudiante.id}')">${estudiante.nombre} (${estudiante.codigo})</button></li>`;
            });
            html += '</ul>';
        }
        
        if (indicadores.length > 0) {
            html += '<h4>Indicadores encontrados:</h4><ul>';
            indicadores.forEach(indicador => {
                html += `<li>${indicador.texto.substring(0, 80)}...</li>`;
            });
            html += '</ul>';
        }
        
        html += '</div>';
        
        const container = document.querySelector('.grading-container');
        if (!container) return;
        
        const existingResults = container.querySelector('.search-results');
        if (existingResults) existingResults.remove();
        
        container.insertAdjacentHTML('afterbegin', html);
    }
    
    manejarAtajosTeclado(event) {
        // Ctrl+S: Guardar
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            this.guardarCalificacion();
        }
        
        // Ctrl+B: Respaldo
        if (event.ctrlKey && event.key === 'b') {
            event.preventDefault();
            this.generarRespaldo();
        }
        
        // Ctrl+K: Buscar
        if (event.ctrlKey && event.key === 'k') {
            event.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape: Cerrar modal
        if (event.key === 'Escape') {
            this.cerrarModal();
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            });
        }
    }
    
    actualizarInterfaz() {
        // Actualizar breadcrumb
        const currentModule = document.getElementById('currentModule');
        if (currentModule) {
            currentModule.textContent = this.estado.moduloActual.replace('_', ' ').toUpperCase();
        }
        
        // Marcar ciclo activo
        document.querySelectorAll('.cycle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cycle === this.estado.cicloActual);
        });
        
        // Marcar módulo activo
        document.querySelectorAll('.module-item').forEach(item => {
            item.classList.toggle('active', item.dataset.module === this.estado.moduloActual);
        });
    }
    
    usarDatosDeRespaldo() {
        console.log('🔄 Usando datos de respaldo...');
        
        this.estado.estudiantes = this.getEstudiantesEjemplo();
        this.estado.configCiclo = this.getConfigCicloEjemplo(this.estado.cicloActual);
        
        this.actualizarDropdownEstudiantes();
        this.actualizarDistribucionPorcentual();
    }
    
    async cargarUltimaSesion() {
        try {
            const ultimaSesion = localStorage.getItem('ultima_sesion_ft');
            if (ultimaSesion) {
                const sesion = JSON.parse(ultimaSesion);
                
                // Restaurar ciclo
                if (sesion.ciclo) {
                    this.estado.cicloActual = sesion.ciclo;
                    const cicloBtn = document.querySelector(`.cycle-btn[data-cycle="${sesion.ciclo}"]`);
                    if (cicloBtn) cicloBtn.classList.add('active');
                }
                
                // Restaurar módulo
                if (sesion.modulo) {
                    this.estado.moduloActual = sesion.modulo;
                    const moduloItem = document.querySelector(`.module-item[data-module="${sesion.modulo}"]`);
                    if (moduloItem) moduloItem.classList.add('active');
                }
                
                // Restaurar mes
                if (sesion.mes) {
                    this.estado.mesActual = sesion.mes;
                    const monthSelect = document.getElementById('monthSelect');
                    if (monthSelect) monthSelect.value = sesion.mes;
                }
                
                console.log('✅ Última sesión restaurada');
            }
        } catch (error) {
            console.warn('⚠️ Error restaurando última sesión:', error);
        }
    }
    
    guardarSesionActual() {
        const sesion = {
            ciclo: this.estado.cicloActual,
            modulo: this.estado.moduloActual,
            mes: this.estado.mesActual,
            timestamp: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('ultima_sesion_ft', JSON.stringify(sesion));
        } catch (error) {
            console.error('❌ Error guardando sesión:', error);
        }
    }
}

// ==============================================
// INICIALIZACIÓN DEL SISTEMA
// ==============================================

// Esperar a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema
    if (!window.sistemaFT) {
        window.sistemaFT = new SistemaFormacionTecnologica();
    }
    
    // Guardar sesión periódicamente
    setInterval(() => {
        if (window.sistemaFT) {
            window.sistemaFT.guardarSesionActual();
        }
    }, 60000); // Cada minuto
    
    // Guardar sesión al cerrar
    window.addEventListener('beforeunload', () => {
        if (window.sistemaFT) {
            window.sistemaFT.guardarSesionActual();
            window.sistemaFT.generarRespaldoUltimoMomento();
        }
    });
});

// Funciones globales para manejo de modales
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
};

window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }
};

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    
    // Cerrar con botón Cancelar
    if (e.target.classList.contains('btn-cancel')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }
});