'use strict';

let Eelog = require('../lib/eelog');

let log = new Eelog({});

log.use(function middleware(data, next) {
    console.log('\n\nyaay! we\'re using a middleware');
    console.log(data);
    next();
});

log.info('yes! it is logging');
log.debug({ meta:'object', foo:'bar' }, 'logging object meta');
log.error(new Error('this is a baad error!'));