// ==============================================
// SISTEMA DE IMPORTACIÓN DE DATOS - FT-MEP
// Manejo de archivos Excel, CSV, JSON
// ==============================================

class ImportManager {
    constructor() {
        this.formatosSoportados = {
            json: ['application/json', '.json'],
            csv: ['text/csv', '.csv'],
            excel: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.xls', '.xlsx']
        };
        
        this.esquemasValidacion = {
            estudiantes: {
                camposRequeridos: ['id', 'nombre', 'codigo', 'grupo'],
                camposOpcionales: ['necesidades', 'contacto', 'estadisticas'],
                tipos: {
                    id: 'string',
                    nombre: 'string',
                    codigo: 'string',
                    grupo: 'string'
                }
            },
            calificaciones: {
                camposRequeridos: ['estudianteId', 'indicadorId', 'nivel', 'mes'],
                tipos: {
                    estudianteId: 'string',
                    indicadorId: 'string',
                    nivel: 'string',
                    mes: 'string'
                }
            },
            indicadores: {
                camposRequeridos: ['id', 'texto', 'nivel'],
                camposOpcionales: ['criterios', 'modulo'],
                tipos: {
                    id: 'string',
                    texto: 'string',
                    nivel: 'string'
                }
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('📤 ImportManager inicializado');
        this.configurarListeners();
    }
    
    configurarListeners() {
        // Configurar dropzone si existe
        const dropzone = document.getElementById('importDropzone');
        if (dropzone) {
            this.configurarDropzone(dropzone);
        }
        
        // Configurar botón de importación
        const importBtn = document.getElementById('btnImportar');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.mostrarModalImportacion());
        }
    }
    
