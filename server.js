const io = require('socket.io');
const server = io();

const USERS = {};

function handleMessage(client) {
    return (msg) => {
        console.log(msg);
        client.broadcast.emit('message', msg);
    }
}

function handleRegister(client) {
    return (userObject) => {
        if (USERS[userObject.userName]) {
            client.emit('register', true);
        } else {
            USERS[userObject.userName] = {logged_in: false, password: userObject.password};
            console.log(`Client registered: ${userObject.userName}`);
            client.emit('register', false);
        }
    }
}

function handleLogin(client) {
    return (userObject) => {
        const user = USERS[userObject.userName];
        if (user.password === userObject.password) {
            user.logged_in = true;
            client.emit('login', userObject.userName);
        } else {
            client.emit('login', '');
        }
    }
}

function handleLogout() {
    return (userName) => {
        const user = USERS[userName];
        if (user) {
            user.logged_in = false;
        }
    }
}

server.on('connection', (client) => {
    console.log(`Client with id: ${client.id} , connected`);

    client.on('message', handleMessage(client));

    client.on('register', handleRegister(client));

    client.on('login', handleLogin(client));

    client.on('logout', handleLogout());
});

server.listen(3000);
