"use client";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
import { EpochData, EpochType } from "@customTypes/index";
import ExpandableCard from "@components/blocks/expandableCardGrid";
import { getApiUrl } from "@lib/api";
import { constants } from "@lib/constants";
import { getCurrentEpoch, getEpochSnapshot, getFutureEpochs } from "@lib/epochUtils";
import { textToImage } from "@lib/server/livepeer";
import { Timeline } from "@ui/timeline";
import { getTimeCards } from "@lib/timeCards";
import { CountdownTimer } from "@ui/timer";

export default function Home() {
  const [data, setData] = useState<EpochData[]>([]);
  const [snapshot, setSnapshot] = useState(getEpochSnapshot());
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const futureSlots = 3;
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

  const fetchData = useCallback(async () => {
    console.log("page -> fetchData");
    // "/api/?startDate=2023-10-01&endDate=2023-10-02"
    const response = await fetch(getApiUrl(constants.routes.api.data));
    const result = await response.json();
    setData(result);
  }, []);

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
    fetchData().then(() => setIsMounted(true));

    const intervalId = setInterval(() => {
      // noinspection JSIgnoredPromiseFromCall
      fetchData();
    }, 10500);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Calculate and store the currently elapsed and future epochs
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    // Store the currently elapsed epoch
    console.log("page -> useEffect -> minute epoch");
    addData(getCurrentEpoch(EpochType.Minute, snapshot))
      .then((r) => {
        console.log("Added minute epoch data", r);

        // Only generate an image if the epoch data was stored for the first time.
        if (r.success && !r.updated && 0) {
          startTransition(async () => {
            const result = await textToImage({
              prompt:
                "A beautiful sunset on a beach with the following text in the bottom right: " + snapshot.fullDateTime,
              seed: snapshot.minute,
              epochType: EpochType.Minute,
              ymdhmDate: snapshot.fullDateTime,
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

    // Calculate and store the future epochs
    getFutureEpochs(EpochType.Minute, snapshot.isoDateTime, futureSlots).forEach((epoch) => {
      addData(epoch)
        .then((r) => {
          console.log("page -> useEffect -> added future minute epoch data", r);
        })
        .catch((error) => {
          console.error("page -> useEffect -> error adding future minute epoch data:", error.message);
        });
    });
  }, [isMounted, snapshot.minute, addData]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    console.log("page -> useEffect -> hour epoch");
    addData(getCurrentEpoch(EpochType.Hour, snapshot))
      .then((r) => {
        console.log("Added hour epoch data", r);
      })
      .catch((error) => {
        console.error("Error adding hour epoch data:", error.message);
      });

    getFutureEpochs(EpochType.Hour, snapshot.isoDateTime, futureSlots).forEach((epoch) => {
      addData(epoch)
        .then((r) => {
          console.log("page -> useEffect -> added future hour epoch data", r);
        })
        .catch((error) => {
          console.error("page -> useEffect -> error adding future hour epoch data:", error.message);
        });
    });
  }, [isMounted, snapshot.hour, addData]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    console.log("page -> useEffect -> day epoch");
    addData(getCurrentEpoch(EpochType.Day, snapshot))
      .then((r) => {
        console.log("Added day epoch data", r);
      })
      .catch((error) => {
        console.error("Error adding day epoch data:", error.message);
      });

    getFutureEpochs(EpochType.Day, snapshot.isoDateTime, futureSlots).forEach((epoch) => {
      addData(epoch)
        .then((r) => {
          console.log("page -> useEffect -> added future day epoch data", r);
        })
        .catch((error) => {
          console.error("page -> useEffect -> error adding future day epoch data:", error.message);
        });
    });
  }, [isMounted, snapshot.dayOfMonth, addData]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    console.log("page -> useEffect -> month epoch");
    addData(getCurrentEpoch(EpochType.Month, snapshot))
      .then((r) => {
        console.log("Added month epoch data", r);
      })
      .catch((error) => {
        console.error("Error adding month epoch data:", error.message);
      });

    getFutureEpochs(EpochType.Month, snapshot.isoDateTime, futureSlots).forEach((epoch) => {
      addData(epoch)
        .then((r) => {
          console.log("page -> useEffect -> added future month epoch data", r);
        })
        .catch((error) => {
          console.error("page -> useEffect -> error adding future month epoch data:", error.message);
        });
    });
  }, [isMounted, snapshot.month, addData]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    console.log("page -> useEffect -> year epoch");
    addData(getCurrentEpoch(EpochType.Year, snapshot))
      .then((r) => {
        console.log("Added year epoch data", r);
      })
      .catch((error) => {
        console.error("Error adding year epoch data:", error.message);
      });

    getFutureEpochs(EpochType.Year, snapshot.isoDateTime, futureSlots).forEach((epoch) => {
      addData(epoch)
        .then((r) => {
          console.log("page -> useEffect -> added future year epoch data", r);
        })
        .catch((error) => {
          console.error("page -> useEffect -> error adding future year epoch data:", error.message);
        });
    });
  }, [isMounted, snapshot.year, addData]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress size={100} />
      </div>
    );
  }

  const minuteCards = getTimeCards(EpochType.Minute, snapshot.minute, snapshot.fullDateTime, data);
  // console.log(
  //   "page -> minuteCards",
  //   minuteCards,
  //   "pastCards",
  //   minuteCards?.pastCards?.length,
  //   "futureCards",
  //   minuteCards?.futureCards?.length,
  // );
  const timelineData = [
    {
      title: "Minute " + snapshot.minute,
      content: (
        <div>
          <div className="flex flex-col items-center justify-center gap-2 my-3">
            <h2 className="mb-4 text-xl font-semibold">Minted & Upcoming Epochs</h2>
            <div className="grid grid-cols-3 gap-2">
              <ExpandableCard cards={minuteCards?.pastCards} />
              <CountdownTimer key={snapshot.minute} duration={60} initialRemainingTime={60 - snapshot.second} />
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
