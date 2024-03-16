import {useCallback, useEffect, useRef} from "react";

type ScheduleCallbackOptions = {
  callsPerSecond?: number;
  runAtEpochTime?: number;
};

const useScheduleCallback = (callback: () => void) => {
  const timeoutId = useRef<NodeJS.Timeout>();
  const intervalId = useRef<NodeJS.Timeout>();

  /* Note that, if this function is ever exposed as a part of this hook API,
  it would need to ensure that multiple intervals cannot be set at the same time
  (e.g. using a if(!intervalId) ... statement).
   Also, calls per second should be defaulted in this case (e.g. callsPerSecond=1) */
  const continuouslyRunCallback = (callsPerSecond: number) => () => {
    callback();
    intervalId.current = setInterval(callback, 1000 / callsPerSecond);
  };

  const scheduleCallback = ({
    callsPerSecond = 1,
    runAtEpochTime = 0
  }: ScheduleCallbackOptions = {}) => {
    if (!timeoutId.current)
      timeoutId.current = setTimeout(
        continuouslyRunCallback(callsPerSecond),
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
