"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
import {
  EpochData,
  EpochRarity,
  EpochSnapshot,
  EpochType,
  rarityGradientColors,
  TimeCardsResponse,
} from "@customTypes/index";
import ExpandableCard from "@components/blocks/expandableCardGrid";
import { getApiUrl } from "@lib/api";
import { constants } from "@lib/constants";
import { getCurrentEpoch, getEpochSnapshot, getFutureEpochs } from "@lib/epochUtils";
import { textToImage } from "@lib/server/livepeer";
import { getTimeCards } from "@lib/timeCards";
import { Timeline } from "@ui/timeline";
import { CountdownTimer } from "@ui/timer";

export default function Home() {
  const [data, setData] = useState<EpochData[]>([]);
  const [snapshot, setSnapshot] = useState(getEpochSnapshot());
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const futureSlots = 3;
  const [minuteCards, setMinuteCards] = useState<TimeCardsResponse>();
  // Mutable ref object that persists for the full lifetime of the component.
  // It does not cause re-renders when its value changes, and hence solves the infinite re-renders issue.
  const isFetchingRef = useRef(false);
  console.log("page -> isMounted", isMounted, "isPending", isPending, "isFetchingRef", isFetchingRef);
  // console.log("page -> data", data);

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return; // Prevent multiple fetches
    console.log("page -> fetchData");
    isFetchingRef.current = true; // Set fetching status to true

    try {
      // "/api/?startDate=2023-10-01&endDate=2023-10-02"
      const response = await fetch(getApiUrl(constants.routes.api.data));
      const result = await response.json();
      // console.log("page -> fetchData -> result", result);

      if (!result?.error) {
        setData(result);
      }
    } catch (error) {
      console.error("page -> fetchData -> error", error);
    } finally {
      isFetchingRef.current = false; // Reset fetching status
    }
  }, []); // No dependencies, so it won't be recreated

  const addData = useCallback(async (newEntry: EpochData, upsert: boolean = true) => {
    const response = await fetch(getApiUrl(constants.routes.api.data, { upsert: upsert }), {
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

  const handleEpochData = useCallback(
    (type: EpochType, snapshot: EpochSnapshot) => {
      console.log(`page -> handleEpochData -> ${type} epoch`);

      // Add current epoch data
      // TODO: Ensure adding the current epoch doesn't replace previously generated future epochs.
      addData(getCurrentEpoch(type, snapshot, data))
        .then((r) => {
          const d: EpochData = r.document;
          const actionStr = r.updated ? "updated" : "added";
          console.log(`page -> handleEpochData -> ${actionStr} ${type} epoch data`, d.value, d.rarity, r);

          // Only generate an image if the epoch data was stored for the first time.
          if (r.success && !r.updated && 0) {
            startTransition(async () => {
              const result = await textToImage({
                prompt: "A beautiful sunset on a beach with the following text in the bottom right: " + d.ymdhmDate,
                seed: d.value,
                epochType: d.type,
                ymdhmDate: d.ymdhmDate,
              });

              if (result.success) {
                setImages((prevImages) => [...result.images, ...prevImages]);
              } else {
                console.error(`page -> handleEpochData -> failed to generate ${type} epoch image`, result);
              }
            });
          }
        })
        .catch((error) => {
          console.error(`page -> handleEpochData -> error adding ${type} epoch data:`, error.message);
        });

      // Get future epochs
      const futureEpochs: EpochData[] = getFutureEpochs(type, snapshot.isoDateTime, futureSlots);
      // Filter out existing epochs
      const newFutureEpochs: EpochData[] = futureEpochs.filter((epoch) => {
        // Check if the epoch doesn't already exist in the data array
        return !data.some(
          (existingEpoch) =>
            existingEpoch.type === epoch.type &&
            existingEpoch.value === epoch.value &&
            existingEpoch.ymdhmDate === epoch.ymdhmDate,
        );
      });

      // Add only new future epochs
      newFutureEpochs.forEach((epoch) => {
        addData(epoch, false)
          .then((r) => {
            const d: EpochData = r.document;
            const actionStr = r.updated ? "updated" : "added";
            console.log(`page -> handleEpochData -> ${actionStr} future ${type} epoch data`, d.value, d.rarity, r);
          })
          .catch((error) => {
            console.error(`page -> handleEpochData -> error adding future ${type} epoch data:`, error.message);
          });
      });
    },
    [data, addData],
  );

  // Fetch the epoch snapshot every second
  useEffect(() => {
    console.log("page -> useEffect -> init -> getEpochSnapshot");
    const intervalId = setInterval(() => {
      setSnapshot(getEpochSnapshot());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Fetch the data every 10 seconds
  useEffect(() => {
    console.log("page -> useEffect -> init -> fetchData");
    const fetchAndSetData = async () => {
      try {
        await fetchData();
        setIsMounted(true);
      } catch (error) {
        console.error("page -> useEffect -> init -> fetchAndSetData -> error", error);
      }
    };

    // Initial fetch
    fetchAndSetData().then(() => console.log("page -> useEffect -> init -> fetchAndSetData success"));

    const intervalId = setInterval(() => {
      // noinspection JSIgnoredPromiseFromCall
      fetchData();
    }, 10500);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [fetchData]);

  // Calculate and store the currently elapsed and future epochs
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    handleEpochData(EpochType.Minute, snapshot);
    setMinuteCards(getTimeCards(EpochType.Minute, snapshot.minute, snapshot.fullDateTime, data));
  }, [isMounted, handleEpochData, snapshot.minute]);

  // useEffect(() => {
  //   if (!isMounted) {
  //     return;
  //   }
  //
  //   handleEpochData(EpochType.Hour, snapshot);
  // }, [isMounted, handleEpochData, snapshot.hour]);
  //
  // useEffect(() => {
  //   if (!isMounted) {
  //     return;
  //   }
  //
  //   handleEpochData(EpochType.Day, snapshot);
  // }, [isMounted, handleEpochData, snapshot.dayOfMonth]);
  //
  // useEffect(() => {
  //   if (!isMounted) {
  //     return;
  //   }
  //
  //   handleEpochData(EpochType.Month, snapshot);
  // }, [isMounted, handleEpochData, snapshot.month]);
  //
  // useEffect(() => {
  //   if (!isMounted) {
  //     return;
  //   }
  //
  //   handleEpochData(EpochType.Year, snapshot);
  // }, [isMounted, handleEpochData, snapshot.year]);

  const timelineData = useMemo(() => {
    const minuteRarity = getCurrentEpoch(EpochType.Minute, snapshot, data)?.rarity || EpochRarity.Common;
    const minuteStartColor = rarityGradientColors[minuteRarity].start;
    const minuteEndColor = rarityGradientColors[minuteRarity].start;
    const minuteClass = `text-gradient-${minuteRarity}`;
    return [
      {
        title: "Minute " + snapshot.minute,
        titleClass: minuteClass,
        subheadingClass: minuteClass,
        subheading: minuteRarity,
        content: (
          <div>
            <div className="flex flex-col items-center justify-center gap-2 my-3">
              <h2 className="mb-4 text-xl font-semibold">Minted & Upcoming Epochs</h2>
              <div className="grid grid-cols-3 gap-2">
                <ExpandableCard cards={minuteCards?.pastCards || []} />
                <CountdownTimer
                  key={snapshot.minute}
                  duration={60}
                  initialRemainingTime={60 - snapshot.second}
                  // @ts-expect-error ignore
                  colors={[minuteStartColor, minuteEndColor]}
                  colorsTime={[60, 40]}
                />
                <ExpandableCard cards={minuteCards?.futureCards || []} />
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
                  <h2 className="mb-4 text-xl font-semibold">Minted NFTs</h2>
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
        title: "Hour " + snapshot.hour,
        content: <div>It's coming.</div>,
      },
      {
        title: "" + snapshot.dayName,
        content: (
          <div>
            {snapshot.fullDate}
            <br />
            It's coming.
          </div>
        ),
      },
      {
        title: "" + snapshot.monthName,
        content: (
          <div>
            {snapshot.year}
            <br />
            It's coming.
          </div>
        ),
      },
      {
        title: "" + snapshot.year,
        content: <div>It's coming.</div>,
      },
    ];
  }, [snapshot.minute, minuteCards]);

  // const TimelineMemo = React.memo(({ data }: { data: TimelineEntry[] }) => {
  //   return <Timeline data={data} />;
  // });

  if (!isMounted) {
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
      <p>{isMounted ? snapshot.isoDateTime : "Loading..."}</p> {/* Render only after mount */}
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
