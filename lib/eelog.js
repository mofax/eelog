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

    let fn = list[index];
    let result = fn.call(null, data, function nextCallback() {
        next(list, data, index + 1);
    });
}

/**
 * fast format - https://github.com/knowledgecode/fast-format
 */
function format(format) {
    var i, len, argc = arguments.length, v = (format + '').split('%s'), r = argc ? v[0] : '';
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
    let options = JSON.parse(JSON.stringify(logData)); // we are deep cloning logData so that we don't modify the original
    let log = console[logData.level] || console['info'];
    let predefined = ['name', 'pid', 'level', 'timestamp', 'message'];
    let other = '(';

    let optionKeys = Object.keys(options);
    optionKeys.forEach(key => {
        if (predefined.indexOf(key) === -1) {
            other = other + format(' %s:%s, ', key, options[key]);
        }
    });

    other += ')';

    other = other === '()' ? '' : other; // if there was nothing, avoid the brackets

    let toLog = format('%s [%s] %s', options.level, options.timestamp, options.message) + ' ' + other;

    log.call(null, toLog);
    next();
}

/**
 * defines Eelog class
 */
class Eelog {
    /**
     * creates an instance of Eelog
     * 
     * @param {Object} options - an object of options on setting up the instance
     * @constructor
     */
    constructor(options) {
        const allowedLevels = ['verb', 'debug', 'info', 'warn', 'error', 'fatal'];
        let ctx = this;

        this.options = options || {};
        this.middleware = [];

        // if console logging isnt explicitly turned off, then do use the console transport
        if (!(this.options.console === false)) {
            this.use(consoleTransport);
        }

        // set up the log level functions
        allowedLevels.forEach(level => {
            ctx[level] = function logLevel(meta, msg) {

                // if an error object was passed, print the stack trace
                if (meta instanceof Error) {
                    ctx.logger(level, {}, meta.stack);
                    return;
                }

                let args = Array.prototype.slice.call(arguments);
                if (typeof (meta) === 'string') {
                    ctx.logger(level, {}, format.apply(null, args));
                } else if (typeof (meta) === 'object' && !Array.isArray(meta)) {
                    if (typeof (msg) !== 'string') {
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
    logger(level, _meta, message) {
        let meta = JSON.parse(JSON.stringify(_meta));

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
    use(middleware) {
        if (typeof (middleware) !== 'function') {
            throw new Error(`middlewares are expected to be functions found ${typeof (middleware)}`);
        }

        this.middleware.push(middleware);
    }

}

export default Eelog;