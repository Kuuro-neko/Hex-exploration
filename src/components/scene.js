import { Hex, CELL } from './hex.js';
import * as THREE from 'three';
import { HexagonShader } from './HexagonShader.js';

export class HexagonGrid {
    constructor(hex, scene, camera, renderer) {
        this.hex = hex;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        let rayon = 0.2;
        
        const hexagonGeometry = new THREE.CircleGeometry(rayon, 6);
        const hexagonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const hexagonMesh = new THREE.InstancedMesh(hexagonGeometry, hexagonMaterial, hex.size * hex.size);

        hexagonMesh.rotation.z = Math.PI / 2;

        this.grid = [];

        let distance = rayon - (Math.sin(1 * Math.PI / 3) * rayon);
        let index = 0;
        for (let i = 0; i < hex.size; i++) {
            for (let j = 0; j < hex.size; j++) {
                let y = (rayon - distance)*(2+j+2*i);
                let x = distance*2+(rayon - distance*2)*(1+2*j);

                const matrix = new THREE.Matrix4().makeTranslation(x, y, 0);
                hexagonMesh.setMatrixAt(index, matrix);
                this.grid.push({ i, j, matrix });
                index++;
            }
        }
        scene.add(hexagonMesh);
        this.hexagonMesh = hexagonMesh;

        this.aabb = new THREE.Box3();
        this.aabb.setFromObject(hexagonMesh);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.renderer.domElement.addEventListener('click', this.onclick.bind(this));
    }

    updateColors() {
        for (let i = 0; i < this.grid.length; i++) {
            const { i: hexI, j: hexJ } = this.grid[i];
            const player = this.hex.grid[hexI * this.hex.size + hexJ];
            const color = player === CELL.PLAYER ? 0xff0000 : player === CELL.IA ? 0x0000ff : 0xffffff;
            
            // color gradient to debug grid layout
            // //const color = new THREE.Color();
            // color.r = hexI / this.hex.size;
            // color.g = hexJ / this.hex.size;
            this.hexagonMesh.setColorAt(i, new THREE.Color(color));
            
        }
        this.hexagonMesh.instanceColor.needsUpdate = true;
    }

    onclick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects([this.hexagonMesh]);

        if (intersects.length > 0) {
            const { i, j } = this.grid[intersects[0].instanceId];
            console.log("click : ", i, j);
            this.hex.play(j, i);
        }
    }
}