# Generate Java Dataplane SDK

1. After you choose to generate java dataplane sdk, the tool may ask you which package do you want to generate:
    ```shell
    [JAVA SDK] What is the module name? It should be in format azure-xxxxx. Sample: azure-storage-blob. Please input it: azure-sample
    ```

2. The tool will ask you to input some necessary information to generate sdk and the interactive question is based on whether `swagger/README.md` in your to-generated package folder exists or not.
Also, if you are generating sdks for multi-language, you may not need to input some common information which you may have input in before. 

- When the package is generated firstly or the tool cannot find `swagger/README.md` in your to-generated package folder, the following information you may need to input:
  ```shell
  [COMMON PARAMETER] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it: sample
  [COMMON PARAMETER] What is the title of sdk? It should be end with Client. Sample: BlobClient. Please input it: SampleClient
  [COMMON PARAMETER] Please input the swagger files: https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/webpubsub/data-plane/WebPubSub/stable/2021-10-01/webpubsub.json
  [COMMON PARAMETER] Please input credential-scopes of your service: https://sample/.default
  ```

- When the package has been generated before and the tool can find `swagger/README.md` in your to-generated package folder, it may ask you to confirm whether the value is expected. If yes, please input Enter directly. If not, please input value directly:
  ```shell
  [COMMON PARAMETER] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it: [default: sample]:
  [COMMON PARAMETER] What is the title of sdk? It should be end with Client. Sample: BlobClient. Please input it: [default: SampleClient]:
  [COMMON PARAMETER] Please input the swagger files: [default: https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/webpubsub/data-plane/WebPubSub/stable/2021-10-01/webpubsub.json]:
  [COMMON PARAMETER] Please input credential-scopes of your service: [default: https://sample/.default]:
  ```

3. Then the tool will help generate codes and build the generated codes automatically. At last, the tool tells where the generated codes store.
    ```shell
    Please find java codes in /sdk-repos/azure-sdk-for-java/sdk/sample/sample-rest
    ```

4. After finishing generating codes, you may need to update some files, write your own tests and samples. For more details, please refer to [Improve SDK documentation](https://github.com/Azure/azure-sdk-for-java/wiki/Protocol-Methods-Quickstart-with-AutoRest#improve-sdk-documentation).

   *hint: docker container creates a shell terminal when automation tool finishes, and please run all commands in the shell terminal.*
   
