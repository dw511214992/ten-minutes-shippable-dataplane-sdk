# Generate Javascript Dataplane SDK

1. After you choose to generate javascript dataplane sdk, the tool may ask you which package do you want to generate:
    ```shell
    [JS SDK] What is the packageName? It should be in format @azure-rest/xxxxx. Sample: @azure-rest/storage. Please input it: @azure-rest/sample
    ```

2. The tool will ask you to input some necessary information to generate sdk and the interactive question is based on whether `swagger/README.md` in your to-generated package folder exists or not.
Also, if you are generating sdks for multi-language, you may not need to input some common information which you may have input in before. 

- When the package is generated firstly or the tool cannot find `swagger/README.md` in your to-generated package folder, the following information you may need to input:
  ```shell
  [JS SDK] Please input the description of sdk: sample
  [JS SDK] What is the package version you want to generate. Sample: 1.0.0-beta.1. Please input it: 1.0.0-beta.1
  [COMMON PARAMETER] Which service folder do you want to store your package in sdk folder? Sample: storage. Please input it: sample
  [COMMON PARAMETER] What is the title of sdk? It should be end with Client. Sample: BlobClient. Please input it: SampleClient
  [COMMON PARAMETER] Please input the swagger files: https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/webpubsub/data-plane/WebPubSub/stable/2021-10-01/webpubsub.json
  [COMMON PARAMETER] Please input credential-scopes of your service: https://sample/.default
  ```

- When the package has been generated before and the tool can find `swagger/README.md` in your to-generated package folder, it may ask you to confirm whether the value is expected. If yes, please input Enter directly. If not, please input value directly:
  ```shell
  [JS SDK] Please input the description of sdk: [default: sample]:
  [JS SDK] What is the package version you want to generate. Sample: 1.0.0-beta.1. Please input it: [default: 1.0.0-beta.1]:
  [COMMON PARAMETER] What is the title of sdk? It should be end with Client. Sample: BlobClient. Please input it: [default: SampleClient]:
  [COMMON PARAMETER] Please input the swagger files: [default: https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/webpubsub/data-plane/WebPubSub/stable/2021-10-01/webpubsub.json]:
  [COMMON PARAMETER] Please input credential-scopes of your service: [default: https://sample/.default]:
  ```

3. Then the tool will help generate codes and build the generated codes automatically. At last, the tool tells where the generated codes store.
    ```shell
    Please find js codes in /sdk-repos/azure-sdk-for-js/sdk/sample/sample-rest
    ```

4. After finishing generating codes, you may need to update some files, write your own tests and samples.

    *hint: docker container creates a shell terminal when automation tool finishes, and please run all commands in the shell terminal.*

   - [Update README.md](#update-readmemd)
   - [Write your own test](#write-your-own-test)
   - [Write samples](#write-samples)

# Update README.md
The docker generates a sample README.md. Please go through it and update it. The overall changes you need to do are following:
1. Replace `[Service Description]` to yours.
1. Update the codes in Examples to a valid one.
1. Update the urls in the bottom of README.md, such as `product_documentation`, `resource`, `enable_aad`.

Besides these change, you also can update other changes which you think it's not friendly for customer.

# Write Your Own Test
The docker generates a sample test, and you can write your own test based on it.
1. Update `test/public` and add a new function to create client. For example:
    ```typescript
    import SampleClient, { SampleClientRestClient } from "../../../src";
    export function createClient(options?: ClientOptions): SampleClientRestClient {
      const credential = new ClientSecretCredential(
              env.AZURE_TENANT_ID,
              env.AZURE_CLIENT_ID,
              env.AZURE_CLIENT_SECRET
      );
      return SampleClient(env.ENDPOINT, credential, options);
    }
    ```
2. You can add some sample tests with the filename ending with `.spec.ts`. And you can refer to `sample.spec.ts` on how to write tests.
3. Set the environment variables required by step1 and run the test
    ```shell
    rush build -t ${PACKAGE_NAME}
    cd ${You_Package_folder} # example: /sdk-repos/azure-sdk-for-js/sdk/sample/sample-rest
    export TEST_MODE=record && rushx test # this will run live test and generate a recordings folder, you will need to submit it in the PR. 
    ```
    
For all details about how to write tests, please go to [How to write test for RLC](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/RLC-quickstart.md#how-to-write-test-for-rlc).

# Write Samples
The docker generates a simple sample in `samples-dev/sample.ts`, you can add your own samples in the folder `samples-dev`.

After adding your own samples, you can generate both JavaScript and TypeScript workable samples with the following commands.
```shell
npm install -g common/tools/dev-tool # make sure you are in the azure-sdk-for-js repo root directory
cd ${You_Package_folder} # example: /sdk-repos/azure-sdk-for-js/sdk/sample/sample-rest
dev-tool samples publish -f 
```

Fore all details about how to write samples, please go to [How to write samples](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/RLC-quickstart.md#how-to-write-test-for-rlc).
