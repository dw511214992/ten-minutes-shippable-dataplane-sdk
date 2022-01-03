import * as fs from "fs";
import * as path from "path";


export function findPackageInRepo(packageName, sdkRepo) {
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
            if (fs.existsSync(path.join(sdkRepo, 'sdk', rp, p, 'package.json'))) {
                const packageJson = path.join(sdkRepo, 'sdk', rp, p, 'package.json');
                const packageJsonContent = JSON.parse(fs.readFileSync(packageJson, {encoding: 'utf-8'}));
                if (packageName === packageJsonContent['name']) {
                    return path.join(sdkRepo, 'sdk', rp, p);
                }
            }
            if (fs.existsSync(path.join(sdkRepo, 'sdk', rp, p, 'swagger', 'README.md'))) {
                const readme = fs.readFileSync(path.join(sdkRepo, 'sdk', rp, p, 'swagger', 'README.md'), {encoding: 'utf-8'});
                const match = /package-name: "*(@azure-rest\/[a-zA-Z-]+)/.exec(readme);
                if (!!match && match.length === 2 && packageName === match[1]) {
                    return path.join(sdkRepo, 'sdk', rp, p);
                }
            }
        }
    }
    return undefined;
}

export function getPackageFolderName(packageName) {
    const match = /@azure-rest\/([a-z-]+)/.exec(packageName);
    if (!match || match.length !== 2) {
        throw new Error(`packageName ${packageName} is invalid, please input a new packageName in format "@azure-rest/*****"`);
    } else {
        const subName = match[1];
        return `${subName}-rest`;
    }
}

