const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { ROOT_URL, PATH_TO_JSON } = require("./config.json");
const nftData = require(PATH_TO_JSON);

const app = express();

const httpsServer = https.createServer(
    {
        key: fs.readFileSync(path.resolve("./etc/sslDev/key.pem")),
        cert: fs.readFileSync(path.resolve("./etc/sslDev/cert.pem")),
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

httpsServer.listen(80, "192.168.0.198", () => console.log(`Server has been succesfully started!`));
