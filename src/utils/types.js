export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}

export const isFunction = (fn) => {
  return fn && Object.prototype.toString.call(fn) === '[object Function]';
}