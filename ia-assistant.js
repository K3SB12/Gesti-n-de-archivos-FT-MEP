// ==============================================
// ASISTENTE IA PARA FORMACIÓN TECNOLÓGICA - MEP
// Versión 2.0 - Especializado en educación técnica
// ==============================================

class IAAssistant {
    constructor() {
        this.config = {
            modelo: 'ft-mep-educativo',
            maxTokens: 1000,
            temperatura: 0.7,
            idioma: 'es'
        };
        
        this.conocimiento = {
            modulosFT: {
                ofimatica: {
                    temas: ['Word', 'Excel', 'PowerPoint', 'Access', 'Herramientas digitales'],
                    nivel: 'III Ciclo',
                    horas: 40
                },
                programacion: {
                    temas: ['Pensamiento computacional', 'Scratch', 'Python básico', 'HTML/CSS'],
                    nivel: 'III Ciclo',
                    horas: 40
                },
                redes: {
                    temas: ['Redes básicas', 'Seguridad informática', 'Protocolos', 'Cableado'],
                    nivel: 'III Ciclo',
                    horas: 40
                }
            },
            criteriosMEP: {
                alto: {
                    puntuacion: 3,
                    descripcion: 'Demuestra dominio completo del indicador',
                    rangoNotas: [90, 100]
                },
                medio: {
                    puntuacion: 2,
                    descripcion: 'Demuestra comprensión adecuada del indicador',
                    rangoNotas: [70, 89]
                },
                bajo: {
                    puntuacion: 1,
                    descripcion: 'Demuestra comprensión básica del indicador',
                    rangoNotas: [60, 69]
                }
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🤖 Asistente IA FT-MEP inicializado');
        this.cargarModeloLenguaje();
    }
    
    async cargarModeloLenguaje() {
        try {
            // Cargar vocabulario educativo especializado
            this.vocabulario = await this.cargarVocabularioEducativo();
            console.log('✅ Vocabulario educativo cargado');
        } catch (error) {
            console.warn('⚠️ No se pudo cargar vocabulario, usando base local');
            this.vocabulario = this.getVocabularioBase();
        }
    }
    
    async cargarVocabularioEducativo() {
        // En una implementación real, cargaría de un servicio
        return {
            indicadores: [
                "aplica", "utiliza", "crea", "diseña", "analiza", "evalúa",
                "resuelve", "implementa", "demuestra", "explica", "compara"
            ],
            competencias: [
                "pensamiento crítico", "resolución de problemas", "trabajo colaborativo",
                "comunicación efectiva", "creatividad", "responsabilidad"
            ],
            herramientas: [
                "software", "hardware", "plataformas digitales", "herramientas ofimáticas",
                "entornos de desarrollo", "recursos multimedia"
            ]
        };
    }
    
    getVocabularioBase() {
        return {
            indicadores: ["aplica", "utiliza", "crea", "diseña"],
            competencias: ["pensamiento crítico", "resolución de problemas"],
            herramientas: ["software", "hardware"]
        };
    }
    
    // ===== GENERACIÓN DE RÚBRICAS =====
    
    generarCriteriosDesdeIndicador(textoIndicador, ciclo) {
        console.log(`📝 Generando criterios para: ${textoIndicador.substring(0, 50)}...`);
        
        const palabrasClave = this.extraerPalabrasClave(textoIndicador);
        const verbo = this.extraerVerbo(textoIndicador);
        const objeto = this.extraerObjeto(textoIndicador);
        
        return {
            alto: {
                puntuacion: 3,
                descripcion: this.generarDescripcionNivel('alto', verbo, objeto, palabrasClave, ciclo)
            },
            medio: {
                puntuacion: 2,
                descripcion: this.generarDescripcionNivel('medio', verbo, objeto, palabrasClave, ciclo)
            },
            bajo: {
                puntuacion: 1,
                descripcion: this.generarDescripcionNivel('bajo', verbo, objeto, palabrasClave, ciclo)
            }
        };
    }
    
    extraerPalabrasClave(texto) {
        const palabras = texto.toLowerCase().split(' ');
        const palabrasClave = palabras.filter(palabra => 
            palabra.length > 4 && 
            !this.esPalabraComun(palabra)
        );
        
        return palabrasClave.length > 0 ? palabrasClave : ['tecnología', 'digital', 'herramientas'];
    }
    
    esPalabraComun(palabra) {
        const comunes = ['para', 'con', 'los', 'las', 'del', 'de', 'en', 'y', 'o', 'un', 'una'];
        return comunes.includes(palabra);
    }
    
    extraerVerbo(texto) {
        const verbos = ['aplica', 'utiliza', 'crea', 'diseña', 'analiza', 'evalúa', 'resuelve'];
        const palabras = texto.toLowerCase().split(' ');
        
        for (const palabra of palabras) {
            if (verbos.includes(palabra)) {
                return palabra;
            }
        }
        
        return 'utiliza'; // Verbo por defecto
    }
    
    extraerObjeto(texto) {
        // Extraer el objeto principal del indicador
        const palabras = texto.toLowerCase().split(' ');
        const stopWords = ['para', 'con', 'los', 'las', 'del', 'de', 'en'];
        
        // Buscar después del verbo
        let encontroVerbo = false;
        const objetos = [];
        
        for (const palabra of palabras) {
            if (this.esVerbo(palabra)) {
                encontroVerbo = true;
                continue;
            }
            
            if (encontroVerbo && !stopWords.includes(palabra) && palabra.length > 3) {
                objetos.push(palabra);
            }
        }
        
        return objetos.length > 0 ? objetos.join(' ') : 'herramientas tecnológicas';
    }
    
    esVerbo(palabra) {
        const verbos = ['aplica', 'utiliza', 'crea', 'diseña', 'analiza', 'evalúa', 'resuelve'];
        return verbos.includes(palabra.toLowerCase());
    }
    
    generarDescripcionNivel(nivel, verbo, objeto, palabrasClave, ciclo) {
        const descripciones = {
            alto: [
                `${verbo} ${objeto} de manera innovadora y eficiente, demostrando dominio completo`,
                `Demuestra excelencia al ${verbo} ${objeto}, integrando múltiples conceptos`,
                `${verbo} ${objeto} con precisión y creatividad, superando expectativas`
            ],
            medio: [
                `${verbo} ${objeto} de manera adecuada, cumpliendo con los requisitos básicos`,
                `Demuestra comprensión suficiente al ${verbo} ${objeto} de forma correcta`,
                `${verbo} ${objeto} con algunas limitaciones pero cumpliendo lo esencial`
            ],
            bajo: [
                `${verbo} ${objeto} de manera básica, requiriendo supervisión constante`,
                `Demuestra comprensión limitada al ${verbo} ${objeto}, con varios errores`,
                `${verbo} ${objeto} de forma elemental, necesitando apoyo significativo`
            ]
        };
        
        const ciclos = {
            'I': 'básico',
            'II': 'intermedio', 
            'III': 'avanzado'
        };
        
        const nivelCiclo = ciclos[ciclo] || 'intermedio';
        const opciones = descripciones[nivel];
        const descripcion = opciones[Math.floor(Math.random() * opciones.length)];
        
        // Personalizar según ciclo
        return `${descripcion} para el nivel ${nivelCiclo}.`;
    }
    
    // ===== ANÁLISIS DE RIESGO =====
    
    analizarRiesgoEstudiante(calificaciones, asistencia, periodo, necesidades = []) {
        console.log(`🔍 Analizando riesgo para estudiante...`);
        
        const promedio = calificaciones.promedio || 70;
        const asistenciaPorcentaje = asistencia || 80;
        
        // Factores de riesgo
        let puntajeRiesgo = 0;
        
        // Riesgo por calificaciones
        if (promedio < 65) puntajeRiesgo += 3;
        else if (promedio < 70) puntajeRiesgo += 2;
        else if (promedio < 75) puntajeRiesgo += 1;
        
        // Riesgo por asistencia
        if (asistenciaPorcentaje < 70) puntajeRiesgo += 3;
        else if (asistenciaPorcentaje < 80) puntajeRiesgo += 2;
        else if (asistenciaPorcentaje < 85) puntajeRiesgo += 1;
        
        // Riesgo por necesidades especiales
        if (necesidades.includes('Prioridad I')) puntajeRiesgo += 2;
        if (necesidades.includes('Acompañamiento académico')) puntajeRiesgo += 1;
        
        // Determinar nivel de riesgo
        let riesgo, color, recomendaciones;
        
        if (puntajeRiesgo >= 5) {
            riesgo = 'alto';
            color = '#f44336';
            recomendaciones = this.generarRecomendacionesRiesgo('alto', necesidades);
        } else if (puntajeRiesgo >= 3) {
            riesgo = 'medio';
            color = '#ff9800';
            recomendaciones = this.generarRecomendacionesRiesgo('medio', necesidades);
        } else {
            riesgo = 'bajo';
            color = '#4caf50';
            recomendaciones = this.generarRecomendacionesRiesgo('bajo', necesidades);
        }
        
        return {
            riesgo: riesgo,
            color: color,
            puntaje: puntajeRiesgo,
            factores: {
                calificaciones: promedio < 70 ? 'crítico' : promedio < 80 ? 'atención' : 'adecuado',
                asistencia: asistenciaPorcentaje < 80 ? 'crítico' : asistenciaPorcentaje < 90 ? 'atención' : 'adecuado',
                necesidades: necesidades.length > 0 ? 'especial' : 'regular'
            },
            recomendaciones: recomendaciones,
            intervencion: this.sugerirIntervencion(riesgo, periodo)
        };
    }
    
    generarRecomendacionesRiesgo(nivel, necesidades) {
        const recomendacionesBase = {
            alto: [
                'Reunión urgente con equipo de apoyo',
                'Plan de intervención individualizado',
                'Seguimiento diario de actividades',
                'Contacto inmediato con familia',
                'Adecuaciones curriculares significativas'
            ],
            medio: [
                'Seguimiento semanal de progreso',
                'Tutorías de refuerzo',
                'Acompañamiento en tareas',
                'Comunicación regular con familia',
                'Ajustes en metodología'
            ],
            bajo: [
                'Seguimiento mensual',
                'Refuerzo positivo',
                'Monitoreo de asistencia',
                'Comunicación preventiva',
                'Estímulo de participación'
            ]
        };
        
        let recomendaciones = recomendacionesBase[nivel];
        
        // Personalizar según necesidades
        if (necesidades.includes('Prioridad I')) {
            recomendaciones.push('Coordinación con departamento de orientación');
            recomendaciones.push('Evaluación psicopedagógica');
        }
        
        if (necesidades.includes('Acompañamiento académico')) {
            recomendaciones.push('Tutorías especializadas');
            recomendaciones.push('Material adaptado');
        }
        
        return recomendaciones.slice(0, 5); // Máximo 5 recomendaciones
    }
    
    sugerirIntervencion(nivelRiesgo, periodo) {
        const intervenciones = {
            alto: {
                tipo: 'Intervención intensiva',
                frecuencia: 'Diaria',
                duracion: 'Todo el periodo',
                responsables: ['Docente', 'Orientación', 'Familia']
            },
            medio: {
                tipo: 'Acompañamiento focalizado',
                frecuencia: 'Semanal',
                duracion: '6 semanas',
                responsables: ['Docente', 'Estudiante']
            },
            bajo: {
                tipo: 'Monitoreo preventivo',
                frecuencia: 'Mensual',
                duracion: 'Periodo completo',
                responsables: ['Docente']
            }
        };
        
        return intervenciones[nivelRiesgo];
    }
    
    // ===== SUGERENCIAS DE ACTIVIDADES =====
    
    sugerirActividadesDiferenciadas(modulo, nivelGrupo, temaEspecifico = null) {
        console.log(`💡 Sugiriendo actividades para ${modulo} - Nivel: ${nivelGrupo}`);
        
        const moduloInfo = this.conocimiento.modulosFT[modulo] || this.conocimiento.modulosFT.ofimatica;
        const temas = temaEspecifico ? [temaEspecifico] : moduloInfo.temas;
        
        const actividades = {
            basico: this.generarActividadesBasicas(temas, modulo),
            intermedio: this.generarActividadesIntermedias(temas, modulo),
            avanzado: this.generarActividadesAvanzadas(temas, modulo)
        };
        
        const nivel = nivelGrupo.toLowerCase().includes('básico') ? 'basico' :
                     nivelGrupo.toLowerCase().includes('avanzado') ? 'avanzado' : 'intermedio';
        
        return {
            modulo: modulo,
            nivelGrupo: nivelGrupo,
            tema: temas[0],
            actividades: actividades[nivel],
            duracionEstimada: '2-3 sesiones de 40 minutos',
            materiales: this.sugerirMateriales(modulo, nivel),
            evaluacion: this.sugerirEvaluacion(nivel)
        };
    }
    
    generarActividadesBasicas(temas, modulo) {
        return [
            `Demostración guiada de ${temas[0]} con ejemplos concretos`,
            `Ejercicio práctico paso a paso con apoyo visual`,
            `Trabajo colaborativo en parejas con roles definidos`,
            `Juego didáctico para reforzar conceptos básicos`,
            `Creación de un producto simple usando ${temas[0]}`
        ];
    }
    
    generarActividadesIntermedias(temas, modulo) {
        return [
            `Proyecto aplicado que integre ${temas.slice(0, 2).join(' y ')}`,
            `Análisis de caso real relacionado con ${temas[0]}`,
            `Diseño de solución para problema específico`,
            `Presentación grupal con uso de herramientas digitales`,
            `Evaluación entre pares con rúbrica definida`
        ];
    }
    
    generarActividadesAvanzadas(temas, modulo) {
        return [
            `Investigación aplicada con propuesta innovadora`,
            `Desarrollo de prototipo funcional integrando múltiples temas`,
            `Simulación de escenario real con variables complejas`,
            `Mentoría a estudiantes de niveles inferiores`,
            `Publicación de resultados en formato digital`
        ];
    }
    
    sugerirMateriales(modulo, nivel) {
        const materialesBase = ['Computadoras', 'Software específico', 'Guías de trabajo'];
        
        const materialesEspecificos = {
            ofimatica: ['Suite ofimática', 'Plantillas', 'Ejemplos de documentos'],
            programacion: ['Entorno de desarrollo', 'Documentación', 'Ejercicios de código'],
            redes: ['Simulador de redes', 'Diagramas', 'Equipo de práctica']
        };
        
        const adicionales = {
            basico: ['Instrucciones paso a paso', 'Videos tutoriales', 'Plantillas predefinidas'],
            intermedio: ['Casos de estudio', 'Rúbricas de evaluación', 'Recursos de referencia'],
            avanzado: ['Documentación técnica', 'Herramientas avanzadas', 'Acceso a APIs']
        };
        
        return [
            ...materialesBase,
            ...(materialesEspecificos[modulo] || materialesEspecificos.ofimatica),
            ...adicionales[nivel]
        ];
    }
    
    sugerirEvaluacion(nivel) {
        const evaluaciones = {
            basico: {
                tipo: 'Lista de cotejo',
                elementos: ['Sigue instrucciones', 'Completa tareas', 'Demuestra comprensión básica'],
                ponderacion: '60% proceso, 40% producto'
            },
            intermedio: {
                tipo: 'Rúbrica analítica',
                elementos: ['Calidad técnica', 'Creatividad', 'Aplicación práctica', 'Presentación'],
                ponderacion: '40% proceso, 60% producto'
            },
            avanzado: {
                tipo: 'Portafolio de evidencias',
                elementos: ['Innovación', 'Profundidad técnica', 'Impacto práctico', 'Documentación'],
                ponderacion: '30% proceso, 70% producto'
            }
        };
        
        return evaluaciones[nivel];
    }
    
    // ===== GENERACIÓN DE FEEDBACK =====
    
    generarFeedbackPersonalizado(estudiante, calificaciones, indicadores) {
        const promedio = this.calcularPromedio(calificaciones);
        const fortalezas = this.identificarFortalezas(calificaciones, indicadores);
        const areasMejora = this.identificarAreasMejora(calificaciones, indicadores);
        
        const feedback = {
            estudiante: estudiante.nombre,
            promedio: promedio,
            fortalezas: fortalezas,
            areasMejora: areasMejora,
            mensaje: this.generarMensajeMotivacional(promedio, estudiante.necesidades),
            acciones: this.sugerirAccionesConcretas(fortalezas, areasMejora)
        };
        
        return feedback;
    }
    
    calcularPromedio(calificaciones) {
        const valores = Object.values(calificaciones).map(v => parseInt(v));
        if (valores.length === 0) return 0;
        
        const suma = valores.reduce((a, b) => a + b, 0);
        return (suma / valores.length) * 33.33; // Convertir 1-3 a 0-100
    }
    
    identificarFortalezas(calificaciones, indicadores) {
        const fortalezas = [];
        
        Object.entries(calificaciones).forEach(([indicadorId, nivel]) => {
            if (nivel === '3') {
                const indicador = indicadores.find(i => i.id === indicadorId);
                if (indicador) {
                    fortalezas.push(indicador.texto.substring(0, 60) + '...');
                }
            }
        });
        
        return fortalezas.length > 0 ? fortalezas : ['Disposición para aprender', 'Participación en clase'];
    }
    
    identificarAreasMejora(calificaciones, indicadores) {
        const areas = [];
        
        Object.entries(calificaciones).forEach(([indicadorId, nivel]) => {
            if (nivel === '1') {
                const indicador = indicadores.find(i => i.id === indicadorId);
                if (indicador) {
                    areas.push(indicador.texto.substring(0, 60) + '...');
                }
            }
        });
        
        return areas.length > 0 ? areas : ['Profundización en conceptos técnicos', 'Aplicación práctica'];
    }
    
    generarMensajeMotivacional(promedio, necesidades) {
        if (promedio >= 85) {
            return "¡Excelente trabajo! Tu dedicación y esfuerzo se ven reflejados en tus resultados. Continúa desafiándote.";
        } else if (promedio >= 70) {
            return "Buen progreso. Identificamos áreas de oportunidad para seguir mejorando. ¡Tú puedes!";
        } else {
            return "Veo que enfrentas desafíos. Juntos podemos crear un plan de acción para mejorar. Confío en tu capacidad.";
        }
    }
    
    sugerirAccionesConcretas(fortalezas, areasMejora) {
        return [
            `Seguir desarrollando: ${fortalezas[0] || 'habilidades técnicas'}`,
            `Trabajar especialmente en: ${areasMejora[0] || 'conceptos fundamentales'}`,
            'Dedicar 15 minutos diarios a repaso',
            'Participar activamente en tutorías',
            'Pedir ayuda cuando se necesite'
        ];
    }
    
    // ===== PLANIFICACIÓN DE CLASES =====
    
    generarPlanClase(modulo, tema, duracion, nivel) {
        const estructura = {
            inicio: this.generarActividadInicio(tema, duracion * 0.2),
            desarrollo: this.generarActividadDesarrollo(tema, duracion * 0.6),
            cierre: this.generarActividadCierre(tema, duracion * 0.2),
            materiales: this.sugerirMateriales(modulo, nivel),
            evaluacion: 'Observación directa y producto final'
        };
        
        return {
            tema: tema,
            modulo: modulo,
            duracionTotal: `${duracion} minutos`,
            objetivo: this.generarObjetivoClase(tema, modulo),
            estructura: estructura,
            adaptaciones: this.sugerirAdaptaciones(nivel)
        };
    }
    
    generarActividadInicio(tema, duracion) {
        const actividades = [
            `Lluvia de ideas sobre ${tema} (${duracion} min)`,
            `Pregunta provocadora relacionada con ${tema} (${duracion} min)`,
            `Video introductorio sobre ${tema} (${duracion} min)`,
            `Análisis de caso breve (${duracion} min)`
        ];
        
        return actividades[Math.floor(Math.random() * actividades.length)];
    }
    
    generarActividadDesarrollo(tema, duracion) {
        return `Trabajo práctico guiado sobre ${tema} - ${duracion} minutos divididos en:
1. Demostración (${duracion * 0.3} min)
2. Práctica supervisada (${duracion * 0.4} min)
3. Aplicación independiente (${duracion * 0.3} min)`;
    }
    
    generarActividadCierre(tema, duracion) {
        const actividades = [
            `Reflexión grupal sobre lo aprendido de ${tema}`,
            `Presentación breve de resultados`,
            `Autoevaluación con lista de cotejo`,
            `Planeación de siguiente paso`
        ];
        
        return `${actividades[Math.floor(Math.random() * actividades.length)]} (${duracion} min)`;
    }
    
    generarObjetivoClase(tema, modulo) {
        return `Al finalizar la sesión, el estudiante será capaz de aplicar conceptos básicos de ${tema} en el contexto de ${modulo}, demostrando comprensión práctica.`;
    }
    
    sugerirAdaptaciones(nivel) {
        const adaptaciones = {
            basico: ['Instrucciones paso a paso', 'Tiempo adicional', 'Apoyo visual constante'],
            intermedio: ['Opciones de profundización', 'Trabajo colaborativo', 'Retos opcionales'],
            avanzado: ['Proyectos autodirigidos', 'Investigación complementaria', 'Mentoría a pares']
        };
        
        return adaptaciones[nivel] || adaptaciones.intermedio;
    }
    
    // ===== UTILIDADES =====
    
    async procesarTexto(texto, operacion) {
        console.log(`📊 Procesando texto: ${operacion}`);
        
        // En una implementación real, conectaría con API de IA
        // Por ahora, simulamos procesamiento
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const resultado = this.simularProcesamientoIA(texto, operacion);
                resolve(resultado);
            }, 500);
        });
    }
    
    simularProcesamientoIA(texto, operacion) {
        const operaciones = {
            'resumir': `Resumen: ${texto.substring(0, 100)}... [IA simulada]`,
            'corregir': `Texto corregido: ${texto} [correcciones simuladas]`,
            'mejorar': `Versión mejorada: ${texto} [optimizado por IA]`,
            'traducir': `Traducción: ${texto} [traducido al inglés simuladamente]`
        };
        
        return operaciones[operacion] || `Procesado: ${texto.substring(0, 50)}...`;
    }
    
    // Método para validar si el asistente está disponible
    estaDisponible() {
        return true; // Siempre disponible en esta versión simulada
    }
    
    // Método para obtener estadísticas de uso
    obtenerEstadisticas() {
        return {
            modelo: this.config.modelo,
            operacionesRealizadas: Math.floor(Math.random() * 100),
            disponibilidad: '100%',
            ultimaActualizacion: new Date().toISOString()
        };
    }
}

// ==============================================
// INICIALIZACIÓN GLOBAL
// ==============================================

// Crear instancia global
window.iaAssistant = new IAAssistant();

// Métodos globales para acceso fácil
window.generarRubricas = (indicador, ciclo) => window.iaAssistant.generarCriteriosDesdeIndicador(indicador, ciclo);
window.analizarRiesgo = (calificaciones, asistencia, periodo, necesidades) => 
    window.iaAssistant.analizarRiesgoEstudiante(calificaciones, asistencia, periodo, necesidades);
window.sugerirActividades = (modulo, nivel, tema) => 
    window.iaAssistant.sugerirActividadesDiferenciadas(modulo, nivel, tema);

console.log('✅ IAAssistant inicializado globalmente');

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IAAssistant;
}