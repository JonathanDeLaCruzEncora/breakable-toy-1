import { useApp } from "../AppContext";

export const useAverageTime = () => {
  const { avgTime, priorityAvg } = useApp();
  return { avgTime, priorityAvg };
};
