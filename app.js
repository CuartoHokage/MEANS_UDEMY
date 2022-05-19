'use strict'

//requires
var express=require('express');
var bodyParser=require('body-parser');

//ejecutar express
var app=express();


//cargar archivos de rutas

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors

//reescribir rutas
app.get('/prueba', (req, res)=>{
    return res.status(200).send("<h1>Hola Bryan :v esta peticion es por GET</h1>");
   /* return res.status(200).send({
        message: 'Hola Bryan'
    });*/
});

app.post('/prueba', (req, res)=>{
    return res.status(200).send({
        nombre: 'Jaime',
        message: 'Hola esta Peticion es por POST'
    });
   
});
//exportar modulo
module.exports=app;