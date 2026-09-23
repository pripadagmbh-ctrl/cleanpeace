import { SimWorld } from './sim/world';
import { SceneView } from './render/scene';
import { StatsOverlay } from './ui/stats';

const VERSION = '0.0.1-m0';

async function boot() {
  const app = document.getElementById('app')!;
  const sim = await SimWorld.create();
  const view = new SceneView(app);
  const stats = new StatsOverlay(document.body, VERSION);

  // Feste Physik-Schritte (1/60 s), unabhängig von der Bildrate –
  // wie ein Metronom: die Welt tickt gleichmäßig, egal wie schnell gemalt wird.
  const STEP = 1 / 60;
  let acc = 0;
  let last = performance.now();

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    acc += dt;
    let steps = 0;
    while (acc >= STEP && steps < 4) {
      sim.step();
      acc -= STEP;
      steps++;
    }
    view.render(sim.time, sim.crateState());
    const info = view.renderer.info.render;
    stats.update(dt, info.calls, info.triangles, sim.lastStepMs);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  (window as unknown as { __cleanpeace: unknown }).__cleanpeace = { sim, stats, version: VERSION };
}

boot().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML('beforeend',
    `<pre style="color:#fff;padding:16px">Start fehlgeschlagen:\n${String(err)}</pre>`);
});
