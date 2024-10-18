"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { TimelineEntry } from "@customTypes/index.ts";
import { cx } from "class-variance-authority";

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  console.log("Timeline -> init -> height", height);

  useEffect(() => {
    console.log("Timeline -> useEffect -> init");

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10" ref={containerRef}>
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-40 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <div className="flex flex-col">
                {/* New wrapper div for title and subheading */}
                <h3
                  className={cx(
                    item.titleClass,
                    "hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500",
                  )}
                >
                  {item.title}
                </h3>
                {item.subheading && (
                  <h4
                    className={cx(
                      item.subheadingClass,
                      "hidden md:block text-lg md:pl-20 md:text-2xl text-neutral-400 dark:text-neutral-400 first-letter:capitalize",
                    )}
                  >
                    {item.subheading}
                  </h4>
                )}
              </div>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3
                className={cx(
                  item.titleClass,
                  "md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500",
                )}
              >
                {item.title}
              </h3>
              {item.subheading && (
                <h4
                  className={cx(
                    item.subheadingClass,
                    "md:hidden block text-lg mb-2 text-left text-neutral-400 dark:text-neutral-400",
                  )}
                >
                  {item.subheading}
                </h4>
              )}
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
