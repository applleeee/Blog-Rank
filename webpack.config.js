const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
   devServer: {
      proxy: {
         "/search.naver": {
            target: "https://search.naver.com",
            changeOrigin: true,
         },
      },
   },
   entry: { index: "./js/index.js" },
   output: {
      path: path.resolve(__dirname, "docs"),
      filename: "js/[name].js",
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            use: {
               loader: "babel-loader",
               options: {
                  presets: ["@babel/preset-env"],
               },
            },
         },
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
         },
         {
            test: /\.(png|jpe?g|gif|svg|webp)$/i,
            use: [{ loader: "file-loader", options: { name: "[name].[ext]", publicPath: "images/", outputPath: "images/" } }],
         },
      ],
   },
   devtool: "source-map",
   plugins: [
      new HtmlPlugin({
         template: "./index.html",
      }),
      new MiniCssExtractPlugin({
         linkType: false,
         filename: "css/[name].[contenthash:8].css",
      }),
   ],
};
