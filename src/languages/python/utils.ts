import * as fs from "fs";
import * as path from "path";

const toml = require('toml');

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
            if (fs.existsSync(path.join(sdkRepo, 'sdk', rp, p, 'sdk_packaging.toml'))) {
                const sdkPackagingToml = path.join(sdkRepo, 'sdk', rp, p, 'sdk_packaging.toml');
                const sdkPackagingTomlContent = toml.parse(fs.readFileSync(sdkPackagingToml, {encoding: 'utf-8'}));
                if (packageName === sdkPackagingTomlContent?.packaging?.package_name) {
                    return path.join(sdkRepo, 'sdk', rp, p);
                }
            }
            if (fs.existsSync(path.join(sdkRepo, 'sdk', rp, p, 'swagger', 'README.md'))) {
                const readme = fs.readFileSync(path.join(sdkRepo, 'sdk', rp, p, 'swagger', 'README.md'), {encoding: 'utf-8'});
                const match = /package-name: "*(azure-[a-zA-Z-]+)/.exec(readme);
                if (!!match && match.length === 2 && packageName === match[1]) {
                    return path.join(sdkRepo, 'sdk', rp, p);
                }
            }
        }
    }
    return undefined;
}

export function getPackagePrintName(tomlFilePath: string) {
    if (fs.existsSync(tomlFilePath)) {
        const sdkPackagingTomlContent = toml.parse(fs.readFileSync(tomlFilePath, {encoding: 'utf-8'}));
        return sdkPackagingTomlContent?.packaging?.package_pprint_name;
    } else {
        return undefined;
    }

}
