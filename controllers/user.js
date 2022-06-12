'use strict'
const res = require('express/lib/response');
var validator= require('validator');
var bcrypt= require('bcrypt-nodejs');
var User= require('../models/user');
var jwt= require('../services/jwt');
const { param } = require('../routes/user');
const user = require('../models/user');
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
        try {
            var validate_name=!validator.isEmpty(params.name);
            var validate_surname=!validator.isEmpty(params.surname);
            var validate_email=!validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password=!validator.isEmpty(params.password);
        } catch (error) {
            return res.status(200).send({
                message: 'Faltan datos por enviar',
                params
            });
        }
        

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

        
    },
    login: function(req, res){
        //Recoger los parametros de una peticion
        var params= req.body;

        //Validar los datos
        try {
            var validate_email=!validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password=!validator.isEmpty(params.password);
        } catch (error) {
            return res.status(200).send({
                message: 'Faltan datos por enviar',
                params
            });
        }
        

        if(!validate_email || !validate_password){
            return res.status(200).send({
                message: 'Los datos son incorrectos, favor enviarlos bien'
            });
        }
        //Buscar usuarios que coincidan con el email
        User.findOne({email: params.email.toLowerCase()}, (err, user)=>{
            if(err){
                return res.status(500).send({
                    message: "Error al intentar identificarse"
                });    
            }
            if(!user){
                return res.status(404).send({
                    message: "Usuario no existe"
                });
            }
            //Si encuentra 
            //Comprobar la contraseña (coincidencia de email y password / bcrypt)
            bcrypt.compare(params.password, user.password, (err, check)=>{
                //si es correcto 
                if(check){
                    //Generar toket jwt y devolver luego
                    if(params.gettoken){
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }
                    else{
                        //Limpiar el objeto user 
                        user.password=undefined;
                        //Devolver los datos
                        return res.status(200).send({
                            status: "Success",
                            user
                        });
                    }
                    
                }
                else{
                    return res.status(200).send({
                        message: "Credeciales incorrectas"
                    });
                }
                
            });
            
        });
            
    },
    update: function(req, res){
        //Crear middleware para comprobar el jwt token, ponerselo a la ruta
            
        //Recoger datos del usuario
        var params=req.body
        
        //Validar datos
        try{
            var validate_name=!validator.isEmpty(params.name);
            var validate_surname=!validator.isEmpty(params.surname);
            var validate_email=!validator.isEmpty(params.email) && validator.isEmail(params.email);
        }
        catch(err){
            return res.status(200).send({
            
                message: 'Faltan datos por enviar',
                params
            });
        }
        //Eliminar propiedades innecesarias
        delete params.password;
        
        //Buscar y actualizar documento de la base de datos
        var userId= req.user.sub
        
        //Comprobar si el email es unico
        if(req.user.email!= params.email){ //condicion esta mal si se modifica correo a uno no existente no entra al else
            console.log(req.user.email)
            //console.log(params.email)
            User.findOne({email: params.email.toLowerCase()}, (err, user)=>{
                    if(err){
                        return res.status(500).send({
                            message: "Error al intentar identificarse"
                        });    
                    }
                    if(user && user.email == params.email){
                        
                        return res.status(200).send({
                            message: "El email esta en uso no puede ser modificado"
                        });
                    }
                    console.log('sss')
                });
        }else{
                User.findOneAndUpdate({_id:userId}, params, {new:true }, (err, userUpdate)=>{
                    if(err){
                        return res.status(500).send({
                            status: "error",
                            message: "Error al actualizar usuario"
                        });
                    }
                    if (!userUpdate) {
                        return res.status(200).send({
                            status: "error",
                            message: "No se actualizado usuario"
                        });
                    }
                    //Devolver una respuesta
                    return res.status(200).send({
                        status: 'success',
                        user: userUpdate
                    });
                });
            }
    },

    uploadAvatar: function(req, res){
        //Configurar el modulo multiparty (ad)

        //Recoger fichero de la peticion 
        var file_name = 'Avatar no subido';
        
        console.log(req.files)
        //Conseguir el nombre y extension de archivo subido

        //Comprobar extension (solo imagenes), si no es valida extension borrar fichero

        //Comprobar ID de usuario identificado

        //Buscar y actualizar documento de BD


        //Devolver una respuesta
        return res.status(200).send({
            status: 'success',
            message: 'Upload Avatar'
        });
    }
};


module.exports=controller;