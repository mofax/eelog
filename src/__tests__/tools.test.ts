import * as os from "os";
import { logFormat, logLevels } from "../tools";

describe("tools", () => {
    it("has the right logLevels", () => {
        const levels = ["verb", "debug", "info", "warn", "error", "fatal"];
        expect(levels.length).toEqual(Object.keys(logLevels).length);
        levels.forEach((level, index) => {
            expect(logLevels[level]).toEqual(index + 1); // array indexes start at 0
        });
    });

    it("logFormat", () => {
        const meta = {
            color: "red",
            msg: "This message",
            name: "test",
            pid: 1746,
            timestamp: "2019-10-27T10:29:22.279Z",
        };
        const expected = "color=red msg=This message name=test pid=1746 timestamp=2019-10-27T10:29:22.279Z";
        const str = logFormat(meta);
        expect(str).toEqual(expected);
    });
});
