# Generate Python Dataplane SDK

1. After you choose to generate python dataplane sdk, the tool may ask you which package do you want to generate:
    ```shell
    [PYTHON SDK] What is packageName? It should be in format azure-xxxxx, sample: azure-storage-blob. Please input it: azure-sample
    ```

2. The tool will ask you to input some necessary information to generate sdk and the interactive question is based on whether `swagger/README.md` in your to-generated package folder exists or not.

- When the package is generated firstly or the tool cannot find `swagger/README.md` in your to-generated package folder, the following information you may need to input:
  ```shell
  [PYTHON SDK] What is print name of the package. Sample: Azure Storage Service. Please input it: Azure Sample Service
  [COMMON PARAMETER] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it: sample
  [COMMON PARAMETER] What is the title of sdk? It should be end with Client. Sample: BlobClient. Please input it: SampleClient
  [COMMON PARAMETER] Please input the swagger files: https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/webpubsub/data-plane/WebPubSub/stable/2021-10-01/webpubsub.json
  [COMMON PARAMETER] Please input credential-scopes of your service: https://sample/.default
  ```

- When the package has been generated before and the tool can find `swagger/README.md` in your to-generated package folder, it may ask you to confirm whether the value is expected. If yes, please input Enter directly. If not, please input value directly:
  ```shell
  [PYTHON SDK] What is print name of the package. Sample: Azure Storage Service. Please input it: [default: Azure Sample Service]:
  [COMMON PARAMETER] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it: [default: sample]:
  [COMMON PARAMETER] What is the title of sdk? It should be end with Client. Sample: BlobClient. Please input it: [default: SampleClient]:
  [COMMON PARAMETER] Please input the swagger files: [default: https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/webpubsub/data-plane/WebPubSub/stable/2021-10-01/webpubsub.json]:
  [COMMON PARAMETER] Please input credential-scopes of your service: [default: https://sample/.default]:
  ```

3. Then the tool will help generate codes and build the generated codes automatically. At last, the tool tells where the generated codes store.
    ```shell
    Please find python codes in /sdk-repos/azure-sdk-for-python/sdk/sample/azure-sample
    ```

4. After finishing generating codes, you may need to update some files, write your own tests and samples.

   *hint: docker container creates a shell terminal when automation tool finishes, and please run all commands in the shell terminal.*

   - Remember to edit `README.md`.
   - The tool creates test framework. If you want to add testcase, please reference [test guidance](https://github.com/Azure/azure-sdk-for-python/blob/main/doc/dev/tests.md).
   - This tool creates blank sample file under `samples`, feel free to add your own code or delete it if it is not needed.
   - If you need to regenerate the code, run the following command: `autorest --version=latest --python --use=@autorest/python@latest --python-mode=update /sdk-repos/azure-sdk-for-python/sdk/sample/azure-sample/swagger/README.md`.
