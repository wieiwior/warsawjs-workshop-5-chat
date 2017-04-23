const io = require('socket.io');
const server = io();

const USERS = {};

server.on('connection', (client) => {
    console.log(`Client with id: ${client.id} , connected`);
    client.on('message', (msg) => {
        client.broadcast.emit('message', msg);
    });

    client.on('register', (userObject) => {
        if(USERS[userObject.userName]){
            client.emit('register', true);
        } else {
            USERS[userObject.userName] = {logged_in: false, password: userObject.password};
            console.log(`Client registered: ${userObject.userName}`);
            client.emit('register', false);
        }
    });

    client.on('login', (userObject) => {
        const user = USERS[userObject.userName];
        if(user.password === userObject.password){
            user.logged_in = true;
            client.emit('login', userObject.userName);
        } else {
            client.emit('login', '');
        }
    });

    client.on('logout', (userName) => {
       const user = USERS[userName];
       if(user){
           user.logged_in = false;
       }

    });
});

server.listen(3000);
