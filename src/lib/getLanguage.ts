import {getInputFromCommand} from "../utils/getInputFromCommand";
import {logger} from "../utils/logger";

export async function getLanguage(): Promise<string[]> {
    const validLanguage = ['js', 'python', 'java', 'net'];
    while (true) {
        const languages = await getInputFromCommand(`Which language of sdk do you want to get? If you want to get multi-language, please use semicolon to separate them. (Supported Language: js, python, java, net): `);
        if (languages.trim() !== '') {
            const languageList = languages.replace(/ /g, '').split(';');
            let validInput = true;
            let invalidLanguage = [];
            for (const language of languageList) {
                if (!validLanguage.includes(language)) {
                    validInput = false;
                    invalidLanguage.push(language);
                }
            }
            if (validInput) {
                return languageList;
            } else {
                logger.log(`Your input is valid, and we don't support the language: ${invalidLanguage.join(';')}`);
                logger.logWarn(`Please re-input which language of sdk you want to get.`);
            }
        }
    }
}
