//Node server which will handle socket io connections
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });

const users = {};

io.on('connection', socket =>{
    //If any new user joins, let the users connected to the server before know who joined the server.
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });
    
    //If someone sends a message, broadcast it to other people.
    socket.on('send', message =>{
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]});
    });

    //If someone leaves the chat, let others know.
    socket.on('disconnect', () =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete(users[socket.id]);
    });
});

//socket.id is the unique id of each connection.
//disconnect is the built in event while 'new-user-joined' and 'send' are defined with our code. The disconnect event is fired automatically when someone leaves the server/ breaks the connection.