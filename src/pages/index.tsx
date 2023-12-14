import { useMemo, useState, useEffect } from "react";

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
import toast from "react-hot-toast";
import CustomToast from "~/componenets/toast";
import { SkeletonComponent } from "~/componenets/Skeleton";
import Image from "next/image";
import { LoadingWithPercentage } from "~/componenets/LoadingSpinner";

const CreateRequestPostWizard = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserNames, setIsLoadingUserNames] = useState(false);
  const [data, setData] = useState(null);
  const [userNamedata, setuserNameData] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [showBtn, setShowBtn] = useState(true);

  // Handle  post btn click
  const handleDataFetch = async () => {
    try {
      setData(null);
      setIsLoading(true);
      setShowResponse(false);

      const fetchedDataAssistance = await callChatGPTWithAssistance(input);

      setData(fetchedDataAssistance);
      setShowBtn(true);
    } catch {
      CustomToast({
        message:
          "Server high traffic. Retry in 30 secs. Apologies for inconvenience; project in experimental phase",
      });
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  // Handle Enter key press in the input
  const handleEnterKey = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setIsLoading(true);
      e.preventDefault();
      if (input !== "") {
        try {
          await handleDataFetch();
        } catch (error) {
          // Handle errors if needed
        }
      }
      setIsLoading(false);
    }
  };

  const fetchHostUsernames = async () => {
    try {
      setIsLoadingUserNames(true);

      const fetchedHostUsernames = await callChatGPTWithFunctions(data);

      setuserNameData(fetchedHostUsernames);
      setShowResponse(true);
      setShowBtn(false);
    } catch {
      CustomToast({
        message:
          "Server high traffic. Retry in 60 secs. Apologies for inconvenience; project in experimental phase",
      });
    } finally {
      setIsLoadingUserNames(false);
    }
  };

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
    "host",
    "Host",
  ];

  return (
    <div className="w-full flex-col flex-nowrap gap-4 ">
      <div className="flex  flex-nowrap gap-4  ">
        <Input
          type="text"
          label=" find your unique experiancies"
          placeholder="🧙 hey katsuio,what can i expore today?"
          disabled={isLoading}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleEnterKey}
        />

        {input !== "" && (
          <div>
            <div>
              <Button
                isLoading={isLoading}
                size="sm"
                color="secondary"
                variant="shadow"
                onClick={handleDataFetch}
              >
                Post
              </Button>
            </div>
            {isLoading && (
              <div>
                <LoadingWithPercentage />
              </div>
            )}
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
            {substringsToCheck.some((substring) => data.includes(substring)) &&
              showBtn && (
                <Button
                  isLoading={isLoadingUserNames}
                  size="sm"
                  color="secondary"
                  variant="shadow"
                  onClick={fetchHostUsernames}
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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [loadingLocation, setIsLoading] = useState(true);
  const [geolocationDenied, setGeolocationDenied] = useState(false);

  const { data, isLoading } = api.post.getAllByUserNames.useQuery({
    userNameData,
  });

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setGeolocationDenied(true); // Set flag if user denies geolocation
          setIsLoading(false);
        },
      );
    } else {
      setGeolocationDenied(true); // Set flag if geolocation is not supported
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // Show toast only if geolocation was denied
  useEffect(() => {
    if (geolocationDenied) {
      CustomToast({
        message:
          "Katsuio requires access to your current location to provide you with the complete experience. Please adjust your browser settings to allow Katsuio access to your location",
      });
    }
  }, [geolocationDenied]);
  const Map = useMemo(
    () =>
      dynamic(() => import("../componenets/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );

  if (isLoading) {
    return <SkeletonComponent />;
  }

  if (!data) {
    CustomToast({
      message: "Database communication problem—fix in progress!",
    });
    return (
      <div className="flex h-80 items-center justify-center">
        <p className="text-red-500">
          Database communication problem—fix in progress!
        </p>
      </div>
    );
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat1)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  return (
    <div className="flex w-full flex-col">
      {!loadingLocation && (
        <Tabs aria-label="Options" size="sm">
          {data.map((item, index) => (
            <Tab
              key={index}
              title={
                userLocation && (
                  <div className="flex items-center">
                    <p className="flex-none text-xs">{item.hostUsername}</p>
                    <div className="w-2.5"></div>
                    {/* <Button
                      disabled
                      size="sm"
                      radius="full"
                      color="success"
                      className="flex-1"
                    >
                      {calculateDistance(
                        userLocation[0],
                        userLocation[1],
                        parseFloat(item.location.split(",")[0]),
                        parseFloat(item.location.split(",")[1]),
                      ).toFixed(2) + " km"}
                    </Button> */}
                  </div>
                )
              }
            >
              <Card>
                <CardBody>
                  <div className="mb-2 border-b border-gray-300 ">
                    {item.description}
                  </div>

                  <Map className="mt-1 " position={item.location.split(",")} />
                </CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <PageLayout>
      <div className="flex justify-center gap-4 p-4">
        <div className="flex flex-col items-center">
          <div>
            <Image
              src="/images/jantonalcor_snail.svg"
              alt="Logo"
              width={80}
              height={300}
              priority
            />
          </div>
          <p>KatsuioAI</p>
        </div>
        <CreateRequestPostWizard />
      </div>
    </PageLayout>
  );
};
export default Home;
