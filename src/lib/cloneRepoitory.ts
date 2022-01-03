import * as fs from "fs";
import {logger} from "../utils/logger";
import * as child_process from "child_process";

export const sdkRepositories = {
    js: 'azure-sdk-for-js',
    python: 'azure-sdk-for-python',
    java: 'azure-sdk-for-java',
    net: 'azure-sdk-for-net'
}

export function cloneRepoIfNotExist(languages: string[]) {
    const nonExistedRepo = [];
    for (const language of languages) {
        if (!fs.existsSync(sdkRepositories[language])) {
            nonExistedRepo.push(language);
        }
    }
    if (nonExistedRepo.length > 0) {
        logger.logWarn(`Cannot find sdk repository for ${nonExistedRepo.join(', ')}. Cloning...`);
        for (const language of nonExistedRepo) {
            logger.logGreen(`Clone repository for ${language}: ${sdkRepositories[language]}`);
            child_process.execSync(`git clone https://github.com/Azure/${sdkRepositories[language]}.git`, {stdio: 'inherit'});
        }
    }
}
