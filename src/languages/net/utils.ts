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
            if (packageName === p) {
                return path.join(sdkRepo, 'sdk', rp, p);
            }
        }
    }
    return undefined;
}

export async function formatInputFileUrl(inputFilePath: string) {
    if ((inputFilePath.includes('https://github.com') || inputFilePath.includes('https://raw.githubusercontent.com')) && inputFilePath.includes('azure-rest-api-specs') && inputFilePath.includes('specification')) {
        const match = /([a-z0-9]{40})[\/\\]specification/.exec(inputFilePath);
        if (!match || match.length != 2) {
            const apiUrl = inputFilePath.replace(/github\.com|raw\.githubusercontent\.com/, 'api.github.com/repos')
                .replace(/azure-rest-api-specs-pr(\/blob)?/, 'azure-rest-api-specs-pr/commits')
                .replace(/azure-rest-api-specs(\/blob)?/, 'azure-rest-api-specs/commits')
                .replace(/\/specification.*/, '');
            const axios = require('axios');
            const response = await axios.get(apiUrl);
            if (response?.data?.sha) {
                const commitId = response?.data?.sha;
                const branchMatch = /commits\/(.*)/.exec(apiUrl);
                if (branchMatch && branchMatch.length === 2) {
                    const branch = branchMatch[1];
                    inputFilePath = inputFilePath.replace(branch, commitId)
                }
            }
        }
    }
    return inputFilePath;
}
