import { GameState } from "../game/game-state";
import { AssetManager } from "../game/asset-manager";
import { eventUpdater } from "../events/event-updater";

class AppState {
  loaded = false;
  started = false;

  showBuildMenu = false;
  demolishing = false;

  gameState?: GameState;

  private assetManager = new AssetManager();

  constructor() {
    // Give loading UI time to mount
    setTimeout(() => this.loadGame(), 10);
  }

  startGame = () => {
    this.gameState = new GameState(this.assetManager);
    this.started = true;
    eventUpdater.fire("game-started");
  };

  toggleBuildMenu = () => {
    this.showBuildMenu = !this.showBuildMenu;

    // Hiding menu - stop placing stuff
    if (!this.showBuildMenu) {
      this.gameState?.buildItemBehaviour.stopPlacingBuildItem();
    }

    // Stop demolishing
    if (this.demolishing) {
      this.demolishing = false;
      eventUpdater.fire("toggle-demolish");
    }

    eventUpdater.fire("toggled-build-menu");
  };

  toggleDemolish = () => {
    this.demolishing = !this.demolishing;

    // If now demolishing, stop other things
    if (this.showBuildMenu) {
      this.showBuildMenu = false;
      this.gameState?.buildItemBehaviour.stopPlacingBuildItem();
      eventUpdater.fire("toggled-build-menu");
    }

    eventUpdater.fire("toggle-demolish");
  };

  private async loadGame() {
    this.assetManager.load().then(this.onLoad);
  }

  private onLoad = () => {
    this.loaded = true;
    eventUpdater.fire("game-loaded");
  };
}

export const appState = new AppState();
