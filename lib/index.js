'use strict';

let util = require('util');
let EventEmitter = require('events').EventEmitter;
let obj = {};

function merge(source, to) {
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            to[key] = source[key];
        }
    }
}

function goConsole(options) {
    options.level = options.level || 'log';
    let predefined = ['name', 'pid', 'level', 'timestamp', 'message'],
    other = '(';
    for (let key in options) {
        if (options.hasOwnProperty(key)) {
            if (predefined.indexOf(key) === -1) {
                other += util.format(' %s:%s, ', key, options[key]);
            }
        }
    }
    other += ')'
    let toLog = util.format('[%s] [%s] %s', options.level, options.timestamp, options.message) + ' ' + other;
    console[options.level].call(null, toLog);
}

obj.log = function log(level, meta, msg) {
    let options = this.options
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

function Logger(options) {
    if (!(this instanceof Logger)) {
        return new Logger(options);
    }

    const allowedLevels = ['verb', 'debug', 'info', 'warn', 'error', 'fatal'];
    options = options | {};
    let context = this;
    context.options = options;

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

                obj.log.call(context, level, meta, util.format.apply(null, args.slice(1, args.length)));
            }
        }
    }

    return obj;
}

util.inherits(Logger, EventEmitter);
module.exports = Logger;
