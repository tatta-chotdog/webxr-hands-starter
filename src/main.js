import { SceneManager } from "./utils/SceneManager.js";

let sceneManager;

init();
animate();

function init() {
  sceneManager = new SceneManager();
  sceneManager.initAR();
}

function animate() {
  sceneManager.renderer.setAnimationLoop(render);
}

function render(time, frame) {
  sceneManager.render(frame);
}
