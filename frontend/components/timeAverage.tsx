import React from "react";

export default function TimeAverage() {
  return (
    <section className="">
      <div className="absolute bottom-0 left-1/2 flex h-fit w-[calc(100%-5rem)] max-w-screen-sm -translate-x-1/2 flex-col items-center rounded-t-3xl bg-indigo-400 px-10 pb-5 pt-5 text-white">
        <p className="text-lg font-normal">Average time to finish tasks:</p>
        <div className="flex w-full items-center justify-center pt-4">
          <div className="relative flex-1 pr-4 text-end">
            <p className="text-4xl font-semibold sm:text-6xl">
              22<span className="text-4xl font-normal">:</span>15
              <span className="text-xl font-normal tracking-tighter">
                mins.
              </span>
            </p>
          </div>
          <span className="h-32 w-0.5 rounded-sm bg-white"></span>
          <div className="flex h-full flex-1 flex-col pl-4">
            <div className="pb-4 font-normal">By priority:</div>
            <div className="">
              <p className="pb-2">
                <span className="inline-block w-11">Low:</span>{" "}
                <span className="inline-block w-14 text-end text-lg font-bold">
                  11:11
                </span>
                <span className="tracking-tighter"> mins.</span>
              </p>
              <p className="pb-2">
                <span className="inline-block w-11">Mid:</span>{" "}
                <span className="inline-block w-14 text-end text-lg font-bold">
                  30:15
                </span>
                <span className="tracking-tighter"> mins.</span>
              </p>
              <p className="pb-2">
                <span className="inline-block w-11">High:</span>{" "}
                <span className="inline-block w-14 text-end text-lg font-bold">
                  88:88
                </span>
                <span className="tracking-tighter"> mins.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
