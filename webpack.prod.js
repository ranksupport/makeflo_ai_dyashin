const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  performance: {
    hints: false,
  },
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"), // to import index.html file inside index.js
      title: "Makeflo",
      favicon: "src/assets/makeflow.svg",
      // favicon: "src/assets/suitedash.svg",
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify("5fa3b9"),
      // "process.env.API_BASE_URL": JSON.stringify("https://api.konnectzit.com/"),
      // "process.env.APP_BASE_URL": JSON.stringify("https://app.konnectzit.com/"),
      "process.env.API_BASE_URL": JSON.stringify("https://api.connect.yt/"),
      "process.env.APP_BASE_URL": JSON.stringify("https://app.connect.yt/"),
      // "process.env.API_BASE_URL": JSON.stringify("https://suitedashapi.konnectzit.com/"),
      // "process.env.APP_BASE_URL": JSON.stringify(" https://suitedash.konnectzit.com/"),
      "process.env.API_KEY": JSON.stringify(
        "360c3597-78d5-4a80-9998-2042b859578f"
      ),
      "process.env.GOOGLE_CAPTCHA_SITE_KEY": JSON.stringify(
        "6LenPGUjAAAAACrXw6tj0hfoe9hRGINihz_DUcie"
      ),
    }),
  ],
});
