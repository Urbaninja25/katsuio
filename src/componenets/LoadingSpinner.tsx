import React, { useState, useEffect } from "react";

const LoadingComponent = () => {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow((prevNow) => {
        const updatedNow = prevNow + 1;
        return updatedNow <= 100 ? updatedNow : prevNow; // Limit to 100%
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <progress className="w-full flex-1 " value={now} max={100} />
    </>
  );
};

export const LoadingWithPercentage = () => {
  return (
    <div className="flex">
      <style>
        {`
          progress::-webkit-progress-value {
            background: #7c3aed
          }
        `}
      </style>
      <LoadingComponent />
    </div>
  );
};
