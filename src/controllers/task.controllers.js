const db = require('../db.js');

//mostrar todos los libros

// mostrar username
const getallUsername = async (username) => 
{
    try
    {
        const user = await db.oneOrNone('SELECT * FROM usuario WHERE username = $1', [username]);
        if(user)
        {
           return true;
        }
        return false;
        
    }
    catch(error)
    {
        console.error('Hay mas de dos usuarios con el mismo username', error);
        throw error;
    }
}


const getUserByCorreo = async (correo) => 
{
    try
    {
        
        const user = await db.oneOrNone('SELECT * FROM persona WHERE correo = $1', [correo]);
        if(user)
        {
            const admin = await db.oneOrNone('SELECT * FROM administrador WHERE username = $1', [user.username]);
            if(admin)
            {
                return [user, true, admin]; // si es true significa que la persona es admin
            }
            return [user, false]; // si es false significa que la persona es usuario
        }
        return null;
    }
    catch(error)
    {
        console.error('Hay mas de dos usuarios con el mismo correo', error);
    }

}

async function getallBooks(){
    try
    {
        const books = await db.any('SELECT * FROM libro');
        return books;
    }
    catch(error)
    {
        console.error('Error al obtener los libros', error);
        throw error;
    }
}

//me devuelve el usuario con respectivo username
const getUserByUsername = async (username) => 
{
    try
    {
        const user = await db.oneOrNone('SELECT * FROM usuario WHERE username = $1', [username]);
        if(user){
            return user;
        }else{const user = await db.oneOrNone('SELECT * FROM administrador WHERE username = $1', [username]);
            return user;}
    }
    catch(error)
    {
        console.error('Hay mas de dos usuarios con el mismo username', error);
        return error;
    }
}
// const username oneOrNone('select username from administrador where codVerificacion = $1', ['OCSLDF']);
// if(username){ cambia la contraseña update

const UpdatePassword = async (username, password) =>{
    try{
        const user = await db.oneOrNone('SELECT * FROM persona WHERE username = $1', [username]);
        if(user){
            await db.none('UPDATE persona SET passwordhash = $1 WHERE username = $2', [password, username]);
            return true;
        }
        return false;

    }catch(error){console.error('Hay un error al actualizar la contraseña', error);
    return error;}
}

const getUsernameByCodigo = async (codigo) =>
{
    try
    {
        const username = await db.oneOrNone('select username from administrador where codVerificacion = $1', [codigo]);
        if(username){
            return username;}else if(!username){
                const username = await db.oneOrNone('select username from usuario where codVerificacion = $1', [codigo]);
                return username;}
    }
    catch(error)
    {
        console.error('Hay un error al obtener el username', error); 
        return error;
    }
}

const deleteCodigo = async (username) =>{
    try{
        const user = await db.oneOrNone('SELECT * FROM usuario WHERE username = $1', [username]);
        if(user){
            await db.none('UPDATE usuario SET codVerificacion = $1 WHERE username = $2', [null, username]);
        }else{
            await db.none('UPDATE administrador SET codVerificacion = $1 WHERE username = $2', [null, username]);
        }
    }catch(error){console.error('Hay un error al eliminar el codigo', error);
    return error;}
}


const setIntoCodigo = async (tipoPersona, user, codigo) => 
{
    try
    {
        if(tipoPersona === 'administrador'){
        await db.none(`UPDATE administrador SET codVerificacion = $1  WHERE username = $2`, [codigo, user.username]);
        return true;
        }else if(tipoPersona === 'usuario'){
        await db.none(`UPDATE usuario SET codVerificacion = $1  WHERE username = $2`, [codigo, user.username]);
        return true;
        }else{return false;}
    }
    catch(error)
    {
        console.error('Hay un error al guardar el codigo en la función setIntocodigo', error);
        return error;
    }
}


// funcion que toma el id de reserva y devuelve algunos datos de esta reserva
const getInfoReserva = async (id) => 
{
    try
    {
        const reserva = await db.oneOrNone('SELECT fechaReserva, fechaDevolucion, Estado ' +
                                             ' FROM reserva ' + 
                                             ' WHERE id = $1', [id]);
        return reserva;
    }
    catch(error)
    {
        console.error('Hay un error al obtener la reserva', error);
        throw new Error(error.message);
    }
}

// funcion que toma el id de reserva y devuelve todos los datos de esta reserva
const getReservaById = async (id) => 
{
    try
    {
        const reserva = await db.oneOrNone('SELECT * FROM reserva WHERE id = $1', [id]);
        return reserva;
    }
    catch(error)
    {
        console.error('Hay un error al obtener la reserva', error);
        throw new Error(error.message);
    }
}

