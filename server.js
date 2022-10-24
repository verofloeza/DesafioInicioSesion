import * as dotenv from 'dotenv'

import express, { urlencoded } from "express";
import { normalize, schema } from 'normalizr';

import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import MensajesDaos from './src/daos/mensajes/MensajesDaosMongodb.js';
import { Strategy } from "passport-local";
import UsuariosDaos from "./src/daos/usuarios/UsuariosDaos.js"
import bcrypt from "bcrypt";
import { engine } from 'express-handlebars';
import { join } from "path";
import passport from "passport";
import routerMensajes from "./src/routes/mensajes.routes.js";
import routerProductos from './src/routes/productos.routes.js';
import session from "express-session";

const LocalStrategy = Strategy;


const app = express();
dotenv.config();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const ApiMensajes = new MensajesDaos('MENSAJES');
let MENSAJES;

const ApiUsuarios = new UsuariosDaos('username');

const authorSchema = new schema.Entity('authors', {}, {idAttribute: 'email'});

const mensajeSchema = new schema.Entity('mensaje', {
    author: authorSchema
}, {idAttribute: '_id'});

const dataSchema = new schema.Entity('data',{
    data: [mensajeSchema]
}, {idAttribute: 'id'});


async function verifyHash(user, pass){
    const match = await bcrypt.compare(pass, user.password);
    return match
}
// /*-------------------Middleware-------------------------*/
app.use(urlencoded({ extended: true}));
app.use(express.static('./public'));

//Session Setup
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000000 //10 min
    }
}))


passport.use(new LocalStrategy(
    async function(username, password, done) {
        //Logica para validar si un usuario existe
        const existeUsuario = await ApiUsuarios.getUsuario(username);
        if (!existeUsuario) {
            return done(null, false);
        } else {
            let PASS =await verifyHash(existeUsuario, password)
            if( !PASS){
                return done(null, false);
            }
            return done(null, existeUsuario);
        }
    }
));

passport.serializeUser((usuario, done)=>{
    done(null, usuario.username );
});

passport.deserializeUser(async (usuario, done)=>{
    const existeUsuario = await ApiUsuarios.getUsuario(usuario);
    done(null, existeUsuario);
});

app.post('/login', passport.authenticate('local',  {successRedirect: '/', failureRedirect: '/login-error'} ));

app.use(passport.initialize());
app.use(passport.session());


//Motor de plantillas
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: 'hbs'
}));

app.set('views', join( './views'));
app.set('view engine', 'hbs');
app.set('socketio', io);

// /*-------------------Rutas-------------------------*/
app.use((req, res, next) => {
    req.io = io;
    return next();
  });

app.use("/", routerMensajes);
app.use("/api/productos-test", routerProductos);


  app.get('*', (req, res)=>{
    res.status(404).json({ error: ` -2, descripcion: /${req.url} ${req.method} - No implementada` })
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
     error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error.'
     }
    });
   });

   /* ---------------------- WebSocket ----------------------*/
io.on('connection', async (socket)=>{
    MENSAJES= await ApiMensajes.getAll();
    const data = {id: 999, MENSAJES };
    const normalizedData = normalize(data, dataSchema);
    console.log(`Nuevo cliente conectado! ${socket.id}`);
    
    socket.emit('from-server-mensajes', normalizedData);
  });
  
/* ---------------------- Servidor ----------------------*/
const server = httpServer.listen(process.env.PORT, ()=> {
    console.log(`Servidor escuchando en el puerto http://localhost:${process.env.PORT}`)
});

server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
});
