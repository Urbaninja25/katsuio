import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="overflow-none flex h-screen  justify-center ">
      <div
        className=" flex w-full flex-col p-4"
        style={{ backgroundColor: "#4b5563" }}
      >
        <Providers>{props.children}</Providers>
      </div>
    </main>
  );
};
