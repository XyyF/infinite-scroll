import {isDefined} from './types'

/**
 * 获取元素的style值
 * @param {Element} el DOM元素
 * @param {String} styleName 属性名
 */
export const getStyle = (el, styleName) => {
    if (!el || !styleName) return null
    try {
        // getComputedStyle至少需要一个参数，否则会报错
        // 使用document.defaultView是因为在firefox3.6中访问子框架iframe必须
        // 其他情况可以使用window.getComputedStyle
        const computed = document.defaultView.getComputedStyle(el, '')
        return el.style[styleName] || computed ? computed[styleName] : null
    } catch (e) {
        return el.style[styleName]
    }
}

/**
 * 判断元素是否是可滚动元素
 * @param {Element} el DOM元素
 * @param {Boolean} vertical 是否是垂直滚动
 */
export const isScroll = (el, vertical) => {
    // 明确定义了vertical
    const determinedDirection = isDefined(vertical)
    const overflow = determinedDirection
        ? vertical
            ? getStyle(el, 'overflow-y')
            : getStyle(el, 'overflow-x')
        : getStyle(el, 'overflow')
    // 属性值是scroll或者auto
    return /(scroll|auto)/.test(overflow)
};

export const getScrollContainer = (el, vertical) => {
    let parent = el
    // 循环遍历DOM，直到找到距离el最近的滚动元素
    // null -> document -> html -> body -> ....
    while (parent) {
        // 如果是html 、 document 获取window(window会导致后面流程失败)
        if ([document, document.documentElement, window].includes(parent)) {
            return document.body
        }
        // 如果该元素是滚动元素
        if (isScroll(parent, vertical)) {
            return parent
        }
        parent = parent.parentNode
    }

    return parent
};
