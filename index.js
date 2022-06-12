'use strict'

var mongoose= require('mongoose');
var app= require('./app');
var port= process.env.PORT || 2000;

mongoose.set('useFindAndModify', false)
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_node', {useNewUrlParser: true})
    .then(()=>{
        console.log('La conexion a la base de datos mongo se a realizado correctamente');
        //CREAR SERVIDOR 
        app.listen(port, ()=>{
            console.log('El servidor funciona :)');
        });
    })
    .catch(error=> console.log(error));