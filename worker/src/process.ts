import winston, {Logger} from "winston";
import { createWallet } from "./models/userDatabase";


export async function verificationEmailQueue(logger: Logger, data: any) : Promise<boolean> {
    // TODO

    const content = JSON.parse(data.toString());

    logger.log("info", `email sent to ${content.email}`);
    return true;
}

export async function processTransactionQueue(logger: Logger, data: any) : Promise<boolean> {
    // TODO

    logger.log("info", `process transaction for ${data}`);
    return true;
}

export async function reverseTransactionQueue(logger: Logger, data: any) : Promise<boolean> {
    // TODO

    logger.log("info", `reverse transaction for ${data}`);
    return true;
}

export async function walletQueueProcess(logger: Logger, data: any) : Promise<boolean> {
    const content = JSON.parse(data.toString());
    const result = await createWallet(content.userId);

    if(result < 1){
        logger.log("error", `wallet creation failed for ${content.userId}`);
        return false;
    }

    logger.log("info", `wallet created for ${content.userId}`);
    return true;
}