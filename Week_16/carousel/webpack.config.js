module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "createElement",
                },
              ],
            ],
          },
        },
      },
    ],
  },
  mode: "development",
  watch: true,
  devServer: {
    host: 'localhost:8080'
  }
};
