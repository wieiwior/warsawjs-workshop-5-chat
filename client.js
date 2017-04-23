const io = require('socket.io-client');
const readLine = require('readline').createInterface({input: process.stdin, output: process.stdout});

const client = io(`http://${process.argv[2] || 'localhost'}:3000`);
let LOGGED_USER_NAME = '';

function clearPrompt() {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
}

function messageHandler(data) {
    clearPrompt();
    console.log(`data from server: ${data}`);
    readLine.prompt();
}

function loginHandler(userName) {
    clearPrompt();
    if (userName) {
        LOGGED_USER_NAME = userName;
        readLine.setPrompt(`${userName}: `)
    } else {
        console.log('> Login failed');
    }
    readLine.prompt();
}

function registerHandler(isAlreadyRregistered){
    clearPrompt();
    if (isAlreadyRregistered) {
        console.log('> Registration failed');
    } else {
        console.log('> Registration successful');
    }
    readLine.prompt();
}

function cmdLineHandler(data) {
    const lineArgs = data.split(/\s+/);
    const firstWord = lineArgs[0];
    if (firstWord === '/exit') {
        readLine.close();
        process.exit();
    } else if (firstWord === '/register') {
        if (lineArgs.length >= 3) {
            emitEvent('register', {
                userName: lineArgs[1],
                password: lineArgs[2]
            });
        }
    } else if (firstWord === '/login') {
        if (lineArgs.length >= 3) {
            emitEvent('login', {
                userName: lineArgs[1],
                password: lineArgs[2]
            });
        }
    } else if (firstWord === '/logout') {
        if (lineArgs.length >= 2) {
            emitEvent('logout', LOGGED_USER_NAME);
            LOGGED_USER_NAME = '';
        }
        readLine.setPrompt('> ');
    } else if (data.trim()) {
        emitEvent('message', data);
    }
    readLine.prompt();
}

client.on('message', messageHandler);

client.on('login', loginHandler);

client.on('register', registerHandler);

readLine.on('line', cmdLineHandler);

emitEvent = (eventName, data) => {
    client.emit(eventName, data);
};

readLine.prompt();