import React from "react";
import { PriorityAvg } from "./tasks/tasksSection";

interface Props {
  avgTime: number;
  priorityAvg: PriorityAvg;
}

export default function TimeAverage({ avgTime, priorityAvg }: Props) {
  const displayTime = (min: number) => {
    let hrs = min < 60 ? 0 : Math.floor(min / 60);
    if (min < 60) {
      return (
        <>
          <span>{min}</span>
          <span className="text-xl font-normal tracking-tighter">min</span>
        </>
      );
    } else {
      return (
        <>
          <span>{hrs}</span>
          <span className="mr-2 text-xl font-normal tracking-tighter">h</span>
          <span>{min % 60}</span>
          <span className="text-xl font-normal tracking-tighter">m</span>
        </>
      );
    }
  };

  const displayTimeByPriority = (min: number) => {
    let hrs = min < 60 ? 0 : Math.floor(min / 60);
    if (min < 60) {
      return (
        <>
          <span>{min}</span>
          <span className="text-sm font-normal tracking-tighter">m</span>
        </>
      );
    } else {
      return (
        <>
          <span>{hrs}</span>
          <span className="mr-1 text-sm font-normal tracking-tighter">h</span>
          <span>{min % 60}</span>
          <span className="text-sm font-normal tracking-tighter">m</span>
        </>
      );
    }
  };

  return (
    <section className="">
      <div className="absolute bottom-0 left-1/2 flex h-fit w-[calc(100%-5rem)] max-w-screen-sm -translate-x-1/2 flex-col items-center rounded-t-3xl bg-indigo-400 px-10 pb-5 pt-5 text-white">
        <p className="text-lg font-normal">Average time to finish tasks:</p>
        <div className="flex w-full items-center justify-center pt-4">
          <div className="relative flex-1 pr-4 text-end">
            <p className="text-4xl font-semibold sm:text-7xl">
              {displayTime(avgTime)}
            </p>
          </div>
          <span className="h-32 w-0.5 rounded-sm bg-white"></span>
          <div className="flex h-full flex-1 flex-col pl-4">
            <div className="pb-4 font-normal">By priority:</div>
            <div className="">
              <p className="pb-2">
                <span className="inline-block w-10">Low</span>
                <span>-</span>
                <span
                  className={`ml-2 inline-block text-start text-lg font-bold ${priorityAvg.Low < 60 ? "w-10" : "w-20"}`}
                >
                  {displayTimeByPriority(priorityAvg.Low)}
                </span>
              </p>
              <p className="pb-2">
                <span className="inline-block w-10">Mid</span>
                <span>-</span>
                <span
                  className={`ml-2 inline-block text-start text-lg font-bold ${priorityAvg.Medium < 60 ? "w-10" : "w-20"}`}
                >
                  {displayTimeByPriority(priorityAvg.Medium)}
                </span>
              </p>
              <p className="pb-2">
                <span className="inline-block w-10">High</span>
                <span>-</span>
                <span
                  className={`ml-2 inline-block text-start text-lg font-bold ${priorityAvg.High < 60 ? "w-10" : "w-20"}`}
                >
                  {displayTimeByPriority(priorityAvg.High)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
