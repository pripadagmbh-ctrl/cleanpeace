/**
 * Kleine Messanzeige oben links: Bilder pro Sekunde, Draw Calls, Physikzeit.
 * Vergleich: der Drehzahlmesser im Auto – zeigt, ob der Motor (das Gerät) entspannt läuft.
 */
export class StatsOverlay {
  private el: HTMLDivElement;
  private frames = 0;
  private acc = 0;
  fps = 0;

  constructor(parent: HTMLElement, version: string) {
    this.el = document.createElement('div');
    this.el.id = 'stats';
    Object.assign(this.el.style, {
      position: 'fixed', top: 'calc(env(safe-area-inset-top) + 8px)', left: 'calc(env(safe-area-inset-left) + 8px)',
      padding: '6px 10px', background: 'rgba(0,30,50,0.6)', color: '#e6fbff', borderRadius: '8px',
      font: '12px/1.4 ui-monospace, Menlo, Consolas, monospace', pointerEvents: 'none', whiteSpace: 'pre',
    } as CSSStyleDeclaration);
    this.el.dataset.version = version;
    parent.appendChild(this.el);
  }

  update(dt: number, drawCalls: number, triangles: number, physicsMs: number): void {
    this.frames++;
    this.acc += dt;
    if (this.acc >= 0.5) {
      this.fps = Math.round(this.frames / this.acc);
      this.frames = 0;
      this.acc = 0;
      this.el.textContent =
        `Cleanpeace ${this.el.dataset.version}\n` +
        `FPS ${this.fps}\nDraw Calls ${drawCalls}\nDreiecke ${(triangles / 1000).toFixed(1)}k\nPhysik ${physicsMs.toFixed(2)} ms`;
    }
  }
}
