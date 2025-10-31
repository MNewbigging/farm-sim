import { appState } from "../../../app-state/app-state";
import {
  BuildTile,
  BuildTileBehaviour,
} from "../../../game/build-tiles/build-tile-behaviour";
import { GameState } from "../../../game/game-state";
import { useEventUpdater } from "../../hooks/use-event-updater";
import "./build-menu.scss";

interface BuildMenuProps {
  gameState: GameState;
}

export function BuildMenu({ gameState }: BuildMenuProps) {
  useEventUpdater("toggled-build-menu", "build-item");

  const visClass = appState.showBuildMenu ? "show" : "hide";
  const classes = ["build-menu", visClass].join(" ");

  const { buildItemBehaviour } = gameState;
  const options = Object.values(BuildTile).map((item) => (
    <BuildItemOption
      key={`build-option-${item}`}
      buildItemBehaviour={buildItemBehaviour}
      item={item}
    />
  ));

  return <div className={classes}>{options}</div>;
}

interface BuildItemOptionProps {
  buildItemBehaviour: BuildTileBehaviour;
  item: BuildTile;
}

function BuildItemOption({ buildItemBehaviour, item }: BuildItemOptionProps) {
  const itemActive =
    buildItemBehaviour.placingBuildItem === item ? "active" : "";
  const itemClass = ["build-option", itemActive].join(" ");

  return (
    <div
      className={itemClass}
      onClick={() => buildItemBehaviour.toggleBuildItem(item)}
    >
      {item}
    </div>
  );
}
