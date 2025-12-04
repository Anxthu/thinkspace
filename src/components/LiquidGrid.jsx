import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const GridShaderMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uZoom: { value: 1.0 },
        uOffset: { value: new THREE.Vector2(0, 0) }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        uniform float uZoom;
        uniform vec2 uOffset;
        varying vec2 vUv;

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                    -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            // Adjust UVs for zoom and pan
            vec2 uv = (vUv - 0.5) * uResolution / uZoom + 0.5;
            uv -= uOffset / uZoom / uResolution;

            // Grid Logic (Dots)
            float gridSize = 20.0; // Density
            vec2 cell = fract(uv * gridSize); // 0.0 to 1.0 inside each cell
            vec2 cellCenter = cell - 0.5;
            float distToDot = length(cellCenter);
            
            // Mouse Spotlight
            float mouseDist = distance(vUv, uMouse);
            float spotlight = smoothstep(0.4, 0.0, mouseDist);
            
            // Dot Size (Dynamic based on mouse)
            float dotRadius = 0.05 + (0.05 * spotlight); 
            float dot = 1.0 - smoothstep(dotRadius, dotRadius + 0.02, distToDot);

            // Color
            vec3 bgColor = vec3(0.05, 0.05, 0.05); // Soft dark grey
            vec3 dotColor = vec3(0.2); // Dim dots
            
            // Highlight dots near mouse
            dotColor += vec3(0.5) * spotlight;

            vec3 finalColor = mix(bgColor, dotColor, dot);

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
};

const GridPlane = ({ zoom, offset }) => {
    const meshRef = useRef();
    const { size, viewport, pointer } = useThree();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uZoom: { value: zoom },
        uOffset: { value: new THREE.Vector2(offset.x, offset.y) }
    }), []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
            // Map pointer (-1 to 1) to UV space (0 to 1)
            meshRef.current.material.uniforms.uMouse.value.set(
                (pointer.x + 1) / 2,
                (pointer.y + 1) / 2
            );
            meshRef.current.material.uniforms.uZoom.value = zoom;
            // Normalize offset based on screen size roughly
            meshRef.current.material.uniforms.uOffset.value.set(offset.x / size.width, -offset.y / size.height);
        }
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={GridShaderMaterial.vertexShader}
                fragmentShader={GridShaderMaterial.fragmentShader}
            />
        </mesh>
    );
};

const LiquidGrid = ({ zoom = 1, offset = { x: 0, y: 0 } }) => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <GridPlane zoom={zoom} offset={offset} />
            </Canvas>
        </div>
    );
};

export default LiquidGrid;
