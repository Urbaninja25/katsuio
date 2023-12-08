import React, { useState, useEffect } from "react";
import CustomToast from "~/componenets/toast";

const LoadingComponent = () => {
  const [now, setNow] = useState(0);
  const [showToast, setShowToast] = useState(false); // New state for toast

  useEffect(() => {
    const interval = setInterval(() => {
      setNow((prevNow) => {
        const updatedNow = prevNow + 1;
        if (updatedNow === 30) {
          setShowToast(true); // Set flag to show toast
        }
        return updatedNow <= 100 ? updatedNow : prevNow; // Limit to 100%
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showToast) {
      CustomToast({
        message:
          "Apologies for the extended wait. Our servers are experiencing high traffic. We'll require an additional 15 seconds 🚀",
      });
      setShowToast(false); // Reset flag after showing toast
    }
  }, [showToast]);

  return (
    <>
      <progress className="w-full" value={now} max={100} />
    </>
  );
};

export const LoadingWithPercentage = () => {
  return (
    <div>
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
