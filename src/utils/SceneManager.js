import * as THREE from "three";
import { ARButton } from "three/examples/jsm/Addons.js";

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );
    this._initLights();
    this._initRenderer();

    window.addEventListener("resize", this._onWindowResize.bind(this), false);
  }

  _initLights() {
    const hemiLight = new THREE.HemisphereLight(0xbcbcbc, 0xa5a5a5, 3);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 6, 0);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.mapSize.set(4096, 4096);
    this.scene.add(dirLight);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.xr.enabled = true;
    document.body.appendChild(this.renderer.domElement);
  }

  initAR() {
    document.body.appendChild(
      ARButton.createButton(this.renderer, {
        requiredFeatures: ["hand-tracking"],
      })
    );
  }

  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
