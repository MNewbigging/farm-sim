import { appState } from "../../app-state/app-state";
import { GameState } from "../../game/game-state";
import { useEventUpdater } from "../hooks/use-event-updater";
import { BuildMenu } from "./build-menu/build-menu";
import "./game-screen.scss";

interface GameScreenProps {
  gameState: GameState;
}

export function GameScreen({ gameState }: GameScreenProps) {
  useEventUpdater("toggled-build-menu");

  const buildActiveClass = appState.showBuildMenu ? "active" : "";

  const buildBtnClasses = ["button", buildActiveClass].join(" ");

  return (
    <>
      {/* These menus are absolutely positioned, outside normal flow */}
      <BuildMenu />

      {/* Back to normal flow: */}
      <div className="game-screen">
        <div className="no-touch"></div>
        <div className="bottom-bar-area">
          <div
            className={buildBtnClasses}
            data-tooltip="Build"
            onClick={appState.toggleBuildMenu}
          >
            B
          </div>
        </div>
      </div>
    </>
  );
}
