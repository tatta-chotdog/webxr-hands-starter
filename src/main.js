import * as THREE from "three";
import { SceneManager } from "./utils/SceneManager.js";
import { ControllerManager } from "./utils/ControllerManager.js";

let sceneManager, controllerManager;

const createTrackedHand = () => ({
  mesh: new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  ),
  color: 0x00ff00,
  lastGesture: "",
});

const trackedHands = [createTrackedHand(), createTrackedHand()];

const init = () => {
  sceneManager = new SceneManager();
  sceneManager.initAR();

  controllerManager = new ControllerManager(
    sceneManager.renderer,
    sceneManager.scene
  );

  trackedHands[0].mesh.position.set(-1, 0, -4);
  sceneManager.scene.add(trackedHands[0].mesh);

  trackedHands[1].mesh.position.set(1, 0, -4);
  sceneManager.scene.add(trackedHands[1].mesh);
};

const render = (_, xrFrame) => {
  if (xrFrame) {
    const session = xrFrame.session;
    // const session = sceneManager.renderer.xr.getSession();

    const referenceSpace = sceneManager.renderer.xr.getReferenceSpace();

    for (const [index, inputSource] of session.inputSources.entries()) {
      if (inputSource.hand) {
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

          const threshold = 0.1;
          const gesture = distance > threshold ? "OPEN" : "CLOSE";

          if (gesture !== trackedHands[index].lastGesture) {
            trackedHands[index].color =
              gesture === "OPEN" ? 0x00ff00 : 0xff0000;
            trackedHands[index].mesh.material.color.set(
              trackedHands[index].color
            );
            trackedHands[index].lastGesture = gesture;
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
