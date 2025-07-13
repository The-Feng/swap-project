const client = require("./viem");

const contract = async ({ address, abi, functionName, args = [] }) => {
  try {
    // 获取合约信息
    const result = await client.readContract({
      address,
      abi,
      functionName,
      args,
    });

    return result;
  } catch (error) {
    console.error(`调用合约方法 ${functionName} 失败:`, error);
    throw error;
  }
};

module.exports = { contract };
