const io = require('socket.io-client');
const readLine = require('readline').createInterface({input: process.stdin, output: process.stdout});

const client = io('http://localhost:3000');

client.on('message', (data) => console.log(`data from server ${data}`));

readLine.on('line', (data) => {
    client.emit('message', data);
    readLine.prompt();
});

readLine.prompt();