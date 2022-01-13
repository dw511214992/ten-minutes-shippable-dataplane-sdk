import * as child_process from "child_process";
import {getInputFromCommand} from "../../utils/getInputFromCommand";
import * as path from "path";
import {findPackageInRepo, formatInputFileUrl} from "./utils";
import {commonFields, setCommonFields} from "../../lib/commonFields";
import {sdkRepositories} from "../../lib/cloneRepoitory";
import {getConfigFromReadmeMd, getServiceFromPackagePath} from "../utils";
import {logger} from "../../utils/logger";

export type NetInfo = {
    namespace: string;
    service: string;
    inputFile: string;
    credentialScopes: string;
}

export const netInfo: NetInfo = {
    namespace: '',
    service: '',
    inputFile: '',
    credentialScopes: ''
};

const hints = {
    namespace: '[NET SDK] What is the namespace? It should be in format Azure.xxxx.xxxx. Sample: Azure.Storage.Blob. Please input it:',
    service: '[COMMON PARAMETER] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it:',
    inputFile: '[COMMON PARAMETER] Please input the swagger files:',
    credentialScopes: '[COMMON PARAMETER] Please input credential-scopes of your service:'
}

export async function netInteractiveCli(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.net));
    netInfo.namespace = await getInputFromCommand(hints.namespace, {regex: /Azure(\.[a-zA-z0-9]+)+/});
    const packagePath = findPackageInRepo(netInfo.namespace, process.cwd());
    const readme = packagePath ? getConfigFromReadmeMd(path.join(packagePath, 'src', 'autorest.md')) : undefined;
    if (!!packagePath) {
        netInfo.service = await getInputFromCommand(hints.service, {defaultValue: getServiceFromPackagePath(packagePath)});
    } else {
        netInfo.service = commonFields.service ? commonFields.service : await getInputFromCommand(hints.service);
    }
    netInfo.inputFile = commonFields.inputFile ? commonFields.inputFile : await getInputFromCommand(hints.inputFile, {defaultValue: readme ? readme['input-file'] : undefined});
    netInfo.credentialScopes = commonFields.credentialScopes ? commonFields.credentialScopes : await getInputFromCommand(hints.credentialScopes, {defaultValue: readme ? readme['security-scopes'] : undefined});
    setCommonFields(commonFields, netInfo);
    process.chdir(sdkReposPath);
}

export async function generateNetDataplaneSdk(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.net));
    try {
        child_process.execSync(`git switch shipPackage`);
    } catch (e) {
        logger.logWarn(e.message);
    }

    const command = `pwsh ${path.join(process.cwd(), 'eng', 'scripts', 'automation', 'Invoke-DataPlaneGenerateSDKPackage.ps1')} -service ${netInfo.service} -namespace ${netInfo.namespace} -sdkPath ${process.cwd()} -inputfiles ${await formatInputFileUrl(netInfo.inputFile)} -securityScope ${netInfo.credentialScopes}`;
    logger.logGreen('=================================================================')
    logger.logGreen(command);
    logger.logGreen('=================================================================')
    child_process.execSync(command, {stdio: 'inherit'})
    process.chdir(sdkReposPath)
}
