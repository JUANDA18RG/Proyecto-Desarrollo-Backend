const cron = require('node-cron');
const fsql = require('./controllers/task.controllers.js');

async function tryUpdateStates() {
    while (true) {
        try {
            await fsql.updateStates();
            break; // Si la función se ejecutó con éxito, salimos del bucle
        } catch (error) {
            console.error('Error al ejecutar updateStates, reintentando:', error);
        }
    }
}

function cronReserva() {
    cron.schedule('0 1 * * *', async () => {
        await tryUpdateStates();
    });
}

module.exports = cronReserva;