import openAI from "openai";
import { api } from "~/utils/api";
import fs from "fs";
import * as dotenv from "dotenv";

// dotenv.config({ path: "./config.env" });

const openai = new openAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});
//openai assistanse//
///////////////////////////////////
async function callChatGPTWithAssistance(input: string) {
  const assistant = await openai.beta.assistants.retrieve(
    "asst_OlVooj16vJ74tjhmCkjssxop",
  );

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: input,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });
  const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

  const messages = await openai.beta.threads.messages.list(thread.id);

  return messages.body.data.array.forEach((message) => {
    console.log(message.content);
  });
}
//openai functions//
////////////////////////////////////////////

//  DEFINE OUR HELLO WORLD  FUNCTION
const getAllActivities = () => {
  const { data } = api.post.getAll.useQuery();
  if (!data) return console.error("error");

  return data;
};

//DEFINE OUR GPT FUNTION
async function callChatGPTWithFunctions(input: string) {
  const messages = [
    {
      role: "system",
      content: "Perform function requests for the user",
    },

    {
      role: "user",
      content: input,
    },
  ];

  //STAP 1: CALL GPT WITH THE FUNCTION NAME
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,

    functions: [
      {
        name: "getAllActivities",
        description: "print hello world with the string passed to it ",
        parameters: {
          type: "object",
          properties: {
            appendString: {
              type: "string",
              decription: "the string to append to the hello world message ",
            },
          },
          required: ["appendString"],
        },
      },
    ],
    function_call: "auto",
  });

  const wantsToUseFunction = chatCompletion?.choices?.[0]?.message;

  let content = " ";

  // STAP 2 :check if gpt actually requesting a function
  if (wantsToUseFunction) {
    //STAP 3 : USE GPT ARGUMENTS TO CALL UR FUNCTION
    if (
      chatCompletion?.choices?.[0]?.message?.function_call?.name ==
      "getAllActivities"
    ) {
      // let argumentsObj = JSON.parse(
      //   chatCompletion.choices[0].message.function_call.arguments,
      // );

      content = getAllActivities();

      messages.push(chatCompletion.choices[0].message);

      messages.push({
        role: "function",
        name: "getAllActivities",

        content,
      });
    }
  }

  //STAP 4 COMPILE ALL THE INFO+APPEND IT TO THE MASSAGES SEND IT BACK TO GPT SO IT CAN FINALLY DECIDE HOW IT WANTS TO HANDEL THE RESPONSE OF THE FUNCTION AND ITS DATA
  const step4finalresponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,
  });

  //final response of gpt
  console.log(step4finalresponse?.choices?.[0]?.message.content);
}

export { callChatGPTWithFunctions, callChatGPTWithAssistance };
