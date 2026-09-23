import * as THREE from 'three';
import { HARBOR_WAVES } from '../sim/waves';

/**
 * Stilisiertes Wasser (M0-Stand: Wellenbewegung + Farbverlauf + Fresnel).
 * Die Wellenparameter kommen aus sim/waves.ts – dieselben wie in der Physik.
 */
export function createWater(size = 150, segments = 96): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(size, size, segments, segments);
  geo.rotateX(-Math.PI / 2);

  const w = HARBOR_WAVES;
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDir: { value: w.map((x) => new THREE.Vector2(x.dirX, x.dirZ)) },
      uAmp: { value: w.map((x) => x.amplitude) },
      uLen: { value: w.map((x) => x.wavelength) },
      uSpeed: { value: w.map((x) => x.speed) },
      uDeep: { value: new THREE.Color('#0b4f6c') },
      uShallow: { value: new THREE.Color('#2bb3c0') },
      uSky: { value: new THREE.Color('#bfe6f5') },
    },
    vertexShader: /* glsl */ `
      #define N ${w.length}
      uniform float uTime;
      uniform vec2 uDir[N];
      uniform float uAmp[N];
      uniform float uLen[N];
      uniform float uSpeed[N];
      varying float vH;
      varying vec3 vNormal2;
      varying vec3 vWorld;
      const float PI = 3.141592653589793;
      void main() {
        vec3 p = position;
        float h = 0.0; float dx = 0.0; float dz = 0.0;
        for (int i = 0; i < N; i++) {
          float k = 2.0 * PI / uLen[i];
          float ph = k * (uDir[i].x * p.x + uDir[i].y * p.z - uSpeed[i] * uTime);
          h += uAmp[i] * sin(ph);
          dx += uAmp[i] * k * uDir[i].x * cos(ph);
          dz += uAmp[i] * k * uDir[i].y * cos(ph);
        }
        p.y += h;
        vH = h;
        vNormal2 = normalize(vec3(-dx, 1.0, -dz));
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uSky;
      varying float vH; varying vec3 vNormal2; varying vec3 vWorld;
      void main() {
        vec3 V = normalize(cameraPosition - vWorld);
        float fres = pow(1.0 - max(dot(V, vNormal2), 0.0), 3.0);
        vec3 col = mix(uDeep, uShallow, clamp(vH * 3.0 + 0.5, 0.0, 1.0));
        col = mix(col, uSky, fres * 0.6);
        // weiche Lichtkante (stilisiert)
        vec3 L = normalize(vec3(0.4, 1.0, 0.3));
        float spec = pow(max(dot(reflect(-L, vNormal2), V), 0.0), 60.0);
        col += spec * 0.5;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'water';
  return mesh;
}

export function updateWater(mesh: THREE.Mesh, time: number): void {
  (mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
}
