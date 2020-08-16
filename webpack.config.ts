import * as webpack from "webpack";
import * as path from "path";
import TerserPlugin from "terser-webpack-plugin";
import copyWebpackPlugin from "copy-webpack-plugin";

const config: webpack.Configuration = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        server: './server.ts',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                sourceMap: false,
                terserOptions: {
                    output: {
                        comments: false
                    },
                    compress: true,
                    keep_fnames: true
                },
                extractComments: false
            })
        ]
    },
    plugins: [
        new copyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' }
            ]
        })
    ],
    target: 'node',
    node: {
        __dirname: false
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js',
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: "tsconfig.json"
                    }
                }]
            }
        ]
    },
    devtool: false
}

export default config;