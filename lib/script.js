import { readFileSync } from "fs";
import { dirname } from "path";
import vm from "vm";
import { createResolve, getKicadPath } from "./path.js";
import { Project } from "./project.js";
export class Script {
    constructor(scriptPath) {
        this.scriptPath = scriptPath;
        this.code = readFileSync(scriptPath).toString();
        const path = dirname(scriptPath);
        this.project = new Project(getKicadPath(), path);
        this._resolve = createResolve(path);
    }
    resolve(...args) {
        return this._resolve(...args);
    }
    async run() {
        const context = { project: this.project };
        vm.createContext(context);
        const script = new vm.Script(this.code);
        return await script.runInContext(context);
    }
}
//# sourceMappingURL=script.js.map