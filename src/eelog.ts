import { Writable } from "stream";
import { buildMeta, logFormat, logLevels } from "./tools";

function logStringCreator(meta: any, format: string): string {
    switch (format) {
        case "logfmt":
            return logFormat(meta);
        case "json": {
            return JSON.stringify(meta);
        }
        default:
            throw new Error(`eelog: format ${format} is not supported`);
    }
}

function leveler(level: string, msg: string, data: any) {
    const levelNumber = logLevels[level];
    if (levelNumber < logLevels[this.level]) { return; }

    const meta = buildMeta(this.name, `"${msg}"`, data);
    const str = logStringCreator(meta, this.format)

    if (this.canStream === true) {
        this.stream.write(str + "\n");
    }
    if (this.console === true) {
        /* tslint:disable:no-console */
        const func = levelNumber > 3 ? console.error : console.log;
        /* tslint:enable:no-console */
        func(str);
    }
}

export interface IOptions {
    console?: boolean;
    format?: string;
    name?: string;
    level?: string;
    canStream?: boolean;
    stream?: Writable;
}

class EeLogger {
    public options: IOptions;

    constructor(options: IOptions) {
        const defaultOptions = {
            console: false,
            format: "logfmt",
            level: "info",
            name: "eelog",
        };

        this.options = { ...defaultOptions, ...options };
    }
    public _pass(logLevel: string, message: string, context: any) {
        return leveler.apply(this.options, [logLevel, message, context]);
    }
    public verb(message: string, context?: any) {
        return this._pass("verb", message, context);
    }
    public debug(message: string, context?: any) {
        return this._pass("debug", message, context);
    }
    public info(message: string, context?: any) {
        return this._pass("info", message, context);
    }
    public warn(message: string, context?: any) {
        return this._pass("warn", message, context);
    }
    public error(message: string, context?: any) {
        return this._pass("error", message, context);
    }
    public fatal(message: string, context?: any) {
        return this._pass("fatal", message, context);
    }
}

export default EeLogger;
