import * as path from "path";
import {sdkRepositories} from "../../lib/cloneRepoitory";
import {getInputFromCommand} from "../../utils/getInputFromCommand";
import {commonFields, setCommonFields} from "../../lib/commonFields";
import {findPackageInRepo, getReadmeMdFilePath} from "./utils";
import {getConfigFromReadmeMd, getServiceFromPackagePath} from "../utils";
import * as child_process from "child_process";
import {logger} from "../../utils/logger";

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
    service: '[COMMON PARAMETER] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it:',
    title: '[COMMON PARAMETER] What is the client name? It should be end with Client. Sample: BlobClient. Please input it:',
    inputFile: '[COMMON PARAMETER] Please input the swagger files:',
    credentialScopes: '[COMMON PARAMETER] Please input credential-scopes of your service:'
}

export async function javaInteractiveCli(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.java));
    javaInfo.module = await getInputFromCommand(hints.module, {regex: /^azure-[a-zA-Z-]+/});
    const packagePath = findPackageInRepo(javaInfo.module, process.cwd());
    const readme = packagePath? await getConfigFromReadmeMd(getReadmeMdFilePath(path.join(packagePath, 'swagger'))) : undefined;
    if (!!packagePath) {
        javaInfo.service = await getInputFromCommand(hints.service, {defaultValue: getServiceFromPackagePath(packagePath)});
    } else {
        javaInfo.service = commonFields.service ? commonFields.service : await getInputFromCommand(hints.service);
    }
    javaInfo.title = commonFields.title ? commonFields.title : await getInputFromCommand(hints.title, {
        defaultValue: readme ? readme['title'] : undefined,
        regex: /^[a-zA-z0-9]+Client/
    });
    javaInfo.inputFile = commonFields.inputFile ? commonFields.inputFile : await getInputFromCommand(hints.inputFile, {defaultValue: readme ? readme['input-file'] : undefined});
    javaInfo.credentialScopes = commonFields.credentialScopes ? commonFields.credentialScopes : await getInputFromCommand(hints.credentialScopes, {defaultValue: readme ? readme['credential-scopes'] : undefined});
    setCommonFields(commonFields, javaInfo);
    process.chdir(sdkReposPath);
}

export async function generateJavaDataplaneSdk(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.java));
    const command = `python3 ${path.join(process.cwd(), 'eng', 'mgmt', 'automation', 'generate_data.py')} --input-file=${javaInfo.inputFile} --service=${javaInfo.service} --module=${javaInfo.module} --credential-types=tokencredential --credential-scopes=${javaInfo.credentialScopes} --title=${javaInfo.title}`;
    logger.logGreen('=================================================================')
    logger.logGreen(command);
    logger.logGreen('=================================================================')
    child_process.execSync(command, {stdio: 'inherit'});
    process.chdir(sdkReposPath)
}
