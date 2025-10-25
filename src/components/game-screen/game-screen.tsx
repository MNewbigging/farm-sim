import { appState } from "../../app-state/app-state";
import { GameState } from "../../game/game-state";
import { BuildMenu } from "./build-menu/build-menu";
import "./game-screen.scss";

interface GameScreenProps {
  gameState: GameState;
}

export function GameScreen({ gameState }: GameScreenProps) {
  return (
    <>
      {/* These menus are absolutely positioned, outside normal flow */}
      <BuildMenu />

      <div className="game-screen">
        <div className="no-touch"></div>
        <div className="bottom-bar-area">
          <div
            className="button"
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
