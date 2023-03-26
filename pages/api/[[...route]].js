import { App } from '@slack/bolt';
import NextConnectReceiver from 'utils/NextConnectReceiver';
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORG_ID,
  apiKey: process.env.CHATGPT_API,
});

const openai = new OpenAIApi(configuration);

const receiver = new NextConnectReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || 'invalid',
  // The `processBeforeResponse` option is required for all FaaS environments.
  // It allows Bolt methods (e.g. `app.message`) to handle a Slack request
  // before the Bolt framework responds to the request (e.g. `ack()`). This is
  // important because FaaS immediately terminate handlers after the response.
  processBeforeResponse: true,
  customPropertiesExtractor: (req) => {
    return {
      "headers": req.headers
    };
  },
});

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver,
  developerMode: false,
});

app.event('message', async ({ event, context, client, message }) => {
  if (message.channel_type === 'im' && context.retryNum === undefined) {
    try {
      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.ts,
        text: 'I am on it, please wait for a while.',
      })

      await askChatGPT({message, text: message.text})
    }
    catch (error) {
      console.error(error);
    }
  }
});

app.event('app_mention', async ({ event, context, client }) => {
  if (context.retryNum === undefined) {
    const text = event.text?.replace(`<@${context.botUserId}> `, '')
    try {
      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.ts,
        text: 'I am on it, please wait for a while.',
      })

      await askChatGPT({message: event, text})
    }
    catch (error) {
      console.error(error);
    }
  }
});

const askChatGPT = async({message, text}) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: text}],
  });
  if (completion) {
    const result = await app.client.chat.postMessage({
      channel: message.channel,
      thread_ts: message.ts,
      text: `${completion.data.choices[0].message.content}`
    })
  }
  return false;
}

// this is run just in case
const router = receiver.start();

router.get('/api', (req, res) => {
  res.status(200).json({
    test: true,
  });
})

export default router;

