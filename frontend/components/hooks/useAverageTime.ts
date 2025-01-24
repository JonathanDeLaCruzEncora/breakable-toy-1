import { useApp } from "../AppContext";

/**
 * Custom hook to manage only the average time elements from useApp.
 *
 * @returns {Object} The average time states to manage it.
 */
export const useAverageTime = () => {
  const { avgTime, priorityAvg } = useApp();
  return { avgTime, priorityAvg };
};
