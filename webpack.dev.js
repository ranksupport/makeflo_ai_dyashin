const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-source-map",
  performance: {
    hints: false,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "./"),
    },
    historyApiFallback: true,
    historyApiFallback: {
      rewrites: [
        { from: /./, to: '/index.html' },
      ],
    },
    hot: false,
    liveReload: false,
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"), // to import index.html file inside index.js
      title: "Makeflo",
      favicon: "src/assets/makeflow.svg",
      // favicon: "src/assets/suitedash.svg",
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify("5fa3b9"),
      "process.env.API_BASE_URL": JSON.stringify(
        // "https://api.connect.yt/"
        "https://api.konnectzit.com/"
        // "https://suitedashapi.konnectzit.com/"
      ),
      "process.env.APP_BASE_URL": JSON.stringify("http://localhost:8081/"),
      "process.env.AI_BASE_URL": JSON.stringify("http://localhost:3000"),
      "process.env.API_KEY": JSON.stringify(
        "360c3597-78d5-4a80-9998-2042b859578f"
      ),
      "process.env.GOOGLE_CAPTCHA_SITE_KEY": JSON.stringify(
        "6LdWveYUAAAAAJ8JEb0UKQ7KUzMhJbU6CKTM3PM5"
      ),
    }),
  ],
});
