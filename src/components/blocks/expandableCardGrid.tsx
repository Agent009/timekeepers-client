"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { AccessTime, CheckCircle, MonetizationOn, Star, TextSnippet, Warning } from "@mui/icons-material";
import { CircleCard } from "@components/icons/CircleCard";
import { RectangleCard } from "@components/icons/RectangleCard";
import { EpochRarity, EpochStatus, rarityGradientColors, TimeCard } from "@customTypes/index";
import { useOutsideClick } from "@lib/hooks/use-outside-click";
import { cx } from "class-variance-authority";

type Props = { cards: TimeCard[] };
export default function ExpandableCard({ cards }: Props) {
  const [active, setActive] = useState<TimeCard | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  console.log(
    "ExpandableCard -> init -> cards",
    cards?.[0]?.value,
    cards?.[0]?.rarity,
    cards?.[1]?.value,
    cards?.[1]?.rarity,
    cards,
    "active",
    active,
  );
  const activeRarityClass = `text-gradient-${active && typeof active === "object" && active?.rarity ? active.rarity : EpochRarity.Common}`;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.value}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.value}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl"
            >
              <motion.div layoutId={`image-${active.value}-${id}`}>
                <div className="w-full h-80 lg:h-80 flex items-center justify-center">
                  {active.image ? (
                    // <Image
                    //   priority
                    //   width={200}
                    //   height={200}
                    //   src={"/" + active.image}
                    //   alt={active.value}
                    //   className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                    // />
                    <RectangleCard
                      title={active.value}
                      topText={active.topText}
                      bottomText={active.bottomText}
                      width={500}
                      height={320}
                      borderRadius={30}
                      startColor={active.rarity ? rarityGradientColors[active.rarity].start : undefined}
                      endColor={active.rarity ? rarityGradientColors[active.rarity].end : undefined}
                      backgroundImage={"/" + active.image}
                      backgroundImageOpacity={1}
                    />
                  ) : (
                    <CircleCard
                      title={active.value}
                      topText={active.topText}
                      bottomText={active.bottomText}
                      width={200}
                      height={200}
                      startColor={active.rarity ? rarityGradientColors[active.rarity].start : undefined}
                      endColor={active.rarity ? rarityGradientColors[active.rarity].end : undefined}
                      backgroundImage={active.image ? "/" + active.image : undefined}
                      backgroundImageOpacity={1}
                    />
                  )}
                </div>
              </motion.div>

              <div>
                <div className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-lg shadow-md">
                  <div className="flex justify-between gap-2">
                    <motion.h3
                      layoutId={`title-${active.value}-${id}`}
                      className={cx(
                        activeRarityClass,
                        "font-semibold text-xl text-neutral-800 dark:text-neutral-200 mb-2 flex items-center gap-x-2",
                      )}
                    >
                      <Star className="mr-2" />
                      {active.type}: <span className="font-bold text-green-600">{active.value}</span> ({active.rarity})
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.date}-${id}`}
                      className="text-neutral-700 dark:text-neutral-400 text-base mb-1 flex items-center gap-x-2"
                    >
                      <AccessTime className="mr-2" />
                      <span className="font-medium">Date:</span> {dayjs(active.date).format("YYYY-MM-DD HH:mm")}
                    </motion.p>
                  </div>
                  {/*<div className="flex justify-between gap-2">*/}
                  {/*  <motion.p*/}
                  {/*    layoutId={`description-${active.date}-${id}`}*/}
                  {/*    className="text-neutral-700 dark:text-neutral-400 text-base mb-1 flex items-center gap-x-2"*/}
                  {/*  >*/}
                  {/*    <AccessTime className="mr-2" />*/}
                  {/*    <span className="font-medium">Date:</span> {dayjs(active.date).format("YYYY-MM-DD HH:mm")}*/}
                  {/*  </motion.p>*/}
                  {/*  <motion.p*/}
                  {/*    layoutId={`rarity-${active.rarity}-${id}`}*/}
                  {/*    className={cx(*/}
                  {/*      activeRarityClass,*/}
                  {/*      "text-neutral-700 dark:text-neutral-400 text-base mb-1 flex items-center gap-x-2",*/}
                  {/*    )}*/}
                  {/*  >*/}
                  {/*    <Star className="mr-2" />*/}
                  {/*    <span className="font-medium">Rarity:</span> {active.rarity}*/}
                  {/*  </motion.p>*/}
                  {/*</div>*/}
                  <div className="flex justify-between gap-2">
                    <motion.p
                      layoutId={`status-${active.status}-${id}`}
                      className="text-neutral-700 dark:text-neutral-400 text-base mb-1 flex items-center gap-x-2"
                    >
                      {active.status === EpochStatus.Generated ? (
                        <CheckCircle className="mr-2 text-green-600" />
                      ) : (
                        <Warning className="mr-2 text-red-600" />
                      )}
                      <span className="font-medium">Status:</span> {active.status}
                    </motion.p>
                    <motion.p
                      layoutId={`minted-${active.minted}-${id}`}
                      className="text-neutral-700 dark:text-neutral-400 text-base mb-1 flex items-center gap-x-2"
                    >
                      <MonetizationOn className="mr-2" />
                      <span className="font-medium">Minted:</span> {active.minted || "Pending mint..."}
                    </motion.p>
                  </div>
                  {/*<motion.p*/}
                  {/*  layoutId={`seed-${active.value}-${id}`}*/}
                  {/*  className="text-neutral-700 dark:text-neutral-400 text-base mb-1 flex items-center gap-x-2"*/}
                  {/*>*/}
                  {/*  <Speed className="mr-2" />*/}
                  {/*  <span className="font-medium">Seed:</span> {active.seed}*/}
                  {/*</motion.p>*/}
                  <motion.p
                    layoutId={`prompt-${active.value}-${id}`}
                    className="text-neutral-700 dark:text-neutral-400 text-base flex items-start gap-x-2 max-h-20 overflow-y-auto"
                  >
                    <TextSnippet className="mr-2" />
                    <span className="font-medium">Prompt (seed {active.seed}):</span>{" "}
                    <span className="whitespace-pre-wrap">{active.prompt}</span>
                  </motion.p>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function" ? active.content() : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full flex flex-row justify-center">
        {cards.map((card, index) => {
          const startColor = card.rarity ? rarityGradientColors[card.rarity].start : undefined;
          const endColor = card.rarity ? rarityGradientColors[card.rarity].end : undefined;
          console.log("ExpandableCard -> cards.map -> data", card.type, card.value, card.rarity, startColor, endColor);
          return (
            <motion.div
              layoutId={`card-${card.value}-${id}`}
              key={`${card.value}-${card.date}-${index}`}
              onClick={() => setActive(card)}
              className="p-2 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
            >
              <div className="flex flex-col w-full">
                <motion.div layoutId={`image-${card.value}-${id}`}>
                  <div className="h-50 w-full flex items-center justify-center">
                    <CircleCard
                      key={`circle-${card.value}-${card.date}-${index}`}
                      title={card.value}
                      topText={card.topText}
                      bottomText={card.bottomText}
                      width={200}
                      height={200}
                      startColor={startColor}
                      endColor={endColor}
                      backgroundImage={card.image ? card.image : undefined}
                      backgroundImageOpacity={0.3}
                    />
                  </div>
                  {/*<Image*/}
                  {/*  width={100}*/}
                  {/*  height={100}*/}
                  {/*  src={card.src}*/}
                  {/*  alt={card.title}*/}
                  {/*  className="h-60 w-full  rounded-lg object-cover object-top"*/}
                  {/*/>*/}
                </motion.div>
                {/*<div className="flex justify-center items-center flex-col">*/}
                {/*  <motion.h3*/}
                {/*    layoutId={`title-${card.title}-${id}`}*/}
                {/*    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"*/}
                {/*  >*/}
                {/*    {card.title}*/}
                {/*  </motion.h3>*/}
                {/*  <motion.p*/}
                {/*    layoutId={`description-${card.description}-${id}`}*/}
                {/*    className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"*/}
                {/*  >*/}
                {/*    {card.description}*/}
                {/*  </motion.p>*/}
                {/*</div>*/}
              </div>
            </motion.div>
          );
        })}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
