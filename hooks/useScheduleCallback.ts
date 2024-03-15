import {useCallback, useEffect, useState} from "react";

type ScheduleCallbackOptions = {
  callsPerSecond?: number;
  runAtEpochTime?: number;
};

const useScheduleCallback = (callback: () => void) => {
  const [, setTimeoutId] = useState<NodeJS.Timeout>();
  const [, setIntervalId] = useState<NodeJS.Timeout>();

  const continuouslyRunCallback = useCallback(
    (callsPerSecond = 1) =>
      () =>
        setIntervalId(prevIntervalId => {
          if (prevIntervalId) return prevIntervalId;
          callback();
          return setInterval(callback, 1000 / callsPerSecond);
        }),
    [callback]
  );

  const scheduleCallback = useCallback(
    ({callsPerSecond = 1, runAtEpochTime = 0}: ScheduleCallbackOptions = {}) =>
      setTimeoutId(
        prevTimeoutId =>
          prevTimeoutId ??
          setTimeout(
            continuouslyRunCallback(callsPerSecond),
            runAtEpochTime * 1000 - new Date().getTime()
          )
      ),
    [continuouslyRunCallback]
  );

  const stopCallbackExecution = useCallback(() => {
    setTimeoutId(prevTimeoutId => {
      clearTimeout(prevTimeoutId);
      return undefined;
    });
    setIntervalId(prevIntervalId => {
      clearInterval(prevIntervalId);
      return undefined;
    });
  }, []);

  /* ensure all scheduled or running processes are stopped when any component
  that uses this hook is unmounted */
  useEffect(() => stopCallbackExecution, [stopCallbackExecution]);

  return {scheduleCallback, stopCallbackExecution};
};

export default useScheduleCallback;
