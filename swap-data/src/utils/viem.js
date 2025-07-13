const { createPublicClient, http } = require("viem");
const { mainnet } = require("viem/chains");
const { getPriceFromChainlink } = require("./chainlink");

const client = createPublicClient({
  chain: mainnet,
  transport: http(
    "https://mainnet.infura.io/v3/88559793bdcf420c9d6ca575c0ffcdfd"
  ),
});

module.exports = client;
