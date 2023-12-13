import openAI from "openai";

const openai = new openAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function callChatGPTWithAssistance(input: string) {
  try {
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

    const checkStatusAndPrintMessages = async (
      threadId: string,
      runId: string,
    ) => {
      const runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        runId,
      );
      if (runStatus.status === "completed") {
        const messages = await openai.beta.threads.messages.list(threadId);
        let conversation = "";

        messages.data.forEach((msg) => {
          const role = msg.role;
          const content = msg.content[0].text.value;

          if (role !== "user") {
            conversation += `${content}\n`;
          }
        });

        return conversation.trim();
      } else {
        throw new Error("Run is not completed yet.");
      }
    };

    const conversation = await new Promise<string>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await checkStatusAndPrintMessages(thread.id, run.id);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, 70000);
    });

    return conversation;
  } catch (error) {
    throw new Error(`Error in assistant function: ${error}`);
  }
}

async function callChatGPTWithFunctions(data: string) {
  const messages = [
    {
      role: "system",
      content: "Perform function requests for the user",
    },

    {
      role: "user",
      content: data,
    },
  ];

  //STAP 1: CALL GPT WITH THE FUNCTION NAME
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,

    functions: [
      {
        name: "get_Activities",
        description:
          "call function with proper host username or person username which hosting certain activity  as an  argument ",
        parameters: {
          type: "object",
          properties: {
            userNames: {
              type: "string",
              decription:
                "  host username or person username which hosting certain activity (e.g here It is hosted by Irakli Gharibashvili ,hostUsername will be Irakli Gharibashvili ) ",
            },
          },
          required: ["userNames"],
        },
      },
    ],
    function_call: "auto",
  });

  const wantsToUseFunction = chatCompletion?.choices?.[0]?.message;

  let content = " ";

  // STAP 2 :check if gpt actually requesting a function
  if (wantsToUseFunction) {
    //STAP 3 : USE GPT ARGUMENTS TO CALL FUNCTION

    if (
      chatCompletion?.choices?.[0]?.message?.function_call?.name ==
      "get_Activities"
    ) {
      let argumentsObj = JSON.parse(
        chatCompletion.choices[0].message.function_call.arguments,
      );

      content = argumentsObj.userNames;
    }
  }
  return content;
}
export { callChatGPTWithFunctions, callChatGPTWithAssistance };
