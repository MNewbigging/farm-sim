import { appState } from "../../../app-state/app-state";
import { BuildItem, GameState } from "../../../game/game-state";
import { useEventUpdater } from "../../hooks/use-event-updater";
import "./build-menu.scss";

interface BuildMenuProps {
  gameState: GameState;
}

export function BuildMenu({ gameState }: BuildMenuProps) {
  useEventUpdater("toggled-build-menu", "build-item");

  const visClass = appState.showBuildMenu ? "show" : "hide";
  const classes = ["build-menu", visClass].join(" ");

  const pathActive =
    gameState.placingBuildItem === BuildItem.Path ? "active" : "";
  const pathClass = ["build-option", pathActive].join(" ");

  return (
    <div className={classes}>
      <div
        className={pathClass}
        onClick={() => gameState.toggleBuildItem(BuildItem.Path)}
      >
        Path
      </div>
    </div>
  );
}
