import {useCallback, useEffect, useRef} from "react";

type UseScheduleCallbackOptions = {
  callsPerSecond?: number;
};

const useScheduleCallback = <T extends any[]>(
  callback: (...args: T) => void,
  {callsPerSecond = 1}: UseScheduleCallbackOptions = {}
) => {
  const timeoutId = useRef<NodeJS.Timeout>();
  const intervalId = useRef<NodeJS.Timeout>();

  /* Note that, if this function is ever exposed as a part of this hook API,
  it would need to ensure that multiple intervals cannot be set at the same time
  (e.g. using a if(!intervalId) ... statement). */
  const continuouslyRunCallback =
    (...args: T) =>
    () => {
      callback(...args);
      intervalId.current = setInterval(
        () => callback(...args),
        1000 / callsPerSecond
      );
    };

  const scheduleCallback = (runAtEpochTime = 0, ...args: T) => {
    if (!timeoutId.current)
      timeoutId.current = setTimeout(
        continuouslyRunCallback(...args),
        runAtEpochTime * 1000 - new Date().getTime()
      );
  };

  const stopCallbackExecution = useCallback(() => {
    clearTimeout(timeoutId.current);
    clearInterval(intervalId.current);
    timeoutId.current = undefined;
    intervalId.current = undefined;
  }, []);

  /* ensure all scheduled or running processes are stopped when any component
  that uses this hook is unmounted */
  useEffect(() => stopCallbackExecution, [stopCallbackExecution]);

  return {scheduleCallback, stopCallbackExecution};
};

export default useScheduleCallback;
