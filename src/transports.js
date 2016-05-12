'use strict';

import { format } from './tools';


/**
 * an eelog transport that prints to the console
 *
 * @param {object} logData - object passed in from eelog
 * @return {null}
 */

export function consoleTransport(logData, next) {
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