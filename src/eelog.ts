import { buildMeta, logFormat, logLevels } from "./tools";

function leveler(level: string, msg: string, data: any) {
    const meta = buildMeta(this.name, `"${msg}"`, data);
    const str = logFormat(meta);
    const levelNumber = logLevels[level];
    if (this.console === true) {
        /* tslint:disable:no-console */
        const func = levelNumber > 3 ? console.error : console.log;
        /* tslint:enable:no-console */
        func(str);
    }
}

export interface IOptions {
    console?: boolean;
    name?: string;
    level?: string;
}

class EeLogger {
    public options: IOptions;

    constructor(options: IOptions) {
        const defaultOptions = {
            console: false,
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
