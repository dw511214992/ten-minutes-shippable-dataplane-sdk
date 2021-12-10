# Generate Javascript Dataplane SDK

1. After you choose to generate javascript dataplane sdk, the tool may ask you which package do you want to generate:
  ```shell
  Please input packageName which should be in format @azure-rest/xxxxx: @azure-rest/sample
  ```

2. The tool will ask you to input some necessary information to generate sdk and the interactive question is based on whether `swagger/README.md` in your to-generated package folder exists or not.

- When the package is generated firstly or the tool cannot find `swagger/README.md` in your to-generated package folder, the following information you need to input:
  ```shell
  Which service folder do you want to store your package in sdk folder? Please input it: sample
  Please input the title of sdk: sample
  Please input the description of sdk: sample:
  Please input the swagger files. If you have multi input files, please use semicolons to separate: https://github.com/Azure/azure-rest-api-specs/blob/main/specification/agrifood/data-plane/Microsoft.AgFoodPlatform/preview/2021-03-31-preview/agfood.json
  Please input the package version you want to generate: 1.0.0-beta.1
  Please input credential-scopes of your service: https://sample/.default
  ```

- When the package has been generated before and the tool can find `swagger/README.md` in your to-generated package folder, it will ask you to confirm whether the value is expected. If yes, please input Enter directly. If not, please input value directly:
  ```shell
  Please input the title of sdk: [default: sample]:
  Please input the description of sdk: [default: sample]:
  Please input the swagger files. If you have multi input files, please use semicolons to separate: [default: https://github.com/Azure/azure-rest-api-specs/blob/main/specification/agrifood/data-plane/Microsoft.AgFoodPlatform/preview/2021-03-31-preview/agfood.json]:
  Please input the package version you want to generate: [default: 1.0.0-beta.1]:
  Please input credential-scopes of your service: [default: https://sample/.default]:
  ```

3. Then the tool will help generate codes and build the generated codes automatically.
