import './style.css'

import * as THREE from 'three';
import { HexagonGrid } from './components/scene';
import { Hex } from './components/hex';
import { createCamera } from './components/Camera';
import { setupControls } from './components/Controls';

const scene = new THREE.Scene();
const camera = createCamera();
setupControls(camera, document.body);

let hex = new Hex(10);
let grid = new HexagonGrid(hex, scene);


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

console.log("hex", hex);

function animate() {
    requestAnimationFrame( animate );

    grid.updateColors();

    renderer.render( scene, camera );
}

animate();