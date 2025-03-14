import './style.css'

import * as THREE from 'three';
import { HexagonGrid } from './components/scene';
import { Hex } from './components/hex';
import { createCamera } from './components/Camera';

const scene = new THREE.Scene();
const camera = createCamera();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let size = 10;

let hex = new Hex(size);
let grid = new HexagonGrid(hex, scene, camera, renderer);

adjustCameraToFitGrid();

console.log("hex", hex);

function animate() {
    requestAnimationFrame( animate );

    grid.updateColors();

    renderer.render( scene, camera );
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    adjustCameraToFitGrid();
});

// Function to adjust camera to fit the grid
function adjustCameraToFitGrid() {
    const gridWidth = grid.aabb.max.x - grid.aabb.min.x;
    const gridHeight = grid.aabb.max.y - grid.aabb.min.y;
    const aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio > 1) {
        camera.fov = 75;
    } else {
        camera.fov = 75 / aspectRatio;
    }

    // Calculate the distance needed to fit the grid within the view
    const maxGridDimension = Math.max(gridWidth, gridHeight);
    const cameraDistance = 0.75 * maxGridDimension / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));

    // Center camera on grid
    camera.position.x = (grid.aabb.max.x + grid.aabb.min.x) / 2;
    camera.position.y = (grid.aabb.max.y + grid.aabb.min.y) / 2;
    camera.position.z = cameraDistance;

    camera.updateProjectionMatrix();
}
