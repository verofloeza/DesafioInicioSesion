import {Schema, model} from "mongoose";

const usuariosSchema = Schema({
    
    username: {type: String,  require: true},
    password: {type: String, require: true}
    
});

export const usuariosModel = model('usuarios', usuariosSchema);