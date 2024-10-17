"use client";
import React, { useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { cx } from "class-variance-authority";

type Props = {
  // Countdown duration in seconds
  duration?: number;
  initialRemainingTime?: number;
  shouldRepeat?: boolean;
  repeatDelay?: number;
  // Array of colors in HEX format. At least 2 colors should be provided
  colors?: { 0: `#${string}` } & { 1: `#${string}` } & `#${string}`[];
  // When to switch to the next color. The first number is the countdown duration and the last one is 0 or goal.
  colorsTime?: { 0: number } & { 1: number } & number[];
  onComplete?: () => void;
};

const minuteSeconds = 60;
// const hourSeconds = 3600;
// const daySeconds = 86400;
const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
// const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
// const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
// const getTimeDays = (time) => (time / daySeconds) | 0;
//
// const renderTimeWithDimension = (dimension, time) => {
//   return (
//     <div className="time-wrapper">
//       <div className="time">{time}</div>
//       <div>{dimension}</div>
//     </div>
//   );
// };

export const CountdownTimer = ({
  duration = 60,
  initialRemainingTime = 60,
  shouldRepeat = false,
  repeatDelay = 1,
  colors = ["#004777", "#F7B801", "#A30000", "#A30000"],
  colorsTime = [60, 40, 20, 0],
  onComplete,
}: Props) => {
  const onCompleteCB = onComplete ? () => onComplete() : () => ({ shouldRepeat: shouldRepeat, delay: repeatDelay });
  const renderTime = ({ dimension, remainingTime }) => {
    const currentTime = useRef(remainingTime);
    const prevTime = useRef(null);
    const isNewTimeFirstTick = useRef(false);
    const [, setOneLastRerender] = useState(0);
    // const hours = Math.floor(remainingTime / 3600);
    // const minutes = Math.floor((remainingTime % 3600) / 60);
    // const seconds = remainingTime % 60;

    if (currentTime.current !== remainingTime) {
      isNewTimeFirstTick.current = true;
      prevTime.current = currentTime.current;
      currentTime.current = remainingTime;
    } else {
      isNewTimeFirstTick.current = false;
    }

    // force one last re-render when the time is over to trigger the last animation
    if (remainingTime === 0) {
      setTimeout(() => {
        setOneLastRerender((val) => val + 1);
      }, 20);
    }

    const isTimeUp = isNewTimeFirstTick.current;
    // console.log("timer -> remainingTime", remainingTime, "isTimeUp", isTimeUp);

    // if (remainingTime === 0) {
    //   return <div className="flex flex-col items-center">MINTING...</div>;
    // }

    // return (
    //   <div className="flex flex-col items-center">
    //     <div className="txt-white">Remaining</div>
    //     <div className="text-3xl">{remainingTime}</div>
    //     <div className="txt-white">seconds</div>
    //   </div>
    // );

    return (
      <div className="time-wrapper">
        <div key={remainingTime} className={cx("timer", isTimeUp && "up")}>
          {remainingTime}
          <div className="dimension">{dimension}</div>
        </div>
        {prevTime.current !== null && (
          <div key={prevTime.current} className={cx("timer", !isTimeUp && "down")}>
            {prevTime.current}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center">
      <CountdownCircleTimer
        isPlaying
        duration={duration}
        initialRemainingTime={initialRemainingTime}
        colors={colors}
        colorsTime={colorsTime}
        onComplete={onCompleteCB}
      >
        {({ elapsedTime, color }) => (
          <div style={{ color }}>
            {renderTime({
              dimension: "seconds",
              remainingTime: getTimeSeconds(elapsedTime),
            })}
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  );
};
