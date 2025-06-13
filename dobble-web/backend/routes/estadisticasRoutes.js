const express = require('express');
const router = express.Router();
const db = require('../db'); // Asumiendo que tienes tu conexión a DB aquí

// Función helper para ejecutar queries con manejo de diferentes tipos de DB
async function executeQuery(sql, params = []) {
    try {
        console.log('Ejecutando query:', sql);
        console.log('Parámetros:', params);

        // Siempre usa db.query en vez de db.execute
        return new Promise((resolve, reject) => {
            db.query(sql, params, (err, results) => {
                if (err) {
                    console.error('Error en db.query:', err);
                    reject(err);
                } else {
                    console.log('Resultado db.query:', results);
                    resolve(Array.isArray(results) ? results : []);
                }
            });
        });

    } catch (error) {
        console.error('Error en executeQuery:', error);
        throw error;
    }
}

// GET /api/estadisticas/ranking - Obtener ranking de jugadores
router.get('/ranking', async (req, res) => {
    try {
        const { criterio = 'puntaje', limite = 50 } = req.query;
        
        // Consulta base para obtener estadísticas con información del usuario
        let sql = `
    SELECT 
        u.id as usuario_id,
        u.nombres,
        u.apellidos,
        u.usuario as email,
        COALESCE(e.partidas_jugadas, 0) as partidas_jugadas,
        COALESCE(e.mejor_tiempo, 0) as mejor_tiempo,
        COALESCE(e.victorias, 0) as victorias,
        (COALESCE(e.partidas_jugadas, 0) * 10 + 
         CASE 
            WHEN COALESCE(e.mejor_tiempo, 0) > 0 THEN (300 - COALESCE(e.mejor_tiempo, 0)) * 0.5
            ELSE 0 
         END + 
         COALESCE(e.victorias, 0) * 100) as puntaje_total
    FROM usuarios u
    LEFT JOIN estadisticas e ON u.id = e.usuario_id
    WHERE COALESCE(e.partidas_jugadas, 0) > 0
`;

        
        // Determinar criterio de ordenamiento
        switch (criterio) {
            case 'victorias':
                sql += ' ORDER BY COALESCE(e.victorias, 0) DESC, puntaje_total DESC';
                break;
            case 'tiempo':
                sql += ' ORDER BY CASE WHEN COALESCE(e.mejor_tiempo, 0) = 0 THEN 999999 ELSE COALESCE(e.mejor_tiempo, 0) END ASC, puntaje_total DESC';
                break;
            case 'partidas':
                sql += ' ORDER BY COALESCE(e.partidas_jugadas, 0) DESC, puntaje_total DESC';
                break;
            case 'puntaje':
            default:
                sql += ' ORDER BY puntaje_total DESC, COALESCE(e.victorias, 0) DESC, COALESCE(e.mejor_tiempo, 0) ASC';
                break;
        }
        
        sql += ` LIMIT ${parseInt(limite)}`;
        
        const rows = await executeQuery(sql);
        console.log('Filas obtenidas:', rows);
        console.log('Tipo de rows:', typeof rows);
        console.log('Es array:', Array.isArray(rows));
        
        // Verificar que rows sea realmente un array
        if (!Array.isArray(rows)) {
            console.error('ERROR: rows no es un array:', rows);
            return res.status(500).json({
                success: false,
                error: 'Error en el formato de datos de la base de datos',
                debug: {
                    rows_type: typeof rows,
                    is_array: Array.isArray(rows)
                }
            });
        }
        
        // Formatear los datos para el frontend
        const players = rows.map((player, index) => ({
            id: player.usuario_id,
            nombre: `${player.nombres || ''} ${player.apellidos || ''}`.trim(),
            email: player.email || '',
            partidas_jugadas: parseInt(player.partidas_jugadas || 0),
            mejor_tiempo: parseInt(player.mejor_tiempo || 0),
            victorias: parseInt(player.victorias || 0),
            puntaje_total: Math.round(parseFloat(player.puntaje_total || 0)),
            posicion: index + 1
        }));
        
        res.json({
            success: true,
            players,
            total_players: players.length,
            criterio_ordenamiento: criterio,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error al obtener ranking:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
    }
});

// GET /api/estadisticas/jugador/:id - Obtener estadísticas de un jugador específico
router.get('/jugador/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const sql = `
            SELECT 
                u.id as usuario_id,
                u.nombres,
                u.apellidos,
                u.usuario as email,
                COALESCE(e.partidas_jugadas, 0) as partidas_jugadas,
                COALESCE(e.mejor_tiempo, 0) as mejor_tiempo,
                COALESCE(e.victorias, 0) as victorias,
                (COALESCE(e.partidas_jugadas, 0) * 10 + 
                 CASE 
                    WHEN COALESCE(e.mejor_tiempo, 0) > 0 THEN (300 - COALESCE(e.mejor_tiempo, 0)) * 0.5
                    ELSE 0 
                 END + 
                 COALESCE(e.victorias, 0) * 100) as puntaje_total
            FROM usuarios u
            LEFT JOIN estadisticas e ON u.id = e.usuario_id
            WHERE u.id = ?
        `;
        
        const rows = await executeQuery(sql, [id]);
        
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Jugador no encontrado'
            });
        }
        
        const player = rows[0];
        
        // Obtener posición en el ranking (solo si tiene estadísticas)
        let posicion = null;
        if (player.partidas_jugadas > 0) {
            const rankingSql = `
                SELECT COUNT(*) + 1 as posicion
                FROM (
                    SELECT 
                        (COALESCE(e.partidas_jugadas, 0) * 10 + 
                         CASE 
                            WHEN COALESCE(e.mejor_tiempo, 0) > 0 THEN (300 - COALESCE(e.mejor_tiempo, 0)) * 0.5
                            ELSE 0 
                         END + 
                         COALESCE(e.victorias, 0) * 100) as puntaje_total
                    FROM estadisticas e
                    WHERE COALESCE(e.partidas_jugadas, 0) > 0
                ) ranking
                WHERE puntaje_total > ?
            `;
            
            const rankingRows = await executeQuery(rankingSql, [player.puntaje_total || 0]);
            posicion = Array.isArray(rankingRows) && rankingRows[0] ? rankingRows[0].posicion : null;
        }
        
        res.json({
            success: true,
            player: {
                id: player.usuario_id,
                nombre: `${player.nombres || ''} ${player.apellidos || ''}`.trim(),
                email: player.email || '',
                partidas_jugadas: parseInt(player.partidas_jugadas || 0),
                mejor_tiempo: parseInt(player.mejor_tiempo || 0),
                victorias: parseInt(player.victorias || 0),
                puntaje_total: Math.round(parseFloat(player.puntaje_total || 0)),
                posicion: posicion
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error al obtener estadísticas del jugador:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// POST /api/estadisticas/actualizar - Actualizar estadísticas de un jugador
router.post('/actualizar', async (req, res) => {
    try {
        const { usuario_id, tiempo_partida, gano } = req.body;
        
        if (!usuario_id) {
            return res.status(400).json({
                success: false,
                error: 'usuario_id es requerido'
            });
        }
        
        // Verificar si el usuario existe
        const userExists = await executeQuery(
            'SELECT id FROM usuarios WHERE id = ?', 
            [usuario_id]
        );
        
        if (!Array.isArray(userExists) || userExists.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }
        
        // Verificar si ya existe registro de estadísticas
        const statsExists = await executeQuery(
            'SELECT * FROM estadisticas WHERE usuario_id = ?',
            [usuario_id]
        );
        
        if (!Array.isArray(statsExists) || statsExists.length === 0) {
            // Crear nuevo registro de estadísticas
            await executeQuery(
                'INSERT INTO estadisticas (usuario_id, partidas_jugadas, mejor_tiempo, victorias) VALUES (?, 1, ?, ?)',
                [usuario_id, tiempo_partida || 0, gano ? 1 : 0]
            );
        } else {
            // Actualizar estadísticas existentes
            const currentStats = statsExists[0];
            const nuevasPartidas = currentStats.partidas_jugadas + 1;
            const nuevasVictorias = currentStats.victorias + (gano ? 1 : 0);
            
            // Actualizar mejor tiempo si es menor (y mayor que 0)
            let nuevoMejorTiempo = currentStats.mejor_tiempo;
            if (tiempo_partida > 0) {
                if (currentStats.mejor_tiempo === 0 || tiempo_partida < currentStats.mejor_tiempo) {
                    nuevoMejorTiempo = tiempo_partida;
                }
            }
            
            await executeQuery(
                'UPDATE estadisticas SET partidas_jugadas = ?, mejor_tiempo = ?, victorias = ? WHERE usuario_id = ?',
                [nuevasPartidas, nuevoMejorTiempo, nuevasVictorias, usuario_id]
            );
        }
        
        // Obtener estadísticas actualizadas
        const updatedStats = await executeQuery(
            `SELECT 
                u.nombres,
                u.apellidos,
                e.partidas_jugadas,
                e.mejor_tiempo,
                e.victorias,
                (e.partidas_jugadas * 10 + 
                 CASE 
                    WHEN e.mejor_tiempo > 0 THEN (300 - e.mejor_tiempo) * 0.5
                    ELSE 0 
                 END + 
                 e.victorias * 100) as puntaje_total
            FROM usuarios u
            INNER JOIN estadisticas e ON u.id = e.usuario_id
            WHERE u.id = ?`,
            [usuario_id]
        );
        
        const stats = Array.isArray(updatedStats) && updatedStats[0] ? updatedStats[0] : null;
        
        res.json({
            success: true,
            message: 'Estadísticas actualizadas correctamente',
            estadisticas: stats ? {
                usuario_id: parseInt(usuario_id),
                nombre: `${stats.nombres || ''} ${stats.apellidos || ''}`.trim(),
                partidas_jugadas: stats.partidas_jugadas,
                mejor_tiempo: stats.mejor_tiempo,
                victorias: stats.victorias,
                puntaje_total: Math.round(parseFloat(stats.puntaje_total))
            } : null,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// GET /api/estadisticas/top/:cantidad - Obtener top N jugadores
router.get('/top/:cantidad', async (req, res) => {
    try {
        const cantidad = parseInt(req.params.cantidad) || 10;
        
        if (cantidad > 100) {
            return res.status(400).json({
                success: false,
                error: 'Máximo 100 jugadores permitidos'
            });
        }
        
        const sql = `
            SELECT 
        u.id as usuario_id,
        u.nombres,
        u.apellidos,
        u.usuario as email,
        COALESCE(e.partidas_jugadas, 0) as partidas_jugadas,
        COALESCE(e.mejor_tiempo, 0) as mejor_tiempo,
        COALESCE(e.victorias, 0) as victorias,
        (COALESCE(e.partidas_jugadas, 0) * 10 + 
         CASE 
            WHEN COALESCE(e.mejor_tiempo, 0) > 0 THEN (300 - COALESCE(e.mejor_tiempo, 0)) * 0.5
            ELSE 0 
         END + 
         COALESCE(e.victorias, 0) * 100) as puntaje_total
    FROM usuarios u
    LEFT JOIN estadisticas e ON u.id = e.usuario_id
    WHERE COALESCE(e.partidas_jugadas, 0) > 0
        `;
        
        const rows = await executeQuery(sql, [cantidad]);
        
        if (!Array.isArray(rows)) {
            throw new Error('Resultado de la consulta no es un array');
        }
        
        const topPlayers = rows.map((player, index) => ({
            posicion: index + 1,
            nombre: `${player.nombres || ''} ${player.apellidos || ''}`.trim(),
            partidas_jugadas: parseInt(player.partidas_jugadas || 0),
            mejor_tiempo: parseInt(player.mejor_tiempo || 0),
            victorias: parseInt(player.victorias || 0),
            puntaje_total: Math.round(parseFloat(player.puntaje_total || 0))
        }));
        
        res.json({
            success: true,
            top_players: topPlayers,
            cantidad_solicitada: cantidad,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error al obtener top jugadores:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// GET /api/estadisticas/test - Endpoint de prueba
router.get('/test', async (req, res) => {
    try {
        // Probar consulta simple
        const testQuery = 'SELECT COUNT(*) as total FROM usuarios WHERE tipo_usuario = "estudiante"';
        const result = await executeQuery(testQuery);
        
        res.json({
            success: true,
            message: 'Conexión a la base de datos exitosa',
            result: result,
            result_type: typeof result,
            is_array: Array.isArray(result),
            db_type: typeof db.execute !== 'undefined' ? 'mysql2' : 'mysql',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error de conexión a la base de datos',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;