import { useEffect, useReducer } from "react";
import { eventUpdater, GameEvent } from "../../events/event-updater";

export function useEventUpdater(...events: GameEvent[]) {
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
