'use strict'
var jwt=require('jwt-simple');
var moment= require('moment');
var secret ="clave-sercreta-para-generar-el-token-9999"
exports.authenticated= function(req, res, next){
    //Comprobar si llega autorizacion
    if(!req.headers.authorization){
        return res.status(403).send({
            message: "La peticion no tiene cabecera de autorizacion (token)"
        });
    }
    //Limpiar el token y quitar comillas
    var token= req.headers.authorization.replace(/['"]+/g, '');
    
    try{
        //Decoficiar el token 
        var payload=jwt.decode(token, secret);
        //Comprobar si el token a expirado
        if(payload.exp<= moment().unix()){
            return res.status(404).send({
                message: "Token a expirado"
            });
        }
    }catch(ex){
        return res.status(404).send({
            message: "Token no es valido"
        });
    }
    

    //Adjuntar usuario identificado a la request
    req.user=payload;
    //Pasar a la accion

    next();
}