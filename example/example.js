'use strict';

let Eelog = require('../lib/eelog-cjs');

let log = new Eelog({});

log.use(function middleware(data, next) {
    console.log('\n\nyaay! we\'re using a middleware');
    console.log(data);
    next();
});

log.info('yes! it is logging');
log.debug({ meta:'object', foo:'bar' }, 'logging object meta');
log.error(new Error('this is a baad error!'));

///

let log2 = new Eelog({
    level:'info'
});

console.log('\n');

log2.info('this is level info, should print');
log2.debug('debug is below info level, therefore is disabled');
log2.error('this is an error');