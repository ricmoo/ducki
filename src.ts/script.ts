import { readFileSync } from "fs";
import { dirname } from "path";
import vm from "vm";

import { createResolve, getKicadPath } from "./path.js";
import { Project } from "./project.js"

import type { ResolveFunc } from "./path.js";


export class Script {
    readonly scriptPath: string;
    readonly code: string;
    readonly project: Project;

    readonly _resolve: ResolveFunc;

    constructor(scriptPath: string) {
        this.scriptPath = scriptPath;
        this.code = readFileSync(scriptPath).toString();

        const path = dirname(scriptPath);
        this.project = new Project(getKicadPath(), path);
        this._resolve = createResolve(path);
    }

    resolve(...args: Array<string>): string {
        return this._resolve(...args);
    }

    async run(): Promise<any> {
        const context = { project: this.project };
        vm.createContext(context);

        const script = new vm.Script(this.code);
        return await script.runInContext(context);
    }
}
