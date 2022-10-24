import { normalize, schema } from 'normalizr';

import { config } from '../utils/config.js';
import { mensajesModel } from '../model/mensajes.model.js';
import mongoose from "mongoose";
import { print } from '../utils/functions.js';

const strConn = config.atlas.strConn;

const authorSchema = new schema.Entity('authors', {}, {idAttribute: 'email'});

const mensajesSchema = new schema.Entity('mensajes', {
    author: authorSchema
}, {idAttribute: '_id'});

const dataSchema = new schema.Entity('data',{
    mensajes: [mensajesSchema]
}, {idAttribute: 'id'});

let objs;
class Mensajes{
    constructor(){}
    
    async getAll(){
        try {
            await mongoose.connect(strConn);
            objs = await mensajesModel.find().lean();
            return objs;
           
          } catch (error) {
            console.log(error)
        } finally {
            await mongoose.disconnect()
        }
    }
    async insertar(datos){
        try {
            await mongoose.connect(strConn);
            objs = await mensajesModel.find();
            datos = {
                author:{
                    email: datos.email,
                    nombre : datos.nombre,
                    apellido : datos.apellido,
                    edad : datos.edad,
                    alias : datos.alias,
                    avatar : datos.avatar
                },
                timestamp : new Date().toLocaleString(),
                text: datos.mensaje
                
            }
            await mensajesModel.create(datos);
            return datos;
          } catch (error) {
            console.log(error)
        } finally {
            await mongoose.disconnect()
        }
    }
}

export default Mensajes;