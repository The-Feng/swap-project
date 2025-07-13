const { getPoolTokens } = require("../utils/pool");
const fs = require("fs");
const path = require("path");
const dbPath = path.resolve(process.cwd(), "db.json");
const { readFileData } = require("../utils/file");

// 获取流动池中的 token0 和 token1 地址
const poolTokens = async (req, res) => {
  try {
    const {
      token0,
      token0Name,
      token0Symbol,
      token0Decimals,
      token1,
      token1Name,
      token1Symbol,
      token1Decimals,
    } = await getPoolTokens();

    // 获取token0和token1的symbol
    // const { symbol: token0Symbol, name: token0Name } = await getTokenSymbol(
    //   token0
    // );

    return res.status(200).json({
      data: {
        token0,
        token0Name,
        token0Symbol,
        token0Decimals,
        token1,
        token1Name,
        token1Symbol,
        token1Decimals,
      },
    });
  } catch (error) {
    console.error("获取代币地址失败:", error);
    return {};
  }
};

const getPoolTransactions = async (req, res) => {
  const events = await readFileData(dbPath);
  events.reverse();
  return res.status(200).json({ data: events });
};

module.exports = { getPoolTransactions, poolTokens };
