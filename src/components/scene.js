import { Hex, CELL } from './hex.js';
import * as THREE from 'three';

export class HexagonGrid {
    constructor(hex, scene) {
        this.hex = hex;
        this.scene = scene;
        
        const hexagonGeometry = new THREE.CircleGeometry(1, 6);
        const hexagonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const hexagonMesh = new THREE.InstancedMesh(hexagonGeometry, hexagonMaterial, hex.size * hex.size);

        hexagonMesh.rotation.z = Math.PI / 2;

        this.grid = [];
        let rayon = 0.2;
        let distance = rayon - (Math.sin(1 * Math.PI / 3) * rayon);

        let index = 0;
        for (let i = 0; i < hex.size; i++) {
            for (let j = 0; j < hex.size; j++) {
                let x = (rayon - distance)*(2+j+2*i);
                let y = distance*2+(rayon - distance*2)*(1+2*j);

                const matrix = new THREE.Matrix4().makeTranslation(x, y, 0);
                hexagonMesh.setMatrixAt(index, matrix);
                this.grid.push({ i, j, matrix });
                index++;
            }
        }
        scene.add(hexagonMesh);
        this.hexagonMesh = hexagonMesh;
    }

    updateColors() {
        for (let i = 0; i < this.grid.length; i++) {
            const { i: hexI, j: hexJ } = this.grid[i];
            const player = this.hex.grid[hexI * this.hex.size + hexJ];
            //const color = player === CELL.PLAYER ? 0xff0000 : player === CELL.IA ? 0x0000ff : 0xffffff;
            
            // color gradient with red based on hexI and hex.size, and green based on hexJ and hex.size
            const color = new THREE.Color();
            color.r = hexI / this.hex.size;
            color.g = hexJ / this.hex.size;
            this.hexagonMesh.setColorAt(i, new THREE.Color(color));
        }
        this.hexagonMesh.instanceColor.needsUpdate = true;
    }
}