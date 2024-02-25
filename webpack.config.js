const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
    mode:"production",
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: "asset",
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                type: 'javascript/auto',
              },
              {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      outputPath: 'images/', 
                    },
                  },
                ],
            },
        ],
    },
    optimization: {
        minimizer: [
          new ImageMinimizerPlugin({
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminMinify,
              options: {
                plugins: [
                    ["gifsicle", { interlaced: true }],
                    ["jpegtran", { progressive: true,quality:[0.6,0.8] }],
                    ['optipng', { optimizationLevel: 5 }],
                    ['pngquant', { quality: [0.6, 0.8] }]
                ],
              },
            },
          }),
        ],
    },
    plugins: [
        new CopyPlugin({
          patterns: [
            { from: "./src/assets/images", to: "images" },
            { from: 'src/spritesheets', to: 'spritesheets' },
          ],
        }),
    ],
};  
