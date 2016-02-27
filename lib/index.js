'use strict';

let util = require('util');
let EventEmitter = require('events').EventEmitter;

function merge(source, to) {
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            to[key] = source[key];
        }
    }
}

function goConsole(options) {
    options.level = options.level || 'log';
    let toLog = util.format('[%s] [%s] %s', options.level, options.timestamp, options.message);
    console[options.level].call(null, toLog);
}

function Logger(options) {
    let obj = {};
    const allowedLevels = ['verb', 'debug', 'info', 'warn', 'error', 'fatal'];
    options = options | {};

    if (!this instanceof Logger) {
        return new Logger(options);
    }

    obj.log = function log(level, meta, msg) {
        meta.name = options.name;
        meta.pid = process.pid;
        meta.timestamp = new Date().toISOString();
        meta.level = level
        meta.message = msg;

        if (options.console !== false) {
            goConsole(meta);
        }

        if (Array.isArray(options.transports)) {
            for (let index in options.transports) {
                if (typeof(options.transports[index]) !== 'function') {
                    throw new Error('expecting transport to be a function');
                }
                options.transports[index](meta);
            }
        }
    }

    for (let index in allowedLevels) {
        let level = allowedLevels[index];
        obj[level] = function genLogger(meta, msg) {
            let args = Array.prototype.slice.call(arguments);
            if (typeof(meta) === 'string') {
                obj.log(level, {}, util.format.apply(null, args));

            } else if (typeof(meta) === 'object' && !Array.isArray(meta)) {
                if (typeof(msg) !== 'string') {
                    throw new Error('you did not provide a message to log...');
                }

                obj.log(level, meta, util.format.apply(null, args.slice(1, args.length)));
            }
        }
    }

    return obj;
}

util.inherits(Logger, EventEmitter);
module.exports = Logger;
