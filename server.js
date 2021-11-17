const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const https = require("https");
const cors = require("cors");
const { SSL_PORT, PORT, HOST, ROOT_URL, PATH_TO_JSON, SSL } = require("./config.json");
const nftData = require(PATH_TO_JSON);

const app = express();

const httpsServer = https.createServer(
    {
        key: fs.readFileSync(path.resolve(SSL.key)),
        cert: fs.readFileSync(path.resolve(SSL.cert)),
    },
    app
);

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// =========================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public" + "/index.html");
});

app.get("/api/nft/:id",  (req, res) => {
    const id = req.params.id;
    
     if (id >= 0) {
         res.json(nftData)
     } else {
         res.status(400).json({error: "invalid params: id"})
     }
});

// FUNCTIONS



// STARTING THE SERVER

httpServer.listen(PORT, HOST, () => console.log(`HTTP server has been succesfully started at ${HOST}:${PORT}`));
httpsServer.listen(SSL_PORT, HOST, () =>
    console.log(`HTTPS server has been succesfully started at ${HOST}:${SSL_PORT}`)
);
