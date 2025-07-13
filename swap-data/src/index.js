// 加载环境变量
require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const pool = require('./utils/pool');

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 导入示例API路由
const router = require('./api');

// 启动服务器
app.use(cors());
app.use('/api', router);

app.listen(PORT, async () => {
  console.log(`服务器正在运行在 http://localhost:${PORT}`);
  
  try {
    // 启动 Swap 事件监听器
    const unwatchSwap = await pool.startSwapEventListener();
    
    // 可选：保存 unwatchSwap 函数以便在需要时停止监听
    // 例如：process.on('SIGINT', unwatchSwap);
    
  } catch (error) {
    console.error('启动事件监听器失败:', error);
  }
});
