const io = require('socket.io');
const server = io();

const USERS = {};

server.on('connection', (client) => {
    console.log(`Client with id: ${client.id} , connected`);
    client.on('message', (msg) => {
        client.broadcast.emit('message', msg);
    });

    client.on('register', (user) => {
        USERS[user.userName] = {logged_in: false, password: user.password};
        console.log(`Client registered: ${user.userName}`);
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
});

server.listen(3000);
