import { GameState } from "../../game/game-state";
import { ModeName } from "../../game/mode-manager";
import { useEventUpdater } from "../hooks/use-event-updater";
import { BuildMenu } from "./build-menu/build-menu";
import "./game-screen.scss";

interface GameScreenProps {
  gameState: GameState;
}

export function GameScreen({ gameState }: GameScreenProps) {
  useEventUpdater("mode-changed");

  const buildActiveClass = gameState.buildTileMode.enabled ? "active" : "";
  const buildBtnClass = ["button", buildActiveClass].join(" ");

  const demolishActiveClass = gameState.demolishMode.enabled ? "active" : "";
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
            onClick={() => gameState.modeManager.toggleMode(ModeName.Build)}
          >
            B
          </div>

          <div
            className={demolishBtnClass}
            data-tooltip="Demolish"
            data-positionleft=""
            onClick={() => gameState.modeManager.toggleMode(ModeName.Demolish)}
          >
            D
          </div>
        </div>
      </div>
    </>
  );
}
