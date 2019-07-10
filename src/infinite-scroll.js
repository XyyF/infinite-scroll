import throttle from 'throttle-debounce/debounce'

import {isFunction, isHtmlElement} from './utils/types'
import {getScrollContainer, getStyle} from './utils/dom'

const scope = 'InfiniteScroll'

const attributes = {
    delay: 200,
    distance: 0,
    disabled: false,
    immediate: true,
}

const getOffsetHeight = el => el.offsetHeight

const getClientHeight = el => el.clientHeight

const getElementTop = el => el.getBoundingClientRect().top;

const getStyleComputedProperty = (el, property) => {
    // 如果节点不是element node
    if (el.nodeType !== 1) return []
    // 获取样式属性值
    return getStyle(el, property)
};

/**
 * 获取scroll配置
 * {Element} el DOM元素
 * {Object} options 外部配置项
 */
const getScrollOptions = (el, options) => {
    if (!isHtmlElement(el)) return {};
    return Object.assign({}, attributes, options)
}

/**
 * 滚动事件
 * {Function} callback 滚动到底部的回调
 */
const handleScroll = function (cb) {
    const {el, vm, options, container, observer} = this[scope]
    const {distance, disabled} = getScrollOptions(el, options)

    if (disabled) return

    let shouldTrigger = false

    if (container === el) {
        const scrollBottom = container.scrollTop + getClientHeight(container)
        shouldTrigger = container.scrollHeight - scrollBottom <= distance
    } else {
        const heightBelowTop = getOffsetHeight(el) + getElementTop(el) - getElementTop(container)
        const offsetHeight = getOffsetHeight(container)
        const borderBottom = parseFloat(getStyleComputedProperty(container, 'borderBottomWidth'))
        shouldTrigger = heightBelowTop - offsetHeight + borderBottom <= distance
    }

    if (shouldTrigger && isFunction(cb)) {
        cb.call(vm)
    } else if (observer) {
        observer.disconnect()
        this[scope].observer = null
    }

};

export default {
    /**
     * 初始化
     * {Element} el DOM元素
     * {Function} callback 滚动到底部的回调
     * {Object} options
     */
    init(el, callback, options) {
        const vm = this
        const container = getScrollContainer(el, true)
        // 配置参数
        const {delay, immediate} = getScrollOptions(el, options)
        // 节流
        const onScroll = throttle(delay, handleScroll.bind(el, callback))

        el[scope] = {el, vm, container, onScroll, options}

        if (container) {
            // 监听滚动
            container.addEventListener('scroll', onScroll)

            if (immediate) {
                // 创建并返回一个新的 MutationObserver 它会在指定的DOM发生变化时被调用
                const observer = el[scope].observer = new MutationObserver(onScroll)
                observer.observe(el, {childList: true, subtree: true})
                onScroll()
            }
        }
    }
}