// funcion que actualiza la fecha de devolucion de una reserva
const updateFechaDevolucion = async (id, fechaDevolucion) => {
    try {
        await db.none('UPDATE reserva SET fechaDevolucion = $1 WHERE id = $2', [fechaDevolucion, id]);
        return true;
    } catch (error) {
        console.error('Error al actualizar la fecha de devolución de la reserva', error);
        throw new Error(error.message);
    }
}

const getBookByISBN = async (ISBN) => 
{
    try
    {
        const book = await db.oneOrNone('SELECT * FROM libro WHERE ISBN = $1', [ISBN]);
        if(book)
        {
            return book;
        }
        else
        {
            return null;
        }
    }
    catch(error)
    {
        console.error('Hay un error al encontrar el libro', error);
        return error;
    }
}

const existReserva = async (user, libro) =>
{
    try
    {
        const book = await db.oneOrNone('SELECT * FROM RESERVA WHERE USUARIO = $1 and LIBRO = $2 and estado in ($3, $4);', [user, libro, 'Reservado', 'Vencido']);
        if(book)
        {
            return true;
        }
    }
    catch(error)
    {
        return error;
    }
}

const commentEx = async (user, libro) =>
{
    try
    {
        const valoracion = await db.oneOrNone('SELECT * FROM VALORACIONES WHERE USUARIO = $1 and LIBRO = $2', [user, libro]);
        if(valoracion)
        {
            return true;
        }
    }
    catch(error)
    {
        return error;
    }
}




const updateStates = async () => {
    try {
        await db.tx(async t => {
            // establece el estado entregados a Vencido
            await t.none("UPDATE reserva SET estado = 'Vencido' where estado = $1 and fechaDevolucion <= CURRENT_DATE; ",['Entregado']);
            // establece el estado reservado a cancelado, suma 1 a disponibles
            await t.none(`UPDATE libro SET copiasDisponibles = copiasDisponibles + 1 where isbn IN (SELECT libro FROM reserva WHERE estado = $1 and fechaDevolucion <= CURRENT_DATE)`, ['Reservado']);          
            await t.none("UPDATE reserva SET estado = $1 where estado = $2 and fechaDevolucion <= CURRENT_DATE; ",['Cancelado','Reservado']);
        });
        return true;
    } catch (error) {
        console.error('Error al actualizar el estado de la reserva', error);
        throw new Error(error.message);
    }

}

const getValoracion = async (isbn, username) => {
    try {
        const valoracion = await db.oneOrNone('SELECT * FROM valoraciones WHERE libro = $1 and usuario = $2', [isbn, username]);
        return valoracion;
    } catch (error) {
        console.error('Error al obtener la valoracion', error);
        throw new Error(error.message);
    }
}

const updateValoracion = async (valoracion, isbn, username) => {
    try {
        await db.none('UPDATE valoraciones SET valoracion = $1 WHERE libro = $2 and usuario = $3', [valoracion, isbn, username]);
        return true;
    } catch (error) {
        console.error('Error al actualizar la valoracion', error);
        throw new Error(error.message);
    }
}

const updateComentario = async (comentario, isbn, username) => {
    try {
        await db.none('UPDATE valoraciones SET comentario = $1 WHERE libro = $2 and usuario = $3', [comentario, isbn, username]);
        return true;
    } catch (error) {
        console.error('Error al actualizar el comentario', error);
        throw new Error(error.message);
    }
}



// funcion que toma el username del usuario y elimina cualquier incidencia que tenga
const delete_in_user = async (username) => {
    
    try{
        await db.tx(async t => {
            await t.none('DELETE FROM valoraciones WHERE usuario = $1', [username]);
            await t.none('DELETE FROM reserva WHERE usuario = $1', [username]);
            await t.none('DELETE FROM usuario WHERE username = $1', [username]);
            await t.none('DELETE FROM persona WHERE username = $1', [username]);
        });
        console.log('Incidencias borradas');
    }catch(error){
        console.error('Error al borrar incidencias', error);
        throw new Error(error.message);
    }

}

const getallUsers = async () => {

    try{ 
        const users = await db.any('SELECT username, nombres, apellidos, correo FROM persona where username in (SELECT username FROM usuario)');
        return users;
    }catch(error){
        console.error('Error al obtener los usuarios', error);
        throw new Error(error.message);
    }

}

const getUser = async (username) => {
    try {
        const user = await db.oneOrNone('SELECT username, nombres, apellidos, correo FROM persona WHERE username in (SELECT username FROM usuario where username = $1)', [username]);
        return user;
    } catch (error) {
        console.error('Error al obtener el usuario', error);
        throw new Error(error.message);
    }
}

const cambiarEstadoReserva = async (idreserva, isbn, nuevoestado) => {
    try 
    {
        await db.tx(async t => {
        await t.none('UPDATE libro set copiasDisponibles = copiasDisponibles + 1  where isbn = $1', [isbn]);
        await t.none('UPDATE reserva set estado = $1 where id = $2', [nuevoestado, idreserva]);
        });
        return true;
    }
    catch (error) {
        console.error('Error al obtener el usuario', error);
        throw new Error(error.message);
    }
}

