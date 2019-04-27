const fs = require("fs");

// 计时
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const nodeModules = {};
fs.readdirSync("node_modules")
    .filter(function (x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = "commonjs " + mod;
    });

let config = {
    entry: {
        "Deploy": "./src"
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             Commons: {
    //                 name: "common", // 
    //                 chunks: 'all', // 模式
    //                 priority: 0,
    //                 minChunks: 2 //最少引用次数，提取
    //                 // test 范围，路径，正则表达式
    //                 // priority 优先级
    //                 // minSize 最小尺寸
    //             },
    //             vendor: {
    //                 chunks: "all",
    //                 test: path.resolve(__dirname, "node_modules"),
    //                 name: "vendor",
    //                 enforce: true
    //             }
    //         }
    //     }
    // },
    output: {
        path: __dirname + "/build",
        filename: "[name].js",
        library: "Deploy",
        libraryTarget: "commonjs",
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
    },
    node: {
        fs: 'empty',
        child_process: 'empty',
        tls: 'empty',
        net: 'empty'
    },
    devtool: "cheap-source-map",
    target: "node",
    externals: nodeModules
};

module.exports = smp.wrap(config);