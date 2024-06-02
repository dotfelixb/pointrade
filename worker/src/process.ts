import { Logger } from "winston";
import { createWallet } from "./models/userDatabase";
import {
  createTransactionLegs,
  getTransactionById,
} from "./models/transactionDatabase";
import { sendToBalanceQueue } from "./utils/mq";
import { balanceWallet } from "./models/walletDatabase";

export async function verificationEmailQueue(
  logger: Logger,
  data: any
): Promise<boolean> {
  // TODO

  const content = JSON.parse(data.toString());

  logger.log("info", `email sent to ${content.email}`);
  return true;
}

export async function transactionQueueProcess(
  logger: Logger,
  data: any
): Promise<boolean> {
  const content = JSON.parse(data.toString());
  const transactionid = content.transactionid;

  const transaction = await getTransactionById(transactionid);
  if (transaction === null) {
    logger.log("error", `transaction not found for ${transactionid}`);
    return true;
  }

  if (transaction.processed) {
    logger.log("info", `transaction already processed for ${transactionid}`);
    return true;
  }

  var processed = await createTransactionLegs(transactionid);

  if (!processed) {
    logger.log("error", `failed to process transaction for ${transactionid}`);
    return false;
  }

  await sendToBalanceQueue(transaction.issueeid, transaction.issueecurrencyid); // <-- credit balance
  await sendToBalanceQueue(transaction.issuerid, transaction.issuercurrencyid); // <-- debit balance

  logger.log("info", `process transaction for ${transactionid}`);
  return true;
}

export async function reverseTransactionQueue(
  logger: Logger,
  data: any
): Promise<boolean> {
  // TODO

  logger.log("info", `reverse transaction for ${data}`);
  return true;
}

export async function walletQueueProcess(
  logger: Logger,
  data: any
): Promise<boolean> {
  const content = JSON.parse(data.toString());
  const result = await createWallet(content.userId);

  if (result < 1) {
    logger.log("error", `wallet creation failed for ${content.userId}`);
    return false;
  }

  logger.log("info", `wallet created for ${content.userId}`);
  return true;
}

export async function balanceQueueProcess(
  logger: Logger,
  data: any
): Promise<boolean> {
  const content = JSON.parse(data.toString());

  // ignore holder wallet
  if (content.userid === "holder") {
    logger.log("info", `ignoring balancing wallet for holder`);
    return true;
  }

  const result = await balanceWallet(content.userid, content.currencyid);

  if (!result) {
    logger.log(
      "error",
      `balancing wallet for ${content.userid} currency ${content.currencyid} failed!`
    );
    return false;
  }

  logger.log(
    "info",
    `balancing wallet for ${content.userid} currency ${content.currencyid}`
  );
  return true;
}
