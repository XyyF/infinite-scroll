import throttle from 'throttle-debounce/debounce';
import {
    isHtmlElement,
    isFunction,
} from './utils/types';
import {
    getScrollContainer
} from './utils/dom';

const scope = 'InfiniteScroll';

const attributes = {
    delay: 200,
    distance: 0,
    disabled: false,
    immediate: true,
};

const getPositionSize = (el, prop) => {
    return el === window || el === document
        ? document.documentElement[prop]
        : el[prop];
};

const getOffsetHeight = el => {
    return getPositionSize(el, 'offsetHeight');
};

const getClientHeight = el => {
    return getPositionSize(el, 'clientHeight');
};

const getElementTop = el => el.getBoundingClientRect().top;

const getStyleComputedProperty = (element, property) => {
    if (element === window) {
        element = document.documentElement;
    }

    if (element.nodeType !== 1) {
        return [];
    }
    // NOTE: 1 DOM access here
    const css = window.getComputedStyle(element, null);
    return property ? css[property] : css;
};

const getScrollOptions = (el, options) => {
    if (!isHtmlElement(el)) return {};

    return Object.assign({}, attributes, options)
};

const handleScroll = function(cb) {
    const { el, vm, options, container, observer } = this[scope];
    const { distance, disabled } = getScrollOptions(el, options);

    if (disabled) return;

    let shouldTrigger = false;

    if (container === el) {
        // be aware of difference between clientHeight & offsetHeight & window.getComputedStyle().height
        const scrollBottom = container.scrollTop + getClientHeight(container);
        shouldTrigger = container.scrollHeight - scrollBottom <= distance;
    } else {
        const heightBelowTop = getOffsetHeight(el) + getElementTop(el) - getElementTop(container);
        const offsetHeight = getOffsetHeight(container);
        const borderBottom = Number.parseFloat(getStyleComputedProperty(container, 'borderBottomWidth'));
        shouldTrigger = heightBelowTop - offsetHeight + borderBottom <= distance;
    }

    if (shouldTrigger && isFunction(cb)) {
        cb.call(vm);
    } else if (observer) {
        observer.disconnect();
        this[scope].observer = null;
    }

};

export default {
    init(el, callback, options) {
        const vm = this;
        const container = getScrollContainer(el, true);
        const { delay, immediate } = getScrollOptions(el, options);
        const onScroll = throttle(delay, handleScroll.bind(el, callback));

        el[scope] = { el, vm, container, onScroll, options };

        if (container) {
            container.addEventListener('scroll', onScroll);

            if (immediate) {
                const observer = el[scope].observer = new MutationObserver(onScroll);
                observer.observe(el, { childList: true, subtree: true });
                onScroll();
            }
        }
    }
}