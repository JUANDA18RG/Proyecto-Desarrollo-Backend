// este archivo es para funciones que se usan en varias partes
// pero que no tienen llamados a la base de datos o que no son controladores
const { format } = require('date-fns');
const { es } = require('date-fns/locale');

// funcion que toma la fecha date y la devuelve la fecha en formato string(dia de mes de año)
function formatFecha(fecha){
    const formatFecha = format(fecha, "d 'de' MMMM 'de' yyyy", {locale: es});
    return formatFecha;
}


module.exports = {
    formatFecha
}

