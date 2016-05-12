# eelog

eelog is a zero dependency, middleware based logging library for node.js and the browser

## usage
```javascript
import Eelog from 'eelog';

function saveToMongoDb(loggedData, next) {
    /**
     * expect loggedData to be an object
     * eg. {
                level:'info',
                'message': 'this is a log',
                'timestamp': '2016-02-29T07:58:22.339Z',
            }
     */

    mongo.insert(loggedData).then(() => {
        next() // call the next middleware
    }).then((err) => {
        // catch it
    });
}

let options = {
    console:true, // toggle logging to console
}

let log = new Eelog(options);

// register saveToMongoDb middleware
log.use(saveToMongoDb)

// now we can start logging
log.info('this is a log');
log.info('this is a log with %s and %s', 1, 48);
log.info({data:'foo'}, 'this is a log with data:foo and %s %s', 1, 48);
```
