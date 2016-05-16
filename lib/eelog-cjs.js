'use strict';

var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

/**
 * loops through the middleware, calling them with the data and next
 * 
 * @param {[]} list - the list of middlewares
 * @param {Object} data - the data we are passing into the middleware
 * @param {number} index - the index, of the middleware we want to call, on the list
 */

function next(list, data, index) {
    // we only need to call if the index in there
    if (index >= list.length) {
        return;
    }

    var fn = list[index];
    var result = fn.call(null, data, function nextCallback() {
        next(list, data, index + 1);
    });
}

/**
 * fast format - https://github.com/knowledgecode/fast-format
 */
function format(format) {
    var i,
        len,
        argc = arguments.length,
        v = (format + '').split('%s'),
        r = argc ? v[0] : '';
    for (i = 1, len = v.length, argc--; i < len; i++) {
        r += (i > argc ? '%s' : arguments[i]) + v[i];
    }
    return r;
}

/**
 * an eelog transport that prints to the console
 *
 * @param {object} logData - object passed in from eelog
 * @return {null}
 */

function consoleTransport(logData, next) {
    var options = JSON.parse(JSON.stringify(logData)); // we are deep cloning logData so that we don't modify the original
    var log = console[logData.level] || console['info'];
    var predefined = ['name', 'pid', 'level', 'timestamp', 'message'];
    var other = '(';

    var optionKeys = Object.keys(options);
    optionKeys.forEach(function (key) {
        if (predefined.indexOf(key) === -1) {
            other = other + format(' %s:%s, ', key, options[key]);
        }
    });

    other += ')';

    other = other === '()' ? '' : other; // if there was nothing, avoid the brackets

    var toLog = format('%s [%s] %s', options.level, options.timestamp, options.message) + ' ' + other;

    log.call(null, toLog);
    next();
}

/**
 * defines Eelog class
 */

var Eelog = function () {
    /**
     * creates an instance of Eelog
     * 
     * @param {Object} options - an object of options on setting up the instance
     * @constructor
     */

    function Eelog(options) {
        babelHelpers.classCallCheck(this, Eelog);

        var allowedLevels = ['verb', 'debug', 'info', 'warn', 'error', 'fatal'];
        var ctx = this;

        this.options = options || {};
        this.middleware = [];

        // if console logging isnt explicitly turned off, then do use the console transport
        if (!(this.options.console === false)) {
            this.use(consoleTransport);
        }

        // set up the log level functions
        allowedLevels.forEach(function (level) {
            ctx[level] = function logLevel(meta, msg) {

                // if an error object was passed, print the stack trace
                if (meta instanceof Error) {
                    ctx.logger(level, {}, meta.stack);
                    return;
                }

                var args = Array.prototype.slice.call(arguments);
                if (typeof meta === 'string') {
                    ctx.logger(level, {}, format.apply(null, args));
                } else if ((typeof meta === 'undefined' ? 'undefined' : babelHelpers.typeof(meta)) === 'object' && !Array.isArray(meta)) {
                    if (typeof msg !== 'string') {
                        throw new Error('you did not provide a message to log...');
                    }

                    ctx.logger(level, meta, format.apply(null, args.slice(1, args.length)));
                }
            };
        });
    }

    /**
     * default logger, gets called for all log levels
     */


    babelHelpers.createClass(Eelog, [{
        key: 'logger',
        value: function logger(level, _meta, message) {
            var meta = JSON.parse(JSON.stringify(_meta));

            meta.name = this.options.name;
            meta.pid = process.pid;
            meta.timestamp = new Date().toISOString();
            meta.level = level;
            meta.message = message;

            // now that we're all set up, run the stuff through the middleware
            next(this.middleware, meta, 0);
        }

        /**
         * adds a middleware to the existing list of middleware
         * 
         * @param {function} middleware - a callback that will be called for all logging
         */

    }, {
        key: 'use',
        value: function use(middleware) {
            if (typeof middleware !== 'function') {
                throw new Error('middlewares are expected to be functions found ' + (typeof middleware === 'undefined' ? 'undefined' : babelHelpers.typeof(middleware)));
            }

            this.middleware.push(middleware);
        }
    }]);
    return Eelog;
}();

module.exports = Eelog;