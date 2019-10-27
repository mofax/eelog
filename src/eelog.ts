import { buildMeta, logFormat, logLevels } from './tools'

function leveler(level: string, msg: string, data: any) {
    const meta = buildMeta(this.name, `"${msg}"`, data)
    const str = logFormat(meta);
    const levelNumber = logLevels[level]
    const func = levelNumber > 3 ? console.error : console.log;
    func(str);
}

export interface Options {
    console?: boolean,
    name?: string,
    level?: string
}

class EeLogger {
    options: Options

    constructor(options: Options) {
        const defaultOptions = {
            console: true,
            name: 'eelog',
            level: 'info'
        };

        this.options = { ...defaultOptions, ...options };
    }
    _pass(logLevel: string, message: string, context: any) {
        return leveler.apply(this.options, [logLevel, message, context]);
    }
    verb(message: string, context?: any) {
        return this._pass("verb", message, context);
    }
    debug(message: string, context?: any) {
        return this._pass("debug", message, context);
    }
    info(message: string, context?: any) {
        return this._pass("info", message, context);
    }
    warn(message: string, context?: any) {
        return this._pass("warn", message, context);
    }
    error(message: string, context?: any) {
        return this._pass("error", message, context);
    }
    fatal(message: string, context?: any) {
        return this._pass("fatal", message, context);
    }
}

export default EeLogger;