class Usuarios{

    constructor(){
        this.personas = [];
    }

    agregarPersona(id, nombre, sala){
        this.personas.push({id, nombre, sala});

        return this.personas;
    }

    getPersona(id){
        let persona = this.personas.filter(persona => persona.id === id)[0];

        return persona;
    }

    getPersonas(){
        return this.personas;
    }

    getPersonasPorSala(sala){
        return this.personas.filter(persona => persona.sala === sala);
    }

    borrarPersona(id){
        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;
    }

}

module.exports = Usuarios;