const createBook = async (ISBN, Titulo, Autor, Genero,anioPublicacion, Cantcopias, sinopsis, portada) => {
    try {
        await db.none('INSERT INTO libro (isbn, titulo, autor, genero, anioPublicacion, cantCopias, copiasDisponibles, sinopsis, portada) VALUES ($1, $2, $3, $4 , $5, $6, $6, $7, $8)',
                       [ISBN, Titulo, Autor, Genero, anioPublicacion, Cantcopias, sinopsis, portada]);
    } catch (error) {
        console.error('Error al crear el libro', error);
        throw new Error(error.message);
    }
}

const getReservasActivas = async (username) => {
    try {
        const reservas = await db.any('select r.id,l.titulo' 
                                    + ' from reserva r inner join libro l on r.libro = l.isbn '
                                    + ' where r.usuario = $1 and r.estado in ($2, $3, $4) ', [username, 'Reservado', 'Entregado', 'Vencido']);
        return reservas;
    } catch (error) {
        console.error('Error al obtener las reservas activas', error);
        throw new Error(error.message);
    }
}

const getAllBooksWithValoracion = async () => {

    try{
        const libros = await db.any('select l.isbn, l.titulo, l.autor, l.estado, l.tendencia, l.genero, l.anioPublicacion, l.cantReservas, l.copiasDisponibles,'
                                + ' (l.cantCopias - l.copiasDisponibles) as copiasReservadas, l.portada, avg(v.valoracion) as valoracion '
                                +' from libro l left join valoraciones v on l.isbn = v.libro '
                                +' group by l.isbn, l.titulo, l.autor, l.estado, l.tendencia, l.genero, l.anioPublicacion, l.cantReservas, l.copiasDisponibles,'
                                +' (l.cantCopias - l.copiasDisponibles)');
        return libros;

    }catch(error){
        console.error(error.message);
        throw new Error(error.message);
    }

}

const getpromedioValoracion = async (isbn) => {
    try {
        const valoracion = await db.oneOrNone('select avg(v.valoracion) as valoracion'
                                            +' from libro l left join valoraciones v on l.isbn = v.libro '
                                            + 'where l.isbn = $1', [isbn]);
        return valoracion;
    } catch (error) {
        console.error('Error al obtener la valoracion', error);
        throw new Error(error.message);
    }
}

const deleteAdmin = async (username) => 
{
    try
    {
        await db.tx(async t => {
        await t.none('DELETE FROM administrador WHERE username = $1', [username]);
        await t.none('DELETE FROM persona WHERE username = $1', [username]);
        });
        console.log('Incidencias borradas');
    }
    catch(error)
    {
        console.error('Error al borrar incidencias', error);
        throw new Error(error.message);
    }
    
}

async function getallAdmin(){
    try
    {
        const admins = await db.any('SELECT * FROM administrador WHERE jefe is not null');
        return admins;
    }
    catch(error)
    {
        console.error('Error al obtener los administradores', error);
        throw error;
    }
}


const getAdmin = async (username) => 
{
    try
    {
        const admin = await db.oneOrNone('SELECT * FROM administrador WHERE username = $1 and jefe is not null', [username]);
        return admin;
    }
    catch(error)
    {
        console.error('Error al obtener el administrador', error);
        throw error;
    }
}

async function agregarControlLibro(libro, administrador){
    try
    {
        await db.none('INSERT INTO editarlibro (libro,administrador) VALUES ($1,$2)',[libro,administrador]); 
    }
    catch(error)
    {
        console.error(error);
        throw error;
    }
}

async function agregarControlReserva(reserva, administrador)
{
    try
    {
        await db.none('INSERT INTO cambiarreserva (reserva,administrador) VALUES ($1,$2)',[reserva,administrador]); 
    }
    catch(error)
    {
        console.error(error);
        throw error;
    }
}

// llamado a las funciones
module.exports = {
    getallUsername,
    getUserByCorreo,
    getallBooks,
    getUserByUsername,
    setIntoCodigo,
    getUsernameByCodigo,
    UpdatePassword,
    deleteCodigo,
    getInfoReserva,
    getReservaById,
    updateFechaDevolucion,
    getBookByISBN,
    existReserva,
    updateStates,
    updateValoracion,
    updateComentario,
    getValoracion,
    commentEx,
    delete_in_user,
    getallUsers,
    getUser,
    cambiarEstadoReserva,
    createBook,
    getReservasActivas,
    getAllBooksWithValoracion,
    getpromedioValoracion,
    deleteAdmin,
    getallAdmin,
    agregarControlLibro,
    agregarControlReserva,
    getAdmin
}
