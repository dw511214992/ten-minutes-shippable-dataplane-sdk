# Generate Net Dataplane SDK

**As the generating script of .Net SDK is not merged to main branch, the tool will still works on a dev branch: `shipPackage`**.

1. After you choose to generate net dataplane sdk, the tool may ask you which package do you want to generate:
    ```shell
    [NET SDK] What is the namespace? It should be in format Azure.xxxx.xxxx. Sample: Azure.Storage.Blob. Please input it: Azure.Template.Sample
    ```

2. The tool will ask you to input some necessary information to generate sdk and the interactive question is based on whether `src/autorest.md` in your to-generated package folder exists or not.

- When the package is generated firstly or the tool cannot find `swagger/README.md` in your to-generated package folder, the following information you may need to input:
  ```shell
  [COMMON PARAMETER] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it: sample
  [COMMON PARAMETER] Please input the swagger files: https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/webpubsub/data-plane/WebPubSub/stable/2021-10-01/webpubsub.json
  [COMMON PARAMETER] Please input credential-scopes of your service: https://sample/.default
  ```

- When the package has been generated before and the tool can find `src/autorest.md` in your to-generated package folder, it may ask you to confirm whether the value is expected. If yes, please input Enter directly. If not, please input value directly:
  ```shell
  [JS SDK] Please input the description of sdk: [default: sample]:
  [JS SDK] What is the package version you want to generate. Sample: 1.0.0-beta.1. Please input it: [default: 1.0.0-beta.1]:
  [COMMON PARAMETER] What is the title of sdk? It should be end with Client. Sample: BlobClient. Please input it: [default: SampleClient]:
  [COMMON PARAMETER] Please input the swagger files: [default: https://raw.githubusercontent.com/Azure/azure-rest-api-specs/b5007f32bcb653504a7f7737f1d7fee99facb030/specification/webpubsub/data-plane/WebPubSub/stable/2021-10-01/webpubsub.json]:
  [COMMON PARAMETER] Please input credential-scopes of your service: [default: https://sample/.default]:
  ```

3. Then the tool will help generate codes and build the generated codes automatically. At last, the tool tells where the generated codes store.
    ```shell
    Please find net codes in /sdk-repos/azure-sdk-for-net/sdk/Azure.Template.Sample
    ```

# Improve Generated Codes

After finishing generating codes, you may need to update some files, write your own tests and samples.

It's suggested to use vscode to connect the docker container. For details, please refer to [Vscode Connect Docker Container](./vscode-connect-docker-container.md).

**hint: docker container creates a shell terminal when automation tool finishes, and please run all commands in the shell terminal.**

- [Update README.md](https://github.com/Azure/azure-sdk-for-net/blob/shipPackage/doc/Data%20Plane%20Code%20Generation/AzureSDKCodeGeneration_DataPlane_Quickstart.md#readmemd)
- [Write your own test](https://github.com/Azure/azure-sdk-for-net/blob/shipPackage/doc/Data%20Plane%20Code%20Generation/AzureSDKCodeGeneration_DataPlane_Quickstart.md#tests)
- [Write samples](https://github.com/Azure/azure-sdk-for-net/blob/shipPackage/doc/Data%20Plane%20Code%20Generation/AzureSDKCodeGeneration_DataPlane_Quickstart.md#samples)
- [Update CHANGELOG.md](https://github.com/Azure/azure-sdk-for-net/blob/shipPackage/doc/Data%20Plane%20Code%20Generation/AzureSDKCodeGeneration_DataPlane_Quickstart.md#changelog)
    
