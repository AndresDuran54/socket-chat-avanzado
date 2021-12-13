const { io } = require('../server');
const Usuarios = require('../clases/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

//Cuando un cliente se conecta al servidor este se conecta a dos salas
//una sala que tiene como nombre su id y la sala general
io.on('connection', (client) => {
    
    client.on('entrarChat', (data, callback) => {

        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        //Unimos al cliente a una sala con el nombre que nos mando
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.to(data.sala).emit('listaPersona', 
        usuarios.getPersonasPorSala(data.sala));

        client.to(data.sala).emit('crearMensaje', 
        crearMensaje('Administrador', `${data.nombre} entró a el chat`));

        //calback se ejecuta en el cliente
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona (client.id);
        //Emite a todos los clientes menos a él
        client.to(personaBorrada.sala).emit('crearMensaje', 
        crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));
        client.to(personaBorrada.sala).emit('listaPersona', 
        usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        //Mandamos un mensaje privado al cliente con su id
        client.to(data.para).emit('mensajePrivado', 
        crearMensaje(persona.nombre, data.mensaje));
    });

});