export declare function resolve(...path: Array<string>): string;
export interface RenderXYZ {
    x?: number;
    y?: number;
    z?: number;
}
export interface RenderSize {
    height?: number;
    width?: number;
}
export interface RenderOptions {
    perspective?: boolean;
    zoom?: number;
    pan?: RenderXYZ;
    rotate?: RenderXYZ;
    pivot?: RenderXYZ;
    size?: RenderSize;
}
export declare class Project {
    readonly cmd: string;
    readonly projectFolder: string;
    constructor(cmd: string, projectFolder: string);
    _searchDir(ext: string): Array<string>;
    get projectFilename(): string;
    get pcbFilename(): string;
    render(options?: RenderOptions, filename?: string): void;
}
//# sourceMappingURL=project.d.ts.map