import * as fs from "fs";
import * as path from "path";

const pomParser = require("pom-parser");

export function findPackageInRepo(moduleName, sdkRepo) {
    const rps = fs.readdirSync(path.join(sdkRepo, 'sdk'));
    for (const rp of rps) {
        if (!fs.lstatSync(path.join(sdkRepo, 'sdk', rp)).isDirectory()) {
            continue;
        }
        const packages = fs.readdirSync(path.join(sdkRepo, 'sdk', rp));
        for (const p of packages) {
            if (!fs.lstatSync(path.join(sdkRepo, 'sdk', rp, p)).isDirectory()) {
                continue;
            }
            if (fs.existsSync(path.join(sdkRepo, 'sdk', rp, p, 'pom.xml'))) {
                const pomFilePath = path.join(sdkRepo, 'sdk', rp, p, 'pom.xml');
                let curModuleName: string;
                pomParser.parse({filePath: pomFilePath}, function(err, pomResponse) {
                    if (err) {
                        throw new Error(`Parse ${pomFilePath} failed.`);
                    }
                    curModuleName = pomResponse.pomObject?.project?.artifactId;
                });
                if (moduleName === curModuleName) {
                    return path.join(sdkRepo, 'sdk', rp, p);
                }
            }
            let readmeMdPath: string;
            if (fs.existsSync(path.join(sdkRepo, 'sdk', rp, p, 'swagger'))) {
                readmeMdPath = getReadmeMdFilePath(path.join(sdkRepo, 'sdk', rp, p, 'swagger'));
            }
            if (!!readmeMdPath) {
                const readme = fs.readFileSync(readmeMdPath, {encoding: 'utf-8'});
                let match = /artifact-id: "*(azure-[a-zA-Z-]+)/.exec(readme);
                if (!!match && match.length === 2 && moduleName === match[1]) {
                    return path.join(sdkRepo, 'sdk', rp, p);
                }
                match = /namespace: "*com\.(azure\.[a-zA-Z-\.]+)/.exec(readme);
                if (!!match && match.length === 2 && moduleName === match[1].replace('.', '-')) {
                    return path.join(sdkRepo, 'sdk', rp, p);
                }
            }
        }
    }
    return undefined;
}

export function getReadmeMdFilePath(swaggerFolderPath: string) {
    const files = fs.readdirSync(swaggerFolderPath);
    let readmeMdPath: string;
    if (files.includes('README_SPEC.md')) {
        readmeMdPath = 'README_SPEC.md';
    } else if (files.includes('README.md')) {
        readmeMdPath = 'README.md';
    } else {
        for (const file of files) {
            if (file.startsWith('README')) {
                readmeMdPath = file;
                break;
            }
        }
    }
    if (!!readmeMdPath) {
        readmeMdPath = path.join(swaggerFolderPath, readmeMdPath);
    }
    return readmeMdPath;
}
