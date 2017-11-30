"use strict";

import Eelog from "./eelog";

let log = new Eelog({});

log.use(function middleware(data: any, next: any) {
  console.log("\n\nyaay! we're using a middleware");
  next();
});

log.info("yes! it is logging");
log.debug({ meta: "object", foo: "bar" }, "logging object meta");
log.error(new Error("this is a baad error!"));

///

let log2 = new Eelog({});

console.log("\n");

log2.info("this is level info, should print");
log2.debug("debug is below info level, therefore is disabled");
log2.error("this is an error");