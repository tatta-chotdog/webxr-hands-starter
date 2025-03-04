import * as THREE from "three";
import { Text } from "troika-three-text";
import { SceneManager } from "./utils/SceneManager.js";
import { ControllerManager } from "./utils/ControllerManager.js";

let sceneManager, controllerManager;
let xrReferenceSpace;

const fingerConfig = [
  { joint: "thumb-tip", threshold: 0.13 },
  { joint: "index-finger-tip", threshold: 0.1 },
  { joint: "middle-finger-tip", threshold: 0.1 },
  { joint: "ring-finger-tip", threshold: 0.09 },
  { joint: "pinky-finger-tip", threshold: 0.09 },
];

const createTrackedHand = () => ({
  mesh: new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  ),
  color: 0x00ff00,
  lastGesture: "OPEN",
  text: new Text(),
});

const trackedHands = [createTrackedHand(), createTrackedHand()];

const init = () => {
  sceneManager = new SceneManager();
  sceneManager.initAR();

  controllerManager = new ControllerManager(
    sceneManager.renderer,
    sceneManager.scene
  );

  // box
  trackedHands[0].mesh.position.set(-1, 0, -4);
  sceneManager.scene.add(trackedHands[0].mesh);

  trackedHands[1].mesh.position.set(1, 0, -4);
  sceneManager.scene.add(trackedHands[1].mesh);

  // Text
  trackedHands[0].text.text = "";
  trackedHands[0].text.fontSize = 0.2;
  trackedHands[0].text.position.z = -3;
  trackedHands[0].text.position.x = -1.1;
  trackedHands[0].text.color = "blue";
  sceneManager.scene.add(trackedHands[0].text);

  trackedHands[1].text.text = "";
  trackedHands[1].text.fontSize = 0.2;
  trackedHands[1].text.position.z = -3;
  trackedHands[1].text.position.x = 0.6;
  trackedHands[1].text.color = "blue";
  sceneManager.scene.add(trackedHands[1].text);
};

const render = (_, xrFrame) => {
  if (xrFrame) {
    const session = xrFrame.session;
    if (!xrReferenceSpace) {
      xrReferenceSpace = sceneManager.renderer.xr.getReferenceSpace();
    }
    for (const [index, inputSource] of session.inputSources.entries()) {
      if (inputSource.hand) {
        updateTrackedHands(inputSource, xrFrame, xrReferenceSpace, index);
      }
    }
  }
  sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);
};

const updateTrackedHands = (inputSource, xrFrame, xrReferenceSpace, index) => {
  const isClosed = [];

  fingerConfig.forEach(({ joint, threshold }) => {
    const fingerJoint = inputSource.hand.get(joint);
    const pose = xrFrame.getJointPose(fingerJoint, xrReferenceSpace);

    const wristJoint = inputSource.hand.get("wrist");
    const wristPose = xrFrame.getJointPose(wristJoint, xrReferenceSpace);

    if (wristPose && pose) {
      const dx = wristPose.transform.position.x - pose.transform.position.x;
      const dy = wristPose.transform.position.y - pose.transform.position.y;
      const dz = wristPose.transform.position.z - pose.transform.position.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      isClosed.push(distance < threshold);
    }
  });

  if (isClosed.length > 0) {
    const isAllClosed = isClosed.every((isClosed) => isClosed);
    const state = isAllClosed ? "CLOSE" : "OPEN";
    trackedHands[index].text.text = state;
    trackedHands[index].text.sync();
    if (state !== trackedHands[index].lastGesture) {
      trackedHands[index].color = isAllClosed ? 0xff0000 : 0x00ff00;
      trackedHands[index].mesh.material.color.set(trackedHands[index].color);
      trackedHands[index].lastGesture = state;
    }
  }
};

const animate = () => {
  sceneManager.renderer.setAnimationLoop(render);
};

init();
animate();
