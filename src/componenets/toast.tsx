import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";

// const CustomToast = ({ message }) => {
//   toast.custom((t) => (
//     <div
//       className={`${
//         t.visible ? "animate-enter" : "animate-leave"
//       } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
//     >
//       <div className="w-0 flex-1 p-4">
//         <div className="flex items-start">
//           <div className="flex-shrink-0 pt-0.5">
//             <img
//               className="h-10 w-10 rounded-full"
//               src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
//               alt="image of our ceo "
//             />
//           </div>
//           <div className="ml-3 flex-1">
//             <p className="text-sm font-medium text-gray-900">Emilia Gates</p>
//             <p className="mt-1 text-sm text-gray-500">{message}</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex border-l border-gray-200">
//         <button
//           onClick={() => toast.dismiss(t.id)}
//           className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   ));
// };

const CustomToast = ({ message }) => {
  toast.custom((t) => (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://info.parliament.ge/hr/image/1/colleague/2106"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">Guguli Magradze</p>
          <p className="text-small text-default-500">server princess</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{message}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://github.com/Urbaninja25/katsuio"
        >
          Visit source code on GitHub.
        </Link>
      </CardFooter>
    </Card>
  ));
};

export default CustomToast;
