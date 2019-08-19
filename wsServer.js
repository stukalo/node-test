const express = require('express');
const enableWs = require('express-ws');

const app = express();
const expressWs = enableWs(app);
const clients = [];

app.get('/api', (req, res) => {
    res.send('Hello, World!');
});

app.use(express.static('public'));

expressWs.getWss().on('connection', ws => {
    clients.push(ws);
    console.log(`connected ${clients.length}`)
    sendAll(`connected ${clients.length}`);
});

app.ws('/ws', (ws, req) => {
    ws.on('message', msg => {
        console.log(msg);
    });

    ws.on('close', () => {
        const index = clients.indexOf(ws);

        if (index > -1) {
            clients.splice(index, 1);
        }

        console.log(`ws closed index=${index}`);
    });
});

const sendAll = msg => {
    clients.forEach(client => client.send(msg));
};

app.listen(3000, () =>
    console.log('listening port 3000')
);
