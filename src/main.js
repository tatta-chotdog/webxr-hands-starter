import { SceneManager } from "./utils/SceneManager.js";
import { ControllerManager } from "./utils/ControllerManager.js";

let sceneManager, controllerManager;
let lastGesture = "";
let color = 0x00ffff;
let mesh;

const init = () => {
  sceneManager = new SceneManager();
  sceneManager.initAR();

  controllerManager = new ControllerManager(
    sceneManager.renderer,
    sceneManager.scene
  );
};

const render = (_, xrFrame) => {
  if (xrFrame) {
    const session = xrFrame.session;
    // const session = sceneManager.renderer.xr.getSession();

    const referenceSpace = sceneManager.renderer.xr.getReferenceSpace();

    for (const inputSource of session.inputSources) {
      if (inputSource.hand && inputSource.handedness === "right") {
        const wristJoint = inputSource.hand.get("wrist");
        const indexTipJoint = inputSource.hand.get("index-finger-tip");

        const wristPose = xrFrame.getJointPose(wristJoint, referenceSpace);
        const indexTipPose = xrFrame.getJointPose(
          indexTipJoint,
          referenceSpace
        );

        if (wristPose && indexTipPose) {
          const dx =
            wristPose.transform.position.x - indexTipPose.transform.position.x;
          const dy =
            wristPose.transform.position.y - indexTipPose.transform.position.y;
          const dz =
            wristPose.transform.position.z - indexTipPose.transform.position.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          const threshold = 0.15;
          const gesture = distance > threshold ? "OPEN" : "CLOSE";

          if (gesture !== lastGesture) {
            lastGesture = gesture;
            color = gesture === "OPEN" ? 0x00ff00 : 0xff0000;
            // mesh.material.color.set(color);
          }
        }
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
