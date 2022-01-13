#!/usr/bin/env node

import {logger} from "./utils/logger";
import {getLanguage} from "./lib/getLanguage";
import {generateJsDataplaneSdk, jsInfo, jsInteractiveCli} from "./languages/js/js";
import * as fs from "fs";
import * as path from "path";
import {cloneRepoIfNotExist, sdkRepositories} from "./lib/cloneRepoitory";
import {generatePythonDataplaneSdk, pythonInfo, pythonInteractiveCli} from "./languages/python/python";
import {generateJavaDataplaneSdk, javaInfo, javaInteractiveCli} from "./languages/java/java";
import {getPackageFolderName} from "./languages/js/utils";
import {generateNetDataplaneSdk, netInfo, netInteractiveCli} from "./languages/net/net";

async function main() {
    logger.log(`Welcome to use Ten Minutes Started Dataplane SDK tools to generate SDK.`);

    if (!fs.existsSync('sdk-repos')) {
        throw new Error(`Please mount folder sdk-repos`);
    }

    process.chdir(path.join(process.cwd(), 'sdk-repos'));
    const sdkReposPath = process.cwd();

    const languages: string[] = await getLanguage();

    // clone sdk if it doesn't exist
    cloneRepoIfNotExist(languages);

    // get necessary information
    for (const language of languages) {
        logger.logGreen(`Please input required information for generating ${language} sdk...`);
        switch (language) {
            case 'js':
                await jsInteractiveCli(sdkReposPath);
                break;
            case 'python':
                await pythonInteractiveCli(sdkReposPath);
                break;
            case 'java':
                await javaInteractiveCli(sdkReposPath);
                break;
            case 'net':
                await netInteractiveCli(sdkReposPath);
                break;

            default:
                throw new Error(`Don't support language ${language}`);
        }
    }

    // generate sdk
    for (const language of languages) {
        logger.logGreen(`********************************************`);
        logger.logGreen(`Generating codes for ${language}`);
        logger.logGreen(`********************************************`);
        try {
            switch (language) {
                case 'js':
                    await generateJsDataplaneSdk(sdkReposPath);
                    break;
                case 'python':
                    await generatePythonDataplaneSdk(sdkReposPath);
                    break;
                case 'java':
                    await generateJavaDataplaneSdk(sdkReposPath);
                    break;
                case 'net':
                    await generateNetDataplaneSdk(sdkReposPath);
                    break;
                default:
                    throw new Error(`Don't support language ${language}`);
            }
        } catch (e) {
            logger.logError(`Generate codes for ${language} sdk failed`);
            throw e;
        }
    }

    logger.logGreen(`********************************************`);
    logger.logGreen(`********************************************`);
    logger.logGreen(`Generate codes for ${languages.join(', ')} successfully`);
    logger.logGreen(``);
    for (const language of languages) {
        let sdkPath: string;
        switch (language) {
            case 'js':
                sdkPath = path.join(process.cwd(), sdkRepositories.js, 'sdk', jsInfo.service, getPackageFolderName(jsInfo.packageName))
                break;
            case 'python':
                sdkPath = path.join(process.cwd(), sdkRepositories.python, 'sdk', pythonInfo.service, pythonInfo.packageName)
                break;
            case 'java':
                sdkPath = path.join(process.cwd(), sdkRepositories.java, 'sdk', pythonInfo.service, javaInfo.module);
                break;
            case 'net':
                sdkPath = path.join(process.cwd(), sdkRepositories.net, 'sdk', pythonInfo.service, netInfo.namespace);
                break;
        }
        logger.logGreen(`Please find ${language} codes in ${sdkPath}`);
    }
}

main().catch(e => {
    logger.logError(`${e.message}
    ${e.stack}`);
    logger.logError(`Generate SDK failed.`);
    process.exit(1);
})
