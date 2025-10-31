export type GameEvent =
  | "game-loaded"
  | "game-started"
  | "mode-changed"
  | "build-item";

type EventCallback = () => void;

class EventUpdater {
  private callbacks = new Map<GameEvent, Set<EventCallback>>();

  on(event: GameEvent, callback: EventCallback) {
    const callbacks = this.callbacks.get(event) ?? new Set<EventCallback>();
    callbacks.add(callback);
    this.callbacks.set(event, callbacks);
  }

  off(event: GameEvent, callback: EventCallback) {
    const callbacks = this.callbacks.get(event);
    if (!callbacks) return;

    callbacks.delete(callback);

    if (!callbacks.size) {
      this.callbacks.delete(event);
    } else {
      this.callbacks.set(event, callbacks);
    }
  }

  fire(event: GameEvent) {
    const callbacks = this.callbacks.get(event);
    if (!callbacks) return;
    callbacks.forEach((cb) => cb());
  }
}

export const eventUpdater = new EventUpdater();
