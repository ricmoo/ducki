import fs from "fs";
import { dirname, join, resolve as _resolve } from "path";

import { run } from "./run.js";


import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));


export function resolve(...path: Array<string>): string {
    return _resolve(__dirname, "..", ...path);
}

export interface RenderXYZ {
    x?: number,
    y?: number,
    z?: number
}

export interface RenderSize {
    height?: number,
    width?: number
}

export interface RenderOptions {
    perspective?: boolean,
    zoom?: number,

    pan?: RenderXYZ,
    rotate?: RenderXYZ,
    pivot?: RenderXYZ,

    size?: RenderSize
}

function flatXYZ(xyz?: RenderXYZ): string {
    if (xyz == null) { return "0,0,0"; }

    return "'" + [
        String(xyz.x || 0),
        String(xyz.y || 0),
        String(xyz.z || 0),
    ].join(",") + "'";
}

function normalizeSize(size?: RenderSize): { width: number, height: number } {
    if (size == null) { return { width: 512, height: 512 }; }
    let { width, height } = size;
    if (width != null) {
        if (height == null) { height = width; }
    } else if (height == null) {
        if (width == null) { width = height; }
    }
    if (width == null) { width = 512; }
    if (height == null) { height = 512; }

    return { width, height };
}

function searchDir(folder: string, ext: string): Array<string> {
    ext = "." + ext;

    const result: Array<string> = [ ];
    for (const filename of fs.readdirSync(folder)) {
        if (filename[0] !== "_" && filename[0] !== "." &&
          filename.endsWith(ext)) { result.push(filename); }
    }
    return result;
}

export class Project {
    readonly cmd: string;
    readonly projectFolder: string;

    constructor(cmd: string, projectFolder: string) {
        this.cmd = resolve(cmd);
        this.projectFolder = projectFolder;
    }

    _searchDir(ext: string): Array<string> {
        return searchDir(this.projectFolder, ext);
    }

    get projectFilename(): string {
        const files = this._searchDir("kicad_pro");

        if (files.length === 0 ) {
            throw new Error(`No project file found in ${ JSON.stringify(this.projectFolder)}`);
        }

        if (files.length > 1) {
            throw new Error(`Too many project files found in ${ JSON.stringify(this.projectFolder)}`);
        }

        return join(this.projectFolder, files[0]);;
    }

    get pcbFilename(): string {
        const files = this._searchDir("kicad_pcb");

        if (files.length === 0 ) {
            throw new Error(`No PCB file found in ${ JSON.stringify(this.projectFolder)}`);
        }

        if (files.length > 1) {
            throw new Error(`Too many PCB files found in ${ JSON.stringify(this.projectFolder)}`);
        }

        return join(this.projectFolder, files[0]);;

    }

    render(options?: RenderOptions, filename?: string): void {
        if (options == null) { options = { }; }
        if (filename == null) { filename = "temp-output.png"; }
        filename = _resolve(this.projectFolder, filename);
        if (!filename.endsWith(".png") && !filename.endsWith(".jpg")) {
            throw new Error("Invalid image filename");
        }

        console.log("GENERATING:", filename);

        const args: Array<string> = [
            "pcb", "render", "--output", filename
        ];

        if (options.perspective) { args.push("--perspective"); }
        if (options.zoom) { args.push("--zoom", String(options.zoom)); }
        if (options.pivot) { args.push("--pivot", flatXYZ(options.pivot)); }
        if (options.rotate) { args.push("--rotate", flatXYZ(options.rotate)); }
        if (options.pan) { args.push("--pan", flatXYZ(options.pan)); }

        const size = normalizeSize(options.size);
        args.push("--width", String(size.width));
        args.push("--height", String(size.height));

        args.push(this.pcbFilename);

        const result = run(this.cmd, args);

        if (result.stdout.indexOf("Successfully created 3D render image") === -1) {
            console.log({
                args,
                status: result.status,
                stdout: result.stdout,
                stderr: result.stderr
            });
            throw new Error("Failed to render PCB");
        }

    }
}
