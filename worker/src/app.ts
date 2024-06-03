import nodemailer from "nodemailer";
import amqplib from "amqplib";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import winston from "winston";
import {
  transactionQueueProcess,
  verificationEmailQueue,
  walletQueueProcess,
  balanceQueueProcess,
} from "./process";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "meagan59@ethereal.email",
    pass: "qvmUBTQxbU2XCdYcfK",
  },
});

const amqp_url = process.env.AMQP_URL;
const verifyQueue = process.env.VERIFY_EMAIL_QUEUE;
const processQueue = process.env.PROCESS_QUEUE;
const reverseQueue = process.env.REVERSE_QUEUE;
const walletQueue = process.env.WALLET_QUEUE;
const balanceQueue = process.env.BALANCE_QUEUE;

const app = express();
const port = process.env.PORT || 4000;
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  // Use timestamp and printf to create a standard log format
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
  // Log to the console and a file
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

(async () => {
  const amqpConnection = await amqplib.connect(amqp_url!, function (err: any) {
    if (err) {
      throw err;
    }
  });

  const verifyChannel = await amqpConnection.createChannel();
  verifyChannel.assertQueue(verifyQueue!, { durable: true });
  verifyChannel.consume(verifyQueue!, async (data) => {
    const result = await verificationEmailQueue(logger, data?.content);

    if (result) {
      verifyChannel.ack(data!);
    }
  });

  const walletChannel = await amqpConnection.createChannel();
  walletChannel.assertQueue(walletQueue!, { durable: true });
  walletChannel.consume(walletQueue!, async (data) => {
    const result = await walletQueueProcess(logger, data?.content);
    if (result) {
      walletChannel.ack(data!);
    }
  });

  const processChannel = await amqpConnection.createChannel();
  processChannel.assertQueue(processQueue!, { durable: true });
  processChannel.consume(processQueue!, async (data) => {
    const result = await transactionQueueProcess(logger, data?.content);
    if (result) {
      processChannel.ack(data!);
    }
  });

  const balanceChannel = await amqpConnection.createChannel();
  balanceChannel.assertQueue(balanceQueue!, { durable: true });
  balanceChannel.consume(balanceQueue!, async (data) => {
    const result = await balanceQueueProcess(logger, data?.content);
    if (result) {
      balanceChannel.ack(data!);
    }
  });
})();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "worker!" });
});

app.listen(port, () => {
  logger.log("info", `worker running at http://localhost:`, port);
});
