import { stdin, stdout } from "process";
import { createInterface } from "readline/promises";

export function createTerminal() {
    return createInterface({ input: stdin, output: stdout, terminal: true });
}

export async function promptRequest(readline: any, texts: Array<string>): Promise<string | null> {
    console.log('\n');
    texts.forEach((text: string) => console.log(`${text}`));
    console.log('\n');
    const answer = await readline.question('Select an option: ');
    console.log('\n');
    return answer.trim();
}