import {logger} from "./logger";

const readline = require('readline');

function ask(query: string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

export async function getInputFromCommand(message: string, options?: {defaultValue?: string; regex?: RegExp}): Promise<string> {
    while (true) {
        if (!!options?.defaultValue) {
            message = `${message.trim()} [default: ${options?.defaultValue}]: `;
        } else {
            message = `${message.trim()} `;
        }
        const input = ((await ask(message.yellow)) as string).trim();
        if (input !== '') {
            if (!!options?.regex && !options?.regex.exec(input)) {
                logger.logError(`Your input ${input} is invalid.`);
            } else {
                return input;
            }
        } else if (!!options?.defaultValue) {
            return options?.defaultValue;
        }
    }
}
