import * as THREE from "three";

export default class GridInterface {
    constructor(hex) {
        this.hex = hex;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
        this.camera.position.y = 5;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.render();
    }
}