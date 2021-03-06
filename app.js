'use strict'

//requires
var express=require('express');
var bodyParser=require('body-parser');

//ejecutar express
var app=express();


//cargar archivos de rutas
var user_routes= require('./routes/user');
//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors

//reescribir rutas
app.use('/api', user_routes);

//exportar modulo
module.exports=app;
//comentario