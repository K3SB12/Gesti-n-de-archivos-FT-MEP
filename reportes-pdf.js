// ==============================================
// SISTEMA DE REPORTES PDF - FT-MEP
// Generación de reportes, certificados y boletas
// ==============================================

class ReportesPDF {
    constructor() {
        this.config = {
            orientacion: 'portrait',
            unidad: 'mm',
            formato: 'a4',
            margenes: { top: 20, right: 15, bottom: 20, left: 15 },
            encabezado: {
                logo: null,
                titulo: 'Sistema FT-MEP Costa Rica',
                subtitulo: 'Formación Tecnológica'
            },
            piePagina: function(pagina, total) {
                return `Página ${pagina} de ${total} - ${new Date().toLocaleDateString()}`;
            }
        };
        
        this.plantillas = {
            reporteEstudiante: this.plantillaReporteEstudiante.bind(this),
            boletaNotas: this.plantillaBoletaNotas.bind(this),
            certificado: this.plantillaCertificado.bind(this),
            informeGrupo: this.plantillaInformeGrupo.bind(this),
            rúbricaEvaluacion: this.plantillaRubricaEvaluacion.bind(this)
        };
        
        this.init();
    }
    
    init() {
        console.log('📊 Sistema de Reportes PDF inicializado');
        
        // Verificar si jsPDF está disponible
        if (typeof jspdf === 'undefined') {
            console.warn('⚠️ jsPDF no está cargado. Los reportes requerirán la librería.');
            this.mostrarAdvertenciaJsPDF();
        }
    }
    
