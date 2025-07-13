const nodeExternals = require("webpack-node-externals"); // 打包忽略文件
const path = require("path");
module.exports = {
  target: "node", // 增加这一行，设置 Webpack 构建目标为 Node.js
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
  },
  devtool: "source-map",
  watch: true,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  externals: [nodeExternals()],
};
