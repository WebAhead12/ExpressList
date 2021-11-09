const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');
const cookiePraser = require('cookie-parser');

const server = express();

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

server.use(express.static('public'))

server.listen(PORT, () => { console.log(`listening on http://localhost:${PORT}`) })