import * as THREE from 'three';
import { createWater, updateWater } from './water';
import { CRATE_SIZE, type CrateState } from '../sim/world';

/** Darstellung: liest nur den Simulationszustand, schreibt nie hinein (E-002). */
export class SceneView {
  readonly renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private water: THREE.Mesh;
  private crate: THREE.Mesh;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    // Pixeldichte begrenzen: Retina-Displays hätten sonst 4–9× so viele Pixel zu malen
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Himmel: einfacher Farbverlauf über Hintergrund + Nebel am Horizont
    this.scene.background = new THREE.Color('#9fd8f0');
    this.scene.fog = new THREE.Fog('#9fd8f0', 60, 180);

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
    this.camera.position.set(8, 5, 10);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(new THREE.HemisphereLight('#ffffff', '#1d6f8a', 1.2));
    const sun = new THREE.DirectionalLight('#fff4d6', 1.6);
    sun.position.set(30, 50, 20);
    this.scene.add(sun);

    this.water = createWater();
    this.scene.add(this.water);

    // Testkiste (Holz-Orange, stilisiert)
    this.crate = new THREE.Mesh(
      new THREE.BoxGeometry(CRATE_SIZE.x, CRATE_SIZE.y, CRATE_SIZE.z),
      new THREE.MeshStandardMaterial({ color: '#e8913a', roughness: 0.8, flatShading: true }),
    );
    this.scene.add(this.crate);

    // Kaimauer als erste Orientierung (Hafenbecken-Rand)
    const quay = new THREE.Mesh(
      new THREE.BoxGeometry(150, 3, 4),
      new THREE.MeshStandardMaterial({ color: '#d9c9a8', roughness: 1, flatShading: true }),
    );
    quay.position.set(0, 0.5, -30);
    this.scene.add(quay);

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize(): void {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  render(time: number, crate: CrateState): void {
    updateWater(this.water, time);
    this.crate.position.set(crate.x, crate.y, crate.z);
    this.crate.quaternion.set(crate.qx, crate.qy, crate.qz, crate.qw);
    // Kamera umkreist langsam die Kiste – zum Anschauen auf dem Gerät
    const a = time * 0.1;
    this.camera.position.set(Math.cos(a) * 12, 5, Math.sin(a) * 12);
    this.camera.lookAt(crate.x, 0, crate.z);
    this.renderer.render(this.scene, this.camera);
  }
}
