import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORG_ID,
  apiKey: process.env.CHATGPT_API,
});

const openai = new OpenAIApi(configuration);

async function handler(req, res) {
  if (req.method === 'POST') {
    const { message} = req.body;


    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: message}],
    });
    console.log(completion.data.choices[0].message);


    res.status(200).json({ message: 'It works!', response: completion.data });
  }
  res.status(200).json({ message: 'Hey!' });
}

export default handler;