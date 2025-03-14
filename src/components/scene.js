import { Hex, CELL } from './hex.js';
import * as THREE from 'three';

export class HexagonGrid {
    constructor(hex, scene) {
        this.hex = hex;
        this.scene = scene;
        // Create a grid of hexagons of size hex.size * hex.size
        this.grid = [];
        let rayon = 0.2;
        let distance = rayon - (Math.sin(1 * Math.PI / 3) * rayon);

        for (let i = 0; i < hex.size; i++) {
            for (let j = 0; j < hex.size; j++) {
                let x = (rayon - distance)*(2+j+2*i);
                let y = distance*2+(rayon - distance*2)*(1+2*j);
            
                let hexagon = new Hexagon(x, y, rayon, i, j);
                this.grid.push(hexagon);
            }
        }
    }
}

class Hexagon {
    constructor(x, y, size, i, j) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.mesh = null;
        this.i = i;
        this.j = j;
    }

    draw(player, scene) {
        this.mesh = new THREE.Mesh(
            new THREE.CircleGeometry(this.size, 6),
            new THREE.MeshBasicMaterial({ color: player === CELL.PLAYER ? 0xff0000 : player === CELL.IA ? 0x0000ff : 0xffffff })
        );
        this.mesh.rotation.z = Math.PI / 2;
        this.mesh.position.x = this.x;
        this.mesh.position.y = this.y;
        this.mesh.position.z = 0;
        scene.add(this.mesh);
    }
}