const server = require('net').createServer();
const PORT = 8000;

let counter = 0;
let sockets = {};

function timestamp() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
}

server.on('connection', socket => {
    socket.id = counter++;

    console.log('Client connected');

    socket.write('Please type your name:\n');

    socket.on('data', data => {

        if (!sockets[socket.id]) {
            socket.name = data.toString().trim();
            socket.write(`Welcome ${socket.name}!\n`);
            sockets[socket.id] = socket;
            return;
        }

        console.log(`Client ${socket.name} : ${data}`);

        Object.entries(sockets).forEach(([key, cs]) => {
            if (socket.id == key) return;

            cs.write(`${socket.name} ${timestamp()} : `);
            cs.write(data);
        });

    });

    socket.on('end', () => {
        delete sockets[socket.id];
        console.log(`Client ${socket.name} disconnected`);
    });

});

server.listen(PORT, () => console.log(`TCP Server listening on PORT ${PORT}`));


/*----------  Client  ----------*/
/*
 *   nc localhost PORT
 */
/*------------------------------*/