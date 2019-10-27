import * as os from "os";

/* tslint:disable:object-literal-sort-keys */
export const logLevels: { [index: string]: number } = {
    verb: 1,
    debug: 2,
    info: 3,
    warn: 4,
    error: 5,
    fatal: 6,
};

export function logFormat(meta: any) {
    const keys = Object.keys(meta);
    const strs = [];
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (meta.hasOwnProperty(key)) {
            strs.push(`${key}=${meta[key]}`);
        }
    }
    return strs.join(" ");
}

export function buildMeta(name: string, msg: string, data: any) {
    const meta = {
        msg,
        timestamp: new Date().toISOString(),
        hostname: os.hostname(),
        name,
        pid: process.pid,
        ...data,
    };
    return meta;
}
