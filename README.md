# Ten Minutes Shippable Data-plane SDK

This project provides a docker image, which can get data-plane sdk of different language easily.

## Prerequisites

- Install [docker](https://www.docker.com/), and run it.
    - It's strongly recommended running it with WSL 2 engine because its file system is faster than running it on Windows directly. About how to run docker with WSL 2 engine,
      please refer to [Docker Guidance](https://docs.docker.com/desktop/windows/wsl/#install).
    - If you run docker in WSL 2 engine, please run all the following commands in WSL 2 terminal. If you run docker in Windows, please run all the following commands in cmd or
      powershell.
- Create a work directory `sdk-repos` in your computer.
    - If you run docker in WSL 2 engine, please create this folder in WSL 2 file system. For example:
        ```shell
        cd /home/weidong
        mkdir sdk-repos
        ```

## How to Use

1. Run docker container with command:
    ```shell
    docker run -it -v {path_to_your_sdk_repos}:/sdk-repos dw225/data-plane-sdk:v1.2
    ```
   For example:
    ```shell
    docker run -it -v /home/weidong/sdk-repos:/sdk-repos dw225/data-plane-sdk:v1.2
    ```

2. After the docker container is started, it will ask you which language you want to get:
    ```shell
    Which language of sdk do you want to get? If you want to get multi-language, please use semicolon to separate them. (Supported Language: js, python, java): js;python;java
    ```

3. If the tool cannot find the corresponding sdk repository in `sdk-repos`, it will cost some time to clone the missing repository from github. If you already have the repositories
   in the folder, please ensure it is latest.

4. Then the tool will run interactively, and you need to input some necessary information to generate sdks. If you want to get more details, please go to language specific document
   for next steps.
    - [Javascript](./docs/js.md)
    - [Python](./docs/python.md)
    - [Java](/docs/java.md)
    - [Net](/docs/net.md)

