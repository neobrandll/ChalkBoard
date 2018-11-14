var name;
var room;
  function fetchinit(){
    var miInit = { method: 'GET', };
  
  fetch('/quefue',miInit)
  .then(function(response) {
    return response.json();
  })
  .then(function(mijson) {
    socket.room = mijson.room
    socket.name = mijson.name
    addname()
  });
  }

  function randomRGB(){
    var x = Math.floor(Math.random() * 256)
    var y = Math.floor(Math.random() * 256)
    var z = Math.floor(Math.random() * 256)
    var rgb = "rgb("+ x + ", "+ y+ ", "+z+")"
    return rgb
}

// funcion que se ejecuta luego del fetch, para comunicarle al server la sala y el nombre del nuevo usuario
function addname(){
  dataUser = {
    name: socket.name,
    room: socket.room,
    id: socket.id
  }
  socket.emit("newUser", dataUser)
}



function setup() {
  var canvas_w= parseInt(document.getElementById("canvas-container").offsetWidth);
  var canvas_h= parseInt(document.getElementById("canvas-container").offsetHeight);
   var canvas = createCanvas(canvas_w * 0.97, canvas_h * 0.97);
   canvas.parent("canvas-container")
    background('rgba(0,255,0, 0)');
   
    socket = io.connect();
    fetchinit()
    socket.color = randomRGB();
    socket.strokeW = 1

    // receive
    socket.on('mouseEvent', newDrawing);
    socket.on('newMessage', newMessage);
    socket.on("eraseAll",eraseAll )
    socket.on("newUser", newUser)
    socket.on("userQuit", userQuit)

  }
 
  function userQuit(dataquit){
    var userOut= document.getElementById(dataquit.id)
    document.getElementById("listUsers").removeChild(userOut)
  }
  
  //esto se lo dibuja a los que reciben el mensaje
  function newDrawing(data) {
     stroke(data.color);
     strokeWeight(data.strokeW)
    line(data.x, data.y, data.px, data.py);
  }

 
  
  
  function mouseDragged() {
    //esto se lo dibuja al usuario que pinto
    stroke(socket.color);
    strokeWeight(socket.strokeW)
    line(mouseX, mouseY, pmouseX, pmouseY);
  
    // objeto con las propiedades del trazo
    var data = {
      x: mouseX,
      y: mouseY,
      px: pmouseX,
      py: pmouseY,
      color: socket.color,
      room: socket.room,
      strokeW: socket.strokeW
    }
  
    // envia la data del trazo al server
    socket.emit('mouseEvent', data);


  }
  
  function draw() {
  
  }


  // editPencil
      //colors

var color1 =document.getElementById("color1")
var color2 =document.getElementById("color2")
var color3 =document.getElementById("color3")
var color4 =document.getElementById("color4")
var color5 =document.getElementById("color5")
var color6 =document.getElementById("color6")
var color7 =document.getElementById("color7")
var color8 =document.getElementById("color8")




color1.addEventListener("click", ()=> socket.color = window.getComputedStyle(color1).getPropertyValue('background-color')  )
color2.addEventListener("click", ()=> socket.color = window.getComputedStyle(color2).getPropertyValue('background-color')  )
color3.addEventListener("click", ()=> socket.color = window.getComputedStyle(color3).getPropertyValue('background-color')  )
color4.addEventListener("click", ()=> socket.color = window.getComputedStyle(color4).getPropertyValue('background-color')  )
color5.addEventListener("click", ()=> socket.color = window.getComputedStyle(color5).getPropertyValue('background-color')  )
color6.addEventListener("click", ()=> socket.color = window.getComputedStyle(color6).getPropertyValue('background-color')  )
color7.addEventListener("click", ()=> socket.color = window.getComputedStyle(color7).getPropertyValue('background-color')  )
color8.addEventListener("click", ()=> socket.color = window.getComputedStyle(color8).getPropertyValue('background-color')  )

//strokeWeight

document.getElementById("thin").addEventListener("click", ()=> socket.strokeW = 1)
document.getElementById("light").addEventListener("click", ()=> socket.strokeW = 3)
document.getElementById("medium").addEventListener("click", ()=> socket.strokeW = 5)
document.getElementById("bold").addEventListener("click", ()=> socket.strokeW = 7)
document.getElementById("extraBold").addEventListener("click", ()=> socket.strokeW = 9)

// sendmsg
var sndbtn = document.getElementById("sndmsg")
sndbtn.addEventListener("click", ()=>{
  var inputmsg = document.getElementById("new-msg")
  var msg = inputmsg.value;
  inputmsg.value = ""
  var datamsg = {
    msg: msg,
    name: socket.name,
    room: socket.room
  }
  socket.emit('newMessage', datamsg)
})

function newMessage(datamsg){
  var li= document.createElement("li")
  li.textContent = datamsg.name+": " + datamsg.msg;
  document.getElementById("msgs").appendChild(li);

}

//borrar pizarras

document.getElementById("erase").addEventListener("click",()=>clear());
document.getElementById("eraseAll").addEventListener("click", ()=>{
  socket.emit("eraseAll", socket.room)
})

function eraseAll(){
  clear();
}

//anadir usuarios a la lista

function newUser(dataUser){
  divlist= document.getElementById("listUsers")
  nodes = divlist.getElementsByTagName("li");
  for(let i=0; i< dataUser.usercount.length; i++){
    var loencontro = false

    if (dataUser.usercount[i].room == dataUser.newroom) {
      for(let j=0; j<nodes.length; j++ ){
        if(dataUser.usercount[i].id == nodes[j].id){
          loencontro = true
        }
      }
      if(!loencontro){
        var li = document.createElement("li");
        li.setAttribute("id",dataUser.usercount[i].id);
        li.textContent = dataUser.usercount[i].name;
        divlist.appendChild(li);
      }
    }
      
  }
}

window.onunload = function () {
  dataquit={
    id: socket.id,
    name: socket.name,
    room: socket.room
  }
  localStorage.pasoPI = "false"
  socket.emit("userQuit", dataquit)
}

// Funciona que verifica si el usuario esta registrado

 function verifyUser() {
   if ((localStorage.pasoPI == "false")) {
    dataquit={
      id: socket.id,
      name: socket.name,
      room: socket.room
    }
    socket.emit("userQuit", dataquit)
    window.location.replace('../index.html');
     
   }
 }

//  Funcion para editar el Cursor
function editPecil() {
  document.documentElement.style.cursor = "url('css/images/pencil.png'), auto";
}