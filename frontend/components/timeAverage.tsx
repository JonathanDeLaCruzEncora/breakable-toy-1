"use client";
import React from "react";
import { useAverageTime } from "./hooks/useAverageTime";

export default function TimeAverage() {
  const { avgTime, priorityAvg } = useAverageTime();

  return (
    <section className="">
      <div className="absolute bottom-0 left-1/2 flex h-fit w-[calc(100%-5rem)] max-w-screen-sm -translate-x-1/2 flex-col items-center rounded-t-3xl bg-indigo-400 px-10 pb-5 pt-5 text-white dark:bg-indigo-500">
        <p className="text-lg font-normal">Average time to finish tasks:</p>
        <div className="flex w-full items-center justify-center pt-4">
          <div className="relative flex-1 pr-4 text-end">
            <p className="text-4xl font-semibold sm:text-7xl">
              <DisplayTime min={avgTime} />
            </p>
          </div>
          <span className="h-32 w-0.5 rounded-sm bg-white"></span>
          <div className="flex h-full flex-1 flex-col pl-4">
            <div className="pb-4 font-normal">By priority:</div>
            <div className="">
              <PriorityTime label="Low" time={priorityAvg.Low} />
              <PriorityTime label="Mid" time={priorityAvg.Medium} />
              <PriorityTime label="High" time={priorityAvg.High} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PriorityTime = ({ label, time }: { label: string; time: number }) => (
  <p className="pb-2">
    <span className="inline-block w-10">{label}</span>
    <span>-</span>
    <span
      className={`ml-2 inline-block text-start text-lg font-bold ${time < 60 ? "w-10" : "w-20"}`}
    >
      <DisplayTime min={time} isPriority />
    </span>
  </p>
);

export const DisplayTime = ({
  min,
  isPriority = false,
}: {
  min: number;
  isPriority?: boolean;
}) => {
  let hrs = min < 60 ? 0 : Math.floor(min / 60);
  if (min < 60) {
    return (
      <>
        <span>{min}</span>
        <span
          className={`text-${isPriority ? "sm" : "xl"} font-normal tracking-tighter`}
        >
          min
        </span>
      </>
    );
  } else {
    return (
      <>
        <span>{hrs}</span>
        <span
          className={`mr-${isPriority ? "1" : "2"} text-${isPriority ? "sm" : "xl"} font-normal tracking-tighter`}
        >
          h
        </span>
        <span>{min % 60}</span>
        <span
          className={`text-${isPriority ? "sm" : "xl"} font-normal tracking-tighter`}
        >
          m
        </span>
      </>
    );
  }
};
