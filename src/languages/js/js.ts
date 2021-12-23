import * as fs from "fs";
import * as child_process from "child_process";
import {getInputFromCommand} from "../../utils/getInputFromCommand";
import * as path from "path";
import {findPackageInRepo} from "./utils";
import {commonFields, setCommonFields} from "../../lib/commonFields";
import {sdkRepositories} from "../../lib/cloneRepoitory";
import {getConfigFromReadmeMd, getServiceFromPackagePath} from "../utils";

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
    service: '[JS SDK] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it:',
    title: '[JS SDK] What is the title of sdk? It should be end with Client. Sample: BlobClient. Please input it:',
    description: '[JS SDK] Please input the description of sdk:',
    inputFile: '[JS SDK] Please input the swagger files:',
    packageVersion: '[JS SDK] What is the package version you want to generate. Sample: 1.0.0-beta.1. Please input it:',
    credentialScopes: '[JS SDK] Please input credential-scopes of your service:'
}

export async function jsInteractiveCli(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.js));
    jsInfo.packageName = await getInputFromCommand(hints.packageName, {regex: /@azure-rest\/[a-zA-Z-]+/});
    const packagePath = findPackageInRepo(jsInfo.packageName, process.cwd());
    if (!packagePath || !fs.existsSync(path.join(packagePath, 'swagger', 'README.md'))) {
        if (!packagePath) {
            jsInfo.service = await getInputFromCommand(hints.service, {defaultValue: commonFields.service});
        } else {
            jsInfo.service = await getInputFromCommand(hints.service, {defaultValue: getServiceFromPackagePath(packagePath)});
        }
        jsInfo.title = await getInputFromCommand(hints.title, {defaultValue: commonFields.title, regex: /^[a-zA-z0-9]+Client/});
        jsInfo.description = await getInputFromCommand(hints.description);
        jsInfo.inputFile = await getInputFromCommand(hints.inputFile, {defaultValue: commonFields.inputFile});
        jsInfo.packageVersion = await getInputFromCommand(hints.packageVersion);
        jsInfo.credentialScopes = await getInputFromCommand(hints.credentialScopes, {defaultValue: commonFields.credentialScopes});
    } else {
        const readme = await getConfigFromReadmeMd(path.join(packagePath, 'swagger', 'README.md'));
        jsInfo.service = await getInputFromCommand(hints.service, {defaultValue: getServiceFromPackagePath(packagePath)});
        jsInfo.title = await getInputFromCommand(hints.title, {defaultValue: readme['title'] ? readme['title'] : commonFields.title, regex: /^[a-zA-z0-9]+Client/});
        jsInfo.description = await getInputFromCommand(hints.description, {defaultValue: readme['description']});
        jsInfo.inputFile = await getInputFromCommand(hints.inputFile, {defaultValue: readme['input-file'] ? readme['input-file'] : commonFields.inputFile});
        jsInfo.packageVersion = await getInputFromCommand(hints.packageVersion, {defaultValue: readme['package-version']});
        jsInfo.credentialScopes = await getInputFromCommand(hints.credentialScopes, {defaultValue: readme['credential-scopes'] ? readme['credential-scopes'] : commonFields.credentialScopes});
    }
    setCommonFields(commonFields, jsInfo);
    process.chdir(sdkReposPath)
}

export async function generateJsDataplaneSdk(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.js));
    child_process.execSync(`rlc-code-gen --package-name=${jsInfo.packageName} --title=${jsInfo.title} --description=${jsInfo.description} --input-file=${jsInfo.inputFile} --package-version=${jsInfo.packageVersion} --credential-scopes=${jsInfo.credentialScopes} --service-name=${jsInfo.service}`, {stdio: 'inherit'})
    process.chdir(sdkReposPath)
}
