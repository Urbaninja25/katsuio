import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export const SignInPage = () => {
  console.log("signinpage!!!!");
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-700 px-6 py-12 lg:px-8">
      <div className="w-full text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 mt-8 flex items-center justify-center sm:flex-row sm:justify-center">
            <div className="mb-4 sm:mb-0 sm:mr-4">
              <Image
                width={700}
                height={100}
                src="/images/katsuioai-high-resolution-logo-transparent.png"
                alt="Your Company"
                priority
              />
            </div>
            <div className="whitespace-nowrap rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              <SignInButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
