'use strict'

var mongoose= require('mongoose');
var Schema=mongoose.Schema;
//Modelo de comment
var CommentSchema= Schema({
    content: String,
    date: {type: Date, default: Date.now},
    user:{type: Schema.ObjectIde, ref: 'User'} 
});

var Comment=mongoose.model('Comment', CommentSchema);
//
var TopicSchema= Schema({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: {type: Date, default: Date.now},
    user:{type: Schema.ObjectIde, ref: 'User'},
    commets: [CommentSchema]
});

module.exports= mongoose.model('Topic', TopicSchema);