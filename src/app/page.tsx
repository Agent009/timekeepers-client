"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Timeline } from "@ui/timeline";
import { CountdownTimer } from "@ui/timer";
import { getEpochSnapshot, randomRarity } from "@lib/utils";
import ExpandableCard from "@components/blocks/expandableCardGrid";
import { cards as minuteCards } from "@lib/timeCards";
import { constants } from "@lib/constants";
import { getApiUrl } from "@lib/api";
import { EpochData, EpochState, EpochStatus, EpochType } from "@customTypes/index.ts";
import { textToImage } from "@lib/server/livepeer";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";

export default function Home() {
  const [data, setData] = useState<EpochData[]>([]);
  const [epoches, setEpoches] = useState(getEpochSnapshot()); // Initialize state for epoches
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>([]);
  console.log("page -> data", data);

  const addData = async (newEntry: EpochData) => {
    await fetch(getApiUrl(constants.routes.api.data), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntry),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      // "/api/?startDate=2023-10-01&endDate=2023-10-02"
      const response = await fetch(getApiUrl(constants.routes.api.data));
      const result = await response.json();
      setData(result);
    };

    fetchData();

    const intervalId = setInterval(() => {
      setEpoches(getEpochSnapshot()); // Re-fetch the epoch snapshot every second
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    addData({
      type: EpochType.Minute,
      value: epoches.minute,
      isoDate: epoches.isoDateTime,
      ymdDate: epoches.fullDate,
      ymdhmDate: epoches.fullDateTime,
      state: EpochState.Past,
      status: EpochStatus.Queued,
      rarity: randomRarity(),
    }).then((r) => {
      console.log("Added minute epoch data", r);
      startTransition(async () => {
        const result = await textToImage({
          modelId: "SG161222/RealVisXL_V4.0_Lightning",
          prompt:
            "A beautiful sunset on a beach. In the bottom right of the picture, print the following timestamp: " +
            epoches.fullDateTime,
          width: 512,
          height: 512,
          guidanceScale: 7.5,
          negativePrompt: "ugly, deformed, gross, unnatural, unrealistic, poor quality, low res",
          safetyCheck: false,
          seed: epoches.minute,
          numInferenceSteps: 50,
          numImagesPerPrompt: 1,
        });
        if (result.success) {
          setImages((prevImages) => [...result.images, ...prevImages]);
        } else {
          console.error("Failed to generate minute epoch image", result);
        }
      });
    });
  }, [epoches.minute]);

  useEffect(() => {
    addData({
      type: EpochType.Hour,
      value: epoches.hour,
      isoDate: epoches.isoDateTime,
      ymdDate: epoches.fullDate,
      ymdhmDate: epoches.fullDateTime,
      state: EpochState.Past,
      status: EpochStatus.Queued,
      rarity: randomRarity(),
    });
  }, [epoches.hour]);

  useEffect(() => {
    addData({
      type: EpochType.Day,
      value: epoches.dayOfMonth,
      isoDate: epoches.isoDateTime,
      ymdDate: epoches.fullDate,
      ymdhmDate: epoches.fullDateTime,
      state: EpochState.Past,
      status: EpochStatus.Queued,
      rarity: randomRarity(),
    });
  }, [epoches.dayOfMonth]);

  useEffect(() => {
    addData({
      type: EpochType.Year,
      value: epoches.year,
      isoDate: epoches.isoDateTime,
      ymdDate: epoches.fullDate,
      ymdhmDate: epoches.fullDateTime,
      state: EpochState.Past,
      status: EpochStatus.Queued,
      rarity: randomRarity(),
    });
  }, [epoches.year]);

  const timelineData = [
    {
      title: "Minute " + epoches.minute,
      content: (
        <div>
          <div className="grid grid-cols-2 gap-4">
            <CountdownTimer key={epoches.minute} duration={60} initialRemainingTime={60 - epoches.second} />
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
          <ExpandableCard cards={minuteCards} />
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
      <p>{epoches.isoDateTime}</p>
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
