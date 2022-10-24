import { config } from '../utils/config.js';
import mongoose from "mongoose";
import { usuariosModel } from '../model/usuarios.model.js';

const strConn = config.atlas.strConn;
let objs;
class ModelsUsuarios{
    constructor(){}

    async getUsuario(usuario){
        try {
            await mongoose.connect(strConn);
            objs = await usuariosModel.findOne({username: { $eq: usuario }});
            return objs;
           
          } catch (error) {
            console.log(error)
        } finally {
            await mongoose.disconnect()
        }
    }

    async postUsuario(user, pass){
        try {
            await mongoose.connect(strConn);
            objs = await usuariosModel.findOne({username: { $eq: user }});
            if(objs){
                return false
            }
            let datos ={
                username: user,
                password: pass
            }
            await usuariosModel.create(datos);
            return true;
           
          } catch (error) {
            console.log(error)
        } finally {
            await mongoose.disconnect()
        }
    }
}

export default ModelsUsuarios;