import { appState } from "../app-state/app-state";
import { LoadingScreen } from "./loading-screen/loading-screen";
import { useEventUpdater } from "./hooks/use-event-updater";
import { GameScreen } from "./game-screen/game-screen";

export function App() {
  useEventUpdater("game-started");

  const started = appState.started;

  if (!started) return <LoadingScreen />;

  const { gameState } = appState;

  if (gameState) return <GameScreen gameState={gameState} />;

  return null;
}
