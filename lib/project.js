import fs from "fs";
import { dirname, join, resolve as _resolve } from "path";
import { run } from "./run.js";
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export function resolve(...path) {
    return _resolve(__dirname, "..", ...path);
}
function flatXYZ(xyz) {
    if (xyz == null) {
        return "0,0,0";
    }
    return "'" + [
        String(xyz.x || 0),
        String(xyz.y || 0),
        String(xyz.z || 0),
    ].join(",") + "'";
}
function normalizeSize(size) {
    if (size == null) {
        return { width: 512, height: 512 };
    }
    let { width, height } = size;
    if (width != null) {
        if (height == null) {
            height = width;
        }
    }
    else if (height == null) {
        if (width == null) {
            width = height;
        }
    }
    if (width == null) {
        width = 512;
    }
    if (height == null) {
        height = 512;
    }
    return { width, height };
}
function searchDir(folder, ext) {
    ext = "." + ext;
    const result = [];
    for (const filename of fs.readdirSync(folder)) {
        if (filename[0] !== "_" && filename[0] !== "." &&
            filename.endsWith(ext)) {
            result.push(filename);
        }
    }
    return result;
}
export class Project {
    constructor(cmd, projectFolder) {
        this.cmd = resolve(cmd);
        this.projectFolder = projectFolder;
    }
    _searchDir(ext) {
        return searchDir(this.projectFolder, ext);
    }
    get projectFilename() {
        const files = this._searchDir("kicad_pro");
        if (files.length === 0) {
            throw new Error(`No project file found in ${JSON.stringify(this.projectFolder)}`);
        }
        if (files.length > 1) {
            throw new Error(`Too many project files found in ${JSON.stringify(this.projectFolder)}`);
        }
        return join(this.projectFolder, files[0]);
        ;
    }
    get pcbFilename() {
        const files = this._searchDir("kicad_pcb");
        if (files.length === 0) {
            throw new Error(`No PCB file found in ${JSON.stringify(this.projectFolder)}`);
        }
        if (files.length > 1) {
            throw new Error(`Too many PCB files found in ${JSON.stringify(this.projectFolder)}`);
        }
        return join(this.projectFolder, files[0]);
        ;
    }
    render(options, filename) {
        if (options == null) {
            options = {};
        }
        if (filename == null) {
            filename = "temp-output.png";
        }
        filename = _resolve(this.projectFolder, filename);
        if (!filename.endsWith(".png") && !filename.endsWith(".jpg")) {
            throw new Error("Invalid image filename");
        }
        console.log("GENERATING:", filename);
        const args = [
            "pcb", "render", "--output", filename
        ];
        if (options.perspective) {
            args.push("--perspective");
        }
        if (options.zoom) {
            args.push("--zoom", String(options.zoom));
        }
        if (options.pivot) {
            args.push("--pivot", flatXYZ(options.pivot));
        }
        if (options.rotate) {
            args.push("--rotate", flatXYZ(options.rotate));
        }
        if (options.pan) {
            args.push("--pan", flatXYZ(options.pan));
        }
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
//# sourceMappingURL=project.js.map