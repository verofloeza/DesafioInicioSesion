import MensajesDaos from "../daos/mensajes/MensajesDaosMongodb.js";
import UsuariosDaos from "../daos/usuarios/UsuariosDaos.js"
import bcrypt from "bcrypt";
import express from "express";
import passport from "passport";

const routerMensajes = express.Router();

const ApiMensajes = new MensajesDaos('MENSAJES');
const ApiUsuarios = new UsuariosDaos('username');

let MENSAJES;

// Metodos de Auth
async function generateHash(pass){
    const hashPass = await bcrypt.hash(pass, 10);
    return hashPass;
}

function isAuth(req, res, next) {
    if(req.isAuthenticated()){
        next()
    } else {
        res.redirect('/login')
    }
}


routerMensajes.get( "/", isAuth, async (req, res) => {
    if(!req.user.username){
        res.redirect('/login');
    }
    let USUARIO = req.user.username;
    MENSAJES = await ApiMensajes.getAll();
    console.log('ID del cliente:',req.sessionID);
    if(!MENSAJES){
        return res.status(404).json({ error });
    }else{
        return res.status(200).render('vista', {MENSAJES, USUARIO});
    }
})

routerMensajes.post( "/mensajes", async (req, res) => {
    await ApiMensajes.insertar(req.body);
    MENSAJES = await ApiMensajes.getAll();
    req.io.emit('from-server-mensajes', {MENSAJES});
    res.redirect('/');

});

routerMensajes.get('/login', (req, res)=> {
    const FORM_SESSION = "Formulario"
    return res.status(200).render('vista', {FORM_SESSION});
});

routerMensajes.get('/register', (req, res)=> {
    const FORM_REGISTER = "Formulario"
    return res.status(200).render('vista', {FORM_REGISTER});
});


routerMensajes.post('/registerSession', async (req, res)=> {
    const { username, password } = req.body
    let USUARIO = await ApiUsuarios.postUsuario(username, await generateHash(password));
    if (!USUARIO) {
        res.redirect('/register-error');
        return 
    }
    res.redirect('/login');
});

routerMensajes.get('/logout', (req, res)=> {
    let USUARIO = req.user.username;
    req.session.destroy(err=>{
        if (err) {
            res.json({err});
        } else {
            const DETROY_SESSION = "Formulario"
            return res.status(200).render('vista', {DETROY_SESSION, USUARIO});
        }
    });
});

routerMensajes.get('/login-error', (req, res)=>{
    res.render('login-error');
})

routerMensajes.get('/register-error', (req, res)=>{
    res.render('register-error');
})

export default routerMensajes;