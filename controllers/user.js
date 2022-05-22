'use strict'

var controller={
    probando: function(req, res){
        return res.status(200).send({
            message: 'Soy el metodo probando'
        });
    },

    testeando: function(req, res){
        return res.status(200).send({
            message: 'Soy el metodo Testeando'
        });
    },
    save: function(req, res){
        //recoger parametros de peticion

        //validar los datos

        //crear objeto de usuario

        //asignar valores al objeto

        //comprobar si no existe usuario
        //cifrar contraseña y guardar

        //devolver respuesta 

        return res.status(200).send({
            message: 'Registro de usuarios'
        });
    }
};


module.exports=controller;