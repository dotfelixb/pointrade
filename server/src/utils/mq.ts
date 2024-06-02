import amqplib from "amqplib";

const amqp_url = process.env.AMQP_URL;
const verifyQueue = process.env.VERIFY_EMAIL_QUEUE;
const walletQueue = process.env.WALLET_QUEUE;

export async function sendToEmailQueue(email: string, token: string) {
  const amqpConnection = await amqplib.connect(amqp_url!, function (err: any) {
    if (err) {
      throw err;
    }
  });
  const verifyChannel = await amqpConnection.createChannel();
  verifyChannel.assertQueue(verifyQueue!, { durable: true });
  
  verifyChannel.sendToQueue(
    verifyQueue!,
    Buffer.from(JSON.stringify({ email, token }))
  );
}


export async function sendToWalletQueue(userId: string) {
  const amqpConnection = await amqplib.connect(amqp_url!, function (err: any) {
    if (err) {
      throw err;
    }
  });
  const walletChannel = await amqpConnection.createChannel();
  walletChannel.assertQueue(verifyQueue!, { durable: true });
  
  walletChannel.sendToQueue(
    walletQueue!,
    Buffer.from(JSON.stringify({ userId }))
  );
}