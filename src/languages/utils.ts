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
    const readme = fs.readFileSync(readmePath, {encoding: 'utf-8'});
    const match = /```yaml((.|\n)*)```/.exec(readme);
    if (!match || match.length !== 3) {
        logger.logError(`Cannot find valid package name from ${readmePath}`);
        process.exit(1);
    }
    const yaml = require('js-yaml');
    return yaml.load(match[1]);
}
