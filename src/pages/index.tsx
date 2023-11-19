import Head from "next/head";
import { useState } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "~/utils/api";

import {
  callChatGPTWithFunctions,
  callChatGPTWithAssistance,
} from "~/server/helper/openai";

import { PageLayout } from "~/componenets/layout";
import { LoadingPage, LoadingSpinner } from "~/componenets/loading";

const CreateRequestWizard = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null); // State to hold the retrieved data

  return (
    <div>
      <label
        htmlFor="question for assistance api"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        find your unique experiancies
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">🤖</span>
        </div>
        <div className="flex w-full items-center justify-between gap-3">
          <input
            type="text"
            name="question"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-800 sm:text-sm sm:leading-6"
            placeholder="What can I explore today?"
            disabled={isLoading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                setInput("");
                setIsLoading(true);
                e.preventDefault();
                if (input !== "") {
                  const fetchedData = await callChatGPTWithAssistance(input);
                  setData(fetchedData); // Set the retrieved data in the state
                }
                setIsLoading(false);
              }
            }}
          />
        </div>
      </div>

      {input !== "" && !isLoading && (
        <button
          className="focus:shadow-outline h-10 rounded-lg bg-purple-600 px-5 text-violet-200 transition-colors duration-150 hover:bg-gray-800"
          onClick={async () => {
            setIsLoading(true);
            try {
              setInput("");
              const fetchedData = await callChatGPTWithAssistance(input);
              setData(fetchedData); // Set the retrieved data in the state
            } catch {
              console.error("Error fetching data:", Error);
            }
            setIsLoading(false);
          }}
        >
          post
        </button>
      )}

      {isLoading && (
        <div className="flex items-center">
          <LoadingSpinner size={20} />
        </div>
      )}

      {/* Display data if available */}
      {data && !isLoading && (
        <div className="mt-4">
          <div className="rounded-lg bg-gray-200 p-4">
            <p className="text-sm text-gray-700">{data}</p>
          </div>
        </div>
      )}
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

      <main className="flex bg-gray-100 p-4">
        {isSignedIn && <UserButton afterSignOutUrl="/" />}

        <div className="mx-auto max-w-md">
          <h1 className="mb-2 text-lg font-semibold">
            KatsuioAI is on her way to help!💜
          </h1>
          {isSignedIn && <CreateRequestWizard />}
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton className="focus:shadow-outline h-10 rounded-lg bg-purple-600 px-5 text-violet-200 transition-colors duration-150 hover:bg-gray-800" />
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default Home;
