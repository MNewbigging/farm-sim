/**
 * App state probably shouldn't control state of build/demolish buttons, it should
 * be derived from internal game state.
 *
 * Building and demolishing are mutually exlusive modes; could be part of FSM.
 */

import { eventUpdater } from "../events/event-updater";

export enum ModeName {
  Build,
  Demolish,
}

export interface Mode {
  name: ModeName;
  enabled: boolean;
  enable(): void;
  disable(): void;
}

export class ModeManager {
  currentMode?: Mode;

  private modes = new Map<ModeName, Mode>();

  constructor(...modes: Mode[]) {
    modes.forEach((mode) => this.modes.set(mode.name, mode));
  }

  changeMode(modeName: ModeName) {
    if (this.currentMode?.name === modeName) return;

    const newMode = this.modes.get(modeName);

    this.currentMode?.disable();
    this.currentMode = newMode;
    this.currentMode?.enable();

    eventUpdater.fire("mode-changed");
  }

  toggleMode(modeName: ModeName) {
    if (this.currentMode?.name === modeName) {
      this.currentMode.disable();
      this.currentMode = undefined;
      eventUpdater.fire("mode-changed");
    } else {
      this.changeMode(modeName);
    }
  }
}
