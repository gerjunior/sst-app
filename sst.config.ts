import { SSTConfig } from 'sst';
import { WebhookListener } from './stacks/Webhook';

export default {
  config(_input) {
    return {
      name: 'my-sst-app',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(WebhookListener);
  },
} satisfies SSTConfig;