    configurarDropzone(element) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('drag-over');
        });
        
        element.addEventListener('dragleave', () => {
            element.classList.remove('drag-over');
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.procesarArchivos(Array.from(files));
            }
        });
        
        // Click para seleccionar archivos
        element.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = Object.values(this.formatosSoportados)
                .flat()
                .filter(f => f.startsWith('.'))
                .join(',');
            
            input.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.procesarArchivos(Array.from(e.target.files));
                }
            });
            
            input.click();
        });
    }
    
    mostrarModalImportacion() {
        const modalHTML = `
            <div class="modal" id="importModal">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3>Importar Datos</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="import-options">
                            <div class="option-card" data-type="estudiantes">
                                <i class="fas fa-user-graduate fa-2x"></i>
                                <h4>Estudiantes</h4>
                                <p>Importar lista de estudiantes desde archivo</p>
                                <small>Soportado: JSON, CSV, Excel</small>
                            </div>
                            
                            <div class="option-card" data-type="calificaciones">
                                <i class="fas fa-clipboard-check fa-2x"></i>
                                <h4>Calificaciones</h4>
                                <p>Importar calificaciones y evaluaciones</p>
                                <small>Soportado: JSON, CSV</small>
                            </div>
                            
                            <div class="option-card" data-type="indicadores">
                                <i class="fas fa-bullseye fa-2x"></i>
                                <h4>Indicadores</h4>
                                <p>Importar indicadores de aprendizaje</p>
                                <small>Soportado: JSON</small>
                            </div>
                            
                            <div class="option-card" data-type="templates">
                                <i class="fas fa-file-download fa-2x"></i>
                                <h4>Plantillas</h4>
                                <p>Descargar plantillas para importación</p>
                                <small>Excel y CSV</small>
                            </div>
                        </div>
                        
                        <div class="drag-drop-area" id="importDropzone">
                            <i class="fas fa-cloud-upload-alt fa-3x"></i>
                            <p>Arrastra y suelta archivos aquí</p>
                            <small>o haz clic para seleccionar</small>
                            <div class="supported-formats">
                                <span class="format-badge">JSON</span>
                                <span class="format-badge">CSV</span>
                                <span class="format-badge">Excel</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary modal-close">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('importModal');
        modal.style.display = 'flex';
        
        // Configurar eventos
        this.configurarModalImportacion(modal);
    }
    
    configurarModalImportacion(modal) {
        // Configurar dropzone dentro del modal
        const dropzone = modal.querySelector('#importDropzone');
        if (dropzone) {
            this.configurarDropzone(dropzone);
        }
        
        // Configurar opciones de importación
        modal.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                const tipo = card.dataset.type;
                
                if (tipo === 'templates') {
                    this.descargarPlantillas();
                } else {
                    this.seleccionarArchivoParaTipo(tipo);
                }
            });
        });
        
        // Cerrar modal
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    seleccionarArchivoParaTipo(tipo) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = this.getAcceptForTipo(tipo);
        
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                this.procesarArchivo(file, tipo);
            }
        });
        
        input.click();
    }
    
    getAcceptForTipo(tipo) {
        const formatos = {
            estudiantes: '.json,.csv,.xls,.xlsx',
            calificaciones: '.json,.csv',
            indicadores: '.json'
        };
        
        return formatos[tipo] || '.json,.csv,.xls,.xlsx';
    }
    
    async procesarArchivos(files) {
        console.log(`📁 Procesando ${files.length} archivos...`);
        
        const resultados = [];
        
        for (const file of files) {
            try {
                const resultado = await this.procesarArchivo(file);
                resultados.push(resultado);
            } catch (error) {
                resultados.push({
                    archivo: file.name,
                    estado: 'error',
                    error: error.message
                });
            }
        }
        
        this.mostrarResultadosImportacion(resultados);
        return resultados;
    }
    
    async procesarArchivo(file, tipoDeteccion = null) {
        console.log(`📄 Procesando: ${file.name}`);
        
        // Detectar tipo de archivo
        const extension = file.name.split('.').pop().toLowerCase();
        const tipoArchivo = this.detectarTipoArchivo(file, extension);
        
        // Detectar tipo de datos si no se especifica
        const tipoDatos = tipoDeteccion || this.detectarTipoDatos(file.name);
        
        // Leer archivo
        const contenido = await this.leerArchivo(file, tipoArchivo);
        
        // Validar estructura
        const validacion = this.validarEstructura(contenido, tipoDatos);
        
        if (!validacion.valido) {
            throw new Error(`Estructura inválida: ${validacion.errores.join(', ')}`);
        }
        
        // Procesar según tipo
        let datosProcesados;
        
        switch (tipoArchivo) {
            case 'json':
                datosProcesados = contenido;
                break;
                
            case 'csv':
                datosProcesados = this.procesarCSV(contenido, tipoDatos);
                break;
                
            case 'excel':
                datosProcesados = await this.procesarExcel(contenido, tipoDatos);
                break;
                
            default:
                throw new Error(`Formato no soportado: ${tipoArchivo}`);
        }
        
        // Importar datos al sistema
        const resultadoImportacion = await this.importarDatos(datosProcesados, tipoDatos);
        
        return {
            archivo: file.name,
            tipo: tipoDatos,
            estado: 'completado',
            registros: resultadoImportacion.registros,
            advertencias: resultadoImportacion.advertencias,
            timestamp: new Date().toISOString()
        };
    }
    
    detectarTipoArchivo(file, extension) {
        const mimeType = file.type;
        
        if (mimeType.includes('json') || extension === 'json') return 'json';
        if (mimeType.includes('csv') || extension === 'csv') return 'csv';
        if (mimeType.includes('excel') || extension === 'xls' || extension === 'xlsx') return 'excel';
        
        // Intentar detectar por contenido
        if (file.name.toLowerCase().includes('.json')) return 'json';
        if (file.name.toLowerCase().includes('.csv')) return 'csv';
        if (file.name.toLowerCase().includes('.xls')) return 'excel';
        
        throw new Error('Formato de archivo no reconocido');
    }
    
    detectarTipoDatos(nombreArchivo) {
        const nombre = nombreArchivo.toLowerCase();
        
        if (nombre.includes('estudiantes') || nombre.includes('students')) return 'estudiantes';
        if (nombre.includes('calificaciones') || nombre.includes('grades')) return 'calificaciones';
        if (nombre.includes('indicadores') || nombre.includes('indicators')) return 'indicadores';
        if (nombre.includes('modulos') || nombre.includes('modules')) return 'modulos';
        
        // Por defecto, asumir estudiantes
        return 'estudiantes';
    }
    
    leerArchivo(file, tipo) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    let contenido;
                    
                    switch (tipo) {
                        case 'json':
                            contenido = JSON.parse(event.target.result);
                            break;
                            
                        case 'csv':
                            contenido = event.target.result;
                            break;
                            
                        case 'excel':
                            contenido = event.target.result;
                            break;
                            
                        default:
                            contenido = event.target.result;
                    }
                    
                    resolve(contenido);
                    
                } catch (error) {
                    reject(new Error(`Error leyendo archivo ${tipo}: ${error.message}`));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Error al leer el archivo'));
            };
            
            // Leer según tipo
            if (tipo === 'json' || tipo === 'csv') {
                reader.readAsText(file);
            } else if (tipo === 'excel') {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsText(file);
            }
        });
    }
    
    validarEstructura(datos, tipo) {
        const esquema = this.esquemasValidacion[tipo];
        if (!esquema) {
            return { valido: true, advertencias: ['Tipo no validado'] }; // No validar tipos desconocidos
        }
        
        const errores = [];
        const advertencias = [];
        
        // Verificar que sea un array
        if (!Array.isArray(datos)) {
            errores.push('Los datos deben ser un array de registros');
            return { valido: false, errores };
        }
        
        // Validar cada registro
        datos.forEach((registro, index) => {
            // Verificar campos requeridos
            esquema.camposRequeridos.forEach(campo => {
                if (!(campo in registro)) {
                    errores.push(`Registro ${index}: Falta campo requerido "${campo}"`);
                } else if (esquema.tipos[campo]) {
                    const tipoEsperado = esquema.tipos[campo];
                    const tipoReal = typeof registro[campo];
                    
                    if (tipoReal !== tipoEsperado) {
                        advertencias.push(`Registro ${index}: Campo "${campo}" es ${tipoReal}, se esperaba ${tipoEsperado}`);
                    }
                }
            });
            
            // Verificar campos opcionales
            if (esquema.camposOpcionales) {
                esquema.camposOpcionales.forEach(campo => {
                    if (campo in registro && esquema.tipos[campo]) {
                        const tipoEsperado = esquema.tipos[campo];
                        const tipoReal = typeof registro[campo];
                        
                        if (tipoReal !== tipoEsperado) {
                            advertencias.push(`Registro ${index}: Campo opcional "${campo}" es ${tipoReal}, se esperaba ${tipoEsperado}`);
                        }
                    }
                });
            }
        });
        
        return {
            valido: errores.length === 0,
            errores: errores,
            advertencias: advertencias
        };
    }
    
    procesarCSV(csvText, tipo) {
        try {
            const lineas = csvText.split('\n');
            const headers = lineas[0].split(',').map(h => h.trim());
            const registros = [];
            
            for (let i = 1; i < lineas.length; i++) {
                const linea = lineas[i].trim();
                if (!linea) continue;
                
                const valores = this.parseCSVLine(linea);
                const registro = {};
                
                headers.forEach((header, index) => {
                    if (valores[index] !== undefined) {
                        // Intentar convertir tipos
                        let valor = valores[index].trim();
                        
                        // Convertir números
                        if (!isNaN(valor) && valor !== '') {
                            valor = Number(valor);
                        }
                        // Convertir arrays (necesidades, etc.)
                        else if (valor.includes(';')) {
                            valor = valor.split(';').map(v => v.trim()).filter(v => v);
                        }
                        // Convertir booleanos
                        else if (valor.toLowerCase() === 'true' || valor.toLowerCase() === 'false') {
                            valor = valor.toLowerCase() === 'true';
                        }
                        
                        registro[header] = valor;
                    }
                });
                
                registros.push(registro);
            }
            
            return registros;
            
        } catch (error) {
            throw new Error(`Error procesando CSV: ${error.message}`);
        }
    }
    
    parseCSVLine(linea) {
        const valores = [];
        let valorActual = '';
        let entreComillas = false;
        
        for (let i = 0; i < linea.length; i++) {
            const caracter = linea[i];
            
            if (caracter === '"') {
                entreComillas = !entreComillas;
            } else if (caracter === ',' && !entreComillas) {
                valores.push(valorActual);
                valorActual = '';
            } else {
                valorActual += caracter;
            }
        }
        
        valores.push(valorActual);
        return valores;
    }
    
    async procesarExcel(data, tipo) {
        // En una implementación real, usaríamos una librería como SheetJS
        // Por ahora, simulamos procesamiento básico
        console.warn('⚠️ Procesamiento de Excel requiere librería SheetJS');
        
        // Simular datos de ejemplo
        return [
            { id: 'importado_1', nombre: 'Estudiante Importado', codigo: 'IMP001', grupo: '9°A' },
            { id: 'importado_2', nombre: 'Estudiante Importado 2', codigo: 'IMP002', grupo: '9°A' }
        ];
    }
    
    async importarDatos(datos, tipo) {
        console.log(`📥 Importando ${datos.length} registros de tipo ${tipo}`);
        
        const resultado = {
            registros: 0,
            actualizados: 0,
            nuevos: 0,
            errores: 0,
            advertencias: []
        };
        
        try {
            switch (tipo) {
                case 'estudiantes':
                    await this.importarEstudiantes(datos, resultado);
                    break;
                    
                case 'calificaciones':
                    await this.importarCalificaciones(datos, resultado);
                    break;
                    
                case 'indicadores':
                    await this.importarIndicadores(datos, resultado);
                    break;
                    
                default:
                    throw new Error(`Tipo de importación no soportado: ${tipo}`);
            }
            
            // Notificar al sistema principal
            this.notificarImportacionCompletada(tipo, resultado);
            
            return resultado;
            
        } catch (error) {
            console.error('❌ Error en importación:', error);
            resultado.errores++;
            resultado.error = error.message;
            return resultado;
        }
    }
    
    async importarEstudiantes(estudiantes, resultado) {
        // Cargar estudiantes existentes
        let estudiantesExistentes = [];
        try {
            const existentes = localStorage.getItem('estudiantes');
            if (existentes) {
                estudiantesExistentes = JSON.parse(existentes);
            }
        } catch (error) {
            console.warn('⚠️ Error cargando estudiantes existentes:', error);
        }
        
        // Procesar cada estudiante nuevo
        estudiantes.forEach(estudiante => {
            try {
                // Verificar si ya existe
                const indiceExistente = estudiantesExistentes.findIndex(e => e.id === estudiante.id);
                
                if (indiceExistente >= 0) {
                    // Actualizar estudiante existente
                    estudiantesExistentes[indiceExistente] = {
                        ...estudiantesExistentes[indiceExistente],
                        ...estudiante,
                        fechaActualizacion: new Date().toISOString()
                    };
                    resultado.actualizados++;
                } else {
                    // Agregar nuevo estudiante
                    estudiantesExistentes.push({
                        ...estudiante,
                        fechaImportacion: new Date().toISOString()
                    });
                    resultado.nuevos++;
                }
                
                resultado.registros++;
                
            } catch (error) {
                console.warn(`⚠️ Error procesando estudiante ${estudiante.id}:`, error);
                resultado.errores++;
            }
        });
        
        // Guardar estudiantes actualizados
        try {
            localStorage.setItem('estudiantes', JSON.stringify(estudiantesExistentes));
            console.log(`✅ Estudiantes guardados: ${estudiantesExistentes.length} total`);
        } catch (error) {
            throw new Error(`Error guardando estudiantes: ${error.message}`);
        }
    }
    
    async importarCalificaciones(calificaciones, resultado) {
        // Procesar cada calificación
        calificaciones.forEach(calificacion => {
            try {
                const clave = `calificaciones_${calificacion.estudianteId}_${calificacion.mes}`;
                
                // Cargar calificaciones existentes para este estudiante y mes
                let calificacionesExistentes = {};
                try {
                    const existentes = localStorage.getItem(clave);
                    if (existentes) {
                        calificacionesExistentes = JSON.parse(existentes);
                    }
                } catch (error) {
                    console.warn(`⚠️ Error cargando calificaciones existentes para ${clave}`);
                }
                
                // Agregar/actualizar calificación
                calificacionesExistentes[calificacion.indicadorId] = calificacion.nivel;
                
                // Guardar
                localStorage.setItem(clave, JSON.stringify(calificacionesExistentes));
                
                resultado.registros++;
                resultado.nuevos++; // Siempre nuevo para calificaciones
                
            } catch (error) {
                console.warn(`⚠️ Error procesando calificación:`, error);
                resultado.errores++;
            }
        });
        
        console.log(`✅ Calificaciones importadas: ${resultado.registros}`);
    }
    
    async importarIndicadores(indicadores, resultado) {
        // En una implementación real, esto actualizaría los módulos
        // Por ahora, mostramos mensaje
        console.log(`📊 ${indicadores.length} indicadores listos para importar`);
        
        // Guardar en localStorage temporal para revisión
        localStorage.setItem('indicadores_importados', JSON.stringify({
            datos: indicadores,
            timestamp: new Date().toISOString(),
            cantidad: indicadores.length
        }));
        
        resultado.registros = indicadores.length;
        resultado.advertencias.push('Indicadores guardados para revisión manual');
    }
    
    notificarImportacionCompletada(tipo, resultado) {
        // Notificar al sistema principal si existe
        if (window.sistemaFT) {
            window.sistemaFT.mostrarNotificacion(
                `Importación ${tipo} completada`,
                `${resultado.registros} registros procesados (${resultado.nuevos} nuevos, ${resultado.actualizados} actualizados)`,
                resultado.errores > 0 ? 'warning' : 'success'
            );
            
            // Actualizar datos en el sistema
            if (tipo === 'estudiantes' && window.sistemaFT.actualizarDropdownEstudiantes) {
                window.sistemaFT.actualizarDropdownEstudiantes();
            }
        }
        
        // Disparar evento personalizado
        const event = new CustomEvent('importacionCompletada', {
            detail: { tipo, resultado }
        });
        document.dispatchEvent(event);
    }
    
    mostrarResultadosImportacion(resultados) {
        const exitosos = resultados.filter(r => r.estado === 'completado').length;
        const errores = resultados.filter(r => r.estado === 'error').length;
        
        const html = `
            <div class="modal" id="importResultsModal">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3>Resultados de Importación</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="import-summary">
                            <div class="summary-item ${exitosos > 0 ? 'success' : ''}">
                                <i class="fas fa-check-circle"></i>
                                <div>
                                    <strong>${exitosos} archivos procesados</strong>
                                    <small>Importación exitosa</small>
                                </div>
                            </div>
                            <div class="summary-item ${errores > 0 ? 'error' : ''}">
                                <i class="fas fa-times-circle"></i>
                                <div>
                                    <strong>${errores} archivos con errores</strong>
                                    <small>Requieren atención</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="import-details">
                            <h4>Detalles por archivo:</h4>
                            <div class="details-list">
                                ${resultados.map(resultado => `
                                    <div class="detail-item ${resultado.estado === 'completado' ? 'success' : 'error'}">
                                        <i class="fas fa-${resultado.estado === 'completado' ? 'check' : 'times'}"></i>
                                        <div class="detail-info">
                                            <strong>${resultado.archivo}</strong>
                                            <small>Tipo: ${resultado.tipo || 'No detectado'}</small>
                                            ${resultado.estado === 'completado' ? 
                                                `<small>Registros: ${resultado.registros || 0}</small>` :
                                                `<small class="error-text">Error: ${resultado.error || 'Desconocido'}</small>`
                                            }
                                        </div>
                                        ${resultado.advertencias && resultado.advertencias.length > 0 ?
                                            `<div class="detail-warnings">
                                                <small>⚠ ${resultado.advertencias.length} advertencias</small>
                                            </div>` : ''
                                        }
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        ${errores > 0 ? `
                            <div class="import-help">
                                <h4>¿Necesita ayuda?</h4>
                                <p>Algunos archivos no pudieron importarse. Verifique:</p>
                                <ul>
                                    <li>Formato correcto (JSON, CSV, Excel)</li>
                                    <li>Estructura de datos esperada</li>
                                    <li>Codificación de caracteres (UTF-8 recomendado)</li>
                                </ul>
                                <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                                    <i class="fas fa-download"></i> Descargar Plantillas
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button class="btn-primary" onclick="location.reload()">
                            <i class="fas fa-sync"></i> Recargar Datos
                        </button>
                        <button class="btn-secondary modal-close">Continuar</button>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar modal
        document.body.insertAdjacentHTML('beforeend', html);
        const modal = document.getElementById('importResultsModal');
        modal.style.display = 'flex';
        
        // Configurar cierre
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    descargarPlantillas() {
        const plantillas = {
            estudiantes: this.generarPlantillaEstudiantes(),
            calificaciones: this.generarPlantillaCalificaciones(),
            indicadores: this.generarPlantillaIndicadores()
        };
        
        const modalHTML = `
            <div class="modal" id="templatesModal">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3>Descargar Plantillas</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Seleccione el tipo de plantilla que necesita:</p>
                        <div class="templates-list">
                            ${Object.entries(plantillas).map(([tipo, contenido]) => `
                                <div class="template-item" data-tipo="${tipo}">
                                    <i class="fas fa-file-excel"></i>
                                    <div>
                                        <strong>${this.capitalize(tipo)}</strong>
                                        <small>Formato: CSV y Excel</small>
                                    </div>
                                    <button class="btn-download" data-tipo="${tipo}">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('templatesModal');
        modal.style.display = 'flex';
        
        // Configurar descargas
        modal.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipo = e.target.closest('.btn-download').dataset.tipo;
                this.descargarPlantilla(tipo, plantillas[tipo]);
            });
        });
        
        // Cerrar modal
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    generarPlantillaEstudiantes() {
        return `id,codigo,nombre,grupo,institucion,necesidades,telefono,correo,asistencia,promedio_historico
2025101,2025101,Ana Rodríguez Pérez,9°A,Liceo Experimental,,8888-8888,ana@ejemplo.com,95,85.5
2025102,2025102,Carlos Méndez González,9°A,Liceo Experimental,"Prioridad I;Acompañamiento",7777-7777,carlos@ejemplo.com,82,68.3
2025103,2025103,María Fernández López,9°A,Liceo Experimental,,6666-6666,maria@ejemplo.com,98,92.1
2025104,2025104,José Hernández Castro,9°A,Liceo Experimental,Acompañamiento académico,5555-5555,jose@ejemplo.com,75,62.8
2025105,2025105,Laura Martínez Rojas,9°A,Liceo Experimental,,4444-4444,laura@ejemplo.com,90,78.6`;
    }
    
    generarPlantillaCalificaciones() {
        return `estudianteId,indicadorId,nivel,mes,comentario,timestamp
2025101,ind-1,3,Febrero,Excelente desempeño,2024-02-15
2025101,ind-2,2,Febrero,Buen trabajo,2024-02-15
2025102,ind-1,1,Febrero,Necesita apoyo,2024-02-15
2025102,ind-2,2,Febrero,Progresando,2024-02-15`;
    }
    
    generarPlantillaIndicadores() {
        return `id,texto,nivel,modulo,criterios_alto,criterios_medio,criterios_bajo
ind-1,Aplica herramientas ofimáticas para la creación de documentos digitales,III,ofimatica,"Crea documentos complejos con formato avanzado","Crea documentos básicos con formato adecuado","Crea documentos simples con formato básico"
ind-2,Utiliza hojas de cálculo para organizar y analizar información,III,ofimatica,"Crea fórmulas complejas y gráficos detallados","Usa fórmulas básicas y crea gráficos simples","Ingresa datos en celdas sin formato especial"`;
    }
    
    descargarPlantilla(tipo, contenido) {
        const blob = new Blob([contenido], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plantilla_${tipo}_ft_mep.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    capitalize(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    // ===== UTILIDADES =====
    
    getEstadisticas() {
        const estadisticas = {
            formatosSoportados: Object.keys(this.formatosSoportados),
            esquemasDefinidos: Object.keys(this.esquemasValidacion),
            ultimaImportacion: localStorage.getItem('ultima_importacion_fecha')
        };
        
        return estadisticas;
    }
    
    limpiarDatosImportados() {
        const claves = [
            'indicadores_importados',
            'importacion_temporal',
            'ultima_importacion_fecha'
        ];
        
        claves.forEach(clave => {
            localStorage.removeItem(clave);
        });
        
        console.log('🧹 Datos de importación limpiados');
    }
}

// ==============================================
// INICIALIZACIÓN GLOBAL
// ==============================================

// Crear instancia global
window.importManager = new ImportManager();

// Métodos globales
window.importarDatos = (files) => window.importManager.procesarArchivos(files);
window.descargarPlantilla = (tipo) => window.importManager.descargarPlantilla(tipo);

console.log('✅ ImportManager inicializado globalmente');

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImportManager;
}