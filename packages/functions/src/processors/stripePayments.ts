import { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent) => {
  const records = event.Records;

  console.log(records);

  return {};
};
