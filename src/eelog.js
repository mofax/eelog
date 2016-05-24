'use strict';

import { consoleTransport } from './transports';
import { next, format } from './tools';

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
                // check if a level is set, and only run items above that level
                if (this.options.level) {
                    let index = allowedLevels.indexOf(this.options.level);
                    let myIndex = allowedLevels.indexOf(level);

                    if (index > myIndex) {
                        return void 0;
                    }
                }
                
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