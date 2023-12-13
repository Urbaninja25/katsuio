import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="overflow-none flex h-screen  justify-center ">
      <div
        className=" flex w-full flex-col p-4"
        style={{ backgroundColor: "#4b5563" }}
      >
        {props.children}
      </div>
    </main>
  );
};
