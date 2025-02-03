import { Project } from "./project.js";
import type { ResolveFunc } from "./path.js";
export declare class Script {
    readonly scriptPath: string;
    readonly code: string;
    readonly project: Project;
    readonly _resolve: ResolveFunc;
    constructor(scriptPath: string);
    resolve(...args: Array<string>): string;
    run(): Promise<any>;
}
//# sourceMappingURL=script.d.ts.map