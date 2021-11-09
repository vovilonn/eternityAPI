const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { ROOT_URL } = require("./config.json");
const { tokensOfOwner, getBirthday } = require("./src/contract");
const nftData = require("./src/data/data.json");

const app = express();

const httpsServer = https.createServer(
    {
        key: fs.readFileSync(path.resolve("./etc/ssl/key.pem")),
        cert: fs.readFileSync(path.resolve("./etc/ssl/cert.pem")),
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

app.get("/api/nft/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const birthday = await getBirthday(id);
        if (birthday) {
            if (!checkDate(birthday) && birthday.toNumber() > 0) {
                res.json(makeEmbrionData(id));
            }
            if (!checkDate(birthday)) {
                res.json({ error: "not burn yet" });
            }
            res.json(nftData[id]);
        } else {
            res.status(500);
        }
    } catch (err) {
        console.error(err);
    }
});

app.get("/api/tokens/:wallet", async (req, res) => {
    res.json(await getTokensOfOwner(req.params.wallet));
});

app.get("/api/pages", (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;

    if (page && limit) {
        if (page * limit > nftData.length) {
            res.json([...nftData].splice(page * limit));
        } else {
            res.json([...nftData].splice(page * limit, limit));
        }
    }
    res.status(500);
});

// FUNCTIONS

function makeEmbrionData(nftId) {
    return {
        image: "https://ipfs.io/ipfs/bafybeig66tejqvxespqzvbshpksclybgbzicrsfbgyjitqwc5ordky5xde/Phallus-fetus.png",
        external_url: ROOT_URL + nftId,
        attributes: [
            { value: "empty", trait_type: "Background" },
            { value: "empty", trait_type: "Skin" },
            { value: "empty", trait_type: "Mouth" },
            { value: "empty", trait_type: "Eyes" },
            { value: "empty", trait_type: "Head" },
            { value: "empty", trait_type: "Accessory" },
        ],
        name: "empty",
    };
}

function checkDate(birthday) {
    birthday = birthday.toNumber();
    if (birthday === 0) {
        return false;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > birthday + 518400; // current time > birthday + two weeks
}

function getTokensOfOwner(wallet) {
    const tokensID = tokensOfOwner(wallet);
    return nftData.filter((e, i) => e.id === tokensID[i]);
}

httpsServer.listen(80, "192.168.0.198", () => console.log(`Server has been succesfully started!`));