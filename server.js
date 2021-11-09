const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');
const cookiePraser = require('cookie-parser');
const authHandler = require(path.join(__dirname, 'authentication-handler'))

const server = express();
server.use(express.json());
server.use(cookiePraser());

server.use((req, res, next) => {
    const token = req.cookie.account
    if (token) {
        const user = authHandler.getTokenUser(req.cookie.account);
        if (user != '')
            req.user = user;
    }
    next();
})


server.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/home');
        return;
    }
    res.sendFile(path.join(__dirname, 'public', 'log-in.html'));
})

server.post('/', (req, res) => {
    const account = req.body;
    const token = authHandler.toknifyAccount(account);
    res.cookie('account', token, { maxAge: 600000 });

})

server.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})



server.use(express.static('public'))

server.listen(PORT, () => { console.log(`listening on http://localhost:${PORT}`) })