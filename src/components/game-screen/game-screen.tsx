import { appState } from "../../app-state/app-state";
import { GameState } from "../../game/game-state";
import { useEventUpdater } from "../hooks/use-event-updater";
import { BuildMenu } from "./build-menu/build-menu";
import "./game-screen.scss";

interface GameScreenProps {
  gameState: GameState;
}

export function GameScreen({ gameState }: GameScreenProps) {
  useEventUpdater("toggled-build-menu", "toggle-demolish");

  const buildActiveClass = appState.showBuildMenu ? "active" : "";
  const buildBtnClass = ["button", buildActiveClass].join(" ");

  const demolishActiveClass = appState.demolishing ? "active" : "";
  const demolishBtnClass = ["button", demolishActiveClass].join(" ");

  return (
    <>
      {/* These menus are absolutely positioned, outside normal flow */}
      <BuildMenu gameState={gameState} />

      {/* Back to normal flow: */}
      <div className="game-screen">
        <div className="no-touch"></div>
        <div className="bottom-bar-area">
          <div></div>

          <div
            className={buildBtnClass}
            data-tooltip="Build"
            onClick={appState.toggleBuildMenu}
          >
            B
          </div>

          <div
            className={demolishBtnClass}
            data-tooltip="Demolish"
            data-positionleft=""
            onClick={appState.toggleDemolish}
          >
            D
          </div>
        </div>
      </div>
    </>
  );
}
