import {getInputFromCommand} from "../utils/getInputFromCommand";

enum Language {
    Js = 'js'
}

export async function getLanguage(): Promise<string> {
    while (true) {
        const language = await getInputFromCommand(`Which language of sdk do you want to get? (Supported Language: js): `);
        if (language === 'js') {
            return language;
        }
    }
}
