import { SceneManager } from "./utils/SceneManager.js";
import { ControllerManager } from "./utils/ControllerManager.js";

let sceneManager, controllerManager;

const init = () => {
  sceneManager = new SceneManager();
  sceneManager.initAR();

  controllerManager = new ControllerManager(
    sceneManager.renderer,
    sceneManager.scene
  );
};

const render = () => {
  sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);
};

const animate = () => {
  sceneManager.renderer.setAnimationLoop(render);
};

init();
animate();
