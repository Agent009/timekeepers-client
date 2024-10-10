"use client";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
import { EpochData, EpochState, EpochStatus, EpochType } from "@customTypes/index";
import ExpandableCard from "@components/blocks/expandableCardGrid";
import { getApiUrl } from "@lib/api";
import { constants } from "@lib/constants";
import { textToImage } from "@lib/server/livepeer";
import { getEpochSnapshot, randomRarity } from "@lib/utils";
import { Timeline } from "@ui/timeline";
import { getTimeCards } from "@lib/timeCards";
import { CountdownTimer } from "@ui/timer";

export default function Home() {
  const [data, setData] = useState<EpochData[]>([]);
  const [epoches, setEpoches] = useState(getEpochSnapshot());
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  // console.log("page -> isMounted", isMounted, "isPending", isPending);
  // console.log("page -> data", data);

  const addData = useCallback(async (newEntry: EpochData) => {
    const response = await fetch(getApiUrl(constants.routes.api.data), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntry),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Parse the error response
      throw new Error(errorData.message || "Error saving data"); // Throw an error with the message
    }

    return await response.json(); // Return the parsed JSON response
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // "/api/?startDate=2023-10-01&endDate=2023-10-02"
      console.log("page -> useEffect -> fetchData");
      const response = await fetch(getApiUrl(constants.routes.api.data));
      const result = await response.json();
      setData(result);
    };

    fetchData().then(() => setIsMounted(true));

    const intervalId = setInterval(() => {
      setEpoches(getEpochSnapshot()); // Re-fetch the epoch snapshot every second
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    console.log("page -> useEffect -> addData -> minute epoch");
    addData({
      type: EpochType.Minute,
      value: epoches.minute,
      isoDate: epoches.isoDateTime,
      ymdDate: epoches.fullDate,
      ymdhmDate: epoches.fullDateTime,
      state: EpochState.Past,
      status: EpochStatus.Queued,
      rarity: randomRarity(),
    })
      .then((r) => {
        console.log("Added minute epoch data", r);

        // Only generate an image if the epoch data was stored for the first time.
        if (r.success && !r.updated) {
          startTransition(async () => {
            const result = await textToImage({
              prompt:
                "A beautiful sunset on a beach with the following text in the bottom right: " + epoches.fullDateTime,
              seed: epoches.minute,
              epochType: EpochType.Minute,
              ymdhmDate: epoches.fullDateTime,
            });

            if (result.success) {
              setImages((prevImages) => [...result.images, ...prevImages]);
            } else {
              console.error("Failed to generate minute epoch image", result);
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error adding minute epoch data:", error.message);
      });
  }, [isMounted, epoches.minute]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    console.log("page -> useEffect -> addData -> hour epoch");
    addData({
      type: EpochType.Hour,
      value: epoches.hour,
      isoDate: epoches.isoDateTime,
      ymdDate: epoches.fullDate,
      ymdhmDate: epoches.fullDateTime,
      state: EpochState.Past,
      status: EpochStatus.Queued,
      rarity: randomRarity(),
    })
      .then((r) => {
        console.log("Added hour epoch data", r);
      })
      .catch((error) => {
        console.error("Error adding hour epoch data:", error.message);
      });
  }, [isMounted, epoches.hour]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    console.log("page -> useEffect -> addData -> day epoch");
    addData({
      type: EpochType.Day,
      value: epoches.dayOfMonth,
      isoDate: epoches.isoDateTime,
      ymdDate: epoches.fullDate,
      ymdhmDate: epoches.fullDateTime,
      state: EpochState.Past,
      status: EpochStatus.Queued,
      rarity: randomRarity(),
    })
      .then((r) => {
        console.log("Added day epoch data", r);
      })
      .catch((error) => {
        console.error("Error adding day epoch data:", error.message);
      });
  }, [isMounted, epoches.dayOfMonth]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    console.log("page -> useEffect -> addData -> year epoch");
    addData({
      type: EpochType.Year,
      value: epoches.year,
      isoDate: epoches.isoDateTime,
      ymdDate: epoches.fullDate,
      ymdhmDate: epoches.fullDateTime,
      state: EpochState.Past,
      status: EpochStatus.Queued,
      rarity: randomRarity(),
    })
      .then((r) => {
        console.log("Added year epoch data", r);
      })
      .catch((error) => {
        console.error("Error adding year epoch data:", error.message);
      });
  }, [isMounted, epoches.year]);

  const minuteCards = getTimeCards(EpochType.Minute, epoches.minute, epoches.fullDateTime, data);
  const timelineData = [
    {
      title: "Minute " + epoches.minute,
      content: (
        <div>
          <div className="grid grid-cols-2 gap-4">
            <CountdownTimer key={epoches.minute} duration={60} initialRemainingTime={60 - epoches.second} />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 my-3">
            <h2 className="mb-4 text-xl font-semibold">Minted & Upcoming Epochs</h2>
            <div className="grid grid-cols-2 gap-4">
              <ExpandableCard cards={minuteCards?.pastCards} />
              <ExpandableCard cards={minuteCards?.futureCards} />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 my-3">
            {isPending && (
              <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={(theme) => ({
                  color: "#1a90ff",
                  animationDuration: "550ms",
                  position: "absolute",
                  left: 0,
                  [`& .${circularProgressClasses.circle}`]: {
                    strokeLinecap: "round",
                  },
                  ...theme.applyStyles("dark", {
                    color: "#308fe8",
                  }),
                })}
                size={40}
                thickness={4}
              />
            )}
            {images.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">Generated Images</h2>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Generated Image ${index + 1}`}
                      className="h-auto w-full rounded-lg shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Hour " + epoches.hour,
      content: <div>It's coming.</div>,
    },
    {
      title: "" + epoches.dayName,
      content: (
        <div>
          {epoches.fullDate}
          <br />
          It's coming.
        </div>
      ),
    },
    {
      title: "" + epoches.monthName,
      content: (
        <div>
          {epoches.year}
          <br />
          It's coming.
        </div>
      ),
    },
    {
      title: "" + epoches.year,
      content: <div>It's coming.</div>,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Timekeepers Demo</h1>
      <p>{isMounted ? epoches.isoDateTime : "Loading..."}</p> {/* Render only after mount */}
      <div className="w-full">
        <div className="flex overflow-x-auto">
          <div className="min-w-[200px] p-4">
            {/*<Card*/}
            {/*  title={item.title}*/}
            {/*  content={item.content}*/}
            {/*  rarity={item.rarity}*/}
            {/*  isCurrent={item.isCurrent}*/}
            {/*  isNext={item.isNext}*/}
            {/*  isPrevious={item.isPrevious}*/}
            {/*/>*/}
          </div>
        </div>
      </div>
      <div className="w-full">
        <Timeline data={timelineData} />
      </div>
    </main>
  );
}
