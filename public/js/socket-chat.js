var socket = io();

var params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(personas) {
        renderizarUsuarios(personas);
    });

});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Escuchar información
socket.on('enviarMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

socket.on('crearMensaje', (mensaje) => {
    renderizarMensajes(mensaje, false);
    scrollBottom();
});

//Escuchar cambios de suaurios
//Cuando un usuario entra o sale del chat
socket.on('listaPersona', (personas) => {
    renderizarUsuarios(personas);
});

socket.on('mensajePrivado', (payload) => {
    console.log(`Mensaje privado ${payload.mensaje}`);
})