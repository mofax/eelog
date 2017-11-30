"use strict";

/**
 * loops through the middleware, calling them with the data and next
 *
 * @param {[]} list - the list of middlewares
 * @param {Object} data - the data we are passing into the middleware
 * @param {number} index - the index, of the middleware we want to call, on the list
 */
export function next(list: any[], data: any, index: number) {
  // we only need to call if the index in there
  if (index >= list.length) {
    return;
  }

  let fn = list[index];
  let result = fn.call(null, data, function nextCallback() {
    next(list, data, index + 1);
  });
}

/**
 * fast format - https://github.com/knowledgecode/fast-format
 */
export function format(...args: any[]) {
  var i,
    len,
    argc = args.length,
    format = args[0],
    v = (format + "").split("%s"),
    r = argc ? v[0] : "";
  for (i = 1, len = v.length, argc--; i < len; i++) {
    r += (i > argc ? "%s" : arguments[i]) + v[i];
  }
  return r;
}
