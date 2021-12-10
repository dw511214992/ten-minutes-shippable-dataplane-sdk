# Ten Minutes Shippable Data-plane SDK

This project provides a docker image, which can get data-plane sdk of different language easily.

## Prerequisites

- Install [docker](https://www.docker.com/), and run it without WSL.
  ![docker](docs/docker.png)  
- Clone SDK repository. The following are sdk repos that our project supports.

    | SDK | Public Repository | Private Repository |
    | :-----| :----- | :----- |
    | JS | https://github.com/Azure/azure-sdk-for-js | https://github.com/Azure/azure-sdk-for-js-pr |

## How to Use

1. Run docker container with command:
    ```shell
    docker run -it -v {path_to_sdk_repository}:/sdk-repo dw225/data-plane-sdk
    ```
   For example:
    ```shell
    docker run -it -v D:\azure-sdk-for-js:/sdk-repo dw225/data-plane-sdk
    ```

2. After the docker container is started, it will ask you which language you want to get:
    ```shell
    Which language of sdk do you want to get? (Supported Language: js): js
    ```

3. Please go to language specific document for next steps.
    - [Javascript](./docs/js.md)


