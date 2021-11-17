const { ethers } = require("ethers");
const ABI = require("../etc/abi.json");
const contractAdress = "0x4cb7670A8BD08489315d4EA7F9097CD7983c4e81";

const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-rinkeby.alchemyapi.io/v2/FeJ9BFIGGf3OGwRLZFIzUNyx-wPS3Rfb"
);

const contractInstance = new ethers.Contract(contractAdress, ABI, provider);

module.exports.tokensOfOwner = async (wallet) => {
    try {
        const tokens = await contractInstance.tokensOfOwner(wallet);
        return tokens;
    } catch (err) {
        console.error(err);
    }
};
