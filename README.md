# eelog

eelog is a simple logger for node.js

## usage
```javascript
let Eelog = require('eelog');

function saveToMongoDb(loggedData) {
    /**
     * expect loggedData to be an object
     * eg. {
                level:'info',
                'message': 'this is a log',
                'timestamp': '2016-02-29T07:58:22.339Z',
            }
     */

    mongo.insert(loggedData).then(() => {
        // do something
    }).then((err) => {
        // catch it
    });
}

let options = {
    console:true, // toggle logging to console
    transports: [saveToMongoDb] // transports allow you to take the logged data somewhere else
}

let log = Eelog(options);

log.info('this is a log');
log.info('this is a log with %s and %s', 1, 48);
log.info({data:'foo'}, 'this is a log with data:foo and %s %s', 1, 48);
```
