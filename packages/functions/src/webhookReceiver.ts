import { ApiHandler } from 'sst/node/api';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sns = new SNSClient({});

export const handler = ApiHandler(async (_evt) => {
  const topicArn = process.env.TOPIC_ARN;

  if (!topicArn) {
    throw new Error('TOPIC_ARN is not defined');
  }

  console.log(topicArn);

  await sns.send(
    new PublishCommand({
      TopicArn: topicArn,
      Message: 'Hello world',
    }),
  );

  return {
    statusCode: 200,
    body: `Hello world. The time is ${new Date().toISOString()}`,
  };
});
