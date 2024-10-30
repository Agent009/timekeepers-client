"use client";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { getEpochSnapshot } from "@lib/epochUtils";
import { AppContext } from "@lib/providers/provider";
import { Layer } from "@components/ui/Layer";

export default function Home() {
  const { layer } = React.useContext(AppContext);
  const [snapshot, setSnapshot] = useState(getEpochSnapshot());
  console.log("page -> layer", layer);

  // Fetch the epoch snapshot every second
  useEffect(() => {
    console.log("page -> useEffect -> init -> getEpochSnapshot");
    const intervalId = setInterval(() => {
      setSnapshot(getEpochSnapshot());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  if (!layer || !snapshot) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress size={100} />
      </div>
    );
  }

  // console.log(
  //   "page -> minuteCards",
  //   minuteCards,
  //   "pastCards",
  //   minuteCards?.pastCards?.length,
  //   "futureCards",
  //   minuteCards?.futureCards?.length,
  // );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Timekeepers Demo</h1>
      <p>{snapshot.isoDateTime}</p>
      <Layer layer={layer} snapshot={snapshot} />
    </main>
  );
}
