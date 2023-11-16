import openAI from "openai";
import { api } from "~/utils/api";

const openai = new openAI({
  organization: process.env.OPEN_AI_ORGANIZATION_ID,
  apiKey: process.env.OPEN_AI_API_KEY,
});

//  DEFINE OUR HELLO WORLD  FUNCTION
const getAllActivities = () => {
  const { data } = api.post.getAll.useQuery();
  if (!data) return console.error("error");

  return data;
};

//DEFINE OUR GPT FUNTION
async function callChatGPTWithFunctions(question: string) {
  const messages = [
    {
      role: "system",
      content: "Perform function requests for the user",
    },

    {
      role: "user",
      content: question,
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

//აქ hardcode ვეუბნებით რო ესაა ის ტრინგი ძმაო რომელიც უნდა ჩასვაო
void callChatGPTWithFunctions();
