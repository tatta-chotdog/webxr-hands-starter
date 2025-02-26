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
    this.controller1 = this.renderer.xr.getController(0);
    this.controller2 = this.renderer.xr.getController(1);
    this.scene.add(this.controller1);
    this.scene.add(this.controller2);
  }

  _setupControllerGripsAndHands() {
    const controllerModelFactory = new XRControllerModelFactory();
    const handModelFactory = new XRHandModelFactory();

    this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
    this.controllerGrip1.add(
      controllerModelFactory.createControllerModel(this.controllerGrip1)
    );
    this.hand1 = this.renderer.xr.getHand(0);
    this.hand1.add(handModelFactory.createHandModel(this.hand1, "boxes"));
    this.scene.add(this.controllerGrip1);
    this.scene.add(this.hand1);

    this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
    this.controllerGrip2.add(
      controllerModelFactory.createControllerModel(this.controllerGrip2)
    );
    this.hand2 = this.renderer.xr.getHand(1);
    this.hand2.add(handModelFactory.createHandModel(this.hand2, "boxes"));
    this.scene.add(this.controllerGrip2);
    this.scene.add(this.hand2);
  }
}
