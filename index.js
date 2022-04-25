const express= require("express");
const app=express();
const http= require("http");
const cors=require("cors");
const {Server}=require("socket.io");
const { get_Current_User, user_Disconnect, join_User } = require("./users");

app.use(cors());

const server=http.createServer(app);


const io= new Server(server,{
    cors:{
        origin: "https://srsocketioapp.netlify.app/",
        methods:["GET","POST"]
    },
});


io.on("connection", (socket) => {
    //for a new user joining the room
    socket.on("joinRoom", ({ username, roomname }) => {
      //* create user
      const newUser = join_User(socket.id, username, roomname);
      console.log(socket.id, "=id");
      socket.join(newUser.roomname);
      //display a welcome message to the user who have joined a room
      socket.emit("message", {
        userId: newUser.id,
        username: newUser.username,
        text: `Welcome ${newUser.username}`,
      });
      //displays a joined room message to all other room users except that particular user
      socket.broadcast.to(newUser.roomname).emit("message", {
        userId: newUser.id,
        username: newUser.username,
        text: `${newUser.username} has joined the chat`,
      });
    });
    //user sending message
    socket.on("chat", (text) => {
      //gets the room user and the message sent
      const newUser = get_Current_User(socket.id);
  
      io.to(newUser.roomname).emit("message", {
        userId: newUser.id,
        username: newUser.username,
        text: text,
      });
    });
    //when the user exits the room
    socket.on("disconnect", () => {
      //the user is deleted from array of users and a left room message displayed
      const oldUser = user_Disconnect(socket.id);
      console.log("User Disconnected");
      if (oldUser) {
        io.to(oldUser.roomname).emit("message", {
          userId: oldUser.id,
          username: oldUser.username,
          text: `${oldUser.username} has left the chat`,
        });
      }
    });
});


server.listen(3001,()=>{
    console.log("Server Running @ 3001");
})