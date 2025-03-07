import { SceneManager } from "./utils/SceneManager.js";
import { ControllerManager } from "./utils/ControllerManager.js";
import { HandManager } from "./utils/HandManager.js";

let sceneManager, controllerManager, handManager;
let xrReferenceSpace;

const init = () => {
  sceneManager = new SceneManager();
  sceneManager.initAR();

  controllerManager = new ControllerManager(
    sceneManager.renderer,
    sceneManager.scene
  );

  handManager = new HandManager(sceneManager.scene);
};

const render = (_, xrFrame) => {
  if (xrFrame) {
    const session = xrFrame.session;
    if (!xrReferenceSpace) {
      xrReferenceSpace = sceneManager.renderer.xr.getReferenceSpace();
    }
    for (const [index, inputSource] of session.inputSources.entries()) {
      if (inputSource.hand) {
        handManager.updateTrackedHands(
          inputSource,
          xrFrame,
          xrReferenceSpace,
          handManager.hands[index]
        );
      }
    }
  }
  sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);
};

const animate = () => {
  sceneManager.renderer.setAnimationLoop(render);
};

init();
animate();
