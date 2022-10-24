import {Schema, model} from "mongoose";

const mensajesSchema = Schema({
    author: {
        email: { type: String,  require: true},
        nombre: { type: String},
        apellido: { type: String},
        edad: { type: Number},
        alias: { type: String},
        avatar: { type: String}
    },
    timestamp: { type: String,  require: true},
    text: {type: String,  require: true}
    
});

export const mensajesModel = model('mensajes', mensajesSchema);