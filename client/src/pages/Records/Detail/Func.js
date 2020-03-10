import { useCallback } from "react";
import useApi from "../../../shared/hooks/api";
import pubsub from "sweet-pubsub";

const useSessionActions = sessionId => {
  const [startData, startRecord] = useApi.patch(`/records/${sessionId}/`);
  const [rescheduleData, rescheduleRecord] = useApi.patch(
    `/records/${sessionId}/`
  );

  const triggerStart = useCallback(() => {
    startRecord({ status: "in_work" }).then((res) => {
      pubsub.emit("fetch-record");
      return res;
    });
  }, [startRecord]);
  const triggerReschedule = useCallback((datetime) => {
    rescheduleRecord({ datetime }).then((res) => {
      pubsub.emit("fetch-record");
      return res;
     })
  }, [rescheduleRecord]);

  return {
    start: { data: startData, trigger: triggerStart },
    reschedule: { data: rescheduleData, trigger: triggerReschedule }
  };
};

export default useSessionActions;
