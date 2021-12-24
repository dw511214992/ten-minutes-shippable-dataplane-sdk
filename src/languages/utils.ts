import {logger} from "../utils/logger";
import * as fs from "fs";

export function getServiceFromPackagePath(packagePath: string): string {
    const match = /\/sdk\/([a-z]*)/.exec(packagePath);
    if (!match || match.length !== 2) {
        throw new Error(`Cannot extract service from ${packagePath}`);
    }
    return match[1];
}


export function getConfigFromReadmeMd(readmePath: string) {
    if (!fs.existsSync(readmePath)) return undefined;
    const readme = fs.readFileSync(readmePath, {encoding: 'utf-8'});
    const match = /``` *yaml([^`]*)```/g.exec(readme);
    if (!match) {
        throw new Error(`Cannot parse yaml in ${readmePath}`);
    }
    for (const m of match) {
        if (m.includes('input-file') && m.includes('credential-scopes')) {
            const yaml = require('js-yaml');
            return yaml.load(match[1]);
        }
    }
    return undefined;
}
