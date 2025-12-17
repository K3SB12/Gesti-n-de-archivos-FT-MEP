// ==============================================
// CALCULADORA DE NOTAS - SISTEMA MEP COSTA RICA
// Especializada en Formación Tecnológica
// ==============================================

class CalculadoraMEP_FT {
    constructor() {
        this.configuraciones = {
            ciclos: {
                'I_Ciclo': {
                    trabajo_cotidiano: 65,
                    tareas: 10,
                    prueba_ejecucion: 15,
                    asistencia: 10,
                    nota_minima: 65
                },
                'II_Ciclo': {
                    trabajo_cotidiano: 60,
                    tareas: 10,
                    prueba_ejecucion: 20,
                    asistencia: 10,
                    nota_minima: 65
                },
                'III_Ciclo': {
                    trabajo_cotidiano: 50,
                    tareas: 10,
                    proyecto: 30,
                    asistencia: 10,
                    nota_minima: 70
                }
            },
            escalas: {
                aprobacion: 70,
                excelencia: 90,
                maximo: 100,
                minimo: 0
            },
            redondeo: 2 // decimales
        };
        
        this.historial = [];
        this.init();
    }
    
    init() {
        console.log('🧮 Calculadora MEP FT inicializada');
        this.cargarHistorial();
    }
    
    cargarHistorial() {
        try {
            const historialGuardado = localStorage.getItem('historial_calculos_mep');
            if (historialGuardado) {
                this.historial = JSON.parse(historialGuardado);
            }
        } catch (error) {
            console.warn('⚠️ Error cargando historial:', error);
            this.historial = [];
        }
    }
    
