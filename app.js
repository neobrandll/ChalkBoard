const express = require("express");
const app = express();

const config = require('./helper/config');
var server = app.listen(config.port)


var socket = require('socket.io');
var io = socket(server);
let name;
let room;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

var usercount = [];


app.get("/", (req,res)=>{
    res.redirect("public/index.html");
})

app.get("/godraw", (req,res)=>{
  name = req.query.name
  room =req.query.room
  res.json({"status": "ok"})
})

app.get("/quefue",(req,res)=>{
  res.json({ "name": name, "room":room });
})


io.sockets.on('connection', newConnection);

  function newConnection(socket) {
    socket.join(room)
    console.log("A client connected: " + socket.id);
    socket.on("newUser", newUser);
    socket.on('mouseEvent', mouseEvent);
    socket.on('newMessage', newMessage);
    socket.on("eraseAll", eraseAll);
    socket.on("userQuit", userQuit)

    function userQuit(dataquit){
      console.log("user disconnected: " + dataquit.name+"en la sala: " + dataquit.room )
      deletename(dataquit.id);
      socket.broadcast.to(dataquit.room).emit("userQuit", dataquit)
    }

    function eraseAll(room){
      io.sockets.in(room).emit("eraseAll")
    }

    function newMessage(datamsg){
      io.sockets.in(datamsg.room).emit('newMessage', datamsg)
    }
    
    function mouseEvent(data) {
      socket.broadcast.to(data.room).emit('mouseEvent', data);

    }

    function newUser(dataUser){
      console.log(dataUser.room);
      
       usercount.push({"name": dataUser.name, "id": dataUser.id, "room": dataUser.room});
      dataUser.usercount = usercount;
      dataUser.newroom = dataUser.room;
      io.sockets.in(dataUser.room).emit('newUser', dataUser)
    }

    function deletename(x){
      for(let i= 0; i<usercount.length; i++){
        if(x== usercount[i].id){
          usercount.splice(i,1);
        }
      }
    }
  }