import amqplib from "amqplib";

const amqp_url = process.env.AMQP_URL;
const balanceQueue = process.env.BALANCE_QUEUE;

export async function sendToBalanceQueue(userid: string, currencyid: string) {
  const amqpConnection = await amqplib.connect(amqp_url!, function (err: any) {
    if (err) {
      throw err;
    }
  });

  const balanceChannel = await amqpConnection.createChannel();
  balanceChannel.assertQueue(balanceQueue!, { durable: true });

  balanceChannel.sendToQueue(
    balanceQueue!,
    Buffer.from(JSON.stringify({ userid, currencyid }))
  );
}
