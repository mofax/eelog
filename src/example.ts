"use strict";

import Eelog from "./eelog";

const log = new Eelog({
    console: true,
});

log.info("yes! it is logging");
log.debug("logging object meta", { calling: "autobots", who: "optimus" });
log.error("this is a baad error!");

const log1 = new Eelog({});
log1.info("console is not set to true, will not print");

const log2 = new Eelog({
    console: true,
    level: "info",
});

log2.info("\n log2 \n");
log2.info("this is level info, should print");
log2.debug("debug is below info level, therefore is disabled");
log2.error("this is an error");
log2.info("this is level info, should print", { gray: "goose" });

// let log3 = new Eelog({
//     console: "json"
// });

// console.log("\njson style loggin here \n");

// log3.info("this is level info, should print");
// log3.debug("debug is below info level, therefore is disabled");
// log3.error("this is an error %s", "string");
// log3.info({ gray: "goose" }, "this is level info, should print");
