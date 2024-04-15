import {useEffect, useRef} from "react";

const useScheduleCallback = <T extends any[]>(
  callback: (...args: T) => void
) => {
  const timeout = useRef<NodeJS.Timeout>();

  const scheduleCallback = (runAtEpochTime = 0, ...args: T) => {
    if (!timeout.current)
      timeout.current = setTimeout(
        () => callback(...args),
        runAtEpochTime * 1000 - new Date().getTime()
      );
  };

  const cancelScheduledExecution = () => {
    clearTimeout(timeout.current);
    timeout.current = undefined;
  };

  /* ensure all scheduled processes are stopped when any component
  that uses this hook is unmounted */
  useEffect(() => cancelScheduledExecution, []);

  return {
    scheduleCallback,
    cancelScheduledExecution,
    isScheduled: Boolean(timeout)
  };
};

export default useScheduleCallback;
