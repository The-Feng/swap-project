const client = require("./viem");
const { contract } = require("./contract");
const poolAbi = require("../abis/pool.json");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { multicall } = require("viem/actions");
const { erc20Abi } = require("viem");
const { readFileData, writeFileData } = require("./file");

// 定义 db.json 的路径
const dbPath = path.resolve(process.cwd(), "db.json");
// 处理 bigint
const traverse = (obj) => {
  if (typeof obj === "bigint") {
    return obj.toString();
  }
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, traverse(v)])
    );
  }
  return obj;
};
// 辅助函数：将日志写入 db.json
async function saveEventToDb(logs) {
  try {
    const serializableLogs = logs.map(async (log) => {
      // 获取区块信息
      const block = await client.getBlock({ blockNumber: log.blockNumber });
      // 转换 logs 中的 BigInt 为字符串

      return {
        ...traverse(log),
        timestamp: block.timestamp.toString(), // 添加区块时间戳
        isoTime: new Date(Number(block.timestamp) * 1000).toISOString(), // 可读时间
      };
    });

    const transformedLogs = await Promise.all(serializableLogs);

    // 读取现有数据
    const data = await readFileData(dbPath);
    // 将新日志追加到数组
    data.push(...transformedLogs);
    // 写入文件
    writeFileData(dbPath, data);
  } catch (error) {
    console.error("写入 db.json 失败:", {
      message: error.message,
      stack: error.stack,
      filePath: dbPath,
      fileExists: fs.existsSync(dbPath),
    });
  }
}

const unwatch = async (eventName) => {
  const result = await client.watchContractEvent({
    address: process.env.POOL_CONTRACT_ADDRESS,
    abi: poolAbi,
    eventName,
    onLogs: (logs) => {
      console.log(logs);
    },
  });
  return result;
};

const getPools = async ({ functionName, args = [] }) => {
  const pools = await contract({
    address: process.env.POOL_CONTRACT_ADDRESS,
    abi: poolAbi,
    functionName,
    args,
  });
  return pools;
};
// 获取流动池事件日志
async function getPoolEvents(
  pairAddress,
  eventName,
  fromBlock = "latest" - 1000,
  toBlock = "latest"
) {
  try {
    const logs = await client.getContractEvents({
      address: pairAddress,
      abi: poolAbi,
      eventName,
      fromBlock,
      toBlock,
    });

    return logs;
  } catch (error) {
    console.error(`获取 ${eventName} 事件失败:`, error);
    throw error;
  }
}

/**
 * 获取流动池的完整交易记录
 * @param {string} pairAddress 流动池合约地址
 * @param {string} eventName 事件名称（例如 'Swap'）
 * @param {number} [fromBlock=latest - 1000] 起始区块号
 * @param {number} [toBlock=latest] 结束区块号
 * @returns {Promise<Array>} 包含交易详情的数组
 */
async function getPoolTransactions() {
  try {
    const transactions = await unwatch("Swap");

    return transactions;
  } catch (error) {
    console.error("获取交易记录失败:", error);
    throw error;
  }
}

// 获取流动池中的 token0 和 token1
async function getPoolTokens() {
  try {
    const [token0, token1] = await Promise.all([
      client.readContract({
        address: process.env.POOL_CONTRACT_ADDRESS,
        abi: poolAbi,
        functionName: "token0",
      }),
      client.readContract({
        address: process.env.POOL_CONTRACT_ADDRESS,
        abi: poolAbi,
        functionName: "token1",
      }),
    ]);
    const [
      { name: token0Name, symbol: token0Symbol, decimals: token0Decimals },
      { name: token1Name, symbol: token1Symbol, decimals: token1Decimals },
    ] = await Promise.all([
      getPoolsNameSymbol(token0),
      getPoolsNameSymbol(token1),
    ]);

    return {
      token0,
      token0Name,
      token0Symbol,
      token0Decimals,
      token1,
      token1Name,
      token1Symbol,
      token1Decimals,
    };
  } catch (error) {
    console.error("获取 token0/token1 失败:", error);
    throw error;
  }
}

const getPoolsNameSymbol = async (tokenAddress) => {
  const results = await multicall(client, {
    contracts: [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "symbol",
      },
      // 获取token对的精度
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
  });
  
  return {
    name: results[0].result,
    symbol: results[1].result,
    decimals: results[2].result,
  };
};

// 持续监听 Swap 事件
let swapListenerActive = false;

async function startSwapEventListener() {
  if (swapListenerActive) {
    console.log("Swap 事件监听器已在运行");
    return;
  }

  swapListenerActive = true;

  try {
    console.log("开始监听 Swap 事件...");

    const unwatch = await client.watchContractEvent({
      address: process.env.POOL_CONTRACT_ADDRESS,
      abi: poolAbi,
      eventName: "Swap",
      onLogs: async (logs) => {
        console.log("检测到 Swap 事件:", logs);
        await saveEventToDb(logs);
      },
    });

    // 插入测试数据（可选）
    // await testWriteEvent();

    console.log("Swap 事件监听器已启动");
    return unwatch;
  } catch (error) {
    swapListenerActive = false;
    console.error("启动 Swap 事件监听失败:", error);
    throw error;
  }
}

module.exports = {
  getPools,
  getPoolEvents,
  getPoolTransactions,
  startSwapEventListener,
  getPoolTokens,
};
