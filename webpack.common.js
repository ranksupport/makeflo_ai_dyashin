const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js and .jsx files
        exclude: /node_modules/, // excluding the node_modules folder
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
    ],
  },
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single", // extracted boilerplate code
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  output: {
    path: path.join(__dirname, "/dist"), // the bundle output path
    filename: "[name].[contenthash].js",
    // filename: "bundle.js", // the name of the bundle
    // publicPath: "/",
    // clean: true,
  },
};