    mostrarAdvertenciaJsPDF() {
        const advertencia = document.createElement('div');
        advertencia.className = 'alert alert-warning';
        advertencia.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <strong>jsPDF no encontrado</strong>
                <p>La generación de PDFs requiere la librería jsPDF.</p>
                <p><small>Se cargará automáticamente cuando sea necesario.</small></p>
            </div>
        `;
        
        // Insertar al inicio del contenedor principal
        const main = document.querySelector('main');
        if (main) {
            main.insertAdjacentElement('afterbegin', advertencia);
            
            // Auto-remover después de 10 segundos
            setTimeout(() => {
                if (advertencia.parentNode) {
                    advertencia.remove();
                }
            }, 10000);
        }
    }
    
    async cargarJsPDF() {
        if (typeof jspdf !== 'undefined') {
            return jspdf.jsPDF;
        }
        
        console.log('📦 Cargando jsPDF...');
        
        try {
            // Cargar jsPDF desde CDN
            await this.cargarScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            
            // Cargar autoTable si no está
            if (typeof jspdf === 'undefined') {
                throw new Error('jsPDF no se cargó correctamente');
            }
            
            console.log('✅ jsPDF cargado correctamente');
            return jspdf.jsPDF;
            
        } catch (error) {
            console.error('❌ Error cargando jsPDF:', error);
            throw new Error('No se pudo cargar la librería de PDF');
        }
    }
    
    async cargarScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // ===== GENERACIÓN DE REPORTES =====
    
    async generarReporteEstudiante(estudiante, calificaciones, modulo, periodo) {
        console.log(`📄 Generando reporte para: ${estudiante.nombre}`);
        
        try {
            const JsPDF = await this.cargarJsPDF();
            const doc = new JsPDF(this.config);
            
            // Configurar documento
            this.configurarDocumento(doc, `Reporte de ${estudiante.nombre}`);
            
            // Generar contenido
            const contenido = this.plantillas.reporteEstudiante(estudiante, calificaciones, modulo, periodo);
            
            // Agregar contenido al PDF
            this.agregarContenido(doc, contenido);
            
            // Guardar PDF
            const nombreArchivo = `Reporte_${estudiante.nombre.replace(/\s+/g, '_')}_${periodo}.pdf`;
            doc.save(nombreArchivo);
            
            return {
                estudiante: estudiante.nombre,
                archivo: nombreArchivo,
                tamaño: 'generado',
                estado: 'completado'
            };
            
        } catch (error) {
            console.error('❌ Error generando reporte:', error);
            throw error;
        }
    }
    
    async generarBoletaNotas(estudiante, notas, ciclo, periodo) {
        console.log(`📊 Generando boleta para: ${estudiante.nombre}`);
        
        try {
            const JsPDF = await this.cargarJsPDF();
            const doc = new JsPDF(this.config);
            
            this.configurarDocumento(doc, `Boleta de Notas - ${estudiante.nombre}`);
            
            const contenido = this.plantillas.boletaNotas(estudiante, notas, ciclo, periodo);
            this.agregarContenido(doc, contenido);
            
            const nombreArchivo = `Boleta_${estudiante.nombre.replace(/\s+/g, '_')}_${periodo}.pdf`;
            doc.save(nombreArchivo);
            
            return {
                estudiante: estudiante.nombre,
                archivo: nombreArchivo,
                estado: 'completado'
            };
            
        } catch (error) {
            console.error('❌ Error generando boleta:', error);
            throw error;
        }
    }
    
    async generarInformeGrupo(estudiantes, estadisticas, ciclo, periodo) {
        console.log(`📈 Generando informe grupal para ${estudiantes.length} estudiantes`);
        
        try {
            const JsPDF = await this.cargarJsPDF();
            const doc = new JsPDF(this.config);
            
            this.configurarDocumento(doc, `Informe Grupal - ${ciclo} ${periodo}`);
            
            const contenido = this.plantillas.informeGrupo(estudiantes, estadisticas, ciclo, periodo);
            this.agregarContenido(doc, contenido);
            
            const nombreArchivo = `Informe_Grupo_${ciclo}_${periodo}.pdf`;
            doc.save(nombreArchivo);
            
            return {
                grupo: ciclo,
                periodo: periodo,
                estudiantes: estudiantes.length,
                archivo: nombreArchivo,
                estado: 'completado'
            };
            
        } catch (error) {
            console.error('❌ Error generando informe grupal:', error);
            throw error;
        }
    }
    
    async generarCertificado(estudiante, modulo, notas, instructor) {
        console.log(`🎓 Generando certificado para: ${estudiante.nombre}`);
        
        try {
            const JsPDF = await this.cargarJsPDF();
            const doc = new JsPDF({
                ...this.config,
                orientacion: 'landscape' // Certificados en horizontal
            });
            
            const contenido = this.plantillas.certificado(estudiante, modulo, notas, instructor);
            this.agregarContenidoCertificado(doc, contenido);
            
            const nombreArchivo = `Certificado_${estudiante.nombre.replace(/\s+/g, '_')}_${modulo}.pdf`;
            doc.save(nombreArchivo);
            
            return {
                estudiante: estudiante.nombre,
                modulo: modulo,
                archivo: nombreArchivo,
                estado: 'completado'
            };
            
        } catch (error) {
            console.error('❌ Error generando certificado:', error);
            throw error;
        }
    }
    
    async generarRubricaEvaluacion(indicadores, criterios, estudiante = null) {
        console.log(`📋 Generando rúbrica de evaluación`);
        
        try {
            const JsPDF = await this.cargarJsPDF();
            const doc = new JsPDF(this.config);
            
            this.configurarDocumento(doc, 'Rúbrica de Evaluación');
            
            const contenido = this.plantillas.rúbricaEvaluacion(indicadores, criterios, estudiante);
            this.agregarContenidoTabla(doc, contenido);
            
            const nombreArchivo = estudiante 
                ? `Rúbrica_${estudiante.nombre.replace(/\s+/g, '_')}.pdf`
                : `Rúbrica_General.pdf`;
            
            doc.save(nombreArchivo);
            
            return {
                tipo: 'rúbrica',
                indicadores: indicadores.length,
                archivo: nombreArchivo,
                estado: 'completado'
            };
            
        } catch (error) {
            console.error('❌ Error generando rúbrica:', error);
            throw error;
        }
    }
    
    // ===== PLANTILLAS DE CONTENIDO =====
    
    plantillaReporteEstudiante(estudiante, calificaciones, modulo, periodo) {
        const fecha = new Date().toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const estadisticas = this.calcularEstadisticasEstudiante(calificaciones);
        
        return {
            encabezado: {
                titulo: 'REPORTE INDIVIDUAL DE DESEMPEÑO',
                subtitulo: `Formación Tecnológica - ${modulo.toUpperCase()}`,
                fecha: fecha
            },
            secciones: [
                {
                    titulo: 'INFORMACIÓN DEL ESTUDIANTE',
                    contenido: [
                        `Nombre: ${estudiante.nombre}`,
                        `Código: ${estudiante.codigo}`,
                        `Grupo: ${estudiante.grupo}`,
                        `Institución: ${estudiante.institucion}`,
                        `Período: ${periodo}`,
                        `Fecha de emisión: ${fecha}`
                    ]
                },
                {
                    titulo: 'ESTADÍSTICAS DE DESEMPEÑO',
                    contenido: [
                        `Promedio general: ${estadisticas.promedio}%`,
                        `Nivel de logro: ${estadisticas.nivelLogro}`,
                        `Indicadores evaluados: ${estadisticas.totalEvaluados}`,
                        `Indicadores destacados: ${estadisticas.destacados}`,
                        `Áreas de mejora: ${estadisticas.mejora}`
                    ]
                },
                {
                    titulo: 'CALIFICACIONES POR INDICADOR',
                    tipo: 'tabla',
                    datos: this.formatearCalificacionesTabla(calificaciones)
                },
                {
                    titulo: 'OBSERVACIONES Y RECOMENDACIONES',
                    contenido: this.generarObservaciones(estadisticas, estudiante.necesidades)
                },
                {
                    titulo: 'FIRMAS',
                    contenido: [
                        '___________________________',
                        'Docente a cargo',
                        '',
                        '___________________________',
                        'Estudiante'
                    ]
                }
            ]
        };
    }
    
    plantillaBoletaNotas(estudiante, notas, ciclo, periodo) {
        const fecha = new Date().toLocaleDateString('es-CR');
        
        return {
            encabezado: {
                titulo: 'BOLETA OFICIAL DE CALIFICACIONES',
                subtitulo: `Ministerio de Educación Pública - ${ciclo}`,
                fecha: fecha
            },
            secciones: [
                {
                    titulo: 'DATOS DEL ESTUDIANTE',
                    contenido: [
                        `Nombre completo: ${estudiante.nombre}`,
                        `Cédula/Código: ${estudiante.codigo}`,
                        `Grupo/Sección: ${estudiante.grupo}`,
                        `Período académico: ${periodo}`,
                        `Fecha de emisión: ${fecha}`
                    ]
                },
                {
                    titulo: 'CALIFICACIONES FINALES',
                    tipo: 'tabla',
                    datos: [
                        ['Componente', 'Porcentaje', 'Calificación', 'Ponderado'],
                        ['Trabajo Cotidiano', `${notas.componentes.trabajo_cotidiano.porcentaje}%`, `${notas.componentes.trabajo_cotidiano.valor}%`, `${notas.componentes.trabajo_cotidiano.ponderado.toFixed(2)}`],
                        ['Tareas', `${notas.componentes.tareas.porcentaje}%`, `${notas.componentes.tareas.valor}%`, `${notas.componentes.tareas.ponderado.toFixed(2)}`],
                        notas.ciclo === 'III_Ciclo' 
                            ? ['Proyecto', `${notas.componentes.proyecto.porcentaje}%`, `${notas.componentes.proyecto.valor}%`, `${notas.componentes.proyecto.ponderado.toFixed(2)}`]
                            : ['Prueba Ejecución', `${notas.componentes.prueba_ejecucion.porcentaje}%`, `${notas.componentes.prueba_ejecucion.valor}%`, `${notas.componentes.prueba_ejecucion.ponderado.toFixed(2)}`],
                        ['Asistencia', `${notas.componentes.asistencia.porcentaje}%`, `${notas.componentes.asistencia.valor}%`, `${notas.componentes.asistencia.ponderado.toFixed(2)}`],
                        ['', '', 'TOTAL', `${notas.nota.toFixed(2)}`]
                    ]
                },
                {
                    titulo: 'RESULTADO FINAL',
                    contenido: [
                        `NOTA FINAL: ${notas.nota.toFixed(2)}`,
                        `ESTADO: ${notas.estado}`,
                        `OBSERVACIONES: ${this.generarObservacionNota(notas.nota)}`
                    ]
                },
                {
                    titulo: 'DESGLOSE DE CALIFICACIONES',
                    contenido: this.generarDesgloseCalificaciones(notas)
                }
            ]
        };
    }
    
    plantillaInformeGrupo(estudiantes, estadisticas, ciclo, periodo) {
        const fecha = new Date().toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Ordenar estudiantes por nota
        const estudiantesOrdenados = [...estudiantes].sort((a, b) => {
            const notaA = estadisticas.notas.find(n => n.estudiante === a.nombre)?.nota || 0;
            const notaB = estadisticas.notas.find(n => n.estudiante === b.nombre)?.nota || 0;
            return notaB - notaA;
        });
        
        return {
            encabezado: {
                titulo: 'INFORME GRUPAL DE DESEMPEÑO',
                subtitulo: `${ciclo} - ${periodo}`,
                fecha: fecha
            },
            secciones: [
                {
                    titulo: 'RESUMEN ESTADÍSTICO',
                    contenido: [
                        `Total de estudiantes: ${estadisticas.total}`,
                        `Promedio grupal: ${estadisticas.promedio.toFixed(2)}`,
                        `Nota máxima: ${estadisticas.maxima.toFixed(2)}`,
                        `Nota mínima: ${estadisticas.minima.toFixed(2)}`,
                        `Desviación estándar: ${estadisticas.desviacion.toFixed(2)}`,
                        `Porcentaje de aprobación: ${((estadisticas.distribucion.aprobados + estadisticas.distribucion.excelencia) / estadisticas.total * 100).toFixed(1)}%`
                    ]
                },
                {
                    titulo: 'DISTRIBUCIÓN DE NOTAS',
                    contenido: [
                        `Excelencia (90-100): ${estadisticas.distribucion.excelencia} estudiantes`,
                        `Aprobados (70-89): ${estadisticas.distribucion.aprobados} estudiantes`,
                        `Reprobados (0-69): ${estadisticas.distribucion.reprobados} estudiantes`
                    ]
                },
                {
                    titulo: 'RANKING DE ESTUDIANTES',
                    tipo: 'tabla',
                    datos: [
                        ['Posición', 'Estudiante', 'Nota Final', 'Estado'],
                        ...estudiantesOrdenados.map((estudiante, index) => {
                            const notaInfo = estadisticas.notas.find(n => n.estudiante === estudiante.nombre);
                            return [
                                `#${index + 1}`,
                                estudiante.nombre,
                                notaInfo?.nota?.toFixed(2) || 'N/A',
                                notaInfo?.estado || 'N/A'
                            ];
                        })
                    ]
                },
                {
                    titulo: 'ANÁLISIS Y RECOMENDACIONES',
                    contenido: this.generarAnalisisGrupo(estadisticas)
                }
            ]
        };
    }
    
    plantillaCertificado(estudiante, modulo, notas, instructor) {
        const fecha = new Date().toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return {
            encabezado: {
                titulo: 'CERTIFICADO DE APROBACIÓN',
                subtitulo: 'Formación Tecnológica - MEP Costa Rica',
                fecha: fecha
            },
            contenidoPrincipal: `
                <div style="text-align: center; margin: 40px 0;">
                    <h1 style="color: #2c3e50; font-size: 28px; margin-bottom: 30px;">CERTIFICADO</h1>
                    
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        El Ministerio de Educación Pública de Costa Rica certifica que:
                    </p>
                    
                    <h2 style="color: #3498db; font-size: 22px; margin: 30px 0; border-bottom: 2px solid #3498db; padding-bottom: 10px; display: inline-block;">
                        ${estudiante.nombre.toUpperCase()}
                    </h2>
                    
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        ha completado satisfactoriamente el módulo de
                    </p>
                    
                    <h3 style="color: #2c3e50; font-size: 20px; margin: 20px 0;">
                        ${modulo.toUpperCase()}
                    </h3>
                    
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        con una calificación final de
                    </p>
                    
                    <div style="font-size: 24px; font-weight: bold; color: #27ae60; margin: 20px 0;">
                        ${notas.nota.toFixed(2)} / 100
                    </div>
                    
                    <p style="font-size: 14px; margin-top: 40px;">
                        Expedido en San José, Costa Rica, el ${fecha}
                    </p>
                </div>
            `,
            firmas: [
                {
                    nombre: instructor || 'Docente a cargo',
                    cargo: 'Instructor'
                },
                {
                    nombre: 'Ministerio de Educación Pública',
                    cargo: 'Institución'
                }
            ]
        };
    }
    
    plantillaRubricaEvaluacion(indicadores, criterios, estudiante) {
        return {
            encabezado: {
                titulo: 'RÚBRICA DE EVALUACIÓN',
                subtitulo: estudiante ? `Estudiante: ${estudiante.nombre}` : 'Evaluación General',
                fecha: new Date().toLocaleDateString('es-CR')
            },
            secciones: [
                {
                    titulo: 'INSTRUCCIONES',
                    contenido: [
                        'Utilice esta rúbrica para evaluar el desempeño del estudiante.',
                        'Marque el nivel alcanzado en cada indicador.',
                        'Los niveles son: 3 (Alto), 2 (Medio), 1 (Bajo).'
                    ]
                },
                {
                    titulo: 'INDICADORES DE EVALUACIÓN',
                    tipo: 'tabla_rubrica',
                    datos: indicadores.map((indicador, index) => {
                        const criterio = criterios[indicador.id] || {
                            alto: { descripcion: 'Desempeño superior' },
                            medio: { descripcion: 'Desempeño adecuado' },
                            bajo: { descripcion: 'Desempeño básico' }
                        };
                        
                        return {
                            indicador: `${index + 1}. ${indicador.texto}`,
                            niveles: [
                                { nivel: 'Alto (3)', descripcion: criterio.alto.descripcion },
                                { nivel: 'Medio (2)', descripcion: criterio.medio.descripcion },
                                { nivel: 'Bajo (1)', descripcion: criterio.bajo.descripcion }
                            ],
                            calificacion: '___'
                        };
                    })
                },
                {
                    titulo: 'ESPACIO PARA OBSERVACIONES',
                    contenido: [
                        '________________________________________________________________',
                        '________________________________________________________________',
                        '________________________________________________________________'
                    ]
                }
            ]
        };
    }
    
    // ===== MÉTODOS AUXILIARES =====
    
    calcularEstadisticasEstudiante(calificaciones) {
        const valores = Object.values(calificaciones).map(v => {
            const conversion = { '1': 60, '2': 80, '3': 100 };
            return conversion[v] || 0;
        });
        
        if (valores.length === 0) {
            return {
                promedio: 0,
                nivelLogro: 'No evaluado',
                totalEvaluados: 0,
                destacados: 0,
                mejora: 0
            };
        }
        
        const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
        const destacados = valores.filter(v => v >= 90).length;
        const mejora = valores.filter(v => v < 70).length;
        
        let nivelLogro;
        if (promedio >= 90) nivelLogro = 'Excelente';
        else if (promedio >= 80) nivelLogro = 'Sobresaliente';
        else if (promedio >= 70) nivelLogro = 'Satisfactorio';
        else nivelLogro = 'En proceso';
        
        return {
            promedio: promedio.toFixed(2),
            nivelLogro: nivelLogro,
            totalEvaluados: valores.length,
            destacados: destacados,
            mejora: mejora
        };
    }
    
    formatearCalificacionesTabla(calificaciones) {
        const filas = [['Indicador', 'Nivel', 'Calificación', 'Porcentaje']];
        
        Object.entries(calificaciones).forEach(([indicadorId, nivel]) => {
            const conversion = { '1': { texto: 'Bajo', porcentaje: '60%' }, 
                                '2': { texto: 'Medio', porcentaje: '80%' }, 
                                '3': { texto: 'Alto', porcentaje: '100%' } };
            const info = conversion[nivel] || { texto: 'No evaluado', porcentaje: '0%' };
            
            filas.push([
                `Indicador ${indicadorId}`,
                info.texto,
                nivel,
                info.porcentaje
            ]);
        });
        
        return filas;
    }
    
    generarObservaciones(estadisticas, necesidades) {
        const observaciones = [];
        
        if (estadisticas.promedio >= 90) {
            observaciones.push('Desempeño excelente. Mantener el excelente trabajo.');
            observaciones.push('Demuestra dominio completo de los contenidos.');
        } else if (estadisticas.promedio >= 80) {
            observaciones.push('Buen desempeño. Continuar con el esfuerzo.');
            observaciones.push('Domina la mayoría de los contenidos.');
        } else if (estadisticas.promedio >= 70) {
            observaciones.push('Desempeño satisfactorio. Hay áreas para mejorar.');
            observaciones.push('Requiere reforzar algunos conceptos.');
        } else {
            observaciones.push('Desempeño requiere atención inmediata.');
            observaciones.push('Necesita apoyo adicional en varios temas.');
        }
        
        if (necesidades && necesidades.length > 0) {
            observaciones.push(`Necesidades específicas: ${necesidades.join(', ')}`);
            observaciones.push('Se requiere plan de apoyo individualizado.');
        }
        
        if (estadisticas.mejora > 0) {
            observaciones.push(`${estadisticas.mejora} indicadores requieren refuerzo.`);
        }
        
        if (estadisticas.destacados > 0) {
            observaciones.push(`${estadisticas.destacados} indicadores con desempeño destacado.`);
        }
        
        return observaciones;
    }
    
    generarObservacionNota(nota) {
        if (nota >= 90) return 'Excelente desempeño académico.';
        if (nota >= 80) return 'Buen desempeño, continúe así.';
        if (nota >= 70) return 'Desempeño satisfactorio, puede mejorar.';
        if (nota >= 60) return 'Desempeño mínimo, requiere apoyo.';
        return 'Desempeño insuficiente, necesita intervención.';
    }
    
    generarDesgloseCalificaciones(notas) {
        return [
            `Trabajo Cotidiano: ${notas.componentes.trabajo_cotidiano.valor}% (${notas.componentes.trabajo_cotidiano.porcentaje}%) = ${notas.componentes.trabajo_cotidiano.ponderado.toFixed(2)}`,
            `Tareas: ${notas.componentes.tareas.valor}% (${notas.componentes.tareas.porcentaje}%) = ${notas.componentes.tareas.ponderado.toFixed(2)}`,
            notas.ciclo === 'III_Ciclo' 
                ? `Proyecto: ${notas.componentes.proyecto.valor}% (${notas.componentes.proyecto.porcentaje}%) = ${notas.componentes.proyecto.ponderado.toFixed(2)}`
                : `Prueba Ejecución: ${notas.componentes.prueba_ejecucion.valor}% (${notas.componentes.prueba_ejecucion.porcentaje}%) = ${notas.componentes.prueba_ejecucion.ponderado.toFixed(2)}`,
            `Asistencia: ${notas.componentes.asistencia.valor}% (${notas.componentes.asistencia.porcentaje}%) = ${notas.componentes.asistencia.ponderado.toFixed(2)}`,
            `TOTAL: ${notas.nota.toFixed(2)}`
        ];
    }
    
    generarAnalisisGrupo(estadisticas) {
        const analisis = [];
        const porcentajeAprobacion = ((estadisticas.distribucion.aprobados + estadisticas.distribucion.excelencia) / estadisticas.total) * 100;
        
        if (porcentajeAprobacion >= 90) {
            analisis.push('El grupo muestra un excelente nivel de aprendizaje.');
            analisis.push('La mayoría de los estudiantes domina los contenidos.');
            analisis.push('Se recomienda mantener la metodología actual.');
        } else if (porcentajeAprobacion >= 75) {
            analisis.push('El grupo tiene un buen desempeño general.');
            analisis.push('Algunos estudiantes requieren atención adicional.');
            analisis.push('Se sugiere implementar tutorías de refuerzo.');
        } else if (porcentajeAprobacion >= 60) {
            analisis.push('El grupo muestra desempeño regular.');
            analisis.push('Varios estudiantes necesitan apoyo significativo.');
            analisis.push('Se recomienda revisar la estrategia de enseñanza.');
        } else {
            analisis.push('El grupo requiere intervención inmediata.');
            analisis.push('La mayoría de estudiantes presenta dificultades.');
            analisis.push('Necesario replantear la metodología y contenidos.');
        }
        
        if (estadisticas.desviacion > 15) {
            analisis.push('Existe alta variabilidad en el desempeño del grupo.');
            analisis.push('Se recomienda diferenciación de la enseñanza.');
        }
        
        if (estadisticas.distribucion.reprobados > estadisticas.total * 0.3) {
            analisis.push('Alto porcentaje de reprobación requiere atención.');
            analisis.push('Evaluar posibles causas y tomar medidas correctivas.');
        }
        
        return analisis;
    }
    
    // ===== MANIPULACIÓN DE PDF =====
    
    configurarDocumento(doc, titulo) {
        // Establecer propiedades del documento
        doc.setProperties({
            title: titulo,
            subject: 'Reporte FT-MEP',
            author: 'Sistema FT-MEP Costa Rica',
            keywords: 'educación, tecnología, MEP, Costa Rica',
            creator: 'FT-MEP Web App'
        });
        
        // Establecer fuente
        doc.setFont('helvetica');
        doc.setFontSize(12);
    }
    
    agregarContenido(doc, contenido) {
        let y = this.config.margenes.top;
        
        // Encabezado
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(contenido.encabezado.titulo, this.config.margenes.left, y);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        y += 10;
        doc.text(contenido.encabezado.subtitulo, this.config.margenes.left, y);
        
        y += 5;
        doc.setFontSize(10);
        doc.text(`Fecha: ${contenido.encabezado.fecha}`, doc.internal.pageSize.width - this.config.margenes.right - 40, y, { align: 'right' });
        
        y += 15;
        
        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(this.config.margenes.left, y, doc.internal.pageSize.width - this.config.margenes.right, y);
        y += 10;
        
        // Secciones
        contenido.secciones.forEach((seccion, index) => {
            // Verificar si necesitamos nueva página
            if (y > doc.internal.pageSize.height - 50) {
                doc.addPage();
                y = this.config.margenes.top;
            }
            
            // Título de sección
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(seccion.titulo, this.config.margenes.left, y);
            y += 8;
            
            // Contenido de sección
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            
            if (seccion.tipo === 'tabla') {
                // Agregar tabla
                y = this.agregarTabla(doc, seccion.datos, y);
            } else if (seccion.tipo === 'tabla_rubrica') {
                // Agregar rúbrica
                y = this.agregarRubrica(doc, seccion.datos, y);
            } else {
                // Texto normal
                seccion.contenido.forEach(linea => {
                    if (y > doc.internal.pageSize.height - 20) {
                        doc.addPage();
                        y = this.config.margenes.top;
                    }
                    
                    doc.text(linea, this.config.margenes.left + 5, y);
                    y += 7;
                });
            }
            
            y += 15; // Espacio entre secciones
        });
        
        // Pie de página
        this.agregarPiePagina(doc);
    }
    
    agregarContenidoCertificado(doc, contenido) {
        // Fondo decorativo (opcional)
        doc.setDrawColor(240, 240, 240);
        doc.setFillColor(240, 240, 240);
        doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20, 'F');
        
        // Borde decorativo
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(1);
        doc.rect(15, 15, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 30);
        
        // Contenido HTML (simulado)
        const lines = contenido.contenidoPrincipal.split('\n');
        let y = 50;
        
        lines.forEach(line => {
            if (line.includes('<h1')) {
                doc.setFontSize(28);
                doc.setFont('helvetica', 'bold');
                const text = line.replace(/<[^>]+>/g, '').trim();
                doc.text(text, doc.internal.pageSize.width / 2, y, { align: 'center' });
                y += 20;
            } else if (line.includes('<h2')) {
                doc.setFontSize(22);
                doc.setFont('helvetica', 'bold');
                const text = line.replace(/<[^>]+>/g, '').trim();
                doc.text(text, doc.internal.pageSize.width / 2, y, { align: 'center' });
                y += 15;
            } else if (line.includes('<h3')) {
                doc.setFontSize(20);
                doc.setFont('helvetica', 'bold');
                const text = line.replace(/<[^>]+>/g, '').trim();
                doc.text(text, doc.internal.pageSize.width / 2, y, { align: 'center' });
                y += 12;
            } else if (line.includes('<div') && line.includes('font-size: 24px')) {
                doc.setFontSize(24);
                doc.setFont('helvetica', 'bold');
                const text = line.replace(/<[^>]+>/g, '').trim();
                doc.setTextColor(39, 174, 96); // Verde
                doc.text(text, doc.internal.pageSize.width / 2, y, { align: 'center' });
                doc.setTextColor(0, 0, 0); // Volver a negro
                y += 15;
            } else {
                doc.setFontSize(line.includes('font-size: 14px') ? 14 : 16);
                doc.setFont('helvetica', 'normal');
                const text = line.replace(/<[^>]+>/g, '').trim();
                if (text) {
                    doc.text(text, doc.internal.pageSize.width / 2, y, { align: 'center' });
                    y += line.includes('margin: 40px') ? 40 : 8;
                }
            }
        });
        
        // Firmas
        y += 30;
        const anchoFirma = (doc.internal.pageSize.width - 40) / contenido.firmas.length;
        
        contenido.firmas.forEach((firma, index) => {
            const x = 20 + (anchoFirma * index) + (anchoFirma / 2);
            
            // Línea para firma
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(x - 40, y, x + 40, y);
            
            // Nombre
            doc.setFontSize(12);
            doc.text(firma.nombre, x, y + 10, { align: 'center' });
            
            // Cargo
            doc.setFontSize(10);
            doc.text(firma.cargo, x, y + 18, { align: 'center' });
        });
        
        // Sello (opcional)
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Documento generado electrónicamente por FT-MEP', 
                doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 20, 
                { align: 'center' });
    }
    
    agregarContenidoTabla(doc, contenido) {
        this.agregarContenido(doc, contenido);
    }
    
    agregarTabla(doc, datos, y) {
        const pageWidth = doc.internal.pageSize.width;
        const margen = this.config.margenes.left;
        const anchoDisponible = pageWidth - (margen * 2);
        
        // Calcular anchos de columna
        const numColumnas = datos[0].length;
        const anchoColumna = anchoDisponible / numColumnas;
        
        // Encabezado de tabla
        doc.setFillColor(41, 128, 185); // Azul MEP
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        
        datos[0].forEach((columna, index) => {
            const x = margen + (anchoColumna * index);
            doc.rect(x, y, anchoColumna, 10, 'F');
            doc.text(columna, x + 2, y + 7);
        });
        
        y += 10;
        
        // Filas de datos
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        for (let i = 1; i < datos.length; i++) {
            // Verificar si necesitamos nueva página
            if (y > doc.internal.pageSize.height - 20) {
                doc.addPage();
                y = this.config.margenes.top;
                
                // Volver a dibujar encabezado en nueva página
                doc.setFillColor(41, 128, 185);
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'bold');
                
                datos[0].forEach((columna, index) => {
                    const x = margen + (anchoColumna * index);
                    doc.rect(x, y, anchoColumna, 10, 'F');
                    doc.text(columna, x + 2, y + 7);
                });
                
                y += 10;
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'normal');
            }
            
            // Fondo alternado para filas
            if (i % 2 === 0) {
                doc.setFillColor(245, 245, 245);
                datos[0].forEach((_, index) => {
                    const x = margen + (anchoColumna * index);
                    doc.rect(x, y, anchoColumna, 8, 'F');
                });
            }
            
            // Contenido de fila
            datos[i].forEach((celda, index) => {
                const x = margen + (anchoColumna * index);
                doc.text(celda.toString(), x + 2, y + 6);
            });
            
            y += 8;
        }
        
        return y + 5;
    }
    
    agregarRubrica(doc, datos, y) {
        const pageWidth = doc.internal.pageSize.width;
        const margen = this.config.margenes.left;
        
        datos.forEach((item, index) => {
            // Verificar si necesitamos nueva página
            if (y > doc.internal.pageSize.height - 100) {
                doc.addPage();
                y = this.config.margenes.top;
            }
            
            // Indicador
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(item.indicador, margen, y);
            y += 7;
            
            // Niveles
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            
            item.niveles.forEach(nivel => {
                const texto = `${nivel.nivel}: ${nivel.descripcion}`;
                const lines = doc.splitTextToSize(texto, pageWidth - margen - 60);
                
                lines.forEach(line => {
                    doc.text(line, margen + 10, y);
                    y += 5;
                });
                
                y += 2;
            });
            
            // Espacio para calificación
            doc.text(`Calificación: ${item.calificacion}`, pageWidth - margen - 50, y - 15);
            
            y += 10;
            doc.setDrawColor(200, 200, 200);
            doc.line(margen, y, pageWidth - margen, y);
            y += 10;
        });
        
        return y;
    }
    
    agregarPiePagina(doc) {
        const totalPaginas = doc.internal.getNumberOfPages();
        
        for (let i = 1; i <= totalPaginas; i++) {
            doc.setPage(i);
            
            // Pie de página
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                this.config.piePagina(i, totalPaginas),
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
            
            // Número de página
            doc.text(
                `Página ${i} de ${totalPaginas}`,
                doc.internal.pageSize.width - this.config.margenes.right,
                doc.internal.pageSize.height - 10,
                { align: 'right' }
            );
        }
    }
    
    // ===== INTERFAZ PÚBLICA =====
    
    getPlantillasDisponibles() {
        return Object.keys(this.plantillas);
    }
    
    async generarReportePersonalizado(tipo, datos, opciones = {}) {
        if (!this.plantillas[tipo]) {
            throw new Error(`Plantilla no disponible: ${tipo}`);
        }
        
        try {
            const JsPDF = await this.cargarJsPDF();
            const doc = new JsPDF({
                ...this.config,
                ...opciones
            });
            
            this.configurarDocumento(doc, opciones.titulo || `Reporte ${tipo}`);
            
            const contenido = this.plantillas[tipo](...datos);
            
            if (tipo === 'certificado') {
                this.agregarContenidoCertificado(doc, contenido);
            } else {
                this.agregarContenido(doc, contenido);
            }
            
            const nombreArchivo = opciones.nombreArchivo || `Reporte_${tipo}_${Date.now()}.pdf`;
            
            if (opciones.modo === 'descargar') {
                doc.save(nombreArchivo);
            } else if (opciones.modo === 'abrir') {
                doc.output('dataurlnewwindow');
            } else {
                // Devolver como blob
                return doc.output('blob');
            }
            
            return {
                tipo: tipo,
                archivo: nombreArchivo,
                estado: 'completado'
            };
            
        } catch (error) {
            console.error('❌ Error generando reporte personalizado:', error);
            throw error;
        }
    }
    
    async generarVariosReportes(reportes) {
        console.log(`🔄 Generando ${reportes.length} reportes...`);
        
        const resultados = [];
        
        for (const reporte of reportes) {
            try {
                const resultado = await this.generarReportePersonalizado(
                    reporte.tipo,
                    reporte.datos,
                    reporte.opciones
                );
                
                resultados.push({
                    ...resultado,
                    estudiante: reporte.datos[0]?.nombre || 'N/A'
                });
                
            } catch (error) {
                resultados.push({
                    tipo: reporte.tipo,
                    estado: 'error',
                    error: error.message
                });
            }
        }
        
        return resultados;
    }
}

// ==============================================
// INICIALIZACIÓN GLOBAL
// ==============================================

// Crear instancia global
window.reportesPDF = new ReportesPDF();

// Métodos globales simplificados
window.generarReporteEstudiantePDF = (estudiante, calificaciones, modulo, periodo) =>
    window.reportesPDF.generarReporteEstudiante(estudiante, calificaciones, modulo, periodo);

window.generarBoletaNotasPDF = (estudiante, notas, ciclo, periodo) =>
    window.reportesPDF.generarBoletaNotas(estudiante, notas, ciclo, periodo);

window.generarInformeGrupoPDF = (estudiantes, estadisticas, ciclo, periodo) =>
    window.reportesPDF.generarInformeGrupo(estudiantes, estadisticas, ciclo, periodo);

console.log('✅ ReportesPDF inicializado globalmente');

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportesPDF;
}