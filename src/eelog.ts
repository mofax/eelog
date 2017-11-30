"use strict";

import { consoleTransport } from "./transports";
import { next, format } from "./tools";

export type EelogOptions = {
  console?: boolean;
  name?: string;
};

/**
 * defines Eelog class
 */
class Eelog {
  middleware: Function[];
  options: EelogOptions;
  /**
   * creates an instance of Eelog
   *
   * @param {Object} options - an object of options on setting up the instance
   * @constructor
   */
  constructor(options: EelogOptions = {}) {
    const allowedLevels = ["verb", "debug", "info", "warn", "error", "fatal"];
    let ctx = this;

    this.options = options;
    this.middleware = [];

    // if console logging isnt explicitly turned off, then do use the console transport
    if (!(this.options.console === false)) {
      this.use(consoleTransport);
    }
  }
  verb(...args: any[]) {
    this.leveler("verb", ...args);
  }
  debug(...args: any[]) {
    this.leveler("debug", ...args);
  }
  info(...args: any[]) {
    this.leveler("info", ...args);
  }
  warn(...args: any[]) {
    this.leveler("warn", ...args);
  }
  error(...args: any[]) {
    this.leveler("error", ...args);
  }
  fatal(...args: any[]) {
    this.leveler("fatal", ...args);
  }
  leveler(level: string, ...args: any[]) {
    // let level: string = args[0];
    let meta = args[0];
    let msg = args[1];
    // if an error object was passed, print the stack trace
    if (meta instanceof Error) {
      this.logger(level, {}, meta.stack);
      return;
    }
    if (typeof meta === "string") {
      this.logger(level, {}, format.apply(null, args));
    } else if (typeof meta === "object" && !Array.isArray(meta)) {
      if (typeof msg !== "string") {
        throw new Error("you did not provide a message to log...");
      }

      this.logger(level, meta, format.apply(null, args.slice(1, args.length)));
    }
  }

  /**
   * default logger, gets called for all log levels
   */
  logger(level: string, _meta: { [key: string]: any }, message: string) {
    let meta = Object.assign({}, _meta);

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
  use(middleware: Function) {
    if (typeof middleware !== "function") {
      throw new Error(
        `middlewares are expected to be functions found ${typeof middleware}`
      );
    }

    this.middleware.push(middleware);
  }
}

export default Eelog;
