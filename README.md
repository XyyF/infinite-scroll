## Infinite-scroll 无限滚动

demo

npm run build:rollup

see test/test.html

`
/**
 * {Element} el DOM元素
 * {Function} callback 滚动到底部的回调
 * {Object} options
 * {Boolean false} options.disabled 是否禁用
 * {Boolean true} options.immediate 立即生效
 * {Number 0} options.distance 滚动条距离底部的高度多少时，执行回调
 * {Number 200} options.delay 延时
*/
window.InfiniteScroll.init(el, callback, options)
`