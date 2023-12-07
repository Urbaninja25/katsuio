import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const SkeletonComponent = () => (
  <div style={{ display: "flex" }}>
    <Skeleton containerClassName="flex-1" count={15} />
  </div>
);
