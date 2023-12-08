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
