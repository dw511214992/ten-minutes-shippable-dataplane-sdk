import * as path from "path";
import {sdkRepositories} from "../../lib/cloneRepoitory";
import {getInputFromCommand} from "../../utils/getInputFromCommand";
import {commonFields, setCommonFields} from "../../lib/commonFields";
import {findPackageInRepo, getReadmeMdFile} from "./utils";
import * as fs from "fs";
import {getConfigFromReadmeMd, getServiceFromPackagePath} from "../utils";
import * as child_process from "child_process";

export type JavaInfo = {
    module: string;
    service: string;
    title: string;
    inputFile: string;
    credentialScopes: string;
}

export const javaInfo: JavaInfo = {
    module: '',
    service: '',
    title: '',
    inputFile: '',
    credentialScopes: ''
};

const hints = {
    module: '[JAVA SDK] What is the module name? It should be in format azure-xxxxx. Sample: azure-storage-blob. Please input it:',
    service: '[JAVA SDK] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it:',
    title: '[JAVA SDK] What is the client name? It should be end with Client? Sample: BlobClient. Please input it:',
    inputFile: '[JAVA SDK] Please input the swagger files:',
    credentialScopes: '[JAVA SDK] Please input credential-scopes of your service:'
}

export async function javaInteractiveCli(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.java));
    javaInfo.module = await getInputFromCommand(hints.module, {regex: /^azure-[a-zA-Z-]+/});
    const packagePath = findPackageInRepo(javaInfo.module, process.cwd());
    if (!packagePath || !fs.existsSync(getReadmeMdFile(path.join(packagePath, 'swagger')))) {
        if (!packagePath) {
            javaInfo.service = await getInputFromCommand(hints.service, {defaultValue: commonFields.service});
        } else {
            javaInfo.service = await getInputFromCommand(hints.service, {defaultValue: getServiceFromPackagePath(packagePath)});
        }
        javaInfo.title = await getInputFromCommand(hints.title, {defaultValue: commonFields.title, regex: /^[a-zA-z0-9]+Client/});
        javaInfo.inputFile = await getInputFromCommand(hints.inputFile, {defaultValue: commonFields.inputFile});
        javaInfo.credentialScopes = await getInputFromCommand(hints.credentialScopes, {defaultValue: commonFields.credentialScopes});
    } else {
        const readme = await getConfigFromReadmeMd(path.join(packagePath, 'swagger', 'README.md'));
        javaInfo.service = await getInputFromCommand(hints.service, {defaultValue: getServiceFromPackagePath(packagePath)});
        javaInfo.title = await getInputFromCommand(hints.title, {defaultValue: readme['title'] ? readme['title'] : commonFields.title, regex: /^[a-zA-z0-9]+Client/});
        javaInfo.inputFile = await getInputFromCommand(hints.inputFile, {defaultValue: readme['input-file'] ? readme['input-file'] : commonFields.inputFile});
        javaInfo.credentialScopes = await getInputFromCommand(hints.credentialScopes, {defaultValue: readme['credential-scope'] ? readme['credential-scope'] : commonFields.credentialScopes});
    }
    setCommonFields(commonFields, javaInfo);

    process.chdir(sdkReposPath)
}

export async function generateJavaDataplaneSdk(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.java));
    child_process.execSync(`python3 ${path.join(process.cwd(), 'eng', 'mgmt', 'automation', 'generate_data.py')} --input-file=${javaInfo.inputFile} --service=${javaInfo.service} --module=${javaInfo.module} --credential-types=tokencredential --credential-scopes=${javaInfo.credentialScopes}`, {stdio: 'inherit'});
    process.chdir(sdkReposPath)
}
