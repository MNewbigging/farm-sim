import { appState } from "../../../app-state/app-state";
import { useEventUpdater } from "../../hooks/use-event-updater";
import "./build-menu.scss";

export function BuildMenu() {
  useEventUpdater("toggled-build-menu");

  const visClass = appState.showBuildMenu ? "show" : "hide";
  const classes = ["build-menu", visClass].join(" ");

  return (
    <div className={classes}>
      <div className="build-option">Path</div>
    </div>
  );
}
