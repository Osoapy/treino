import { loadWorkoutData } from '../lib/workout-data.js';

class AtlasFooter extends HTMLElement {
  async connectedCallback() {
    const { brand } = await loadWorkoutData();
    this.innerHTML = `<footer><div class="brand footer-brand"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 32"><path d="M10.2 22.4a8.2 8.2 0 0 1 .5-16.4A11.2 11.2 0 0 1 31 9a6.8 6.8 0 0 1-.2 13.5H10.2Z"/><path d="m13 25-2 4m10-4-2 4m10-4-2 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.5"/></svg></span><span>${brand.name}</span></div><p>base forte, mente limpa</p><a href="#inicio">VOLTAR AO TOPO ↑</a></footer>`;
  }
}

customElements.define('atlas-footer', AtlasFooter);

