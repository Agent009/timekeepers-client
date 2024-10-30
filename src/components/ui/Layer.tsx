"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
import {
  EpochData,
  EpochRarity,
  EpochSnapshot,
  EpochState,
  EpochStatus,
  EpochType,
  rarityGradientColors,
  TimeCardsResponse,
} from "@customTypes/index";
import ExpandableCard from "@components/blocks/expandableCardGrid";
import { getApiUrl, getServerUrl } from "@lib/api";
import { constants } from "@lib/constants";
import { getCurrentEpoch, getEpochValueFromSnapshot, getFutureEpochs, getMintDates } from "@lib/epochUtils";
import { textToImage } from "@lib/server/livepeer";
import { getTimeCards } from "@lib/timeCards";
import { Timeline } from "@ui/timeline";
import { CountdownTimer } from "@ui/timer";
import { LayerDocument } from "@models/layer";

type Props = {
  snapshot: EpochSnapshot;
  layer: LayerDocument;
};

export const Layer = ({ snapshot, layer }: Props) => {
  const [data, setData] = useState<EpochData[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const futureSlots = 3;
  const [minuteCards, setMinuteCards] = useState<TimeCardsResponse>();
  const [hourCards, setHourCards] = useState<TimeCardsResponse>();
  const [dayCards, setDayCards] = useState<TimeCardsResponse>();
  const [monthCards, setMonthCards] = useState<TimeCardsResponse>();
  const [yearCards, setYearCards] = useState<TimeCardsResponse>();

  // Mutable ref object that persists for the full lifetime of the component.
  // It does not cause re-renders when its value changes, and hence solves the infinite re-renders issue.
  const isFetchingRef = useRef(false);
  console.log("Layer -> isMounted", isMounted, "isPending", isPending, "isFetchingRef", isFetchingRef, "layer", layer);
  // console.log("Layer -> data", data);

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return; // Prevent multiple fetches
    console.log("Layer -> fetchData");
    isFetchingRef.current = true; // Set fetching status to true

    try {
      // "/api/?startDate=2023-10-01&endDate=2023-10-02"
      const response = await fetch(getApiUrl(constants.routes.api.getData, { layerId: layer._id }));
      const result = await response.json();
      // console.log("Layer -> fetchData -> result", result);

      if (!result?.error) {
        setData(result);
      }
    } catch (error) {
      console.error("Layer -> fetchData -> error", error);
    } finally {
      isFetchingRef.current = false; // Reset fetching status
    }
  }, []); // No dependencies, so it won't be recreated

  const saveEpochData = useCallback(async (entity: EpochData, upsert: boolean = true) => {
    try {
      const response = await fetch(getApiUrl(constants.routes.api.saveData, { upsert: upsert }), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...entity, layerId: layer._id }),
      });
      console.log("Layer -> saveEpochData -> response", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.error || errorData.message || "Error saving data");
        return errorData;
      }

      return await response.json();
    } catch (error) {
      console.error("Layer -> fetchData -> error", error);
      return error;
    }
  }, []);

  const handleEpochData = useCallback(
    (type: EpochType, snapshot: EpochSnapshot) => {
      const epochValue = getEpochValueFromSnapshot(type, snapshot);
      let addCurrentEpoch = true;
      console.log(`page -> handleEpochData (${type} ${epochValue})`);

      // Add current epoch data
      if (
        // Ensure adding the current epoch doesn't replace previously generated future epochs.
        data.some(
          (d) =>
            d.type === type &&
            d.value === epochValue &&
            d.ymdhmDate === snapshot.fullDateTime &&
            d.status === EpochStatus.Generated,
        ) ||
        // And also, don't add future epochs if the current epoch hasn't elapsed yet.
        (snapshot.second >= 2 && snapshot.second <= 58)
      ) {
        addCurrentEpoch = false;
        console.log(
          `page -> handleEpochData (${type} ${epochValue}) -> already generated or not elapsed, skipping...`,
          snapshot,
        );
      }

      // TODO: Currently generates images even if current epoch hasn't elapsed.
      if (addCurrentEpoch) {
        saveEpochData({ ...getCurrentEpoch(type, snapshot, data), status: EpochStatus.Generating })
          .then((r) => {
            const d: EpochData = r.document;
            const actionStr = r.updated ? "updated" : "added";
            console.log(
              `page -> handleEpochData (${type} ${epochValue}) -> save -> ${actionStr} epoch data`,
              d.value,
              d.rarity,
              r,
            );

            // Only generate an image if the epoch data was stored for the first time.
            if (r.success && d.state !== EpochState.Future && !d.image && !d.nft) {
              startTransition(async () => {
                const seed = d.type === EpochType.Minute ? (d.value + 1) * (snapshot.hour + 1) : d.value + 1;
                const mintDates = getMintDates(d.type, d.value, d.ymdhmDate);
                let prompt =
                  "A beautiful sunset on a beach with the following text in the bottom right: " + d.ymdhmDate;

                try {
                  const promptResponse = await fetch(
                    getServerUrl(constants.routes.server.getMintData, {
                      epochType: type,
                      startDate: mintDates.startDate,
                      endDate: mintDates.endDate,
                    }),
                  );
                  const promptResponseJson = await promptResponse.json();
                  console.log(
                    `page -> handleEpochData (${type} ${epochValue}) -> save -> promptResponseJson`,
                    promptResponseJson,
                    "seed",
                    seed,
                  );

                  if (promptResponseJson?.prompt) {
                    prompt = promptResponseJson.prompt;
                  }
                } catch (error) {
                  console.error(`page -> handleEpochData (${type} ${epochValue}) -> save -> mint data error`, error);
                }

                console.log(`page -> handleEpochData (${type} ${epochValue}) -> save -> t2i -> snapshot`, snapshot);
                const result = await textToImage({
                  prompt: prompt,
                  seed: seed,
                  epochType: d.type,
                  ymdhmDate: d.ymdhmDate,
                });

                if (result.success) {
                  const imageSrc = result.images[0]?.imageSrc;
                  setImages((prevImages) => [...result.images.map((image) => image.imageSrc), ...prevImages]);
                  console.log(`page -> handleEpochData (${type} ${epochValue}) -> save -> images`, result.images);

                  // Update the epoch data with the new image path
                  if (imageSrc) {
                    saveEpochData({ ...d, seed: seed, prompt: prompt, image: imageSrc, status: EpochStatus.Generated })
                      .then((r) => {
                        const updatedEpoch: EpochData = r.document;
                        const actionStr = r.updated ? "updated" : "added";
                        console.log(
                          `page -> handleEpochData (${type} ${epochValue}) -> save -> save -> ${actionStr} image src`,
                          updatedEpoch,
                        );
                      })
                      .catch((error) => {
                        console.error(
                          `page -> handleEpochData (${type} ${epochValue}) -> save -> save -> error updating image src`,
                          error.message,
                        );
                      });
                  }
                } else {
                  console.error(
                    `page -> handleEpochData (${type} ${epochValue}) -> save -> failed to generate image`,
                    result,
                  );
                }
              });
            }
          })
          .catch((error) => {
            console.error(
              `page -> handleEpochData (${type} ${epochValue}) -> save -> error adding data:`,
              error.message,
            );
          });
      }

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
        saveEpochData(epoch, false)
          .then((r) => {
            const d: EpochData = r.document;
            const actionStr = r.updated ? "updated" : "added";
            console.log(
              `page -> handleEpochData (${type} ${d?.value}) -> save -> ${actionStr} future epoch`,
              d?.value,
              d?.rarity,
              r,
            );
          })
          .catch((error) => {
            console.error(
              `page -> handleEpochData (${type} ${epoch.value}) -> save -> error adding future epoch:`,
              error.message,
            );
          });
      });
    },
    [data, saveEpochData],
  );

  // Fetch the data every 10 seconds
  useEffect(() => {
    console.log("Layer -> useEffect -> init -> fetchData");

    if (!layer) {
      console.log("Layer -> useEffect -> init -> no layer found, skipping fetchData");
      return;
    }

    const fetchAndSetData = async () => {
      try {
        await fetchData();
        setIsMounted(true);
      } catch (error) {
        console.error("Layer -> useEffect -> init -> fetchAndSetData -> error", error);
      }
    };

    // Initial fetch
    fetchAndSetData().then(() => console.log("Layer -> useEffect -> init -> fetchAndSetData success"));

    const intervalId = setInterval(async () => {
      // noinspection JSIgnoredPromiseFromCall
      await fetchData();
    }, 10500);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [layer, fetchData]);

  // Calculate and store the currently elapsed and future epochs
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    handleEpochData(EpochType.Minute, snapshot);
    setMinuteCards(getTimeCards(EpochType.Minute, snapshot.minute, snapshot.fullDateTime, data));
  }, [isMounted, handleEpochData, snapshot.minute]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    handleEpochData(EpochType.Hour, snapshot);
    setHourCards(getTimeCards(EpochType.Hour, snapshot.hour, snapshot.fullDateTime, data));
  }, [isMounted, handleEpochData, snapshot.hour]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    handleEpochData(EpochType.Day, snapshot);
    setDayCards(getTimeCards(EpochType.Day, snapshot.dayOfMonth, snapshot.fullDateTime, data));
  }, [isMounted, handleEpochData, snapshot.dayOfMonth]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    handleEpochData(EpochType.Month, snapshot);
    setMonthCards(getTimeCards(EpochType.Month, snapshot.month, snapshot.fullDateTime, data));
  }, [isMounted, handleEpochData, snapshot.month]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    handleEpochData(EpochType.Year, snapshot);
    setYearCards(getTimeCards(EpochType.Year, snapshot.year, snapshot.fullDateTime, data));
  }, [isMounted, handleEpochData, snapshot.year]);

  const timelineData = useMemo(() => {
    const minuteRarity = getCurrentEpoch(EpochType.Minute, snapshot, data)?.rarity || EpochRarity.Common;
    const hourRarity = getCurrentEpoch(EpochType.Hour, snapshot, data)?.rarity || EpochRarity.Common;
    const dayRarity = getCurrentEpoch(EpochType.Day, snapshot, data)?.rarity || EpochRarity.Common;
    const monthRarity = getCurrentEpoch(EpochType.Month, snapshot, data)?.rarity || EpochRarity.Common;
    const yearRarity = getCurrentEpoch(EpochType.Year, snapshot, data)?.rarity || EpochRarity.Common;
    const minuteClass = `text-gradient-${minuteRarity}`;
    const hourClass = `text-gradient-${hourRarity}`;
    const dayClass = `text-gradient-${dayRarity}`;
    const monthClass = `text-gradient-${monthRarity}`;
    const yearClass = `text-gradient-${yearRarity}`;
    const minuteStartColor = rarityGradientColors[minuteRarity].start;
    const minuteEndColor = rarityGradientColors[minuteRarity].start;
    const hourStartColor = rarityGradientColors[hourRarity].start;
    const hourEndColor = rarityGradientColors[hourRarity].start;
    const dayStartColor = rarityGradientColors[dayRarity].start;
    const dayEndColor = rarityGradientColors[dayRarity].start;
    const monthStartColor = rarityGradientColors[monthRarity].start;
    const monthEndColor = rarityGradientColors[monthRarity].start;
    const yearStartColor = rarityGradientColors[yearRarity].start;
    const yearEndColor = rarityGradientColors[yearRarity].start;
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
                  key={"minute-" + snapshot.minute}
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
                    {images.map((imagePath, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={index}
                        src={imagePath}
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
        titleClass: hourClass,
        subheadingClass: hourClass,
        subheading: hourRarity,
        content: (
          <div>
            <div className="flex flex-col items-center justify-center gap-2 my-3">
              <h2 className="mb-4 text-xl font-semibold">Minted & Upcoming Epochs</h2>
              <div className="grid grid-cols-3 gap-2">
                <ExpandableCard cards={hourCards?.pastCards || []} />
                <CountdownTimer
                  key={"hour-" + snapshot.hour}
                  dimension={"minutes"}
                  duration={60}
                  initialRemainingTime={60 - snapshot.minute}
                  // @ts-expect-error ignore
                  colors={[hourStartColor, hourEndColor]}
                  colorsTime={[60, 40]}
                />
                <ExpandableCard cards={hourCards?.futureCards || []} />
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "" + snapshot.dayName,
        titleClass: dayClass,
        subheadingClass: dayClass,
        subheading: dayRarity,
        content: (
          <div>
            <div className="flex flex-col items-center justify-center gap-2 my-3">
              <h2 className="mb-4 text-xl font-semibold">Minted & Upcoming Epochs</h2>
              <div className="grid grid-cols-3 gap-2">
                <ExpandableCard cards={dayCards?.pastCards || []} />
                <CountdownTimer
                  key={"day-" + snapshot.dayOfMonth}
                  dimension={"hours"}
                  duration={24}
                  initialRemainingTime={24 - snapshot.hour}
                  // @ts-expect-error ignore
                  colors={[dayStartColor, dayEndColor]}
                  colorsTime={[60, 40]}
                />
                <ExpandableCard cards={dayCards?.futureCards || []} />
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "" + snapshot.monthName,
        titleClass: monthClass,
        subheadingClass: monthClass,
        subheading: monthRarity,
        content: (
          <div>
            <div className="flex flex-col items-center justify-center gap-2 my-3">
              <h2 className="mb-4 text-xl font-semibold">Minted & Upcoming Epochs</h2>
              <div className="grid grid-cols-3 gap-2">
                <ExpandableCard cards={monthCards?.pastCards || []} />
                <CountdownTimer
                  key={"month-" + snapshot.month}
                  dimension={"days"}
                  duration={31}
                  initialRemainingTime={31 - snapshot.dayOfMonth}
                  // @ts-expect-error ignore
                  colors={[monthStartColor, monthEndColor]}
                  colorsTime={[60, 40]}
                />
                <ExpandableCard cards={monthCards?.futureCards || []} />
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "" + snapshot.year,
        titleClass: yearClass,
        subheadingClass: yearClass,
        subheading: yearRarity,
        content: (
          <div>
            <div className="flex flex-col items-center justify-center gap-2 my-3">
              <h2 className="mb-4 text-xl font-semibold">Minted & Upcoming Epochs</h2>
              <div className="grid grid-cols-3 gap-2">
                <ExpandableCard cards={yearCards?.pastCards || []} />
                <CountdownTimer
                  key={"year-" + snapshot.year}
                  dimension={"months"}
                  duration={12}
                  initialRemainingTime={12 - snapshot.month}
                  // @ts-expect-error ignore
                  colors={[yearStartColor, yearEndColor]}
                  colorsTime={[60, 40]}
                />
                <ExpandableCard cards={yearCards?.futureCards || []} />
              </div>
            </div>
          </div>
        ),
      },
    ];
  }, [snapshot.minute, minuteCards]);

  // const TimelineMemo = React.memo(({ data }: { data: TimelineEntry[] }) => {
  //   return <Timeline data={data} />;
  // });

  if (!isMounted || !layer || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress size={100} />
      </div>
    );
  }

  // console.log(
  //   "Layer -> minuteCards",
  //   minuteCards,
  //   "pastCards",
  //   minuteCards?.pastCards?.length,
  //   "futureCards",
  //   minuteCards?.futureCards?.length,
  // );

  return (
    <>
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
    </>
  );
};
