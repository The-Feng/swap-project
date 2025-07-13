const fs = require("fs");
const readFileData = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log("文件文件不存在");
      throw new Error("文件文件不存在");
    }

    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      console.error("路径是一个目录，不是文件");
      throw new Error("路径是一个目录，不是文件");
    }

    const data = fs.readFileSync(filePath, "utf8");

    let result = [];
    try {
      result = JSON.parse(data);
    } catch (parseError) {
      console.error("文件解析失败:", parseError);
      throw new Error("文件解析失败");
    }
    return result;
  } catch (error) {
    console.error("读取 文件失败:", error);
    throw new Error("服务器内部错误");
  }
};

const writeFileData = (filePath, data) => {
  // 确保 db.json 存在
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
    console.log("创建了新的 db.json 文件");
  }

  // 验证数据可序列化性
  try {
    JSON.stringify(data);
  } catch (jsonError) {
    throw new Error(`数据序列化失败: ${jsonError.message}`);
  }

  // 写回文件
  fs.writeFileSync(filePath, JSON.stringify(data, null), "utf8");
};

module.exports = {
  readFileData,
  writeFileData,
};
