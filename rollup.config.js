const path = require('path')
// 它会将CommonJS模块转换为ES6来为Rollup获得兼容
const cjs = require('rollup-plugin-commonjs')
// 该插件会允许加载在 node_modules中的第三方模块
const node = require('rollup-plugin-node-resolve')
const globals = require('rollup-plugin-node-globals')
const builtins = require('rollup-plugin-node-builtins')
const babel = require('rollup-plugin-babel')

const resolve = p => path.resolve(__dirname, './', p)

export default {
    input: resolve('src/main.js'),
    plugins: [
        node(),
        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        }),
        cjs(),
        globals(),
        builtins(),
    ],
    output: {
        name: 'InfiniteScroll',
        file: resolve('lib/infinite-scroll.umd.js'),
        format: 'umd',
        globals: {
            InfiniteScroll: 'InfiniteScroll'
        },
    },
    onwarn(warning, warn) {
        if (warning.code !== 'CIRCULAR_DEPENDENCY') {
            // this sends the warning back to Rollup's internal warning handler
            warn(warning);
        }
    },
};