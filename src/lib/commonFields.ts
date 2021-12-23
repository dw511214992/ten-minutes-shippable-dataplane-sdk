export type CommonFields = {
    service?: string;
    title?: string; //end with Client
    inputFile?: string;
    credentialScopes?: string;
}

export function setCommonFields(commonFields: CommonFields, info: any) {
    commonFields.service = info.service ? info.service : commonFields.service;
    commonFields.inputFile = info.inputFile ? info.inputFile : commonFields.inputFile;
    commonFields.title = info.title ? info.title : commonFields.title;
    commonFields.credentialScopes = info.credentialScopes ? info.credentialScopes : commonFields.credentialScopes;
}

export const commonFields: CommonFields = {};