    guardarEnHistorial(calculo) {
        this.historial.unshift({
            ...calculo,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        
        // Mantener máximo 50 cálculos
        if (this.historial.length > 50) {
            this.historial = this.historial.slice(0, 50);
        }
        
        try {
            localStorage.setItem('historial_calculos_mep', JSON.stringify(this.historial));
        } catch (error) {
            console.warn('⚠️ Error guardando historial:', error);
        }
    }
    
    // ===== CÁLCULO PRINCIPAL =====
    
    calcularNotaFinal(estudianteId, ciclo, componentes) {
        console.log(`🧮 Calculando nota para ${estudianteId} - ${ciclo}`);
        
        const configCiclo = this.configuraciones.ciclos[ciclo];
        if (!configCiclo) {
            throw new Error(`Ciclo no válido: ${ciclo}`);
        }
        
        // Validar componentes
        this.validarComponentes(componentes, ciclo);
        
        // Calcular cada componente ponderado
        const calculos = this.calcularComponentesPonderados(componentes, configCiclo);
        
        // Calcular nota final
        const notaFinal = this.calcularSumaPonderada(calculos);
        
        // Aplicar redondeo
        const notaRedondeada = this.redondearNota(notaFinal);
        
        // Determinar estado
        const estado = this.determinarEstado(notaRedondeada, configCiclo.nota_minima);
        
        // Generar resultado
        const resultado = {
            estudianteId: estudianteId,
            ciclo: ciclo,
            nota: notaRedondeada,
            estado: estado,
            desglose: calculos,
            componentesOriginales: componentes,
            configuracion: configCiclo,
            fecha: new Date().toISOString()
        };
        
        // Guardar en historial
        this.guardarEnHistorial(resultado);
        
        return resultado;
    }
    
    validarComponentes(componentes, ciclo) {
        const config = this.configuraciones.ciclos[ciclo];
        const errores = [];
        
        // Validar trabajo cotidiano
        if (typeof componentes.trabajo_cotidiano !== 'number' || 
            componentes.trabajo_cotidiano < 0 || componentes.trabajo_cotidiano > 100) {
            errores.push('Trabajo cotidiano debe ser un número entre 0 y 100');
        }
        
        // Validar tareas
        if (typeof componentes.tareas !== 'number' || 
            componentes.tareas < 0 || componentes.tareas > 100) {
            errores.push('Tareas debe ser un número entre 0 y 100');
        }
        
        // Validar proyecto o prueba ejecución según ciclo
        if (ciclo === 'III_Ciclo') {
            if (typeof componentes.proyecto !== 'number' || 
                componentes.proyecto < 0 || componentes.proyecto > 100) {
                errores.push('Proyecto debe ser un número entre 0 y 100');
            }
        } else {
            if (typeof componentes.prueba_ejecucion !== 'number' || 
                componentes.prueba_ejecucion < 0 || componentes.prueba_ejecucion > 100) {
                errores.push('Prueba ejecución debe ser un número entre 0 y 100');
            }
        }
        
        // Validar asistencia
        if (typeof componentes.asistencia !== 'number' || 
            componentes.asistencia < 0 || componentes.asistencia > 100) {
            errores.push('Asistencia debe ser un número entre 0 y 100');
        }
        
        if (errores.length > 0) {
            throw new Error(`Errores en componentes:\n${errores.join('\n')}`);
        }
    }
    
    calcularComponentesPonderados(componentes, configCiclo) {
        const calculos = {};
        
        // Trabajo cotidiano
        calculos.trabajo_cotidiano = {
            valor: componentes.trabajo_cotidiano,
            porcentaje: configCiclo.trabajo_cotidiano,
            ponderado: (componentes.trabajo_cotidiano * configCiclo.trabajo_cotidiano) / 100
        };
        
        // Tareas
        calculos.tareas = {
            valor: componentes.tareas,
            porcentaje: configCiclo.tareas,
            ponderado: (componentes.tareas * configCiclo.tareas) / 100
        };
        
        // Proyecto o prueba ejecución
        if (configCiclo.proyecto) {
            calculos.proyecto = {
                valor: componentes.proyecto,
                porcentaje: configCiclo.proyecto,
                ponderado: (componentes.proyecto * configCiclo.proyecto) / 100
            };
        } else {
            calculos.prueba_ejecucion = {
                valor: componentes.prueba_ejecucion,
                porcentaje: configCiclo.prueba_ejecucion,
                ponderado: (componentes.prueba_ejecucion * configCiclo.prueba_ejecucion) / 100
            };
        }
        
        // Asistencia
        calculos.asistencia = {
            valor: componentes.asistencia,
            porcentaje: configCiclo.asistencia,
            ponderado: (componentes.asistencia * configCiclo.asistencia) / 100
        };
        
        return calculos;
    }
    
    calcularSumaPonderada(calculos) {
        let suma = 0;
        
        Object.values(calculos).forEach(componente => {
            suma += componente.ponderado;
        });
        
        return suma;
    }
    
    redondearNota(nota) {
        const decimales = this.configuraciones.redondeo;
        const factor = Math.pow(10, decimales);
        return Math.round(nota * factor) / factor;
    }
    
    determinarEstado(nota, notaMinima) {
        if (nota >= this.configuraciones.escalas.excelencia) {
            return 'Excelente';
        } else if (nota >= notaMinima) {
            return 'Aprobado';
        } else {
            return 'Reprobado';
        }
    }
    
    // ===== CÁLCULOS ESPECIALIZADOS =====
    
    calcularNotaTrabajoCotidiano(calificacionesIndicadores) {
        // Convertir calificaciones 1-2-3 a porcentaje
        const conversion = { '1': 60, '2': 80, '3': 100 };
        
        let suma = 0;
        let contador = 0;
        
        Object.values(calificacionesIndicadores).forEach(nivel => {
            if (conversion[nivel]) {
                suma += conversion[nivel];
                contador++;
            }
        });
        
        if (contador === 0) return 0;
        
        return this.redondearNota(suma / contador);
    }
    
    calcularPromedioGrupo(estudiantes, ciclo, periodo) {
        const notas = [];
        const resultados = [];
        
        estudiantes.forEach(estudiante => {
            try {
                // En una implementación real, se cargarían las calificaciones
                const componentesSimulados = {
                    trabajo_cotidiano: 70 + Math.random() * 30,
                    tareas: 70 + Math.random() * 30,
                    proyecto: ciclo === 'III_Ciclo' ? 70 + Math.random() * 30 : undefined,
                    prueba_ejecucion: ciclo !== 'III_Ciclo' ? 70 + Math.random() * 30 : undefined,
                    asistencia: 80 + Math.random() * 20
                };
                
                const resultado = this.calcularNotaFinal(
                    estudiante.id,
                    ciclo,
                    componentesSimulados
                );
                
                notas.push(resultado.nota);
                resultados.push({
                    estudiante: estudiante.nombre,
                    nota: resultado.nota,
                    estado: resultado.estado
                });
                
            } catch (error) {
                console.warn(`⚠️ Error calculando para ${estudiante.nombre}:`, error);
            }
        });
        
        if (notas.length === 0) return null;
        
        const promedio = notas.reduce((a, b) => a + b, 0) / notas.length;
        const aprobados = resultados.filter(r => r.estado === 'Aprobado' || r.estado === 'Excelente').length;
        const porcentajeAprobacion = (aprobados / resultados.length) * 100;
        
        return {
            promedio: this.redondearNota(promedio),
            totalEstudiantes: resultados.length,
            aprobados: aprobados,
            reprobados: resultados.length - aprobados,
            porcentajeAprobacion: this.redondearNota(porcentajeAprobacion),
            notas: resultados.sort((a, b) => b.nota - a.nota),
            ciclo: ciclo,
            periodo: periodo,
            fecha: new Date().toISOString()
        };
    }
    
    // ===== PROYECCIONES Y SIMULACIONES =====
    
    proyectarNotaFinal(componentesActuales, ciclo, componentesFuturos) {
        const config = this.configuraciones.ciclos[ciclo];
        
        // Combinar componentes actuales con proyecciones
        const componentesCompletos = {
            trabajo_cotidiano: componentesFuturos.trabajo_cotidiano || componentesActuales.trabajo_cotidiano,
            tareas: componentesFuturos.tareas || componentesActuales.tareas,
            asistencia: componentesFuturos.asistencia || componentesActuales.asistencia
        };
        
        // Agregar proyecto o prueba según ciclo
        if (ciclo === 'III_Ciclo') {
            componentesCompletos.proyecto = componentesFuturos.proyecto || componentesActuales.proyecto;
        } else {
            componentesCompletos.prueba_ejecucion = componentesFuturos.prueba_ejecucion || componentesActuales.prueba_ejecucion;
        }
        
        return this.calcularNotaFinal('proyeccion', ciclo, componentesCompletos);
    }
    
    simularEscenarios(componentesActuales, ciclo, variaciones) {
        const escenarios = [];
        
        variaciones.forEach(variacion => {
            const componentesVariados = {
                trabajo_cotidiano: componentesActuales.trabajo_cotidiano * (1 + variacion.tc / 100),
                tareas: componentesActuales.tareas * (1 + variacion.tareas / 100),
                asistencia: componentesActuales.asistencia
            };
            
            // Limitar a 100
            Object.keys(componentesVariados).forEach(key => {
                if (componentesVariados[key] > 100) componentesVariados[key] = 100;
                if (componentesVariados[key] < 0) componentesVariados[key] = 0;
            });
            
            if (ciclo === 'III_Ciclo') {
                componentesVariados.proyecto = componentesActuales.proyecto * (1 + variacion.proyecto / 100);
                if (componentesVariados.proyecto > 100) componentesVariados.proyecto = 100;
                if (componentesVariados.proyecto < 0) componentesVariados.proyecto = 0;
            } else {
                componentesVariados.prueba_ejecucion = componentesActuales.prueba_ejecucion * (1 + variacion.pe / 100);
                if (componentesVariados.prueba_ejecucion > 100) componentesVariados.prueba_ejecucion = 100;
                if (componentesVariados.prueba_ejecucion < 0) componentesVariados.prueba_ejecucion = 0;
            }
            
            const resultado = this.calcularNotaFinal('simulacion', ciclo, componentesVariados);
            
            escenarios.push({
                variacion: variacion,
                componentes: componentesVariados,
                resultado: resultado,
                mejora: resultado.nota - this.calcularNotaFinal('actual', ciclo, componentesActuales).nota
            });
        });
        
        return escenarios;
    }
    
    // ===== ANÁLISIS ESTADÍSTICO =====
    
    generarEstadisticas(estudiantes, ciclo) {
        const estadisticas = {
            ciclo: ciclo,
            total: estudiantes.length,
            notas: [],
            distribucion: {
                excelencia: 0,
                aprobados: 0,
                reprobados: 0
            },
            tendencias: []
        };
        
        estudiantes.forEach(estudiante => {
            // Buscar cálculos recientes para este estudiante
            const calculosEstudiante = this.historial.filter(h => 
                h.estudianteId === estudiante.id && h.ciclo === ciclo
            );
            
            if (calculosEstudiante.length > 0) {
                const ultimoCalculo = calculosEstudiante[0];
                estadisticas.notas.push(ultimoCalculo.nota);
                
                if (ultimoCalculo.estado === 'Excelente') {
                    estadisticas.distribucion.excelencia++;
                } else if (ultimoCalculo.estado === 'Aprobado') {
                    estadisticas.distribucion.aprobados++;
                } else {
                    estadisticas.distribucion.reprobados++;
                }
                
                // Analizar tendencia si hay más de un cálculo
                if (calculosEstudiante.length > 1) {
                    const tendencia = calculosEstudiante[0].nota - calculosEstudiante[1].nota;
                    estadisticas.tendencias.push({
                        estudiante: estudiante.nombre,
                        tendencia: tendencia > 0 ? 'mejora' : tendencia < 0 ? 'disminuye' : 'estable',
                        magnitud: Math.abs(tendencia)
                    });
                }
            }
        });
        
        // Calcular estadísticas descriptivas
        if (estadisticas.notas.length > 0) {
            estadisticas.promedio = this.redondearNota(
                estadisticas.notas.reduce((a, b) => a + b, 0) / estadisticas.notas.length
            );
            
            estadisticas.maxima = Math.max(...estadisticas.notas);
            estadisticas.minima = Math.min(...estadisticas.notas);
            
            // Calcular desviación estándar
            const media = estadisticas.promedio;
            const diferenciasCuadradas = estadisticas.notas.map(n => Math.pow(n - media, 2));
            const varianza = diferenciasCuadradas.reduce((a, b) => a + b, 0) / estadisticas.notas.length;
            estadisticas.desviacion = this.redondearNota(Math.sqrt(varianza));
        }
        
        return estadisticas;
    }
    
    // ===== UTILIDADES =====
    
    convertirCalificacionANota(calificacion, escala = '1-3') {
        if (escala === '1-3') {
            const conversion = { '1': 60, '2': 80, '3': 100 };
            return conversion[calificacion] || 0;
        } else if (escala === '1-5') {
            const conversion = { '1': 20, '2': 40, '3': 60, '4': 80, '5': 100 };
            return conversion[calificacion] || 0;
        } else if (escala === '1-10') {
            return calificacion * 10;
        }
        
        return calificacion;
    }
    
    convertirNotaACalificacion(nota, escala = '1-3') {
        if (escala === '1-3') {
            if (nota >= 90) return '3';
            else if (nota >= 70) return '2';
            else return '1';
        } else if (escala === '1-5') {
            if (nota >= 90) return '5';
            else if (nota >= 80) return '4';
            else if (nota >= 70) return '3';
            else if (nota >= 60) return '2';
            else return '1';
        }
        
        return nota.toString();
    }
    
    generarReporteCalculo(resultado) {
        const reporte = `
CALCULO DE NOTA - SISTEMA MEP
=============================
Estudiante: ${resultado.estudianteId}
Ciclo: ${resultado.ciclo}
Fecha: ${new Date(resultado.fecha).toLocaleDateString()}

COMPONENTES:
------------
${Object.entries(resultado.desglose).map(([key, valor]) => 
    `${key}: ${valor.valor}% × ${valor.porcentaje}% = ${valor.ponderado.toFixed(2)}`
).join('\n')}

RESULTADO:
----------
Nota Final: ${resultado.nota}
Estado: ${resultado.estado}
Nota mínima requerida: ${resultado.configuracion.nota_minima}

${resultado.estado === 'Reprobado' ? '¡ATENCIÓN! Estudiante en riesgo de reprobación.' : '¡Excelente! Estudiante aprobado.'}
`;
        
        return reporte;
    }
    
    // ===== INTERFAZ PÚBLICA =====
    
    getConfiguracionCiclo(ciclo) {
        return this.configuraciones.ciclos[ciclo];
    }
    
    getHistorial(limite = 10) {
        return this.historial.slice(0, limite);
    }
    
    limpiarHistorial() {
        this.historial = [];
        localStorage.removeItem('historial_calculos_mep');
        console.log('🧹 Historial limpiado');
    }
    
    exportarHistorial(formato = 'json') {
        if (formato === 'json') {
            return JSON.stringify(this.historial, null, 2);
        } else if (formato === 'csv') {
            // Convertir a CSV
            const headers = ['Fecha', 'Estudiante', 'Ciclo', 'Nota', 'Estado'];
            const rows = this.historial.map(h => [
                new Date(h.timestamp).toLocaleDateString(),
                h.estudianteId,
                h.ciclo,
                h.nota,
                h.estado
            ]);
            
            const csv = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');
            
            return csv;
        }
        
        return this.historial;
    }
}

// ==============================================
// INICIALIZACIÓN GLOBAL
// ==============================================

// Crear instancia global
window.calculadoraMEP = new CalculadoraMEP_FT();
window.CalculadoraMEP_FT = CalculadoraMEP_FT; // Para acceso directo

// Métodos globales simplificados
window.calcularNotaMEP = (estudianteId, ciclo, componentes) => 
    window.calculadoraMEP.calcularNotaFinal(estudianteId, ciclo, componentes);

window.calcularPromedioGrupoMEP = (estudiantes, ciclo, periodo) =>
    window.calculadoraMEP.calcularPromedioGrupo(estudiantes, ciclo, periodo);

console.log('✅ CalculadoraMEP_FT inicializada globalmente');

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculadoraMEP_FT;
}