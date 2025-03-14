import * as THREE from 'three';

export const HexagonShader = {
    uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        borderColor: { value: new THREE.Color(0x000000) },
        borderWidth: { value: 0.005 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }

    `,
    fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;

        void main() {
            float borderSize = 0.05; // Thickness of the border
            float radius = 0.4; // Adjust depending on scale
            
            float dist = length(vUv - vec2(0.5));
            if (dist > radius - borderSize) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black border
            } else {
                gl_FragColor = vec4(color, 1.0);
            }
        }

    `,
    side: THREE.DoubleSide
};