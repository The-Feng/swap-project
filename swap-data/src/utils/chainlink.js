// src/utils/chainlink.js
const { createPublicClient, http } = require("viem");
const { mainnet } = require("viem/chains");
const { readContract } = require("viem/actions");

// Chainlink ETH/USD 价格合约 ABI（简化版）
const chainlinkEthUsdAbi = [
  {
    constant: true,
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

// 创建 viem 客户端
const client = createPublicClient({
  chain: mainnet,
  transport: http(
    "https://mainnet.infura.io/v3/88559793bdcf420c9d6ca575c0ffcdfd"
  ),
});

/**
 * 从 Chainlink 获取 ETH/USD 价格
 * @param {string} feedAddress Chainlink Price Feed 合约地址
 * @returns {Promise<{ price: number, lastUpdated: Date }>} 价格和最后更新时间
 */
async function getPriceFromChainlink(feedAddress) {
  try {
    const result = await readContract(client, {
      address: feedAddress,
      abi: chainlinkEthUsdAbi,
      functionName: "latestRoundData",
      args: [],
    });

    const [roundId, answer, startedAt, updatedAt] = result;

    const ethPriceInUsd = Number(answer) / 1e8; // 转换为实际 USD 价格
    const lastUpdated = new Date(Number(updatedAt) * 1000);

    return {
      price: ethPriceInUsd.toFixed(2), // 保留两位小数
      lastUpdated: lastUpdated.toISOString(), // 标准时间格式
    };
  } catch (error) {
    console.error("获取 ETH 价格失败:", error);
    throw error;
  }
}

module.exports = { getPriceFromChainlink };
