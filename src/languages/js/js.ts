import * as child_process from "child_process";
import {getInputFromCommand} from "../../utils/getInputFromCommand";
import * as path from "path";
import {findPackageInRepo} from "./utils";
import {commonFields, setCommonFields} from "../../lib/commonFields";
import {sdkRepositories} from "../../lib/cloneRepoitory";
import {getConfigFromReadmeMd, getServiceFromPackagePath} from "../utils";
import {logger} from "../../utils/logger";

export type JsInfo = {
    packageName: string;
    service: string;
    title: string;
    description: string;
    inputFile: string;
    packageVersion: string;
    credentialScopes: string;
}

export const jsInfo: JsInfo = {
    packageName: '',
    service: '',
    title: '',
    description: '',
    inputFile: '',
    packageVersion: '',
    credentialScopes: ''
};

const hints = {
    packageName: '[JS SDK] What is the packageName? It should be in format @azure-rest/xxxxx. Sample: @azure-rest/storage. Please input it:',
    service: '[COMMON PARAMETER] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it:',
    title: '[COMMON PARAMETER] What is the client name? It should be end with Client. Sample: BlobClient. Please input it:',
    description: '[JS SDK] Please input the description of sdk:',
    inputFile: '[COMMON PARAMETER] Please input the swagger files:',
    packageVersion: '[JS SDK] What is the package version you want to generate. Sample: 1.0.0-beta.1. Please input it:',
    credentialScopes: '[COMMON PARAMETER] Please input credential-scopes of your service:'
}

export async function jsInteractiveCli(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.js));
    jsInfo.packageName = await getInputFromCommand(hints.packageName, {regex: /@azure-rest\/[a-zA-Z-]+/});
    const packagePath = findPackageInRepo(jsInfo.packageName, process.cwd());
    const readme = packagePath? getConfigFromReadmeMd(path.join(packagePath, 'swagger', 'README.md')) : undefined;
    jsInfo.description = await getInputFromCommand(hints.description, {defaultValue: readme?.description});
    jsInfo.packageVersion = await getInputFromCommand(hints.packageVersion, {defaultValue: readme ? readme['package-version'] : undefined});
    if (!!packagePath) {
        jsInfo.service = await getInputFromCommand(hints.service, {defaultValue: getServiceFromPackagePath(packagePath)});
    } else {
        jsInfo.service = commonFields.service ? commonFields.service : await getInputFromCommand(hints.service);
    }
    jsInfo.title = commonFields.title ? commonFields.title : await getInputFromCommand(hints.title, {defaultValue: readme?.title, regex: /^[a-zA-z0-9]+Client/});
    jsInfo.inputFile = commonFields.inputFile ? commonFields.inputFile : await getInputFromCommand(hints.inputFile, {defaultValue: readme ? readme['input-file'] : undefined});
    jsInfo.credentialScopes = commonFields.credentialScopes ? commonFields.credentialScopes : await getInputFromCommand(hints.credentialScopes, {defaultValue: readme ? readme['credential-scopes'] : undefined});
    setCommonFields(commonFields, jsInfo);
    process.chdir(sdkReposPath);
}

export async function generateJsDataplaneSdk(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.js));
    const command = `rlc-code-gen --package-name=${jsInfo.packageName} --title=${jsInfo.title} --description="${jsInfo.description}" --input-file=${jsInfo.inputFile} --package-version=${jsInfo.packageVersion} --credential-scopes=${jsInfo.credentialScopes} --service-name=${jsInfo.service}`;
    logger.logGreen('=================================================================')
    logger.logGreen(command);
    logger.logGreen('=================================================================')
    child_process.execSync(command, {stdio: 'inherit'})
    process.chdir(sdkReposPath)
}
