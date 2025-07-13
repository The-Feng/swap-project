const express = require("express");
const router = express.Router();
const { getPoolTransactions, poolTokens } = require("./pools");
// 导入事件路由
const eventRouter = require("./events");

router.use("/transactions", getPoolTransactions);
router.use("/poolTokens", poolTokens);
router.use("/events", eventRouter);

// router.use('/', (req, res) => {
//   res.status(404).json({ error: 'API 路由未找到' });
// })

// console.log("router", router);

module.exports = router;
