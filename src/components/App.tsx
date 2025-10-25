import { appState } from "../app-state/app-state";
import { LoadingScreen } from "./loading-screen/loading-screen";
import { useEventUpdater } from "./hooks/use-event-updater";
import { GameScreen } from "./game-screen/game-screen";

export function App() {
  useEventUpdater("game-started");

  const started = appState.started;

  if (!started) return <LoadingScreen />;

  if (started) return <GameScreen />;

  return null;
}
