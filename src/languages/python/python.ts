import * as path from "path";
import {sdkRepositories} from "../../lib/cloneRepoitory";
import {getInputFromCommand} from "../../utils/getInputFromCommand";
import {commonFields, setCommonFields} from "../../lib/commonFields";
import {findPackageInRepo, getPackagePrintName} from "./utils";
import * as fs from "fs";
import {getConfigFromReadmeMd, getServiceFromPackagePath} from "../utils";
import * as child_process from "child_process";

export type PythonInfo = {
    packageName: string;
    packagePrintName: string;
    service: string;
    title: string;
    inputFile: string;
    credentialScopes: string;
}

export const pythonInfo: PythonInfo = {
    packageName: '',
    packagePrintName: '',
    service: '',
    title: '',
    inputFile: '',
    credentialScopes: ''
};

const hints = {
    packageName: '[PYTHON SDK] What is packageName? It should be in format azure-xxxxx, sample: azure-storage-blob. Please input it:',
    packagePrintName: '[PYTHON SDK] What is print name of the package. Sample: Azure Storage Service. Please input it:',
    service: '[PYTHON SDK] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it:',
    title: '[PYTHON SDK] What is the client name? It should be end with Client. Sample: BlobClient. Please input it:',
    inputFile: '[PYTHON SDK] Please input the swagger files:',
    credentialScopes: '[PYTHON SDK] Please input credential-scopes of your service:'
}

export async function pythonInteractiveCli(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.python));
    pythonInfo.packageName = await getInputFromCommand(hints.packageName, {regex: /^azure-[a-zA-Z-]+/});
    const packagePath = findPackageInRepo(pythonInfo.packageName, process.cwd());
    if (!packagePath || !fs.existsSync(path.join(packagePath, 'swagger', 'README.md'))) {
        if (!packagePath) {
            pythonInfo.service = await getInputFromCommand(hints.service, {defaultValue: commonFields.service});
        } else {
            pythonInfo.service = await getInputFromCommand(hints.service, {defaultValue: getServiceFromPackagePath(packagePath)});
        }
        pythonInfo.title = await getInputFromCommand(hints.title, {defaultValue: commonFields.title, regex: /^[a-zA-z0-9]+Client/});
        pythonInfo.packagePrintName = await getInputFromCommand(hints.packagePrintName);
        pythonInfo.inputFile = await getInputFromCommand(hints.inputFile, {defaultValue: commonFields.inputFile});
        pythonInfo.credentialScopes = await getInputFromCommand(hints.credentialScopes, {defaultValue: commonFields.credentialScopes});
    } else {
        const readme = await getConfigFromReadmeMd(path.join(packagePath, 'swagger', 'README.md'));
        const printNameInToml = getPackagePrintName(path.join(packagePath, 'sdk_packaging.toml'));
        pythonInfo.service = await getInputFromCommand(hints.service, {defaultValue: getServiceFromPackagePath(packagePath)});
        pythonInfo.title = await getInputFromCommand(hints.title, {defaultValue: readme['title'] ? readme['title'] : commonFields.title, regex: /^[a-zA-z0-9]+Client/});
        pythonInfo.packagePrintName = await getInputFromCommand(hints.packagePrintName, {defaultValue: printNameInToml});
        pythonInfo.inputFile = await getInputFromCommand(hints.inputFile, {defaultValue: readme['input-file'] ? readme['input-file'] : commonFields.inputFile});
        pythonInfo.credentialScopes = await getInputFromCommand(hints.credentialScopes, {defaultValue: readme['credential-scope'] ? readme['credential-scope'] : commonFields.credentialScopes});
    }
    setCommonFields(commonFields, pythonInfo);

    process.chdir(sdkReposPath)
}

export async function generatePythonDataplaneSdk(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.python));
    child_process.execSync(`python3 -m venv venv-dev`, {stdio: 'inherit'});
    child_process.execSync(`source venv-dev/bin/activate`, {stdio: 'inherit'});
    child_process.execSync(`pip3 install -r ${path.join(process.cwd(), 'scripts', 'quickstart_tooling_llc', 'dev_requirements.txt')}`, {stdio: 'inherit'});
    child_process.execSync(`python3 ${path.join(process.cwd(), 'scripts', 'quickstart_tooling_llc', 'llc_initial.py')} --output-folder ${path.join(process.cwd(), 'sdk', pythonInfo.service, pythonInfo.packageName)} --input-file ${pythonInfo.inputFile} --credential-scope ${pythonInfo.credentialScopes} --package-name ${pythonInfo.packageName} --package-pprint-name "${pythonInfo.packagePrintName}" --client-name ${pythonInfo.title}`, {stdio: 'inherit'});
    process.chdir(sdkReposPath)
}
