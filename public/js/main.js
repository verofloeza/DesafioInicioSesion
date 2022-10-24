const socket = io();

const authorSchema = new normalizr.schema.Entity('authors', {}, {idAttribute: 'email'});

const mensajeSchema = new normalizr.schema.Entity('mensaje', {
    author: authorSchema
}, {idAttribute: '_id'});

const dataSchema = new normalizr.schema.Entity('data',{
    data: [mensajeSchema]
}, {idAttribute: 'id'});

function habilitarButton(){

    const texto = document.getElementById("email").value;
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!regex.test(texto)) {
      document.getElementById('buttonMensaje').disabled = 'disabled'
    } else {
      document.getElementById('buttonMensaje').removeAttribute('disabled');
      document.getElementById("emailMensaje").value= texto;
    }
    
  }
  function habilitar(){
    const user =  document.getElementById("username").value; 
    const pass = document.getElementById("password").value;
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if( user != "" && pass != ""){
      if(regex.test(user)){
        document.getElementById('button').removeAttribute('disabled')
      }
      
    }else{
      document.getElementById('button').disabled = 'disabled'
      
    }

  }

  function guardar(inputName){
    document.getElementById(inputName+"Mensaje").value = document.querySelector('#'+inputName).value;
  }
  
  socket.on('from-server-mensajes', data => {
    let normalData = normalizr.denormalize(data.result, dataSchema, data.entities);
    renderMensaje(normalData.MENSAJES);

    const longO = JSON.stringify(normalData).length
    const longN = JSON.stringify(data).length;
    const porcentaje = ((longN*100)/longO).toFixed(2)
    document.querySelector('#porcentaje').innerHTML = porcentaje;
    
  });

  
  function renderMensaje(mensajesNorm) {
    
    const cuerpoMensajesHTML = mensajesNorm.map( msj =>{
        return `<div class="col-12 cont">
                  <b class="colorBlue">${msj.author.email}</b>
                  <p class="colorBrown">[${msj.timestamp}]:</p> 
                  <span class="textMessage">${msj.text}</span>
                  <img src="${msj.author.avatar}" width="30">
                </div>
                <br><br>`;
    }).join("");  
  
    document.querySelector('#historial').innerHTML = cuerpoMensajesHTML;
    document.querySelector('#message').value = "";
  }

  function desloguear(){
    location.href='./logout'
  }