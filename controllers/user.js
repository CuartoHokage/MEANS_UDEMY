'use strict'
const res = require('express/lib/response');
var validator= require('validator');
var bcrypt= require('bcrypt-nodejs');
var User= require('../models/user');
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
        var params= req.body;
        //validar los datos
        var validate_name=!validator.isEmpty(params.name);
        var validate_surname=!validator.isEmpty(params.surname);
        var validate_email=!validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password=!validator.isEmpty(params.password);

        if(validate_name && validate_surname && validate_email && validate_password){
            //crear objeto de usuario
            var user= new User();
            
            //asignar valores al objeto
            user.name= params.name;
            user.surname= params.surname;
            user.email= params.email.toLowerCase();
            user.name= params.name;
            user.role= 'ROLE_USER';
            user.image= null;
            //comprobar si no existe usuario
            User.findOne({email: user.email}, (err, issetUser)=>{
                
                if(err){
                    
                    return res.status(500).send({
                        
                        message: 'Error por duplicidad de usuario en el email'
                    });
                }
                if(!issetUser){
                    //si no existe
                    //cifrar contraseña
                    bcrypt.hash(params.password, null, null, (err, hash)=>{
                        user.password= hash;
                        //guardar usuario
                        user.save((err, userStore)=>{
                            if(err){
                                return res.status(500).send({
                                    message: 'Error al guardar usuario'
                                });
                            }
                            if(!userStore){
                                return res.status(400).send({
                                    message: 'El usuario no se a guardado'
                                });
                            }
                            //devolver respuesta
                            return res.status(200).send({
                                status: 'success',
                                user: userStore
                            });
                            //cierre de registro usuario
                        });
                        
                    }); //cierre del encriptamiento
                }else{
                    return res.status(500).send({
                        message: 'El usuario ya esta registrado'
                    });
                }
            });
            
        }else{
            console.log(validate_name, validate_surname, validate_email, validate_password)
            return res.status(200).send({
                message: 'Validacion de los datos incorrectos vuelva a intentar'
            });
        }

        
    }
};


module.exports=controller;