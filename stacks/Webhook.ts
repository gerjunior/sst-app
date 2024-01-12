import { StackContext, Api, Topic, Queue } from 'sst/constructs';

export function WebhookListener({ stack }: StackContext) {
  stack.setDefaultFunctionProps({
    timeout: 10,
    memorySize: 128,
  });

  const api = new Api(stack, 'api', {
    defaults: {
      authorizer: 'none',
    },
    cors: {
      allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
      allowMethods: ['POST'],
      allowOrigins: ['*'],
    },
    routes: {
      'POST /': {
        type: 'function',
        function: {
          handler: 'packages/functions/src/webhookReceiver.handler',
          permissions: ['sns'],
        },
      },
    },
  });

  const topic = new Topic(stack, 'webhook-topic', {
    subscribers: {
      wallet_payments: {
        type: 'queue',
        cdk: {
          subscription: {
            filterPolicy: {},
          },
        },
        queue: new Queue(stack, 'wallet-payments-queue', {
          consumer: 'packages/functions/src/processors/walletPayments.handler',
        }),
      },
      stripe_payments: {
        type: 'queue',
        queue: new Queue(stack, 'stripe-payments-queue', {
          consumer: 'packages/functions/src/processors/stripePayments.handler',
        }),
      },
    },
  });

  api.getFunction('POST /')?.addEnvironment('TOPIC_ARN', topic.topicArn);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
