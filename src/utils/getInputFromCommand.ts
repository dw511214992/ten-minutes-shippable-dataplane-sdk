
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

export async function getInputFromCommand(message: string): Promise<string> {
    const input = await ask(message.yellow);
    return input as string;
}
