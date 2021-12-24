import * as path from "path";
import {sdkRepositories} from "../../lib/cloneRepoitory";
import {getInputFromCommand} from "../../utils/getInputFromCommand";
import {commonFields, setCommonFields} from "../../lib/commonFields";
import {findPackageInRepo, getPackagePrintName} from "./utils";
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
    service: '[COMMON PARAMETER] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it:',
    title: '[COMMON PARAMETER] What is the client name? It should be end with Client. Sample: BlobClient. Please input it:',
    inputFile: '[COMMON PARAMETER] Please input the swagger files:',
    credentialScopes: '[COMMON PARAMETER] Please input credential-scopes of your service:'
}

export async function pythonInteractiveCli(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.python));
    pythonInfo.packageName = await getInputFromCommand(hints.packageName, {regex: /^azure-[a-zA-Z-]+/});
    const packagePath = findPackageInRepo(pythonInfo.packageName, process.cwd());
    const readme = packagePath? await getConfigFromReadmeMd(path.join(packagePath, 'swagger', 'README.md')) : undefined;
    const printNameInToml = packagePath? getPackagePrintName(path.join(packagePath, 'sdk_packaging.toml')) : undefined;
    pythonInfo.packagePrintName = await getInputFromCommand(hints.packagePrintName, {defaultValue: printNameInToml});
    if (!!packagePath) {
        pythonInfo.service = await getInputFromCommand(hints.service, {defaultValue: getServiceFromPackagePath(packagePath)});
    } else {
        pythonInfo.service = commonFields.service ? commonFields.service : await getInputFromCommand(hints.service);
    }
    pythonInfo.title = commonFields.title ? commonFields.title : await getInputFromCommand(hints.title, {
        defaultValue: readme ? readme['title'] : undefined,
        regex: /^[a-zA-z0-9]+Client/
    });
    pythonInfo.inputFile = commonFields.inputFile ? commonFields.inputFile : await getInputFromCommand(hints.inputFile, {defaultValue: readme ? readme['input-file'] : undefined});
    pythonInfo.credentialScopes = commonFields.credentialScopes ? commonFields.credentialScopes : await getInputFromCommand(hints.credentialScopes, {defaultValue: readme ? readme['credential-scopes'] : undefined});
    setCommonFields(commonFields, pythonInfo);
    process.chdir(sdkReposPath);
}

export async function generatePythonDataplaneSdk(sdkReposPath: string) {
    process.chdir(path.join(sdkReposPath, sdkRepositories.python));
    child_process.execSync(`python3 -m venv venv-dev`, {stdio: 'inherit'});
    child_process.execSync(`source venv-dev/bin/activate`, {stdio: 'inherit'});
    child_process.execSync(`pip3 install -r ${path.join(process.cwd(), 'scripts', 'quickstart_tooling_llc', 'dev_requirements.txt')}`, {stdio: 'inherit'});
    child_process.execSync(`python3 ${path.join(process.cwd(), 'scripts', 'quickstart_tooling_llc', 'llc_initial.py')} --output-folder ${path.join(process.cwd(), 'sdk', pythonInfo.service, pythonInfo.packageName)} --input-file ${pythonInfo.inputFile} --credential-scope ${pythonInfo.credentialScopes} --package-name ${pythonInfo.packageName} --package-pprint-name "${pythonInfo.packagePrintName}" --client-name ${pythonInfo.title}`, {stdio: 'inherit'});
    process.chdir(sdkReposPath)
}
