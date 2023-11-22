import Head from "next/head";
import { useState } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { type NextPage } from "next";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

import { api } from "~/utils/api";

import {
  callChatGPTWithFunctions,
  callChatGPTWithAssistance,
} from "~/server/helper/openai";

import { PageLayout } from "~/componenets/layout";
import { LoadingPage, LoadingSpinner } from "~/componenets/loading";

const CreateRequestPostWizard = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const substringsToCheck = [
    "hosted by",
    "can join",
    "Hosted by",
    "is hosting",
    "joining",
    "hostUsername",
  ];

  return (
    <div className="w-full flex-col flex-nowrap gap-4 md:flex-nowrap">
      <div className="flex  flex-nowrap gap-4 md:flex-nowrap">
        <Input
          type="text"
          label=" find your unique experiancies"
          placeholder="🧙 hey katsuio,what can i expore today?"
          disabled={isLoading}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              setIsLoading(true);
              e.preventDefault();
              if (input !== "") {
                const fetchedDataAssistance =
                  await callChatGPTWithAssistance(input);
                console.log(fetchedDataAssistance);

                setData(fetchedDataAssistance);
              }
              setInput("");
              setIsLoading(false);
            }
          }}
        />

        {input !== "" && (
          <div>
            <Button
              isLoading={isLoading}
              size="sm"
              color="secondary"
              variant="shadow"
              onClick={async () => {
                try {
                  setIsLoading(true);

                  const fetchedDataAssistance =
                    await callChatGPTWithAssistance(input);
                  console.log(fetchedDataAssistance);

                  setData(fetchedDataAssistance);
                } catch {
                  console.error("Error fetching data:", Error);
                } finally {
                  setIsLoading(false); // Ensure isLoading is set to false after operation completes
                  setInput("");
                }
              }}
            >
              Post
            </Button>
            {/* <Button
              color="primary"
              onClick={async () => {
                try {
                  const data = await callChatGPTWithFunctions();
                  console.log(data);
                } catch (error) {
                  // <-- Catch the error instance
                  console.error("Error fetching data:", error.message); // <-- Log the error message
                }
              }}
            >
              check
            </Button> */}
          </div>
        )}
      </div>

      {data && !isLoading && (
        <div className="flex flex-col  gap-2">
          <div>
            <Textarea
              isDisabled
              label="your beez"
              labelPlacement="outside"
              placeholder="enter your question"
              defaultValue={data}
              className="w-full"
            />
          </div>
          <div>
            {substringsToCheck.some((substring) =>
              data.includes(substring),
            ) && (
              <Button
                // isLoading={isLoading}
                size="sm"
                color="secondary"
                variant="shadow"
                onClick={async () => {
                  try {
                    const hostUsernames = await callChatGPTWithFunctions(data);
                    console.log(hostUsernames);
                  } catch {
                    console.error("Error fetching data:", Error);
                  }
                }}
              >
                show me more
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CreateResponsePostWizard = ({ data }) => {
  return (
    <div className="flex w-full flex-col p-4">
      <div>
        <Textarea
          isDisabled
          label="your beez"
          labelPlacement="outside"
          placeholder="enter your question"
          defaultValue={data}
          className="w-full"
        />
      </div>
      <Tabs aria-label="Options">
        <Tab key="photos" title="Photos">
          <Card>
            <CardBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="music" title="Music">
          <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="videos" title="Videos">
          <Card>
            <CardBody>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  if (!userLoaded) return <div />;
  return (
    <PageLayout>
      <Head>
        <title>Create your unique experiancies</title>

        <meta name="description" content="Generated by create-t3-app" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center gap-4 bg-gray-100 p-4">
        <div className="  mx-auto max-w-md flex-auto   p-2 ">
          <Button color="secondary" radius="full" variant="shadow">
            my activities!
          </Button>
        </div>
        {isSignedIn && <CreateRequestPostWizard />}

        {isSignedIn && <UserButton afterSignOutUrl="/" />}
      </main>
    </PageLayout>
  );
};

export default Home;

// {!isSignedIn && (
//   <div className="flex justify-center">
//     <SignInButton className="focus:shadow-outline h-10 rounded-lg bg-purple-600 px-5 text-violet-200 transition-colors duration-150 hover:bg-gray-800" />
//   </div>
// )}
