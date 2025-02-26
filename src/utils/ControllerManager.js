import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory.js";

export class ControllerManager {
  constructor(renderer, scene) {
    this.renderer = renderer;
    this.scene = scene;
    this._initializeControllers();
  }

  _initializeControllers() {
    this._setupControllers();
    this._setupControllerGripsAndHands();
  }

  _setupControllers() {
    const rightController = this.renderer.xr.getController(0);
    const leftController = this.renderer.xr.getController(1);
    this.scene.add(rightController);
    this.scene.add(leftController);
  }

  _setupControllerGripsAndHands() {
    const controllerModelFactory = new XRControllerModelFactory();
    const handModelFactory = new XRHandModelFactory();

    const rightControllerGrip = this.renderer.xr.getControllerGrip(0);
    rightControllerGrip.add(
      controllerModelFactory.createControllerModel(rightControllerGrip)
    );
    const rightHand = this.renderer.xr.getHand(0);
    rightHand.add(handModelFactory.createHandModel(rightHand, "boxes"));
    this.scene.add(rightControllerGrip);
    this.scene.add(rightHand);

    const leftControllerGrip = this.renderer.xr.getControllerGrip(1);
    leftControllerGrip.add(
      controllerModelFactory.createControllerModel(leftControllerGrip)
    );
    const leftHand = this.renderer.xr.getHand(1);
    leftHand.add(handModelFactory.createHandModel(leftHand, "boxes"));
    this.scene.add(leftControllerGrip);
    this.scene.add(leftHand);
  }
}
