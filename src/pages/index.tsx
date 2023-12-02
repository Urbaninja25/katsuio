import Head from "next/head";
import { useMemo, useState, useRef } from "react";
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
import dynamic from "next/dynamic";
import { MyMap } from "~/componenets/Map";

const CreateRequestPostWizard = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserNames, setIsLoadingUserNames] = useState(false);
  const [data, setData] = useState(null);
  const [userNamedata, setuserNameData] = useState(null);
  const [showResponse, setShowResponse] = useState(false);

  const substringsToCheck = [
    "hosted by",
    "can join",
    "Hosted by",
    "is hosting",
    "joining",
    "hostUsername",
    "hosting",
    "join",
    "offering",
    "with",
    "guided",
    "by",
    "location",
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
                  setShowResponse(false);
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
          </div>
        )}
      </div>

      {data && !isLoading && (
        <div className="flex flex-col  gap-2">
          <div>
            <Textarea
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
                isLoading={isLoadingUserNames}
                size="sm"
                color="secondary"
                variant="shadow"
                onClick={async () => {
                  try {
                    setIsLoadingUserNames(true);
                    const fetchedHostUsernames =
                      await callChatGPTWithFunctions(data);
                    console.log(fetchedHostUsernames); //ვიღებ აქ მაგ დატას

                    setuserNameData(fetchedHostUsernames);
                    setShowResponse(true);
                    setIsLoadingUserNames(false);
                  } catch {
                    console.error("Error fetching data:", Error);
                  }
                }}
              >
                show me more
              </Button>
            )}
          </div>
          {showResponse && !isLoadingUserNames && (
            <CreateResponsePostWizard userNameData={userNamedata} />
          )}
        </div>
      )}
    </div>
  );
};

const CreateResponsePostWizard = ({ userNameData }) => {
  console.log(userNameData);
  const { data, isLoading } = api.post.getAllByUserNames.useQuery({
    userNameData,
  });

  const Map = useMemo(
    () =>
      dynamic(() => import("../componenets/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );
  console.log(Map);
  if (isLoading) {
    return <div>Loading...NU SHEMCEM</div>;
  }
  if (!data) return <div>faillll</div>;
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" size={"sm"}>
        {data.map((item, index) => (
          <Tab key={index} title={item.hostUsername}>
            <Card>
              <CardBody>
                <div className="mb-2 border-b border-gray-300 ">
                  {item.description}
                </div>

                <Map className="mt-1" position={item.location.split(",")} />
              </CardBody>
            </Card>
          </Tab>
        ))}
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
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton className="focus:shadow-outline h-10 rounded-lg bg-purple-600 px-5 text-violet-200 transition-colors duration-150 hover:bg-gray-800" />
          </div>
        )}
      </main>
    </PageLayout>
  );
};

export default Home;
