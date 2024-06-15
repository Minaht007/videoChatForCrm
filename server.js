const express = require("express");
const path = require("path");

let app = express();
let server = app.listen(3000, function () {
  console.log("Listening on port 3000");
});

const io = require("socket.io")(server, {
  allowEIO3: true,
});
app.use(express.static(path.join(__dirname, "public")));
let userConnections = []
io.on("connection", (socket) => {
  console.log("socket id is", socket.id);
  socket.on("userconnect", (data) => {
    console.log("userconnect", data.displayName, data.meetingid);

    let other_users = userConnections.filter((p) => p.meeting_id == data.meetingid)

    userConnections.push({
        connectionId: socket.id,
        user_id: data.displayName,
        meeting_id: data.meetingid,
    })

    let userCount = userConnections.length;
    console.log(userCount)

    other_users.forEach((v) => {
        socket.to(v.connectionId).emit("inform_other_about_me", {
            other_users_id: data.displayName,
        connId: socket.id,
        userNumber: userCount,
        })        
    })
    socket.emit("inform_me_about_other_user", other_users)
  });
  socket.on("SDPProcess", (data) => {
    io.to(data.to_connId).emit("SDPProcess", {
      message: data.message,
      from_connid: socket.id
    });
  });

  socket.on("sendMessage", (msg) => {
    console.log(msg)
    var mUser = userConnections.find((p)=>p.connectionId == socket.id)
    if(mUser){
      let meetingid = mUser.meeting_id
      let from = mUser.user_id;
      let list = userConnections.filter((p)=>p.meeting_id == meetingid);
      list.forEach((v)=>{
        socket.to(v.connectionId).emit("showChatMessage", {
          from: from,
          message: msg,
        })
      })
    }
  })

  socket.on("disconnect", function(){
    console.log("User got disconnected");
    let disUser = userConnections.find((p)=> p.connectionId == socket.id);
    if(disUser){
      let meetingid = disUser.meeting_id
      userConnections = userConnections.filter((p)=> p.connectionId != socket.id);
      let list = userConnections.filter((p) => p.meeting_id == meetingid)
      list.forEach((v) => {
        let userNumberAfterUserLeave = userConnections.length;
        socket.to(v.connectionId).emit("inform_other_about_disconnect_user", {
          connId: socket.id,
          uNumber: userNumberAfterUserLeave
        })
      })
    }
  })

 
});


// test