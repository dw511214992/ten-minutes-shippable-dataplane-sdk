#!/usr/bin/env node

import {logger} from "./utils/logger";
import {getLanguage} from "./lib/getLanguage";
import {Config} from "./lib/Config";
import * as fs from "fs";
import * as child_process from "child_process";

async function main() {
    logger.log(`Welcome to use Ten Minutes Shippable Dataplane SDK tools to generate SDK.`);
    const language = await getLanguage();
    const config: Config = JSON.parse(fs.readFileSync('/config.json', {encoding:  'utf-8'}));
    if (fs.existsSync(config[language])) {
        fs.chmodSync(config[language], '777');
        child_process.execFileSync(config[language], {stdio: 'inherit', cwd: '/sdk-repo'});
    } else {
        child_process.execSync(config[language], {stdio: 'inherit', cwd: '/sdk-repo'});
    }
}

main().catch(e => {
    logger.logError(`${e.message}
    ${e.stack}`);
    logger.logError(`Generate SDK failed.`);
})
