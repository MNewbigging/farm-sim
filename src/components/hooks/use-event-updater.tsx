import { useEffect, useReducer } from "react";
import { eventUpdater, EventMap } from "../../events/event-updater";

export function useEventUpdater<E extends keyof EventMap>(...events: E[]) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    // On first mount, subscribe to the event
    events.forEach((event) => eventUpdater.on(event, forceUpdate));

    // On unmount
    return () => {
      // Unsubscribe from the event
      events.forEach((event) => eventUpdater.off(event, forceUpdate));
    };
  }, [...events]);
}
