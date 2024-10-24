"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@lib/hooks/use-outside-click";
import { NumberCircle } from "@components/icons/numberCircle";
import { TimeCard, rarityGradientColors } from "@customTypes/index";
import dayjs from "dayjs";

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
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.value}-${id}`}>
                <div className="w-full h-80 lg:h-80 flex items-center justify-center">
                  <NumberCircle
                    // title={active.value}
                    // topText={active.topText}
                    // bottomText={active.bottomText}
                    width={200}
                    height={200}
                    startColor={active.rarity ? rarityGradientColors[active.rarity].start : undefined}
                    endColor={active.rarity ? rarityGradientColors[active.rarity].end : undefined}
                    backgroundImage={"images/nfts/minute_2024-10-10_12_06_0.png"}
                    backgroundImageOpacity={1}
                  />
                </div>

                {active.nft && (
                  <Image
                    priority
                    width={200}
                    height={200}
                    src={active.nft}
                    alt={active.value}
                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                  />
                )}
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.value}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.type}: {active.value}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.date}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      date: {dayjs(active.date).format("YYYY-MM-DD HH:mm")}
                    </motion.p>
                    <motion.p
                      layoutId={`rarity-${active.rarity}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      rarity: {active.rarity}
                    </motion.p>
                    <motion.p
                      layoutId={`minted-${active.minted}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.minted}
                    </motion.p>
                    <motion.p
                      layoutId={`status-${active.status}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      status: {active.status}
                    </motion.p>
                  </div>

                  {/*<motion.a*/}
                  {/*  layout*/}
                  {/*  initial={{ opacity: 0 }}*/}
                  {/*  animate={{ opacity: 1 }}*/}
                  {/*  exit={{ opacity: 0 }}*/}
                  {/*  href={active.ctaLink}*/}
                  {/*  target="_blank"*/}
                  {/*  className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"*/}
                  {/*>*/}
                  {/*  {active.ctaText}*/}
                  {/*</motion.a>*/}
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
                    <NumberCircle
                      key={`circle-${card.value}-${card.date}-${index}`}
                      title={card.value}
                      topText={card.topText}
                      bottomText={card.bottomText}
                      width={200}
                      height={200}
                      startColor={startColor}
                      endColor={endColor}
                      backgroundImage={"images/nfts/minute_2024-10-10_12_06_0.png"}
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
