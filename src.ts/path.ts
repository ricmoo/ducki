
import fs from "fs";
import { homedir } from "os";
import { dirname, join, resolve as _resolve } from "path";

import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));


export type ResolveFunc = (...args: Array<string>) => string;

export function createResolve(basePath: string): ResolveFunc {
    return function(...args: Array<string>): string {
        return _resolve(basePath, ...args);
    };
}

const baseResolve = createResolve(join(__dirname, ".."));
export function resolve(...args: Array<string>): string {
    return baseResolve(...args);
}

const Paths = [
    join(homedir(), ".ducki/Kicad/KiCad.app/Contents/MacOS/kicad-cli"),
    baseResolve("third-party/Kicad/KiCad.app/Contents/MacOS/kicad-cli"),
];

const OK = fs.constants.F_OK | fs.constants.R_OK | fs.constants.X_OK;
export function getKicadPath(): string {
    for (const path of Paths) {
        try {
            fs.accessSync(path, OK);
        } catch (e) { continue; }
        return path;
    }

    throw new Error("No Kicad detected.");
}
