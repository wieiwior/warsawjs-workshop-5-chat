const io = require('socket.io-client');
const readLine = require('readline').createInterface({input: process.stdin, output: process.stdout});

const client = io(`http://${process.argv[2] || 'localhost'}:3000`);

function clearPrompt() {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
}
client.on('message', (data) => {
        clearPrompt();
        console.log(`data from server ${data}`);
        readLine.prompt();
    }
);

readLine.on('line', (data) => {
    if(data.trim()){
        client.emit('message', data);
    }
    readLine.prompt();
});

readLine.prompt();