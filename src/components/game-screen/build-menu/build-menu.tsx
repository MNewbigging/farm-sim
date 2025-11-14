import {
  BuildItem,
  BuildItemMode,
} from "../../../game/build-item-placers/build-tile-mode";
import { GameState } from "../../../game/game-state";
import { useEventUpdater } from "../../hooks/use-event-updater";
import "./build-menu.scss";

interface BuildMenuProps {
  gameState: GameState;
}

export function BuildMenu({ gameState }: BuildMenuProps) {
  useEventUpdater("mode-changed", "build-item");
  const { buildTileMode } = gameState;

  const visClass = buildTileMode.enabled ? "show" : "hide";
  const classes = ["build-menu", visClass].join(" ");

  const options = Object.values(BuildItem).map((item) => (
    <BuildItemOption
      key={`build-option-${item}`}
      buildTileMode={buildTileMode}
      item={item}
    />
  ));

  return <div className={classes}>{options}</div>;
}

interface BuildItemOptionProps {
  buildTileMode: BuildItemMode;
  item: BuildItem;
}

function BuildItemOption({ buildTileMode, item }: BuildItemOptionProps) {
  const itemActive = buildTileMode.placingBuildItem === item ? "active" : "";
  const itemClass = ["build-option", itemActive].join(" ");

  return (
    <div
      className={itemClass}
      onClick={() => buildTileMode.toggleBuildItem(item)}
    >
      {item}
    </div>
  );
}
