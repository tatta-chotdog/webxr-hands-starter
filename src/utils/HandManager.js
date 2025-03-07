import * as THREE from "three";
import { Text } from "troika-three-text";
import { fingerConfig, gestureColors } from "../constants/HandConstants.js";

export class HandManager {
  constructor(scene) {
    this.scene = scene;
    this.hands = [this.createTrackedHand(), this.createTrackedHand()];

    // box
    this.hands[0].mesh.position.set(-1, 0, -4);
    this.scene.add(this.hands[0].mesh);

    this.hands[1].mesh.position.set(1, 0, -4);
    this.scene.add(this.hands[1].mesh);

    // Text
    this.hands.forEach((hand) => {
      hand.text.text = "NONE";
      hand.text.fontSize = 0.2;
      hand.text.maxWidth = 1;
      hand.text.anchorX = "center";
      hand.text.anchorY = "middle";
      hand.text.color = "white";
      hand.text.position.copy(hand.mesh.position);
      hand.text.position.z += 0.51;
      this.scene.add(hand.text);
    });
  }

  createTrackedHand() {
    return {
      mesh: new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: gestureColors.NONE })
      ),
      lastGesture: "NONE",
      text: new Text(),
    };
  }

  updateTrackedHands(inputSource, xrFrame, xrReferenceSpace, hand) {
    const bendFingers = [];
    const openFingers = [];
    const distances = [];

    fingerConfig.forEach(({ joint, bendThreshold, openThreshold }) => {
      const fingerJoint = inputSource.hand.get(joint);
      const pose = xrFrame.getJointPose(fingerJoint, xrReferenceSpace);

      const wristJoint = inputSource.hand.get("wrist");
      const wristPose = xrFrame.getJointPose(wristJoint, xrReferenceSpace);

      if (wristPose && pose) {
        const dx = wristPose.transform.position.x - pose.transform.position.x;
        const dy = wristPose.transform.position.y - pose.transform.position.y;
        const dz = wristPose.transform.position.z - pose.transform.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        distances.push(distance);
        bendFingers.push(distance < bendThreshold);
        openFingers.push(distance > openThreshold);
      }
    });

    if (openFingers.length && bendFingers.length) {
      const gesture = this._judgeGesture(openFingers, bendFingers);

      if (gesture !== hand.lastGesture) {
        hand.text.text = gesture;
        hand.text.sync();
        hand.mesh.material.color.set(gestureColors[gesture]);
        hand.lastGesture = gesture;
      }
    }
  }

  _judgeGesture(openFingers, bendFingers) {
    if (bendFingers.every((isBend) => isBend)) {
      return "ROCK";
    }
    if (openFingers.every((isOpen) => isOpen)) {
      return "PAPER";
    }
    if (
      bendFingers[0] &&
      openFingers[1] &&
      openFingers[2] &&
      bendFingers[3] &&
      bendFingers[4]
    ) {
      return "SCISSORS";
    }
    return "NONE";
  }
}
