const socketIO = (server) => {
    const io = require('socket.io')(server)

    //let onlineUsers = [];
    let onlinePatients = [];
    let onlineDoctors = [];
    io.on("connection", (socket) => {
        socket.emit("me", socket.id)
        socket.emit('onlinePatients', onlinePatients);
        socket.emit('onlineDoctors', onlineDoctors);

        socket.on('setUsername', (data) => {
            switch(data.userType){
                case "doctor":
                    if(onlineDoctors.filter(user => user.username == data.username).length == 0){
                        onlineDoctors.push({id: socket.id, username: data.username, userType: data.userType});
                    }  
                    break;
                case "patient":
                    if(onlinePatients.filter(user => user.username == data.username).length == 0){
                        onlinePatients.push({id: socket.id, username: data.username, userType: data.userType});
                    }  
                    break;
            } 
            io.emit('onlineDoctors', onlineDoctors);
            io.emit('onlinePatients', onlinePatients);
          });

        socket.on("callUser", (data) => {
            io.to(data.userToCall).emit("callUser", {signal: data.signalData, from: data.from, name: data.name})
        })

        socket.on("answerCall", (data) => io.to(data.to).emit("callAccepted", data.signal))

        socket.on("endCall", (data) => {
            io.to(data.to).emit("endCall")
        })
        socket.on("disconnect", () => {
            onlineDoctors = onlineDoctors.filter(onlineUser => onlineUser.id != socket.id);
            onlinePatients = onlinePatients.filter(onlineUser => onlineUser.id != socket.id);
            socket.broadcast.emit("userDisconnected", socket.id);
        });
    })
  };
  
  module.exports = socketIO;